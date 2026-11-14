// TP08 (Almería): the three Spanish travelling-fair cases of this video on a real satellite mosaic of the Iberian peninsula
// (NASA Blue Marble shaded relief, public domain, graded), the camera easing across while an upright pin drops on each city as it is
// named, with a soft ground shadow (2.5-D), each with its red place label. px = image pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const FairPins: React.FC<{ src: string; iw: number; ih: number; pins: { x: number; y: number; label: string; at: number; active?: boolean }[]; z0?: number; z1?: number; c0: [number, number]; c1: [number, number] }> = ({ src, iw, ih, pins, z0 = 1.05, z1 = 1.2, c0, c1 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * (z0 + (z1 - z0) * t);
  const fx = c0[0] + (c1[0] - c0[0]) * t, fy = c0[1] + (c1[1] - c0[1]) * t;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "brightness(.85) saturate(.9)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {pins.map((p, i) => {
          const g = interpolate(f, [p.at, p.at + 14], [0, 1], cl); if (g <= 0) return null;
          const drop = out(g), X = ox + p.x * base, Y = oy + p.y * base, H = 90;
          const top = Y - H - (1 - drop) * 220;
          return (
            <g key={i} opacity={Math.min(1, g * 2)}>
              <ellipse cx={X + 10} cy={Y + 4} rx={22 * drop} ry={7 * drop} fill="rgba(0,0,0,.55)" />
              <circle cx={X} cy={Y} r={7} fill="#fff" opacity={drop} />
              <line x1={X} y1={Y} x2={X} y2={top + 18} stroke="#fff" strokeWidth={5} />
              <circle cx={X} cy={top} r={22} fill={p.active ? RED : "#fff"} stroke="#fff" strokeWidth={5} style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }} />
            </g>
          );
        })}
      </svg>
      {pins.map((p, i) => <RedLabel key={i} text={p.label} at={p.at + 8} x={(ox + p.x * base) / width} y={(oy + p.y * base + 40) / height} size={34} />)}
    </AbsoluteFill>
  );
};
