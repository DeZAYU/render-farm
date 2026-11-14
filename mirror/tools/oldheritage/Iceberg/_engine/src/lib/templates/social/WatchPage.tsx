// social / WatchPage: a real YouTube watch-page capture on white (global vignette): it SETTLES (pull-out 1.11 -> 1.00, ease-out), then on the
// spoken word pushes in to the description; each line the VO paraphrases gets the full-saturation Caving red bar (#FC0E11, ~8 px red halo,
// on within 4 f) while the translation types on in the D3 boxed caption. Optional exit = Caving Glitch A (white -> line static -> RGB static).
// REF Caving watch page + red bar @22:06.8 / 35:38.6 (channel-page settle §I-1 @6:13, Glitch A @0:44.45) + D3 I13 boxed caption + Farrell T9
// typed text; wp3 sec_B YTPage @ abs 4480.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, MBlur, RC, W, clamp01, lerp, lerpLog, type Rect } from "../../core";
import { PageSheet, TypedCaption, type CaptionLine, type PageSrc } from "../page/shared";

export type WatchPageProps = PageSrc & {
  /** words inside the red bars: "page" (default, DD original: black on red) | "white" (re-inked white, M-024 contrast) */
  ink?: "page" | "white";
  start: { cx: number; cy: number; s: number }; // settled opening framing (player + title)
  push?: { cx: number; cy: number; s: number; at: number; d?: number }; // push to the description on its word
  lines?: { r: Rect; at: number }[]; // red bars on the read lines (omit = no highlight)
  captions?: CaptionLine[]; // typed translation (D3 boxed caption)
  captionCap?: number; // caption cap height (default 40)
  glitchOutAt?: number; // Caving Glitch A on the last frames (4 f: white, line static x2, RGB static)
};
const Inner: React.FC<WatchPageProps> = (p) => {
  const f = useCurrentFrame();
  const settle = lerp(1.11, 1, EZ.out3(f / 63));
  const pu = p.push ? EZ.move((f - p.push.at) / (p.push.d ?? 40)) : 0;
  const to = p.push ?? p.start;
  const after = p.push ? Math.max(0, f - p.push.at - (p.push.d ?? 40)) / 30 : 0;
  const s = lerpLog(p.start.s * settle, to.s, pu) * (1 + 0.006 * (Math.max(0, f) / 30) + 0.01 * after);
  const cx = lerp(p.start.cx, to.cx, pu), cy = lerp(p.start.cy, to.cy, pu);
  const bars = (p.lines ?? []).map((l) => ({ r: l.r, p: clamp01((f - l.at) / 4), c: RC.cavingRed, px: 3, py: 3, radius: 0, glow: "0 0 8px 3px rgba(252,14,17,.7)", mode: (p.ink === "white" ? "white" : undefined) as "white" | undefined }));
  const sheet = <PageSheet {...p} cx={cx} cy={cy} s={s} bars={bars} shadow="0 0 0 rgba(0,0,0,0)" />;
  const band = "linear-gradient(to bottom, transparent 200px, #000 330px, #000 640px, transparent 780px)";
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      {pu > 0.02 ? (
        <>
          <AbsoluteFill style={{ filter: `blur(${(3.5 * pu).toFixed(2)}px)` }}>{sheet}</AbsoluteFill>
          <AbsoluteFill style={{ WebkitMaskImage: band, maskImage: band }}>{sheet}</AbsoluteFill>
        </>
      ) : sheet}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,.42) 100%)" }} />
    </AbsoluteFill>
  );
};
/** Caving Glitch A, outgoing half (the incoming shot's shaken frames belong to the next scene) */
const GlitchOut: React.FC<{ k: number }> = ({ k }) => {
  if (k < 0 || k > 3) return null;
  if (k === 0) return <AbsoluteFill style={{ background: "#BDBDBD" }} />;
  const rgb = k === 3;
  return (
    <AbsoluteFill style={{ opacity: 0.85 }}>
      <svg width={W} height={H}>
        <filter id={`wpg${k}`}><feTurbulence type="fractalNoise" baseFrequency={rgb ? "0.6 0.02" : "0.004 0.9"} numOctaves={2} seed={k * 7} />
          {rgb ? <feColorMatrix type="matrix" values="0 0 0 1.4 -0.2  1.2 0 0 0 0  0 0 0 1.6 -0.1  0 0 0 0 1" /> : <feColorMatrix type="saturate" values="0" />}
        </filter>
        <rect width={W} height={H} filter={`url(#wpg${k})`} />
      </svg>
    </AbsoluteFill>
  );
};
export const WatchPage: React.FC<WatchPageProps> = (p) => {
  const f = useCurrentFrame();
  const d = p.push?.d ?? 40;
  const fast = !!p.push && f >= p.push.at + 6 && f < p.push.at + d * 0.75;
  return (
    <AbsoluteFill>
      <MBlur on={fast}><Inner {...p} /></MBlur>
      <TypedCaption cap={p.captionCap ?? 40} lines={p.captions} end={p.glitchOutAt} />
      {p.glitchOutAt !== undefined ? <GlitchOut k={Math.floor(f) - p.glitchOutAt} /> : null}
    </AbsoluteFill>
  );
};
