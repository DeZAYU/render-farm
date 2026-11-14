// TP16 CapsuleTurn: the Starflyer's stopped ring seen from above (2.5-D, slightly tilted), drawn in white line over the darkened real
// footage. Ten capsules hang round the star crown; the fire brigade's aerial platform sits fixed at the front of the ring.
//   mode "gap":   brake on, the ring cannot move; the basket faces an empty slot between two capsules (red dashed slot).
//   mode "turn":  the brake released by hand: the ring is nudged round in short hand-pulls until a capsule sits at the basket.
//   mode "cycle": each capsule held at the basket, its riders (white dots, 19 in all) cross over, the basket goes down, the ring is
//                 pulled round to the next one; a red tally counts the capsules emptied (1 ... 10), the first slow, then faster.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const N = 10, STEP = (Math.PI * 2) / N, FRONT = Math.PI / 2;
const RIDERS = Array.from({ length: N }, (_, i) => (i === 6 ? 1 : 2)); // 19 riders (13 adults, 6 children) — split per capsule unknown

/** hand-turn: a move of `d` radians made of `k` short pulls with pauses (not a smooth motor turn) */
const handTurn = (u: number, d: number, k: number) => {
  const seg = Math.min(k - 1e-6, Math.floor(u * k)), w = u * k - seg;
  return (d / k) * (seg + io(Math.min(1, w / 0.62)));
};

