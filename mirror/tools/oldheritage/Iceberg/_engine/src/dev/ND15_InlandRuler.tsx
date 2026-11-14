// ND15 InlandRuler: how far inland Lake Charles is, measured on the real ground (USGS NAIP mosaic, coast to city): a white ruler
// with mile ticks runs north from the Gulf shore to downtown while the camera rides up it; red labels name both ends.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Pt = [number, number];

export const InlandRuler: React.FC<{ src: string; iw: number; ih: number; coast: Pt; city: Pt; pxPerMile: number; at: number; len: number; coastLabel: string; cityLabel: string; distLabel: string; z0: number; z1: number }> =
  ({ src, iw, ih, coast, city, pxPerMile, at, len, coastLabel, cityLabel, distLabel, z0, z1 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(interpolate(f, [0, durationInFrames - 1], [0, 1], cl));
  const base = Math.max(width / iw, height / ih) * (z0 + (z1 - z0) * u);
  const fy = coast[1] + (city[1] - coast[1]) * (0.15 + 0.7 * u), fx = (coast[0] + city[0]) / 2;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const S = (p: Pt): Pt => [ox + p[0] * base, oy + p[1] * base];
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  const [cx0, cy0] = S(coast), [cx1, cy1] = S(city);
  const xe = cx0 + (cx1 - cx0) * g, ye = cy0 + (cy1 - cy0) * g;
  const total = Math.hypot(city[0] - coast[0], city[1] - coast[1]) / pxPerMile;
  const ticks = Array.from({ length: Math.floor(total / 5) + 1 }, (_, i) => i * 5).filter((m) => m / total <= g);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "brightness(.7) saturate(.8) contrast(1.08)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={cx0} y1={cy0} x2={xe} y2={ye} stroke="rgba(0,0,0,.5)" strokeWidth={14} strokeLinecap="round" />
        <line x1={cx0} y1={cy0} x2={xe} y2={ye} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        {ticks.map((m) => { const t = m / total, x = cx0 + (cx1 - cx0) * t, y = cy0 + (cy1 - cy0) * t, w = m % 10 === 0 ? 30 : 16;
          return <line key={m} x1={x - w} y1={y} x2={x + w} y2={y} stroke="#fff" strokeWidth={m % 10 === 0 ? 5 : 3} />; })}
        <circle cx={cx0} cy={cy0} r={12} fill="#fff" />
        {g > 0.98 && <circle cx={cx1} cy={cy1} r={14} fill="#E3141B" stroke="#fff" strokeWidth={5} />}
      </svg>
      <RedLabel text={coastLabel} at={at - 4} x={Math.min(0.85, (cx0 + 200) / width)} y={Math.min(0.92, (cy0 + 10) / height)} size={36} />
      <RedLabel text={cityLabel} at={at + len - 2} x={Math.min(0.85, (cx1 + 200) / width)} y={Math.max(0.08, cy1 / height)} size={40} />
      <RedLabel text={distLabel} at={at + len + 6} x={Math.min(0.85, ((cx0 + cx1) / 2 + 220) / width)} y={((cy0 + cy1) / 2) / height} size={40} />
    </AbsoluteFill>
  );
};
