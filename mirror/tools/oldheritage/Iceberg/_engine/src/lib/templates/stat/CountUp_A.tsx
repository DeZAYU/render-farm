// stat / CountUp_A (EDITOR A sibling of RollUp / CounterStack / FigureLine_A; Amusement Park 2026-10-19).
// One to three STACKED figures over the case footage, each counting from 0 to its value in 16 f on its spoken word (Farrell R9 roll, ease-out,
// tabular figures), with its label typing on beside it. Values can carry a prefix/suffix and thousands separators; a text value (e.g. "36-63")
// skips the roll and wipes in instead. Editor A motion: the stack rides a constant upward tilt (-6 px/s) and the plate (case footage at 40 %,
// lightly defocused) pushes +2.5 %/s, so nothing parks. Inter 800 figures (white, the key one red), Inter 700 labels.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type CountRow = { value: number | string; label: string; at: number; prefix?: string; suffix?: string; red?: boolean };
export type CountUpAProps = { media?: string; mediaStart?: number; rows: CountRow[]; cap?: number; labelCap?: number; x?: number };
const RED = "#E30A10";
const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
export const CountUp_A: React.FC<CountUpAProps> = ({ media, mediaStart = 0, rows, cap = 120, labelCap = 34, x = 0.12 * W }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const pitch = cap * 1.55;
  const y0 = H / 2 - (rows.length * pitch) / 2 + cap * 0.2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {media ? <FootPlate src={media} startFrom={mediaStart} push={0.025} filter="blur(6px) brightness(.4) saturate(.8)" /> : <AbsoluteFill style={{ background: "#070707" }} />}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,.25) 60%, rgba(0,0,0,0) 85%)" }} />
      <AbsoluteFill style={{ transform: `translateY(${(-6 * t).toFixed(2)}px)` }}>
        {rows.map((r, i) => {
          const k = f - r.at;
          if (k < 0) return null;
          const u = EZ.out3(clamp01(k / 16));
          const isNum = typeof r.value === "number";
          const txt = isNum ? `${r.prefix ?? ""}${fmt((r.value as number) * u)}${r.suffix ?? ""}` : `${r.prefix ?? ""}${r.value}${r.suffix ?? ""}`;
          const wipe = isNum ? 1 : u;
          const lk = k - 6;
          const shown = lk < 0 ? "" : r.label.slice(0, Math.min(r.label.length, Math.floor(lk / 1.3) + 1));
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y0 + i * pitch, display: "flex", alignItems: "baseline", gap: cap * 0.32, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", cap), color: r.red ? RED : "#FDFDFD", fontVariantNumeric: "tabular-nums", clipPath: `inset(0 ${(100 * (1 - wipe)).toFixed(1)}% 0 0)`, opacity: clamp01(k / 4), filter: `drop-shadow(0 5px 16px rgba(0,0,0,.7))${r.red ? " drop-shadow(0 0 12px rgba(227,10,16,.45))" : ""}` }}>{txt}</span>
              <span style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", labelCap), color: "#ECECEC", letterSpacing: "0.06em", textShadow: "0 3px 10px rgba(0,0,0,.7)" }}>{shown}</span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
