import { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage } from "react-konva";
import { useGardenStore } from "./store";
import type { GardenObject } from "@garden/api-contract";
import { Button } from "@garden/ui/components/button";

const GRID_SIZE = 40;
const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 800;
const bedSrc = new URL("../../assets/bed-wood-metal.svg", import.meta.url).href;

function snap(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function footprint(item: GardenObject) {
  const rotated = (item.rotation ?? 0) === 90;
  return {
    width: rotated ? item.height : item.width,
    height: rotated ? item.width : item.height,
  };
}

function GardenBox({
  item,
  selected,
  onDragMove,
  onDragEnd,
  onSelect,
  onRotate,
}: {
  item: GardenObject;
  selected: boolean;
  onDragMove: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onSelect: (id: string) => void;
  onRotate: (id: string) => void;
}) {
  const [bedImage, setBedImage] = useState<HTMLImageElement | null>(null);
  const { width: renderWidth, height: renderHeight } = footprint(item);

  useEffect(() => {
    const img = new Image();
    const handleLoad = () => setBedImage(img);
    if (img.decode) {
      img.decode().then(handleLoad).catch(handleLoad);
    } else {
      img.onload = handleLoad;
    }
    img.src = bedSrc;
    return () => {
      img.onload = null;
    };
  }, []);

  return (
    <Group
      x={item.x}
      y={item.y}
      draggable
      onMouseDown={(e) => {
        e.cancelBubble = true;
        onSelect(item.id);
      }}
      onDragMove={(e) => {
        const nx = snap(e.target.x());
        const ny = snap(e.target.y());
        e.target.position({ x: nx, y: ny });
        onDragMove(item.id, nx, ny);
      }}
      onDragEnd={(e) => {
        const nx = snap(e.target.x());
        const ny = snap(e.target.y());
        e.target.position({ x: nx, y: ny });
        onDragEnd(item.id, nx, ny);
      }}
    >
      {/* Bed graphic */}
      {bedImage ? (
        <KonvaImage image={bedImage} width={renderWidth} height={renderHeight} />
      ) : (
        <Rect width={renderWidth} height={renderHeight} fill="#d7e3d8" cornerRadius={4} />
      )}

      {/* Selection outline */}
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
          onMouseDown={(e) => {
            e.cancelBubble = true;
            onRotate(item.id);
          }}
          onClick={(e) => {
            e.cancelBubble = true;
            onRotate(item.id);
          }}
        >
          <Rect width={32} height={24} fill="#ffffff" stroke="#2e7d32" cornerRadius={6} />
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

export function GardenCanvas() {
  const garden = useGardenStore((s) => s.garden);
  const status = useGardenStore((s) => s.status);
  const errorMessage = useGardenStore((s) => s.errorMessage);
  const loadGarden = useGardenStore((s) => s.loadGarden);
  const replaceGarden = useGardenStore((s) => s.replaceGarden);

  const [items, setItems] = useState<GardenObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    loadGarden();
  }, [loadGarden]);

  useEffect(() => {
    if (garden) {
      setItems(garden.gardenObjects);
    }
  }, [garden]);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aHeight = footprint(a).height;
        const bHeight = footprint(b).height;
        return a.y + aHeight - (b.y + bHeight);
      }),
    [items],
  );

  const sync = (next: GardenObject[]) => {
    if (!garden) return;
    replaceGarden({
      ...garden,
      gardenObjects: next,
      version: garden.version + 1,
    });
  };

  const handleMove = (id: string, x: number, y: number) => {
    setItems((prev) => prev.map((obj) => (obj.id === id ? { ...obj, x, y } : obj)));
  };

  const handleMoveEnd = (id: string, x: number, y: number) => {
    setItems((prev) => {
      const next = prev.map((obj) => (obj.id === id ? { ...obj, x, y } : obj));
      sync(next);
      return next;
    });
  };

  const addBox = () => {
    if (!garden) return;
    const newBox: GardenObject = {
      id: `bed-${Date.now()}`,
      name: "Bed",
      type: "growArea",
      x: snap(60),
      y: snap(60),
      width: 160,
      height: 100,
      rotation: 0,
      plantable: true,
    };
    const next = [...items, newBox];
    setItems(next);
    sync(next);
    setSelectedId(newBox.id);
  };

  const rotateItem = (id: string) => {
    setItems((prev) => {
      const next = prev.map((obj) =>
        obj.id === id ? { ...obj, rotation: (obj.rotation ?? 0) === 90 ? 0 : 90 } : obj,
      );
      sync(next);
      return next;
    });
  };

  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = GRID_SIZE; x < STAGE_WIDTH; x += GRID_SIZE) {
      lines.push({ x });
    }
    for (let y = GRID_SIZE; y < STAGE_HEIGHT; y += GRID_SIZE) {
      lines.push({ y });
    }
    return lines;
  }, []);

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-background shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={addBox} disabled={status === "loading"}>
            Add bed
          </Button>
        </div>
      </div>

      {status === "loading" && <p className="text-sm text-muted-foreground">Loading garden...</p>}
      {status === "error" && (
        <p className="text-sm text-destructive">{errorMessage ?? "Failed to load garden"}</p>
      )}

      <div className="border rounded-lg bg-white shadow-inner overflow-auto flex-1">
        <Stage
          ref={stageRef}
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          style={{ background: "#f8faf8" }}
        >
          <Layer listening={false}>
            {gridLines.map((line, idx) =>
              line.x !== undefined ? (
                <Rect key={`v-${idx}`} x={line.x} y={0} width={1} height={STAGE_HEIGHT} fill="#e2e8e2" />
              ) : (
                <Rect key={`h-${idx}`} x={0} y={line.y!} width={STAGE_WIDTH} height={1} fill="#e2e8e2" />
              ),
            )}
          </Layer>
          <Layer>
            {sortedItems.map((item) => (
              <GardenBox
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onDragMove={handleMove}
                onDragEnd={handleMoveEnd}
                onSelect={setSelectedId}
                onRotate={rotateItem}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
