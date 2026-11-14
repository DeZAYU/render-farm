// caseopener / SlideOpen_A, TiltOpen_A, IrisOpen_A (EDITOR A siblings of CornerFade / DriftOpen_A; Amusement Park 2026-10-19).
// One identity, three camera entrances, so consecutive cases never open the same way:
//   SlideOpen_A: the shot SLIDES in from the right (a 420 px lateral whip on EZ.quick, 14 px motion blur clearing) and keeps trucking left
//                (-20 px/s); the number slides in from the left edge into the D3 corner.
//   TiltOpen_A:  the camera TILTS UP onto the scene (the plate travels 260 px upward on EZ.quick over 34 f, then drifts -8 px/s); the number
//                drops 70 px into the corner as the tilt lands.
//   IrisOpen_A:  the frame opens through a soft IRIS (a radial mask grows from 0 to full over 30 f, centred on `focus`), linear push inside;
//                the number fades up in the corner as the iris passes it.
// Shared: Nunito 900 red-gradient case number (CaseGlyph, D3 corner 0.869 W / 0.19 H), Varela-Round date and place rows (RiseRow, red key word),
// centred DD dark band behind the rows, plate dimmed .64. case_number_hit belongs on the first number frame (the caller's cue).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { EZ, H, Vignette, W, asset, clamp01, lerp } from "../../core";
import { CORNER, CaseGlyph, RiseRow } from "../labels/kit";
import { type CaseOpenerProps, LabelBand, presence } from "./shared";

export type MoveOpenProps = CaseOpenerProps & { cap?: number; band?: number; labelY?: number; focus?: { x: number; y: number }; plateFilter?: string };
type Mode = "slide" | "tilt" | "iris";
const Base: React.FC<MoveOpenProps & { mode: Mode }> = ({
  mode, number, dateWords, placeWords, media, mediaStart = 0, push = 0.035, numberAt = 0, numberOut = 64, dateOut, placeOut, cap = 80, band = 0.42, labelY = 600,
  focus = { x: W / 2, y: H / 2 }, plateFilter = "brightness(.64) saturate(.88)",
}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const isStill = /\.(jpe?g|png|webp)$/i.test(media);
  const plate = isStill ? <Img src={asset(media)} style={{ width: W, height: H, objectFit: "cover" }} />
    : <OffthreadVideo muted src={asset(media)} startFrom={mediaStart} style={{ width: W, height: H, objectFit: "cover" }} />;
  const sc = (1 + push * t) * 1.08;
  let tx = 0, ty = 0, blur = 0, mask: string | undefined;
  if (mode === "slide") { const u = EZ.quick(clamp01(f / 20)); tx = 420 * (1 - u) - 20 * t; blur = 14 * (1 - u); }
  if (mode === "tilt") { const u = EZ.quick(clamp01(f / 34)); ty = 260 * (1 - u) - 8 * t; blur = 6 * (1 - u); }
  if (mode === "iris") { const r = EZ.out3(clamp01(f / 30)) * 1400; mask = `radial-gradient(circle ${r.toFixed(0)}px at ${focus.x}px ${focus.y}px, #000 78%, transparent 100%)`; }
  const k = f - numberAt;
  const u = EZ.quick(clamp01(k / 16));
  const ex = clamp01((f - numberOut) / 26);
  const no = k < 0 ? 0 : clamp01(k / 5) * (1 - ex * ex);
  const nx = mode === "slide" ? lerp(-220, CORNER.x, u) : CORNER.x;
  const ny = mode === "tilt" ? lerp(CORNER.y - 70, CORNER.y, u) : CORNER.y;
  const dOut = dateOut ?? (placeWords?.length ? placeWords[0].at - 22 : undefined);
  const bandO = band * Math.max(presence(f, dateWords, dOut), presence(f, placeWords, placeOut));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sc.toFixed(5)})`, transformOrigin: `${focus.x}px ${focus.y}px`, filter: `${plateFilter}${blur > 0.05 ? ` blur(${blur.toFixed(2)}px)` : ""}`, WebkitMaskImage: mask, maskImage: mask }}>{plate}</AbsoluteFill>
      <Vignette />
      <LabelBand o={bandO} y={labelY} />
      <RiseRow words={dateWords} cap={cap} y={labelY} exitAt={dOut} />
      {placeWords?.length ? <RiseRow words={placeWords} cap={cap} y={labelY} exitAt={placeOut} /> : null}
      {no > 0 ? <CaseGlyph text={number} glyph={CORNER.glyph} x={nx} y={ny} opacity={no} blur={mode === "iris" ? 8 * (1 - u) : 4 * (1 - u)} /> : null}
    </AbsoluteFill>
  );
};
export const SlideOpen_A: React.FC<MoveOpenProps> = (p) => <Base {...p} mode="slide" />;
export const TiltOpen_A: React.FC<MoveOpenProps> = (p) => <Base {...p} mode="tilt" />;
export const IrisOpen_A: React.FC<MoveOpenProps> = (p) => <Base {...p} mode="iris" />;
