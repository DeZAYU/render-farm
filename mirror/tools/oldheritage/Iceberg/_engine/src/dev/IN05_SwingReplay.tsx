// IN05 SwingReplay: the step-off replayed at half speed from the specialist's helmet camera; the virtual camera hangs from the top of
// the frame (the hook) and rocks with the swing in a damped pendulum (a few degrees, easing out), pushing slowly in, edges darkened.
// Camera only: no lines, no text.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./DC01_kit";

export const SwingReplay: React.FC<{ src: string; from: number; rate?: number; amp?: number; period?: number; s0?: number; s1?: number; fy?: number }> = ({ src, from, rate = 0.5, amp = 3.2, period = 52, s0 = 1.14, s1 = 1.3, fy = 0.45 }) => {
  const f = useCurrentFrame();
  const n = 120;
  const damp = Math.exp(-f / 90);
  const ang = amp * damp * Math.sin((2 * Math.PI * f) / period) * io(interpolate(f, [0, 8], [0, 1], cl));
  const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "50% -40%", transform: `rotate(${ang}deg) scale(${s})` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${fy * 100}%` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
