import type { Garden, GardenObject } from "./types";

interface GardenToolbarProps {
  garden: Garden;
  onChangeGarden: (garden: Garden) => void;
}

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `obj-${Date.now()}`;

export function GardenToolbar({
  garden,
  onChangeGarden,
}: GardenToolbarProps) {
  const addObject = (object: GardenObject) =>
    onChangeGarden({ ...garden, growAreas: [...garden.growAreas, object] });

  const addRaisedBed = () =>
    addObject({
      id: createId(),
      type: "growArea",
      name: "Raised Bed",
      x: -60,
      y: -40,
      width: 140,
      height: 80,
      rotation: 0,
      growAreaKind: "raisedBed",
      plantable: true,
    });

  return (
    <div
      style={{
        width: 260,
        background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
        color: "white",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.2 }}>
        Garden Palette
      </div>
      <div style={{ fontSize: 13, opacity: 0.8 }}>
        Quickly drop a grow area onto the canvas.
      </div>
      <button
        type="button"
        onClick={addRaisedBed}
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(16, 185, 129, 0.18)",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Add Raised Bed
      </button>
    </div>
  );
}
