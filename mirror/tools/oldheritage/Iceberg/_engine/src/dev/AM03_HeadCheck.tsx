// AM03 HeadCheck: "And the first thing he checks? The worm's head. One of the most-liked comments caught that before the passengers did."
// The station moment at half speed (motion-interpolated): the man in the striped sweater reaches over to the worm's head; on "the worm's
// head" the picture freezes on his outstretched arm, everything outside a soft oval round the man and the head drains to a cold grey (a
// desaturated copy under a feathered colour window), and the frame pushes slowly in on the two; on "The riders climb out" the colour floods
// back and the half-speed picture runs on toward the raw that follows. Footage only, no text.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

export const HeadCheck: React.FC<{ src: string; from: number; freeze: number; spot: [number, number]; rx: number; ry: number; zoom: number; releaseAt?: number }> = ({ src, from, freeze, spot, rx, ry, zoom, releaseAt = 1e9 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const dr = io(interpolate(f, [freeze, freeze + 22], [0, 1], cl)) * (1 - io(interpolate(f, [releaseAt, releaseAt + 16], [0, 1], cl)));
  const z = 1.05 + (zoom - 1.05) * io(interpolate(f, [0, dur], [0, 1], cl));
  const fr = Math.round(from * 30) + Math.min(f, freeze) + Math.max(0, f - releaseAt);
  const v = (st: React.CSSProperties) => <Freeze frame={fr}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...st }} /></Freeze>;
  const m = `radial-gradient(ellipse ${rx * 100}% ${ry * 100}% at ${spot[0] * 100}% ${spot[1] * 100}%, #000 55%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${spot[0] * 100}% ${spot[1] * 100}%` }}>
        {v({ filter: `saturate(${1 - 0.9 * dr}) brightness(${1 - 0.45 * dr})` })}
        {dr > 0 && <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m, opacity: dr }}>{v({})}</AbsoluteFill>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
