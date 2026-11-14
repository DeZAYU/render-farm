// ND16 device: "checked bridge by bridge". USGS NAIP of Marathon -> Seven Mile Bridge -> Bahia Honda on a tilted 3-D plane; the Overseas
// Highway is traced west out of Marathon while the camera follows its tip, and each bridge on it lights red as the trace crosses it
// (Seven Mile, the two Ohio/Missouri spans, Bahia Honda channel). Image hwy.jpg 3200x1600, bbox -81.29,24.63 .. -81.03,24.75.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const IW = 3200, IH = 1600;
const ROUTE: [number, number][] = [[3200, 280], [2800, 390], [2400, 500], [2030, 576], [1680, 631], [1600, 647], [1360, 720], [1120, 785], [880, 869], [770, 900], [700, 935], [640, 985], [590, 1010], [510, 1063], [180, 1205]];
const BRIDGES: [number, number][][] = [[[2030, 576], [770, 900]], [[690, 940], [650, 975]], [[630, 990], [596, 1007]], [[518, 1059], [492, 1072]]];

export const BridgeTrace: React.FC<{ src: string; at: number; len: number; label?: string }> = ({ src, at, len, label = "OVERSEAS HIGHWAY" }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: D } = useVideoConfig();
  const segs = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1])); const L = segs.reduce((a, b) => a + b, 0);
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  // tip position + arc length of any point on the route
  const along = (q: number): [number, number] => { let r = q * L; for (let i = 0; i < segs.length; i++) { if (r <= segs[i]) { const u = r / segs[i]; return [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * u, ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * u]; } r -= segs[i]; } return ROUTE[ROUTE.length - 1]; };
  const arcOf = (p: [number, number]) => { let best = 0, bd = 1e9, acc = 0; for (let i = 0; i < segs.length; i++) { for (let k = 0; k <= 20; k++) { const u = k / 20; const x = ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * u, y = ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * u; const d = Math.hypot(x - p[0], y - p[1]); if (d < bd) { bd = d; best = (acc + segs[i] * u) / L; } } acc += segs[i]; } return best; };
  const tip = along(g);
  const c0: [number, number] = [2300, 520], c1: [number, number] = [860, 1000];
  const u = io(f / D);
  const camc: [number, number] = [c0[0] + (c1[0] - c0[0]) * (0.35 * u + 0.65 * g), c0[1] + (c1[1] - c0[1]) * (0.35 * u + 0.65 * g)];
  const z = 1.9 + 0.2 * Math.sin(Math.PI * g);
  const base = (width / IW) * z;
  const tilt = 24, P = 1700;
  const PW = width * 3, PH = height * 3;
  const imgLeft = PW / 2 - camc[0] * base, imgTop = PH / 2 - camc[1] * base;
  const pl = (p: [number, number]) => [imgLeft + p[0] * base, imgTop + p[1] * base];
  const d = "M" + ROUTE.map((p) => pl(p).join(" ")).join(" L");
  return (
    <AbsoluteFill style={{ background: "#2f7f78", overflow: "hidden", perspective: P }}>
      <div style={{ position: "absolute", left: (width - PW) / 2, top: (height - PH) / 2, width: PW, height: PH, transform: `rotateX(${tilt}deg)`, background: "#3f8f86" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: imgLeft, top: imgTop, width: IW * base, height: IH * base }} />
        <div style={{ position: "absolute", left: imgLeft, top: imgTop, width: IW * base, height: IH * base, boxShadow: `0 0 ${160 * base}px ${100 * base}px #3f8f86 inset` }} />
        <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
          <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={12} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          {BRIDGES.map((b, i) => {
            const a0 = arcOf(b[0]), a1 = arcOf(b[1]); const k = Math.max(0, Math.min(1, (g - a0) / Math.max(1e-3, a1 - a0)));
            if (k <= 0) return null;
            const done = k >= 1; const m = pl(along((a0 + a1) / 2));
            return <g key={i}><path d={d} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`0 ${a0} ${(a1 - a0) * k} 2`} />
              {done && <rect x={m[0] - 11} y={m[1] - 11} width={22} height={22} fill={RED} stroke="#fff" strokeWidth={4} />}</g>;
          })}
          {g > 0 && g < 1 && (() => { const t = pl(tip); return <circle cx={t[0]} cy={t[1]} r={10} fill="#fff" />; })()}
        </svg>
      </div>
      <AbsoluteFill style={{ backdropFilter: "blur(6px)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 74%, #000 100%)", maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 74%, #000 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,20,22,.5) 0%, rgba(8,20,22,0) 32%, rgba(0,0,0,0) 82%, rgba(0,0,0,.3) 100%)" }} />
      {label && <RedLabel text={label} at={8} x={0.5} y={0.88} />}
    </AbsoluteFill>
  );
};
