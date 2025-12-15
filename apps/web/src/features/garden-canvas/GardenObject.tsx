import { Group, Rect, Text, Image as KonvaImage } from "react-konva";
import type { GardenObject as GardenObjectModel } from "@garden/api-contract";
import { getBedSprite } from "./sprites";

type SpriteImages = Record<0 | 90, HTMLImageElement | null>;

type Props = {
  item: GardenObjectModel;
  selected: boolean;
  images: SpriteImages;
  snap: (value: number) => number;
  gridSize: number;
  worldWidth: number;
  worldHeight: number;
  onDragMove: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onSelect: (id: string) => void;
  onRotate: (id: string) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function snapDown(value: number, gridSize: number) {
  return Math.floor(value / gridSize) * gridSize;
}

function snapUp(value: number, gridSize: number) {
  return Math.ceil(value / gridSize) * gridSize;
}

export function GardenObject({
  item,
  selected,
  images,
  snap,
  gridSize,
  worldWidth,
  worldHeight,
  onDragMove,
  onDragEnd,
  onSelect,
  onRotate,
}: Props) {
  const sprite = getBedSprite(item);
  const image = (item.rotation ?? 0) === 90 ? images[90] : images[0];

  const renderWidth = sprite.renderWidth;
  const renderHeight = sprite.renderHeight;

  const groupX = item.x;
  const groupY = item.y - sprite.baselineY;

  const minX = 0;
  const maxX = snapDown(Math.max(0, worldWidth - renderWidth), gridSize);
  const minBaselineY = snapUp(sprite.baselineY, gridSize);
  const maxBaselineY = snapDown(
    Math.max(minBaselineY, worldHeight - renderHeight + sprite.baselineY),
    gridSize,
  );

  return (
    <Group
      x={groupX}
      y={groupY}
      draggable
      onPointerDown={(e) => {
        e.cancelBubble = true;
        onSelect(item.id);
      }}
      onDragMove={(e) => {
        const nx = clamp(snap(e.target.x()), minX, maxX);
        const baselineY = clamp(
          snap(e.target.y() + sprite.baselineY),
          minBaselineY,
          maxBaselineY,
        );
        e.target.position({ x: nx, y: baselineY - sprite.baselineY });
        onDragMove(item.id, nx, baselineY);
      }}
      onDragEnd={(e) => {
        const nx = clamp(snap(e.target.x()), minX, maxX);
        const baselineY = clamp(
          snap(e.target.y() + sprite.baselineY),
          minBaselineY,
          maxBaselineY,
        );
        e.target.position({ x: nx, y: baselineY - sprite.baselineY });
        onDragEnd(item.id, nx, baselineY);
      }}
    >
      {image ? (
        <KonvaImage image={image} width={renderWidth} height={renderHeight} />
      ) : (
        <Rect
          width={renderWidth}
          height={renderHeight}
          fill="#d7e3d8"
          cornerRadius={4}
        />
      )}

      {selected && (
        <Rect
          width={renderWidth}
          height={renderHeight}
          stroke="#2e7d32"
          strokeWidth={2}
          dash={[8, 4]}
          listening={false}
        />
      )}

      {selected && (
        <Group
          x={renderWidth + 8}
          y={-28}
          onPointerDown={(e) => {
            e.cancelBubble = true;
            onRotate(item.id);
          }}
        >
          <Rect
            width={32}
            height={24}
            fill="#ffffff"
            stroke="#2e7d32"
            cornerRadius={6}
          />
          <Text
            text="↻"
            x={9}
            y={4}
            fontSize={14}
            fontStyle="bold"
            fill="#2e7d32"
            listening={false}
          />
        </Group>
      )}
    </Group>
  );
}
