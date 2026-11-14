// TOR23 (Elkhorn) — "It tracked for sixty-one minutes over thirty-two and a half miles. It passed through Waterloo, Elkhorn,
// Bennington and Blair, then crossed the Missouri into Harrison County, Iowa."
// A straight top-down run (no tilt: the neighbours' maps lean in 3-D, this one is a flat ride) over a USGS NAIP mosaic north-west of
// Omaha, the camera riding the NWS DAT centre line from 255th & Q to the river; the line is drawn behind the head at the speed the VO
// reaches each town, each town's name lifts off the ground as the line reaches it, and the camera pulls up to the whole track at the end.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];
const lens = (p: Pt[]) => { const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return L; };
const at = (p: Pt[], L: number[], u: number): Pt => { const s = u * L[L.length - 1]; for (let i = 1; i < p.length; i++) if (s <= L[i]) { const k = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k]; } return p[p.length - 1]; };
const proj = (p: Pt[], L: number[], q: Pt) => { let best = 0, bd = 1e12; for (let i = 0; i <= 400; i++) { const u = i / 400, a = at(p, L, u), d = Math.hypot(a[0] - q[0], a[1] - q[1]); if (d < bd) { bd = d; best = u; } } return best; };

export const PathRun: React.FC<{ src: string; iw: number; ih: number; path: Pt[]; towns: { name: string; p: Pt; at: number; left?: boolean }[]; endLabel: string; endAt: number; pullAt: number }> = ({ src, iw, ih, path, towns, endLabel, endAt, pullAt }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const L = lens(path);
  // progress keys: the head reaches each town on its word, the end of the line by pullAt
  const keys: [number, number][] = [[0, 0], ...towns.map((t) => [t.at, proj(path, L, t.p)] as [number, number]), [pullAt, 1]];
  keys.sort((a, b) => a[0] - b[0]);
  let u = 0; for (let i = 1; i < keys.length; i++) if (f >= keys[i - 1][0]) { const v = (f - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0]); u = keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * Math.min(1, v); }
  const head = at(path, L, u);
  const fit = Math.min(width / iw, height / ih) * 0.95, close = fit * 3.2;
  const pull = io(interpolate(f, [pullAt - 6, pullAt + 34], [0, 1], cl));
  const S = close + (fit - close) * pull;
  const c: Pt = [head[0] + ((iw / 2) - head[0]) * pull, head[1] + ((ih / 2) - head[1]) * pull];
  const W = iw * S, H = ih * S;
  const clampA = (o: number, span: number, scr: number) => span >= scr ? Math.min(0, Math.max(scr - span, o)) : (scr - span) / 2 + (o - (scr / 2 - span / 2)) * 0;
  const ox = clampA(width / 2 - c[0] * S, W, width), oy = clampA(height / 2 - c[1] * S, H, height);
  const pts = path.map(([x, y]) => [ox + x * S, oy + y * S]);
  const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
  const enter = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(28px) brightness(.35)" }} />
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, boxShadow: "0 0 60px rgba(0,0,0,.8)", width: iw * S, height: ih * S, filter: `brightness(${0.62 + 0.18 * enter}) saturate(.85) contrast(1.08)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" />
        <path d={d} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={15} pathLength={1} strokeDasharray={`${u} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={RED} strokeWidth={8} pathLength={1} strokeDasharray={`${u} 1`} strokeLinecap="round" strokeLinejoin="round" />
        {u < 1 && <circle cx={ox + head[0] * S} cy={oy + head[1] * S} r={12} fill="#fff" stroke={RED} strokeWidth={5} />}
        {towns.map((t, i) => { const g = out(interpolate(f, [t.at - 4, t.at + 10], [0, 1], cl)); if (g <= 0) return null;
          const X = ox + t.p[0] * S, Y = oy + t.p[1] * S;
          return <g key={i} opacity={g}>
            <circle cx={X} cy={Y} r={8} fill="#fff" stroke="#000" strokeWidth={2} />
            <text x={t.left ? X - 18 : X + 18} y={Y - 14 - 10 * (1 - g)} textAnchor={t.left ? "end" : "start"} fill="#fff" fontFamily="ArchivoBlk" fontWeight={900} fontSize={pull > 0.5 ? 26 : 40} style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,.8)", strokeWidth: 6 }}>{t.name}</text>
          </g>; })}
      </svg>
      <RedLabel text={endLabel} at={endAt} x={0.5} y={0.9} />
    </AbsoluteFill>
  );
};
