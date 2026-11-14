// AM09 StopDead: "…in the middle of a ride and without slowing down at all, it stops dead." The filmer's night clip of the Top Spin
// running (the gondola swinging and flipping past the neon sign) plays whole over its bright blurred copy; on the word "stops" the
// picture halts on that exact frame with no ease at all (the way the ride did), the handheld drift dies with it, and over the next
// second the frame cools and loses a little colour while the grain keeps moving, so the stillness reads as wrong. No text, no zoom.
// The next shot (after a blur-dip) is the real footage of the gondola standing still.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

export const StopDead: React.FC<{ src: string; from: number; stopAt: number; iw: number; ih: number; s0?: number; s1?: number }> = ({ src, from, stopAt, iw, ih, s0 = 1.0, s1 = 1.05 }) => {
  const f = useCurrentFrame();
  const k = Math.min(1920 / iw, 1080 / ih), w = iw * k, h = ih * k, ox = (1920 - w) / 2, oy = (1080 - h) / 2;
  const live = f < stopAt;
  // the slow push runs only while the ride runs, then stops dead with it
  const s = s0 + (s1 - s0) * Math.min(1, f / Math.max(1, stopAt));
  const cool = io(interpolate(f, [stopAt + 2, stopAt + 30], [0, 1], cl));
  const v = (st: React.CSSProperties) => {
    const el = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} />;
    return live ? el : <Freeze frame={stopAt}>{el}</Freeze>;
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(30px) brightness(${0.86 - 0.2 * cool}) saturate(0.92)`, transform: "scale(1.25)" }}>{v({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      <div style={{ position: "absolute", left: ox, top: oy, width: w, height: h, transform: `scale(${s.toFixed(5)})`, filter: `drop-shadow(0 0 36px rgba(0,0,0,.55)) saturate(${1 - 0.45 * cool}) brightness(${1 - 0.12 * cool}) hue-rotate(${-8 * cool}deg)` }}>
        {v({ width: "100%", height: "100%" })}
      </div>
    </AbsoluteFill>
  );
};
