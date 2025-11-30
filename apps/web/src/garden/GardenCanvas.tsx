import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Line, Rect, Stage, Transformer } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type Konva from "konva";
import type { Rect as KonvaRect } from "konva/lib/shapes/Rect";
import type { CanvasViewState, Garden, GardenObject } from "./types";

interface GardenCanvasProps {
  garden: Garden;
  onChangeGarden: (garden: Garden) => void;
}

const GRID_SIZE = 50;
const GRID_EXTENT = 2000;
const MIN_DIMENSION = 10;

export function GardenCanvas({ garden, onChangeGarden }: GardenCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 900, height: 700 });
  const [centered, setCentered] = useState(false);
  const [view, setView] = useState<CanvasViewState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver(() => {
      setStageSize({
        width: node.clientWidth,
        height: node.clientHeight,
      });
    });

    resizeObserver.observe(node);
    setStageSize({ width: node.clientWidth, height: node.clientHeight });

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (centered) return;
    setView((prev) => ({
      ...prev,
      offsetX: stageSize.width / 2,
      offsetY: stageSize.height / 2,
    }));
    setCentered(true);
  }, [centered, stageSize.height, stageSize.width]);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;

    if (selectedId) {
      const node = stage.findOne(`#${selectedId}`);
      if (node) {
        transformer.nodes([node as unknown as Konva.Node]);
        transformer.getLayer()?.batchDraw();
        return;
      }
    }

    transformer.nodes([]);
    transformer.getLayer()?.batchDraw();
  }, [selectedId, garden.growAreas]);

  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = -GRID_EXTENT; i <= GRID_EXTENT; i += GRID_SIZE) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, -GRID_EXTENT, i, GRID_EXTENT]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />,
      );
      lines.push(
        <Line
          key={`h-${i}`}
          points={[-GRID_EXTENT, i, GRID_EXTENT, i]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />,
      );
    }
    return lines;
  }, []);

  const updateObject = (id: string, data: Partial<GardenObject>) => {
    onChangeGarden({
      ...garden,
      growAreas: garden.growAreas.map((obj) =>
        obj.id === id ? ({ ...obj, ...data } as GardenObject) : obj,
      ),
    });
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const scaleBy = 1.08;
    const oldScale = view.scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - view.offsetX) / oldScale,
      y: (pointer.y - view.offsetY) / oldScale,
    };

    const newScale =
      e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const newOffsetX = pointer.x - mousePointTo.x * newScale;
    const newOffsetY = pointer.y - mousePointTo.y * newScale;
    setView({ scale: newScale, offsetX: newOffsetX, offsetY: newOffsetY });
  };

  const handleStageDragEnd = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const position = stage.position();
    setView((prev) => ({
      ...prev,
      offsetX: position.x,
      offsetY: position.y,
    }));
  };

  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    if (e.target === stage) {
      setSelectedId(null);
    }
  };

  const handleStageTouchStart = (e: KonvaEventObject<TouchEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    if (e.target === stage) {
      setSelectedId(null);
    }
  };

  const handleDragEnd = (id: string, e: KonvaEventObject<DragEvent>) => {
    const { x, y } = e.target.position();
    updateObject(id, { x, y });
  };

  const handleTransformEnd = (id: string, e: KonvaEventObject<Event>) => {
    const node = e.target as KonvaRect;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const nextWidth = Math.max(MIN_DIMENSION, node.width() * scaleX);
    const nextHeight = Math.max(MIN_DIMENSION, node.height() * scaleY);

    node.scaleX(1);
    node.scaleY(1);

    updateObject(id, {
      x: node.x(),
      y: node.y(),
      width: nextWidth,
      height: nextHeight,
      rotation: node.rotation(),
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#f9fafb",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        x={view.offsetX}
        y={view.offsetY}
        scaleX={view.scale}
        scaleY={view.scale}
        draggable
        onDragEnd={handleStageDragEnd}
        onWheel={handleWheel}
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleStageTouchStart}
        style={{ background: "#f9fafb" }}
      >
        <Layer>
          <Rect
            x={-GRID_EXTENT}
            y={-GRID_EXTENT}
            width={GRID_EXTENT * 2}
            height={GRID_EXTENT * 2}
            fill="#f9fafb"
          />
          {gridLines}
        </Layer>
        <Layer>
          {garden.growAreas.map((object) => (
            <Rect
              id={object.id}
              key={object.id}
              x={object.x}
              y={object.y}
              width={object.width}
              height={object.height}
              rotation={object.rotation}
              fill={object.type === "growArea" ? "#9ad4a1" : "#d9dde7"}
              stroke={
                selectedId === object.id ? "#2563eb" : "rgba(15, 23, 42, 0.3)"
              }
              strokeWidth={selectedId === object.id ? 2 : 1}
              draggable
              onClick={() => setSelectedId(object.id)}
              onTap={() => setSelectedId(object.id)}
              onDragEnd={(e) => handleDragEnd(object.id, e)}
              onTransformEnd={(e) => handleTransformEnd(object.id, e)}
            />
          ))}
          <Transformer
            ref={transformerRef}
            rotateEnabled
            boundBoxFunc={(oldBox, newBox) => {
              if (
                Math.abs(newBox.width) < MIN_DIMENSION ||
                Math.abs(newBox.height) < MIN_DIMENSION
              ) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
