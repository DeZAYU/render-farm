// ND04 CoastGlide — AE-style 3-D camera over a real satellite mosaic laid flat in perspective: the camera starts over one town and
// glides along the coast to another, a white dashed line drawing the way between them, RedLabels on each place as it is reached.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Pin = { x: number; y: number; label: string; at: number };
export const CoastGlide: React.FC<{ src: string; iw: number; ih: number; a: Pin; b: Pin; moveAt: number; moveLen: number; scale?: number; tilt?: number }> = ({ src, iw, ih, a, b, moveAt, moveLen, scale = 1.5, tilt = 52 }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const m = io(interpolate(f, [moveAt, moveAt + moveLen], [0, 1], cl));
  const intro = out(interpolate(f, [0, 40], [0, 1], cl));
  const cx = a.x + (b.x - a.x) * m, cy = a.y + (b.y - a.y) * m;
  const t = tilt - 8 * (1 - intro), s = scale * (1.12 - 0.12 * intro), rz = -8 + 5 * m;
  const line = out(interpolate(f, [moveAt - 6, moveAt + moveLen], [0, 1], cl));
  const pin = (p: Pin) => { const g = out(interpolate(f, [p.at, p.at + 12], [0, 1], cl)); return g <= 0 ? null : (
    <g key={p.label} transform={`translate(${p.x} ${p.y})`}>
      <circle r={16 * g} fill={RED} stroke="#fff" strokeWidth={5} />
      {/* upright label card: counter-rotate the plane's tilt so it stands */}
      <g transform={`rotate(${-rz})`} style={{ transformBox: "fill-box" }} />
    </g>); };
  const lab = (p: Pin) => { const g = out(interpolate(f, [p.at + 4, p.at + 14], [0, 1], cl)); return g <= 0 ? null : (
    <div key={"l" + p.label} style={{ position: "absolute", left: p.x - 400, top: p.y - 150, width: 800, display: "flex", justifyContent: "center",
      transform: `rotateZ(${-rz}deg) rotateX(${-t}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ background: RED, padding: "8px 18px", clipPath: `inset(0 ${(1 - g) * 100}% 0 0)`, boxShadow: "0 6px 18px rgba(0,0,0,.45)",
        fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 64, lineHeight: 1, color: "#0B0B0B" }}>{p.label}</div>
    </div>); };
  return (
    <AbsoluteFill style={{ background: "#0a0d10", overflow: "hidden", perspective: 1600, perspectiveOrigin: "50% 20%" }}>
      <div style={{ position: "absolute", left: W / 2, top: H * 0.58, width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(${t}deg) rotateZ(${rz}deg) scale(${s})` }}>
        <div style={{ position: "absolute", left: -cx, top: -cy, width: iw, height: ih, transformStyle: "preserve-3d" }}>
          <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: iw, height: ih }} />
          <svg width={iw} height={ih} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke="rgba(0,0,0,.5)" strokeWidth={12} fill="none" pathLength={1} strokeDasharray={`${line} 1`} />
            <path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke="#fff" strokeWidth={6} fill="none" pathLength={1} strokeDasharray={`${line} 1`} />
            {pin(a)}{pin(b)}
          </svg>
          {lab(a)}{lab(b)}
        </div>
      </div>
      <RedLabel text="" at={1e6} />{/* loads the channel fonts for the plane labels */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 45% 55%, rgba(0,0,0,0) 45%, rgba(5,8,10,.75) 100%)" }} />
      {/* haze toward the horizon */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,13,16,1) 0%, rgba(10,13,16,.85) 8%, rgba(10,13,16,0) 34%)" }} />
    </AbsoluteFill>
  );
};
