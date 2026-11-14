// TP23 StationCrest — the USGS NAIP aerial of Cheetah Hunt's loading station (the old monorail / Skyride building, Busch Gardens Tampa).
// A white box takes the station; a white line runs out of it along the real track (south, then into the wide left turn over the
// teal-roofed building), with a tick every 10 m of track and a running metre count at its head; white corner brackets close on the
// stretch of the turn where the footage shows the train stopped (directly over that teal roof), then a RedLabel gives the distance.
// mode "station": same aerial, the trace already drawn, only the station boxed + labelled (for "near the loading station").
// Coordinates are pixels of the source image (iw x ih); mpp = ground metres per image pixel.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];

export const StationCrest: React.FC<{
  src: string; iw: number; ih: number; mpp: number; path: P[]; station: [number, number, number, number]; train: [number, number, number, number];
  focus: P; z0?: number; z1?: number; mode?: "trace" | "station"; boxAt?: number; traceAt?: number; traceLen?: number; label?: string; stationLabel?: string;
}> = ({ src, iw, ih, mpp, path, station, train, focus, z0 = 1.2, z1 = 1.45, mode = "trace", boxAt = 6, traceAt = 20, traceLen = 70, label, stationLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / Math.max(1, durationInFrames - 1));
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  const T = ([x, y]: P): P => [ox + x * base, oy + y * base];
  // cumulative track length (image px) along the path
  const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  const g = mode === "station" ? 1 : io(interpolate(f, [traceAt, traceAt + traceLen], [0, 1], cl));
  const at = (d: number): { p: P; dir: P } => {
    let r = d;
    for (let i = 0; i < seg.length; i++) {
      if (r <= seg[i] || i === seg.length - 1) { const u = Math.min(1, r / seg[i]); const a = path[i], b = path[i + 1];
        return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], dir: [(b[0] - a[0]) / seg[i], (b[1] - a[1]) / seg[i]] }; }
      r -= seg[i];
    }
    return { p: path[path.length - 1], dir: [1, 0] };
  };
  const head = at(total * g);
  const meters = Math.round(total * g * mpp);
  const d = "M" + path.map((p) => T(p).join(" ")).join(" L");
  const ticks: React.ReactNode[] = [];
  for (let m = 10; m < total * mpp; m += 10) {
    if (m > total * g * mpp) break;
    const { p, dir } = at(m / mpp); const [x, y] = T(p); const nx = -dir[1] * 16, ny = dir[0] * 16;
    ticks.push(<line key={m} x1={x - nx} y1={y - ny} x2={x + nx} y2={y + ny} stroke="#fff" strokeWidth={4} />);
  }
  // station box (white, drawn on) + train brackets
  const sb = out(interpolate(f, [boxAt, boxAt + 14], [0, 1], cl));
  const [s0, s1] = [T([station[0], station[1]]), T([station[2], station[3]])];
  const tb = mode === "trace" ? out(interpolate(f, [traceAt + traceLen + 2, traceAt + traceLen + 16], [0, 1], cl)) : 0;
  const [t0, t1] = [T([train[0], train[1]]), T([train[2], train[3]])];
  const L = 34 + 24 * (1 - tb);
  const br = (x: number, y: number, sx: number, sy: number, k: number) => <path key={k} d={`M${x + sx * L} ${y} L${x} ${y} L${x} ${y + sy * L}`} fill="none" stroke="#fff" strokeWidth={6} />;
  const [hx, hy] = T(head.p);
  const sh = { filter: "drop-shadow(0 2px 6px rgba(0,0,0,.75))" };
  const img = (st: React.CSSProperties) => <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, ...st }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {img({ filter: "saturate(.92) contrast(1.06) brightness(.9)" })}
      {/* tilt-shift falloff: blurred copy outside a soft centre band */}
      <AbsoluteFill style={{ WebkitMaskImage: "radial-gradient(ellipse 62% 58% at 50% 50%, transparent 55%, #000 100%)", maskImage: "radial-gradient(ellipse 62% 58% at 50% 50%, transparent 55%, #000 100%)" }}>
        {img({ filter: "blur(7px) saturate(.85) brightness(.75)" })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, ...sh }}>
        <rect x={s0[0]} y={s0[1]} width={(s1[0] - s0[0]) * sb} height={(s1[1] - s0[1])} fill="none" stroke="#fff" strokeWidth={5} opacity={sb > 0 ? 1 : 0} />
        {g > 0 && <>
          <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={14} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          {ticks}
        </>}
        {mode === "trace" && g > 0.02 && g < 1 && <circle cx={hx} cy={hy} r={9} fill="#fff" />}
        {tb > 0 && <g opacity={tb}>{br(t0[0], t0[1], 1, 1, 0)}{br(t1[0], t0[1], -1, 1, 1)}{br(t0[0], t1[1], 1, -1, 2)}{br(t1[0], t1[1], -1, -1, 3)}</g>}
      </svg>
      {mode === "trace" && g > 0.02 && (
        <div style={{ position: "absolute", left: hx + 26, top: hy - 64, fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 40, color: "#fff",
          textShadow: "0 2px 8px rgba(0,0,0,.8), 0 0 2px rgba(0,0,0,.9)", opacity: g < 1 ? 1 : interpolate(f, [traceAt + traceLen, traceAt + traceLen + 8], [1, 0], cl) }}>{meters} M</div>
      )}
      {stationLabel && <RedLabel text={stationLabel} at={boxAt + 10} x={((s0[0] + s1[0]) / 2) / width} y={Math.max(0.08, (s0[1] - 40) / height)} size={40} />}
      {label && mode === "trace" && <RedLabel text={label} at={traceAt + traceLen + 14} x={Math.min(0.8, Math.max(0.2, ((t0[0] + t1[0]) / 2) / width))} y={Math.min(0.92, (t1[1] + 60) / height)} size={42} />}
    </AbsoluteFill>
  );
};
