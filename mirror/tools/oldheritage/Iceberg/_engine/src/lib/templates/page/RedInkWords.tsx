// page / RedInkWords: the words themselves turn red. A flat page whose long body is COLLAPSED with slices (headline block stacked right above
// the spoken paragraph), framed on the headline, then ONE eased move down onto the paragraph that ends as the phrase is said; the phrase's
// black type turns red L->R (red ink, "lighten" over the page: only the glyphs change colour, the paper stays white). DOF band on the line.
// Enters on the D1 4-frame hard white flash.
// REF Dashcam Vol.3 E4 @0:07.6 (red key words "Scarborough" / "northern Ontario" in the article body) + D1 white flash; wp3 sec_C HighPage
// @ abs 7036 (Focus Taiwan high-court page, one move, red words on "jointly liable").
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DOFBand, EZ, H, MBlur, RC, lerp, lerpLog } from "../../core";
import { Entered, PageSheet, linear, markBars, type Entry, type Mark, type PageSrc, type Slice } from "./shared";

export type RedInkWordsProps = PageSrc & {
  slices?: Slice[]; // virtual layout (y0..y1 of the page drawn at vy); camera cy is VIRTUAL
  x1?: number;
  from: { cx: number; cy: number; s: number }; // headline framing (virtual CSS px)
  to: { cx: number; cy: number; s: number }; // paragraph framing
  moveAt: number; moveDur?: number;
  words?: Mark[]; // phrases whose type turns red (page CSS px; omit = no highlight)
  ink?: string;
  entry?: Entry; // default "flash"
};
const Inner: React.FC<RedInkWordsProps> = (p) => {
  const f = useCurrentFrame();
  const m = EZ.move((f - p.moveAt) / (p.moveDur ?? 24));
  const cx = lerp(p.from.cx, p.to.cx, m), cy = lerp(p.from.cy, p.to.cy, m);
  const s = lerpLog(p.from.s, p.to.s, m) * (1 + 0.006 * (Math.max(0, f) / 30));
  const bars = markBars(f, p.words, { c: p.ink ?? RC.inkRed, mode: "ink", ease: linear, perLine: 18, px: 0, py: 1 });
  return (
    <AbsoluteFill style={{ background: "#151313" }}>
      <DOFBand y={H / 2} half={95} blur={4.5} feather={135}>
        <PageSheet {...p} cx={cx} cy={cy} s={s} bars={bars} slices={p.slices} x1={p.x1} />
      </DOFBand>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,.62) 100%)" }} />
    </AbsoluteFill>
  );
};
export const RedInkWords: React.FC<RedInkWordsProps> = (p) => {
  const f = useCurrentFrame();
  const d = p.moveDur ?? 24;
  return (
    <Entered entry={p.entry ?? "flash"}>
      <MBlur on={f >= p.moveAt + 2 && f <= p.moveAt + d * 0.75}><Inner {...p} /></MBlur>
    </Entered>
  );
};
