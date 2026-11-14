// caseopener / CornerFade: the approved Dashcam Vol.3 opener (wp3 sec_A CaseNumber + DateLabel, abs 708). REF Dashcam Vol.3 E1 @0:48.0 (case "2":
// number top-right at (0.869 W, 0.190 H), glyph 168 px, NO motion, alpha 0.25 -> 1 ease-out 1-(1-u)^2 over 0.8-1.4 s, hold, ease-in fade 19-40 f)
// + E2 @0:48.6 "July 26th, 2024" (centred word-rise: white rises 19 px / 0.9 alpha in 16 f; red key word defocused -> sharp, rises 22 px).
// The place label follows the date in the same centred slot (sequential, one label at a time, as DD). Footage: linear push.
import React from "react";
import { clamp01 } from "../../core";
import { CORNER, CaseGlyph, FootPlate, RiseRow } from "../labels/kit";
import { type CaseOpenerProps, Fill, LabelBand, presence, useF } from "./shared";

export type CornerFadeProps = CaseOpenerProps & { cap?: number; band?: number };
export const CornerFade: React.FC<CornerFadeProps> = ({ number, dateWords, placeWords, media, mediaStart = 0, push = 0.045, numberAt = 0, numberOut = 60, dateOut, placeOut, cap = 86, band = 0.36 }) => {
  const f = useF();
  const k = f - numberAt;
  const ex = clamp01((f - numberOut) / 30);
  const o = k < 0 ? 0 : (0.25 + 0.75 * (1 - (1 - clamp01(k / 36)) ** 2)) * (1 - ex * ex);
  const dOut = dateOut ?? (placeWords?.length ? placeWords[0].at - 22 : undefined);
  const bandO = band * Math.max(presence(f, dateWords, dOut), presence(f, placeWords, placeOut));
  return (
    <Fill>
      <FootPlate src={media} startFrom={mediaStart} push={push}>
        <LabelBand o={bandO} />
        <RiseRow words={dateWords} cap={cap} y={540} exitAt={dOut} />
        {placeWords?.length ? <RiseRow words={placeWords} cap={cap} y={540} exitAt={placeOut} /> : null}
        {o > 0 ? <CaseGlyph text={number} glyph={CORNER.glyph} x={CORNER.x} y={CORNER.y} opacity={o} /> : null}
      </FootPlate>
    </Fill>
  );
};
