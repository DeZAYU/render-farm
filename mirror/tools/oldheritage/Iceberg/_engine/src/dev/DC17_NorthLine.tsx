// DC17 NorthLine: Cebu island on the real Sentinel-2 plate (EOX s2cloudless, CC BY 4.0). Starts on the Mactan channel (small white
// ring where the bridge is), then a dashed white line runs north up the island with the camera to the quake's epicentre off Bogo
// ("centered about 60 miles to the north, near Bogo City"), where a ring opens once; the place label wipes on.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { cl, ease, io } from "./DC01_kit";

type P = [number, number];
export const NorthLine: React.FC<{ src: string; iw: number; ih: number; from: P; to: P; z0: number; z1: number; runAt: number; runLen: number; label: string; labelAt: number }> = ({ src, iw, ih, from, to, z0, z1, runAt, runLen, label, labelAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const g = ease(f, runAt, runAt + runLen);
  const cam = io(interpolate(f, [runAt - 6, runAt + runLen + 10], [0, 1], cl));
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const fx = from[0] + (to[0] - from[0]) * cam, fy = from[1] + (to[1] - from[1]) * cam;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const Q = (p: P) => [ox + p[0] * base, oy + p[1] * base];
  const [ax, ay] = Q(from), [bx, by] = Q(to); const ex = ax + (bx - ax) * g, ey = ay + (by - ay) * g;
  const ring = interpolate(f, [runAt + runLen, runAt + runLen + 30], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: interpolate(f, [0, 10], [0, 1], cl) }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "contrast(1.08) brightness(1.35) saturate(1.1)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 66% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <circle cx={ax} cy={ay} r={12} fill="none" stroke="#fff" strokeWidth={4} />
        <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="rgba(0,0,0,.5)" strokeWidth={9} strokeDasharray="16 12" />
        <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="#fff" strokeWidth={4} strokeDasharray="16 12" />
        {g > 0.99 && <circle cx={bx} cy={by} r={12} fill="#fff" />}
        {ring > 0 && ring < 1 && <circle cx={bx} cy={by} r={12 + ring * 120} fill="none" stroke={`rgba(255,255,255,${1 - ring})`} strokeWidth={4} />}
      </svg>
      <RedLabel text={label} at={labelAt} />
    </AbsoluteFill>
  );
};
