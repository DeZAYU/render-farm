// footage / Replay: the DD replay hand-over. REF Dashcam Vol.1 E8 / I12 (11 replays: the picture HARD-CUTS +0.01..0.58 s (median +0.22) after the
// last narrated word BACK 3.5-29.4 s into the same clip; the event repeats at normal speed with full sound and NO overlays, NO label, NO slow-mo,
// NO rewind effect) + Dashcam Vol.2 E1 "replay pull-out" @0:16.85-0:19.88 (linear-in-scale 170 % -> 100 % in 3.03 s, HARD STOP) + D1 C14 replay
// after a short blur-dip. mode: "cut" (D1), "pullout" (D2), "dip" (D1 C14, short 5/1/6 blur-dip). Clip audio is the host's job (sfx hint).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Media, Vignette, clamp01, linPush } from "../../core";

export type ReplayProps = { media: string; mediaStart?: number; cutAt: number; back: number; mode?: "cut" | "pullout" | "dip"; push?: number; pullFrom?: number; pullDur?: number };
export const Replay: React.FC<ReplayProps> = ({ media, mediaStart = 0, cutAt, back, mode = "cut", push = 0.045, pullFrom = 1.7, pullDur = 91 }) => {
  const f = useCurrentFrame();
  const replay = f >= cutAt;
  const k = f - cutAt;
  const dipOut = mode === "dip" ? clamp01((f - (cutAt - 6)) / 5) : 0; // 5 f out + 1 black
  const dipIn = mode === "dip" && replay ? clamp01((k + 1) / 6) : 1;
  let sc: number;
  if (!replay) sc = linPush(f, push);
  else if (mode === "pullout") sc = k < pullDur ? pullFrom + (1 - pullFrom) * (k / pullDur) : 1; // linear in scale, hard stop
  else sc = linPush(k, push);
  const o = replay ? dipIn : 1 - dipOut;
  const b = replay ? 12 * (1 - dipIn) : 12 * dipOut;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: o, filter: b > 0.05 ? `blur(${b.toFixed(2)}px)` : undefined }}>
        <AbsoluteFill style={{ transform: `scale(${sc.toFixed(5)})` }}>
          {!replay ? <Media src={media} startFrom={mediaStart} /> : <Sequence from={cutAt} layout="none"><Media src={media} startFrom={mediaStart + cutAt - back} /></Sequence>}
        </AbsoluteFill>
        <Vignette />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
