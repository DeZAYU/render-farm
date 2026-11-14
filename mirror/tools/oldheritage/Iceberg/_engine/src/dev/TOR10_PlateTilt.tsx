// TOR10 PlateTilt: a real aerial (USGS NAIP, flown 11 Aug 2022, twelve weeks after the tornado) lies flat in 3-D; the camera lowers
// from a steep oblique to straight down onto one place, a white box draws round it and the red label names it.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export const PlateTilt: React.FC<{ src: string; iw: number; ih: number; spot: [number, number, number, number]; z0?: number; z1?: number; tilt?: [number, number]; spin?: [number, number]; boxAt?: number; label?: string; labelAt?: number }> = ({ src, iw, ih, spot, z0 = 1.25, z1 = 2.1, tilt = [38, 6], spin = [-8, 0], boxAt = 30, label, labelAt = 40 }) => {
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  const u = io(f / Math.max(1, n - 1));
  const z = z0 + (z1 - z0) * u, rx = tilt[0] + (tilt[1] - tilt[0]) * u, rz = spin[0] + (spin[1] - spin[0]) * u;
  const base = Math.max(1920 / iw, 1080 / ih); // image px -> plate px at z=1
  const cx = (spot[0] + spot[2]) / 2, cy = (spot[1] + spot[3]) / 2;
  const g = out(interpolate(f, [boxAt, boxAt + 14], [0, 1], cl));
  const bw = (spot[2] - spot[0]) * base, bh = (spot[3] - spot[1]) * base, P = 2 * (bw + bh);
  return (
    <AbsoluteFill style={{ background: "#0a0a0a", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 960, top: 560, width: 0, height: 0, transformStyle: "preserve-3d",
          transform: `rotateX(${rx.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) scale(${z.toFixed(4)}) translate(${(-cx * base).toFixed(2)}px, ${(-cy * base).toFixed(2)}px)` }}>
          <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: iw * base, height: ih * base, maxWidth: "none", boxShadow: "0 50px 120px rgba(0,0,0,.8)" }} />
          <svg width={iw * base} height={ih * base} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <rect x={spot[0] * base} y={spot[1] * base} width={bw} height={bh} fill="none" stroke="#fff" strokeWidth={5 / z} strokeDasharray={P} strokeDashoffset={P * (1 - g)} />
          </svg>
        </div>
      </AbsoluteFill>
      {/* distance haze toward the top of the tilted plate */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(10,10,10,${0.85 * (rx / 40)}) 0%, rgba(10,10,10,0) 45%)` }} />
      {label && <RedLabel text={label} at={labelAt} x={0.5} y={0.86} />}
    </AbsoluteFill>
  );
};
