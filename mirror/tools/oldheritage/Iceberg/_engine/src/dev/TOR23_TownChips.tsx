// TOR23 (Elkhorn) — "It tracked for sixty-one minutes over thirty-two and a half miles. It passed through Waterloo, Elkhorn,
// Bennington and Blair, then crossed the Missouri into Harrison County, Iowa."
// Not a map ride (the neighbours ride their tracks): a MILEAGE RAIL. A white rail 0-32.5 mi runs along the bottom; the head travels it
// with the VO, and as it reaches each town a square aerial chip of THAT town (cut from one USGS NAIP mosaic, the NWS DAT centre line
// drawn red through it) flies in on a 3-D swing and settles in a row above the rail at its own mile; the last chip is the river crossing.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];
const lens = (p: Pt[]) => { const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return L; };
const at = (p: Pt[], L: number[], u: number): Pt => { const s = u * L[L.length - 1]; for (let i = 1; i < p.length; i++) if (s <= L[i]) { const k = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k]; } return p[p.length - 1]; };
const proj = (p: Pt[], L: number[], q: Pt) => { let best = 0, bd = 1e12; for (let i = 0; i <= 600; i++) { const u = i / 600, a = at(p, L, u), d = Math.hypot(a[0] - q[0], a[1] - q[1]); if (d < bd) { bd = d; best = u; } } return best; };

export const TownChips: React.FC<{ src: string; iw: number; ih: number; path: Pt[]; miles: number; towns: { name: string; p: Pt; at: number }[]; chipPx?: number; endLabel: string; endAt: number; bg: string; bgFrom: number }> = ({ src, iw, ih, path, miles, towns, chipPx = 520, endLabel, endAt }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const L = lens(path);
  const us = towns.map((t) => proj(path, L, t.p));
  // head along the rail: reaches each town's mile on its word
  const keys: [number, number][] = [[0, 0], ...towns.map((t, i) => [t.at, us[i]] as [number, number]), [Math.max(endAt, towns[towns.length - 1].at + 20), 1]];
  let u = 0; for (let i = 1; i < keys.length; i++) if (f >= keys[i - 1][0]) u = keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * io(Math.min(1, (f - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0])));
  const rx0 = 150, rx1 = width - 150, ry = 930, RX = (v: number) => rx0 + (rx1 - rx0) * v;
  const n = towns.length, cw = Math.min(310, (rx1 - rx0 - (n - 1) * 30) / n), slot = (i: number) => rx0 + i * (cw + 30);
  const enter = out(interpolate(f, [0, 14], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, #1d2124 0%, #060606 100%)", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -80, width: width + 160, height: height + 160, objectFit: "cover", filter: "blur(30px) brightness(.28) saturate(.7)" }} />
      <AbsoluteFill style={{ perspective: 1400 }}>
        {towns.map((t, i) => {
          const g = out(interpolate(f, [t.at - 6, t.at + 16], [0, 1], cl)); if (g <= 0) return null;
          const k = cw / chipPx; // chip px -> screen
          // the track inside this chip
          const hp = at(path, L, us[i]); const cx = (hp[0] * 2 + t.p[0]) / 3, cy = (hp[1] * 2 + t.p[1]) / 3, x0 = cx - chipPx / 2, y0 = cy - chipPx / 2;
          const d = "M" + path.map(([x, y]) => `${((x - x0) * k).toFixed(1)} ${((y - y0) * k).toFixed(1)}`).join(" L");
          const left = slot(i), top = 300;
          const fromX = RX(us[i]) - cw / 2;
          const X = fromX + (left - fromX) * g, Y = ry - 40 + (top - (ry - 40)) * g;
          return (
            <div key={i} style={{ position: "absolute", left: X, top: Y, width: cw, height: cw, border: "5px solid #fff", overflow: "hidden", boxShadow: "0 24px 50px rgba(0,0,0,.7)",
              transform: `rotateY(${(1 - g) * -70}deg) rotateX(${(1 - g) * 30}deg) scale(${0.3 + 0.7 * g})`, transformOrigin: "50% 100%", opacity: Math.min(1, g * 1.6) }}>
              <Img src={staticFile(src)} style={{ position: "absolute", left: -x0 * k, top: -y0 * k, width: iw * k, height: ih * k, maxWidth: "none" }} />
              <svg width={cw} height={cw} style={{ position: "absolute", inset: 0 }}>
                <path d={d} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={11} strokeLinecap="round" />
                <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "8px 12px", background: "linear-gradient(0deg, rgba(0,0,0,.75), rgba(0,0,0,0))", fontFamily: "ArchivoBlk", fontWeight: 900, fontSize: 26, color: "#fff", letterSpacing: "0.02em" }}>{t.name}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={rx0} y1={ry} x2={rx1} y2={ry} stroke="#fff" strokeWidth={4} opacity={enter} />
        <line x1={rx0} y1={ry} x2={RX(u)} y2={ry} stroke={RED} strokeWidth={10} strokeLinecap="round" />
        {Array.from({ length: Math.floor(miles / 5) + 1 }, (_, i) => i * 5).map((m) => (
          <g key={m} opacity={enter}><line x1={RX(m / miles)} y1={ry + 10} x2={RX(m / miles)} y2={ry + 26} stroke="#fff" strokeWidth={3} />
            <text x={RX(m / miles)} y={ry + 58} fill="rgba(255,255,255,.8)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={24} textAnchor="middle">{m} MI</text></g>
        ))}
        {towns.map((t, i) => { const g = out(interpolate(f, [t.at - 6, t.at + 10], [0, 1], cl)); if (g <= 0) return null;
          return <line key={i} x1={RX(us[i])} y1={ry} x2={slot(i) + cw / 2} y2={300 + cw} stroke="rgba(255,255,255,.45)" strokeWidth={2} opacity={g} strokeDasharray="6 6" />; })}
        <circle cx={RX(u)} cy={ry} r={13} fill="#fff" stroke={RED} strokeWidth={5} />
      </svg>
      <RedLabel text={endLabel} at={endAt} x={0.5} y={0.16} />
    </AbsoluteFill>
  );
};
