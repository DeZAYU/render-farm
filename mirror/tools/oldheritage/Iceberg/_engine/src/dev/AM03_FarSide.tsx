// AM03 FarSide: "Keep your eye on the far side of the loop." The filmer's night clip holds on the frame the raw will start from: the near
// side of the ride (railing, platform, canopy lights) sinks into shadow and a soft band across the far side of the oval stays lit, while the
// frame eases in toward it; on the last beat the shadow lifts and the picture is released into the raw at the same source moment (the raw
// that follows starts on exactly this frame, so the hand-off is seamless). Footage only, no text.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

/** band: [y0, y1] of the far side (0..1 of the screen), cx: horizontal centre of the light; zoom: push target; release: frames before the end the shadow lifts */
export const FarSide: React.FC<{ src: string; at: number; band: [number, number]; cx: number; zoom: number; release: number }> = ({ src, at, band, cx, zoom, release }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const sh = io(interpolate(f, [4, 22], [0, 1], cl)) * (1 - io(interpolate(f, [dur - release, dur - 2], [0, 1], cl)));
  const z = 1 + (zoom - 1) * io(interpolate(f, [0, dur - release], [0, 1], cl)) * (1 - io(interpolate(f, [dur - release, dur], [0, 1], cl)));
  const y0 = band[0] * 100, y1 = band[1] * 100, m = (y0 + y1) / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${cx * 100}% ${m}%` }}>
        <Freeze frame={Math.round(at * 30)}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sh, background: `linear-gradient(180deg, rgba(0,3,10,.78) 0%, rgba(0,3,10,.78) ${y0 - 9}%, rgba(0,3,10,0) ${y0}%, rgba(0,3,10,0) ${y1}%, rgba(0,3,10,.8) ${y1 + 10}%, rgba(0,3,10,.8) 100%)` }} />
      <AbsoluteFill style={{ opacity: sh * 0.8, background: `radial-gradient(ellipse 60% 40% at ${cx * 100}% ${m}%, rgba(0,0,0,0) 45%, rgba(0,3,10,.55) 100%)` }} />
    </AbsoluteFill>
  );
};
