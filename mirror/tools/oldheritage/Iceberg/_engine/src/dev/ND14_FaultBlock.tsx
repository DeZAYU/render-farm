// ND14 FaultBlock: a strike-slip fault explained on the real ground. Top-down satellite (NASA Blue Marble) of central Myanmar, the
// Sagaing Fault traced north-south past Mandalay; then the camera tilts and the map becomes two blocks of crust (cut along the traced
// line, dark crust on the front faces) that slide past each other sideways (right-lateral: the east block moves south).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];

export const FaultBlock: React.FC<{ src: string; iw: number; ih: number; fault: Pt[]; city: Pt; cityLabel: string; faultLabel: string; traceAt: number; traceLen: number; tiltAt: number; slideAt: number; slide?: number }> =
  ({ src, iw, ih, fault, city, cityLabel, faultLabel, traceAt, traceLen, tiltAt, slideAt, slide = 120 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = Math.max(width / iw, height / ih) * 1.04 * (1 + 0.05 * (f / durationInFrames)); // image px -> screen px (fills the frame)
  const W = iw * k, H = ih * k;
  const tilt = io(interpolate(f, [tiltAt, tiltAt + 28], [0, 1], cl));
  const sl = io(interpolate(f, [slideAt, slideAt + 40], [0, 1], cl)) * slide;
  const g = io(interpolate(f, [traceAt, traceAt + traceLen], [0, 1], cl));
  const d = "M" + fault.map((p) => `${p[0]} ${p[1]}`).join(" L");
  // clip polygons: west = everything left of the fault line, east = right
  const west = [[0, 0], ...fault.map((p) => [p[0], p[1]]), [0, ih]].map(([x, y]) => `${(x / iw) * 100}% ${(y / ih) * 100}%`).join(",");
  const east = [[iw, 0], ...fault.map((p) => [p[0], p[1]]), [iw, ih]].map(([x, y]) => `${(x / iw) * 100}% ${(y / ih) * 100}%`).join(",");
  const depth = 140 * tilt;
  const half = (poly: string, dy: number, key: string) => (
    <div key={key} style={{ position: "absolute", inset: 0, transform: `translateY(${dy}px)`, transformStyle: "preserve-3d" }}>
      {/* crust slab under the map (seen on the front edge once tilted) */}
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${poly})`, background: "linear-gradient(180deg,#3a2c22,#16110d)", transform: `translateZ(${-depth}px)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: depth, transformOrigin: "bottom", transform: "rotateX(-90deg)", clipPath: `polygon(${poly})`, background: "linear-gradient(180deg,#5a4433,#1a130e)" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${poly})` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
  const cx = city[0] * k, cy = city[1] * k;
  return (
    <AbsoluteFill style={{ background: "#07090b", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: (width - W) / 2, top: Math.min(0, Math.max(height - H, height / 2 - city[1] * k)) + 40 * tilt, width: W, height: H, transformStyle: "preserve-3d",
          transform: `rotateX(${48 * tilt}deg) rotateZ(${-14 * tilt}deg) scale(${1 + 0.32 * tilt})` }}>
          {half(west, -sl / 2, "w")}
          {half(east, sl / 2, "e")}
          <svg viewBox={`0 0 ${iw} ${ih}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
            {tilt < 0.98 && <><path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={16 / k * 0.6} pathLength={1} strokeDasharray={`${g} 1`} />
              <path d={d} fill="none" stroke="#fff" strokeWidth={8 / k * 0.6} pathLength={1} strokeDasharray={`${g} 1`} opacity={1 - tilt} /></>}
            <g transform={`translate(0 ${sl / 2 / k})`}>{/* city sits on the east block */}
              <circle cx={city[0]} cy={city[1]} r={14} fill="#E3141B" stroke="#fff" strokeWidth={5} opacity={out(interpolate(f, [traceAt + 10, traceAt + 22], [0, 1], cl))} />
            </g>
          </svg>
        </div>
      </AbsoluteFill>
      {/* direction arrows once the blocks move */}
      {sl > 4 && <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: Math.min(1, sl / 40) }}>
        {[[-1, 0.36], [1, 0.64]].map(([s, x], i) => { const X = width * x, Y = height * 0.52; return <g key={i}><line x1={X} y1={Y - 80 * s} x2={X} y2={Y + 80 * s} stroke="#fff" strokeWidth={8} /><path d={`M ${X - 22} ${Y + 52 * s} L ${X} ${Y + 92 * s} L ${X + 22} ${Y + 52 * s}`} fill="#fff" /></g>; })}
      </svg>}
      <RedLabel text={faultLabel} at={traceAt + 8} hold={tiltAt - traceAt + 10} x={0.5} y={0.9} />
      <RedLabel text={cityLabel} at={traceAt + 22} hold={tiltAt - traceAt - 12} x={Math.min(0.85, (width - W) / 2 / width + (cx + 150) / width)} y={(Math.min(0, Math.max(height - H, height / 2 - city[1] * k)) + cy) / height} size={38} />
    </AbsoluteFill>
  );
};
