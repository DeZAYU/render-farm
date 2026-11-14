// TOR16 TapeInsert: "Andover had already been hit by an F5 in April 1991": the Andover Police Department's own 1991 tape (public domain,
// Wikimedia Commons), with its burned-in VCR clock, plays as a 4:3 picture in a white frame that settles in 3-D over the 2022 City Hall
// camera (dimmed, blurred lightly) — the same town, 31 years apart, in one frame. Red date label under the tape.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);

export const TapeInsert: React.FC<{ tape: string; tapeFrom: number; bg: string; bgFrom: number; label: string; labelAt: number }> = ({ tape, tapeFrom, bg, bgFrom, label, labelAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 22], [0, 1], cl)), d = io(f / durationInFrames);
  const H = height * 0.66, W = H * 4 / 3;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", perspective: 1800 }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -30, width: width + 60, height: height + 60, objectFit: "cover",
        filter: "blur(5px) brightness(.42) saturate(.7)", transform: `scale(${1.04 + 0.03 * d})` }} />
      <div style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2 - 40, width: W, height: H, border: "6px solid #fff", boxSizing: "border-box", overflow: "hidden",
        boxShadow: "0 30px 70px rgba(0,0,0,.75)", opacity: k,
        transform: `translateZ(${(1 - k) * -260}px) rotateY(${(1 - k) * 14 + 3 * (1 - d)}deg) rotateX(${(1 - k) * 4}deg) scale(${1 + 0.035 * d})` }}>
        <OffthreadVideo src={staticFile(tape)} startFrom={Math.round(tapeFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <RedLabel text={label} at={labelAt} x={0.5} y={(height / 2 + H / 2 - 40 + 40) / height} />
    </AbsoluteFill>
  );
};
