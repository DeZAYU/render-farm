// TP03 ZipperBoard: what a Zipper is, from real photos of other Zippers (Wikimedia Commons): a night photo of one turning, on a tilted print,
// with a white line laid along its boom that swings end over end about the hub; then the camera pans down the board to a second print (the
// cages hanging along a standing boom), each cage's own pivot ticked as the VO says they flip. px = source pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Pt = [number, number];
export const ZipperBoard: React.FC<{ a: { src: string; iw: number; ih: number; hub: Pt; end: Pt }; b: { src: string; iw: number; ih: number; pivots: Pt[] }; swingAt: number; moveAt: number; pivAt: number; bg: string }> = ({ a, b, swingAt, moveAt, pivAt, bg }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const m = io(interpolate(f, [moveAt, moveAt + 24], [0, 1], cl)), drift = f / durationInFrames;
  const AW = 1100, AH = AW * a.ih / a.iw, BW = 640, BH = BW * b.ih / b.iw;
  const ka = AW / a.iw, kb = BW / b.iw;
  const hx = a.hub[0] * ka, hy = a.hub[1] * ka, L = Math.hypot(a.end[0] - a.hub[0], a.end[1] - a.hub[1]) * ka, base = Math.atan2(a.end[1] - a.hub[1], a.end[0] - a.hub[0]);
  const sw = io(interpolate(f, [swingAt, swingAt + 40], [0, 1], cl)), th = base + sw * Math.PI; // half a turn: end over end
  const so = interpolate(f, [swingAt - 6, swingAt + 4], [0, 1], cl);
  const camY = -560 * m, camX = -420 * m;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(28px) brightness(.3)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translate(${camX}px, ${camY}px) rotateX(${8 - 4 * drift}deg) rotateY(${-10 + 6 * drift + 10 * m}deg) scale(${1 + 0.05 * drift})` }}>
          <div style={{ position: "absolute", left: (width - AW) / 2 - 140, top: 170, width: AW, height: AH, border: "6px solid #fff", boxShadow: "0 40px 90px rgba(0,0,0,.7)", overflow: "hidden", filter: `brightness(${1 - 0.4 * m})` }}>
            <Img src={staticFile(a.src)} style={{ width: "100%", height: "100%" }} />
            <svg width={AW} height={AH} style={{ position: "absolute", inset: 0, opacity: so, filter: "drop-shadow(0 0 6px rgba(0,0,0,.9))" }}>
              <line x1={hx - L * Math.cos(th)} y1={hy - L * Math.sin(th)} x2={hx + L * Math.cos(th)} y2={hy + L * Math.sin(th)} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
              <circle cx={hx} cy={hy} r={10} fill="#fff" />
            </svg>
          </div>
          <div style={{ position: "absolute", left: (width - AW) / 2 - 140 + AW - 300, top: 170 + AH - 120, width: BW, height: BH, border: "6px solid #fff", boxShadow: "0 40px 90px rgba(0,0,0,.75)", overflow: "hidden", transform: "translateZ(80px) rotateZ(3deg)" }}>
            <Img src={staticFile(b.src)} style={{ width: "100%", height: "100%" }} />
            <svg width={BW} height={BH} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 5px rgba(0,0,0,.9))" }}>
              {b.pivots.map(([x, y], i) => { const g = io(interpolate(f, [pivAt + i * 6, pivAt + i * 6 + 14], [0, 1], cl)); if (g <= 0) return null;
                const r = 26, spin = (f - pivAt) * 0.12 + i;
                return <g key={i} opacity={g}><circle cx={x * kb} cy={y * kb} r={6} fill="#fff" />
                  <path d={`M ${x * kb + r * Math.cos(spin)} ${y * kb + r * Math.sin(spin)} A ${r} ${r} 0 0 1 ${x * kb + r * Math.cos(spin + 4)} ${y * kb + r * Math.sin(spin + 4)}`} fill="none" stroke="#fff" strokeWidth={4} /></g>; })}
            </svg>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
