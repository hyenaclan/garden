export type Point = { x: number; y: number };

export type Camera = { x: number; y: number; scale: number };

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getCenter(p1: Point, p2: Point): Point {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

export function getDistance(p1: Point, p2: Point) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function getWorldPointFromScreenPoint(
  point: Point,
  camera: Camera,
): Point {
  return {
    x: (point.x - camera.x) / camera.scale,
    y: (point.y - camera.y) / camera.scale,
  };
}

export function zoomAroundPoint(
  camera: Camera,
  point: Point,
  nextScale: number,
  minScale: number,
  maxScale: number,
): Camera {
  const scale = clamp(nextScale, minScale, maxScale);
  const worldPoint = getWorldPointFromScreenPoint(point, camera);
  return {
    scale,
    x: point.x - worldPoint.x * scale,
    y: point.y - worldPoint.y * scale,
  };
}
