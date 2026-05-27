import React, { useState } from "react";
import { createPortal } from "react-dom";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseTaskDate(dateStr: string, timeStr?: string): Date {
  const cleaned = dateStr.replace(",", "");
  const base = new Date(cleaned);
  if (timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      const period = match[3].toUpperCase();
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      base.setHours(h, m, 0, 0);
    }
  }
  return base;
}

function parseHours(duration: string, unit: string): number {
  const val = parseFloat(duration);
  if (unit.toLowerCase().startsWith("hour")) return val;
  if (unit.toLowerCase().startsWith("day")) return val * 8;
  if (unit.toLowerCase().startsWith("min")) return val / 60;
  return val;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

type Task = {
  id: number;
  task: string;
  status: string;
  project: string;
  estDuration: string;
  estDurationUnit: string;
  startDate: string;
  dueDate: string;
  startTime: string;
  subtasks: Array<{ id: number; subtask: string }>;
};

const STATUS_CFG: Record<string, {
  dot: string; border: string; glow: string;
  lineColor: string; label: string;
  badgeBg: string; badgeText: string;
  icon: string;
}> = {
  Done:          { dot: "#22c55e", border: "#16a34a", glow: "0 0 0 5px #bbf7d050,0 0 16px #22c55e66", lineColor: "#22c55e", label: "Done",        badgeBg: "#dcfce7", badgeText: "#15803d", icon: "✓" },
  "In Progress": { dot: "#00d3f2", border: "#0891b2", glow: "0 0 0 5px #a5f3fc50,0 0 16px #00d3f288", lineColor: "#00d3f2", label: "In Progress", badgeBg: "#cffafe", badgeText: "#0e7490", icon: "●" },
  "To Do":       { dot: "#cbd5e1", border: "#94a3b8", glow: "none",                                   lineColor: "#e2e8f0", label: "Planned",     badgeBg: "#f1f5f9", badgeText: "#64748b", icon: "○" },
  Skipped:       { dot: "#fca5a5", border: "#ef4444", glow: "0 0 0 5px #fecaca40",                    lineColor: "#ef4444", label: "Skipped",     badgeBg: "#fee2e2", badgeText: "#dc2626", icon: "✕" },
};

type Entry = {
  task: Task;
  actualStart: Date;
  plannedEnd: Date;
  actualEnd: Date;
  overrunHours: number;
};

// ─── Tooltip Portal ────────────────────────────────────────────────────────────
const TOOLTIP_W = 224;
const TOOLTIP_GAP = 16;

type TooltipData =
  | { kind: "task"; entry: Entry }
  | { kind: "gap"; entry: Entry; gapStart: Date; gapEnd: Date };

const TooltipPortal = ({ data, x, y }: { data: TooltipData; x: number; y: number }) => {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const estimatedH = data.kind === "gap" ? 110 : data.entry.overrunHours > 0 ? 175 : 155;
  let left = x + TOOLTIP_GAP;
  if (left + TOOLTIP_W > vw - 8) left = x - TOOLTIP_W - TOOLTIP_GAP;
  let top = y - estimatedH / 2;
  if (top < 8) top = 8;
  if (top + estimatedH > vh - 8) top = vh - estimatedH - 8;

  let card: React.ReactNode;

  if (data.kind === "gap") {
    const { gapStart, gapEnd } = data;
    const gapH = ((gapEnd.getTime() - gapStart.getTime()) / 3600000).toFixed(1);
    card = (
      <div className="bg-gray-950 border border-red-800/50 rounded-xl px-3.5 py-3 shadow-2xl w-52" style={{ fontFamily: "Poppins, sans-serif" }}>
        <p className="text-[10px] font-semibold text-red-400 mb-2">⚠ Unscheduled Gap</p>
        <div className="space-y-1 text-[10px] text-gray-400">
          <div className="flex justify-between"><span>From</span><span className="text-gray-200">{fmtDate(gapStart)} {fmtTime(gapStart)}</span></div>
          <div className="flex justify-between"><span>To</span><span className="text-gray-200">{fmtDate(gapEnd)} {fmtTime(gapEnd)}</span></div>
          <div className="flex justify-between border-t border-gray-800 pt-1 mt-1"><span>Idle</span><span className="text-red-400 font-semibold">{gapH}h</span></div>
        </div>
      </div>
    );
  } else {
    const { entry } = data;
    const cfg = STATUS_CFG[entry.task.status] ?? STATUS_CFG["To Do"];
    card = (
      <div className="bg-gray-950 border border-gray-700/60 rounded-xl px-3.5 py-3 shadow-2xl w-56" style={{ fontFamily: "Poppins, sans-serif" }}>
        <p className="text-[11px] font-semibold truncate mb-0.5" style={{ color: cfg.dot }}>{entry.task.task}</p>
        <p className="text-[9px] text-gray-500 mb-2">#TASK-{entry.task.id}</p>
        <div className="space-y-1 text-[10px] text-gray-400">
          <div className="flex justify-between gap-3"><span>Start</span><span className="text-gray-200">{fmtDate(entry.actualStart)} {fmtTime(entry.actualStart)}</span></div>
          <div className="flex justify-between gap-3"><span>Planned end</span><span className="text-gray-200">{fmtDate(entry.plannedEnd)} {fmtTime(entry.plannedEnd)}</span></div>
          {entry.task.status !== "To Do" && (
            <div className="flex justify-between gap-3">
              <span>{entry.task.status === "In Progress" ? "Current" : "Actual end"}</span>
              <span className={entry.overrunHours > 0 ? "text-orange-400" : "text-green-400"}>{fmtDate(entry.actualEnd)} {fmtTime(entry.actualEnd)}</span>
            </div>
          )}
          <div className="flex justify-between gap-3"><span>Duration</span><span className="text-gray-200">{parseHours(entry.task.estDuration, entry.task.estDurationUnit).toFixed(1)}h planned</span></div>
          {entry.overrunHours > 0 && (
            <div className="flex justify-between gap-3 border-t border-gray-800 pt-1 mt-1">
              <span>Overrun</span><span className="text-orange-400 font-semibold">+{entry.overrunHours.toFixed(1)}h</span>
            </div>
          )}
        </div>
        <div className="mt-2 pt-1.5 border-t border-gray-800">
          <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: cfg.badgeBg + "22", color: cfg.dot, border: `1px solid ${cfg.dot}44` }}>
            {cfg.label}
          </span>
        </div>
      </div>
    );
  }

  return createPortal(
    <div className="pointer-events-none" style={{ position: "fixed", top, left, zIndex: 99999 }}>
      {card}
    </div>,
    document.body
  );
};

