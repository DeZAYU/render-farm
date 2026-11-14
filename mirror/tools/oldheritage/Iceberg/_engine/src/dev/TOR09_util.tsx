// TOR09 helpers (own file; brand.tsx is read-only): channel fonts, one monotone cubic through camera keys (no speed jumps at keys).
import React from "react";
import { continueRender, delayRender, staticFile } from "remotion";

let fp: Promise<void> | null = null;
export const useChannelFonts = () => {
  const [h] = React.useState(() => delayRender("tor09 fonts"));
  React.useEffect(() => {
    if (!fp) fp = Promise.all([
      new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load(),
      new FontFace("ArchivoBlk", `url(${staticFile("fonts/Archivo-wdth-wght.ttf")})`, { weight: "100 900", stretch: "62% 125%" }).load(),
    ]).then((fs) => { fs.forEach((f) => document.fonts.add(f)); });
    fp.then(() => continueRender(h));
  }, [h]);
};
export const ARCH: React.CSSProperties = { fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100" };

/** Fritsch-Carlson monotone cubic through (t, v) keys: smooth, never overshoots, no stop at inner keys */
export const mono = (keys: [number, number][]) => {
  const n = keys.length, xs = keys.map((k) => k[0]), ys = keys.map((k) => k[1]);
  const d = xs.slice(0, -1).map((x, i) => (ys[i + 1] - ys[i]) / (xs[i + 1] - x));
  const m = ys.map((_, i) => (i === 0 ? 0 : i === n - 1 ? 0 : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0]; if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
};
