// IN19 BladeLevel: the phone video frozen on the knife hanging where the crutch stopped, with a worker standing beside it (face blurred).
// The frame drains to cold grey except one soft horizontal band of colour at the blade's height, which runs across to the man standing
// next to it: the blade sits level with a grown man's head and neck. Slow push into the band; no lines, no text.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Blur } from "./IN16_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const BladeLevel: React.FC<{ src: string; t: number; ar: number; band: [number, number]; face: [number, number, number, number]; n: number; drainAt?: number }> =
  ({ src, t, ar, band, face, n, drainAt = 12 }) => {
  const f = useCurrentFrame();
  const s = 1.0 + 0.32 * io(Math.min(1, f / n)), cy = (band[0] + band[1]) / 2;
  const h = 1080 * s, w = h * ar, left = 960 - w / 2, top = Math.min(0, Math.max(1080 - h, 540 - cy * h));
  const d = io(interpolate(f, [drainAt, drainAt + 26], [0, 1], cl));
  const st: React.CSSProperties = { position: "absolute", left, top, width: w, height: h };
  const y0 = top + band[0] * h, y1 = top + band[1] * h, fe = (y1 - y0) * 0.35;
  const mask = `linear-gradient(180deg, #000 ${y0 - fe}px, transparent ${y0 + fe * 0.4}px, transparent ${y1 - fe * 0.4}px, #000 ${y1 + fe}px)`;
  const vid = (filter?: string) => <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter }} /></Freeze>;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(36px) brightness(0.4) saturate(0.6)", transform: "scale(1.15)" }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
      </AbsoluteFill>
      {vid()}
      <AbsoluteFill style={{ opacity: d, WebkitMaskImage: mask, maskImage: mask }}>{vid("grayscale(1) brightness(0.5)")}</AbsoluteFill>
      <div style={{ position: "absolute", left, top, width: w, height: h }}><Blur box={face} px={26} /></div>
    </AbsoluteFill>
  );
};
