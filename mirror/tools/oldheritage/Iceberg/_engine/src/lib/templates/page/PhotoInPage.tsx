// page / PhotoInPage: one page, two journeys. On the cut the camera sits on the headline; a VV velocity burst carries it DOWN into the
// article's own photo (the photo opens up to fill the frame, no depth blur while we are in it); on the second phrase a quick-start /
// long-settle move brings it back UP to one sentence, where the VV yellow highlighter wipes the spoken words with the DOF band on that line.
// REF Visual Venture page burst + pan @1:32.51 / 2:02.08 (VV §6: velocity x1.28 per 2 f to a peak at +1.05 s, tau 1.45 s; pan toward the
// target) + VV §11 phase move (0.31,0,0,0.957); wp3 sec_B TTHead @ abs 3311 (headline -> photo burst).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DOFBand, EZ, H, MBlur, RC, lerp, lerpLog, vvBurst } from "../../core";
import { PageSheet, markBars, type Mark, type PageSrc } from "./shared";

type Cam = { cx: number; cy: number; s: number };
export type PhotoInPageProps = PageSrc & {
  clip?: [number, number];
  x1?: number;
  head: Cam; // headline framing on the cut
  photo: Cam; // the article's photo filling the frame
  line: Cam & { at: number; d?: number }; // the sentence framing, move start, duration (default 40)
  burstNorm?: number; // frames the burst is normalised over (default 75)
  marks?: Mark[]; // yellow highlighter on the sentence (omit = none)
  markColour?: string; // highlighter colour (default VV yellow; per-video identity, e.g. DASH accent at ~50 % alpha)
  grey?: boolean;
};
const Inner: React.FC<PhotoInPageProps> = (p) => {
  const f = useCurrentFrame();
  const raw = vvBurst(Math.max(0, f)) / vvBurst(p.burstNorm ?? 75); // unclamped VV burst, soft-landed so it never stops dead
  const b = Math.min(1, (1 - Math.exp(-2.2 * raw)) / (1 - Math.exp(-2.2 * 1.25)));
  const m = EZ.quick((f - p.line.at) / (p.line.d ?? 40));
  const c1 = { cx: lerp(p.head.cx, p.photo.cx, b), cy: lerp(p.head.cy, p.photo.cy, b), s: lerpLog(p.head.s, p.photo.s, b) };
  const cx = lerp(c1.cx, p.line.cx, m), cy = lerp(c1.cy, p.line.cy, m);
  const s = lerpLog(c1.s, p.line.s, m) * (1 + 0.006 * (Math.max(0, f) / 30));
  const inPhoto = b * (1 - m);
  const bars = markBars(f, p.marks, { c: p.markColour ?? RC.vvHighlight, ease: EZ.hlWipe, perLine: 40, px: 3, py: 3, radius: 4 });
  return (
    <AbsoluteFill style={{ background: "#8E908D" }}>
      <DOFBand y={H / 2} half={110 + 520 * inPhoto} blur={3.5 * (1 - inPhoto)} feather={150}>
        <PageSheet {...p} cx={cx} cy={cy} s={s} bars={bars} slices={p.clip ? [{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }] : undefined} x1={p.x1} shadow="0 0 0 rgba(0,0,0,0)" />
      </DOFBand>
    </AbsoluteFill>
  );
};
export const PhotoInPage: React.FC<PhotoInPageProps> = (p) => {
  const f = useCurrentFrame();
  const d = p.line.d ?? 40;
  const fast = (f > 14 && f < 50) || (f > p.line.at + 1 && f < p.line.at + d * 0.45);
  const raw = vvBurst(Math.max(0, f)) / vvBurst(p.burstNorm ?? 75);
  const b = Math.min(1, (1 - Math.exp(-2.2 * raw)) / (1 - Math.exp(-2.2 * 1.25)));
  const inPhoto = b * (1 - EZ.quick((f - p.line.at) / d));
  // M-072: the grey multiply wash and the radial vignette sit OUTSIDE the motion-blur subtree (inside it the 14 sub-frame samples stack into hard rings)
  return (
    <AbsoluteFill>
      <MBlur on={fast}><Inner {...p} /></MBlur>
      {p.grey !== false ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, #D4D9E3 0%, #BFC3C6 60%, #8F918E 100%)", mixBlendMode: "multiply", opacity: 1 - 0.6 * inPhoto }} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(70,72,70,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
