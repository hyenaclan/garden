import { useCallback, useMemo, useRef, useState } from "react";
import type Konva from "konva";
import {
  clamp,
  getCenter,
  getDistance,
  getWorldPointFromScreenPoint,
  zoomAroundPoint,
  type Camera,
  type Point,
} from "./cameraMath";

const DEFAULT_MIN_SCALE = 0.25;
const DEFAULT_MAX_SCALE = 3;
const DEFAULT_WHEEL_SCALE_BY = 1.05;
const DEFAULT_PINCH_ZOOM_SENSITIVITY = 1.8;

export type CameraTransform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

type GestureState =
  | { mode: "none" }
  | { mode: "pan"; lastPos: Point }
  | { mode: "pinch"; lastCenter: Point; lastDistance: number };

type StageHandlers = {
  onWheel: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  onTouchMove: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  onTouchEnd: (e: Konva.KonvaEventObject<TouchEvent>) => void;
};

export function useCanvasCamera(options?: {
  initialCamera?: Camera;
  minScale?: number;
  maxScale?: number;
  wheelScaleBy?: number;
  pinchZoomSensitivity?: number;
}): {
  cameraTransform: CameraTransform;
  stageHandlers: StageHandlers;
} {
  const minScale = options?.minScale ?? DEFAULT_MIN_SCALE;
  const maxScale = options?.maxScale ?? DEFAULT_MAX_SCALE;
  const wheelScaleBy = options?.wheelScaleBy ?? DEFAULT_WHEEL_SCALE_BY;
  const pinchZoomSensitivity =
    options?.pinchZoomSensitivity ?? DEFAULT_PINCH_ZOOM_SENSITIVITY;

  const [camera, setCamera] = useState<Camera>(
    options?.initialCamera ?? { x: 0, y: 0, scale: 1 },
  );

  const gestureRef = useRef<GestureState>({ mode: "none" });

  const endPointerGesture = useCallback(() => {
    gestureRef.current = { mode: "none" };
  }, []);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      if (e.evt.cancelable) e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      setCamera((prev) => {
        const nextScale =
          e.evt.deltaY > 0
            ? prev.scale / wheelScaleBy
            : prev.scale * wheelScaleBy;
        return zoomAroundPoint(prev, pointer, nextScale, minScale, maxScale);
      });
    },
    [maxScale, minScale, wheelScaleBy],
  );

  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.evt.button !== 0) return;

      const stage = e.target.getStage();
      if (!stage) return;

      if (e.target !== stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      gestureRef.current = { mode: "pan", lastPos: pointer };
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const gesture = gestureRef.current;
      if (gesture.mode !== "pan") return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const dx = pointer.x - gesture.lastPos.x;
      const dy = pointer.y - gesture.lastPos.y;

      setCamera((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      gestureRef.current = { mode: "pan", lastPos: pointer };
    },
    [],
  );

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointers = stage.getPointersPositions();
      if (pointers.length === 1) {
        if (e.target !== stage) return;
        gestureRef.current = { mode: "pan", lastPos: pointers[0] };
        return;
      }

      if (pointers.length === 2) {
        const center = getCenter(pointers[0], pointers[1]);
        const distance = getDistance(pointers[0], pointers[1]);
        gestureRef.current = {
          mode: "pinch",
          lastCenter: center,
          lastDistance: distance,
        };
      }
    },
    [],
  );

  const handleTouchMove = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.evt.cancelable) e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      const pointers = stage.getPointersPositions();
      if (pointers.length === 2) {
        const nextCenter = getCenter(pointers[0], pointers[1]);
        const nextDistance = getDistance(pointers[0], pointers[1]);

        const gesture = gestureRef.current;
        if (gesture.mode !== "pinch") {
          gestureRef.current = {
            mode: "pinch",
            lastCenter: nextCenter,
            lastDistance: nextDistance,
          };
          return;
        }

        setCamera((prev) => {
          if (gesture.lastDistance <= 0 || nextDistance <= 0) return prev;

          const rawScaleBy = nextDistance / gesture.lastDistance;
          const scaleBy = Math.pow(rawScaleBy, pinchZoomSensitivity);
          const nextScale = clamp(prev.scale * scaleBy, minScale, maxScale);
          const worldPoint = getWorldPointFromScreenPoint(
            gesture.lastCenter,
            prev,
          );
          return {
            scale: nextScale,
            x: nextCenter.x - worldPoint.x * nextScale,
            y: nextCenter.y - worldPoint.y * nextScale,
          };
        });

        gestureRef.current = {
          mode: "pinch",
          lastCenter: nextCenter,
          lastDistance: nextDistance,
        };
        return;
      }

      if (pointers.length === 1) {
        const gesture = gestureRef.current;
        if (gesture.mode !== "pan") return;

        const dx = pointers[0].x - gesture.lastPos.x;
        const dy = pointers[0].y - gesture.lastPos.y;

        setCamera((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        gestureRef.current = { mode: "pan", lastPos: pointers[0] };
      }
    },
    [maxScale, minScale, pinchZoomSensitivity],
  );

  const handleTouchEnd = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointers = stage.getPointersPositions();
      if (pointers.length === 0) {
        endPointerGesture();
        return;
      }

      gestureRef.current = { mode: "none" };
    },
    [endPointerGesture],
  );

  const cameraTransform = useMemo<CameraTransform>(
    () => ({
      x: camera.x,
      y: camera.y,
      scaleX: camera.scale,
      scaleY: camera.scale,
    }),
    [camera.x, camera.y, camera.scale],
  );

  const stageHandlers = useMemo<StageHandlers>(
    () => ({
      onWheel: handleWheel,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: endPointerGesture,
      onMouseLeave: endPointerGesture,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }),
    [
      endPointerGesture,
      handleMouseDown,
      handleMouseMove,
      handleTouchEnd,
      handleTouchMove,
      handleTouchStart,
      handleWheel,
    ],
  );

  return { cameraTransform, stageHandlers };
}
