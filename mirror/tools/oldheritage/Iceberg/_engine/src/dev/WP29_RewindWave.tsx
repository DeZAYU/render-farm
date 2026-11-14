// WP29 device: RewindWave — the Tianjin dashcam (silent) plays the second explosion arriving down the street live; the picture then
// scrubs back fast (a short rewind with a soft horizontal smear) to just before the flash and replays it at half speed while the
// frame pushes in toward the end of the road where the debris comes through. No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./WP01_kit";

export const RewindWave: React.FC<{
  src: string; from: number; n: number;
  live: number;          // frames of live play
  rew: number;           // frames of rewind
  back: number;          // source second the rewind lands on
  slow?: number;         // replay speed
  fx?: number; fy?: number;
}> = ({ src, from, n, live, rew, back, slow = 0.5, fx = 0.55, fy = 0.45 }) => {
  const f = useCurrentFrame();
  const endLive = from + live / 30;
  let t: number;
  if (f < live) t = from + f / 30;
  else if (f < live + rew) t = endLive + (back - endLive) * io((f - live) / rew);
  else t = back + ((f - live - rew) / 30) * slow;
  const rw = f >= live && f < live + rew ? Math.sin(Math.PI * (f - live) / rew) : 0;
  const p = io(interpolate(f, [live + rew, n], [0, 1], cl));
  const s = 1.02 + 0.03 * io(Math.min(1, f / live)) + 0.22 * p;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform",
        filter: rw > 0 ? `blur(${2.5 * rw}px) brightness(${1 + 0.12 * rw})` : undefined }}>
        <Freeze frame={Math.round(t * 30)}>
          <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Freeze>
      </AbsoluteFill>
      {rw > 0 && <AbsoluteFill style={{ background: `repeating-linear-gradient(0deg, rgba(255,255,255,${0.05 * rw}) 0 2px, transparent 2px 7px)` }} />}
    </AbsoluteFill>
  );
};
