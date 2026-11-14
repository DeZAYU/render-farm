// stat / StatSlide_A (EDITOR A sibling of TwoTone / RecedeNumber / BigNumber; Amusement Park 2026-10-19).
// One key figure + a red qualifier over the case footage. Editor A motion (VV world camera): the footage TRUCKS sideways at a constant rate and is
// defocused/dimmed only behind the text band; the figure SLIDES in from the right edge on its word with a horizontal smear (motion blur 16 px
// clearing over 10 f, EZ.quick 14 f) and keeps drifting left at 0.4 x the truck (parallax, never parked); the qualifier wipes in under it
// left-to-right on its own word; an optional small top line (date / context) types on. Figure in Bebas (cap 200), qualifier Bebas red,
// top line Inter 700. The band is a left-weighted dark gradient so the footage stays readable on the right.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type StatSlideAProps = { media: string; mediaStart?: number; value: string; at: number; word?: string; wordAt?: number; top?: string; topAt?: number; truck?: number; cap?: number; wordCap?: number; x?: number; y?: number; plateFilter?: string };
const RED = "#E30A10";
export const StatSlide_A: React.FC<StatSlideAProps> = ({ media, mediaStart = 0, value, at, word, wordAt, top, topAt = 0, truck = -22, cap = 200, wordCap = 64, x = 0.12 * W, y = 0.5 * H, plateFilter = "brightness(.62) saturate(.85)" }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const k = f - at;
  const u = EZ.quick(clamp01(k / 14));
  const fx = (W - x + 120) * (1 - u) + 0.4 * truck * Math.max(0, k) / 30;
  const wk = f - (wordAt ?? at + 10);
  const wipe = EZ.out3(clamp01(wk / 12));
  const tk = f - topAt;
  const shown = top ? top.slice(0, Math.max(0, Math.min(top.length, Math.floor(tk / 1.5)))) : "";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${(truck * t).toFixed(2)}px) scale(1.06)` }}>
        <FootPlate src={media} startFrom={mediaStart} push={0.03} filter={plateFilter} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,0) 78%)" }} />
      {shown ? <div style={{ position: "absolute", left: x, top: y - cap * 0.95, fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", 30), color: "#E8E8E8", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{shown}</div> : null}
      {k >= 0 ? (
        <div style={{ position: "absolute", left: x, top: y - cap * 0.62, transform: `translateX(${fx.toFixed(1)}px)`, filter: `blur(${(16 * (1 - u)).toFixed(1)}px) drop-shadow(0 6px 18px rgba(0,0,0,.7))`, opacity: clamp01(k / 3) }}>
          <span style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), color: "#FDFDFD", whiteSpace: "nowrap", lineHeight: 1 }}>{value}</span>
        </div>
      ) : null}
      {word && wk >= 0 ? (
        <div style={{ position: "absolute", left: x + 0.4 * truck * Math.max(0, k) / 30, top: y + cap * 0.48, clipPath: `inset(0 ${(100 * (1 - wipe)).toFixed(1)}% 0 0)`, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", wordCap), color: RED, letterSpacing: "0.03em", filter: "drop-shadow(0 0 10px rgba(227,10,16,.45))" }}>{word}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
