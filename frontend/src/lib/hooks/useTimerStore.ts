import { useState, useEffect, useCallback } from "react";

export type TimerState = "idle" | "running" | "paused" | "stopped";

export interface TaskTimerRecord {
  state: TimerState;
  elapsedSec: number;
  startedAt: string | null;
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
});

function readStore(): StoreShape {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { activeTaskId: null, timers: {} };
    return JSON.parse(raw) as StoreShape;
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
      commit((prev) => ({
        ...prev,
        timers: {
          ...prev.timers,
          [id]: { ...(prev.timers[id] ?? defaultRecord()), ...patch },
        },
      }));
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