export const CapsuleTurn: React.FC<{ bg: string; bgFrom?: number; mode: "gap" | "turn" | "cycle"; turnAt?: [number, number]; endAt?: number; tallyY?: number }> = ({ bg, bgFrom = 0, mode, turnAt = [20, 90], endAt = 200 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const cx = width / 2, cy = height * 0.4, R = 430, flat = 0.58;
  const enter = out(interpolate(f, [0, 12], [0, 1], cl));

  // ring angle (capsule 0 at angle rot) + per-capsule state
  let rot = FRONT + STEP / 2; // gap: the platform falls between capsules 0 and 9
  let active = -1, emptied = 0, crossing = 0, basketDown = 0, held = 0;
  if (mode === "turn") {
    const u = interpolate(f, [turnAt[0], turnAt[1]], [0, 1], cl);
    rot = FRONT + STEP / 2 - handTurn(u, STEP / 2, 4);
    if (u >= 1) { active = 0; held = out(interpolate(f, [turnAt[1], turnAt[1] + 10], [0, 1], cl)); }
  }
  if (mode === "cycle") {
    // schedule: ten cycles that end at endAt, the first slow, then faster (each: hold + cross + basket down + pull round)
    const w = Array.from({ length: N }, (_, k) => Math.max(0.24, Math.pow(0.7, k)));
    const sc = (endAt - 8) / w.reduce((a, b) => a + b, 0);
    let t0 = 8, k = 0;
    for (; k < N; k++) { const d = w[k] * sc; if (f < t0 + d) break; t0 += d; }
    const d = k < N ? w[k] * sc : 1, u = k < N ? (f - t0) / d : 1;
    emptied = k; active = k < N ? k : -1;
    crossing = k < N ? interpolate(u, [0.08, 0.5], [0, 1], cl) : 1;
    basketDown = k < N ? interpolate(u, [0.5, 0.68], [0, 1], cl) : 1;
    held = k < N ? interpolate(u, [0, 0.08, 0.66, 0.72], [0, 1, 1, 0], cl) : 0;
    const pull = k < N ? handTurn(interpolate(u, [0.7, 1], [0, 1], cl), STEP, k < 2 ? 3 : 2) : 0;
    rot = FRONT - STEP * Math.min(k, N - 1) - (k < N - 1 ? pull : 0) + (k >= N ? 0 : 0);
    if (k >= N) rot = FRONT - STEP * (N - 1);
  }
  const P = (th: number, r: number) => ({ x: cx + Math.cos(th) * r, y: cy + Math.sin(th) * r * flat, z: Math.sin(th) });
  const plat = P(FRONT, R + 150);
  const caps = Array.from({ length: N }, (_, i) => {
    const th = rot + i * STEP; const p = P(th, R); const s = 0.8 + 0.25 * (p.z + 1) / 2;
    const swing = mode === "gap" ? Math.sin(f / 9 + i) * 3 : 0;
    return { i, th, ...p, x: p.x + swing, s };
  }).sort((a, b) => a.z - b.z);
  const gapShow = mode === "gap" ? out(interpolate(f, [16, 34], [0, 1], cl)) : mode === "turn" ? interpolate(f, [turnAt[0], turnAt[1]], [1, 0], cl) : 0;
  // star crown seen from above (the Starflyer's red-and-yellow star), outline only
  const star = Array.from({ length: 32 }, (_, j) => { const a = (j / 32) * Math.PI * 2 + rot * 0.0; const r = j % 2 ? 80 : 230; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r * flat}`; }).join(" ");
  const box = (c: typeof caps[number]) => {
    const w = 84 * c.s, h = 70 * c.s, isA = c.i === active, done = mode === "cycle" && (c.i < emptied || (isA && crossing >= 1));
    const n = RIDERS[c.i], left = isA ? n * (1 - crossing) : done ? 0 : n;
    return (
      <g key={c.i} opacity={mode === "cycle" && c.i < emptied ? 0.45 : 1}>
        <line x1={cx + Math.cos(c.th) * 180} y1={cy + Math.sin(c.th) * 180 * flat} x2={c.x} y2={c.y} stroke="rgba(255,255,255,.45)" strokeWidth={2} />
        <rect x={c.x - w / 2} y={c.y - h / 2} width={w} height={h} rx={10 * c.s} fill="rgba(0,0,0,.55)" stroke={isA ? RED : "#fff"} strokeWidth={isA ? 6 : 4} />
        {[-1, 0, 1].map((b) => <line key={b} x1={c.x + b * w * 0.22} y1={c.y - h / 2 + 4} x2={c.x + b * w * 0.22} y2={c.y + h / 2 - 4} stroke="rgba(255,255,255,.3)" strokeWidth={1.5} />)}
        {Array.from({ length: Math.ceil(left) }, (_, j) => <circle key={j} cx={c.x + (n === 1 ? 0 : (j ? 16 : -16)) * c.s} cy={c.y} r={10 * c.s} fill="#fff" opacity={Math.min(1, left - j)} />)}
      </g>
    );
  };
  // the riders crossing: dots travel from the active capsule into the basket, then the basket drops away (down the boom)
  const ac = caps.find((c) => c.i === active);
  const bDrop = basketDown * 60, bOp = 1 - basketDown * 0.85;
  const crossDots = mode === "cycle" && ac ? Array.from({ length: RIDERS[active] }, (_, j) => {
    const u = io(interpolate(crossing, [j * 0.25, j * 0.25 + 0.75], [0, 1], cl)); if (u <= 0) return null;
    const x = ac.x + (plat.x - ac.x) * u + (j ? 14 : -14) * u, y = ac.y + (plat.y - ac.y) * u - Math.sin(u * Math.PI) * 26 + bDrop * u;
    return <circle key={j} cx={x} cy={y} r={8} fill="#fff" opacity={u >= 1 ? bOp : 1} />;
  }) : null;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(8px) brightness(.4) saturate(.75)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: enter }}>
        {/* the ring's track and the crown */}
        <ellipse cx={cx} cy={cy} rx={R} ry={R * flat} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={2} strokeDasharray="6 10" />
        <polygon points={star} fill="rgba(0,0,0,.35)" stroke="rgba(255,255,255,.8)" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={22} fill="#000" stroke="#fff" strokeWidth={4} />
        {caps.filter((c) => c.z < 0.2).map(box)}
        {/* the aerial platform: boom from off-frame to a basket fixed at the front of the ring */}
        <g opacity={bOp + (1 - bOp) * 0} transform={`translate(0 ${bDrop})`}>
          <line x1={plat.x + 40} y1={plat.y + 20} x2={width * 0.92} y2={height + 40} stroke="#fff" strokeWidth={10} />
          <line x1={plat.x + 40} y1={plat.y + 20} x2={width * 0.92} y2={height + 40} stroke="#000" strokeWidth={4} strokeDasharray="14 16" />
          <rect x={plat.x - 85} y={plat.y - 30} width={170} height={66} fill="rgba(0,0,0,.6)" stroke="#fff" strokeWidth={5} />
        </g>
        {caps.filter((c) => c.z >= 0.2).map(box)}
        {crossDots}
        {/* held in place: a short clamp between basket and capsule */}
        {ac && held > 0 && <line x1={ac.x} y1={ac.y + 27 * ac.s} x2={plat.x} y2={plat.y - 26} stroke="#fff" strokeWidth={5} opacity={held} />}
        {/* the gap the crews could not close */}
        {gapShow > 0 && (() => { const slot = P(FRONT, R), w = 84 * 1.05, h = 70 * 1.05; return (
          <g opacity={gapShow}>
            <rect x={slot.x - w / 2} y={slot.y - h / 2} width={w} height={h} rx={10} fill="none" stroke={RED} strokeWidth={5} strokeDasharray="10 8" />
            <line x1={slot.x} y1={slot.y + h / 2 + 4} x2={plat.x} y2={plat.y - 34} stroke={RED} strokeWidth={5} strokeDasharray="10 8" />
          </g>); })()}
      </svg>
      {mode === "cycle" && <RedLabel text={`${Math.min(N, emptied + (active >= 0 && crossing >= 1 ? 1 : 0))} / 10`} at={4} x={0.86} y={0.14} size={52} />}
    </AbsoluteFill>
  );
};
