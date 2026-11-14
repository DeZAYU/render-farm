// AM13 CrestFreeze: a front-seat ride video of the same coaster carries on from the cut before at 0.4x (motion-interpolated) over the top of
// the hill and stops on the crest: the frame holds, a very slow push continues, the colour drains out and the light falls away to near
// black on the VO's last words (the death is said once and never shown). No text.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

/** src = slow file; from = file s to start; hold = frame (of this device) at which the picture stops; drain = [a,b] frames colour -> grey;
 *  fall = [a,b] frames light -> dark; s0/s1 push; fx/fy focus */
export const CrestFreeze: React.FC<{ src: string; from: number; hold: number; drain: [number, number]; fall: [number, number]; s0?: number; s1?: number; fx?: number; fy?: number }> = ({ src, from, hold, drain, fall, s0 = 1.02, s1 = 1.16, fx = 0.5, fy = 0.45 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const s = s0 + (s1 - s0) * io(f / dur);
  const sat = interpolate(f, drain, [1, 0.12], { ...cl, easing: io });
  const lum = interpolate(f, fall, [1, 0.16], { ...cl, easing: io });
  const v = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%`, filter: `saturate(${sat}) brightness(${lum}) contrast(${1 + 0.12 * (1 - lum)})` }}>
        {f < hold ? v : <Freeze frame={hold}>{v}</Freeze>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
