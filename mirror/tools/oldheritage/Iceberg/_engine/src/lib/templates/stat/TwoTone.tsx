// stat / TwoTone: REF Dashcam Vol.3 E5 stat callout "23 years" @1:47.87 (white number + red word, two-tone, ~0.08 H, clear space near the frame
// centre; the number pops alpha .19 -> .82 in 5 f, dips .77, 1.0 by +20 f, rises 8 px; the red word rises 46 px -> settle, alpha .2 -> .99 in
// 21 f, ease-out; lands ~0.4 s after the number is spoken; leaves ON THE HARD CUT, no exit) + "20 minutes" @922.4, "1300HP" @1:42.
// wp3 sec_C Stat ("~500 injured" @ abs 5390, "~NT$900m damages" @ abs 7180, approved). OUR VERSION: Varela Round + round stroke (FONTS.md),
// a velocity smear on the red rise, and a +0.5 %/s life drift on the pair.
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, RC, RoundText, W, drift } from "../../core";
import { FootPlate } from "../labels/kit";
import { numPop, wordPop } from "./shared";

export type TwoToneProps = { media: string; mediaStart?: number; push?: number; num: string; word: string; at: number; wordAt?: number; cap?: number; y?: number };
export const TwoTone: React.FC<TwoToneProps> = ({ media, mediaStart = 0, push = 0.045, num, word, at, wordAt, cap = 104, y = 0.47 * H }) => {
  const f = useCurrentFrame();
  const n = numPop(f - at), w = wordPop(f - (wordAt ?? at));
  const sh = "drop-shadow(0 3px 10px rgba(0,0,0,.65))";
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {f >= at ? (
        <div style={{ position: "absolute", left: 0, width: W, top: y, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: cap * 0.32, transform: `scale(${drift(f - at, 0.005).toFixed(5)})` }}>
          <div style={{ opacity: n.o, transform: `translateY(${n.y.toFixed(2)}px)`, filter: sh }}><RoundText text={num} cap={cap} colour="#FFFFFF" /></div>
          <div style={{ opacity: w.o, transform: `translateY(${w.y.toFixed(2)}px)`, filter: `${sh} drop-shadow(0 0 10px rgba(249,9,15,.4))${w.v > 0.6 ? ` blur(${Math.min(3, w.v * 0.35).toFixed(2)}px)` : ""}` }}>
            <RoundText text={word} cap={cap} colour={RC.labelRed} />
          </div>
        </div>
      ) : null}
    </FootPlate>
  );
};
