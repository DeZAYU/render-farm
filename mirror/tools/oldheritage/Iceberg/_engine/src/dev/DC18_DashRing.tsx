// DC18 DashRing: the Santiago basin on the real Sentinel-2 plate (EOX s2cloudless, CC BY 4.0). Opens on the city, then eases north
// to Colina while a DASHED white ring draws round the town: the place one upload gives, never confirmed ("though the exact road
// hasn't been confirmed"), so the ring stays broken; place label under it.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { cl, ease, io } from "./DC01_kit";

type P = [number, number];
export const DashRing: React.FC<{ src: string; iw: number; ih: number; from: P; to: P; z0: number; z1: number; r: number; ringAt: number; label: string; labelAt: number }> = ({ src, iw, ih, from, to, z0, z1, r, ringAt, label, labelAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / durationInFrames);
  const z = z0 + (z1 - z0) * u, fx = from[0] + (to[0] - from[0]) * u, fy = from[1] + (to[1] - from[1]) * u;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const cx = ox + to[0] * base, cy = oy + to[1] * base, R = r * base;
  const g = ease(f, ringAt, ringAt + 26);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: interpolate(f, [0, 10], [0, 1], cl) }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "contrast(1.06) brightness(1.1)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 66% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `conic-gradient(from 0deg at ${cx}px ${cy}px, #000 ${g * 360}deg, transparent ${g * 360 + 0.5}deg)`, maskImage: `conic-gradient(from 0deg at ${cx}px ${cy}px, #000 ${g * 360}deg, transparent ${g * 360 + 0.5}deg)` } as React.CSSProperties}>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={10} strokeDasharray="22 16" />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#fff" strokeWidth={4.5} strokeDasharray="22 16" />
        </svg>
      </div>
      <RedLabel text={label} at={labelAt} />
    </AbsoluteFill>
  );
};
