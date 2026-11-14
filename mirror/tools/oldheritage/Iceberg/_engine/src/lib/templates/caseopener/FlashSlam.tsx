// caseopener / FlashSlam: REF Dashcam Vol.2 E9 @12:56.25 (case "13", centre: the glyph ASSEMBLES FROM ERODED PARTICLES on a full-frame red
// wash with scanlines, a red halo BLOOMS and shrinks (red area 30k -> 154k -> 62k px2), ~50 % at +1.6 s, gone at +1.8 s) + Dashcam Vol.1 hard white
// flash (case entries: the cut lands inside 4 f of white 1/.85/.5/.2) + D1 red wash @0:13.31 (R-G +98 -> +20, half-life ~8 f, blurred -> sharp
// over 25 f). OUR VERSION: identity number (Nunito gradient) and the dated label stacked under it as one title block; the place label then
// takes the date's slot. Use for the heaviest case of a video (max one white flash per case).
import React from "react";
import { AbsoluteFill } from "remotion";
import { FLASH4, H, W, clamp01, envAt } from "../../core";
import { CaseGlyph, FootPlate, RiseRow } from "../labels/kit";
import { type CaseOpenerProps, Fill, LabelBand, presence, useF } from "./shared";

export type FlashSlamProps = CaseOpenerProps & { glyph?: number; cap?: number; seed?: number };
export const FlashSlam: React.FC<FlashSlamProps> = ({ number, dateWords, placeWords, media, mediaStart = 0, push = 0.045, numberAt = 0, numberOut = 50, dateOut, placeOut, glyph = 280, cap = 78, seed = 4 }) => {
  const f = useF();
  const k = f - numberAt;
  const wash = f < 0 ? 0 : Math.pow(0.5, f / 8); // red wash half-life 8 f
  const sharp = clamp01(f / 25);
  const white = envAt(FLASH4, f);
  // assembly: noise-threshold reveal + displacement that dies out in 10 f (pixel-dissolve texture of D1 E1 f2-5 / D2 "eroded particles")
  const rev = clamp01(k / 10);
  const disp = 70 * Math.pow(1 - rev, 1.6);
  const bias = -7 + 8.2 * rev; // alpha = 8 * noise + bias
  const bloom = k < 0 ? 0 : k < 9 ? k / 9 : 1 - 0.55 * clamp01((k - 9) / 24); // halo blooms then shrinks
  const ex = clamp01((f - numberOut) / 10);
  const o = k < 0 ? 0 : (1 - ex * ex);
  const dOut = dateOut ?? (placeWords?.length ? placeWords[0].at - 22 : undefined);
  const numY = 0.36 * H;
  const id = `fs-asm-${seed}`;
  const bandO = 0.36 * Math.max(presence(f, dateWords, dOut), presence(f, placeWords, placeOut));
  return (
    <Fill>
      <FootPlate src={media} startFrom={mediaStart} push={push} filter={sharp < 1 ? `blur(${(10 * (1 - sharp)).toFixed(2)}px)` : undefined}>
        {wash > 0.01 ? <AbsoluteFill style={{ background: `rgba(205,8,16,${(0.62 * wash).toFixed(3)})`, mixBlendMode: "color" }} /> : null}
        {wash > 0.01 ? <AbsoluteFill style={{ background: `rgba(150,0,8,${(0.45 * wash).toFixed(3)})`, mixBlendMode: "multiply" }} /> : null}
        {o > 0.01 && f < numberOut + 10 ? (
          <AbsoluteFill style={{ opacity: 0.16 * o, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.9) 0px, rgba(0,0,0,.9) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px)" }} />
        ) : null}
        <LabelBand o={bandO} y={0.63 * H} />
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={id} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={seed} result="n" />
            <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  8 0 0 0 ${bias.toFixed(3)}`} result="m" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={disp.toFixed(2)} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feComposite in="d" in2="m" operator="in" />
          </filter>
        </svg>
        {o > 0 ? (
          <div style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 0 ${(10 + 34 * bloom).toFixed(1)}px rgba(235,20,24,${(0.25 + 0.45 * bloom).toFixed(2)}))` }}>
            <div style={{ position: "absolute", inset: 0, filter: rev < 1 ? `url(#${id})` : undefined }}>
              <CaseGlyph text={number} glyph={glyph} x={W / 2} y={numY} opacity={o} glow={0.6} gloss={0.35} />
            </div>
          </div>
        ) : null}
        <RiseRow words={dateWords} cap={cap} y={0.63 * H} exitAt={dOut} />
        {placeWords?.length ? <RiseRow words={placeWords} cap={cap} y={0.63 * H + cap * 1.35} exitAt={placeOut} /> : null}
      </FootPlate>
      {white > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: white }} /> : null}
    </Fill>
  );
};
