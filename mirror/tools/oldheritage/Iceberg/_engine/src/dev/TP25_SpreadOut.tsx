// TP25 SpreadOut — why a stalled chairlift is a slow rescue. White-line 2.5-D over a dark blurred copy of the night footage:
// (1) a coaster train: every rider packed in one cluster, one bracket round the lot; (2) the train shrinks to the corner and a long
// cable draws away into depth, 100 two-seat chairs (200 riders) dropping onto it one after another; (3) a bucket truck rises to the
// nearest chair, then the next, one at a time, while a bracket ripples out along the line to every chair: each is its own rescue.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const W = "#fff";

// camera
const FOC = 900, CX = 960, CY = 600;
const proj = (X: number, Y: number, Z: number, yaw: number) => {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const x = X * c - (Z - 3000) * s, z = X * s + (Z - 3000) * c + 3000;
  return { x: CX + (FOC * x) / z, y: CY + (FOC * Y) / z, k: FOC / z };
};
const N = 100;
const L = 24000;
const cableAt = (u: number) => ({ X: -500 + 0.3 * L * u, Y: -330, Z: 500 + 0.95 * L * u });
const chairU = (i: number) => (200 + i * 236) / L;

export const SpreadOut: React.FC<{ bg: string; bgFrom?: number; t: { train: number; spread: number; one: number; every: number } }> = ({ bg, bgFrom = 0, t }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const yaw = interpolate(f, [0, durationInFrames], [0.02, -0.02]);
  const fadeIn = interpolate(f, [0, 8], [0, 1], cl);

  // --- 1. the coaster train
  const tg = out(interpolate(f, [t.train, t.train + 14], [0, 1], cl));
  const shrink = io(interpolate(f, [t.spread - 4, t.spread + 14], [0, 1], cl));
  const trS = 1 - 0.68 * shrink, trX = 960 + (300 - 960) * shrink, trY = 560 + (930 - 560) * shrink;
  const cars = 7, carW = 150, carH = 74, gap = 14, trainW = cars * carW + (cars - 1) * gap;
  const bracketG = out(interpolate(f, [t.train + 26, t.train + 38], [0, 1], cl));

  // --- 2. the cable and its chairs
  const cableG = io(interpolate(f, [t.spread, t.spread + 40], [0, 1], cl));
  const pts = Array.from({ length: 81 }, (_, i) => { const c = cableAt(i / 80); return proj(c.X, c.Y, c.Z, yaw); });
  const cableD = "M" + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L");
  const chairIn = (i: number) => out(interpolate(f, [t.spread + 6 + i * 0.5, t.spread + 16 + i * 0.5], [0, 1], cl));

  // --- 3. the bucket: one chair at a time (near chairs), brackets ripple out to every chair
  const stops = [0, 1, 2, 3];
  const hop = 20; // frames per chair for the bucket
  const bi = Math.max(0, (f - t.one) / hop);
  const seg = Math.min(stops.length - 1, Math.floor(bi)), fr = io(Math.min(1, Math.max(0, bi - seg) * 1.6));
  const tgtU = (j: number) => chairU(stops[Math.min(stops.length - 1, j)]);
  const u = f < t.one ? chairU(0) : tgtU(seg) + (tgtU(seg + 1) - tgtU(seg)) * (seg < stops.length - 1 ? fr : 0);
  const rise = out(interpolate(f, [t.one - 14, t.one + 4], [0, 1], cl));
  const cb = cableAt(u);
  const basket = proj(cb.X + 120, cb.Y + 175, cb.Z - 20, yaw);
  const truck = proj(cb.X + 330, 330, cb.Z - 20, yaw);
  const emptied = (i: number) => { const j = stops.indexOf(i); return j < 0 ? 0 : interpolate(f, [t.one + j * hop + 8, t.one + j * hop + 14], [0, 1], cl); };
  const ripple = (i: number) => out(interpolate(f, [t.every + i * 0.42, t.every + i * 0.42 + 8], [0, 1], cl));

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fadeIn }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(16px) brightness(.32) saturate(.7)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* ground line of the midway, receding */}
        {(() => { const a = proj(-900, 330, 450, yaw), b = proj(3200, 330, 6400, yaw);
          return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,.22)" strokeWidth={2} opacity={cableG} />; })()}

        {/* the cable */}
        <path d={cableD} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={9} pathLength={1} strokeDasharray={`${cableG} 1`} />
        <path d={cableD} fill="none" stroke={W} strokeWidth={4} pathLength={1} strokeDasharray={`${cableG} 1`} />

        {/* the chairs: far first so near ones draw on top */}
        {Array.from({ length: N }, (_, i) => N - 1 - i).map((i) => {
          const g = chairIn(i); if (g <= 0) return null;
          const c = cableAt(chairU(i)); const top = proj(c.X, c.Y, c.Z, yaw), seat = proj(c.X, c.Y + 130 * g, c.Z, yaw);
          const k = seat.k, sw = 74 * k, sh = 34 * k, e = emptied(i), rp = ripple(i);
          const lw = Math.max(1.2, 4 * k);
          return <g key={i} opacity={g}>
            <line x1={top.x} y1={top.y} x2={seat.x} y2={seat.y} stroke={W} strokeWidth={lw} />
            <rect x={seat.x - sw / 2} y={seat.y} width={sw} height={sh} fill="rgba(0,0,0,.6)" stroke={W} strokeWidth={lw} />
            {[-1, 1].map((s) => <circle key={s} cx={seat.x + s * sw * 0.22} cy={seat.y - 8 * k} r={Math.max(1.2, 11 * k)} fill={W} opacity={1 - e} />)}
            {rp > 0 && (() => { const p = 1.0 - 0.25 * rp, bw = sw * 1.5 * (1 + 0.25 * (1 - rp)), bh = (sh + 40 * k) * 1.5 * p, bx = seat.x, by = seat.y + sh / 2 - 6 * k, cc = Math.min(bw, bh) * 0.28;
              const br = (sx: number, sy: number) => `M${bx + sx * bw / 2} ${by + sy * (bh / 2 - cc)} L${bx + sx * bw / 2} ${by + sy * bh / 2} L${bx + sx * (bw / 2 - cc)} ${by + sy * bh / 2}`;
              return <g opacity={rp} fill="none" stroke={W} strokeWidth={Math.max(1.2, 3.5 * k)}><path d={br(-1, -1)} /><path d={br(1, -1)} /><path d={br(-1, 1)} /><path d={br(1, 1)} /></g>; })()}
          </g>;
        })}

        {/* the bucket truck */}
        {rise > 0 && (() => {
          const bk = basket.k, bw = 120 * bk, bh = 60 * bk;
          const tip = { x: truck.x + (basket.x - truck.x) * rise, y: truck.y + (basket.y + bh - truck.y) * rise };
          return <g opacity={Math.min(1, rise * 2)}>
            <rect x={truck.x - 150 * truck.k} y={truck.y - 70 * truck.k} width={300 * truck.k} height={70 * truck.k} fill="rgba(0,0,0,.6)" stroke={W} strokeWidth={4} />
            <line x1={truck.x} y1={truck.y - 60 * truck.k} x2={tip.x} y2={tip.y} stroke={W} strokeWidth={7} strokeLinecap="round" />
            <rect x={tip.x - bw / 2} y={tip.y - bh} width={bw} height={bh} fill="rgba(0,0,0,.6)" stroke={W} strokeWidth={4} />
          </g>;
        })()}

        {/* the coaster: one train, everyone together */}
        {tg > 0 && <g opacity={tg * (1 - 0.35 * shrink)} transform={`translate(${trX} ${trY}) scale(${trS * (0.94 + 0.06 * tg)})`}>
          <path d={`M${-trainW / 2 - 120} ${carH / 2 + 22} Q 0 ${carH / 2 + 60} ${trainW / 2 + 120} ${carH / 2 + 22}`} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={4} />
          {Array.from({ length: cars }, (_, c) => {
            const x0 = -trainW / 2 + c * (carW + gap), yo = 14 * Math.pow((x0 + carW / 2) / (trainW / 2), 2);
            return <g key={c} transform={`translate(${x0} ${-carH / 2 + 24 - yo})`}>
              <rect x={0} y={0} width={carW} height={carH} rx={14} fill="rgba(0,0,0,.6)" stroke={W} strokeWidth={5} />
              {[0, 1].map((r) => [0, 1].map((s) => <circle key={`${r}${s}`} cx={carW * (0.3 + 0.4 * s)} cy={-12 - r * 26} r={13} fill={W} />))}
            </g>;
          })}
          {bracketG > 0 && (() => { const bw = trainW + 120, bh = 230, cc = 50, s = 1 + 0.08 * (1 - bracketG);
            const br = (sx: number, sy: number) => `M${sx * bw / 2 * s} ${10 + sy * (bh / 2 - cc) * s} L${sx * bw / 2 * s} ${10 + sy * bh / 2 * s} L${sx * (bw / 2 - cc) * s} ${10 + sy * bh / 2 * s}`;
            return <g opacity={bracketG} fill="none" stroke={W} strokeWidth={6}><path d={br(-1, -1)} /><path d={br(1, -1)} /><path d={br(-1, 1)} /><path d={br(1, 1)} /></g>; })()}
        </g>}
      </svg>
    </AbsoluteFill>
  );
};
