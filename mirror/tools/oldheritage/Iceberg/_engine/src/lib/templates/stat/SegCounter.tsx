// stat / SegCounter: REF Farrell text T8 / R9 7-segment counters: G04 @GoFundMe 4:08.5 (DSEG7, ink .32 H, on black with a faint scanline
// matrix; LINEAR ROLL at a constant rate, stops dead 0.31 s after the spoken number with a BLOOM FLASH on the landing frame; 1-frame colour flip on
// the narrative turn) + Y08 @YT 13:52.33 (red #ED0000, glow r20 4 px / r5 25 px, CA 0.7 px, 4 f in) + Y03 flicker grammar (optional dropouts).
// wp3 refsys SevenSeg. Use for clocks, durations, money and counts that RUN (time passing, a total climbing). Rule 0: Farrell device, use rarely.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, Media, Vignette, W, clamp01 } from "../../core";
import { SevenSeg, fmt, segWidth } from "./shared";

export type SegCounterProps = {
  from: number; to: number; rollAt: number; landAt: number; format?: "int" | "comma" | "time" | "money"; decimals?: number;
  colour?: string; flipAt?: number; flipColour?: string; height?: number; flicker?: boolean; media?: string;
};
const glow = (c: string, k: number) => `drop-shadow(0 0 ${(4 + 6 * k).toFixed(1)}px ${c}) drop-shadow(0 0 ${(25 + 20 * k).toFixed(1)}px ${c}99)`;
export const SegCounter: React.FC<SegCounterProps> = ({ from, to, rollAt, landAt, format = "int", decimals = 0, colour = "#ED0000", flipAt, flipColour = "#05E40C", height = 0.32 * H, flicker = false, media }) => {
  const f = useCurrentFrame();
  const u = clamp01((f - rollAt) / Math.max(1, landAt - rollAt));
  const v = from + (to - from) * u;
  const text = fmt(v, format, decimals);
  const finalText = fmt(to, format, decimals);
  const c = flipAt !== undefined && f >= flipAt ? flipColour : colour;
  const bloom = f >= landAt ? Math.max(0, 1 - (f - landAt) / 6) : 0;
  const inO = clamp01((f + 1) / 4);
  const drop = flicker && f > 6 && Math.floor(f) % 38 < 4 ? 0.06 : 1; // Y03: 4 f dropout every ~1.25 s
  const push = 1 + 0.004 * (f / 30);
  const w = segWidth(finalText, height);
  return (
    <AbsoluteFill style={{ background: "#020202", overflow: "hidden" }}>
      {media ? <AbsoluteFill style={{ opacity: 0.18, filter: "blur(8px) saturate(.4)" }}><Media src={media} /></AbsoluteFill> : null}
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,40,40,.045) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(255,40,40,.03) 0 1px, transparent 1px 4px)" }} />
      <div style={{ position: "absolute", left: W / 2, top: H / 2, transform: `translate(-50%,-50%) scale(${push.toFixed(5)})`, width: w, display: "flex", justifyContent: "flex-end", opacity: inO * drop, filter: `${glow(c, bloom)} brightness(${(1 + 0.3 * bloom).toFixed(3)})` }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: -0.7, top: 0, opacity: 0.35, mixBlendMode: "screen", filter: "hue-rotate(-30deg)" }}><SevenSeg text={text} h={height} colour={c} ghost={0} /></div>
          <SevenSeg text={text} h={height} colour={c} />
        </div>
      </div>
      <Vignette opacity={0.8} />
    </AbsoluteFill>
  );
};
