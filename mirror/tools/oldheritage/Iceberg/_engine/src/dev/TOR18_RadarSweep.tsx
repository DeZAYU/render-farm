// TOR18 RadarSweep: the real 4:10 AM radar mosaic (IEM NEXRAD n0q, 09:10 UTC 6 Dec 2021) over NASA Black Marble city lights.
// The Louisville radar's beam turns once round its site, painting the echoes as it passes (older returns fade); the tornado is a short
// pulse at Frankfort that appears just after the beam has gone by and is gone before the beam comes back round.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type P = { base: string; radar: string; iw: number; ih: number; site: [number, number]; town: [number, number];
  a0: number; period: number; blip: [number, number]; z0?: number; z1?: number; townLabel: string; townAt: number; stamp: string; stampAt: number };

export const RadarSweep: React.FC<P> = ({ base, radar, iw, ih, site, town, a0, period, blip, z0 = 1.0, z1 = 1.3, townLabel, townAt, stamp, stampAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(f / durationInFrames), z = z0 + (z1 - z0) * t;
  const b = Math.max(width / iw, height / ih) * z;
  // frame drifts from the scene centre toward the town
  const fx = iw / 2 + (town[0] - iw / 2) * t * 0.8, fy = ih / 2 + (town[1] - ih / 2) * t * 0.8;
  const ox = Math.min(0, Math.max(width - iw * b, width / 2 - fx * b)), oy = Math.min(0, Math.max(height - ih * b, height / 2 - fy * b));
  const ang = a0 + (360 * f) / period; // beam bearing, degrees clockwise from north
  const sx = site[0] * b + ox, sy = site[1] * b + oy, tx = town[0] * b + ox, ty = town[1] * b + oy;
  const fin = interpolate(f, [0, 10], [0, 1], cl);
  // painted echoes: brightest just behind the beam, oldest (just ahead of it) dim
  const mask = `conic-gradient(from ${ang.toFixed(2)}deg at ${site[0]}px ${site[1]}px, rgba(0,0,0,.22) 0deg, rgba(0,0,0,.55) 200deg, rgba(0,0,0,1) 359deg, rgba(0,0,0,1) 360deg)`;
  const R = Math.hypot(width, height) * 1.2;
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const ex = sx + Math.cos(rad(ang)) * R, ey = sy + Math.sin(rad(ang)) * R;
  // the tornado pulse
  const bl = interpolate(f, [blip[0], blip[0] + 6, blip[1] - 14, blip[1]], [0, 1, 1, 0], cl);
  const pulse = 1 + 0.18 * Math.sin((f - blip[0]) / 3.2);
  const pin = out(interpolate(f, [townAt - 6, townAt + 6], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fin }}>
      <div style={{ position: "absolute", left: ox, top: oy, width: iw, height: ih, transform: `scale(${b})`, transformOrigin: "0 0" }}>
        <Img src={staticFile(base)} style={{ position: "absolute", inset: 0, width: iw, height: ih, filter: "brightness(1.15)" }} />
        <Img src={staticFile(radar)} style={{ position: "absolute", inset: 0, width: iw, height: ih, opacity: 0.86, filter: "saturate(.82) brightness(.95)", WebkitMaskImage: mask, maskImage: mask }} />
      </div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="beam" gradientUnits="userSpaceOnUse" x1={sx} y1={sy} x2={ex} y2={ey}>
            <stop offset="0" stopColor="#fff" stopOpacity={0.95} /><stop offset="0.55" stopColor="#fff" stopOpacity={0.35} /><stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* trailing glow wedge + the beam */}
        {[6, 4, 2].map((w, i) => { const a1 = ang - w; return <path key={i} d={`M ${sx} ${sy} L ${sx + Math.cos(rad(a1)) * R} ${sy + Math.sin(rad(a1)) * R} L ${ex} ${ey} Z`} fill="#fff" opacity={0.035 + i * 0.02} />; })}
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="url(#beam)" strokeWidth={3} />
        <circle cx={sx} cy={sy} r={9} fill="#fff" stroke="rgba(0,0,0,.6)" strokeWidth={2} />
        {/* the town: a white ring pin */}
        <g opacity={pin}><circle cx={tx} cy={ty} r={16 * (1.4 - 0.4 * pin)} fill="none" stroke="#fff" strokeWidth={4} /><circle cx={tx} cy={ty} r={4} fill="#fff" /></g>
        {/* the tornado: under thirty seconds on the ground */}
        {bl > 0 && <g opacity={bl}><circle cx={tx} cy={ty} r={52 * pulse} fill="rgba(227,20,27,.28)" stroke="rgba(255,255,255,.5)" strokeWidth={2} /><circle cx={tx} cy={ty} r={19} fill={RED} stroke="#fff" strokeWidth={4} /></g>}
      </svg>
      <RedLabel text={townLabel} at={townAt} x={tx / width} y={(ty + 62) / height} size={38} />
      <RedLabel text={stamp} at={stampAt} x={0.5} y={0.9} size={40} />
    </AbsoluteFill>
  );
};
