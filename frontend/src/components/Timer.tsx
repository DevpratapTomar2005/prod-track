import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Square } from "lucide-react";

type TimerUnit = "minutes" | "hours";
export type TimerStateValue = "idle" | "running" | "paused" | "stopped";

export interface TimerRecord {
  state: TimerStateValue;
  elapsedSec: number;
  startedAt: string | null;
}

interface TimerProps {
  value: number;
  unit: TimerUnit;
  label?: string;
  timerRecord?: TimerRecord;
  onStateChange?: (record: TimerRecord) => void;
  onStop?: (result: TimerResult) => void;
}

export interface TimerResult {
  totalElapsedSeconds: number;
  allocatedSeconds: number;
  overrunSeconds: number;
  completedWithinTime: boolean;
  startedAt: string;
  endedAt: string;
  formattedElapsed: string;
  formattedAllocated: string;
  formattedOverrun: string;
}

function toSeconds(value: number, unit: TimerUnit): number {
  return unit === "hours"
    ? Math.round(value * 3600)
    : Math.round(value * 60);
}

function formatDuration(totalSeconds: number): string {
  const abs = Math.abs(totalSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const Timer: React.FC<TimerProps> = ({
  value,
  unit,
  label,
  timerRecord,
  onStateChange,
  onStop,
}) => {
  const allocatedSec = toSeconds(value, unit);
  const isControlled = timerRecord !== undefined && onStateChange !== undefined;

  const [internalElapsed, setInternalElapsed] = useState(0);
  const [internalState, setInternalState] = useState<TimerStateValue>("idle");
  const [internalStartedAt, setInternalStartedAt] = useState<string | null>(null);
  const [clockFontSize, setClockFontSize] = useState(64);

  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRecordRef = useRef(timerRecord);
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    timerRecordRef.current = timerRecord;
    onStateChangeRef.current = onStateChange;
  });

  const state = isControlled ? timerRecord!.state : internalState;
  const elapsedSec = isControlled ? timerRecord!.elapsedSec : internalElapsed;
  const startedAt = isControlled ? timerRecord!.startedAt : internalStartedAt;

  const setRecord = useCallback(
    (patch: Partial<TimerRecord>) => {
      if (isControlled) {
        onStateChange!({ ...timerRecord!, ...patch });
      } else {
        if (patch.state !== undefined) setInternalState(patch.state);
        if (patch.elapsedSec !== undefined) setInternalElapsed(patch.elapsedSec);
        if (patch.startedAt !== undefined) setInternalStartedAt(patch.startedAt);
      }
    },
    [isControlled, timerRecord, onStateChange]
  );

  const remaining = allocatedSec - elapsedSec;
  const isOverrun = remaining < 0;
  const progress = Math.min((elapsedSec / allocatedSec) * 100, 100);
  const displaySeconds = isOverrun ? Math.abs(remaining) : remaining;

  useEffect(() => {
    if (!containerRef.current) return;
    const updateFontSize = () => {
      const w = containerRef.current?.offsetWidth ?? 300;
      const fitted = (w * 0.88) / (8 * 0.62);
      setClockFontSize(Math.min(96, Math.max(24, Math.floor(fitted))));
    };
    updateFontSize();
    const ro = new ResizeObserver(updateFontSize);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTick(), [clearTick]);

  useEffect(() => {
    if (state === "running") {
      clearTick();
      intervalRef.current = setInterval(() => {
        if (isControlled) {
          const latest = timerRecordRef.current!;
          onStateChangeRef.current!({
            ...latest,
            elapsedSec: latest.elapsedSec + 1,
          });
        } else {
          setInternalElapsed((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearTick();
    }
  }, [state]);

  const handleStartPause = () => {
    if (state === "idle") {
      const now = formatTime(new Date());
      setRecord({ state: "running", startedAt: now });
    } else if (state === "running") {
      setRecord({ state: "paused" });
    } else if (state === "paused") {
      setRecord({ state: "running" });
    }
  };

  const handleStop = () => {
    clearTick();
    const endedAt = new Date();
    const overrun = Math.max(0, elapsedSec - allocatedSec);
    const res: TimerResult = {
      totalElapsedSeconds: elapsedSec,
      allocatedSeconds: allocatedSec,
      overrunSeconds: overrun,
      completedWithinTime: elapsedSec <= allocatedSec,
      startedAt: startedAt ?? "—",
      endedAt: formatTime(endedAt),
      formattedElapsed: formatDuration(elapsedSec),
      formattedAllocated: formatDuration(allocatedSec),
      formattedOverrun: overrun > 0 ? formatDuration(overrun) : "00:00:00",
    };
    setRecord({ state: "stopped" });
    onStop?.(res);
  };

  const startPauseLabel =
    state === "idle" ? "Start" : state === "running" ? "Pause" : "Resume";

  const startPauseIcon =
    state === "running" ? (
      <Pause className="h-4 w-4 mr-1 fill-white shrink-0" />
    ) : (
      <Play className="h-4 w-4 mr-1 fill-white shrink-0" />
    );

  return (
    <div ref={containerRef} className="w-full bg-white font-inter flex flex-col items-center">
      <div className="flex items-center justify-between mb-3 w-full gap-2 min-w-0">
        <span className="text-[12px] font-semibold text-neutral-500 tracking-widest font-roboto border-b-3 border-cyan-100 truncate">
          {label ?? "Choose a task and start the timer"}
        </span>
        <span className="text-[11px] text-gray-400 font-poppins whitespace-nowrap shrink-0">
          {value}
          {unit === "hours" ? "h" : "m"} → {formatDuration(allocatedSec)}
        </span>
      </div>

      <div
        className={`font-inter mt-3 font-semibold tracking-widest text-center py-4 w-full transition-colors duration-300 whitespace-nowrap ${
          isOverrun && state !== "stopped"
            ? "text-red-500"
            : "text-neutral-800"
        }`}
        style={{ fontSize: `${clockFontSize}px`, lineHeight: 1.1 }}
      >
        {state === "idle"
          ? formatDuration(allocatedSec)
          : formatDuration(displaySeconds)}
      </div>

      <div className="h-5 flex items-center justify-center mb-2 w-full overflow-hidden">
        {isOverrun && state !== "stopped" && (
          <span className="text-[11px] font-poppins font-semibold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded truncate max-w-full">
            +{formatDuration(Math.abs(remaining))} over allocated time
          </span>
        )}
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOverrun
              ? "bg-linear-to-r from-red-50 via-red-300 to-red-400"
              : "bg-linear-to-r from-gray-50 via-cyan-300 to-cyan-400"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {state !== "stopped" ? (
        <div className="flex items-center gap-2 w-fit">
          <button
            onClick={handleStartPause}
           
            className="flex items-center justify-center bg-cyan-400 hover:bg-cyan-500 text-white text-sm font-semibold font-poppins px-4 h-9 rounded-lg transition-all duration-200 ease-in-out cursor-pointer flex-1 shadow"
          >
            {startPauseIcon}
            <span className="truncate">{startPauseLabel}</span>
          </button>
          <button
            onClick={handleStop}
            disabled={state === "idle"}
            className="flex items-center justify-center border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold font-poppins px-4 h-9 rounded-lg transition-all duration-200 ease-in-out cursor-pointer flex-1 disabled:opacity-30 disabled:cursor-not-allowed shadow"
          >
            <Square className="h-3.5 w-3.5 mr-1 shrink-0" />
            <span className="truncate">Stop</span>
          </button>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center border border-gray-200 text-green-600 bg-slate-50 text-sm font-semibold font-poppins px-4 h-9 rounded-lg shadow">
          Completed
        </div>
      )}
    </div>
  );
};

export default Timer;