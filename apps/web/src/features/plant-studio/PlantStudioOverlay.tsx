import type { GardenObject as GardenObjectModel } from "@garden/api-contract";
import { PlantStudioBottomSheet } from "./PlantStudioBottomSheet";
import { PlantStudioPanel } from "./PlantStudioPanel";

type Props = {
  selectedObject: GardenObjectModel;
  onClose: (objectId: string) => void;
};

export function PlantStudioOverlay({ selectedObject, onClose }: Props) {
  return (
    <>
      <PlantStudioBottomSheet
        selectedObject={selectedObject}
        onClose={onClose}
      />
      <PlantStudioPanel selectedObject={selectedObject} onClose={onClose} />
    </>
  );
}
