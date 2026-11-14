// caseopener / ChapterRise: REF Visual Venture §1 chapter card "rise and recede" @1:00.73 / 9:14.93 / 22:58.84 (MOTION.md §1: background fades up
// 8 f; the headline enters from the bottom edge at +2 f, opacity ramps 6 f, arrives soft; the group rises (tau 1.1 s, peak 19 px/f at f6-7) and
// recedes S = 0.39 + 0.61 e^(-t/1.1) from x2.12, never settling; the title line rises from below +13 f later (offset 105 -> 40,
// bezier .404,.252,.291,.94); hard cut out, no exit). OUR VERSION: the card is the case footage itself, defocused and darkened under VV's
// radial dark-red glow (so the cut out lands on the same shot, sharp); the headline is the DD case number (identity), the "title box" is the
// DD two-tone date line, the place follows +8 f; words ghost in on their spoken frames (VV §8). Motion blur on the fast rise.
import React from "react";
import { AbsoluteFill } from "remotion";
import { EZ, FreshLayer, MBlur, RoundText, W, clamp01, ghost, rng } from "../../core";
import { CaseGlyph, FootPlate, SH_WHITE, type Word, glowRed } from "../labels/kit";
import { type CaseOpenerProps, Fill, useF } from "./shared";

const DUST = (() => { const r = rng(41); return Array.from({ length: 34 }, () => ({ x: r() * W, y: r() * 1080, s: 1 + r() * 2.2, v: 4 + r() * 10, a: 0.15 + r() * 0.35, ph: r() * 6.28 })); })();
const Line: React.FC<{ words: Word[]; f: number; cap: number }> = ({ words, f, cap }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: cap * 0.32 }}>
    {words.map((w, i) => {
      const g = ghost(f - w.at, 4, 0.3);
      return (
        <div key={i} style={{ opacity: g, filter: w.red ? glowRed() : SH_WHITE }}>
          <RoundText text={w.text} cap={cap} colour={w.red ? "#F22522" : "#FDFDFD"} />
        </div>
      );
    })}
  </div>
);

export type ChapterRiseProps = CaseOpenerProps & { clearAt?: number; glyph?: number; cap?: number; defocus?: number };
export const ChapterRise: React.FC<ChapterRiseProps> = ({ number, dateWords, placeWords = [], media, mediaStart = 0, push = 0.045, clearAt = 84, glyph = 240, cap = 60, defocus = 16 }) => {
  const f = useF();
  const card = f < clearAt;
  const t = Math.max(0, f - 2) / 30;
  const S = (0.39 + 0.61 * Math.exp(-t / 1.1)) / 0.475; // = 2.1 at entry, 1.0 at +2.17 s, still receding
  const rise = -520 * (1 - Math.exp(-t / 1.1));
  const bg = clamp01(f / 8);
  const numO = f < 2 ? 0 : 0.45 + 0.55 * clamp01((f - 2) / 6);
  const numB = f < 2 ? 0 : 3 * (1 - clamp01((f - 2) / 8));
  const lineAt = dateWords[0]?.at ?? 15;
  const boxY = (a: number) => 105 - 65 * EZ.chapterBox(clamp01((f - a) / 30));
  const lineO = (a: number) => clamp01((f - a + 1) / 6);
  const placeAt = placeWords[0]?.at ?? lineAt + 8;
  const fast = card && f >= 2 && f < 24;
  const body = (
    <AbsoluteFill>
      <FootPlate src={media} startFrom={mediaStart} push={push} filter={card ? `blur(${defocus}px) brightness(.36) saturate(.55)` : undefined}>
        {card ? (
          <>
            <AbsoluteFill style={{ opacity: bg, background: "radial-gradient(ellipse 70% 60% at 50% 72%, rgba(58,0,6,.85) 0%, rgba(18,2,3,.55) 45%, rgba(2,2,2,.35) 100%)" }} />
            <AbsoluteFill style={{ background: "#000", opacity: 1 - bg }} />
            {DUST.map((d, i) => (
              <div key={i} style={{ position: "absolute", left: d.x + 6 * Math.sin(f / 40 + d.ph), top: ((d.y - d.v * f * 0.25) % 1080 + 1080) % 1080, width: d.s, height: d.s, borderRadius: "50%", background: "#ffd9d0", opacity: d.a * bg }} />
            ))}
<FreshLayer>
            <div style={{ position: "absolute", left: 0, width: W, top: 1050, transformOrigin: "50% 50%", transform: `translateY(-50%) translateY(${rise.toFixed(2)}px) scale(${S.toFixed(4)})` }}>{/* fixed-width group: the centre never depends on content width */}
              <div style={{ position: "relative", width: W, height: glyph * 1.1 }}>
                <CaseGlyph text={number} glyph={glyph} x={W / 2} y={glyph * 0.55} opacity={numO} blur={numB} glow={1.4} />
              </div>
              <div style={{ transform: `translateY(${(boxY(lineAt) - 40).toFixed(2)}px)`, opacity: lineO(lineAt) }}><Line words={dateWords} f={f} cap={cap} /></div>
              {placeWords.length ? <div style={{ marginTop: cap * 0.32, transform: `translateY(${(boxY(placeAt) - 40).toFixed(2)}px)`, opacity: lineO(placeAt) }}><Line words={placeWords} f={f} cap={cap} /></div> : null}
            </div>
            </FreshLayer>
          </>
        ) : null}
      </FootPlate>
    </AbsoluteFill>
  );
  return <Fill><MBlur on={fast} samples={6}>{body}</MBlur></Fill>;
};
