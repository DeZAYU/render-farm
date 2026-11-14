// ND18 helper: loads a travel-time field PNG (R = high byte, G = low byte, B = 255 where valid) into a Float32Array (0..1 of tmax, -1 invalid)
import { continueRender, delayRender, staticFile } from "remotion";
import React from "react";

const cache = new Map<string, Promise<{ w: number; h: number; t: Float32Array }>>();
const load = (src: string) => {
  if (!cache.has(src)) cache.set(src, new Promise((res, rej) => {
    const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => {
      const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
      const x = c.getContext("2d", { colorSpace: "srgb" } as CanvasRenderingContext2DSettings)!; x.drawImage(im, 0, 0);
      const d = x.getImageData(0, 0, im.width, im.height).data; const t = new Float32Array(im.width * im.height);
      for (let i = 0; i < t.length; i++) t[i] = d[i * 4 + 2] > 128 ? (d[i * 4] * 256 + d[i * 4 + 1]) / 65000 : -1;
      res({ w: im.width, h: im.height, t });
    };
    im.onerror = rej; im.src = staticFile(src);
  }));
  return cache.get(src)!;
};

export const useField = (src: string) => {
  const [h] = React.useState(() => delayRender("field " + src));
  const [fld, set] = React.useState<{ w: number; h: number; t: Float32Array } | null>(null);
  React.useEffect(() => { load(src).then((v) => { set(v); continueRender(h); }); }, [src, h]);
  return fld;
};
