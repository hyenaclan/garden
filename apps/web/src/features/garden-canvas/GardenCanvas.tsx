import { useEffect } from "react";
import { useGardenStore } from "./store";

export function GardenCanvas() {
  const garden = useGardenStore((s) => s.garden);
  const status = useGardenStore((s) => s.status);
  const errorMessage = useGardenStore((s) => s.errorMessage);
  const loadGarden = useGardenStore((s) => s.loadGarden);

  useEffect(() => {
    loadGarden();
  }, [loadGarden]);

  return (
    <section className="border rounded p-4 mt-4">
      <h2 className="font-semibold mb-2">Garden Canvas</h2>
      {status === "loading" && <p>Loading garden...</p>}
      {status === "error" && (
        <p className="text-destructive">
          {errorMessage ?? "Failed to load garden"}
        </p>
      )}
      {garden && (
        <>
          <p className="font-medium">{garden.name}</p>
          <p className="text-sm text-muted-foreground">
            Objects: {garden.gardenObjects.length}
          </p>
        </>
      )}
    </section>
  );
}
