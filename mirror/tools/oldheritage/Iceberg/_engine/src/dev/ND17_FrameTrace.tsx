// ND17 device: what a half-timbered house is, shown on the real one — the bookshop's own house on the Markt (Commons photo, 26 June
// 2021, three weeks before the flood). The photo dims; the timber frame (a pixel mask cut from the photo itself) lights up white in a sweep
// on "a wooden frame", then the infill panels between the beams take a red tint on "filled in with clay, brick or plaster".
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const IW = 1920, IH = 1280;

export const FrameTrace: React.FC<{ photo: string; timber: string; infill: string; frameAt: number; infillAt: number }> = ({ photo, timber, infill, frameAt, infillAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: D } = useVideoConfig();
  const t = io(f / D);
  const z = 1.32 + 0.12 * t; const focus = [470 - 40 * t, 420];
  const base = Math.max(width / IW, height / IH) * z;
  const left = Math.min(0, width / 2 - focus[0] * base), top = Math.min(0, Math.max(height - IH * base, height / 2 - focus[1] * base));
  const st: React.CSSProperties = { position: "absolute", left, top, width: IW * base, height: IH * base };
  const sweep = io(interpolate(f, [frameAt, frameAt + 34], [0, 1], cl));
  const dim = interpolate(f, [frameAt - 6, frameAt + 10], [1, 0.45], cl);
  const fill = io(interpolate(f, [infillAt, infillAt + 20], [0, 1], cl));
  const edge = sweep * (width + 300) - 150;
  const mask = `linear-gradient(90deg, #000 ${edge - 120}px, rgba(0,0,0,0) ${edge + 40}px)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(photo)} style={{ ...st, filter: `brightness(${dim}) saturate(${0.6 + 0.4 * dim})` }} />
      <div style={{ ...st, opacity: fill * 0.5, mixBlendMode: "multiply" }}><Img src={staticFile(infill)} style={{ width: "100%", height: "100%" }} /></div>
      <div style={{ ...st, WebkitMaskImage: mask, maskImage: mask, filter: "drop-shadow(0 0 6px rgba(255,255,255,.55))" }}><Img src={staticFile(timber)} style={{ width: "100%", height: "100%", opacity: 0.92 }} /></div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 45% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)" }} />
    </AbsoluteFill>
  );
};
