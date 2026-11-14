// Shared parts for the c02-08 batch (stat CounterStack/ClockSweep/BigNumber/CompareBars/PriceTag, quote QuoteOnPlate/StampVerdict/ReportExcerpt/
// WitnessLine, title RoleStack, transition CrackSplit). LOCAL frames, fractional-frame safe.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Media, Vignette, hash, linPush } from "../index";

/** the DD defocused footage plate under a designed beat (Farrell T5/T6: blur ~12, gain ~.4, desaturated; the clip keeps playing, linear push) */
export const DefocusPlate: React.FC<{ media?: string; mediaStart?: number; blur?: number; dim?: number; sat?: number; push?: number; bg?: string; children?: React.ReactNode }> = ({
  media, mediaStart = 0, blur = 14, dim = 0.38, sat = 0.45, push = 0.02, bg = "#050505", children,
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {media ? (
        <AbsoluteFill style={{ transform: `scale(${(1.06 * linPush(f, push)).toFixed(5)})`, filter: `blur(${blur}px) brightness(${dim}) saturate(${sat})` }}>
          <Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence>
        </AbsoluteFill>
      ) : null}
      <Vignette />
      {children}
    </AbsoluteFill>
  );
};

/** damped pendulum (deg): a hanging tag / card that swings in and settles, never fully dead (residual 0.4 deg sway) */
export const swing = (k: number, amp = 14, periodF = 34, tauF = 26) =>
  k < 0 ? amp : amp * Math.exp(-k / tauF) * Math.cos((2 * Math.PI * k) / periodF) + 0.4 * Math.sin((2 * Math.PI * k) / 95);

/** 1-2 f camera kick on an impact (px), decays in ~6 f */
export const kick = (k: number, amp = 10, seed = 1) => {
  if (k < 0 || k > 8) return { x: 0, y: 0 };
  const d = Math.exp(-k / 2.2);
  return { x: amp * d * (hash(Math.floor(k) * 3.1 + seed) - 0.5) * 2, y: amp * d * (hash(Math.floor(k) * 5.7 + seed) - 0.5) * 2 };
};

/** ink texture filter for stamps / marker (rough edge + speckle), referenced by id */
export const InkDefs: React.FC<{ id: string; seed?: number; rough?: number; holes?: number }> = ({ id, seed = 3, rough = 2.2, holes = 0.32 }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={rough} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={3} seed={seed + 7} result="m" />
      <feColorMatrix in="m" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 ${(2.6 + 3 * (1 - holes)).toFixed(2)}`} result="mask" />
      <feComposite in="d" in2="mask" operator="in" />
    </filter>
  </svg>
);

/** typed characters of a list of {text, at} words at `cps` characters per second (word-locked) */
export const typedLine = (words: { text: string; at: number }[], f: number, cpf = 0.7) =>
  words.map((w, i) => {
    const n = f < w.at ? 0 : Math.min(w.text.length, Math.floor((f - w.at) * cpf) + 1);
    return (i && n > 0 ? " " : "") + w.text.slice(0, n);
  }).join("");

/** a radial dark-red stage glow (DD red identity behind designed numbers) */
export const RedStage: React.FC<{ o?: number; y?: number }> = ({ o = 1, y = 50 }) => (
  <AbsoluteFill style={{ opacity: o, background: `radial-gradient(ellipse 58% 52% at 50% ${y}%, rgba(70,0,6,.55) 0%, rgba(22,2,4,.35) 50%, rgba(0,0,0,0) 85%)` }} />
);

