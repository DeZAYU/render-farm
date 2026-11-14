// stat / StatSwitch: REF Farrell text T5 / R11 stat sentence on the SAME clip (L05 @SL 15:10.50 "78% OF REPORTS...": text and background change ON
// THE SAME FRAME: gblur sigma 12, gain x0.45, saturation 204 -> 45; the clip keeps playing; text pops 1 f, +0.16 s after the number; locked
// (-0.29 %/s); hard cut after 4.8 s) + Dashcam Vol.3 E5 two-tone pop (white words, red key word). wp3 sec_B StatMinute "UNDER A / MINUTE" @ abs 4069.
// OUR VERSION: a stacked two-line sentence in Varela Round caps (FONTS.md), each word on its spoken frame with the D3 pop curves.
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, RC, RoundText, W } from "../../core";
import { FootPlate, type Word } from "../labels/kit";
import { numPop, wordPop } from "./shared";

export type StatSwitchProps = { media: string; mediaStart?: number; push?: number; at: number; lines: Word[][]; cap?: number; y?: number };
export const StatSwitch: React.FC<StatSwitchProps> = ({ media, mediaStart = 0, push = 0.03, at, lines, cap = 104, y = 0.5 * H }) => {
  const f = useCurrentFrame();
  const on = f >= at;
  const lock = on ? 1 - 0.0029 * ((f - at) / 30) : 1;
  const sh = "drop-shadow(0 4px 10px rgba(0,0,0,.7))";
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push} base={1.04} filter={on ? "blur(12px) brightness(.45) saturate(.3)" : undefined}>
      {on ? (
        <div style={{ position: "absolute", left: 0, width: W, top: y, transform: `translateY(-50%) scale(${lock.toFixed(5)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: cap * 0.42 }}>
          {lines.map((ln, i) => (
            <div key={i} style={{ display: "flex", gap: cap * 0.34, alignItems: "flex-end" }}>
              {ln.map((w, j) => {
                const p = w.red ? wordPop(f - w.at) : numPop(f - w.at);
                return (
                  <div key={j} style={{ opacity: p.o, transform: `translateY(${p.y.toFixed(2)}px)`, filter: w.red ? `${sh} drop-shadow(0 0 10px rgba(249,9,15,.45))` : sh }}>
                    <RoundText text={w.text} cap={cap} colour={w.red ? RC.labelRed : "#FFFFFF"} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : null}
    </FootPlate>
  );
};
