// footage / PipCam: second camera picture-in-picture. REF Dashcam Vol.3 E9 / I12 (case 3 @2:37-2:43.4, case 6 @4:20-5:12: top-right PiP at
// x 990-1871, y 20-523 (0.459 W), SOLID RED BORDER ~9-10 px #CA000C + a soft dark shadow; static; enters with the scene, leaves on a flash) +
// Dashcam Vol.2 E6 PiP grow / shrink @7:26.87-7:36.27 (rest 0.52 W anchored top-right; GROW x1.48 in 2.57 s bezier(0.40,0.22,0.00,0.92) on the
// word that shifts focus to it; SHRINK in 3.63 s bezier(0.47,0.12,0.01,0.85)). Both clips play on their own clocks with the linear push.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { FLASH4, Media, Vignette, W, clamp01, envAt, lerp, linPush } from "../../core";

const GROW = Easing.bezier(0.4, 0.22, 0, 0.92), SHRINK = Easing.bezier(0.47, 0.12, 0.01, 0.85);
export type PipCamProps = { media: string; mediaStart?: number; pip: string; pipStart?: number; push?: number; rest?: number; big?: number; growAt?: number; growDur?: number; shrinkAt?: number; shrinkDur?: number; outAt?: number; side?: "right" | "left" };
export const PipCam: React.FC<PipCamProps> = ({ media, mediaStart = 0, pip, pipStart = 0, push = 0.045, rest = 0.459, big = 0.68, growAt, growDur = 77, shrinkAt, shrinkDur = 109, outAt, side = "right" }) => {
  const f = useCurrentFrame();
  let w = rest;
  if (growAt !== undefined && f >= growAt) w = lerp(rest, big, GROW(clamp01((f - growAt) / growDur)));
  if (shrinkAt !== undefined && f >= shrinkAt) w = lerp(big, rest, SHRINK(clamp01((f - shrinkAt) / shrinkDur)));
  const pw = w * W, ph = (pw * 9) / 16;
  const margin = 49, top = 20;
  const gone = outAt !== undefined && f >= outAt;
  const fl = outAt === undefined ? 0 : envAt(FLASH4, f - outAt);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${linPush(f, push).toFixed(5)})` }}><Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence></AbsoluteFill>
      <Vignette />
      {!gone ? (
        <div style={{ position: "absolute", top, ...(side === "right" ? { right: margin } : { left: margin }), width: pw, height: ph, border: "10px solid #CA000C", boxSizing: "content-box",
          boxShadow: "0 0 12px rgba(0,0,0,.75), 0 10px 26px rgba(0,0,0,.5)", overflow: "hidden", background: "#000" }}>
          <div style={{ width: "100%", height: "100%", transform: `scale(${linPush(f, 0.02).toFixed(5)})` }}><Media src={pip} startFrom={pipStart} /></div>
        </div>
      ) : null}
      {fl > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: fl }} /> : null}
    </AbsoluteFill>
  );
};
