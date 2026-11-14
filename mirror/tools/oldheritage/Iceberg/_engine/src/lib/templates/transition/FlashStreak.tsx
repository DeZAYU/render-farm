// transition / FlashStreak: Dashcam Vol.3 F1 flash-streak (31 uses; study/dashcam_v3 STUDY §F1 + recipe I4), 10 f around the cut c:
// c-3..c-1 horizontal white streak bars sweep in over the outgoing shot (+5 % exposure); c, c+1 full white bloom with streaks; c+2, c+3 the
// incoming shot with streak remnants (.3); c+4..c+7 the second burst (.55 .95 .95 .9); c+8, c+9 decay (.55 .2). wp3 sec_B TTQuote / sec_C HighPage.
// Our version: streak bars are seeded per cut (no two transitions identical), stretched with a horizontal blur only (no vertical bleed).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { W, rng } from "../../core";
import { Cut, type TransitionProps } from "./shared";

const OVER: Record<number, number> = { [-3]: 0.12, [-2]: 0.2, [-1]: 0.32, 0: 0.9, 1: 0.9, 2: 0.3, 3: 0.3, 4: 0.55, 5: 0.95, 6: 0.95, 7: 0.9, 8: 0.55, 9: 0.2 };
const BARS: Record<number, number> = { [-3]: 0.6, [-2]: 0.75, [-1]: 0.9, 0: 1, 1: 1, 2: 0.55, 3: 0.4, 4: 0.5, 5: 0.6, 6: 0.5, 7: 0.35, 8: 0.2, 9: 0.08 };
export type FlashStreakProps = TransitionProps & { seed?: number; bars?: number };
export const FlashStreak: React.FC<FlashStreakProps> = (p) => {
  const f = useCurrentFrame();
  const k = Math.floor(f - p.cut);
  const o = OVER[k] ?? 0;
  const bo = BARS[k] ?? 0;
  const r = rng((p.seed ?? 7) * 131 + (k + 10) * 17);
  const n = p.bars ?? 3;
  const bars = bo > 0 ? Array.from({ length: n + (k >= 0 && k <= 1 ? 3 : 0) }, () => ({ y: 120 + r() * 840, h: 10 + r() * 18, x: -300 + r() * 500, w: 1300 + r() * 1300 })) : [];
  return (
    <AbsoluteFill>
      <Cut {...p} styleA={k >= -3 ? { filter: `brightness(${1 + 0.05 * (k + 4)})` } : undefined} />
      {o > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: o }} /> : null}
      {bars.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: Math.min(b.w, W + 400), height: b.h, background: "#fff", opacity: bo, filter: "blur(5px)",
          boxShadow: "0 0 70px 26px rgba(255,255,255,.6)", borderRadius: b.h }} />
      ))}
    </AbsoluteFill>
  );
};
