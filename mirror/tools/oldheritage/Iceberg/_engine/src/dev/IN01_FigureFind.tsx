// IN01 FigureFind: the helmet camera frozen on the frame where the hiker is a speck on the pale rock face. The camera eases in, the
// whole face drains to dim grey except a soft pool of colour round her, and a thin white corner bracket closes on her (no text).
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { type CK, camAt, placeOf, cl, out, io } from "./DC01_kit";

export const FigureFind: React.FC<{ src: string; t: number; keys: CK[]; spot: [number, number]; r?: number; at?: number; box?: number }> = ({ src, t, keys, spot, r = 0.05, at = 10, box = 0.06 }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const sx = p.left + spot[0] * p.w, sy = p.top + spot[1] * p.h;
  const d = io(interpolate(f, [at, at + 26], [0, 1], cl));
  const rad = r * p.w;
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  const pic = (filter: string) => <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter }} /></Freeze>;
  const mask = `radial-gradient(circle ${rad * 2.2}px at ${sx}px ${sy}px, #000 0%, #000 38%, transparent 100%)`;
  const b = out(interpolate(f, [at + 12, at + 34], [0, 1], cl));
  const half = (box * p.w) * (2.4 - 1.4 * b) / 2, tick = half * 0.42;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {pic(`grayscale(${0.85 * d}) brightness(${1 - 0.5 * d}) contrast(${1 + 0.05 * d})`)}
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask, opacity: d }}>{pic("saturate(1.15) brightness(1.04)")}</AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: b }}>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([kx, ky], i) => {
          const cx = sx + kx * half, cy = sy + ky * half;
          return <path key={i} d={`M ${cx} ${cy - ky * tick} L ${cx} ${cy} L ${cx - kx * tick} ${cy}`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="square"
            style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.6))" }} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
