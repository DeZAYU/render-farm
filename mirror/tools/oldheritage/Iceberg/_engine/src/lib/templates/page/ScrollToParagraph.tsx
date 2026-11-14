// page / ScrollToParagraph: the long read-down. An upright page column fills the frame; after a beat on the headline the camera scrolls a LONG
// way down to the spoken paragraph with the DD V3 scroll profile (ease-in to a peak, then a long halving settle; motion blur only at the peak)
// and a zoom bump (+5.7 % -> +3 %). A horizontal depth-of-field band keeps the reading line sharp. The spoken words get the Caving/Nocturn red
// GLOW bar (#FC0E11 with an ~8 px red halo bleeding into the paper), wiped in VO order. Enters on the VV §10 glitch (5 f slice tear).
// REF Dashcam Vol.3 E4 scroll @0:08.0-0:14.4 + VV §10 glitch @0:13.55 + Caving red bar @22:06.8 / 35:38.6 (Nocturn CP12 red glow bar);
// wp3 sec_A TtPage @ abs 2412.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DOFBand, EZ, H, MBlur, RC, lerp } from "../../core";
import { Entered, PageSheet, markBars, type Entry, type Mark, type PageSrc } from "./shared";

export type ScrollToParagraphProps = PageSrc & {
  /** words inside the red bars: "page" (default, DD original: black on red) | "white" (re-inked white, M-024 contrast) */
  ink?: "page" | "white";
  clip?: [number, number];
  x1?: number;
  from: { cx: number; cy: number }; // headline framing (CSS px)
  to: { cx: number; cy: number }; // the spoken paragraph
  s: number;
  scrollAt?: number; // local frame the scroll starts (default 8)
  scrollDur?: number; // frames (default 66 = DD 2.2 s)
  bars?: Mark[]; // glow bars on the spoken phrases (omit = no highlight)
  barColour?: string;
  glow?: boolean; // Caving halo on the bars (default true)
  entry?: Entry; // default "glitch"
};
const Inner: React.FC<ScrollToParagraphProps> = (p) => {
  const f = useCurrentFrame();
  const a = p.scrollAt ?? 8, d = p.scrollDur ?? 66;
  const u = (f - a) / d;
  const m = EZ.ddScroll(u);
  const bump = Math.sin(Math.PI * Math.min(1, Math.max(0, u) * 1.15));
  const s = p.s * (1 + 0.057 * bump * (u < 0.5 ? 1 : 0.6) + 0.03 * m) * Math.exp(0.008 * (Math.max(0, f) / 30));
  const cx = lerp(p.from.cx, p.to.cx, m), cy = lerp(p.from.cy, p.to.cy, m);
  const c = p.barColour ?? RC.cavingRed;
  const bars = markBars(f, p.bars, { ink: p.ink, c, perLine: 16, px: 3, py: 3, radius: 1, glow: p.glow === false ? undefined : `0 0 9px 3px ${c}aa` });
  return (
    <AbsoluteFill style={{ background: "#1a1616", overflow: "hidden" }}>
      <DOFBand y={H / 2} half={170} blur={3.2} feather={140}>
        <PageSheet {...p} cx={cx} cy={cy} s={s} bars={bars} slices={p.clip ? [{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }] : undefined} x1={p.x1} />
      </DOFBand>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 74% 72% at 50% 50%, rgba(0,0,0,0) 44%, rgba(14,8,8,.66) 100%)" }} />
    </AbsoluteFill>
  );
};
export const ScrollToParagraph: React.FC<ScrollToParagraphProps> = (p) => {
  const f = useCurrentFrame();
  const a = p.scrollAt ?? 8, d = p.scrollDur ?? 66;
  return (
    <Entered entry={p.entry ?? "glitch"} seed={7}>
      <MBlur on={f >= a + 0.15 * d && f < a + 0.7 * d}><Inner {...p} /></MBlur>
    </Entered>
  );
};
