// ND02 TornQuote: the real news page lies dim and tilted; the disaster agency's own words are torn out of it as paper strips (jagged
// edges, cast shadow) that lift toward the camera one after the other, the second landing over the first. A RedLabel names who said it.
// Built for "the two agencies blamed each other" -> the agency's reply, read off the page itself (not a highlighter on the page).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
type Rect = [number, number, number, number]; // x, y, w, h in page pixels

/** a torn-paper polygon (percent coords): straight sides, jagged top and bottom, deterministic per seed */
const torn = (seed: number) => {
  const r = (i: number) => { const x = Math.sin(seed * 97.13 + i * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const n = 34, top: string[] = [], bot: string[] = [];
  for (let i = 0; i <= n; i++) { const x = (i / n) * 100; top.push(`${x}% ${1 + r(i) * 6}%`); bot.push(`${100 - x}% ${99 - r(i + 50) * 6}%`); }
  return `polygon(${top.join(",")},${bot.join(",")})`;
};

export const TornQuote: React.FC<{ src: string; imgW: number; imgH: number; view: Rect; strips: { r: Rect; at: number }[]; label?: string; labelAt?: number; cutBelow?: number }> =
  ({ src, imgW, imgH, view, strips, label, labelAt = 8, cutBelow }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const d = f / durationInFrames;
  // page: the view rect fitted to the frame, dim, tilted back, slow drift
  const s = Math.max(width * 1.04 / view[2], height * 1.04 / view[3]);
  const page = (
    <div style={{ position: "absolute", left: width / 2 - (view[0] + view[2] / 2) * s, top: height / 2 - (view[1] + view[3] / 2) * s, width: imgW * s, height: imgH * s, overflow: "hidden",
      transformOrigin: `${(view[0] + view[2] / 2) * s}px ${(view[1] + view[3] / 2) * s}px`,
      transform: `rotateX(${16 - 3 * d}deg) rotateZ(${-2 + 1.2 * d}deg) scale(${1.0 + 0.05 * d})` }}>
      <div style={{ position: "absolute", inset: 0, background: "#fbfbfb", filter: `brightness(${interpolate(f, [strips[0].at, strips[0].at + 14], [0.9, 0.38], cl)}) blur(${interpolate(f, [strips[0].at, strips[0].at + 14], [0, 3], cl)}px)` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", clipPath: cutBelow ? `inset(0 0 ${(1 - cutBelow / imgH) * 100}% 0)` : undefined }} />
      </div>
    </div>
  );
  const W = width * 0.8;
  return (
    <AbsoluteFill style={{ background: "#0b0b0b", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1800 }}>{page}</AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1400 }}>
        {strips.map((st, i) => {
          const k = out(interpolate(f, [st.at, st.at + 16], [0, 1], cl));
          if (k <= 0) return null;
          const sc = W / st.r[2], h = st.r[3] * sc;
          // where the strip sat on the page (approx.) -> its final place; later strips land lower and in front
          const y1 = height * (strips.length === 1 ? 0.45 : 0.32 + i * 0.3) - h / 2;
          const y0 = height / 2 - h / 2 + (st.r[1] + st.r[3] / 2 - (view[1] + view[3] / 2)) * s * 0.8;
          const later = strips.slice(i + 1).some((o) => f > o.at);
          return (
            <div key={i} style={{ position: "absolute", left: width / 2 - W / 2, top: y0 + (y1 - y0) * k, width: W, height: h,
              transform: `translateZ(${120 * k + 30 * d}px) rotateZ(${(i % 2 ? 1.6 : -1.4) * k}deg) rotateX(${(1 - k) * 18}deg)`,
              filter: `drop-shadow(0 ${18 * k}px ${26 * k}px rgba(0,0,0,.7)) brightness(${later ? 0.72 : 1})`, opacity: interpolate(f, [st.at, st.at + 4], [0, 1], cl) }}>
              <div style={{ width: "100%", height: "100%", clipPath: torn(i + 3), background: "#fbfaf6", overflow: "hidden" }}>
                <Img src={staticFile(src)} style={{ position: "absolute", left: -st.r[0] * sc, top: -st.r[1] * sc, width: imgW * sc, height: imgH * sc }} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      {label && <RedLabel text={label} at={labelAt} x={0.5} y={0.88} size={40} />}
    </AbsoluteFill>
  );
};
