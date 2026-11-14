// AM05 DeerStill: "There's a young deer standing on the track. The train hit it, and the deer was killed instantly."
// A real roe deer filmed in English woodland (Wikimedia Commons, CC) plays at 0.6x, eased push toward it; as the line ends it holds
// still (the animal frozen mid-look, the push carries on very slowly, the woods around it sink a little darker). On "hit" the picture
// is gone: a hard cut to black (no flash, no shake, no blood) that holds through "killed instantly" with only a faint grain, so the
// moment is told by the absence of the picture. The case's own SFX put one dull impact on the cut.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

export const DeerStill: React.FC<{ src: string; from: number; rate?: number; freeze: number; cut: number; focus: [number, number]; s0?: number; s1?: number }> = ({ src, from, rate = 0.6, freeze, cut, focus, s0 = 1.04, s1 = 1.22 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  if (f >= cut) {
    return (
      <AbsoluteFill style={{ background: "#020203" }}>
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.05 }}>
          <svg width={1920} height={1080}><filter id={`ads${f % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 6} /><feColorMatrix type="saturate" values="0" /></filter><rect width={1920} height={1080} filter={`url(#ads${f % 6})`} /></svg>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  const s = s0 + (s1 - s0) * io(Math.min(1, f / Math.max(1, cut)));
  const sink = io(interpolate(f, [freeze, freeze + 20], [0, 1], cl));
  const vid = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`, willChange: "transform" }}>
        {f >= freeze ? <Freeze frame={freeze}>{vid}</Freeze> : vid}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.55 * sink, background: `radial-gradient(ellipse 34% 40% at ${focus[0] * 100}% ${focus[1] * 100}%, rgba(0,0,0,0) 30%, rgba(0,0,0,.85) 100%)` }} />
    </AbsoluteFill>
  );
};
