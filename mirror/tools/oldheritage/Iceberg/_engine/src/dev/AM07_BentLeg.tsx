// AM07 BentLeg: "and one vertical timber, called a bent leg, had cracked under the load." A real close photo of Son of Beast's
// dense timber lattice (ThrillZing, August 2000) held full frame with a slow push. On "one vertical timber" the lattice sinks into
// shadow except a soft column of light down one upright, and a thin white line runs down that upright; on "cracked" a short jagged red
// seam opens along part of it (the one red mark in the case) and the push eases in on it. The photo is not altered; the marks sit on it.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];

/** leg: top and bottom of the upright in frame px (photo laid cover at 1920x1080); crack: fraction range along it */
export const BentLeg: React.FC<{ src: string; leg: [P, P]; crack: [number, number]; legAt: number; crackAt: number; s0?: number; s1?: number }> = ({ src, leg, crack, legAt, crackAt, s0 = 1.03, s1 = 1.1 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const [a, b] = leg;
  const at = (u: number): P => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const mid = at((crack[0] + crack[1]) / 2);
  const sink = io(interpolate(f, [legAt, legAt + 16], [0, 1], cl));
  const ul = out(interpolate(f, [legAt + 4, legAt + 26], [0, 1], cl));
  const uc = out(interpolate(f, [crackAt, crackAt + 12], [0, 1], cl));
  const s = s0 + (s1 - s0) * io(f / dur) + 0.22 * io(interpolate(f, [crackAt, dur], [0, 1], cl));
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  // jagged seam: zig-zag around the leg between crack[0] and crack[1]
  const n = 9, nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
  const seam = Array.from({ length: n + 1 }, (_, i) => { const p = at(crack[0] + (crack[1] - crack[0]) * (i / n)); const j = (i % 2 ? 1 : -1) * (3 + (i % 3) * 2); return `${i ? "L" : "M"}${p[0] + nx * j},${p[1] + ny * j}`; }).join(" ");
  const seamLen = L * (crack[1] - crack[0]) * 1.4;
  const ang = Math.atan2(b[0] - a[0], b[1] - a[1]) * -180 / Math.PI;
  const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${(mid[0] / 1920) * 100}% ${(mid[1] / 1080) * 100}%`, willChange: "transform" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* the lattice sinks into shadow except a soft column down the leg */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: sink }}>
          <defs>
            <filter id="am07bl"><feGaussianBlur stdDeviation="28" /></filter>
            <mask id="am07blm"><rect width={1920} height={1080} fill="#fff" /><rect x={cx - 55} y={cy - L / 2 - 40} width={110} height={L + 80} fill="#000" filter="url(#am07bl)" transform={`rotate(${ang} ${cx} ${cy})`} /></mask>
          </defs>
          <rect width={1920} height={1080} fill="rgba(3,4,6,.74)" mask="url(#am07blm)" />
        </svg>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {ul > 0 && <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * ul} y2={a[1] + (b[1] - a[1]) * ul} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={1 - 0.5 * uc} style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,.9))" }} />}
          {uc > 0 && <path d={seam} fill="none" stroke={RED} strokeWidth={5} strokeLinejoin="miter" strokeDasharray={`${seamLen} ${seamLen}`} strokeDashoffset={seamLen * (1 - uc)} style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,.9))" }} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
