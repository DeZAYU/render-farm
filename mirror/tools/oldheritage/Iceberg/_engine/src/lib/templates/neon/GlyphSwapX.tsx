// neon / GlyphSwapX: the thing -> crossed out -> what it really was. REF VV §7 gun -> X -> toy (Visual Venture @ 19:26.4: the white glyph rises
// into place 792 -> 532 px in 20 f ease-out, then pushes +56 % over 2.17 s ACCELERATING bezier (0.39, 0, 0.59, 0.64); a yellow "!" flickers 2 f
// then fades in over 13 f; the red X draws in 3 f as semi-transparent red strokes (#FF2A3A 75 %, round caps) and rides the push; exit = 3 f
// RGB-split glitch + 2 black frames, then the replacement glyph pops with a slow 0.1 %/f push) + Farrell IG @ 2:47.6 (line icon crossed out, the
// real one appears). Ours: the accent glyph, the X and the swap all take their own word frames; the replacement can be a different colour + caption.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, EZ, clamp01, lerp, rng } from "../../core";
import { Glyph, NeonGlyph, NEON } from "./glyphs";
import { NeonStage, PopCaption, type CapWord } from "./shared";

export type GlyphSwapXProps = {
  a: { glyph: string; colour: string; size?: number }; // the first thing
  b: { glyph: string; colour: string; size?: number; extra?: { glyph: string; colour: string; dx: number; dy: number; size: number } }; // what it really was
  accent?: { glyph: string; colour: string; at: number; dx: number; dy: number; size?: number }; // e.g. "!" flicker
  riseFrames?: number; // VV 20 f
  pushFrames?: number; // VV 65 f (+56 %)
  push?: number;
  xAt: number; // X draws in 3 f
  glitchAt: number; // 3 f RGB split + 2 black frames, then b pops
  captionsA?: CapWord[];
  captionsB?: CapWord[];
  floor?: string;
};

const XMark: React.FC<{ k: number; size: number }> = ({ k, size }) => {
  if (k < 0) return null;
  const a = clamp01((k + 1) / 1.5), b = clamp01((k - 0.5) / 1.5); // stroke 1 then stroke 2 inside 3 f
  const r = size * 0.42;
  return (
    <g stroke="#FF2A3A" strokeWidth={size * 0.075} strokeLinecap="round" fill="none" opacity={0.78} style={{ filter: "drop-shadow(0 0 6px rgba(255,42,58,.9)) drop-shadow(0 0 22px rgba(255,42,58,.45))" }}>
      <path d={`M${-r} ${-r} L${lerp(-r, r, a)} ${lerp(-r, r, a)}`} />
      {b > 0 ? <path d={`M${r} ${-r} L${lerp(r, -r, b)} ${lerp(-r, r, b)}`} /> : null}
    </g>
  );
};

export const GlyphSwapX: React.FC<GlyphSwapXProps> = (p) => {
  const f = useCurrentFrame();
  const rf = p.riseFrames ?? 20, pf = p.pushFrames ?? 65;
  const sizeA = p.a.size ?? 380;
  const gk = f - p.glitchAt;
  if (gk >= 3 && gk < 5) return <AbsoluteFill style={{ background: "#000" }} />;
  if (gk >= 5) {
    const k = gk - 5;
    const s = 1 + 0.001 * k;
    const sb = p.b.size ?? 380;
    return (
      <NeonStage floor={p.floor ? { colour: p.b.colour, y: H / 2 + sb * 0.55 } : undefined}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(${W / 2} ${H / 2 - 20}) scale(${s.toFixed(5)})`}>
            <NeonGlyph name={p.b.glyph} colour={p.b.colour} x={0} y={0} size={sb} />
            {p.b.extra ? <NeonGlyph name={p.b.extra.glyph} colour={p.b.extra.colour} x={p.b.extra.dx} y={p.b.extra.dy} size={p.b.extra.size} /> : null}
          </g>
        </svg>
        <PopCaption f={f} words={p.captionsB ?? []} y={H - 210} size={110} />
      </NeonStage>
    );
  }
  const rise = EZ.out3(f / rf);
  const y = lerp(260, 0, rise);
  const s = 1 + (p.push ?? 0.56) * EZ.gunPush(clamp01((f - rf) / pf));
  const ac = p.accent;
  let accO = 0;
  if (ac) { const k = f - ac.at; accO = k < 0 ? 0 : k < 2 ? (Math.floor(k) % 2 === 0 ? 0.9 : 0.15) : 0.5 + 0.5 * EZ.out2((k - 2) / 13); }
  const group = (dx: number, colour?: string) => (
    <g transform={`translate(${W / 2 + dx} ${H / 2 - 20 + y}) scale(${s.toFixed(5)})`}>
      {colour ? <g opacity={0.85}><Glyph name={p.a.glyph} colour={colour} size={sizeA} /></g> : <NeonGlyph name={p.a.glyph} colour={p.a.colour} x={0} y={0} size={sizeA} />}
      {!colour && ac && accO > 0 ? <NeonGlyph name={ac.glyph} colour={ac.colour} x={ac.dx} y={ac.dy} size={ac.size ?? 120} o={accO} /> : null}
      {!colour ? <XMark k={f - p.xAt} size={sizeA} /> : null}
    </g>
  );
  if (gk >= 0) {
    // VV §10-style 3 f RGB split with band offsets
    const r = rng(4400 + Math.floor(gk));
    const amp = [26, 48, 70][Math.min(2, Math.floor(gk))];
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        {Array.from({ length: 9 }, (_, i) => {
          const dx = (r() - 0.5) * 2 * amp;
          return (
            <AbsoluteFill key={i} style={{ clipPath: `inset(${(i * 100) / 9}% 0 ${100 - ((i + 1) * 100) / 9}% 0)`, transform: `translateX(${dx.toFixed(1)}px)` }}>
              <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>{group(amp * 0.5, "#FF0030")}</svg>
              <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>{group(-amp * 0.5, "#00E5FF")}</svg>
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
    );
  }
  return (
    <NeonStage floor={p.floor ? { colour: p.floor, y: H / 2 + sizeA * 0.55 * s } : undefined}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>{group(0)}</svg>
      <PopCaption f={f} words={p.captionsA ?? []} y={H - 210} size={110} />
    </NeonStage>
  );
};

export const SWAP_DEMO: GlyphSwapXProps = {
  a: { glyph: "extinguisher", colour: NEON.white, size: 400 },
  b: { glyph: "canister", colour: NEON.green, size: 400, extra: { glyph: "flame", colour: NEON.orange, dx: 0, dy: -300, size: 150 } },
  accent: { glyph: "exclaim", colour: NEON.yellow, at: 22, dx: 230, dy: -150, size: 130 },
  xAt: 48, glitchAt: 72,
  captionsB: [{ t: "NOT WHAT", at: 80 }, { t: "IT SEEMED", at: 86, colour: NEON.yellow }],
  floor: "#FFFFFF",
};
