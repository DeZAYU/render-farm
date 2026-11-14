// DC10 FocusPull: the trucker's dashcam held on its first frame (the seconds before the blast). The camera eases in toward the load
// of logs while the VO sets the scene; on "look just to the left of those logs, over the trees" the focus racks: the whole frame
// goes soft and darker except a pool to the left of the load where the mill's stacks stand, which stays sharp, and the camera drifts
// toward it. The main raw then starts from this exact frame. No marks, no text.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CK, CamA, camAt, cl, io, placeAr } from "./DC08_kit";

export const FocusPull: React.FC<{ src: string; t: number; keys: CK[]; pullAt: number; spot: [number, number, number]; releaseAt: number }> = ({ src, t, keys, pullAt, spot, releaseAt }) => {
  const f = useCurrentFrame();
  const k = io(interpolate(f, [pullAt, pullAt + 26], [0, 1], cl)) * (1 - io(interpolate(f, [releaseAt, releaseAt + 14], [0, 1], cl)));
  const p = placeAr(camAt(f, keys), 16 / 9);
  const cx = p.left + spot[0] * p.w, cy = p.top + spot[1] * p.h, r = spot[2] * p.w;
  const mask = `radial-gradient(ellipse ${r * 1.5}px ${r}px at ${cx}px ${cy}px, #000 40%, transparent 100%)`;
  return (
    <AbsoluteFill>
      <CamA src={src} t={t} keys={keys} filter={`blur(${7 * k}px) brightness(${1 - 0.4 * k}) saturate(${1 - 0.3 * k})`} />
      <AbsoluteFill style={{ opacity: k, WebkitMaskImage: mask, maskImage: mask }}>
        <CamA src={src} t={t} keys={keys} filter="contrast(1.06)" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
