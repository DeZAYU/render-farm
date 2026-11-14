// transition / BlurDip: Dashcam Vol.1 BD blur-dip to black (24 uses; study/dashcam_v1 STUDY §F + recipe I3): the outgoing shot fades
// LINEARLY to black while it defocuses 0 -> 12 px (13 f), 1-2 black frames, then the incoming fades up linearly while it sharpens 12 -> 0 (14 f).
// Forms: short 5/1/6 (0.4 s), normal 13/1/14 (0.93 s), long 29/6/29 (2.1 s). Use for time skips, page <-> clip, clip -> replay.
// `cut` = first incoming frame (end of the black).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp01 } from "../../core";
import { SideA, SideB, type TransitionProps } from "./shared";

const FORMS = { short: [5, 1, 6], normal: [13, 1, 14], long: [29, 6, 29] } as const;
export type BlurDipProps = TransitionProps & { form?: keyof typeof FORMS; maxBlur?: number };
export const BlurDip: React.FC<BlurDipProps> = (p) => {
  const f = useCurrentFrame();
  const [o, b, i] = FORMS[p.form ?? "normal"];
  const mb = p.maxBlur ?? 12;
  const outStart = p.cut - b - o;
  if (f < p.cut - b) {
    const u = clamp01((f - outStart) / o);
    return <AbsoluteFill style={{ background: "#000" }}><SideA {...p} style={{ opacity: 1 - u, filter: u > 0 ? `blur(${(mb * u).toFixed(2)}px)` : undefined }} /></AbsoluteFill>;
  }
  if (f < p.cut) return <AbsoluteFill style={{ background: "#000" }} />;
  const u = clamp01((f - p.cut + 1) / i);
  return <AbsoluteFill style={{ background: "#000" }}><SideB {...p} style={{ opacity: u, filter: u < 1 ? `blur(${(mb * (1 - u)).toFixed(2)}px)` : undefined }} /></AbsoluteFill>;
};
