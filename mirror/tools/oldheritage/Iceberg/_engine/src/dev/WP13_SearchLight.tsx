// WP13 device: SearchLight. The hillside filmer's frame of the tank farm, frozen full screen and pushed slowly; the frame drops
// to a cold dark, and one soft pool of light (the undimmed frame through a round mask) hunts across the rows of tanks, pausing,
// moving on, never settling: "a man was still inside", and nobody knew where. Footage stays full frame.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FrameAt, cl, io } from "./WP01_kit";

type P = [number, number]; // normalised frame position
const seg = (f: number, path: { f: number; p: P }[]): P => {
  if (f <= path[0].f) return path[0].p;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    if (f <= b.f) { const u = io((f - a.f) / (b.f - a.f)); return [a.p[0] + (b.p[0] - a.p[0]) * u, a.p[1] + (b.p[1] - a.p[1]) * u]; }
  }
  return path[path.length - 1].p;
};

export const SearchLight: React.FC<{ src: string; t: number; n: number; path: { f: number; p: P }[]; r?: number; s0?: number; s1?: number }> = ({ src, t, n, path, r = 0.15, s0 = 1.04, s1 = 1.12 }) => {
  const f = useCurrentFrame();
  const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  const dim = interpolate(f, [0, 16], [0, 1], cl);
  const [x, y] = seg(f, path);
  const rr = r * (1 + 0.06 * Math.sin(f / 7)); // a hand-held lamp breathes a little
  const mask = `radial-gradient(ellipse ${rr * 100 * 0.62}% ${rr * 100 * 1.1}% at ${x * 100}% ${y * 100}%, #000 0%, #000 45%, rgba(0,0,0,.55) 70%, transparent 100%)`;
  const img: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: "50% 60%" }}>
        <AbsoluteFill style={{ filter: `brightness(${1 - 0.68 * dim}) saturate(${1 - 0.6 * dim}) contrast(1.05)` }}><FrameAt src={src} t={t} style={img} /></AbsoluteFill>
        <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask, opacity: dim, filter: "brightness(1.18) contrast(1.06)" }}><FrameAt src={src} t={t} style={img} /></AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.5) 100%)" }} />
    </AbsoluteFill>
  );
};
