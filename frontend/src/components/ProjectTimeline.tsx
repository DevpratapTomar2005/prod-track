import React, { useState } from "react";

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
  Done:        { dot: "#22c55e", border: "#16a34a", glow: "0 0 0 5px #bbf7d050,0 0 16px #22c55e66", lineColor: "#22c55e", label: "Done",        badgeBg: "#dcfce7", badgeText: "#15803d", icon: "✓" },
  "In Progress":{ dot: "#00d3f2", border: "#0891b2", glow: "0 0 0 5px #a5f3fc50,0 0 16px #00d3f288", lineColor: "#00d3f2", label: "In Progress", badgeBg: "#cffafe", badgeText: "#0e7490", icon: "●" },
  "To Do":     { dot: "#cbd5e1", border: "#94a3b8", glow: "none",                                   lineColor: "#e2e8f0", label: "Planned",     badgeBg: "#f1f5f9", badgeText: "#64748b", icon: "○" },
  Skipped:     { dot: "#fca5a5", border: "#ef4444", glow: "0 0 0 5px #fecaca40",                    lineColor: "#ef4444", label: "Skipped",     badgeBg: "#fee2e2", badgeText: "#dc2626", icon: "✕" },
};

type Entry = {
  task: Task;
  actualStart: Date;
  plannedEnd: Date;
  actualEnd: Date;
  overrunHours: number;
};

type TooltipInfo = { entry: Entry; isGap?: boolean; gapStart?: Date; gapEnd?: Date };

