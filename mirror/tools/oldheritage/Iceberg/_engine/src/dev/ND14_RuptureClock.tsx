// ND14 RuptureClock: the rupture racing along the fault on a real map (NASA Blue Marble), a white seconds counter in a framed box
// running in step with the red line (0 -> 85 s over ~500 km). Mode "reach": a dashed line from the epicentre to a far city (Bangkok).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];
const lenOf = (p: Pt[]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
const along = (p: Pt[], d: number): Pt[] => { const out: Pt[] = [p[0]]; let acc = 0; for (let i = 1; i < p.length; i++) { const L = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (acc + L >= d) { const t = (d - acc) / L; out.push([p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t]); return out; } acc += L; out.push(p[i]); } return out; };

export const RuptureClock: React.FC<{ src: string; iw: number; ih: number; epi: Pt; north: Pt[]; south: Pt[]; at: number; len: number; secs: number; focus: Pt; z0: number; z1: number; label?: string; labelAt?: number;
  reach?: { to: Pt; label: string; at: number; dist?: string } }> = ({ src, iw, ih, epi, north, south, at, len, secs, focus, z0, z1, label, labelAt, reach }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * (z0 + (z1 - z0) * u);
  const fx = reach ? focus[0] + (((epi[0] + reach.to[0]) / 2) - focus[0]) * io(interpolate(f, [reach.at - 6, reach.at + 30], [0, 1], cl)) : focus[0];
  const fy = reach ? focus[1] + (((epi[1] + reach.to[1]) / 2) - focus[1]) * io(interpolate(f, [reach.at - 6, reach.at + 30], [0, 1], cl)) : focus[1];
  const ox = width / 2 - fx * base, oy = height / 2 - fy * base;
  const S = (p: Pt) => [ox + p[0] * base, oy + p[1] * base];
  const g = interpolate(f, [at, at + len], [0, 1], cl); // linear: the rupture runs at a steady speed
  const Ln = lenOf(north), Ls = lenOf(south), Lmax = Math.max(Ln, Ls);
  const pn = along(north, Math.min(Ln, g * Lmax)), ps = along(south, Math.min(Ls, g * Lmax));
  const dn = "M" + pn.map((p) => S(p).join(" ")).join(" L"), ds = "M" + ps.map((p) => S(p).join(" ")).join(" L");
  const [ex, ey] = S(epi);
  const sec = Math.round(g * secs);
  const showClock = !reach && f >= at - 6;
  const r = reach ? out(interpolate(f, [reach.at, reach.at + 26], [0, 1], cl)) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(18px) brightness(.4)" }} />
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "brightness(.72) saturate(.85) contrast(1.05)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {[dn, ds].map((d, i) => <g key={i}><path d={d} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke={RED} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /></g>)}
        {g > 0 && g < 1 && [pn, ps].map((p, i) => { if ((i === 0 && g * Lmax >= Ln) || (i === 1 && g * Lmax >= Ls)) return null; const [x, y] = S(p[p.length - 1]); return <circle key={i} cx={x} cy={y} r={10 + 4 * Math.sin(f * 0.6)} fill="#fff" opacity={0.9} />; })}
        <circle cx={ex} cy={ey} r={13} fill="#fff" stroke={RED} strokeWidth={5} />
        {reach && r > 0 && (() => { const [tx, ty] = S(reach.to); const x = ex + (tx - ex) * r, y = ey + (ty - ey) * r;
          return <g><line x1={ex} y1={ey} x2={x} y2={y} stroke="#fff" strokeWidth={5} strokeDasharray="18 12" />{r > 0.97 && <circle cx={tx} cy={ty} r={13} fill={RED} stroke="#fff" strokeWidth={5} />}</g>; })()}
      </svg>
      {showClock && <div style={{ position: "absolute", right: 120, top: 110, border: "5px solid #fff", background: "rgba(0,0,0,.55)", padding: "10px 26px", fontFamily: "ArchivoBlk", fontWeight: 900, fontSize: 84, color: "#fff", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {String(sec).padStart(2, "0")}<span style={{ fontSize: 40, marginLeft: 8, opacity: 0.8 }}>SEC</span></div>}
      {label && <RedLabel text={label} at={labelAt ?? at} x={Math.min(0.8, (ex + 260) / width)} y={ey / height} size={38} />}
      {reach && (() => { const [tx, ty] = S(reach.to); return <RedLabel text={reach.label} at={reach.at + 24} x={Math.min(0.85, tx / width)} y={Math.min(0.9, (ty + 70) / height)} size={42} />; })()}
      {reach?.dist && (() => { const [tx, ty] = S(reach.to); return <RedLabel text={reach.dist} at={reach.at + 32} x={((ex + tx) / 2 + 150) / width} y={((ey + ty) / 2) / height} size={34} />; })()}
    </AbsoluteFill>
  );
};
