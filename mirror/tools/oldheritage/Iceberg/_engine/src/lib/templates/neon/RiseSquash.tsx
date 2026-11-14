// neon / RiseSquash. REF VV §13 pop-up glyph with squash (Visual Venture @ 12:47.3: a yellow #F3FF0C heavy rounded "?" ~0.47 H tall rises from
// below the frame over a red-tinted portrait, top edge 959 -> 287 px in 31 f, exponential ease-out tau 0.31 s (start ~2660 px/s); width x1.17 -> 1.00
// over the first 8 f, overshoot-free; faint glow (ratio 0.3); lands exactly on its word).
// Ours: any glyph from the library, the plate is any photo/clip turned into the red mono tint with a constant linear push; the glyph keeps a
// 0.25 %/f float after landing so nothing is dead-still.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, Media, Vignette, EZ } from "../../core";
import { Glyph, NEON, hexA } from "./glyphs";
import { PopCaption, type CapWord } from "./shared";

export type RiseSquashProps = {
  src: string; // the plate (photo or clip), tinted red-mono
  tint?: string; // multiply colour of the plate
  pushPerS?: number; // linear plate push
  glyph: string;
  colour?: string; // VV #F3FF0C
  at: number; // first frame of the rise (lands ~31 f later)
  riseFrames?: number;
  size?: number; // glyph box px (VV ~0.47 H tall)
  x?: number; // glyph centre x (px)
  landY?: number; // glyph centre y when landed (px)
  captions?: CapWord[];
};

const TAU = 9.3; // 0.31 s at 30 fps
export const RiseSquash: React.FC<RiseSquashProps> = ({ src, tint = "#C0101C", pushPerS = 0.02, glyph, colour = NEON.yellow, at, riseFrames = 31, size = 540, x = W * 0.66, landY = 287 + 540 / 2, captions = [] }) => {
  const f = useCurrentFrame();
  const k = f - at;
  const y0 = H + size * 0.5 - 120, y1 = landY;
  const e = (t: number) => (Math.exp(-t / TAU) - Math.exp(-riseFrames / TAU)) / (1 - Math.exp(-riseFrames / TAU));
  const y = k < 0 ? y0 : k < riseFrames ? y1 + (y0 - y1) * e(k) : y1 - 0.0025 * size * (k - riseFrames) * 0.4;
  const sx = k < 0 ? 1.17 : 1 + 0.17 * (1 - EZ.out3(k / 8));
  const sy = 1 / Math.sqrt(sx);
  const ps = 1.04 * (1 + pushPerS * (Math.max(0, f) / 30));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${ps.toFixed(5)})` }}>
        <Media src={src} style={{ filter: "grayscale(1) contrast(1.15) brightness(.8)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,.6) 100%)" }} />
      <Vignette />
      {k >= 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`} style={{ filter: `drop-shadow(0 0 4px ${hexA(colour, 0.6)}) drop-shadow(0 0 18px ${hexA(colour, 0.3)})` }}>
            <Glyph name={glyph} colour={colour} size={size} />
          </g>
        </svg>
      ) : null}
      <PopCaption f={f} words={captions} y={H - 200} size={104} />
    </AbsoluteFill>
  );
};

export const RISE_DEMO: RiseSquashProps = { src: "demo/chu_g.png", glyph: "question", at: 24, x: W * 0.68, captions: [] };
