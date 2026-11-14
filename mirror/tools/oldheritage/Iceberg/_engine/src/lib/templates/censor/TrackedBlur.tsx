// censor / TrackedBlur: Dashcam Vol.1 censor blur (STUDY "Blur (censor)": feathered elliptical Gaussian, soft edge 40-60 px, following the subject;
// C19 burning rider @ 23:06 grey ellipse ~300x180; C12 impact @ 13:22 ORANGE-tinted blob 829.7-831.9) + wp3 EBlur regions (sec_B aftermath).
// Our version: the blurred copy is a real defocused copy of the footage (not backdrop-filter), so the blur is identical on every frame and render
// path; a faint luminance lift + optional tint keeps it from reading as a smudge; regions follow Catmull-Rom tracked keys; several regions allowed.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Footage, Graded, ellipseMask, trackAt, type TrackKey } from "./shared";

export type TrackedBlurProps = {
  media: string; startFrom?: number;
  regions: { keys: TrackKey[]; from?: number; to?: number }[]; // each region: keyframed ellipse, active from..to (local)
  blur?: number; // px (DD heavy: 28-40)
  tint?: string; // e.g. "rgba(255,120,30,.28)" = DD C12 orange blob; undefined = neutral grey
  feather?: number;
};
export const TrackedBlur: React.FC<TrackedBlurProps> = ({ media, startFrom = 0, regions, blur = 34, tint, feather = 0.42 }) => {
  const f = useCurrentFrame();
  const live = regions.filter((r) => f >= (r.from ?? -1e9) && f < (r.to ?? 1e9)).map((r) => trackAt(r.keys, f));
  return (
    <Graded>
      <Footage src={media} startFrom={startFrom} />
      {live.map((r, i) => {
        const m = ellipseMask(r, feather);
        return (
          <AbsoluteFill key={i} style={{ WebkitMaskImage: m, maskImage: m }}>
            <Footage src={media} startFrom={startFrom} style={{ filter: `blur(${blur}px) brightness(1.04) saturate(.75)`, transform: "scale(1.02)" }} />
            <AbsoluteFill style={{ background: tint ?? "rgba(120,120,120,.10)", mixBlendMode: tint ? "screen" : "normal" }} />
          </AbsoluteFill>
        );
      })}
    </Graded>
  );
};
