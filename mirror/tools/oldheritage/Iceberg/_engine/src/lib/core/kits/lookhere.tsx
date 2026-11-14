// PROMOTED to core (was src/templates/lookhere/shared.tsx); shared by several families. Import as "../../core/kits/lookhere".
// lookhere shared parts: punch camera, brush ring (D3 E3), block arrow (D2 E3). Frames LOCAL; fractional-frame safe.
import React from "react";
import { EZ, H, W, clamp01, lerp } from "../index";

/** a punch camera: from scale s0 about the frame centre to scale s with `target` (source px) moved toward the centre, clamped so the frame
 *  never shows its edge. Returns the transform and a mapper source px -> screen px. */
export const punchCam = (u: number, s0: number, s: number, target: { x: number; y: number }) => {
  const sc = Math.exp(lerp(Math.log(s0), Math.log(s), u));
  const tx0 = (W / 2) * (1 - s0), ty0 = (H / 2) * (1 - s0);
  const tx1 = Math.min(0, Math.max(W * (1 - s), W / 2 - s * target.x));
  const ty1 = Math.min(0, Math.max(H * (1 - s), H / 2 - s * target.y));
  // interpolate the translate so the target's screen point moves on a straight line (no drift arc)
  const tx = lerp(tx0, tx1, u), ty = lerp(ty0, ty1, u);
  const map = (p: { x: number; y: number }) => ({ x: tx + sc * p.x, y: ty + sc * p.y });
  return { s: sc, tx, ty, map, transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sc.toFixed(5)})` };
};

/** Dashcam Vol.3 E3 hand-drawn ring: #E30A10, no fill, brush-like, TAPER-ENDED, drawn clockwise from ~1 o'clock (25 deg); the head accelerates to
 *  ~70 deg/f at k4-5 then decelerates, ~335 deg + closing overlap in 12 f. `p` = draw progress 0..1. Built as a filled ribbon polygon so the
 *  ends taper and the stroke breathes (radius wobble), not a uniform SVG stroke. */
export const BrushRing: React.FC<{ cx: number; cy: number; r: number; p: number; stroke?: number; colour?: string; seed?: number; opacity?: number }> = ({
  cx, cy, r, p, stroke = 17, colour = "#E30A10", seed = 1, opacity = 1,
}) => {
  if (p <= 0) return null;
  const total = (372 / 360) * Math.PI * 2; // a little past closed (hand-drawn overlap)
  const a0 = (-90 + 25) * (Math.PI / 180);
  const end = total * clamp01(p);
  const n = Math.max(8, Math.ceil(120 * clamp01(p)));
  const outer: string[] = [], inner: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * end;
    const s = t / total; // 0..1 along the full stroke
    const head = end - t; // distance (rad) behind the current head
    const taper = Math.min(1, s / 0.12) * Math.min(1, head / 0.5 + (p >= 1 ? 1 : 0)) * (p >= 1 ? Math.min(1, (1 - s) / 0.1) : 1);
    const w = stroke * (0.25 + 0.75 * Math.sqrt(Math.max(0, taper))) * (1 + 0.12 * Math.sin(t * 3 + seed));
    const rr = r * (1 + 0.025 * Math.sin(2 * t + seed) + 0.012 * Math.sin(5 * t + 2 * seed)) * (1 - 0.035 * s); // spirals in slightly as it closes
    const a = a0 + t;
    const ux = Math.cos(a), uy = Math.sin(a);
    outer.push(`${(cx + ux * (rr + w / 2)).toFixed(1)},${(cy + uy * (rr + w / 2)).toFixed(1)}`);
    inner.unshift(`${(cx + ux * (rr - w / 2)).toFixed(1)},${(cy + uy * (rr - w / 2)).toFixed(1)}`);
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity }}>
      <polygon points={[...outer, ...inner].join(" ")} fill={colour} style={{ filter: "drop-shadow(0 0 3px rgba(227,10,16,.55)) drop-shadow(0 2px 3px rgba(0,0,0,.35))" }} />
    </svg>
  );
};
/** D3 E3 draw curve: accelerate to a peak ~k4-5, then decelerate; closed at 12 f (drawFrames) */
export const brushDraw = (k: number, d = 12) => EZ.inout(k / d);

/** Dashcam Vol.2 E3 solid block arrow pointing DOWN at (x, y) = tip. Shaft 30 x ~180, head 70 x 55, total ~240 px, tilted ~2 deg, colour (230,1,2). */
export const BlockArrow: React.FC<{ x: number; y: number; scale?: number; tilt?: number; opacity?: number; colour?: string }> = ({ x, y, scale = 1, tilt = 2, opacity = 1, colour = "rgb(230,1,2)" }) => {
  const d = "M -15 -240 L 15 -240 L 15 -55 L 36 -55 L 0 0 L -36 -55 L -15 -55 Z";
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity }}>
      <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${tilt}) scale(${scale})`} style={{ filter: "drop-shadow(0 0 3px rgba(230,1,2,.7)) drop-shadow(0 3px 6px rgba(0,0,0,.45))" }}>
        <path d={d} fill={colour} strokeLinejoin="round" stroke={colour} strokeWidth={3} />
      </g>
    </svg>
  );
};
