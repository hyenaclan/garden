import { useEffect } from "react";
import { GardenCanvas } from "./GardenCanvas";
import { GardenToolbar } from "./GardenToolbar";
import type { Garden } from "./types";
import { useGardenStore } from "../state/gardenStore";

interface GardenDemoPageProps {
  onBack?: () => void;
}

const fallbackGarden: Garden = {
  id: "loading-garden",
  name: "Loading...",
  unit: "ft",
  growAreas: [],
};

export function GardenDemoPage({ onBack }: GardenDemoPageProps) {
  const garden = useGardenStore((state) => state.garden);
  const status = useGardenStore((state) => state.status);
  const errorMessage = useGardenStore((state) => state.errorMessage);
  const pendingEvents = useGardenStore((state) => state.pendingEvents);
  const currentVersion = useGardenStore((state) => state.currentVersion);
  const replaceGarden = useGardenStore((state) => state.replaceGarden);
  const loadGarden = useGardenStore((state) => state.loadGarden);
  const flushEvents = useGardenStore((state) => state.flushEvents);

  useEffect(() => {
    loadGarden();
  }, [loadGarden]);

  if (!garden && status === "loading") {
    return <div>Loading...</div>;
  }

  if (!garden && status === "error") {
    return <div>Failed to load garden.</div>;
  }

  const activeGarden = garden ?? fallbackGarden;

  let statusText = "Idle";
  if (status === "saved") {
    statusText = "All changes saved";
  } else if (status === "saving") {
    statusText = "Saving...";
  } else if (status === "error" && errorMessage) {
    statusText = `Error: ${errorMessage}`;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f1f5f9",
        color: "#0f172a",
        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <GardenToolbar garden={activeGarden} onChangeGarden={replaceGarden} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "12px",
          gap: "8px",
        }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            style={{
              alignSelf: "flex-start",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: "pointer",
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            Back
          </button>
        ) : null}
        <h1 style={{ margin: 0 }}>{activeGarden.name}</h1>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            padding: "4px 2px",
          }}
        >
          <button
            type="button"
            onClick={() => flushEvents()}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #16a34a",
              background: "#22c55e",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
            disabled={pendingEvents.length === 0 || status === "saving"}
          >
            Save layout
          </button>
          <div aria-label="sync-status" style={{ fontWeight: 600 }}>
            {statusText}
          </div>
          <div style={{ color: "#475569", fontSize: 12 }}>
            v{currentVersion} | pending: {pendingEvents.length}
          </div>
        </div>
        <div style={{ padding: "4px 2px" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Garden objects</div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {activeGarden.growAreas.map((object) => (
              <li key={object.id}>{object.name}</li>
            ))}
          </ul>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            background: "white",
          }}
        >
          <GardenCanvas
            garden={activeGarden}
            onChangeGarden={replaceGarden}
          />
        </div>
      </div>
    </div>
  );
}
