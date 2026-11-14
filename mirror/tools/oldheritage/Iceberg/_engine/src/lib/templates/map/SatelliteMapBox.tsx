// map / SatelliteMapBox. REF D1 E10/E4 (Dashcam Vol.1 @ 0:04.8-0:07.1 "the Second Street Bridge": 3-D satellite still, slow linear orbit + zoom,
// red pin -> leader line -> red outlined box wiping L->R in 6 f, then the words); wp3 sec_A MapBox @ abs 922 (approved v2 build).
// Ours: the box words pop on their own spoken words, white sub-place words fade under the pin, the orbit pivots on the pin so the pin never
// drifts, and the D1 scan texture is laid over the still.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, Media, Vignette } from "../../core";
import { MapBoxCallout, ScanLines, type Word } from "./shared";

export type SatelliteMapBoxProps = {
  subCap?: number; // white sub-place words cap (M-024 >= 28, default 30)
  src: string; // graded satellite / aerial still (public-relative)
  pin: { x: number; y: number }; // pin tip as a fraction of the frame (0..1)
  pinAt?: number; // local frame the pin pops (leader +2 f, box +6 f)
  box: Word[]; // words inside the red box, each on its spoken word
  sub?: Word[]; // white words under the pin
  elbow?: { dx: number; dy: number }; // leader elbow offset from the pin in px (dx < 0 = box to the left)
  scale0?: number; // start scale of the still (cover margin for the orbit)
  zoomPerS?: number; // linear zoom per second (D1 +0.7 %/s; ours default +2.5 %/s)
  orbitDegPerS?: number; // linear rotation per second (D1 -4.8 deg/s on a 3-D map; on a flat still keep it small)
  cap?: number; // box text cap height
  scan?: number; // scan texture opacity
};

export const SatelliteMapBox: React.FC<SatelliteMapBoxProps> = ({ src, pin, pinAt = 2, box, sub, elbow, scale0 = 1.12, zoomPerS = 0.025, orbitDegPerS = -1.0, cap = 40, subCap = 30, scan = 0.07 }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const p = { x: pin.x * W, y: pin.y * H };
  const s = scale0 * (1 + zoomPerS * t), r = orbitDegPerS * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transformOrigin: `${p.x}px ${p.y}px`, transform: `rotate(${r.toFixed(4)}deg) scale(${s.toFixed(5)})` }}>
        <Media src={src} />
      </AbsoluteFill>
      <ScanLines o={scan} />
      <Vignette />
      <MapBoxCallout f={f} p={p} start={pinAt} words={box} sub={sub} elbow={elbow} cap={cap} subCap={subCap} />
    </AbsoluteFill>
  );
};
