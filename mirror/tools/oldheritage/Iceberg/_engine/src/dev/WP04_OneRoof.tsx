// WP04 device OneRoof: the parking-lot filmer's frame (mrfixitdusty) frozen full screen; a slow push toward the burning plant while a
// white line runs along the long, low building (roofline, end walls, silo), everything outside it dims, and the building is named
// with a RedLabel on "one building". Built for the beat "a lot of different chemicals pass through one building".
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { Still, cl, io } from "./WP45_kit";

// building outline in frame coordinates (0..1) of the 800x480 clip at src 6.0 s
const PATH: [number, number][] = [[0.06, 0.645], [0.06, 0.565], [0.30, 0.555], [0.52, 0.548], [0.72, 0.53], [0.80, 0.53], [0.80, 0.445], [0.845, 0.445], [0.845, 0.53], [0.995, 0.535], [0.995, 0.65]];

export const OneRoof: React.FC<{ src: string; t: number; n: number; traceAt: number; labelAt: number; label: string }> = ({ src, t, n, traceAt, labelAt, label }) => {
  const f = useCurrentFrame();
  const s = 1.0 + 0.1 * io(Math.min(1, f / n));
  const W = 1920, H = 1080;
  const pts = PATH.map(([x, y]) => [x * W, y * 1152 - 36]); // 5:3 source covered into 16:9 (36 px cropped top and bottom)
  const len = pts.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  const draw = io(interpolate(f, [traceAt, traceAt + 40], [0, 1], cl));
  const dim = io(interpolate(f, [traceAt + 20, traceAt + 50], [0, 1], cl));
  const d = "M" + pts.map((p) => p.join(",")).join(" L");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: "52% 56%" }}>
        <Still src={src} t={t} n={n} s0={1} s1={1} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <mask id="wp04roof">
              <rect width={W} height={H} fill="white" />
              <path d={d + " Z"} fill="black" />
            </mask>
          </defs>
          <rect width={W} height={H} fill="black" opacity={0.5 * dim} mask="url(#wp04roof)" />
          <path d={d} fill="none" stroke="white" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"
            strokeDasharray={len} strokeDashoffset={len * (1 - draw)} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.8))" }} />
        </svg>
      </AbsoluteFill>
      <RedLabel text={label} at={labelAt} y={0.84} size={44} />
    </AbsoluteFill>
  );
};
