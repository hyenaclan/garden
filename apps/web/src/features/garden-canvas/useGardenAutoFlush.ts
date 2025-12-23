import { useEffect, useRef, useState } from "react";
import { useGardenStore } from "./store";

type AutoFlushTimes = {
  autoFlushAt: number | null;
  forceFlushAt: number | null;
};

const FIVE_SECONDS = 5_000;
const THIRTY_SECONDS = 30_000;

export function useGardenAutoFlush(): AutoFlushTimes {
  const flushEvents = useGardenStore((s) => s.flushEvents);
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

  return times;
}
