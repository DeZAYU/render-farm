// ND01 HistoryStack: the coast's earlier tsunamis as real photographs standing in depth (white-framed prints, lit, on a dark blurred
// copy); the camera dollies through them one by one, each print landing on its spoken year with its red place/year label.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const HistoryStack: React.FC<{ prints: { src: string; ar: number; label: string; at: number; rot?: number; x?: number }[] }> = ({ prints }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const GAP = 1400; // world depth between prints
  // camera depth: arrives at print i (sits 0 in front of it) on its word, eased between, with a slow creep
  let z = -GAP * 0.6;
  prints.forEach((p, i) => { const k = io(interpolate(f, [p.at - 26, p.at + 4], [0, 1], cl)); const from = i === 0 ? -GAP * 0.6 : (i - 1) * GAP; if (k > 0) z = from + (i * GAP - from) * k; });
  z += f * 3.2;
  const cur = prints.reduce((a, p, i) => (f >= p.at - 13 ? i : a), 0);
  return (
    <AbsoluteFill style={{ background: "#070707", overflow: "hidden" }}>
      <Img src={staticFile(prints[cur].src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.3) grayscale(.6)" }} />
      <AbsoluteFill style={{ perspective: 1100, perspectiveOrigin: "50% 46%" }}>
        {prints.map((p, i) => ({ p, i })).reverse().map(({ p, i }) => {
          const d = i * GAP - z; // distance in front of the camera
          if (d < -500 || d > GAP * 2.2) return null;
          const o = interpolate(d, [-500, -250, 0, GAP * 1.6, GAP * 2.2], [0, 1, 1, 0.55, 0], cl);
          const W = 1180, H = W / p.ar;
          return (
            <div key={i} style={{ position: "absolute", left: width / 2 - W / 2 + (p.x ?? 0), top: height * 0.46 - H / 2, width: W, height: H, opacity: o,
              transform: `translateZ(${-d}px) rotateY(${p.rot ?? 0}deg)`, border: "6px solid #fff", boxShadow: "0 30px 80px rgba(0,0,0,.75)", overflow: "hidden", background: "#111" }}>
              <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(.15) contrast(1.05)" }} />
              {/* light pool drifting across the print */}
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 70% at ${40 + 20 * Math.sin((f + i * 40) / 70)}% 35%, rgba(255,244,225,.16) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,.38) 100%)` }} />
            </div>
          );
        })}
      </AbsoluteFill>
      {prints.map((p, i) => <RedLabel key={i} text={p.label} at={p.at + 2} hold={(prints[i + 1]?.at ?? 99999) - p.at - 16} x={0.5} y={0.9} size={42} />)}
    </AbsoluteFill>
  );
};
