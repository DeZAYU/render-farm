// PROMOTED to core (was src/templates/photo/shared.tsx); shared by several families. Import as "../../core/kits/photo".
// Shared parts for the card families (photo / quote / timeline / toll). All frames LOCAL (k = frames since start, fractional-safe).
import React from "react";
import { AbsoluteFill } from "remotion";
import { H, W, clamp01, hash, rng } from "../index";

/** a text event on the voice: shown from local frame `at` */
export type Word = { text: string; at: number };

/** torn-paper polygon for clip-path (VV §5 / §3 print edge). Seeded, so it never changes between frames. px units. */
export const tornClip = (w: number, h: number, seed = 3, amp = 7, step = 13) => {
  const r = rng(seed * 7919 + 17);
  const pts: [number, number][] = [];
  for (let x = 0; x <= w; x += step) pts.push([x, r() * amp]);
  for (let y = 0; y <= h; y += step) pts.push([w - r() * amp, y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h - r() * amp]);
  for (let y = h; y >= 0; y -= step) pts.push([r() * amp, y]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`;
};

/** torn print: an off-white paper fringe (irregular 2-16 px) around a photo with its own torn edge. `children` = the photo (fills w x h). */
export const TornPrint: React.FC<{ w: number; h: number; seed?: number; paper?: string; fringe?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  w, h, seed = 5, paper = "#E9E6DE", fringe = 9, style, children,
}) => (
  <div style={{ position: "absolute", width: w, height: h, ...style }}>
    <div style={{ position: "absolute", inset: 0, background: paper, clipPath: tornClip(w, h, seed, 10, 11) }} />
    <div style={{ position: "absolute", left: fringe, top: fringe, width: w - 2 * fringe, height: h - 2 * fringe, overflow: "hidden", clipPath: tornClip(w - 2 * fringe, h - 2 * fringe, seed + 11, 6, 9) }}>
      {children}
    </div>
  </div>
);

/** DD-grade treatment inside a photo card: soft multiply vignette (cards are not full-frame, so the core PNG vignette would be stretched) */
export const CardVig: React.FC<{ k?: number }> = ({ k = 0.55 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 75% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,${k}) 100%)`, pointerEvents: "none" }} />
);

/** sparse floating dust specks (VV chapter / date-card plates): seeded, slow drift, never dead-still */
export const Specks: React.FC<{ k: number; n?: number; seed?: number; colour?: string; max?: number }> = ({ k, n = 34, seed = 4, colour = "255,255,255", max = 0.35 }) => {
  const r = rng(seed);
  const items = Array.from({ length: n }, () => ({ x: r() * W, y: r() * H, s: 1 + r() * 2.2, a: 0.08 + r() * max, vx: (r() - 0.5) * 0.25, vy: -0.08 - r() * 0.22, ph: r() * 6.28 }));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {items.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: (p.x + p.vx * k + W) % W, top: (p.y + p.vy * k + H) % H, width: p.s, height: p.s, borderRadius: p.s,
          background: `rgba(${colour},${(p.a * (0.7 + 0.3 * Math.sin(p.ph + k / 11))).toFixed(3)})` }} />
      ))}
    </AbsoluteFill>
  );
};

/** VV §5 anamorphic flare at the left of the plate (blue core, pink tail), slowly breathing */
export const Flare: React.FC<{ k: number; y?: number; x?: number }> = ({ k, y = 300, x = -200 }) => (
  <>
    <div style={{ position: "absolute", left: x + 0.25 * k, top: y, width: 1300, height: 9, borderRadius: 9,
      background: "linear-gradient(90deg, rgba(90,140,255,0), rgba(110,160,255,.55) 35%, rgba(255,140,200,.32) 62%, rgba(255,140,200,0))",
      filter: "blur(4px)", opacity: 0.78 + 0.18 * Math.sin(k / 9) }} />
    <div style={{ position: "absolute", left: x + 80, top: y - 60, width: 520, height: 130, background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(120,170,255,.26), rgba(0,0,0,0))" }} />
  </>
);

/** VV §8 word ghost: 0 before onset, 0.3 -> 1 in d frames */
export const ghostO = (k: number, at: number, d = 4, from = 0.3) => (k < at ? 0 : from + (1 - from) * clamp01((k - at) / d));

/** 1-frame letter dropouts during a wipe (VV §5 name flicker), deterministic */
export const flickerOff = (i: number, k: number, on: boolean) => on && hash(i * 31.7 + Math.floor(k) * 7.3) < 0.07;

/** fit a w/h aspect into a box */
export const fitBox = (aspect: number, maxW: number, maxH: number) => (aspect >= maxW / maxH ? { w: maxW, h: maxW / aspect } : { w: maxH * aspect, h: maxH });
