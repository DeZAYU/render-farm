// TOR11 SatDive: NASA Aqua MODIS true colour of the day itself (6 May 2012, ~13:30 JST pass, NASA GIBS): Japan from orbit, then the
// Kanto plain with the storm's anvil sitting over Ibaraki. A slow eased camera (one monotone path), a thin white box marks the area it
// dives into, and white pins with red labels drop on the places as the VO names them (pins sit on top of the cloud deck).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RED, RedLabel } from "../brand";
import { mono } from "./TOR09_util";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];
export const SatDive: React.FC<{ src: string; iw: number; ih: number; cam: [number, number, number, number][];
  box?: { r: [number, number, number, number]; at: number }; pins?: { name: string; p: Pt; at: number; dx?: number; dy?: number; small?: boolean }[]; label?: { text: string; at: number } }> = ({ src, iw, ih, cam, box, pins = [], label }) => {
  const f = useCurrentFrame();
  const cx = mono(cam.map((k) => [k[0], k[1]])), cy = mono(cam.map((k) => [k[0], k[2]])), cz = mono(cam.map((k) => [k[0], Math.log(k[3])]));
  const base = Math.max(1920 / iw, 1080 / ih) * Math.exp(cz(f));
  const ox = Math.min(0, Math.max(1920 - iw * base, 960 - cx(f) * base)), oy = Math.min(0, Math.max(1080 - ih * base, 540 - cy(f) * base));
  const P = (p: Pt): Pt => [ox + p[0] * base, oy + p[1] * base];
  const fade = interpolate(f, [0, 12], [0, 1], cl);
  let boxEl: React.ReactNode = null;
  if (box) { const g = out(interpolate(f, [box.at, box.at + 16], [0, 1], cl)); const a = P([box.r[0], box.r[1]]), b = P([box.r[2], box.r[3]]); const w = b[0] - a[0], h = b[1] - a[1], per = 2 * (w + h);
    boxEl = <rect x={a[0]} y={a[1]} width={w} height={h} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray={per} strokeDashoffset={per * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />; }
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fade }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, maxWidth: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {boxEl}
        {pins.map((t, i) => { const g = out(interpolate(f, [t.at, t.at + 10], [0, 1], cl)); if (g <= 0) return null; const p = P(t.p); const r = (t.small ? 6 : 9) * g + 3;
          return <g key={i} opacity={g}><circle cx={p[0]} cy={p[1]} r={r + 6} fill="rgba(0,0,0,.35)" /><circle cx={p[0]} cy={p[1]} r={r} fill={RED} stroke="#fff" strokeWidth={3} /></g>; })}
      </svg>
      {pins.map((t, i) => { const p = P(t.p); return <RedLabel key={i} text={t.name} at={t.at + 2} x={(p[0] + (t.dx ?? 0)) / 1920} y={(p[1] + (t.dy ?? -52)) / 1080} size={t.small ? 30 : 38} />; })}
      {label && <RedLabel text={label.text} at={label.at} x={0.5} y={0.9} />}
    </AbsoluteFill>
  );
};
