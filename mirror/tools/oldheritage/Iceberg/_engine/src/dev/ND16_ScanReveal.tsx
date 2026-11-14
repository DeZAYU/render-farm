// ND16 device: the same ground on Big Pine Key before and three days after Irma. The USGS NAIP aerial (before) lies on a slightly tilted
// plane; a white scan line sweeps DOWN the frame and leaves NOAA's 13 Sep 2017 emergency-response imagery (after) behind it: browned,
// salt-burned scrub, mobile homes scattered. Both images are pixel-aligned (same bbox); the camera drifts toward the worst block.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const ScanReveal: React.FC<{ before: string; after: string; iw: number; ih: number; focus: [number, number]; at: number; len: number; z0?: number; z1?: number; placeLabel: string; dateLabel: string }> = ({ before, after, iw, ih, focus, at, len, z0 = 1.05, z1 = 1.25, placeLabel, dateLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: D } = useVideoConfig();
  const t = io(f / D), z = z0 + (z1 - z0) * t;
  const base = Math.max(width / iw, height / ih) * z;
  const fx = iw / 2 + (focus[0] - iw / 2) * t, fy = ih / 2 + (focus[1] - ih / 2) * t;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base));
  const oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const s = io(interpolate(f, [at, at + len], [0, 1], cl));
  const yLine = -40 + (height + 80) * s;
  const tilt = interpolate(f, [0, D], [9, 4], cl);
  const st: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", perspective: 2000 }}>
      <AbsoluteFill style={{ transform: `rotateX(${tilt}deg) scale(1.12)`, transformOrigin: "50% 60%" }}>
        <Img src={staticFile(before)} style={st} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: Math.max(0, yLine), overflow: "hidden" }}><Img src={staticFile(after)} style={st} /></div>
        {s > 0 && s < 1 && <>
          <div style={{ position: "absolute", left: 0, right: 0, top: yLine - 70, height: 70, background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.16))" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: yLine - 3, height: 6, background: "#fff", boxShadow: "0 0 22px rgba(255,255,255,.8)" }} />
        </>}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <RedLabel text={placeLabel} at={6} hold={at + len - 10} x={0.5} y={0.88} />
      <RedLabel text={dateLabel} at={at + len + 2} x={0.5} y={0.88} />
    </AbsoluteFill>
  );
};
