// neon / EquationRow: A + B -> C. REF Farrell story #12 ICO arithmetic glyph row (white glyphs built term by term on the words, "icons change by
// sliding the whole plane", Farrell evidence rule 10) + VV §7 crowd (Visual Venture @ 1:44.1: each new element on its phrase, the group pulls back
// -0.45 %/f easing over 1 s and the camera pans right-to-left 0.7 s to make room; colour = meaning) + VV §8 word ghost (0.3 -> 1 in 4 f).
// Ours: the plane re-frames itself on every new term (pan + pull-back, quick-start / long-settle), the operator strokes draw on in 5 f, the result
// pops larger in its own colour with a Bebas label.
import React from "react";
import { useCurrentFrame } from "remotion";
import { FONT, H, W, EZ, clamp01, ghost, lerp, lerpLog } from "../../core";
import { NeonGlyph, NEON } from "./glyphs";
import { NeonStage } from "./shared";

export type EqTerm = { glyph: string; colour: string; label?: string; labelColour?: string; at: number; size?: number; extra?: { glyph: string; colour: string; dx: number; dy: number; size: number } };
export type EquationRowProps = {
  terms: EqTerm[]; // left to right
  ops: { glyph: "plus" | "arrow" | "equals" | string; at: number; colour?: string }[]; // between terms (ops.length = terms.length - 1)
  pitch?: number; // px between term centres at scale 1
  reframeFrames?: number; // pan + pull-back per new term (VV 0.7-1 s)
  maxScale?: number;
  labelSize?: number;
};

const slot = (i: number, pitch: number) => i * pitch; // term i at 2i slots, op i at 2i+1
export const EquationRow: React.FC<EquationRowProps> = ({ terms, ops, pitch = 300, reframeFrames = 26, maxScale = 1.9, labelSize = 64 }) => {
  const f = useCurrentFrame();
  // framing per step: after term i arrives, fit terms 0..i (VV pan + pull-back)
  const fit = (n: number) => {
    const span = slot(2 * n, pitch / 2) + 300;
    const s = Math.min(maxScale, (W * 0.84) / span);
    return { cx: slot(2 * n, pitch / 2) / 2, s };
  };
  let cam = fit(0);
  terms.forEach((t, i) => {
    if (i === 0) return;
    const u = EZ.quick(clamp01((f - t.at + 2) / reframeFrames));
    const to = fit(i);
    cam = { cx: lerp(cam.cx, to.cx, u), s: lerpLog(cam.s, to.s, u) };
  });
  const s = cam.s * (1 - 0.03 * clamp01(f / 300));
  const cy = H / 2 - 40;
  const last = terms.length - 1;
  return (
    <NeonStage floor={{ colour: "#FFFFFF", y: cy + 120 * s, rx: 44, ry: 8, o: 0.1 }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W / 2} ${cy}) scale(${s.toFixed(5)}) translate(${(-cam.cx).toFixed(2)} 0)`}>
          {terms.map((t, i) => {
            const k = f - t.at;
            if (k < 0) return null;
            const big = i === last ? 1 + 0.22 * (1 - EZ.out3(k / 10)) : 1;
            return (
              <g key={i}>
                <NeonGlyph name={t.glyph} colour={t.colour} x={slot(2 * i, pitch / 2)} y={0} size={(t.size ?? 200) * big} />
                {t.extra ? <NeonGlyph name={t.extra.glyph} colour={t.extra.colour} x={slot(2 * i, pitch / 2) + t.extra.dx} y={t.extra.dy} size={t.extra.size} /> : null}
              </g>
            );
          })}
          {ops.map((o, i) => {
            const k = f - o.at;
            if (k < 0.6) return null;
            return <NeonGlyph key={`o${i}`} name={o.glyph} colour={o.colour ?? NEON.white} x={slot(2 * i + 1, pitch / 2)} y={0} size={90} draw={Math.max(0.001, EZ.out3(k / 5))} />;
          })}
        </g>
      </svg>
      {terms.map((t, i) => {
        if (!t.label || f < t.at) return null;
        const x = (slot(2 * i, pitch / 2) - cam.cx) * s + W / 2;
        return (
          <div key={`l${i}`} style={{ position: "absolute", left: x - 400, width: 800, top: cy + 150 * s, textAlign: "center", fontFamily: FONT.bebas, fontSize: labelSize, letterSpacing: "0.06em",
            color: t.labelColour ?? (i === last ? NEON.yellow : "#FDFCFD"), opacity: ghost(f - t.at - 2) }}>{t.label}</div>
        );
      })}
    </NeonStage>
  );
};

export const EQUATION_DEMO: EquationRowProps = {
  terms: [
    { glyph: "cloud", colour: NEON.white, label: "FINE DUST", at: 4 },
    { glyph: "flame", colour: NEON.orange, label: "HEAT", at: 34 },
    { glyph: "bolt", colour: NEON.yellow, label: "IGNITION", at: 70, size: 230 },
  ],
  ops: [{ glyph: "plus", at: 30 }, { glyph: "arrow", at: 64 }],
};
