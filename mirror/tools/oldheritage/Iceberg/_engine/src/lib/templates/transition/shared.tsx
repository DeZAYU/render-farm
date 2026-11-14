// Shared plumbing for transitions: the outgoing (A) and incoming (B) layers. Either pass media paths (a / b) or your own scenes (A / B nodes).
// All frames LOCAL: `cut` = first frame of the incoming shot.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Media, Vignette, linPush } from "../../core";

export type TransitionProps = {
  a?: string; // outgoing media (still or clip), public-relative
  b?: string; // incoming media
  A?: React.ReactNode; // or: your outgoing scene (overrides a)
  B?: React.ReactNode; // or: your incoming scene (overrides b)
  cut: number; // local frame of the first incoming frame
  push?: number; // linear footage push per second on the demo media (Dashcam +4.5 %/s)
};
/** a footage layer with the Dashcam linear push, its clock starting at `from` */
export const Plate: React.FC<{ src: string; from: number; push?: number; style?: React.CSSProperties }> = ({ src, from, push = 0.045, style }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill style={{ transform: `scale(${linPush(f - from, push).toFixed(5)})` }}>
        <Sequence from={from} layout="none"><Media src={src} /></Sequence>
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};
export const SideA: React.FC<TransitionProps & { style?: React.CSSProperties }> = ({ a, A, push, style }) =>
  A ? <AbsoluteFill style={style}>{A}</AbsoluteFill> : a ? <Plate src={a} from={0} push={push} style={style} /> : null;
export const SideB: React.FC<TransitionProps & { style?: React.CSSProperties }> = ({ b, B, cut, push, style }) =>
  B ? <AbsoluteFill style={style}>{B}</AbsoluteFill> : b ? <Plate src={b} from={cut} push={push} style={style} /> : null;
/** renders A before the cut, B from the cut on */
export const Cut: React.FC<TransitionProps & { styleA?: React.CSSProperties; styleB?: React.CSSProperties }> = (p) => {
  const f = useCurrentFrame();
  return f < p.cut ? <SideA {...p} style={p.styleA} /> : <SideB {...p} style={p.styleB} />;
};
