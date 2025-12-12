import { Group, Layer, Rect } from "react-konva";
import type { GardenObject as GardenObjectModel } from "@garden/api-contract";
import { GardenObject } from "./GardenObject";
import type { CameraTransform } from "./useCanvasCamera";

type SpriteImages = Record<0 | 90, HTMLImageElement | null>;

type Props = {
  cameraTransform: CameraTransform;
  gridLines: Array<{ x?: number; y?: number }>;
  worldWidth: number;
  worldHeight: number;
  items: GardenObjectModel[];
  selectedId: string | null;
  snap: (value: number) => number;
  onDragMove: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onSelect: (id: string) => void;
  onRotate: (id: string) => void;
  images: SpriteImages;
};

export function GardenWorld({
  cameraTransform,
  gridLines,
  worldWidth,
  worldHeight,
  items,
  selectedId,
  snap,
  onDragMove,
  onDragEnd,
  onSelect,
  onRotate,
  images,
}: Props) {
  return (
    <>
      <Layer listening={false}>
        <Group {...cameraTransform}>
          {gridLines.map((line, idx) =>
            line.x !== undefined ? (
              <Rect
                key={`v-${idx}`}
                x={line.x}
                y={0}
                width={1}
                height={worldHeight}
                fill="#e2e8e2"
              />
            ) : (
              <Rect
                key={`h-${idx}`}
                x={0}
                y={line.y!}
                width={worldWidth}
                height={1}
                fill="#e2e8e2"
              />
            ),
          )}
        </Group>
      </Layer>

      <Layer>
        <Group {...cameraTransform}>
          {items.map((item) => (
            <GardenObject
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              snap={snap}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
              onSelect={onSelect}
              onRotate={onRotate}
              images={images}
            />
          ))}
        </Group>
      </Layer>
    </>
  );
}
