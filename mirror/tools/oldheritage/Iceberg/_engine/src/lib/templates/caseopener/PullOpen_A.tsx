// caseopener / PullOpen_A (EDITOR A sibling of CentreSettle / DriftOpen_A; Amusement Park 2026-10-19).
// Same identity: Nunito 900 red-gradient case number in the D3 corner, Varela-Round date / place rows with the red key word, case_number_hit on
// the first number frame. Editor A motion (VV §11 world camera "quick start / long settle"): the shot opens CLOSE (x1.32 on `focus`) and PULLS
// BACK to x1.04 over 40 f on EZ.quick, then carries on with the linear push; the number lands in the corner from x1.45 with a 1 f white edge
// flash and 8 px defocus clearing over 12 f; the date / place rows rise centred, one at a time (DD sequence).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Img, useCurrentFrame } from "remotion";
import { EZ, H, Vignette, W, asset, clamp01, lerp } from "../../core";
import { CORNER, CaseGlyph, RiseRow } from "../labels/kit";
import { type CaseOpenerProps, LabelBand, presence } from "./shared";

export type PullOpenAProps = CaseOpenerProps & { cap?: number; band?: number; focus?: { x: number; y: number }; pull?: number; labelY?: number; plateFilter?: string };
export const PullOpen_A: React.FC<PullOpenAProps> = ({
  number, dateWords, placeWords, media, mediaStart = 0, push = 0.035, numberAt = 0, numberOut = 64, dateOut, placeOut, cap = 80, band = 0.42,
  focus = { x: W / 2, y: H / 2 }, pull = 40, labelY = 600, plateFilter = "brightness(.64) saturate(.88)",
}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const p = EZ.quick(clamp01(f / pull));
  const isStill = /\.(jpe?g|png|webp)$/i.test(media);
  const plate = isStill ? <Img src={asset(media)} style={{ width: W, height: H, objectFit: "cover" }} />
    : <OffthreadVideo muted src={asset(media)} startFrom={mediaStart} style={{ width: W, height: H, objectFit: "cover" }} />;
  const sc = lerp(1.32, 1.04, p) * (1 + push * Math.max(0, t - pull / 60));
  const k = f - numberAt;
  const u = EZ.quick(clamp01(k / 12));
  const ex = clamp01((f - numberOut) / 26);
  const no = k < 0 ? 0 : clamp01(k / 3) * (1 - ex * ex);
  const flash = k >= 0 && k < 2 ? 1 - k / 2 : 0;
  const dOut = dateOut ?? (placeWords?.length ? placeWords[0].at - 22 : undefined);
  const bandO = band * Math.max(presence(f, dateWords, dOut), presence(f, placeWords, placeOut));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${sc.toFixed(5)})`, transformOrigin: `${focus.x}px ${focus.y}px`, filter: plateFilter }}>{plate}</AbsoluteFill>
      <Vignette />
      <LabelBand o={bandO} y={labelY} />
      <RiseRow words={dateWords} cap={cap} y={labelY} exitAt={dOut} />
      {placeWords?.length ? <RiseRow words={placeWords} cap={cap} y={labelY} exitAt={placeOut} /> : null}
      {no > 0 ? (
        <AbsoluteFill style={{ transform: `scale(${lerp(1.45, 1, u).toFixed(4)})`, transformOrigin: `${CORNER.x}px ${CORNER.y}px` }}>
          <CaseGlyph text={number} glyph={CORNER.glyph} x={CORNER.x} y={CORNER.y} opacity={no} blur={8 * (1 - u)} />
        </AbsoluteFill>
      ) : null}
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: 0.16 * flash }} /> : null}
    </AbsoluteFill>
  );
};
