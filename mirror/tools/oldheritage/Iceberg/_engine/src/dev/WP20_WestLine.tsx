// WP20 WestLine: NASA Blue Marble plate of central British Columbia laid back in 3-D at night levels. The camera starts over Prince
// George, where Lakeland's mill still glows; on "three months earlier" a white dashed line runs west along the plate and the camera
// travels with it to Burns Lake, where a second, colder ember lights for Babine Forest Products. Real positions (plate pixels from
// lat/lon). Built for WP20 only.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { cl, io } from "./WP01_kit";
import { RedLabel } from "../brand";

type P = [number, number];
export const WestLine: React.FC<{ plate: string; pw: number; ph: number; a: P; b: P; pan: [number, number]; bOn: number; n: number;
  labA: string; labB: string; labB2: string }> = ({ plate, pw, ph, a, b, pan, bOn, n, labA, labB, labB2 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const u = io(interpolate(f, [pan[0], pan[1]], [0, 1], cl));
  const S = 1.75 + 0.12 * io(Math.min(1, f / n));
  const fx = a[0] + (b[0] - a[0]) * u, fy = a[1] + (b[1] - a[1]) * u;
  const tx = width / 2 - fx * S, ty = height * 0.56 - fy * S;
  const line = io(interpolate(f, [pan[0] - 4, pan[1] - 6], [0, 1], cl));
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const pulse = (t: number) => 0.75 + 0.25 * Math.sin(t / 5);
  const bA = interpolate(f, [bOn, bOn + 10], [0, 1], cl);
  const ember = (p: P, k: number, col: string) => (
    <g>
      <circle cx={p[0]} cy={p[1]} r={34 * k} fill={`url(#g${col})`} opacity={k} />
      <circle cx={p[0]} cy={p[1]} r={5} fill="#fff" opacity={Math.min(1, k * 1.4)} />
      <circle cx={p[0]} cy={p[1]} r={13} fill="none" stroke="#fff" strokeWidth={2.5} opacity={Math.min(1, k * 1.4) * 0.9} />
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#020304", overflow: "hidden", perspective: 1700 }}>
      <AbsoluteFill style={{ transform: "rotateX(26deg)", transformOrigin: "50% 60%" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${S})` }}>
          <Img src={staticFile(plate)} style={{ position: "absolute", width: pw, height: ph, filter: "brightness(1.75) saturate(.75) contrast(1.1)" }} />
          <svg width={pw} height={ph} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <defs>
              <radialGradient id="gA"><stop offset="0%" stopColor="#ffb055" stopOpacity={0.95} /><stop offset="45%" stopColor="#ff6a1a" stopOpacity={0.45} /><stop offset="100%" stopColor="#ff4a00" stopOpacity={0} /></radialGradient>
              <radialGradient id="gB"><stop offset="0%" stopColor="#ff9a6a" stopOpacity={1} /><stop offset="45%" stopColor="#e3141b" stopOpacity={0.6} /><stop offset="100%" stopColor="#e3141b" stopOpacity={0} /></radialGradient>
            </defs>
            <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * line} y2={a[1] + (b[1] - a[1]) * line} stroke="#fff" strokeWidth={2.6} strokeDasharray="10 8" strokeLinecap="round" opacity={0.9} />
            {ember(a, pulse(f), "A")}
            {bA > 0 && ember(b, bA * pulse(f + 9), "B")}
          </svg>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 55%, rgba(0,0,0,0) 50%, rgba(0,0,0,.7) 100%)" }} />
      <RedLabel text={labA} at={8} hold={Math.max(10, pan[0] - 14)} size={40} y={0.8} />
      <RedLabel text={labB} at={bOn + 4} hold={n - bOn - 14} size={40} y={0.8} />
      <RedLabel text={labB2} at={bOn + 22} hold={n - bOn - 32} size={36} y={0.875} />
      {L < 0 && null}
    </AbsoluteFill>
  );
};
