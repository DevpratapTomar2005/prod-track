import { useState, useEffect, useCallback } from "react";

export type TimerState = "idle" | "running" | "paused" | "stopped";

export interface TaskTimerRecord {
  state: TimerState;
  elapsedSec: number;
  startedAt: string | null;
  runningsince: string | null;
}

interface StoreShape {
  activeTaskId: number | null;
  timers: Record<number, TaskTimerRecord>;
}

const STORE_KEY = "task_timer_store";

const defaultRecord = (): TaskTimerRecord => ({
  state: "idle",
  elapsedSec: 0,
  startedAt: null,
  runningsince: null,
});

function reconstructElapsed(record: TaskTimerRecord): TaskTimerRecord {
  if (record.state === "running" && record.runningsince) {
    const secondsSinceLastRun = Math.floor(
      (Date.now() - new Date(record.runningsince).getTime()) / 1000
    );
    return { ...record, elapsedSec: record.elapsedSec + secondsSinceLastRun };
  }
  return record;
}

function readStore(): StoreShape {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { activeTaskId: null, timers: {} };
    const parsed = JSON.parse(raw) as StoreShape;
    const timers: StoreShape["timers"] = {};
    for (const [key, record] of Object.entries(parsed.timers)) {
      timers[Number(key)] = reconstructElapsed(record);
    }
    return { ...parsed, timers };
  } catch {
    return { activeTaskId: null, timers: {} };
  }
}

function writeStore(s: StoreShape) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}

export function useTimerStore() {
  const [store, setStore] = useState<StoreShape>(readStore);

  const commit = useCallback((updater: (prev: StoreShape) => StoreShape) => {
    setStore((prev) => {
      const next = updater(prev);
      writeStore(next);
      return next;
    });
  }, []);

  const getTaskTimer = useCallback(
    (id: number): TaskTimerRecord =>
      store.timers[id] ?? defaultRecord(),
    [store]
  );

  const patchTaskTimer = useCallback(
    (id: number, patch: Partial<TaskTimerRecord>) => {
      commit((prev) => {
        const existing = prev.timers[id] ?? defaultRecord();
        const merged = { ...existing, ...patch };

        if (patch.state === "running" && existing.state !== "running") {
          merged.runningsince = new Date().toISOString();
        }

        if (patch.state === "paused" || patch.state === "stopped") {
          merged.runningsince = null;
        }

        return {
          ...prev,
          timers: { ...prev.timers, [id]: merged },
        };
      });
    },
    [commit]
  );

  const activateTask = useCallback(
    (newId: number) => {
      commit((prev) => {
        const timers = { ...prev.timers };

        if (prev.activeTaskId !== null && prev.activeTaskId !== newId) {
          // TODO (backend): before removing from local state, call your API here to
          // pause the previous task in the DB, e.g.:
          //   await api.pauseTask(prev.activeTaskId)
          // Only remove from localStorage once the API call succeeds.
          delete timers[prev.activeTaskId];
        }

        timers[newId] = timers[newId] ?? defaultRecord();

        return { activeTaskId: newId, timers };
      });
    },
    [commit]
  );

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORE_KEY) {
        setStore(readStore());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return {
    activeTaskId: store.activeTaskId,
    getTaskTimer,
    patchTaskTimer,
    activateTask,
  };
}