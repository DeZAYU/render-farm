// TOR09 PathMap: the NWS Norman surveyed damage outline of tornado A9 (KML from weather.gov/oun/events-19990503) on USGS NAIP imagery.
//   MileMeasure  close on the widest part of the outline: the outline is drawn in, then a white bracket measures it north-south between
//                two section roads (Oklahoma's section roads are one mile apart) and the red label gives the NWS width.
//   PathTowns    the whole 38-mile outline revealed from the south-west end as the VO names the towns, the camera easing out from Amber
//                to the whole path; each town gets a pin and a red label on its own stretch of the outline.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";
import { mono } from "./TOR09_util";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];

const view = (iw: number, ih: number, c: Pt, z: number, W = 1920, H = 1080) => {
  const base = Math.max(W / iw, H / ih) * z;
  const ox = Math.min(0, Math.max(W - iw * base, W / 2 - c[0] * base)), oy = Math.min(0, Math.max(H - ih * base, H / 2 - c[1] * base));
  return { base, ox, oy, P: (p: Pt): Pt => [ox + p[0] * base, oy + p[1] * base] };
};
const pathD = (pts: Pt[]) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + " Z";

export const MileMeasure: React.FC<{ src: string; iw: number; ih: number; poly: Pt[]; a: Pt; b: Pt; focus: Pt; drawAt: number; measureAt: number; label: string; z0?: number; z1?: number }> = ({ src, iw, ih, poly, a, b, focus, drawAt, measureAt, label, z0 = 1.0, z1 = 1.12 }) => {
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  const v = view(iw, ih, focus, z0 + (z1 - z0) * io(f / n));
  const g = io(interpolate(f, [drawAt, drawAt + 22], [0, 1], cl));
  const m = out(interpolate(f, [measureAt, measureAt + 16], [0, 1], cl));
  const A = v.P(a), B = v.P(b), Bm: Pt = [A[0] + (B[0] - A[0]) * m, A[1] + (B[1] - A[1]) * m];
  const tick = (p: Pt) => <line x1={p[0] - 22} y1={p[1]} x2={p[0] + 22} y2={p[1]} stroke="#fff" strokeWidth={5} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: v.ox, top: v.oy, width: iw * v.base, height: ih * v.base }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.45) 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={pathD(poly.map(v.P))} fill={`rgba(255,255,255,${0.14 * g})`} stroke="rgba(0,0,0,.45)" strokeWidth={10} pathLength={1} strokeDasharray={`${g} 1`} />
        <path d={pathD(poly.map(v.P))} fill="none" stroke="#fff" strokeWidth={4} pathLength={1} strokeDasharray={`${g} 1`} />
        {m > 0 && <g style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
          <line x1={A[0]} y1={A[1]} x2={Bm[0]} y2={Bm[1]} stroke="#fff" strokeWidth={6} />
          {tick(A)}{m > 0.98 && tick(B)}
        </g>}
      </svg>
      <RedLabel text={label} at={measureAt + 14} x={(A[0] + B[0]) / 2 / 1920 + 0.11} y={(A[1] + B[1]) / 2 / 1080} size={44} />
    </AbsoluteFill>
  );
};

export const PathTowns: React.FC<{ src: string; iw: number; ih: number; poly: Pt[]; axis: [Pt, Pt]; reveal: [number, number][]; cam: [number, number, number, number][];
  towns: { name: string; p: Pt; at: number; dx?: number; dy?: number }[] }> = ({ src, iw, ih, poly, axis, reveal, cam, towns }) => {
  const f = useCurrentFrame();
  const cx = mono(cam.map((k) => [k[0], k[1]])), cy = mono(cam.map((k) => [k[0], k[2]])), cz = mono(cam.map((k) => [k[0], Math.log(k[3])]));
  const v = view(iw, ih, [cx(f), cy(f)], Math.exp(cz(f)));
  const r = mono(reveal)(f); // 0..1 along the axis SW -> NE
  const [A, B] = axis, L = Math.hypot(B[0] - A[0], B[1] - A[1]), u: Pt = [(B[0] - A[0]) / L, (B[1] - A[1]) / L], nrm: Pt = [-u[1], u[0]];
  // clip: everything behind the advancing front (a long rectangle perpendicular to the axis)
  const front: Pt = [A[0] + u[0] * L * (r * 1.04 - 0.02), A[1] + u[1] * L * (r * 1.04 - 0.02)], back: Pt = [A[0] - u[0] * 400, A[1] - u[1] * 400], E = 3000;
  const clip = [[back[0] + nrm[0] * E, back[1] + nrm[1] * E], [front[0] + nrm[0] * E, front[1] + nrm[1] * E], [front[0] - nrm[0] * E, front[1] - nrm[1] * E], [back[0] - nrm[0] * E, back[1] - nrm[1] * E]] as Pt[];
  const FP = v.P(front);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: v.ox, top: v.oy, width: iw * v.base, height: ih * v.base, filter: "brightness(.86)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="tor09front"><path d={pathD(clip.map(v.P))} /></clipPath></defs>
        <g clipPath="url(#tor09front)">
          <path d={pathD(poly.map(v.P))} fill="rgba(255,255,255,.22)" stroke="rgba(0,0,0,.45)" strokeWidth={8} />
          <path d={pathD(poly.map(v.P))} fill="none" stroke="#fff" strokeWidth={3.5} />
        </g>
        {r > 0.005 && r < 0.995 && <circle cx={FP[0]} cy={FP[1]} r={9} fill="#fff" opacity={0.85} />}
        {towns.map((t, i) => { const g = out(interpolate(f, [t.at, t.at + 10], [0, 1], cl)); if (g <= 0) return null; const p = v.P(t.p);
          return <g key={i} opacity={g}><circle cx={p[0]} cy={p[1]} r={9 * g + 3} fill={RED} stroke="#fff" strokeWidth={3} /></g>; })}
      </svg>
      {towns.map((t, i) => { const p = v.P(t.p); return <RedLabel key={i} text={t.name} at={t.at + 2} x={(p[0] + (t.dx ?? 0)) / 1920} y={(p[1] + (t.dy ?? -54)) / 1080} size={34} />; })}
    </AbsoluteFill>
  );
};
