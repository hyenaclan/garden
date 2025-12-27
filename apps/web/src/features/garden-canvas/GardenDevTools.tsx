import { useEffect, useMemo, useRef, useState } from "react";
import { useGardenStore } from "./store";
import type { GardenStatus } from "./types";

const STORAGE_KEY = "garden-devtools";
const devToolsEnabled = import.meta.env.VITE_DEV_TOOLS_ENABLED;

export function GardenDevTools({
  autoFlushAt,
  forceFlushAt,
}: {
  autoFlushAt: number | null;
  forceFlushAt: number | null;
}) {
  const [enabled, setEnabled] = useState(false);
  const [showServerObjects, setShowServerObjects] = useState(false);
  const [showOptimisticObjects, setShowOptimisticObjects] = useState(false);
  const [showPendingEvents, setShowPendingEvents] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const status = useGardenStore((s) => s.status);
  const nextEventVersion = useGardenStore((s) => s.nextEventVersion);
  const garden = useGardenStore((s) => s.garden);
  const serverGardenObjects = garden?.gardenObjects ?? [];
  const pendingEventsByObjectId = useGardenStore(
    (s) => s.pendingEventsByObjectId,
  );
  const optimisticGardenObjects = useGardenStore(
    (s) => s.optimisticGardenObjects,
  );
  const flushEvents = useGardenStore((s) => s.flushEvents);
  const setStatusForDev = useGardenStore((s) => s.setStatusForDev);

  const [errorPinned, setErrorPinned] = useState(false);
  const prevStatusRef = useRef<GardenStatus | null>(null);

  const toggleErrorStatus = () => {
    if (!errorPinned) {
      prevStatusRef.current = status;
      setStatusForDev("error");
      setErrorPinned(true);
    } else {
      const previous = prevStatusRef.current ?? "idle";
      setStatusForDev(previous);
      setErrorPinned(false);
    }
  };

  const forceFlushableError = () => {
    prevStatusRef.current = status;
    setErrorPinned(false);
    setStatusForDev("flushableError");
  };
  const formatCountdown = (target: number | null) => {
    if (!target) return "—";
    const delta = Math.max(0, target - now);
    const seconds = Math.ceil(delta / 1000);
    return `${seconds}s`;
  };

  useEffect(() => {
    if (!devToolsEnabled) return;
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      setEnabled(value === "true");
    } catch {
      setEnabled(false);
    }
  }, []);

  useEffect(() => {
    if (!devToolsEnabled) return;
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
    } catch {
      /* ignore storage errors */
    }
  }, [enabled]);

  const pendingEvents = useMemo(
    () => Object.values(pendingEventsByObjectId ?? {}),
    [pendingEventsByObjectId],
  );

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!devToolsEnabled) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setEnabled((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 rounded-full border border-slate-400 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-800 shadow"
      >
        {enabled ? "Hide Dev Tools" : "Show Dev Tools"}
      </button>

      {enabled ? (
        <div className="fixed bottom-16 right-4 z-50 w-80 max-w-[90vw] rounded-lg border border-slate-300 bg-white/95 p-3 text-xs text-slate-900 shadow-xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">Garden Store Dev</span>
            <span className="text-[10px] uppercase text-slate-500">
              status: {status}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <span className="text-slate-500">Garden status</span>
            <span className="text-slate-900">{status}</span>
            <span className="text-slate-500">Auto flush in</span>
            <span className="text-slate-900">
              {formatCountdown(autoFlushAt)}
            </span>
            <span className="text-slate-500">Force flush in</span>
            <span className="text-slate-900">
              {formatCountdown(forceFlushAt)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <label className="text-[11px] text-slate-500">
              Garden server version
            </label>
            <span className="text-[11px] text-slate-900">
              {garden?.version ?? "—"}
            </span>
            <label className="text-[11px] text-slate-500">
              Next event version
            </label>
            <span className="text-[11px] text-slate-900">
              {nextEventVersion}
            </span>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => flushEvents()}
              disabled={status === "saving" || pendingEvents.length === 0}
              className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-[11px] font-semibold text-slate-800 shadow disabled:cursor-not-allowed disabled:opacity-50"
            >
              Flush events
            </button>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={toggleErrorStatus}
              className={`flex-1 rounded border px-2 py-1 text-[11px] font-semibold shadow ${
                errorPinned
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-300 bg-white text-slate-800"
              }`}
            >
              {errorPinned ? "Unset error" : "Force error"}
            </button>
            <button
              type="button"
              onClick={forceFlushableError}
              className="flex-1 rounded border border-orange-300 bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-800 shadow"
            >
              Force flushableError
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <div>
              <button
                type="button"
                onClick={() => setShowServerObjects((v) => !v)}
                className="flex w-full items-center justify-between rounded border border-slate-200 bg-slate-50 px-2 py-1 text-left text-[11px] font-semibold text-slate-700"
              >
                <span>
                  Server garden objects ({serverGardenObjects.length})
                </span>
                <span className="text-[10px] text-slate-500">
                  {showServerObjects ? "Hide" : "Show"}
                </span>
              </button>
              {showServerObjects ? (
                <div className="mt-1 max-h-24 overflow-auto rounded border border-slate-200 bg-slate-50 p-2">
                  {serverGardenObjects.length === 0 ? (
                    <div className="text-[11px] text-slate-500">None</div>
                  ) : (
                    serverGardenObjects.map((obj) => (
                      <div
                        key={obj.id}
                        className="mb-1 rounded bg-white px-2 py-1 text-[11px] shadow-sm last:mb-0"
                      >
                        <div className="font-semibold text-slate-800">
                          {obj.name}
                        </div>
                        <div className="text-slate-600">
                          id: {obj.id} · x:{obj.x} y:{obj.y} · w:{obj.width} h:
                          {obj.height} · rotation:{obj.rotation}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowOptimisticObjects((v) => !v)}
                className="mt-2 flex w-full items-center justify-between rounded border border-slate-200 bg-slate-50 px-2 py-1 text-left text-[11px] font-semibold text-slate-700"
              >
                <span>
                  Optimistic objects ({optimisticGardenObjects.length})
                </span>
                <span className="text-[10px] text-slate-500">
                  {showOptimisticObjects ? "Hide" : "Show"}
                </span>
              </button>
              {showOptimisticObjects ? (
                <div className="mt-1 max-h-24 overflow-auto rounded border border-slate-200 bg-slate-50 p-2">
                  {optimisticGardenObjects.length === 0 ? (
                    <div className="text-[11px] text-slate-500">None</div>
                  ) : (
                    optimisticGardenObjects.map((obj) => (
                      <div
                        key={obj.id}
                        className="mb-1 rounded bg-white px-2 py-1 text-[11px] shadow-sm last:mb-0"
                      >
                        <div className="font-semibold text-slate-800">
                          {obj.name}
                        </div>
                        <div className="text-slate-600">
                          id: {obj.id} · x:{obj.x} y:{obj.y} · w:{obj.width} h:
                          {obj.height} · rotation:{obj.rotation}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowPendingEvents((v) => !v)}
              className="flex w-full items-center justify-between rounded border border-slate-200 bg-slate-50 px-2 py-1 text-left text-[11px] font-semibold text-slate-700"
            >
              <span>Pending events ({pendingEvents.length})</span>
              <span className="text-[10px] text-slate-500">
                {showPendingEvents ? "Hide" : "Show"}
              </span>
            </button>
            {showPendingEvents ? (
              pendingEvents.length > 0 ? (
                <div className="mt-1 max-h-48 overflow-auto rounded border border-slate-200 bg-slate-50 p-2">
                  {pendingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="mb-1 rounded bg-white px-2 py-1 shadow-sm last:mb-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[11px]">
                          {event.eventType}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          v{event.version}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600">
                        id: {event.payload?.id ?? "—"} · name:{" "}
                        {"name" in (event.payload ?? {})
                          ? ((event.payload as { name?: string }).name ?? "—")
                          : "—"}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        x:{event.payload?.x ?? "—"} y:{event.payload?.y ?? "—"}{" "}
                        · w:
                        {event.payload?.width ?? "—"} h:
                        {event.payload?.height ?? "—"} · rot:
                        {event.payload?.rotation ?? "—"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-1 rounded border border-dashed border-slate-200 p-2 text-[11px] text-slate-500">
                  No pending events
                </div>
              )
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
