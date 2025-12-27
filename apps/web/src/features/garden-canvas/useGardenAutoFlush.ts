import { useEffect, useRef, useState } from "react";
import { useGardenStore } from "./store";

type AutoFlushTimes = {
  autoFlushAt: number | null;
  forceFlushAt: number | null;
};

const FIVE_SECONDS = 5_000;
const THIRTY_SECONDS = 30_000;
const MAX_FLUSHABLE_ERROR_REFRESH = 10;

export function useGardenAutoFlush(): AutoFlushTimes {
  const flushEvents = useGardenStore((s) => s.flushEvents);
  const loadGarden = useGardenStore((s) => s.loadGarden);
  const status = useGardenStore((s) => s.status);
  const pendingObjects = useGardenStore((s) => s.pendingEventsByObjectId);

  const [times, setTimes] = useState<AutoFlushTimes>({
    autoFlushAt: null,
    forceFlushAt: null,
  });

  const autoTimer = useRef<number | null>(null);
  const forceTimer = useRef<number | null>(null);

  const shouldRun =
    status === "flushable" && Object.values(pendingObjects).length > 0;

  // AUTO FLUSH EFFECT
  useEffect(() => {
    const clearAll = () => {
      if (autoTimer.current !== null) {
        clearTimeout(autoTimer.current);
        autoTimer.current = null;
      }
      if (forceTimer.current !== null) {
        clearTimeout(forceTimer.current);
        forceTimer.current = null;
      }
      setTimes({ autoFlushAt: null, forceFlushAt: null });
    };

    if (!shouldRun) {
      clearAll();
      return;
    }

    if (autoTimer.current !== null) {
      clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }

    const autoAt = Date.now() + FIVE_SECONDS;
    setTimes((prev) => ({ ...prev, autoFlushAt: autoAt }));
    autoTimer.current = window.setTimeout(() => {
      autoTimer.current = null;
      setTimes((prev) => ({ ...prev, autoFlushAt: null }));
      flushEvents();
    }, FIVE_SECONDS);

    if (forceTimer.current === null) {
      const forceAt = Date.now() + THIRTY_SECONDS;
      setTimes((prev) => ({ ...prev, forceFlushAt: forceAt }));
      forceTimer.current = window.setTimeout(() => {
        forceTimer.current = null;
        setTimes((prev) => ({ ...prev, forceFlushAt: null }));
        flushEvents();
      }, THIRTY_SECONDS);
    }

    return () => {};
  }, [flushEvents, pendingObjects, shouldRun]);

  // FLUSHABLE ERROR CLEANUP EFFECT
  const refreshCountRef = useRef(0);
  const refreshInFlightRef = useRef(false);

  useEffect(() => {
    if (status !== "flushableError") {
      refreshCountRef.current = 0;
      refreshInFlightRef.current = false;
      return;
    }

    if (refreshInFlightRef.current) return;
    if (refreshCountRef.current >= MAX_FLUSHABLE_ERROR_REFRESH) return;

    refreshInFlightRef.current = true;
    refreshCountRef.current += 1;

    (async () => {
      try {
        await loadGarden();
      } finally {
        refreshInFlightRef.current = false;
      }
    })();
  }, [loadGarden, status]);
  return times;
}
