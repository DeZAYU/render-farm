// page / TiltedPrint: DD Vol.3 E4 tilted 3-D print. The real page as a slightly tilted print (perspective pitch 6 deg, roll -2.3 -> -1.5 deg),
// edge defocus (sharp ellipse in the middle, 5 px outside), heavy dark vignette, a SHORT DD scroll between two paragraphs (velocity ease-in to a
// peak at 0.9 s, then halving every 0.45 s) with the zoom bump +5.7 % -> +3 %, and opaque red multiply bars (#E01E1E) wiping L->R exactly the
// spoken words, 0.3-0.5 s early, ~0.6 s per line. Enters on the D3 F1 flash-streak.
// REF Dashcam Vol.3 E4 @0:08.0-0:14.4 (bar 0:10.0) + D3 F1 flash-streak; wp3 sec_B TTQuote @ abs 3748 (sec_A CpaPage @1509 = same plane, no bars).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, MBlur, RC, ddScroll, lerp } from "../../core";
import { Entered, PageSheet, ddWipe, markBars, type Entry, type Mark, type PageSrc } from "./shared";

export type TiltedPrintProps = PageSrc & {
  /** words inside the red bars: "page" (default, DD original: black on red) | "white" (re-inked white, M-024 contrast) */
  ink?: "page" | "white";
  clip?: [number, number];
  x1?: number;
  from: { cx: number; cy: number }; // opening framing (CSS px)
  to?: { cx: number; cy: number }; // where the scroll lands (omit = no scroll, the CpaPage "name row" version)
  s: number; // base screen px per CSS px
  scrollAt?: number; // local frame the scroll starts (default 0 = with the entry)
  bars?: Mark[]; // red bars on the spoken phrases (omit = no highlight)
  barColour?: string;
  roll?: [number, number]; // deg, start -> end
  pitch?: number; // deg
  entry?: Entry; // default "flashStreak"
};
const Inner: React.FC<TiltedPrintProps> = (p) => {
  const f = useCurrentFrame();
  const k = Math.max(0, f);
  const ks = f - (p.scrollAt ?? 0);
  const u = p.to ? ddScroll(ks, 140) : 0;
  const zoom = 1 + (k < 45 ? 0.057 * EZ.out3(k / 45) : 0.057 - 0.027 * EZ.out3((k - 45) / 80)) + 0.004 * (k / 30); // bump, then a slow life push
  const [r0, r1] = p.roll ?? [-2.3, -1.5];
  const rot = lerp(r0, r1, EZ.out3(k / 120));
  const to = p.to ?? p.from;
  const cx = lerp(p.from.cx, to.cx, u), cy = lerp(p.from.cy, to.cy, u);
  const bars = markBars(f, p.bars, { ink: p.ink, c: p.barColour ?? RC.pageRed, ease: ddWipe, perLine: 18, px: 2, py: 3, radius: 0 });
  const sheet = (
    <AbsoluteFill style={{ transform: `perspective(2200px) rotateX(${p.pitch ?? 6}deg)`, transformOrigin: "50% 60%" }}>
      <PageSheet {...p} cx={cx} cy={cy} s={p.s * zoom} rot={rot} bars={bars} slices={p.clip ? [{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }] : undefined} x1={p.x1} />
    </AbsoluteFill>
  );
  const edge = "radial-gradient(ellipse 62% 58% at 50% 50%, #000 55%, transparent 100%)";
  return (
    <AbsoluteFill style={{ background: "#141414" }}>
      <AbsoluteFill style={{ filter: "blur(5px)" }}>{sheet}</AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: edge, maskImage: edge }}>{sheet}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.72) 100%)" }} />
    </AbsoluteFill>
  );
};
export const TiltedPrint: React.FC<TiltedPrintProps> = (p) => {
  const f = useCurrentFrame();
  const ks = f - (p.scrollAt ?? 0);
  return (
    <Entered entry={p.entry ?? "flashStreak"} seed={11}>
      <MBlur on={!!p.to && ks > 12 && ks < 44}><Inner {...p} /></MBlur>
    </Entered>
  );
};
