import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { GardenObject as GardenObjectModel } from "@garden/api-contract";
import { APP_SHELL_MOBILE_ONLY } from "@/core/ui/breakpoints";

type Props = {
  selectedObject: GardenObjectModel;
  onClose: (objectId: string) => void;
};

const PEEK_HEIGHT_PX = 160;
const OPEN_THRESHOLD = 0.25;
const CLOSE_THRESHOLD = 0.85;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type DragState = {
  pointerId: number;
  startClientY: number;
  startTranslateY: number;
};

export function PlantStudioBottomSheet({ selectedObject, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const [dragging, setDragging] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [peekTranslateY, setPeekTranslateY] = useState(0);
  const [translateY, setTranslateY] = useState(10_000);
  const translateYRef = useRef(translateY);

  useEffect(() => {
    translateYRef.current = translateY;
  }, [translateY]);

  const measure = useCallback(() => {
    const el = sheetRef.current;
    if (!el) return;

    const height = el.getBoundingClientRect().height;
    if (!Number.isFinite(height) || height <= 0) return;

    setSheetHeight(height);
    const nextPeekTranslateY = Math.max(0, height - PEEK_HEIGHT_PX);
    setPeekTranslateY(nextPeekTranslateY);

    setTranslateY((prev) => {
      const clamped = clamp(prev, 0, height);
      if (!Number.isFinite(prev) || prev > height) return nextPeekTranslateY;
      return clamped;
    });
  }, []);

  useLayoutEffect(() => {
    measure();

    const el = sheetRef.current;
    if (!el) return;

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const settle = useCallback(() => {
    const height = sheetHeight;
    const y = translateYRef.current;

    if (height > 0 && y > height * CLOSE_THRESHOLD) {
      onClose(selectedObject.id);
      return;
    }

    if (height > 0 && y < height * OPEN_THRESHOLD) {
      setTranslateY(0);
      return;
    }

    setTranslateY(peekTranslateY);
  }, [onClose, peekTranslateY, selectedObject.id, sheetHeight]);

  const handleHeaderPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();

      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      dragRef.current = {
        pointerId: e.pointerId,
        startClientY: e.clientY,
        startTranslateY: translateYRef.current,
      };
    },
    [],
  );

  const handleHeaderPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      e.preventDefault();

      const dy = e.clientY - drag.startClientY;
      const nextTranslateY = clamp(drag.startTranslateY + dy, 0, sheetHeight);
      setTranslateY(nextTranslateY);
    },
    [sheetHeight],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      dragRef.current = null;
      setDragging(false);
      settle();
    },
    [settle],
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 ${APP_SHELL_MOBILE_ONLY}`}
    >
      <div
        ref={sheetRef}
        className={[
          "pointer-events-auto absolute inset-x-0 bottom-0 h-full rounded-t-2xl border border-border/60 bg-background/95 shadow-2xl",
          dragging ? "" : "transition-transform duration-200 ease-out",
        ].join(" ")}
        style={{
          transform: `translate3d(0, ${translateY}px, 0)`,
          willChange: "transform",
        }}
        aria-label="Plant Studio"
      >
        <div
          className="px-4 pt-3"
          style={{ touchAction: "none" }}
          onPointerDown={handleHeaderPointerDown}
          onPointerMove={handleHeaderPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-5">
                Plant Studio
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Selected: {selectedObject.name}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)] text-sm text-muted-foreground">
          Coming soon.
        </div>
      </div>
    </div>
  );
}
