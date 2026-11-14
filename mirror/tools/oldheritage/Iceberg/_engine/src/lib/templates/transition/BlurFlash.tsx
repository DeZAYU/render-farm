// transition / BlurFlash: Dashcam Vol.1 BF blur-flash case transition (9 case entries; study/dashcam_v1 STUDY §F "Blur-flash" + recipe I2), 18 f,
// cut on f4: the outgoing shot defocuses in 4 f (sigma 0 -> 25) while it brightens (+0 -> +0.27); the incoming shot starts +0.47 brighter, decays
// x0.7 per frame (half-life ~2 f) and stays defocused 6 f, then snaps sharp in 2 f. The DD case-entry transition (pairs with caseopener).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp01 } from "../../core";
import { Cut, type TransitionProps } from "./shared";

export type BlurFlashProps = TransitionProps & { sigma?: number };
export const BlurFlash: React.FC<BlurFlashProps> = (p) => {
  const f = useCurrentFrame();
  const sig = p.sigma ?? 25;
  const k = f - p.cut;
  let blur = 0, bright = 0;
  if (k < 0 && k >= -4) { const u = clamp01((k + 4) / 4); blur = sig * u * 0.7; bright = 0.27 * u; } // css blur px ~ 0.7 sigma for the same look at 1080p
  else if (k >= 0) { blur = (k < 6 ? sig : k < 8 ? (sig * (8 - k)) / 2 : 0) * 0.7; bright = 0.47 * Math.pow(0.7, k); }
  const filter = blur > 0.05 || bright > 0.01 ? `blur(${blur.toFixed(2)}px) brightness(${(1 + bright * 1.6).toFixed(3)})` : undefined;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter, transform: blur > 1 ? "scale(1.04)" : undefined }}>
        <Cut {...p} />
      </AbsoluteFill>
      {bright > 0.01 ? <AbsoluteFill style={{ background: "#fff", opacity: Math.min(0.5, bright * 0.6), mixBlendMode: "screen" }} /> : null}
    </AbsoluteFill>
  );
};
