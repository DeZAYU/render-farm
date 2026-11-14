// stat / RecedeNumber: REF Visual Venture §2 slam card "hold huge, then fall back" @17:30.63 (MOTION.md §2: the block CUTS IN already overflowing
// at ~x3.1, bottom-clipped, and CREEPS UP with accelerating steps for 15 f; on the key word it RECEDES to x1 (tau 0.35 s for the first 0.5 s,
// then a 0.9 s tail), scaling about its LEFT-CENTRE so the left edges stay on one column; no glow, soft drop shadow; hard cut out) + VV §15
// rule 4 "recession is the house move". OUR VERSION for numbers: the big red figure COUNTS UP during the overflowing creep and lands on its value
// on the key word; the case footage sits underneath, defocused and dimmed (no flat plate); Bebas Neue + Oswald 200 (FONTS.md VV rows).
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, FONT, H, MBlur, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";
import { fmt } from "./shared";

export type RecedeNumberProps = { media: string; mediaStart?: number; top?: string; value: number; prefix?: string; suffix?: string; bottom?: string; fallAt?: number; decimals?: number; x?: number; cap?: number; labelCap?: number; subCap?: number };
export const RecedeNumber: React.FC<RecedeNumberProps> = ({ media, mediaStart = 0, top, value, prefix = "", suffix = "", bottom, fallAt = 15, decimals = 0, x = 0.2 * W, cap = 220, labelCap = 86, subCap = 62 }) => {
  const f = useCurrentFrame();
  const p1 = EZ.in2(clamp01(f / fallAt));
  const t2 = Math.max(0, f - fallAt) / 30;
  const S = f < fallAt ? 3.1 + 0.05 * p1 : 1 + 2.15 * (0.62 * Math.exp(-t2 / 0.35) + 0.38 * Math.exp(-t2 / 0.9));
  const y = f < fallAt ? 90 - 93 * p1 : -3 - 160 * (1 - Math.exp(-t2 / 0.45));
  const v = value * EZ.out2(clamp01((f + 1) / fallAt));
  const fast = f >= fallAt && f < fallAt + 12;
  const sh = "0 4px 10px rgba(0,0,0,.65)";
  return (
    <FootPlate src={media} startFrom={mediaStart} push={0.02} base={1.05} filter="blur(7px) brightness(.38) saturate(.6)">
      <MBlur on={fast} samples={6}>
        <div style={{ position: "absolute", left: x, top: H * 0.56, transformOrigin: "0% 50%", transform: `translateY(-50%) translateY(${y.toFixed(1)}px) scale(${S.toFixed(4)})` }}>
          {top ? <div style={{ fontFamily: FONT.oswald, fontWeight: 200, fontSize: fs("oswald", subCap), lineHeight: 1.05, color: "#EDEDED", textShadow: sh, whiteSpace: "nowrap" }}>{top}</div> : null}
          <div style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), lineHeight: 0.92, color: "#E30005", textShadow: sh, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
            {prefix}{fmt(v, "comma", decimals)}{suffix}
          </div>
          {bottom ? <div style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", labelCap), lineHeight: 1.0, color: "#F1F2F1", textShadow: sh, whiteSpace: "nowrap", letterSpacing: "0.01em" }}>{bottom}</div> : null}
        </div>
      </MBlur>
    </FootPlate>
  );
};
