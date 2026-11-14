// labels / TitlePlace: REF Dashcam Vol.1 E3 title-size place @1:10.57-1:12.0 "Angeles / Crest Highway" over aerial stock (two lines, white line cap
// ~113-120 px, bbox y 369-519, red line y 534-691 with a red glow ~14 px; word-by-word BLUR + OPACITY reveal 3-4 f per word, stagger 6-8 f, each
// word within +-0.2 s of its spoken word; no position, scale or tracking change; hold 1.5-2.3 s; exit = cut or 10-15 f fade). FONTS.md row
// "Title-size place". OUR VERSION: Varela Round + round stroke, #FD292D red line; the block keeps a +0.6 %/s scale drift (never dead-still).
import React from "react";
import { useCurrentFrame } from "remotion";
import { RoundText, W, clamp01, drift } from "../../core";
import { FootPlate, SH_WHITE, type Word, glowRed } from "./kit";
import { LabelBand } from "../caseopener/shared";

const Line: React.FC<{ words: Word[]; cap: number; red: boolean; f: number }> = ({ words, cap, red, f }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: cap * 0.3 }}>
    {words.map((w, i) => {
      const k = f - w.at;
      const u = clamp01((k + 1) / 4);
      return (
        <div key={i} style={{ opacity: u, filter: `${red ? glowRed("#FD292D", 0.8) : SH_WHITE}${u < 1 ? ` blur(${(7 * (1 - u)).toFixed(2)}px)` : ""}` }}>
          <RoundText text={w.text} cap={cap} colour={red ? "#FD292D" : "#FFFFFF"} />
        </div>
      );
    })}
  </div>
);
export type TitlePlaceProps = { media: string; mediaStart?: number; push?: number; line1: Word[]; line2: Word[]; cap?: number; y?: number; outAt?: number; band?: number };
export const TitlePlace: React.FC<TitlePlaceProps> = ({ media, mediaStart = 0, push = 0.045, line1, line2, cap = 113, y = 528, outAt, band = 0 }) => {
  const f = useCurrentFrame();
  const t0 = line1[0]?.at ?? 0;
  const ex = outAt === undefined ? 0 : clamp01((f - outAt) / 12);
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {band > 0 ? <LabelBand o={band * clamp01((f - t0 + 2) / 15) * (1 - ex)} y={y} h={cap * 4.4} wPct={40} /> : null}
      <div style={{ position: "absolute", left: 0, width: W, top: y, transform: `translateY(-50%) scale(${drift(f - t0, 0.006).toFixed(5)})`, opacity: 1 - ex,
        display: "flex", flexDirection: "column", alignItems: "center", gap: cap * 0.3 }}>
        <Line words={line1} cap={cap} red={false} f={f} />
        <Line words={line2} cap={cap} red f={f} />
      </div>
    </FootPlate>
  );
};
