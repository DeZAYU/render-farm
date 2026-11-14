// ND09 RangePlate — the Toowoomba range and the Lockyer Valley on one real satellite plate (Sentinel-2 cloudless 2020 by EOX, CC BY 4.0,
// modified Copernicus data), laid back in perspective (AE-style camera). Two moves built for this case:
//   RangeEdge  — the opening question: the escarpment of the Great Dividing Range is drawn along its edge (dashed white), the camera
//                rises over it and settles on the city sitting on top of it, ringed, named.
//   ValleyRun  — "the water kept going downhill into the Lockyer Valley … reached Grantham": Lockyer Creek traced off the range down
//                the valley while a bright surge head runs along it; the camera travels with it; Grantham named on arrival.
// Points are plate pixels (2816 x 2304; z13 web-mercator tiles).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];
const IW = 2816, IH = 2304;
const lenOf = (p: Pt[]) => p.reduce((a, q, i) => (i ? a + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0);
const along = (p: Pt[], d: number): Pt => { let acc = 0; for (let i = 1; i < p.length; i++) { const s = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (acc + s >= d) { const k = (d - acc) / s; return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k]; } acc += s; } return p[p.length - 1]; };

const Plate: React.FC<{ src: string; f: [number, number]; z: number; tilt: number; children?: (sw: number) => React.ReactNode }> = ({ src, f, z, tilt, children }) => {
  const { width: W, height: H } = useVideoConfig();
  const base = Math.max(W / IW, H / IH) * z;
  const ox = W / 2 - f[0] * base, oy = H / 2 - f[1] * base;
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <AbsoluteFill style={{ transform: `rotateX(${tilt}deg) scale(1.35)`, transformOrigin: "50% 62%" }}>
        <div style={{ position: "absolute", left: ox, top: oy, width: IW * base, height: IH * base }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", filter: "brightness(1.05) saturate(.9)" }} />
          <svg viewBox={`0 0 ${IW} ${IH}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>{children?.(1 / base)}</svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Haze: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(6,8,10,.9) 0%, rgba(6,8,10,0) 28%, rgba(6,8,10,0) 82%, rgba(6,8,10,.45) 100%)" }} />;

export const RangeEdge: React.FC<{ src: string; edge: Pt[]; city: Pt; edgeAt: number; edgeLen: number; cityAt: number; rangeLabel: string; cityLabel: string }> = ({ src, edge, city, edgeAt, edgeLen, cityAt, rangeLabel, cityLabel }) => {
  const f = useCurrentFrame(); const { durationInFrames: D } = useVideoConfig();
  const t = io(interpolate(f, [0, D], [0, 1], cl));
  const c0: Pt = [1000, 900];
  const fc: Pt = [c0[0] + (city[0] - c0[0]) * t, c0[1] + (city[1] - c0[1]) * t];
  const g = io(interpolate(f, [edgeAt, edgeAt + edgeLen], [0, 1], cl)), r = out(interpolate(f, [cityAt, cityAt + 16], [0, 1], cl));
  const d = "M" + edge.map((p) => p.join(" ")).join(" L");
  return (
    <AbsoluteFill style={{ background: "#06080a", overflow: "hidden" }}>
      <Plate src={src} f={fc} z={1.6 + 0.5 * t} tilt={34 - 12 * t}>
        {(k) => <g>
          <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13 * k} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={6 * k} pathLength={1} strokeDasharray={g > 0.999 ? `${18 * k} ${12 * k}` : `${g} 1`} strokeLinecap="round" />
          {r > 0 && <g opacity={r}><circle cx={city[0]} cy={city[1]} r={(120 + 40 * (1 - r))} fill="none" stroke="#fff" strokeWidth={7 * k} /><circle cx={city[0]} cy={city[1]} r={14 * k} fill={RED} stroke="#fff" strokeWidth={4 * k} /></g>}
        </g>}
      </Plate>
      <Haze />
      <RedLabel text={rangeLabel} at={edgeAt + 10} hold={cityAt - edgeAt - 14} />
      <RedLabel text={cityLabel} at={cityAt + 8} />
    </AbsoluteFill>
  );
};

export const ValleyRun: React.FC<{ src: string; creek: Pt[]; at: number; len: number; startLabel: string; endLabel: string }> = ({ src, creek, at, len, startLabel, endLabel }) => {
  const f = useCurrentFrame();
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  const L = lenOf(creek), head = along(creek, L * g);
  const cam = along(creek, L * Math.max(0, g - 0.08));
  const fc: Pt = [cam[0] * 0.8 + head[0] * 0.2, cam[1] * 0.8 + head[1] * 0.2 + 60];
  const d = "M" + creek.map((p) => p.join(" ")).join(" L");
  const done = out(interpolate(f, [at + len, at + len + 14], [0, 1], cl));
  const end = creek[creek.length - 1];
  return (
    <AbsoluteFill style={{ background: "#06080a", overflow: "hidden" }}>
      <Plate src={src} f={fc} z={2.2} tilt={30}>
        {(k) => <g>
          <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={14 * k} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={6.5 * k} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          {g > 0 && g < 1 && <g><circle cx={head[0]} cy={head[1]} r={30 * k} fill="rgba(255,255,255,.25)" /><circle cx={head[0]} cy={head[1]} r={12 * k} fill="#fff" /></g>}
          <circle cx={creek[0][0]} cy={creek[0][1]} r={12 * k} fill="#fff" />
          {done > 0 && <g opacity={done}><circle cx={end[0]} cy={end[1]} r={(14 + 30 * done) * k} fill="none" stroke={RED} strokeWidth={6 * k} /><circle cx={end[0]} cy={end[1]} r={12 * k} fill={RED} stroke="#fff" strokeWidth={4 * k} /></g>}
        </g>}
      </Plate>
      <Haze />
      <RedLabel text={startLabel} at={6} hold={at + 30} />
      <RedLabel text={endLabel} at={at + len + 6} />
    </AbsoluteFill>
  );
};
