// page / HeadlineCrop: wide page, then a HARD CUT on the word to a macro of the headline. The wide plate fades up from black and holds in a dark
// spotlight with a near-locked push (+0.6 %/s); on `cutAt` the picture cuts (no flash) to a macro crop where the headline fills the frame,
// tilted a little (roll), with a shallow depth of field (falloff above and below the line) and a slow lateral pan (+1.8 % W/s) + push.
// REF Farrell MV3 "wide page 1.5 s -> hard cut to a macro" (SL 8:34 -> 8:37; GR 10:01) + PG4 macro DOF (CC 17:28.8; GF headline macros @13:50.8);
// wp3 sec_C FivePage @ abs 6250. Nocturn: no highlight; the crop IS the emphasis.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DOFBand, H, W } from "../../core";
import { Entered, PageSheet, type Entry, type PageSrc } from "./shared";

export type HeadlineCropProps = PageSrc & {
  clip?: [number, number];
  x1?: number;
  wide: { cx: number; cy: number; s: number };
  macro: { cx: number; cy: number; s: number; roll?: number }; // centre on the headline block, s so both lines fill ~85 % W
  cutAt: number; // local frame of the hard cut (on the spoken word)
  pan?: number; // lateral pan in the macro, fraction of W per second (default 0.018)
  entry?: Entry; // default "fade"
};
export const HeadlineCrop: React.FC<HeadlineCropProps> = (p) => {
  const f = useCurrentFrame();
  const macro = f >= p.cutAt;
  const t = (f - (macro ? p.cutAt : 0)) / 30;
  const slices = p.clip ? [{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }] : undefined;
  const scene = macro ? (() => {
    const s = p.macro.s * (1 + 0.008 * t);
    const cx = p.macro.cx + (-0.012 * W + (p.pan ?? 0.018) * W * t) / s; // the camera starts slightly left of the block and pans right
    return (
      <AbsoluteFill style={{ background: "#f4f4f4" }}>
        <DOFBand y={H / 2} half={140} blur={4.5} feather={170}>
          <PageSheet {...p} cx={cx} cy={p.macro.cy} s={s} rot={p.macro.roll ?? -1.2} slices={slices} x1={p.x1} shadow="0 0 0 rgba(0,0,0,0)" />
        </DOFBand>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.42) 100%)" }} />
      </AbsoluteFill>
    );
  })() : (
    <AbsoluteFill style={{ background: "#0d0d0d" }}>
      <PageSheet {...p} cx={p.wide.cx} cy={p.wide.cy} s={p.wide.s * (1 + 0.006 * t)} slices={slices} x1={p.x1} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 52% at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,.5) 78%, rgba(0,0,0,.8) 100%)" }} />
    </AbsoluteFill>
  );
  return <Entered entry={p.entry ?? "fade"} fadeDur={20}>{scene}</Entered>;
};
