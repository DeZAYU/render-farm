// WP18 FrostCreep — the cold, shown on the footage: the 1989 camcorder shot of the columns over the lake plays on, full frame, while
// frost grows in from the frame's edges like ice on a window (branching crystals drawn out from the border, a pale rime gathering in the
// corners) and the picture itself cools and pales under it. The middle stays clear on the smoke. Used once, under the 8-degree line.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { cl, io } from "./WP01_kit";

type Br = { d: string; len: number; t0: number; t1: number; w: number };
const rng = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

/** grow crystal branches from seeds on the frame border (deterministic) */
const build = (W: number, H: number, seeds: number, seed: number): Br[] => {
  const r = rng(seed); const out: Br[] = [];
  const grow = (x: number, y: number, a: number, L: number, t0: number, depth: number, w: number) => {
    const pts: [number, number][] = [[x, y]]; let len = 0; const step = 9;
    for (let s = 0; s < L / step; s++) {
      a += (r() - 0.5) * 0.18; x += Math.cos(a) * step; y += Math.sin(a) * step; pts.push([x, y]); len += step;
      if (depth < 2 && s > 2 && r() < 0.32) {
        const side = r() < 0.5 ? -1 : 1;
        grow(x, y, a + side * (0.95 + r() * 0.2), L * (0.28 + r() * 0.22) * (1 - s * step / L * 0.5), t0 + (s * step / L) * 0.55, depth + 1, w * 0.62);
      }
    }
    out.push({ d: pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(""), len, t0, t1: Math.min(1, t0 + 0.55 + r() * 0.1), w });
  };
  for (let i = 0; i < seeds; i++) {
    const side = i % 4, u = (i + r() * 0.8) / seeds; let x = 0, y = 0, a = 0;
    if (side === 0) { x = u * W; y = -4; a = Math.PI / 2; } else if (side === 1) { x = W + 4; y = u * H; a = Math.PI; }
    else if (side === 2) { x = (1 - u) * W; y = H + 4; a = -Math.PI / 2; } else { x = -4; y = (1 - u) * H; a = 0; }
    const toC = Math.atan2(H / 2 - y, W / 2 - x); a = a * 0.55 + toC * 0.45 + (r() - 0.5) * 0.5;
    const L = (side % 2 ? 210 : 170) + r() * 210;
    grow(x, y, a, L, r() * 0.3, 0, 3.2 + r() * 1.6);
  }
  return out;
};

export const WP18_FrostCreep: React.FC<{ src: string; from: number; n: number; rate?: number; s0?: number; s1?: number; fx?: number; fy?: number }> = ({ src, from, n, rate = 0.85, s0 = 1.02, s1 = 1.1, fx = 0.5, fy = 0.45 }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const brs = React.useMemo(() => build(W, H, 34, 1989), [W, H]);
  const g = io(interpolate(f, [6, n - 10], [0, 1], cl));
  const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  const cool = g;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`,
        filter: `saturate(${1 - 0.45 * cool}) brightness(${1 + 0.06 * cool}) hue-rotate(${-8 * cool}deg)` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* cold cast + rime gathering at the edges */}
      <AbsoluteFill style={{ background: `rgba(150,180,215,${0.1 * cool})`, mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 60% at 50% 46%, rgba(235,243,250,0) ${78 - 20 * g}%, rgba(225,236,246,${0.55 * g}) 100%)` }} />
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs><filter id="fg" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <g filter="url(#fg)" stroke="rgba(240,247,252,0.62)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {brs.map((b, i) => {
            const a0 = Math.min(b.t0, 0.92), k = interpolate(g, [a0, Math.max(b.t1, a0 + 0.08)], [0, 1], cl);
            if (k <= 0) return null;
            return <path key={i} d={b.d} strokeWidth={b.w * 0.6} strokeDasharray={`${b.len}`} strokeDashoffset={b.len * (1 - k)} opacity={0.55 + 0.45 * k} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
