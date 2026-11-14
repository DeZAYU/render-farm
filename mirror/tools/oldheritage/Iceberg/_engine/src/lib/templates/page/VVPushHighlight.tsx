// page / VVPushHighlight: Visual Venture §6 page push + highlighter. The page is re-graded light grey (#D2D7E1 centre -> #A0A29F corners) with
// depth of field on the key line; ONE camera burst (velocity x1.28 per 2 f to a peak at +1.05 s, then decaying tau 1.45 s, still moving at
// the cut) that drifts toward the phrase; the yellow #D5DE10 highlighter starts 3 f after the cut as a caret and wipes L->R with an ease-out,
// finishing on the last spoken word. Hard cut in (the burst IS the entry).
// REF Visual Venture @1:32.51 (also 5:13.86, 7:08.05); wp3 sec_A MdtPage @ abs 2075, sec_C SkinPage @ abs 5571. Twist: motion blur on the burst peak.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DOFBand, EZ, H, MBlur, RC, lerp, vvBurst, vvBurstN } from "../../core";
import { PageSheet, markBars, type Mark, type PageSrc } from "./shared";

export type VVPushHighlightProps = PageSrc & {
  clip?: [number, number];
  x1?: number; // crop the sidebar (CSS x)
  start: { cx: number; cy: number }; // framing on the cut
  target: { cx: number; cy: number }; // centre of the key line (the burst drifts here; DOF band follows it)
  s: number; // screen px per CSS px on the cut
  Z?: number; // burst strength (scale = exp(Z * vvBurst)); 0.010 = x1.5 over 3 s, 0.013 = x1.8
  marks?: Mark[]; // highlighter phrases (omit = VV burst without a highlight, as wp3 sec_B TTHead)
  markColour?: string;
  grey?: boolean; // VV light-grey regrade (default true)
};
const Inner: React.FC<VVPushHighlightProps> = (p) => {
  const f = useCurrentFrame();
  const k = Math.max(0, f);
  const sc = Math.exp((p.Z ?? 0.01) * vvBurst(k));
  const u = vvBurstN(k, 120);
  const cx = lerp(p.start.cx, p.target.cx, u), cy = lerp(p.start.cy, p.target.cy, u);
  const s = p.s * sc;
  const fy = H / 2 + (p.target.cy - cy) * s;
  const bars = markBars(f, p.marks, { c: p.markColour ?? RC.vvHighlight, ease: EZ.hlWipe, perLine: 45, px: 3, py: 3, radius: 4 });
  const grey = p.grey !== false;
  return (
    <AbsoluteFill style={{ background: "#8E908D" }}>
      <DOFBand y={fy} half={110} blur={3.5} feather={150}>
        <PageSheet {...p} cx={cx} cy={cy} s={s} bars={bars} slices={p.clip ? [{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }] : undefined} x1={p.x1} shadow="0 0 0 rgba(0,0,0,0)" />
      </DOFBand>
      {grey ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, #D4D9E3 0%, #BFC3C6 60%, #8F918E 100%)", mixBlendMode: "multiply" }} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(70,72,70,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
export const VVPushHighlight: React.FC<VVPushHighlightProps> = (p) => {
  const f = useCurrentFrame();
  return <MBlur on={f >= 18 && f <= 52}><Inner {...p} /></MBlur>;
};