const TooltipCard = ({ info }: { info: TooltipInfo }) => {
  const { entry, isGap, gapStart, gapEnd } = info;
  const cfg = STATUS_CFG[entry.task.status] ?? STATUS_CFG["To Do"];

  if (isGap && gapStart && gapEnd) {
    const gapH = ((gapEnd.getTime() - gapStart.getTime()) / 3600000).toFixed(1);
    return (
      <div className="bg-gray-950 border border-red-800/50 rounded-xl px-3.5 py-3 shadow-2xl w-52" style={{ fontFamily: "Poppins, sans-serif" }}>
        <p className="text-[10px] font-semibold text-red-400 mb-2">⚠ Unscheduled Gap</p>
        <div className="space-y-1 text-[10px] text-gray-400">
          <div className="flex justify-between"><span>From</span><span className="text-gray-200">{fmtDate(gapStart)} {fmtTime(gapStart)}</span></div>
          <div className="flex justify-between"><span>To</span><span className="text-gray-200">{fmtDate(gapEnd)} {fmtTime(gapEnd)}</span></div>
          <div className="flex justify-between border-t border-gray-800 pt-1 mt-1"><span>Idle</span><span className="text-red-400 font-semibold">{gapH}h</span></div>
        </div>
      </div>
    );
  }

  return (
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
};

export const ProjectTimeline = ({ tasks }: { tasks: Task[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);
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

  // Gaps
  const gaps: ({ start: Date; end: Date; hours: number } | null)[] = entries.map((e, i) => {
    if (i === entries.length - 1) return null;
    const currEnd = e.actualEnd > e.plannedEnd ? e.actualEnd : e.plannedEnd;
    const nextStart = entries[i + 1].actualStart;
    if (nextStart.getTime() > currEnd.getTime() + 60000) {
      return { start: currEnd, end: nextStart, hours: (nextStart.getTime() - currEnd.getTime()) / 3600000 };
    }
    return null;
  });

  const isReached = (e: Entry) => e.task.status === "Done" || e.task.status === "In Progress";

  return (
    <div className="w-[90%] max-w-[1050px] mx-auto mt-6 mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-100">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#00b4d8" strokeWidth="1.5"/>
                <line x1="5" y1="2.5" x2="5" y2="5" stroke="#00b4d8" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="5" y1="5" x2="7" y2="6.2" stroke="#00b4d8" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </span>
            Project Timeline
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>Task execution track · Hover nodes for details</p>
          {entries.length > 8 && (
            <p className="text-[10px] text-cyan-500 mt-0.5 flex items-center gap-1" style={{ fontFamily: "Poppins, sans-serif" }}>
              <span>←</span> Scroll to view all {entries.length} tasks <span>→</span>
            </p>
          )}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-gray-500" style={{ fontFamily: "Poppins, sans-serif" }}>
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border" style={{ background: v.dot, borderColor: v.border }} />
              {v.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5" style={{ borderTop: "2px dashed #f87171" }} />
            Gap
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-400" />
            Overrun
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm" style={{ padding: "40px 48px 32px" }}>

        {/* ── Scrollable outer shell (clips X, allows Y via tall padding) ── */}
        <div
          className={entries.length > 8 ? "tl-scroll" : ""}
          style={
            entries.length > 8
              ? { overflowX: "auto", overflowY: "hidden", paddingTop: 100, paddingBottom: 100, marginTop: -100, marginBottom: -100, cursor: "grab" }
              : {}
          }
          onMouseDown={(e) => {
            if (entries.length <= 8) return;
            const el = e.currentTarget;
            const startX = e.pageX - el.offsetLeft;
            const scrollLeft = el.scrollLeft;
            el.style.cursor = "grabbing";
            const onMove = (ev: MouseEvent) => {
              const x = ev.pageX - el.offsetLeft;
              el.scrollLeft = scrollLeft - (x - startX);
            };
            const onUp = () => {
              el.style.cursor = "grab";
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        >

        {/* ── Track area ── */}
        <div
          className="relative"
          style={{
            paddingTop: 80,
            paddingBottom: 80,
            minWidth: entries.length > 8 ? entries.length * 120 : undefined,
          }}
        >

          {/* Horizontal flex of nodes + connectors */}
          <div className="flex items-center w-full">
            {entries.map((entry, i) => {
              const cfg = STATUS_CFG[entry.task.status] ?? STATUS_CFG["To Do"];
              const isLast = i === entries.length - 1;
              const gap = gaps[i];
              const labelAbove = i % 2 === 0;
              const isActive = entry.task.status === "In Progress";

              return (
                <React.Fragment key={entry.task.id}>
                  {/* ── NODE ── */}
                  <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 44, zIndex: 10 }}>

                    {/* Label ABOVE */}
                    {labelAbove && (
                      <div className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 flex flex-col items-center text-center" style={{ width: 100 }}>
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold mb-1"
                          style={{ fontFamily: "Poppins, sans-serif", background: cfg.badgeBg, color: cfg.badgeText }}
                        >
                          {cfg.label}
                        </span>
                        <p className="text-[9px] text-gray-700 font-semibold leading-tight mb-0.5" style={{ fontFamily: "Poppins, sans-serif" }} title={entry.task.task}>
                          {entry.task.task.length > 16 ? entry.task.task.slice(0, 16) + "…" : entry.task.task}
                        </p>
                        <p className="text-[8px] text-gray-400" style={{ fontFamily: "Poppins, sans-serif" }}>{fmtTime(entry.actualStart)}</p>
                        {entry.overrunHours > 0 && (
                          <p className="text-[8px] text-orange-500 font-semibold mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>+{entry.overrunHours.toFixed(1)}h over</p>
                        )}
                        {/* Vertical connector stem */}
                        <div className="w-px bg-gray-200 mt-1" style={{ height: 10 }} />
                      </div>
                    )}

                    {/* Label BELOW */}
                    {!labelAbove && (
                      <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 flex flex-col items-center text-center" style={{ width: 100 }}>
                        {/* Vertical connector stem */}
                        <div className="w-px bg-gray-200 mb-1" style={{ height: 10 }} />
                        <p className="text-[8px] text-gray-400 mb-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{fmtTime(entry.actualStart)}</p>
                        <p className="text-[9px] text-gray-700 font-semibold leading-tight mb-1" style={{ fontFamily: "Poppins, sans-serif" }} title={entry.task.task}>
                          {entry.task.task.length > 16 ? entry.task.task.slice(0, 16) + "…" : entry.task.task}
                        </p>
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold"
                          style={{ fontFamily: "Poppins, sans-serif", background: cfg.badgeBg, color: cfg.badgeText }}
                        >
                          {cfg.label}
                        </span>
                        {entry.overrunHours > 0 && (
                          <p className="text-[8px] text-orange-500 font-semibold mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>+{entry.overrunHours.toFixed(1)}h over</p>
                        )}
                      </div>
                    )}

                    {/* Dot */}
                    <div
                      className="relative cursor-pointer transition-all duration-200"
                      style={{ transform: hovered === i ? "scale(1.2)" : "scale(1)" }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* Ping ring for In Progress */}
                      {isActive && (
                        <span
                          className="absolute rounded-full"
                          style={{
                            inset: -6, background: cfg.dot + "30",
                            animation: "tlPing 1.4s cubic-bezier(0,0,0.2,1) infinite",
                          }}
                        />
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

                    {/* Hover tooltip */}
                    {hovered === i && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          zIndex: 9999,
                          [labelAbove ? "top" : "bottom"]: "calc(100% + 12px)",
                          left: "50%",
                          transform: i >= entries.length - 2 ? "translateX(-80%)" : "translateX(-50%)",
                        }}
                      >
                        <TooltipCard info={{ entry }} />
                      </div>
                    )}
                  </div>

                  {/* ── CONNECTOR ── */}
                  {!isLast && (
                    <div
                      className="relative flex-1"
                      style={{ height: 20, minWidth: 32 }}
                      onMouseEnter={() => gap && setHoveredGap(i)}
                      onMouseLeave={() => setHoveredGap(null)}
                    >
                      {/* Base grey track */}
                      <div
                        className="absolute rounded-full"
                        style={{ height: 5, top: "50%", transform: "translateY(-50%)", left: 0, right: 0, background: "#e2e8f0" }}
                      />

                      {/* Filled/progress track */}
                      {isReached(entry) && (
                        <div
                          className="absolute rounded-full"
                          style={{
                            height: 5, top: "50%", transform: "translateY(-50%)", left: 0,
                            width: isReached(entries[i + 1]) ? "100%" : entry.task.status === "In Progress" ? "55%" : "100%",
                            background: gap
                              ? `linear-gradient(90deg, ${cfg.lineColor} 60%, #ef444488 100%)`
                              : `linear-gradient(90deg, ${cfg.lineColor}, ${STATUS_CFG[entries[i + 1]?.task.status]?.lineColor ?? "#e2e8f0"})`,
                            boxShadow: `0 0 8px ${cfg.lineColor}55`,
                            transition: "width 0.6s ease",
                          }}
                        />
                      )}

                      {/* Gap: dashed red overlay */}
                      {gap && (
                        <>
                          <div
                            className="absolute"
                            style={{
                              height: 5, top: "50%", transform: "translateY(-50%)",
                              left: "30%", right: "30%",
                              borderTop: "3px dashed #ef4444aa",
                            }}
                          />
                          {/* Gap pill */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 -translate-y-full bg-red-50 border border-red-200 rounded-full px-2 py-0.5 text-[8px] text-red-500 font-semibold whitespace-nowrap shadow transition-opacity"
                            style={{ fontFamily: "Poppins, sans-serif", top: "50%", opacity: hoveredGap === i ? 1 : 0 }}
                          >
                            {gap.hours.toFixed(1)}h gap
                          </div>

                          {/* Gap tooltip */}
                          {hoveredGap === i && (
                            <div
                              className="absolute pointer-events-none"
                              style={{ zIndex: 9999, bottom: "calc(100% + 16px)", left: "50%", transform: "translateX(-50%)" }}
                            >
                              <TooltipCard info={{ entry, isGap: true, gapStart: gap.start, gapEnd: gap.end }} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── Date labels at bottom ── */}
          <div className="absolute bottom-0 flex items-start w-full" style={{ left: 0 }}>
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
          </div>
        </div>

        </div>{/* end scrollable wrapper */}

        {/* ── Summary strip ── */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-[10px] text-gray-500" style={{ fontFamily: "Poppins, sans-serif" }}>
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
            {entries[0] && fmtDate(entries[0].actualStart)} →{" "}
            {entries[entries.length - 1] && fmtDate(entries[entries.length - 1].plannedEnd)}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes tlPing {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
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