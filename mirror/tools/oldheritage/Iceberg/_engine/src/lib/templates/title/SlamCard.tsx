// title / SlamCard: VV §2 "hold huge, then fall back" (MOTION.md §2, 17:30.63 "ONE OF THE MOST / HAUNTING INTERVIEWS / EVER BROADCAST."):
// #181818 plate, optional small B/W clip in a thin frame top-centre, three LEFT-ALIGNED condensed lines (yellow / red largest / white).
// Phase 1 (15 f): the block cuts in at x3.1, bottom-clipped, and creeps up with accelerating steps; phase 2 (on the key word): recession to x1
// (tau 0.35 s then a 0.9 s tail), scaling about its left-centre so the left edges stay on one column. No glow, soft drop shadow. Hard cut out.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, Media, RC, W, clamp01, measure } from "../../core";

export type SlamCardProps = {
  lines: { text: string; colour: string; size: number }[]; // Bebas sizes in px at the settled scale
  fallAt?: number; // frame of the key word: phase 2 starts
  media?: string; // optional small clip/still top-centre (B/W)
};
export const SlamCard: React.FC<SlamCardProps> = ({ lines, fallAt = 15, media }) => {
  const f = useCurrentFrame();
  // FIT (lead fix, c02/c04 overflow): the settled size AND the burst scale are computed so the longest line stays inside the safe area
  // (90 % width, 90 % height) at EVERY frame. Long text simply slams smaller; short text keeps the measured VV x3.1 burst.
  const SAFE_W = 0.9 * W, SAFE_H = 0.9 * H;
  // width = glyph advance + the 0.01 em tracking per character + 4 % for the text-shadow / glyph overhang (measured against renders)
  // M-060 fix: the fit must hold from frame 0. Before Bebas is decoded, canvas measure() returns the (narrower) fallback width, so the
  // width is the max of the measurement and a conservative Bebas estimate (0.47 em per glyph incl. caps/digits; measured max 0.45).
  const est = (t: string, size: number) => t.length * size * 0.47;
  const natW = Math.max(1, ...lines.map((l) => (Math.max(measure(l.text, `${l.size}px "${FONT.bebas}"`), est(l.text, l.size)) + 0.01 * l.size * l.text.length) * 1.04 + 8));
  const natH = lines.reduce((a, l) => a + l.size * 0.92, 0);
  const MIN_BURST = 1.35; // even the longest text keeps a visible slam: it settles at <= 1/1.35 of the safe width
  const k = Math.min(1, SAFE_W / (natW * MIN_BURST), (0.6 * H) / natH); // settled scale of the authored sizes
  const bw = natW * k, bh = natH * k;
  const sMax = Math.max(1, Math.min(3.15, SAFE_W / bw, SAFE_H / bh)); // largest burst scale that still fits
  const amp = sMax - 1;
  const p1 = EZ.in2(clamp01(f / fallAt));
  const t2 = Math.max(0, f - fallAt) / 30;
  // VV §2 shape, scaled to the available amplitude: hold huge (slight creep) -> recession tau .35 s + .9 s tail
  const S = f < fallAt ? 1 + amp * (0.976 + 0.024 * p1) : 1 + amp * (0.62 * Math.exp(-t2 / 0.35) + 0.38 * Math.exp(-t2 / 0.9));
  const y = f < fallAt ? -93 * p1 : -93 - 170 * (1 - Math.exp(-t2 / 0.45));
  const cy = H * 0.62 + bh / 2 + y; // block centre (same settled spot as before)
  return (
    <AbsoluteFill style={{ background: "#181818", overflow: "hidden" }}>
      {media ? (
        <div style={{ position: "absolute", left: W / 2 - 230, top: 70, width: 460, height: 259, border: "3px solid #d8d8d8", overflow: "hidden", filter: "grayscale(1) contrast(1.1)", opacity: clamp01((f - fallAt - 6) / 6) }}>
          <Media src={media} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: (W - bw) / 2, top: Math.min(Math.max(cy, H * 0.05 + (bh * S) / 2), H * 0.95 - (bh * S) / 2) - bh / 2, width: bw, height: bh,
        transformOrigin: "50% 50%", transform: `scale(${S.toFixed(4)})` }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: FONT.bebas, fontSize: l.size * k, lineHeight: 0.92, color: l.colour, whiteSpace: "nowrap", letterSpacing: "0.01em", textShadow: "0 4px 10px rgba(0,0,0,.65)" }}>{l.text}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
export const SLAM_DEFAULT_COLOURS = { yellow: "#E6FF1E", red: "#E30005", white: "#F2F2F2", vvRed: RC.vvRed };
