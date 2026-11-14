// ND17 device: the region on a shaded relief rendered from the real terrain (Mapzen/AWS terrarium DEM), tilted slightly in 3-D.
// phase "border": from Bad Muenstereifel the camera pulls back south-east; the Landkreis Ahrweiler boundary (OSM) is drawn — the
//   state border runs along its north-west edge — and the district fills red.
// phase "rivers": the wide view; the Rhine is traced first (thick white), then the two small rivers in narrow valleys, the Ahr and
//   the Erft, in red.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";
import { RELIEF } from "./ND17_data";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const ReliefMap: React.FC<{ src: string; phase: "border" | "rivers"; drawAt: number; fillAt?: number; smallAt?: number }> = ({ src, phase, drawAt, fillAt = 40, smallAt = 80 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: D } = useVideoConfig();
  const R = RELIEF as { W: number; H: number; town: number[]; ahrweiler: number[][][]; euskirchen: number[][][]; rivers: Record<string, number[][][]> };
  const t = io(f / D);
  const [c0, c1, z0, z1] = phase === "border" ? [[1320, 880], [1700, 1230], 2.2, 1.12] as const : [[1880, 1000], [1840, 990], 1.28, 1.36] as const;
  const c = [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t];
  const z = z0 * Math.pow(z1 / z0, t);
  const base = Math.max(width / R.W, height / R.H) * z;
  const left = width / 2 - c[0] * base, top = height / 2 - c[1] * base;
  const pth = (pts: number[][]) => "M" + pts.map(([x, y]) => `${(left + x * base).toFixed(1)} ${(top + y * base).toFixed(1)}`).join(" L");
  const draw = io(interpolate(f, [drawAt, drawAt + 36], [0, 1], cl));
  const fill = phase === "border" ? io(interpolate(f, [fillAt, fillAt + 20], [0, 1], cl)) : 1;
  const small = phase === "rivers" ? io(interpolate(f, [smallAt, smallAt + 36], [0, 1], cl)) : 0;
  const tp = [left + R.town[0] * base, top + R.town[1] * base];
  const ahrD = R.ahrweiler.map(pth).join(" ");
  return (
    <AbsoluteFill style={{ background: "#0b0d0d", overflow: "hidden", perspective: 1800 }}>
      <AbsoluteFill style={{ transform: `rotateX(${phase === "border" ? 14 - 4 * t : 10}deg) scale(1.1)`, transformOrigin: "50% 60%" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left, top, width: R.W * base, height: R.H * base }} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* the district: outlined, then filled */}
          <path d={ahrD} fill="none" stroke={RED} strokeOpacity={0} />
          {phase === "border" && fill > 0 && <path d={ahrD} fill={RED} fillOpacity={0.26 * fill} stroke="none" />}
          {R.ahrweiler.map((w, i) => <path key={i} d={pth(w)} fill="none" stroke={phase === "border" ? "#fff" : "rgba(255,255,255,.45)"} strokeWidth={phase === "border" ? 4 : 2} strokeLinejoin="round" pathLength={1} strokeDasharray={phase === "border" ? `${draw} 1` : undefined} />)}
          {/* rivers */}
          {phase === "rivers" && R.rivers.Rhein.map((w, i) => <path key={"rh" + i} d={pth(w)} fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`} />)}
          {phase === "rivers" && ["Ahr", "Erft"].flatMap((k) => R.rivers[k].map((w, i) => <path key={k + i} d={pth(w)} fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${small} 1`} />))}
          {/* the town */}
          <circle cx={tp[0]} cy={tp[1]} r={11} fill={RED} stroke="#fff" strokeWidth={4} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
      {phase === "border" && <RedLabel text="AHRWEILER DISTRICT" at={fillAt + 6} x={0.62} y={0.86} />}
      {phase === "rivers" && <RedLabel text="RHINE" at={drawAt + 20} hold={smallAt - drawAt - 24} x={0.74} y={0.2} />}
      {phase === "rivers" && <RedLabel text="AHR  ·  ERFT" at={smallAt + 20} x={0.36} y={0.86} />}
    </AbsoluteFill>
  );
};
