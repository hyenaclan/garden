import { Group, Layer, Rect } from "react-konva";
import type { GardenObject as GardenObjectModel } from "@garden/api-contract";
import { GardenObject } from "./GardenObject";
import type { CameraTransform } from "./useCanvasCamera";
import type { GardenCanvasPalette } from "./useGardenCanvasPalette";

type SpriteImages = Record<0 | 90, HTMLImageElement | null>;

type Props = {
  cameraTransform: CameraTransform;
  palette: GardenCanvasPalette;
  gridLines: Array<{ x?: number; y?: number }>;
  worldWidth: number;
  worldHeight: number;
  gridSize: number;
  items: GardenObjectModel[];
  selectedId: string | null;
  snap: (value: number) => number;
  onDragMove: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onSelect: (id: string) => void;
  onRotate: (id: string) => void;
  isEditable: boolean;
  images: SpriteImages;
};

export function GardenWorld({
  cameraTransform,
  palette,
  gridLines,
  worldWidth,
  worldHeight,
  gridSize,
  items,
  selectedId,
  snap,
  onDragMove,
  onDragEnd,
  onSelect,
  onRotate,
  isEditable,
  images,
}: Props) {
  return (
    <>
      <Layer listening={false}>
        <Group {...cameraTransform} opacity={palette.gridLineOpacity}>
          {gridLines.map((line, idx) =>
            line.x !== undefined ? (
              <Rect
                key={`v-${idx}`}
                x={line.x}
                y={0}
                width={1}
                height={worldHeight}
                fill={palette.gridLine}
              />
            ) : (
              <Rect
                key={`h-${idx}`}
                x={0}
                y={line.y!}
                width={worldWidth}
                height={1}
                fill={palette.gridLine}
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
              palette={palette}
              snap={snap}
              gridSize={gridSize}
              worldWidth={worldWidth}
              worldHeight={worldHeight}
              onDragMove={onDragMove}
              onDragEnd={onDragEnd}
              onSelect={onSelect}
              onRotate={onRotate}
              isEditable={isEditable}
              images={images}
            />
          ))}
        </Group>
      </Layer>
    </>
  );
}
