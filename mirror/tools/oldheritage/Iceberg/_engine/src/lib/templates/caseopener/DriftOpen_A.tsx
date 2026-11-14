// caseopener / DriftOpen_A (EDITOR A sibling of CornerFade / CentreSettle; Amusement Park 2026-10-19).
// Same identity: Nunito 900 red-gradient case number (D3 E1, footed "1", never "01") + Varela-Round date / place rows with the red key word,
// case_number_hit on the first visible number frame. Editor A motion (VV continuous camera): the footage TRUCKS sideways (constant -26 px/s inside
// the linear +4.5 %/s push), the number arrives from the right on a nearer parallax layer and DECELERATES into the D3 corner (0.869 W, 0.19 H)
// with an oversize 1.18 -> 1 settle (EZ.quick, 16 f) and a defocus 9 -> 0; the label rows ride a middle layer (0.6 x the truck) and rise word by
// word (DD wordRise). Optional D3 one-second freeze under the date (UPGRADES #21: exact frame, +0.74 %/s push on the hold, hard continue).
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, useCurrentFrame } from "remotion";
import { EZ, H, Vignette, W, asset, clamp01, lerp } from "../../core";
import { CORNER, CaseGlyph, RiseRow } from "../labels/kit";
import { type CaseOpenerProps, LabelBand, presence } from "./shared";

export type DriftOpenAProps = CaseOpenerProps & { cap?: number; band?: number; truck?: number; labelY?: number; freeze?: { at: number; hold: number }; plateFilter?: string };
export const DriftOpen_A: React.FC<DriftOpenAProps> = ({
  number, dateWords, placeWords, media, mediaStart = 0, push = 0.045, numberAt = 0, numberOut = 64, dateOut, placeOut, cap = 80, band = 0.4, truck = -26, labelY = 600, freeze, plateFilter = "brightness(.62) saturate(.85)",
}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  // footage: linear push + constant truck; optional exact-frame freeze (hold) with its own slow push, then a hard continue
  const fz = freeze && f >= freeze.at && f < freeze.at + freeze.hold;
  const after = freeze && f >= freeze.at + freeze.hold;
  const vid = <OffthreadVideo muted src={asset(media)} startFrom={mediaStart} style={{ width: W, height: H, objectFit: "cover" }} />;
  const plate = fz ? <Freeze frame={freeze!.at}>{vid}</Freeze>
    : after ? <Sequence from={freeze!.at + freeze!.hold} layout="none"><OffthreadVideo muted src={asset(media)} startFrom={mediaStart + freeze!.at + 1} style={{ width: W, height: H, objectFit: "cover" }} /></Sequence>
    : vid;
  const holdPush = fz ? 1 + 0.0074 * ((f - freeze!.at) / 30) : after ? 1 + 0.0074 * (freeze!.hold / 30) : 1;
  const sc = (1 + push * t) * holdPush * 1.03; // 1.03 base so the truck never shows an edge
  // number: decelerating arrival from the right (parallax 1.5x), oversize settle, defocus, then D3 ease-in fade
  const k = f - numberAt;
  const u = EZ.quick(clamp01(k / 16));
  const nx = lerp(W + 220, CORNER.x, u) + 1.5 * truck * t * 0.35;
  const ns = lerp(1.18, 1, u);
  const ex = clamp01((f - numberOut) / 26);
  const no = k < 0 ? 0 : clamp01(k / 5) * (1 - ex * ex);
  const dOut = dateOut ?? (placeWords?.length ? placeWords[0].at - 22 : undefined);
  const bandO = band * Math.max(presence(f, dateWords, dOut), presence(f, placeWords, placeOut));
  const lx = 0.6 * truck * t;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${(truck * t).toFixed(2)}px) scale(${sc.toFixed(5)})`, transformOrigin: "50% 50%", filter: plateFilter }}>{plate}</AbsoluteFill>
      <Vignette />
      <AbsoluteFill style={{ transform: `translateX(${lx.toFixed(2)}px)` }}>
        <LabelBand o={bandO} y={labelY} />
        <RiseRow words={dateWords} cap={cap} y={labelY} exitAt={dOut} />
        {placeWords?.length ? <RiseRow words={placeWords} cap={cap} y={labelY} exitAt={placeOut} /> : null}
      </AbsoluteFill>
      {no > 0 ? <CaseGlyph text={number} glyph={CORNER.glyph * ns} x={nx} y={CORNER.y} opacity={no} blur={9 * (1 - u)} /> : null}
    </AbsoluteFill>
  );
};
