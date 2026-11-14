// WP26 device: GasDrift — "survivors said they'd smelled gas beforehand … a leak formed a cloud, and the cloud exploded".
// The filmer's wide night view of the refinery horizon plays full frame, slowed, with an eased push. Along the ground line in front
// of the plant lights a pale, low haze drifts in from the right (a moving fractal-noise sheet masked to a soft band hugging the
// horizon): faint on "smelled gas", thicker on "formed a cloud". On "exploded" the haze flushes hot orange from one point and
// burns off, the frame warms for a moment, then settles. Footage stays big all the way; no text.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./WP01_kit";

export const GasDrift: React.FC<{
  src: string; from: number; n: number; rate?: number;
  thick: number; boom: number;          // frames: haze thickens / ignites
  band?: number; s0?: number; s1?: number; fx?: number; fy?: number; ix?: number;
}> = ({ src, from, n, rate = 0.75, thick, boom, band = 0.57, s0 = 1.04, s1 = 1.16, fx = 0.55, fy = 0.56, ix = 0.62 }) => {
  const f = useCurrentFrame();
  const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  // haze amount: creeps in, thickens, then burns off after the ignition
  const a0 = 0.32 * io(interpolate(f, [6, 70], [0, 1], cl));
  const a1 = 0.36 * io(interpolate(f, [thick, thick + 36], [0, 1], cl));
  const off = 1 - io(interpolate(f, [boom + 6, boom + 30], [0, 1], cl));
  const haze = (a0 + a1) * off;
  const burn = io(interpolate(f, [boom, boom + 10], [0, 1], cl)) * (1 - io(interpolate(f, [boom + 14, boom + 40], [0, 1], cl)));
  const front = interpolate(f, [boom, boom + 16], [0, 1.6], cl);           // flame front radius (frame widths)
  const drift = f * 2.4;                                                     // px/frame, right -> left
  const id = "wp26gd";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <filter id={id + "n"} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0024 0.011" numOctaves={4} seed={7} />
              <feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.9  0 0 0 0 0.92  0 0 0 1.9 -0.62" />
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <linearGradient id={id + "b"} x1="0" y1="0" x2="0" y2="1">
              <stop offset={band - 0.13} stopColor="#fff" stopOpacity={0} />
              <stop offset={band - 0.03} stopColor="#fff" stopOpacity={0.85} />
              <stop offset={band + 0.04} stopColor="#fff" stopOpacity={1} />
              <stop offset={band + 0.16} stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <mask id={id + "m"}><rect width="1920" height="1080" fill={`url(#${id}b)`} /></mask>
            <radialGradient id={id + "f"} cx={ix} cy={band} r={Math.max(0.001, front)} gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#ffb25a" stopOpacity={1} />
              <stop offset="0.75" stopColor="#ff6a1a" stopOpacity={0.9} />
              <stop offset="1" stopColor="#ff4a0a" stopOpacity={0} />
            </radialGradient>
          </defs>
          {haze > 0.002 && (
            <g mask={`url(#${id}m)`} opacity={haze}>
              <rect x="0" y="0" width="3200" height="1080" transform={`translate(${-drift} 0)`} filter={`url(#${id}n)`} />
            </g>
          )}
          {burn > 0.002 && (
            <g mask={`url(#${id}m)`} style={{ mixBlendMode: "screen" }} opacity={0.95 * burn}>
              <rect width="1920" height="1080" fill={`url(#${id}f)`} />
            </g>
          )}
        </svg>
        {/* the whole frame warms for a beat at the ignition */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 60% 58%, rgba(255,120,40,.55), rgba(255,80,20,0) 70%)", opacity: 0.8 * burn, mixBlendMode: "screen" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
