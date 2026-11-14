// transition / SineDip: Dashcam Vol.3 F3 dip to black (52 uses, 10 of 19 case changes; study/dashcam_v3 STUDY §F3 + recipe I6):
// outgoing opacity cos(pi u / 2) over ~30 f (ease-in), 2 f pure black, incoming sin(pi u / 2) over ~30 f (ease-out). No blur: the picture keeps its
// push through the fade. The next VO line starts IN the black (+-0.1 s); SFX hit on the first black frame +0.2 s. `cut` = first incoming frame.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp01 } from "../../core";
import { SideA, SideB, type TransitionProps } from "./shared";

export type SineDipProps = TransitionProps & { outF?: number; blackF?: number; inF?: number };
export const SineDip: React.FC<SineDipProps> = (p) => {
  const f = useCurrentFrame();
  const o = p.outF ?? 30, b = p.blackF ?? 2, i = p.inF ?? 30;
  const outStart = p.cut - b - o;
  let el: React.ReactNode = null;
  if (f < p.cut - b) {
    const u = clamp01((f - outStart) / o);
    el = <SideA {...p} style={{ opacity: Math.cos((Math.PI * u) / 2) }} />;
  } else if (f >= p.cut) {
    const u = clamp01((f - p.cut + 1) / i);
    el = <SideB {...p} style={{ opacity: Math.sin((Math.PI * u) / 2) }} />;
  }
  return <AbsoluteFill style={{ background: "#000" }}>{el}</AbsoluteFill>;
};
