// toll / FillCounter: people fill in while a counter rolls up. REF: Farrell CC @ 12:41.6 (icon + number, the number lands on its first syllable)
// + Farrell R9 counter roll (GR @ 6:09.3 bank counter rolling) + Dashcam Vol.3 @ 1:47.87 (E5 stat "23 years": rounded white figure + red word);
// wp3 sec_A explainer @ 1827 ("pixel-person crowd fills on 'thousand', the number rolls up"). The field is a block at the right; people pop in a
// diagonal sweep (front rows first), each in 3 f; the counter is driven by the same progress curve (VV quick-start / long-settle), so number and
// crowd always agree. The figure sits at the left, the red word under it. Our version: white people with a faint glow on a slow pull-back.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, H, RC, RoundText, W, clamp01, hash } from "../../core";
import { P, PPDefs, PP_H, PP_W, Plate, WHITE, WHITE_GLOW, fmt } from "./shared";

export type FillCounterProps = {
  people?: number; // glyphs drawn
  value: number; // the figure the counter reaches
  prefix?: string; // e.g. "~"
  word?: string; // red word under the figure
  at?: number; // fill start
  dur?: number; // fill duration (frames)
  wordAt?: number;
};

export const FillCounter: React.FC<FillCounterProps> = ({ people = 240, value, prefix = "", word, at = 6, dur = 54, wordAt }) => {
  const k = useCurrentFrame();
  const cols = Math.ceil(Math.sqrt(people * 1.25)), rows = Math.ceil(people / cols);
  const areaW = 900, areaH = 760;
  const pitchX = Math.min(areaW / cols, (areaH / rows) * (46 / 62)), pitchY = pitchX * (62 / 46), px = pitchX * (3.9 / 46);
  const gx = 1420 - (cols * pitchX) / 2, gy = H / 2 - (rows * pitchY) / 2;
  const prog = EZ.quick((k - at) / dur);
  // reveal order: diagonal sweep from the bottom-left with a little jitter
  const order = Array.from({ length: people }, (_, i) => ({ i, d: (rows - 1 - Math.floor(i / cols)) / rows + (i % cols) / cols + 0.25 * hash(i * 3.1) }))
    .sort((a, b) => a.d - b.d).map((o) => o.i);
  const rank = new Array<number>(people);
  order.forEach((i, r) => { rank[i] = r; });
  const shown = prog * people;
  const sc = 1.03 * Math.exp(-0.006 * (k / 30));
  const wa = wordAt ?? at + Math.round(dur * 0.55);
  const n = prog >= 0.999 ? value : Math.floor(value * prog);
  return (
    <Plate>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <PPDefs />
        <g transform={`translate(1420 ${H / 2}) scale(${sc.toFixed(5)}) translate(-1420 ${-H / 2})`} style={{ filter: WHITE_GLOW }}>
          {Array.from({ length: people }, (_, i) => {
            const t = shown - rank[i]; // >0 once revealed; fades in over ~3 f worth of progress
            if (t <= 0) return null;
            const o = clamp01(t / Math.max(1, people / dur * 3));
            return <P key={i} x={gx + (i % cols) * pitchX + (pitchX - PP_W * px) / 2} y={gy + Math.floor(i / cols) * pitchY + (pitchY - PP_H * px) / 2} px={px} fill={WHITE} o={0.25 + 0.75 * o} />;
          })}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 120, width: 760, top: 330, display: "flex", justifyContent: "flex-end", filter: "drop-shadow(0 4px 12px rgba(0,0,0,.7))", opacity: clamp01((k - at + 2) / 4) }}>
        <RoundText text={`${prefix}${fmt(n)}`} cap={150} colour="#FFFFFF" />
      </div>
      {word ? (
        <div style={{ position: "absolute", left: 120, width: 760, top: 560, display: "flex", justifyContent: "flex-end", opacity: clamp01((k - wa) / 8), transform: `translateY(${(16 * (1 - EZ.out3((k - wa) / 14))).toFixed(2)}px)`,
          filter: "drop-shadow(0 0 8px rgba(242,37,34,.55)) drop-shadow(0 3px 6px rgba(0,0,0,.5))" }}>
          <RoundText text={word} cap={70} colour={RC.labelRed} />
        </div>
      ) : null}
    </Plate>
  );
};
