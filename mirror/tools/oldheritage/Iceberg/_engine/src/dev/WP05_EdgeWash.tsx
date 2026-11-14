// WP05 device EdgeWash: the riverbank clip (bblankinship) frozen at src 20 s (the filmer pans, so marks stay on one frame), pushing in on the cars burning at the water's edge. White corner
// brackets close on the fire (tag BURNING CRUDE), the river is named, then on "at the water's edge" a white line runs along the bank and on
// "pushes the oil straight into the water supply" a dark slick spreads from the fire's foot across the water, ragged-edged, under the
// reflection: what pouring water and foam on it would have done.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { ARCH, useWpFonts } from "./WP01_kit";
import { Still, cl, io } from "./WP45_kit";

const W = 1920, H = 1080;
const FIRE: [number, number, number, number] = [0.395, 0.40, 0.535, 0.71]; // x0 y0 x1 y1
const BANK: [number, number][] = [[0.455, 0.675], [0.40, 0.655], [0.30, 0.635], [0.18, 0.62], [0.08, 0.612], [0.0, 0.61]];
const WATER = "0,0.612 0.08,0.614 0.18,0.622 0.30,0.637 0.40,0.657 0.455,0.677 0.49,0.72 0.49,1 0,1";

export const EdgeWash: React.FC<{ src: string; from: number; rate: number; n: number; at: { box: number; river: number; bank: number; slick: number; slickEnd: number } }> = ({ src, from, rate, n, at }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const s = 1.0 + 0.12 * io(Math.min(1, f / n));
  const b = io(interpolate(f, [at.box, at.box + 16], [0, 1], cl));
  const [x0, y0, x1, y1] = FIRE.map((v, i) => v * (i % 2 ? H : W));
  const pad = 70 * (1 - b), L = 46;
  const corner = (x: number, y: number, dx: number, dy: number) => `M${x + dx * L},${y} L${x},${y} L${x},${y + dy * L}`;
  const bk = BANK.map(([x, y]) => [x * W, y * H]);
  const blen = bk.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - bk[i][0], p[1] - bk[i][1]), 0);
  const bd = io(interpolate(f, [at.bank, at.bank + 30], [0, 1], cl));
  const sl = io(interpolate(f, [at.slick, at.slickEnd], [0, 1], cl));
  const water = WATER.split(" ").map((p) => { const [x, y] = p.split(",").map(Number); return `${x * W},${y * H}`; }).join(" ");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: "46% 62%" }}>
        <Still src={src} t={from} n={n} s0={1} s1={1} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <clipPath id="wp05water"><polygon points={water} /></clipPath>
            <filter id="wp05rag" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves={3} seed={7} />
              <feDisplacementMap in="SourceGraphic" scale={90} xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation={6} />
            </filter>
            <radialGradient id="wp05sl" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#0b0603" stopOpacity={0.85} /><stop offset="0.75" stopColor="#140b04" stopOpacity={0.7} /><stop offset="1" stopColor="#1a1006" stopOpacity={0} />
            </radialGradient>
          </defs>
          {sl > 0 && (
            <g clipPath="url(#wp05water)">
              <ellipse cx={0.455 * W - 900 * sl * 0.55} cy={0.69 * H + 120 * sl} rx={60 + 1000 * sl} ry={30 + 260 * sl} fill="url(#wp05sl)" filter="url(#wp05rag)" style={{ mixBlendMode: "multiply" }} />
            </g>
          )}
          <path d={"M" + bk.map((p) => p.join(",")).join(" L")} fill="none" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={blen} strokeDashoffset={blen * (1 - bd)} opacity={bd > 0 ? 1 : 0} style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,.9))" }} />
          <g opacity={b} stroke="white" strokeWidth={5} fill="none" style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,.9))" }}>
            <path d={corner(x0 - pad, y0 - pad, 1, 1)} /><path d={corner(x1 + pad, y0 - pad, -1, 1)} />
            <path d={corner(x0 - pad, y1 + pad, 1, -1)} /><path d={corner(x1 + pad, y1 + pad, -1, -1)} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: x1 + 18, top: y0 + 8, opacity: b, ...ARCH, fontSize: 30, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.95)" }}>BURNING CRUDE</div>
      </AbsoluteFill>
      <RedLabel text="JAMES RIVER" at={at.river} x={0.2} y={0.88} size={42} />
    </AbsoluteFill>
  );
};
