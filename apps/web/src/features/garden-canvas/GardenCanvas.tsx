import { useEffect, useMemo, useRef, useState } from "react";
import { Stage } from "react-konva";
import { useGardenStore } from "./store";
import type { GardenObject as GardenObjectModel } from "@garden/api-contract";
import { BED_SPRITES, getBedSprite, useBedImages } from "./sprites";
import { GardenCanvasOverlayControls } from "./GardenCanvasOverlayControls";
import { useCanvasCamera } from "./useCanvasCamera";
import { GardenWorld } from "./GardenWorld";
import { useGardenCanvasPalette } from "./useGardenCanvasPalette";
import { PlantStudioOverlay } from "../plant-studio/PlantStudioOverlay";

const GRID_SIZE = 40;
const WORLD_WIDTH = 6000;
const WORLD_HEIGHT = 4000;
const CAMERA_BOUNDS = {
  worldWidth: WORLD_WIDTH,
  worldHeight: WORLD_HEIGHT,
  overscrollPx: GRID_SIZE * 4,
} as const;

export function GardenCanvas() {
  const garden = useGardenStore((s) => s.garden);
  const status = useGardenStore((s) => s.status);
  const errorMessage = useGardenStore((s) => s.errorMessage);
  const loadGarden = useGardenStore((s) => s.loadGarden);
  const replaceGarden = useGardenStore((s) => s.replaceGarden);

  const [items, setItems] = useState<GardenObjectModel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const bedImages = useBedImages();
  const palette = useGardenCanvasPalette();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const { cameraTransform, stageHandlers } = useCanvasCamera({
    bounds: CAMERA_BOUNDS,
  });

  useEffect(() => {
    loadGarden();
  }, [loadGarden]);

  useEffect(() => {
    if (garden) setItems(garden.gardenObjects);
  }, [garden]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setViewport({
        width: Math.max(0, Math.floor(width)),
        height: Math.max(0, Math.floor(height)),
      });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.y - b.y),
    [items],
  );

  const selectedItem = useMemo(
    () => items.find((obj) => obj.id === selectedId) ?? null,
    [items, selectedId],
  );

  function snap(value: number) {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }

  const sync = (next: GardenObjectModel[]) => {
    if (!garden) return;
    replaceGarden({
      ...garden,
      gardenObjects: next,
      version: garden.version + 1,
    });
  };

  const handleMove = (id: string, x: number, y: number) => {
    setItems((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, x, y } : obj)),
    );
  };

  const handleMoveEnd = (id: string, x: number, y: number) => {
    const next = items.map((obj) => (obj.id === id ? { ...obj, x, y } : obj));
    setItems(next);
    sync(next);
  };

  const addBox = () => {
    if (!garden) return;
    const new_bed_x = 360;
    const new_bed_y = 360;
    const bedSprite = BED_SPRITES[0];
    const newBox: GardenObjectModel = {
      id: `bed-${Date.now()}`,
      name: "Bed",
      type: "GardenBox",
      x: snap(new_bed_x),
      y: snap(new_bed_y),
      width: bedSprite.renderWidth,
      height: bedSprite.renderHeight,
      rotation: 0,
      plantable: true,
    };
    const next = [...items, newBox];
    setItems(next);
    sync(next);
    setSelectedId(newBox.id);
  };

  const rotateItem = (id: string) => {
    const next = items.map((obj) => {
      if (obj.id !== id) return obj;

      const prevSprite = getBedSprite(obj);
      const nextRotation = (obj.rotation ?? 0) === 90 ? 0 : 90;
      const nextSprite = getBedSprite({ ...obj, rotation: nextRotation });
      const deltaBaseline = nextSprite.baselineY - prevSprite.baselineY;

      return { ...obj, rotation: nextRotation, y: obj.y + deltaBaseline };
    });

    setItems(next);
    sync(next);
  };

  const gridLines = useMemo(() => {
    const lines: Array<{ x?: number; y?: number }> = [];
    for (let x = 0; x <= WORLD_WIDTH; x += GRID_SIZE) lines.push({ x });
    for (let y = 0; y <= WORLD_HEIGHT; y += GRID_SIZE) lines.push({ y });
    return lines;
  }, []);

  const stageWidth = viewport.width;
  const stageHeight = viewport.height;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {status === "loading" && (
        <p className="px-3 py-2 text-sm text-muted-foreground">
          Loading garden...
        </p>
      )}
      {status === "error" && (
        <p className="px-3 py-2 text-sm text-destructive">
          {errorMessage ?? "Failed to load garden"}
        </p>
      )}

      <div
        ref={containerRef}
        className="relative flex-1 min-h-0 overflow-hidden"
      >
        {stageWidth > 0 && stageHeight > 0 && (
          <Stage
            width={stageWidth}
            height={stageHeight}
            style={{ background: palette.stageBackground, touchAction: "none" }}
            {...stageHandlers}
            onClick={(e) => {
              const stage = e.target.getStage();
              if (!stage) return;
              if (e.target !== stage) return;
              setSelectedId(null);
            }}
            onTap={(e) => {
              const stage = e.target.getStage();
              if (!stage) return;
              if (e.target !== stage) return;
              setSelectedId(null);
            }}
          >
            <GardenWorld
              cameraTransform={cameraTransform}
              palette={palette}
              gridLines={gridLines}
              worldWidth={WORLD_WIDTH}
              worldHeight={WORLD_HEIGHT}
              gridSize={GRID_SIZE}
              items={sortedItems}
              selectedId={selectedId}
              snap={snap}
              onDragMove={handleMove}
              onDragEnd={handleMoveEnd}
              onSelect={setSelectedId}
              onRotate={rotateItem}
              images={bedImages}
            />
          </Stage>
        )}

        {selectedItem ? (
          <PlantStudioOverlay
            selectedObject={selectedItem}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4">
            <div className="pointer-events-auto w-full max-w-sm">
              <GardenCanvasOverlayControls
                onAddBed={addBox}
                disabled={status === "loading"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
