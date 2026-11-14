// toll / Arithmetic: Farrell story #12 "ICO arithmetic" (YT: 25 pixel persons; 4 fade out on "four", 3 on "three"; the 18 left turn red; ends on a
// big "18"; each step on its word, hold 2 s) + #34 ("Five people survived, 13 didn't": the switch lands on "13") + Farrell evidence rule 10 (icons
// change by sliding the whole plane, not by many small animations). A block of N people; groups leave on their words (they fade to ghosts, so the
// gap stays readable), the remainder turns red on its word, then the whole plane slides left and the big figure pops at the right.
// Our version: departed people stay as 8 % ghosts; the final figure is the DD rounded stat face with a red glow.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, H, MBlur, RC, RoundText, W, clamp01, lerp } from "../../core";
import { P, PPDefs, PP_H, PP_W, PixelTexture, Plate, RED, RED_GLOW, WHITE, WHITE_GLOW } from "./shared";

export type ArithStep = { remove: number; at: number };
export type ArithmeticProps = { total: number; steps: ArithStep[]; redAt: number; number?: string; word?: string; numberAt?: number; cols?: number };

export const Arithmetic: React.FC<ArithmeticProps> = ({ total, steps, redAt, number, word, numberAt, cols }) => {
  const k = useCurrentFrame();
  const c = cols ?? Math.ceil(Math.sqrt(total * 1.6));
  const rows = Math.ceil(total / c);
  const px = Math.min(11, 560 / (rows * PP_H * 1.35), 1100 / (c * PP_W * 1.6));
  const pitchX = PP_W * px * 1.6, pitchY = PP_H * px * 1.35;
  const gw = c * pitchX, gh = rows * pitchY;
  // who leaves at which step: taken from the end of the block (reading order reversed)
  const leaveAt = new Array<number>(total).fill(Infinity);
  let idx = total - 1;
  steps.forEach((s) => { for (let j = 0; j < s.remove && idx >= 0; j++, idx--) leaveAt[idx] = s.at + j; });
  const na = numberAt ?? redAt + 24;
  const slide = number ? EZ.quick((k - na + 4) / 30) : 0;
  const cx = lerp(W / 2, W * 0.36, slide);
  const z = 1.02 * Math.exp(-0.008 * (k / 30));
  return (
    <Plate>
      <MBlur on={slide > 0.05 && slide < 0.6} samples={6}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <PPDefs />
          <g transform={`translate(${cx.toFixed(2)} ${H / 2}) scale(${z.toFixed(5)}) translate(${-gw / 2} ${-gh / 2})`}>
            {Array.from({ length: total }, (_, i) => {
              const x = (i % c) * pitchX + (pitchX - PP_W * px) / 2, y = Math.floor(i / c) * pitchY;
              const lq = k - leaveAt[i];
              const gone = lq >= 0;
              const o = gone ? lerp(1, 0.08, EZ.out2(lq / 10)) : 1;
              const rq = k - (redAt + (i % c) * 1.5);
              const isRed = !gone && rq >= 0;
              return (
                <g key={i} style={{ filter: isRed ? RED_GLOW : gone && lq > 6 ? undefined : WHITE_GLOW }}>
                  <P x={x} y={y} px={px} fill={isRed ? RED : WHITE} o={o * (isRed ? 0.6 + 0.4 * clamp01(rq / 3) : 1)} />
                </g>
              );
            })}
          </g>
        </svg>
      </MBlur>
      <PixelTexture cell={4} k={0.14} />
      {number && k >= na ? (
        <div style={{ position: "absolute", left: W * 0.62, top: H / 2 - 150, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14,
          filter: "drop-shadow(0 0 14px rgba(242,37,34,.45)) drop-shadow(0 4px 10px rgba(0,0,0,.6))" }}>
          <RoundText text={number} cap={210} colour={RC.labelRed} />
          {word ? <div style={{ opacity: clamp01((k - na - 6) / 8) }}><RoundText text={word} cap={56} colour="#FFFFFF" /></div> : null}
        </div>
      ) : null}
    </Plate>
  );
};
