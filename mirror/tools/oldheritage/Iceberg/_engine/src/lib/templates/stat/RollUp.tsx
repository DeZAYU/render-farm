// stat / RollUp: REF Dashcam Vol.3 E5 stat (white number + red word) with the Farrell R9 counter ROLL; wp3 sec_A Stat1000 "~1,000 people"
// @ abs 1896 (approved v4: Inter 800 white number rolls up ease-out with the D3 pop curve and an 8 px rise; red word rises 46 px over 21 f).
// Placed in the TOP band so the scene underneath (diagram, crowd, map) stays readable. Helvetica-class (Inter 800) numerals, tabular.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, FONT, H, RC, W, clamp01, drift, fs } from "../../core";
import { FootPlate } from "../labels/kit";
import { fmt, numPop, wordPop } from "./shared";

export type RollUpProps = { media: string; mediaStart?: number; push?: number; value: number; prefix?: string; word: string; at: number; wordAt?: number; rollDur?: number; cap?: number; y?: number; decimals?: number };
export const RollUp: React.FC<RollUpProps> = ({ media, mediaStart = 0, push = 0.04, value, prefix = "", word, at, wordAt, rollDur = 14, cap = 0.075 * H, y = 120, decimals = 0 }) => {
  const f = useCurrentFrame();
  const n = numPop(f - at), w = wordPop(f - (wordAt ?? at + 16));
  const v = value * EZ.out3(clamp01((f - at + 1) / rollDur));
  const fsz = fs("inter", cap);
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {f >= at ? (
        <div style={{ position: "absolute", left: 0, width: W, top: y, display: "flex", justifyContent: "center", alignItems: "baseline", gap: cap * 0.34, transform: `scale(${drift(f - at, 0.005).toFixed(5)})` }}>
          <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fsz, color: "#F2F2F2", opacity: n.o, transform: `translateY(${n.y.toFixed(1)}px)`, textShadow: "0 4px 10px rgba(0,0,0,.6)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
            {prefix}{fmt(v, "comma", decimals)}
          </div>
          <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fsz, color: RC.ringRed, opacity: w.o, transform: `translateY(${w.y.toFixed(1)}px)`, textShadow: "0 0 14px rgba(227,10,16,.55), 0 4px 10px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{word}</div>
        </div>
      ) : null}
    </FootPlate>
  );
};