// ─── Connector bar ─────────────────────────────────────────────────────────────
const Connector = ({
  filled, gradient, glow, dashed,
  gap, gapLabel,
  onEnter, onLeave, onMove, showGapTooltip, entry, mouseX, mouseY,
}: {
  filled: boolean;
  gradient?: string;
  glow?: string;
  dashed?: boolean;
  gap?: { start: Date; end: Date; hours: number } | null;
  gapLabel?: string;
  onEnter?: () => void;
  onLeave?: () => void;
  onMove?: (e: React.MouseEvent) => void;
  showGapTooltip?: boolean;
  entry?: Entry;
  mouseX: number;
  mouseY: number;
}) => (
  <div
    className="relative flex-1"
    style={{ height: 20, minWidth: 32 }}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    onMouseMove={onMove}
  >
    {/* Grey base track */}
    <div className="absolute rounded-full" style={{ height: 5, top: "50%", transform: "translateY(-50%)", left: 0, right: 0, background: "#e2e8f0" }} />
    {/* Coloured fill */}
    {filled && (
      <div className="absolute rounded-full" style={{ height: 5, top: "50%", transform: "translateY(-50%)", left: 0, width: "100%", background: gradient ?? "#e2e8f0", boxShadow: glow }} />
    )}
    {/* Dashed gap overlay */}
    {dashed && (
      <div className="absolute" style={{ height: 5, top: "50%", transform: "translateY(-50%)", left: "30%", right: "30%", borderTop: "3px dashed #ef4444aa" }} />
    )}
    {/* Gap pill label */}
    {gap && (
      <div
        className="absolute left-1/2 -translate-x-1/2 -translate-y-full bg-red-50 border border-red-200 rounded-full px-2 py-0.5 text-[8px] text-red-500 font-semibold whitespace-nowrap shadow transition-opacity"
        style={{ fontFamily: "Poppins, sans-serif", top: "50%", opacity: showGapTooltip ? 1 : 0 }}
      >
        {gap.hours.toFixed(1)}h gap
      </div>
    )}
    {/* Gap tooltip portal */}
    {showGapTooltip && gap && entry && (
      <TooltipPortal data={{ kind: "gap", entry, gapStart: gap.start, gapEnd: gap.end }} x={mouseX} y={mouseY} />
    )}
  </div>
);

