// TOR12 Cycloid: what a cycloidal scour mark is, drawn on a real field (USGS NAIP of the farmland by Goessel, top-down).
// A tornado's core (white dashed ring) crosses the field; small suction whirls orbit inside it, and because the ring is moving at
// the same time, each whirl's path on the ground is a loop-the-loop: those loops are dug into the soil behind it.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const Cycloid: React.FC<{ src: string; iw: number; ih: number; focus: [number, number]; z0?: number; z1?: number; whirls?: number; R?: number; loops?: number; at?: number }> = ({ src, iw, ih, focus, z0 = 1.1, z1 = 1.22, whirls = 3, R = 150, loops = 4.2, at = 6 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  // the core moves left -> right across the frame (slightly rising: the tornado's NE heading)
  const T = durationInFrames - at - 4;
  const u = (fr: number) => Math.max(0, Math.min(1, (fr - at) / T));
  const core = (uu: number): [number, number] => [-R * 1.4 + (width + R * 2.8) * uu, height * 0.62 - height * 0.18 * uu];
  const whirl = (uu: number, j: number): [number, number] => { const [x, y] = core(uu); const a = -uu * loops * Math.PI * 2 + (j * Math.PI * 2) / whirls; return [x + R * 0.72 * Math.cos(a), y + R * 0.72 * Math.sin(a) * 0.92]; };
  const now = u(f), STEPS = 260;
  const trail = (j: number) => { const n = Math.max(2, Math.round(STEPS * now)); return Array.from({ length: n + 1 }, (_, i) => whirl((now * i) / n, j).map((v) => v.toFixed(1)).join(",")).join(" "); };
  const [cx, cy] = core(now);
  const vis = interpolate(f, [at - 6, at + 6], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "saturate(.85) contrast(1.05)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* the scour: dark soil line with a pale edge, left on the field */}
        {Array.from({ length: whirls }, (_, j) => <g key={j} opacity={vis}>
          <polyline points={trail(j)} fill="none" stroke="rgba(235,225,205,.55)" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={trail(j)} fill="none" stroke="rgba(52,36,24,.92)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </g>)}
        {/* the core and its whirls, live */}
        <g opacity={vis * (1 - interpolate(now, [0.94, 1], [0, 1], cl))}>
          <circle cx={cx} cy={cy} r={R} fill="rgba(255,255,255,.07)" stroke="#fff" strokeWidth={4} strokeDasharray="16 12" style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,.6))" }} />
          {Array.from({ length: whirls }, (_, j) => { const [x, y] = whirl(now, j); return <g key={j}>
            <circle cx={x} cy={y} r={22} fill="rgba(227,20,27,.25)" stroke="#E3141B" strokeWidth={4} />
            <path d={`M${x + 12} ${y} A12 12 0 1 0 ${x} ${y + 12}`} fill="none" stroke="#fff" strokeWidth={3} transform={`rotate(${-f * 24} ${x} ${y})`} />
          </g>; })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
