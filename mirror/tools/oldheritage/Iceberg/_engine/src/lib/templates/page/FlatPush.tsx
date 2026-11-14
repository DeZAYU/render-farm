// page / FlatPush: the calm page. Flat, un-tilted page in a dark spotlight (Farrell PG2 / Nocturn "spotlight on the headline"), a constant linear
// life push (+0.6 %/s), and at most ONE eased move (scroll / re-frame) on the phrase (quick start, long settle, motion blur only while it travels).
// REF wp3 sec_C SupPage (Focus Taiwan Supreme Court page, no highlight, 1 white frame in = Farrell EN4) + FivePage wide plate.
// Optional highlight = Farrell HL1 blue selection band (appears at once, no wipe, no cursor). Nocturn rule: use it without highlight ~half the time.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, MBlur, clamp01, lerp, lerpLog, type Rect } from "../../core";
import { Entered, PageSheet, type Entry, type Mark, type PageSrc } from "./shared";

export type FlatPushProps = PageSrc & {
  clip?: [number, number]; // CSS y range shown (drop site chrome)
  x1?: number; // CSS x where the sheet ends (crop sidebars)
  cam: { cx: number; cy: number; s: number }; // opening framing (CSS px at screen centre, screen px per CSS px)
  move?: { cx: number; cy: number; s: number; at: number; d?: number }; // one eased move (scroll down to the paragraph / re-frame)
  push?: number; // life push per second (0.006 = +0.6 %/s; Farrell 0.0015-0.009)
  select?: Mark[]; // optional blue selection band(s) (HL1)
  selectColour?: string;
  entry?: Entry; // default "whiteFrame" (Farrell single white frame into a page)
};
const Inner: React.FC<FlatPushProps> = (p) => {
  const f = useCurrentFrame();
  const m = p.move ? EZ.move((f - p.move.at) / (p.move.d ?? 28)) : 0;
  const to = p.move ?? p.cam;
  const cx = lerp(p.cam.cx, to.cx, m), cy = lerp(p.cam.cy, to.cy, m);
  const s = lerpLog(p.cam.s, to.s, m) * (1 + (p.push ?? 0.006) * Math.max(0, f / 30));
  const bars = (p.select ?? []).flatMap((mk) => mk.rects.map((r: Rect) => ({ r, p: clamp01((f - mk.at) / 2), c: p.selectColour ?? "#9DC3F7", px: 4, py: 4, radius: 2 })));
  return (
    <AbsoluteFill style={{ background: "#0d0d0d" }}>
      <PageSheet {...p} cx={cx} cy={cy} s={s} bars={bars} slices={p.clip ? [{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }] : undefined} x1={p.x1} shadow="0 0 0 rgba(0,0,0,0)" />
      {/* spotlight: the page stays white in the middle, falls to near-black at the corners (Farrell PG2 heavy vignette) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 50% 47%, rgba(0,0,0,0) 40%, rgba(0,0,0,.5) 78%, rgba(0,0,0,.8) 100%)" }} />
    </AbsoluteFill>
  );
};
export const FlatPush: React.FC<FlatPushProps> = (p) => {
  const f = useCurrentFrame();
  const d = p.move?.d ?? 28;
  const fast = !!p.move && f >= p.move.at + 2 && f <= p.move.at + d * 0.7;
  return (
    <Entered entry={p.entry ?? "whiteFrame"}>
      <MBlur on={fast}><Inner {...p} /></MBlur>
    </Entered>
  );
};
