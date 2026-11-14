// TP01 CableHold: a freeze of the close-up; four white corner brackets close in from the frame edges onto one detail (the point where the
// last cable meets the capsule) while the picture zooms to it. px = source pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
export const CableHold: React.FC<{ src: string; iw: number; ih: number; box: [number, number, number, number]; at: number; len: number; zoom?: number }> = ({ src, iw, ih, box, at, len, zoom = 1.9 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  const z = 1.02 + (zoom - 1.02) * g + 0.03 * (f / 150);
  const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - cx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - cy * base));
  // brackets: from the frame edges (inset 70) to the box on screen
  const bx0 = ox + box[0] * base, by0 = oy + box[1] * base, bx1 = ox + box[2] * base, by1 = oy + box[3] * base;
  const L = (a: number, b: number) => a + (b - a) * g;
  const x0 = L(70, bx0), y0 = L(70, by0), x1 = L(width - 70, bx1), y1 = L(height - 70, by1);
  const arm = 46, o = interpolate(f, [0, 8], [0, 1], cl);
  const C = (x: number, y: number, sx: number, sy: number, k: number) => <path key={k} d={`M${x + sx * arm} ${y} L${x} ${y} L${x} ${y + sy * arm}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="square" />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: `brightness(${0.95 - 0.12 * g})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: o, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
        {[C(x0, y0, 1, 1, 0), C(x1, y0, -1, 1, 1), C(x0, y1, 1, -1, 2), C(x1, y1, -1, -1, 3)]}
      </svg>
    </AbsoluteFill>
  );
};
