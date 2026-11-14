// ND06 FrameToMap — the footage frame itself folds into the map: a still of the filmed village shrinks into a white-framed card,
// tilts back and lands on its own place in the Sentinel-2 valley (the card stays pinned there), then the camera travels up the valley
// to the next named place. Places get RedLabels as they are spoken; an optional date label on the map.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Pin = { x: number; y: number; label: string; at: number };
export const FrameToMap: React.FC<{ still: string; map: string; iw: number; ih: number; home: Pin; to: Pin; foldAt: number; foldLen: number; panAt: number; panLen: number;
  z0: number; z1: number; date?: { label: string; at: number } }> = ({ still, map, iw, ih, home, to, foldAt, foldLen, panAt, panLen, z0, z1, date }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const k = io(interpolate(f, [foldAt, foldAt + foldLen], [0, 1], cl));          // fold progress
  const p = io(interpolate(f, [panAt, panAt + panLen], [0, 1], cl));              // pan home -> to
  const z = z0 * Math.pow(z1 / z0, p) * (1 + 0.03 * (f / D));
  const cx = home.x + (to.x - home.x) * p, cy = home.y + (to.y - home.y) * p;
  const base = Math.max(W / iw, H / ih) * z;
  const ox = Math.min(0, Math.max(W - iw * base, W / 2 - cx * base)), oy = Math.min(0, Math.max(H - ih * base, H * 0.52 - cy * base));
  const S = (x: number, y: number) => [ox + x * base, oy + y * base];
  const [hx, hy] = S(home.x, home.y), [tx, ty] = S(to.x, to.y);
  // the card: full frame -> small card standing above its pin
  const cw = W + (300 - W) * k, ch = cw * 9 / 16;
  const ccx = W / 2 + (hx - W / 2) * k, ccy = H / 2 + (hy - 120 - H / 2) * k;
  const tilt = 22 * k;
  const pinG = (q: Pin) => out(interpolate(f, [q.at, q.at + 12], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(map)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, opacity: interpolate(k, [0.15, 0.6], [0, 1], cl) }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 52%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)", opacity: k }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {[home, to].map((q, i) => { const g = pinG(q); if (g <= 0) return null; const [x, y] = i ? [tx, ty] : [hx, hy];
          return <g key={i}><circle cx={x} cy={y} r={30 * (1.6 - 0.6 * g)} fill="none" stroke="#fff" strokeWidth={4} opacity={g} /><circle cx={x} cy={y} r={12 * g} fill={RED} stroke="#fff" strokeWidth={4} /></g>; })}
        {k > 0.9 && <line x1={hx} y1={hy} x2={hx} y2={ccy + ch / 2} stroke="#fff" strokeWidth={3} opacity={(k - 0.9) * 10} />}
      </svg>
      <div style={{ position: "absolute", left: ccx - cw / 2, top: ccy - ch / 2, width: cw, height: ch, border: `${6 * k}px solid #fff`, boxShadow: `0 18px 50px rgba(0,0,0,${0.6 * k})`,
        overflow: "hidden", transform: `perspective(1200px) rotateX(${tilt}deg)`, transformOrigin: "50% 100%" }}>
        <Img src={staticFile(still)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <RedLabel text={home.label} at={home.at + 4} hold={Math.max(1, panAt + panLen * 0.6 - home.at)} x={hx / W} y={Math.min(0.94, (hy + 70) / H)} size={42} />
      <RedLabel text={to.label} at={to.at + 4} x={tx / W} y={Math.min(0.94, (ty + 70) / H)} size={42} />
      {date && <RedLabel text={date.label} at={date.at} x={0.5} y={0.1} size={44} />}
    </AbsoluteFill>
  );
};
