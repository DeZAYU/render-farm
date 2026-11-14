// WP06 device: "people woke to an orange glow behind the streetlights". The filmer's wide street view (4:3, full frame, slowed) plays;
// then the streetlights go out one by one (each halo swallowed by a soft dark disc), the street dims, and the only light left is the
// orange glow of the burning cars behind them, which warms while the frame eases toward it. Works on the footage, nothing beside it.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useWpFonts, io, cl } from "./WP01_kit";

type P = {
  src: string; from: number; rate: number; n: number;
  /** source pixel coords (srcW x srcH) of each lamp: [x, y, radius], in the order they go out */
  lamps: [number, number, number][];
  glow: [number, number];  // the fire's glow, source px
  srcW?: number; srcH?: number; fy?: number;  // fy: vertical framing of the cover crop (0 top .. 1 bottom)
  out0?: number; out1?: number;  // fraction of the shot where the lamps start / finish going out
};

export const WP06_LampFade: React.FC<P> = ({ src, from, rate, n, lamps, glow, srcW = 640, srcH = 480, fy = 0.45, out0 = 0.32, out1 = 0.72 }) => {
  useWpFonts();
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const u = f / Math.max(1, n - 1);
  // cover crop of the 4:3 source: full width, vertical framing fy
  const H = width * (srcH / srcW), top = -(H - height) * fy, k = width / srcW;
  const gx = glow[0] * k, gy = glow[1] * k + top;
  const s = 1.0 + 0.13 * io(u);  // slow push toward the glow
  const dimAll = io(interpolate(u, [out0 + 0.1, out1 + 0.1], [0, 1], cl));
  const warm = io(interpolate(u, [out0 + 0.15, 1], [0, 1], cl));
  const vid = (st: React.CSSProperties) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ position: "absolute", left: 0, top, width, height: H, ...st }} />;
  // the lamps go out in order: each lamp's own halo is pulled down first, then the whole street drops to dark
  const span = (out1 - out0) / lamps.length;
  const lampA = lamps.map((_, i) => io(interpolate(u, [out0 + i * span, out0 + (i + 1.5) * span], [0, 1], cl)));
  const mask = `radial-gradient(circle at ${gx}px ${gy}px, #000 0px, rgba(0,0,0,.85) ${60 * k / 3}px, rgba(0,0,0,.45) ${190 * k / 3}px, rgba(0,0,0,.15) ${330 * k / 3}px, transparent ${480 * k / 3}px)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${gx}px ${gy}px`, willChange: "transform" }}>
        {vid({ filter: `brightness(${1 - 0.66 * dimAll}) saturate(${1 - 0.35 * dimAll})` })}
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="wp06lamp"><stop offset="0%" stopColor="#000" stopOpacity="0.55" /><stop offset="100%" stopColor="#000" stopOpacity="0" /></radialGradient>
            <radialGradient id="wp06warm" cx={gx} cy={gy} r={width * 0.2} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff8a2a" stopOpacity="0.3" /><stop offset="100%" stopColor="#ff6a10" stopOpacity="0" />
            </radialGradient>
          </defs>
          {lamps.map(([x, y, r], i) => lampA[i] > 0 ? <circle key={i} cx={x * k} cy={y * k + top} r={r * k * 3.2} fill="url(#wp06lamp)" opacity={lampA[i] * (1 - dimAll * 0.6)} /> : null)}
        </svg>
        {/* the glow keeps its own light: an undimmed copy seen through a soft round mask */}
        <div style={{ position: "absolute", inset: 0, opacity: dimAll, WebkitMaskImage: mask, maskImage: mask }}>{vid({})}</div>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
          <rect x={0} y={0} width={width} height={height} fill="url(#wp06warm)" opacity={warm} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
