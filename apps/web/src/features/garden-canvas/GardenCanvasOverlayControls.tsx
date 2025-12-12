import { Button } from "@garden/ui/components/button";

type Props = {
  onAddBed: () => void;
  disabled?: boolean;
};

const bedPreviewSrc = new URL(
  "../../assets/bed-wood-metal-0.svg",
  import.meta.url,
).href;

export function GardenCanvasOverlayControls({ onAddBed, disabled }: Props) {
  return (
    <div className="pointer-events-none w-full">
      <div className="pointer-events-auto flex w-full items-center justify-start gap-2 rounded-xl border border-border/60 bg-background/70 backdrop-blur-md px-4 py-3 shadow-lg">
        <Button
          size="sm"
          onClick={onAddBed}
          disabled={disabled}
          aria-label="Add bed"
        >
          <img
            src={bedPreviewSrc}
            alt=""
            className="h-10 w-auto pointer-events-none"
          />
        </Button>
      </div>
    </div>
  );
}
