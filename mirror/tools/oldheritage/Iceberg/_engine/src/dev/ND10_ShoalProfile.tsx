// ND10 ShoalProfile: why a ship is safer at sea: a cross-section from the open ocean to the port, drawn over a dark copy of the Chikyu's
// own sea footage. The wave pulse travels shoreward; its speed and length scale with sqrt(depth) and its height grows as depth shrinks
// (Green's law, exaggerated vertically so it reads). Low and long over deep water, short and tall in the shallows by the port.
// Built for "In deep water the wave is low and spread out. It only piles up in the shallows."
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const SURF = 470; // still-water line (px)
// sea floor (px): deep plain -> continental slope -> shelf -> port
const floorY = (x: number) => {
  if (x < 820) return 1000;
  if (x < 1280) { const k = (x - 820) / 460; return 1000 - 330 * (k * k * (3 - 2 * k)); }
  if (x < 1720) return 670 - 160 * ((x - 1280) / 440);
  return 510 - 60 * Math.min(1, (x - 1720) / 60);
};
const depth = (x: number) => Math.max(18, floorY(x) - SURF);

export const ND10_ShoalProfile: React.FC<{ bg: string; bgFrom?: number; deepLabel: string; shallowLabel: string }> = ({ bg, bgFrom = 0, deepLabel, shallowLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // wave crest position: integrate speed ~ sqrt(depth) so it visibly slows on the shelf
  const T = durationInFrames - 10;
  let x = 60;
  // simple numeric march: choose a speed scale so the crest reaches x = 1700 at frame T
  const march = (scale: number, n: number) => { let xx = 60; for (let i = 0; i < n; i++) xx += Math.sqrt(depth(xx)) * scale; return xx; };
  let lo = 0.01, hi = 2; for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; if (march(m, T) > 1700) hi = m; else lo = m; }
  x = march(lo, Math.min(f, T));
  const h = depth(x), h0 = depth(60);
  const amp = 14 * Math.pow(h0 / h, 0.75);        // px of crest height (exaggerated Green's law)
  const sig = 230 * Math.sqrt(h / h0) + 26;        // half-width, shortening with depth
  const surf = (xx: number) => SURF - amp * Math.exp(-((xx - x) * (xx - x)) / (2 * sig * sig)) * (xx > 1790 ? 0 : 1);
  const xs = Array.from({ length: 193 }, (_, i) => i * 10);
  const surfD = "M" + xs.map((xx) => `${xx} ${surf(xx).toFixed(1)}`).join(" L");
  const water = surfD + ` L 1920 ${floorY(1920)} ` + xs.slice().reverse().map((xx) => `L ${xx} ${floorY(xx).toFixed(1)}`).join(" ") + " Z";
  const floorD = "M" + xs.map((xx) => `${xx} ${floorY(xx).toFixed(1)}`).join(" L") + " L 1920 1080 L 0 1080 Z";
  const draw = io(interpolate(f, [0, 16], [0, 1], cl));
  const o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(12px) brightness(.32) saturate(.5)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="nd10w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(150,175,195,.34)" /><stop offset="1" stopColor="rgba(40,60,80,.12)" /></linearGradient>
          <clipPath id="nd10c"><rect x={0} y={0} width={1920 * draw} height={1080} /></clipPath>
        </defs>
        <g clipPath="url(#nd10c)">
          <path d={water} fill="url(#nd10w)" />
          <path d={floorD} fill="rgba(8,8,8,.86)" stroke="#fff" strokeWidth={4} />
          <line x1={0} y1={SURF} x2={1790} y2={SURF} stroke="rgba(255,255,255,.35)" strokeWidth={2} strokeDasharray="10 10" />
          <path d={surfD} fill="none" stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
          {/* the port quay on the right */}
          <rect x={1790} y={430} width={130} height={80} fill="rgba(8,8,8,.9)" stroke="#fff" strokeWidth={4} />
        </g>
      </svg>
      <RedLabel text={deepLabel} at={10} hold={durationInFrames * 0.55} x={0.22} y={0.24} size={38} />
      <RedLabel text={shallowLabel} at={Math.round(durationInFrames * 0.62)} x={0.8} y={0.24} size={38} />
    </AbsoluteFill>
  );
};
