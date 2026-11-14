// ND01 StoneRead: a real photograph of the Aneyoshi tsunami stone, lit and slightly turned in 3-D; four white corner brackets close
// on the carved columns that give the warning while the camera pushes into them (the words themselves stay the stone's, no overlay text).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const StoneRead: React.FC<{ src: string; iw: number; ih: number; box: [number, number, number, number]; at: number; label?: string; labelAt?: number; z1?: number }> = ({ src, iw, ih, box, at, label, labelAt = 8, z1 = 2.1 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = io(interpolate(f, [at, at + 40], [0, 1], cl));
  const base = Math.max(width / iw, height / ih);
  const bx = (box[0] + box[2]) / 2, by = (box[1] + box[3]) / 2;
  const z = (1.04 + 0.04 * (f / durationInFrames)) * (1 - k) + z1 * k;
  const s = base * z;
  const cx = iw / 2 + (bx - iw / 2) * k, cy = ih / 2 + (by - ih / 2) * k;
  const ox = width / 2 - cx * s, oy = height / 2 - cy * s;
  const ry = -6 + 6 * k + 2 * Math.sin(f / 60), rx = 3 - 3 * k;
  const g = out(interpolate(f, [at - 6, at + 14], [0, 1], cl));
  const X0 = ox + box[0] * s, Y0 = oy + box[1] * s, X1 = ox + box[2] * s, Y1 = oy + box[3] * s;
  const L = 60, spread = (1 - g) * 70;
  const corners: [number, number, number, number][] = [[X0 - spread, Y0 - spread, 1, 1], [X1 + spread, Y0 - spread, -1, 1], [X0 - spread, Y1 + spread, 1, -1], [X1 + spread, Y1 + spread, -1, -1]];
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transform: `rotateY(${ry}deg) rotateX(${rx}deg) scale(1.08)` }}>
          <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * s, height: ih * s }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 65% at ${45 + 10 * Math.sin(f / 80)}% 40%, rgba(255,240,220,.12) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)` }} />
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: g }}>
            {corners.map(([x, y, dx, dy], i) => <path key={i} d={`M${x} ${y + dy * L} V${y} H${x + dx * L}`} fill="none" stroke="#fff" strokeWidth={6} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }} />)}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      {label && <RedLabel text={label} at={labelAt} x={0.5} y={0.9} size={42} />}
    </AbsoluteFill>
  );
};
