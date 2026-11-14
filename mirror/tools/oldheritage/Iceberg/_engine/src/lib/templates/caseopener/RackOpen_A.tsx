// caseopener / RackOpen_A (EDITOR A sibling of CornerFade / DriftOpen_A; Amusement Park 2026-10-19).
// Same identity: Nunito 900 red-gradient case number in the D3 corner (0.869 W, 0.19 H), Varela-Round date / place rows with the red key word,
// case_number_hit on the first number frame. Editor A motion (VV "rack open"): the shot opens OUT OF FOCUS and racks in (14 px -> 0 over 26 f,
// EZ.quick) while the camera TILTS down (constant +22 px/s, rides inside the linear push); the number rises 60 px into the corner with a 6 px
// defocus clearing in step with the rack; the label rows sit LEFT in the lower third (0.1 W, 0.74 H) and rise word by word (DD wordRise).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Img, useCurrentFrame } from "remotion";
import { EZ, H, Vignette, W, asset, clamp01, lerp } from "../../core";
import { CORNER, CaseGlyph, RiseRow } from "../labels/kit";
import { type CaseOpenerProps, LabelBand, presence } from "./shared";

export type RackOpenAProps = CaseOpenerProps & { cap?: number; band?: number; tilt?: number; rack?: number; plateFilter?: string };
export const RackOpen_A: React.FC<RackOpenAProps> = ({
  number, dateWords, placeWords, media, mediaStart = 0, push = 0.04, numberAt = 0, numberOut = 64, dateOut, placeOut, cap = 76, band = 0.45, tilt = 22, rack = 26, plateFilter = "brightness(.66) saturate(.9)",
}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const r = EZ.quick(clamp01(f / rack));
  const isStill = /\.(jpe?g|png|webp)$/i.test(media);
  const plate = isStill ? <Img src={asset(media)} style={{ width: W, height: H, objectFit: "cover" }} />
    : <OffthreadVideo muted src={asset(media)} startFrom={mediaStart} style={{ width: W, height: H, objectFit: "cover" }} />;
  const sc = (1 + push * t) * 1.06; // headroom for the tilt
  const ty = -40 + tilt * t; // starts above, tilts down
  const k = f - numberAt;
  const u = EZ.quick(clamp01(k / 18));
  const ex = clamp01((f - numberOut) / 26);
  const no = k < 0 ? 0 : clamp01(k / 5) * (1 - ex * ex);
  const dOut = dateOut ?? (placeWords?.length ? placeWords[0].at - 22 : undefined);
  const bandO = band * Math.max(presence(f, dateWords, dOut), presence(f, placeWords, placeOut));
  const LY = 0.74 * H;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateY(${ty.toFixed(2)}px) scale(${sc.toFixed(5)})`, transformOrigin: "50% 50%", filter: `${plateFilter} blur(${(14 * (1 - r)).toFixed(2)}px)` }}>{plate}</AbsoluteFill>
      <Vignette />
      <div style={{ position: "absolute", left: 0, top: LY - 170, width: W, height: 340, opacity: bandO, background: "radial-gradient(ellipse 46% 50% at 22% 50%, rgba(0,0,0,.85), rgba(0,0,0,0) 100%)" }} />
      <RiseRow words={dateWords} cap={cap} y={LY} x={0.1 * W} align="left" exitAt={dOut} />
      {placeWords?.length ? <RiseRow words={placeWords} cap={cap} y={LY} x={0.1 * W} align="left" exitAt={placeOut} /> : null}
      {no > 0 ? <CaseGlyph text={number} glyph={CORNER.glyph} x={CORNER.x} y={lerp(CORNER.y + 60, CORNER.y, u)} opacity={no} blur={6 * (1 - u)} /> : null}
    </AbsoluteFill>
  );
};
// LabelBand is kept importable for callers that want the centred DD band instead of the lower-third one.
export { LabelBand };