// ─── Diamond milestone node ────────────────────────────────────────────────────
const MilestoneNode = ({
  labelAbove, badgeText, badgeColor, badgeBg,
  title, subtitle, date,
  active, color, borderColor, glow,
  icon,
}: {
  labelAbove: boolean;
  badgeText: string; badgeColor: string; badgeBg: string;
  title: string; subtitle?: string; date: string;
  active: boolean; color: string; borderColor: string; glow: string;
  icon: string;
}) => (
  <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 44, zIndex: 10 }}>
    {/* Label */}
    {labelAbove ? (
      <div className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 flex flex-col items-center text-center" style={{ width: 110 }}>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif", background: badgeBg, color: badgeColor }}>
          {badgeText}
        </span>
        <p className="text-[9px] text-gray-700 font-semibold leading-tight mb-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{title}</p>
        {subtitle && <p className="text-[8px] text-gray-500 mb-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{subtitle}</p>}
        <p className="text-[8px] text-gray-400" style={{ fontFamily: "Poppins, sans-serif" }}>{date}</p>
        <div className="w-px bg-gray-200 mt-1" style={{ height: 10 }} />
      </div>
    ) : (
      <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 flex flex-col items-center text-center" style={{ width: 110 }}>
        <div className="w-px bg-gray-200 mb-1" style={{ height: 10 }} />
        <p className="text-[8px] text-gray-400 mb-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{date}</p>
        <p className="text-[9px] text-gray-700 font-semibold leading-tight mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{title}</p>
        {subtitle && <p className="text-[8px] text-gray-500 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{subtitle}</p>}
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold" style={{ fontFamily: "Poppins, sans-serif", background: badgeBg, color: badgeColor }}>
          {badgeText}
        </span>
      </div>
    )}
    {/* Diamond shape */}
    <div
      className="flex items-center justify-center"
      style={{
        width: 36, height: 36,
        background: active ? color : "#fafafa",
        border: `2px solid ${borderColor}`,
        borderRadius: 4,
        transform: "rotate(45deg)",
        boxShadow: active ? glow : "0 1px 4px rgba(0,0,0,0.08)",
        flexShrink: 0,
      }}
    >
      <span style={{ transform: "rotate(-45deg)", fontSize: 13, color: active ? "white" : borderColor, fontWeight: 700, lineHeight: 1, display: "block" }}>
        {icon}
      </span>
    </div>
  </div>
);

