import { GardenObject } from "@garden/api-contract";
import { useEffect, useState } from "react";

export type SpriteDef = {
  src: string;
  renderWidth: number;
  renderHeight: number;
  baselineY: number;
};

export const BED_SPRITES: Record<0 | 90, SpriteDef> = {
  0: {
    src: new URL("../../assets/bed-wood-metal-0.svg", import.meta.url).href,
    renderWidth: 320,
    renderHeight: 135,
    baselineY: 102,
  },
  90: {
    src: new URL("../../assets/bed-wood-metal-90.svg", import.meta.url).href,
    renderWidth: 120,
    renderHeight: 270,
    baselineY: 240,
  },
};

export function getBedSprite(item: GardenObject) {
  return (item.rotation ?? 0) === 90 ? BED_SPRITES[90] : BED_SPRITES[0];
}

type SpriteImages = Record<0 | 90, HTMLImageElement | null>;

export function useBedImages(): SpriteImages {
  const [images, setImages] = useState<SpriteImages>({ 0: null, 90: null });

  useEffect(() => {
    ([0, 90] as const).forEach((key) => {
      const def = BED_SPRITES[key];
      const img = new Image();

      const handleLoad = () => {
        setImages((prev) => {
          if (prev[key] === img) return prev;
          return { ...prev, [key]: img };
        });
      };

      if (img.decode) {
        img.decode().then(handleLoad).catch(handleLoad);
      } else {
        img.onload = handleLoad;
      }

      img.src = def.src;
    });
  }, []);

  return images;
}
