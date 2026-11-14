// TOR04 | PeelReveal: an aerial of a site before the tornado lies on top as a printed sheet; it lifts off in 3-D from one
// corner (rotating about a diagonal hinge, shadow under it) and slides away, leaving the same ground photographed after.
// A white box is drawn round the building the line is about, and the red label names it. px = image pixels (iw x ih).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const PeelReveal: React.FC<{ before: string; after: string; iw: number; ih: number; focus: [number, number]; spot: [number, number, number, number];
  peelAt: number; peelLen?: number; z0?: number; z1?: number; label?: string; labelAt?: number; boxAt?: number }> = ({ before, after, iw, ih, focus, spot, peelAt, peelLen = 30, z0 = 1.6, z1 = 1.8, label, labelAt, boxAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  const st: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base };
  const p = io(interpolate(f, [peelAt, peelAt + peelLen], [0, 1], cl));
  const bA = boxAt ?? peelAt + peelLen - 4;
  const g = out(interpolate(f, [bA, bA + 14], [0, 1], cl));
  const bx = ox + spot[0] * base, by = oy + spot[1] * base, bw = (spot[2] - spot[0]) * base, bh = (spot[3] - spot[1]) * base, P = 2 * (bw + bh);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(after)} style={st} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }} />
      </svg>
      {p < 1 && (
        <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "0% 0%" }}>
          <AbsoluteFill style={{ transformOrigin: "0% 0%", transform: `rotate3d(1, -1, 0, ${-115 * p}deg) translate3d(${-260 * p}px, ${-140 * p}px, ${120 * p}px)`,
            boxShadow: `0 ${40 * p}px ${90 * p}px rgba(0,0,0,${0.75 * Math.sin(Math.PI * p)})`, overflow: "hidden", opacity: 1 - Math.max(0, (p - 0.8) / 0.2) }}>
            <Img src={staticFile(before)} style={st} />
            <AbsoluteFill style={{ background: `linear-gradient(135deg, rgba(255,255,255,${0.18 * p}) 0%, rgba(0,0,0,${0.35 * p}) 100%)` }} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {label && <RedLabel text={label} at={labelAt ?? bA + 10} x={Math.min(0.8, Math.max(0.2, (bx + bw / 2) / width))} y={Math.min(0.92, (by + bh + 44) / height)} />}
    </AbsoluteFill>
  );
};
