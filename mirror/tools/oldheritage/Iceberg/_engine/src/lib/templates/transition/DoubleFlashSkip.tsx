// transition / DoubleFlashSkip: the camera-flash time jump inside one long dashcam take (REFERENCE_SYNTHESIS §H12 / B5).
// REF: Dashcam Vol.2 double-flash skip @7:34.7 (454.7 s), 491.2, 927.6, 990.1: white 1.0 for 6 f -> 0.45 for 2 f -> 0.75 for 2 f -> 1.0 for 2 f ->
// cut (0.2 s in total: D2 is 60p, so those are 60p frames), placed on the VO return. No SFX separable in D2.
// OUR VERSION: same envelope; the second burst (0.75 -> 1.0) carries a 6 % tint of the theme accent. `unit` = our frames per D2 60p frame:
// 0.5 (default) reproduces the measured 0.2 s at 30 fps (3/1/1/1 f); 1 plays the envelope frame-for-frame at 30 fps (6/2/2/2 f = 0.4 s).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WATERPARK, type Theme } from "../../core";
import { Cut, type TransitionProps } from "./shared";
import { mixHex } from "../labels/dash1kit";

/** D2 envelope in 60p frames, ending on the cut: [level, frames, second burst?] */
const ENV: [number, number, boolean][] = [[1.0, 6, false], [0.45, 2, false], [0.75, 2, true], [1.0, 2, true]];

export type DoubleFlashSkipProps = TransitionProps & { theme?: Theme; tint?: number; unit?: 0.5 | 1; tail?: number[] };
export const DoubleFlashSkip: React.FC<DoubleFlashSkipProps> = (p) => {
  const f = useCurrentFrame();
  const th = p.theme ?? WATERPARK;
  const unit = p.unit ?? 0.5;
  const total = ENV.reduce((a, e) => a + e[1], 0) * unit; // 6 f at 30 fps by default
  const k = Math.floor(f) - (p.cut - total); // frames into the envelope
  let o = 0, second = false;
  if (k >= 0 && k < total) {
    let acc = 0;
    for (const [lv, n, sb] of ENV) {
      const d = Math.max(1, Math.round(n * unit));
      if (k < acc + d) { o = lv; second = sb; break; }
      acc += d;
    }
  } else if (k >= total && p.tail?.length) {
    o = p.tail[k - total] ?? 0; // optional decay on the incoming frames (not in D2: default none)
  }
  const colour = second ? mixHex("#FFFFFF", th.accent, p.tint ?? 0.06) : "#FFFFFF";
  return (
    <AbsoluteFill>
      <Cut {...p} />
      {o > 0 ? <AbsoluteFill style={{ background: colour, opacity: o }} /> : null}
    </AbsoluteFill>
  );
};