// ─── Main export ───────────────────────────────────────────────────────────────
export const ProjectTimeline = ({ tasks }: { tasks: Task[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const now = new Date();

  const entries: Entry[] = tasks
    .map((t) => {
      const actualStart = parseTaskDate(t.startDate, t.startTime);
      const durationHours = parseHours(t.estDuration, t.estDurationUnit);
      const plannedEnd = new Date(actualStart.getTime() + durationHours * 3600000);
      let actualEnd: Date;
      if (t.status === "Done") {
        actualEnd = parseTaskDate(t.dueDate, t.startTime);
        if (actualEnd.getTime() <= actualStart.getTime()) actualEnd = plannedEnd;
      } else if (t.status === "In Progress") {
        actualEnd = now;
      } else {
        actualEnd = plannedEnd;
      }
      const overrunHours = t.status !== "To Do" && actualEnd > plannedEnd
        ? (actualEnd.getTime() - plannedEnd.getTime()) / 3600000 : 0;
      return { task: t, actualStart, plannedEnd, actualEnd, overrunHours };
    })
    .sort((a, b) => a.actualStart.getTime() - b.actualStart.getTime());

  if (!entries.length) return null;

  const gaps = entries.map((e, i) => {
    if (i === entries.length - 1) return null;
    const currEnd = e.actualEnd > e.plannedEnd ? e.actualEnd : e.plannedEnd;
    const nextStart = entries[i + 1].actualStart;
    if (nextStart.getTime() > currEnd.getTime() + 60000) {
      return { start: currEnd, end: nextStart, hours: (nextStart.getTime() - currEnd.getTime()) / 3600000 };
    }
    return null;
  });

  const isReached = (e: Entry) => e.task.status === "Done" || e.task.status === "In Progress";
  const anyReached = entries.some(isReached);
  const allDone = entries.every(e => e.task.status === "Done");
  const lastDone = entries[entries.length - 1].task.status === "Done";

  const isScrollable = entries.length > 8;

  const trackMove = (e: React.MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

  return (
    <div className="w-[90%] max-w-[1050px] mx-auto mt-6 mb-10 bg-white border border-gray-200 rounded-md">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 p-4">
        <div>
          <h2 className="text-[15px] font-bold text-gray-800 font-inter">Project Timeline</h2>
          <p className="text-[10px] text-gray-400 mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>Task execution track · Hover nodes for details</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-gray-500" style={{ fontFamily: "Poppins, sans-serif" }}>
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border" style={{ background: v.dot, borderColor: v.border }} />
              {v.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5" style={{ borderTop: "2px dashed #f87171" }} /> Gap
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-400" /> Overrun
          </span>
        </div>
      </div>

      {/* ── Scrollable shell ── */}
      <div className="bg-white py-3 px-2">
        <div
          className={isScrollable ? "tl-scroll" : "px-10"}
          style={isScrollable ? {
            overflowX: "auto", overflowY: "hidden",
            paddingTop: 100, paddingBottom: 100,
            paddingLeft: 40, paddingRight: 40,
            marginTop: -100, marginBottom: -100,
            cursor: "grab",
          } : {}}
          onMouseDown={isScrollable ? (e) => {
            const el = e.currentTarget;
            const startX = e.pageX - el.offsetLeft;
            const scrollLeft = el.scrollLeft;
            el.style.cursor = "grabbing";
            const onMove = (ev: MouseEvent) => { el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX); };
            const onUp = () => { el.style.cursor = "grab"; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          } : undefined}
        >

          {/* ── Track area ── */}
          <div className="relative" style={{ paddingTop: 80, paddingBottom: 80, minWidth: isScrollable ? (entries.length + 2) * 120 : undefined }}>

            {/* ── Row of nodes ── */}
            <div className="flex items-center w-full">

              {/* PROJECT START node — label ABOVE */}
              <MilestoneNode
                labelAbove={true}
                badgeText="Start"
                badgeColor="#15803d"
                badgeBg="#f0fdf4"
                title="Project Begin"
                date={fmtDate(entries[0].actualStart)}
                active={anyReached}
                color="linear-gradient(135deg,#4ade80,#22c55e)"
                borderColor="#22c55e"
                glow="0 0 0 4px #bbf7d050,0 0 14px #22c55e55"
                icon="▶"
              />

              {/* Connector: Start → first task */}
              <Connector
                filled={anyReached}
                gradient="#22c55e"
                glow="0 0 8px #22c55e55"
                mouseX={mousePos.x} mouseY={mousePos.y}
              />

              {/* ── Task nodes ── */}
              {entries.map((entry, i) => {
                const cfg = STATUS_CFG[entry.task.status] ?? STATUS_CFG["To Do"];
                const isLast = i === entries.length - 1;
                const gap = gaps[i];
                // Start node is index 0 in visual row (above), so tasks alternate: 0→below, 1→above, 2→below…
                const labelAbove = i % 2 !== 0;
                const isActive = entry.task.status === "In Progress";

                return (
                  <React.Fragment key={entry.task.id}>
                    {/* Node */}
                    <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 44, zIndex: 10 }}>

                      {/* Label ABOVE */}
                      {labelAbove && (
                        <div className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 flex flex-col items-center text-center" style={{ width: 100 }}>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif", background: cfg.badgeBg, color: cfg.badgeText }}>{cfg.label}</span>
                          <p className="text-[9px] text-gray-700 font-semibold leading-tight mb-0.5" style={{ fontFamily: "Poppins, sans-serif" }} title={entry.task.task}>
                            {entry.task.task.length > 16 ? entry.task.task.slice(0, 16) + "…" : entry.task.task}
                          </p>
                          <p className="text-[8px] text-gray-400" style={{ fontFamily: "Poppins, sans-serif" }}>{fmtTime(entry.actualStart)}</p>
                          {entry.overrunHours > 0 && <p className="text-[8px] text-orange-500 font-semibold mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>+{entry.overrunHours.toFixed(1)}h over</p>}
                          <div className="w-px bg-gray-200 mt-1" style={{ height: 10 }} />
                        </div>
                      )}

                      {/* Label BELOW */}
                      {!labelAbove && (
                        <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 flex flex-col items-center text-center" style={{ width: 100 }}>
                          <div className="w-px bg-gray-200 mb-1" style={{ height: 10 }} />
                          <p className="text-[8px] text-gray-400 mb-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{fmtTime(entry.actualStart)}</p>
                          <p className="text-[9px] text-gray-700 font-semibold leading-tight mb-1" style={{ fontFamily: "Poppins, sans-serif" }} title={entry.task.task}>
                            {entry.task.task.length > 16 ? entry.task.task.slice(0, 16) + "…" : entry.task.task}
                          </p>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold" style={{ fontFamily: "Poppins, sans-serif", background: cfg.badgeBg, color: cfg.badgeText }}>{cfg.label}</span>
                          {entry.overrunHours > 0 && <p className="text-[8px] text-orange-500 font-semibold mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>+{entry.overrunHours.toFixed(1)}h over</p>}
                        </div>
                      )}

                      {/* Circle dot */}
                      <div
                        className="relative cursor-pointer transition-all duration-200"
                        style={{ transform: hovered === i ? "scale(1.2)" : "scale(1)" }}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        onMouseMove={trackMove}
                      >
                        {isActive && (
                          <span className="absolute rounded-full" style={{ inset: -6, background: cfg.dot + "30", animation: "tlPing 1.4s cubic-bezier(0,0,0.2,1) infinite" }} />
                        )}
                        <div
                          className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-[14px] transition-all duration-200"
                          style={{
                            background: entry.task.status === "To Do" ? "#f8fafc" : cfg.dot,
                            borderColor: cfg.border,
                            color: entry.task.status === "To Do" ? "#94a3b8" : "white",
                            fontWeight: 700,
                            boxShadow: hovered === i ? cfg.glow : isActive ? cfg.glow : "0 1px 4px rgba(0,0,0,0.08)",
                          }}
                        >
                          {cfg.icon}
                        </div>
                      </div>

                      {/* Task tooltip */}
                      {hovered === i && (
                        <TooltipPortal data={{ kind: "task", entry }} x={mousePos.x} y={mousePos.y} />
                      )}
                    </div>

                    {/* Connector to next task */}
                    {!isLast && (
                      <Connector
                        filled={isReached(entry)}
                        gradient={gap
                          ? `linear-gradient(90deg, ${cfg.lineColor} 60%, #ef444488 100%)`
                          : `linear-gradient(90deg, ${cfg.lineColor}, ${STATUS_CFG[entries[i + 1]?.task.status]?.lineColor ?? "#e2e8f0"})`}
                        glow={`0 0 8px ${cfg.lineColor}55`}
                        dashed={!!gap}
                        gap={gap}
                        onEnter={() => gap && setHoveredGap(i)}
                        onLeave={() => setHoveredGap(null)}
                        onMove={trackMove}
                        showGapTooltip={hoveredGap === i}
                        entry={entry}
                        mouseX={mousePos.x}
                        mouseY={mousePos.y}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Connector: last task → End */}
              <Connector
                filled={lastDone}
                gradient="linear-gradient(90deg,#f59e0b,#d97706)"
                glow="0 0 8px #f59e0b55"
                mouseX={mousePos.x} mouseY={mousePos.y}
              />

              {/* PROJECT END node — label BELOW */}
              <MilestoneNode
                labelAbove={false}
                badgeText={allDone ? "Complete" : "Pending"}
                badgeColor={allDone ? "#a16207" : "#64748b"}
                badgeBg={allDone ? "#fef9c3" : "#f1f5f9"}
                title="Project End"
                date={fmtDate(entries[entries.length - 1].plannedEnd)}
                active={allDone}
                color="linear-gradient(135deg,#fbbf24,#f59e0b)"
                borderColor={allDone ? "#d97706" : "#cbd5e1"}
                glow="0 0 0 4px #fef08a50,0 0 14px #f59e0b55"
                icon="⚑"
              />

            </div>{/* end flex row */}

            {/* Date labels below track */}
            <div className="absolute -bottom-6 flex items-start w-full" style={{ left: 0 }}>
              <div className="flex-shrink-0" style={{ width: 44 }} />
              <div className="flex-1" />
              {entries.map((entry, i) => (
                <React.Fragment key={entry.task.id}>
                  <div className="flex-shrink-0 flex flex-col items-center" style={{ width: 44 }}>
                    <div className="w-px h-2 bg-gray-200" />
                    <span className="text-[8px] text-gray-400 mt-0.5 whitespace-nowrap" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {fmtDate(entry.actualStart)}
                    </span>
                  </div>
                  {i < entries.length - 1 && <div className="flex-1" />}
                </React.Fragment>
              ))}
              <div className="flex-1" />
              <div className="flex-shrink-0" style={{ width: 44 }} />
            </div>

          </div>{/* end track area */}
        </div>{/* end scroll shell */}
      </div>

      {/* ── Summary strip ── */}
      <div className="mt-7 pt-4 border-t border-gray-100 flex items-center gap-6 text-[10px] text-gray-500 p-4" style={{ fontFamily: "Poppins, sans-serif" }}>
        <span>
          <span className="font-semibold text-gray-700">{entries.filter(e => e.task.status === "Done").length}</span> of{" "}
          <span className="font-semibold text-gray-700">{entries.length}</span> tasks complete
        </span>
        {entries.some(e => e.overrunHours > 0) && (
          <span className="text-orange-500">
            ⚠ {entries.filter(e => e.overrunHours > 0).length} task{entries.filter(e => e.overrunHours > 0).length > 1 ? "s" : ""} overran schedule
          </span>
        )}
        {gaps.some(Boolean) && (
          <span className="text-red-500">
            {gaps.filter(Boolean).length} unscheduled gap{gaps.filter(Boolean).length > 1 ? "s" : ""} detected
          </span>
        )}
        <span className="ml-auto text-gray-400">
          {fmtDate(entries[0].actualStart)} – {fmtDate(entries[entries.length - 1].plannedEnd)}
        </span>
      </div>

      <style>{`
        @keyframes tlPing {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2);   opacity: 0;   }
        }
        .tl-scroll::-webkit-scrollbar { height: 4px; }
        .tl-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 99px; }
        .tl-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .tl-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default ProjectTimeline;