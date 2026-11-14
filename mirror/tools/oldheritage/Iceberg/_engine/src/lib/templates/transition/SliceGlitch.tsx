// transition / SliceGlitch: Visual Venture §10 glitch (112 uses; MOTION.md §10 measured 0:13.55 and 0:02.67): 54 horizontal bands of 20 px,
// outgoing frames tear harder (median shift 6 / 18 / 60 / 63 px, max 600) than incoming (0 / 30 / 0 / 0); ~8 % of bands smear sideways
// (scaleX 1.6, +-200..600 px). Mode "signal": the 0:02.67 "signal loss" form: 3 f light tearing -> 4 f near-black with a +-80 px R/B split ->
// 3 f incoming tearing -> clean (10 f). wp3 sec_A TtPage glitch-in (5 f). No SFX of note in VV; our library cues "glitch".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rng } from "../../core";
import { Cut, SideA, SideB, type TransitionProps } from "./shared";

const AMP_OUT = [6, 18, 60, 63], AMP_IN = [0, 30, 0, 0];
const Bands: React.FC<{ seed: number; amp: number; n?: number; children: React.ReactNode }> = ({ seed, amp, n = 27, children }) => {
  const r = rng(seed);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(6px) brightness(.8)", transform: "scaleX(1.25)" }}>{children}</AbsoluteFill>
      {Array.from({ length: n }, (_, i) => {
        const smear = r() < 0.08;
        const dx = smear ? (r() < 0.5 ? -1 : 1) * (200 + r() * 400) : r() < 0.85 ? (r() - 0.5) * 2 * amp : 0;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${(i * 100) / n}% 0 ${100 - ((i + 1) * 100) / n}% 0)`, transform: `translateX(${dx.toFixed(1)}px)${smear ? " scaleX(1.6)" : ""}` }}>
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
export type SliceGlitchProps = TransitionProps & { mode?: "tear" | "signal"; seed?: number };
export const SliceGlitch: React.FC<SliceGlitchProps> = (p) => {
  const f = useCurrentFrame();
  const k = Math.floor(f - p.cut);
  const seed = (p.seed ?? 5) * 1000 + k * 7;
  if (p.mode === "signal") {
    if (k >= -7 && k < -4) return <Bands seed={seed} amp={12} n={10}><SideA {...p} /></Bands>;
    if (k >= -4 && k < 0) {
      return (
        <AbsoluteFill style={{ background: "#000" }}>
          <AbsoluteFill style={{ opacity: 0.12, transform: "translateX(-80px)", mixBlendMode: "screen", filter: "sepia(1) saturate(6) hue-rotate(-50deg)" }}><SideA {...p} /></AbsoluteFill>
          <AbsoluteFill style={{ opacity: 0.12, transform: "translateX(80px)", mixBlendMode: "screen", filter: "sepia(1) saturate(6) hue-rotate(180deg)" }}><SideA {...p} /></AbsoluteFill>
        </AbsoluteFill>
      );
    }
    if (k >= 0 && k < 3) return <Bands seed={seed} amp={44}><SideB {...p} /></Bands>;
    return <Cut {...p} />;
  }
  if (k >= -4 && k < 0) return <Bands seed={seed} amp={AMP_OUT[k + 4]}><SideA {...p} /></Bands>;
  if (k >= 0 && k < 4 && AMP_IN[k] > 0) return <Bands seed={seed} amp={AMP_IN[k]}><SideB {...p} /></Bands>;
  return <Cut {...p} />;
};
