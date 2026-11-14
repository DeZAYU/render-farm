// caseopener / TypedStamp: REF Dashcam Vol.2 E9 @8:23.4 (case "10": top-right number IN 3 steps in 0.2 s, no scale, hold 1.3-1.5 s, OUT 0.2 s,
// "the date label then types under it" 505.2) + D2 E2 (left-aligned label at x 0.25 W, baseline 0.54 H; after entry it keeps rising, decelerating)
// + D1 E4 typed stamp @2:29.2 ("MONDAY - 4:30 PM": per character ~2 f/char on the spoken words, exits with a 3 f vertical smear).
// OUR VERSION: identity number (D3 corner, Nunito gradient), the date and the place type as two left-aligned lines (Varela Round + round stroke),
// the key word red with D1's dark-red drop shadow; one smear exit for both lines.
import React from "react";
import { H, RoundText, W, clamp01, roundWidth } from "../../core";
import { CORNER, CaseGlyph, FootPlate, SH_WHITE, type Word, typedWords } from "../labels/kit";
import { type CaseOpenerProps, Fill, useF } from "./shared";

const TypedLine: React.FC<{ words: Word[]; f: number; step: number; cap: number }> = ({ words, f, step, cap }) => {
  const tw = typedWords(words, f, step);
  const space = cap * 0.36;
  return (
    <div style={{ display: "flex", gap: space, alignItems: "flex-start", height: cap * 1.55 }}>
      {tw.map((w, i) => (w.shown ? (
        <div key={i} style={{ filter: w.red ? "drop-shadow(0 3px 2px rgba(70,0,4,.8)) drop-shadow(0 0 8px rgba(249,43,48,.4))" : SH_WHITE, width: roundWidth(w.text, cap) }}>
          <RoundText text={w.shown} cap={cap} colour={w.red ? "#F92B30" : "#FFFFFF"} />
        </div>
      ) : null))}
    </div>
  );
};

export type TypedStampProps = CaseOpenerProps & { step?: number; cap?: number; x?: number; y?: number; outAt?: number };
export const TypedStamp: React.FC<TypedStampProps> = ({
  number, dateWords, placeWords = [], media, mediaStart = 0, push = 0.045, numberAt = 0, numberOut = 54, step = 2, cap = 72, x = 0.25 * W, y = 0.47 * H, outAt = 118,
}) => {
  const f = useF();
  const k = f - numberAt;
  const o = k < 0 || f >= numberOut + 6 ? 0 : (k < 2 ? 0.55 : k < 4 ? 0.78 : 1) * (f < numberOut ? 1 : f < numberOut + 2 ? 0.66 : f < numberOut + 4 ? 0.33 : 0.12);
  const first = dateWords[0]?.at ?? 0;
  const kk = f - first;
  const rise = kk < 0 ? 0 : -14 * (1 - Math.exp(-kk / 12)) - 0.12 * kk; // D2: keeps rising, decelerating, then a slow drift
  const sm = f >= outAt ? clamp01((f - outAt + 1) / 3) : 0;
  return (
    <Fill>
      <FootPlate src={media} startFrom={mediaStart} push={push}>
        <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 50%", transform: `translateY(${rise.toFixed(2)}px) scaleY(${(1 + sm * 0.35).toFixed(3)})`, opacity: 1 - sm * 0.9, filter: sm > 0 ? `blur(${(sm * 5).toFixed(1)}px)` : undefined, display: sm >= 1 ? "none" : "block" }}>
          <TypedLine words={dateWords} f={f} step={step} cap={cap} />
          <TypedLine words={placeWords} f={f} step={step} cap={cap} />
        </div>
        {o > 0 ? <CaseGlyph text={number} glyph={CORNER.glyph} x={CORNER.x} y={CORNER.y} opacity={o} /> : null}
      </FootPlate>
    </Fill>
  );
};
