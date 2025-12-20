import type { GardenObject as GardenObjectModel } from "@garden/api-contract";
import { APP_SHELL_DESKTOP_ONLY } from "@/core/ui/breakpoints";
import { Button } from "@garden/ui/components/button";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  selectedObject: GardenObjectModel;
  onClose: (objectId: string) => void;
};

const CLOSE_ANIMATION_MS = 200;

export function PlantStudioPanel({ selectedObject, onClose }: Props) {
  const closeTimeoutRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setOpen(true);
  }, [selectedObject.id]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const requestClose = () => {
    setOpen(false);

    const closingObjectId = selectedObject.id;

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      onClose(closingObjectId);
    }, CLOSE_ANIMATION_MS);
  };

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 ${APP_SHELL_DESKTOP_ONLY}`}
    >
      <div
        className={[
          "pointer-events-auto absolute right-0 top-0 h-full w-[420px] max-w-full border-l border-border/60 bg-background/80 backdrop-blur-md shadow-2xl",
          "transition-transform duration-200 ease-out motion-reduce:transition-none will-change-transform",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-label="Plant Studio"
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-border/60">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-5">
              Plant Studio
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Selected: {selectedObject.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={requestClose}
            aria-label="Close Plant Studio"
          >
            <X />
          </Button>
        </div>

        <div className="px-4 py-4 text-sm text-muted-foreground">
          Coming soon.
        </div>
      </div>
    </div>
  );
}
