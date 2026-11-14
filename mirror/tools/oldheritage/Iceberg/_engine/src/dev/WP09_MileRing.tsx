// WP09 MileRing — the evacuation order on the real ground: the USGS NAIP aerial of East Palestine lies tilted in 3-D, the camera eases
// down onto it; a red point marks the derailment beside the rail line, a white radius line runs out to one mile (to scale) and the ring
// sweeps round from it; everything outside the ring dims, the village inside stays lit. One appearance, no numerals (the VO says it).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** img: aerial (W x H px), site: [x, y] px of the derailment, r: one mile in px */
export const WP09_MileRing: React.FC<{ img: string; W: number; H: number; site: [number, number]; r: number; n: number }> = ({ img, W, H, site, r, n }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const u = io(f / n);
  const tilt = 38 - 10 * u, s = 0.78 + 0.12 * u, rz = -4 + 3 * u;
  const dot = out(interpolate(f, [4, 14], [0, 1], cl));
  const rad = io(interpolate(f, [10, 28], [0, 1], cl));
  const ring = io(interpolate(f, [26, 58], [0, 1], cl));
  const dim = interpolate(f, [40, 66], [0, 1], cl);
  const C = 2 * Math.PI * r;
  const [sx, sy] = site;
  return (
    <AbsoluteFill style={{ background: "#07090b", overflow: "hidden", perspective: 1600 }}>
      <div style={{ position: "absolute", left: width / 2 - W / 2, top: height / 2 - H / 2, width: W, height: H,
        transform: `translateY(${60 - 40 * u}px) rotateX(${tilt}deg) rotateZ(${rz}deg) scale3d(${s},${s},1)`, transformOrigin: `${sx}px ${sy}px`, willChange: "transform" }}>
        <Img src={staticFile(img)} style={{ width: W, height: H, display: "block" }} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: W, height: H }}>
          <defs>
            <mask id="wp09ring"><rect width={W} height={H} fill="#fff" /><circle cx={sx} cy={sy} r={r} fill="#000" /></mask>
            <radialGradient id="wp09edge" cx="50%" cy="50%" r="50%"><stop offset="60%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity=".85" /></radialGradient>
          </defs>
          <rect width={W} height={H} fill="#000" opacity={0.62 * dim} mask="url(#wp09ring)" />
          <rect width={W} height={H} fill="url(#wp09edge)" />
          <line x1={sx} y1={sy} x2={sx + r * rad} y2={sy} stroke="#fff" strokeWidth={6} strokeDasharray="22 14" opacity={rad > 0 ? 1 - 0.4 * ring : 0} />
          <circle cx={sx} cy={sy} r={r} fill="none" stroke="#fff" strokeWidth={7} strokeDasharray={`${C * ring} ${C}`} transform={`rotate(0 ${sx} ${sy})`}
            style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,.8))" }} />
          <circle cx={sx} cy={sy} r={16 * dot} fill="#E3141B" stroke="#fff" strokeWidth={4 * dot} />
          <circle cx={sx} cy={sy} r={16 + 50 * ((f % 30) / 30)} fill="none" stroke="#E3141B" strokeWidth={3} opacity={dot * (1 - (f % 30) / 30)} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
