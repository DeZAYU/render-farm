// labels / TypedTime: REF Dashcam Vol.1 E4 time stamp @2:27.5-2:29.2 "MONDAY - 4:30 PM" (white day + red time, cap 64, mid-left y 0.47-0.53,
// TYPED PER CHARACTER ~2 f/char on the spoken words, over a frozen frame, exits with the blur transition) + D1 "40 minutes" (2 f/char, red with a
// dark-red drop shadow). wp3 sec_B TimeStamp @ abs 3069 (approved). Exit = the 3 f vertical smear of D1 E4 "[MARK ALLEN BENEDICT]".
// Props: `white` types from `at`, then `red` from `redAt` (default straight after). Optional `freezeAt` holds the exact frame under it (D1).
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, RoundText, clamp01 } from "../../core";
import { FootPlate, SH_WHITE, typedN } from "./kit";
import { LabelBand } from "../caseopener/shared";

export type TypedTimeProps = { media: string; mediaStart?: number; push?: number; white: string; red: string; at: number; redAt?: number; step?: number; cap?: number; x?: number; y?: number; outAt?: number; freezeAt?: number; resumeAt?: number; band?: number };
export const TypedTime: React.FC<TypedTimeProps> = ({ media, mediaStart = 0, push = 0.045, white, red, at, redAt, step = 2, cap = 76, x = 300, y = 0.47 * H, outAt, freezeAt, resumeAt, band = 0 }) => {
  const f = useCurrentFrame();
  const rAt = redAt ?? at + step * (white.length + 1);
  const w = white.slice(0, typedN(white, f - at, step));
  const r = red.slice(0, typedN(red, f - rAt, step));
  const sm = outAt !== undefined && f >= outAt ? clamp01((f - outAt + 1) / 3) : 0;
  const fsz = (cap - 0.076 * cap) / 0.708;
  const drift = f > at ? -0.15 * (f - at) : 0; // slow life drift after the first glyph
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push} freezeAt={freezeAt} resumeAt={resumeAt}>
      {band > 0 && f >= at ? <LabelBand o={band * clamp01((f - at + 2) / 10) * (1 - sm)} y={y} h={cap * 3.6} wPct={46} /> : null}
      {sm < 1 ? (
        <div style={{ position: "absolute", left: x, top: y - fsz * 0.62, display: "flex", gap: fsz * 0.28, transformOrigin: "0 50%",
          transform: `translateY(${drift.toFixed(2)}px) scaleY(${(1 + sm * 0.35).toFixed(3)})`, opacity: 1 - sm * 0.85, filter: sm > 0 ? `blur(${(sm * 5).toFixed(1)}px)` : undefined }}>
          {w ? <RoundText text={w} cap={cap} colour="#FFFFFF" style={{ filter: SH_WHITE }} /> : null}
          {r ? <RoundText text={r} cap={cap} colour="#F92B30" style={{ filter: "drop-shadow(0 3px 2px rgba(70,0,4,.8)) drop-shadow(0 0 8px rgba(249,43,48,.4))" }} /> : null}
        </div>
      ) : null}
    </FootPlate>
  );
};
