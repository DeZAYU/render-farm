// neon / TankBurst. REF VV §7 tank (Visual Venture @ 10:43.0: a row of neon pictograms held 1.3 s with a -0.5 % drift, then a camera push x2.98
// in 57 f with a log-scale bezier (0.326, 0, 0.143, 0.807), peak 5.3 %/f at +0.5 s, a -375 px pan riding it; blue figures loop small
// animations); wp3 sec_A IgnDiagram @ abs 2879 (same burst into the fire, motion blur).
// Ours: the burst lands on a target glyph that swaps (e.g. canister -> flame) on its word, with a short white core bloom; CameraMotionBlur on the burst.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, EZ, MBlur, clamp01, lerp } from "../../core";
import { NeonGlyph, NEON, hexA } from "./glyphs";
import { NeonStage, PopCaption, type CapWord } from "./shared";

export type TankItem = { glyph: string; colour: string; x: number; y: number; size?: number; loop?: "bob" | "sway" | "none"; flip?: boolean };
export type TankBurstProps = {
  items: TankItem[]; // world px (the frame is 1920 x 1080 at scale 1)
  target: { x: number; y: number }; // world point the burst flies into
  burstAt: number; // local frame the push starts (VV: after a 1.3 s hold)
  burstFrames?: number; // VV 57 f
  zoom?: number; // VV x2.98
  swap?: { index: number; at: number; glyph: string; colour: string }; // the target item changes on its word
  bloom?: string; // colour of the bloom at the swap
  captions?: CapWord[];
  floor?: string;
};

const Scene: React.FC<TankBurstProps> = (p) => {
  const f = useCurrentFrame();
  const bf = p.burstFrames ?? 57;
  const u = EZ.tankBurst(clamp01((f - p.burstAt) / bf));
  const hold = Math.min(f, p.burstAt) / Math.max(1, p.burstAt);
  const s = (1 - 0.005 * hold) * Math.exp(Math.log(p.zoom ?? 2.98) * u) * (1 + 0.0035 * Math.max(0, f - p.burstAt - bf));
  const cx = lerp(W / 2, p.target.x, u), cy = lerp(H / 2, p.target.y, u);
  const sw = p.swap ? clamp01((f - p.swap.at) / 3) : 0;
  return (
    <NeonStage floor={p.floor ? { colour: p.floor, y: (630 - cy) * s + H / 2, x: (W / 2 - cx) * s + W / 2, rx: 46 * s, ry: 9 * s } : undefined}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${s.toFixed(5)}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})`}>
          {p.items.map((it, i) => {
            const ph = i * 1.7;
            const bob = it.loop === "bob" ? Math.abs(Math.sin(f / 7 + ph)) * -10 : 0;
            const rot = it.loop === "sway" ? Math.sin(f / 9 + ph) * 4 : 0;
            const isT = p.swap && p.swap.index === i;
            return (
              <g key={i}>
                <NeonGlyph name={it.glyph} colour={it.colour} x={it.x} y={it.y + bob} size={it.size ?? 160} rot={rot} sx={it.flip ? -1 : 1} o={isT ? 1 - sw : 1} />
                {isT && sw > 0 && p.swap ? <NeonGlyph name={p.swap.glyph} colour={p.swap.colour} x={it.x} y={it.y} size={(it.size ?? 160) * (1 + 0.25 * (1 - EZ.out3((f - p.swap.at) / 8)))} o={sw} /> : null}
              </g>
            );
          })}
        </g>
      </svg>
      {p.swap ? (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${hexA(p.bloom ?? "#FFB347", 0.55 * clamp01((f - p.swap.at) / 4) * (1 - 0.6 * clamp01((f - p.swap.at - 6) / 30)))}, rgba(0,0,0,0) 46%)`, mixBlendMode: "screen" }} />
      ) : null}
      <PopCaption f={f} words={p.captions ?? []} y={H - 210} size={110} />
    </NeonStage>
  );
};

export const TankBurst: React.FC<TankBurstProps> = (p) => {
  const f = useCurrentFrame();
  const bf = p.burstFrames ?? 57;
  const fast = f > p.burstAt + 4 && f < p.burstAt + bf * 0.75;
  return <AbsoluteFill><MBlur on={fast} samples={8}><Scene {...p} /></MBlur></AbsoluteFill>;
};

export const TANK_DEMO: TankBurstProps = {
  items: [
    { glyph: "car", colour: NEON.blue, x: 250, y: 560, size: 230, loop: "none" },
    { glyph: "person", colour: NEON.blue, x: 520, y: 535, size: 200, loop: "bob" },
    { glyph: "personRaise", colour: NEON.blue, x: 680, y: 535, size: 200, loop: "sway" },
    { glyph: "house", colour: NEON.red, x: 960, y: 510, size: 320 },
    { glyph: "canister", colour: NEON.yellow, x: 1250, y: 535, size: 220 },
    { glyph: "car", colour: NEON.blue, x: 1620, y: 560, size: 230, flip: true },
  ],
  target: { x: 1250, y: 535 },
  burstAt: 39, burstFrames: 57, zoom: 2.98,
  swap: { index: 4, at: 74, glyph: "flame", colour: NEON.orange },
  bloom: "#FF9A3A",
  captions: [],
  floor: "#2A3BFF",
};
