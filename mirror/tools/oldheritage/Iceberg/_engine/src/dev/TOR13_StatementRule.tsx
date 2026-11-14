// TOR13 StatementRule: the real NWS statement (IEM archive capture) shown as the printed product it is: the page crop sits flat in a white
// frame over its own blurred copy, the camera drifts down it, and the lines that matter are ruled in red under the type as they are
// read (no chip-lift, no highlighter): a teletype-era treatment for a text product. Boxes in page px.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const StatementRule: React.FC<{ src: string; pw: number; ph: number; crop: [number, number, number, number]; rules: { box: [number, number, number, number]; at: number; len: number }[] }> = ({ src, pw, ph, crop, rules }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / Math.max(1, durationInFrames - 1)), inK = out(interpolate(f, [0, 12], [0, 1], cl));
  const W = width * 0.78, cw = crop[2] - crop[0], ch = crop[3] - crop[1], H = W * ch / cw;
  const s = W / cw, z = 1.0 + 0.07 * u, dy = -20 * u;
  const X0 = (width - W) / 2, Y0 = (height - H) / 2;
  return (
    <AbsoluteFill style={{ background: "#0b0b0b", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: -crop[0] * s * 1.3 + width * 0.05, top: -crop[1] * s * 1.3, width: pw * s * 1.3, height: ph * s * 1.3, filter: "blur(16px) brightness(.38)" }} />
      <div style={{ position: "absolute", left: X0, top: Y0, width: W, height: H, border: "6px solid #fff", boxShadow: "0 22px 60px rgba(0,0,0,.65)", overflow: "hidden", background: "#fff",
        transform: `translateY(${dy}px) scale(${z * (0.96 + 0.04 * inK)})`, opacity: inK }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: -crop[0] * s, top: -crop[1] * s, width: pw * s, height: ph * s }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {rules.map((r, i) => { const g = io(interpolate(f, [r.at, r.at + r.len], [0, 1], cl)); if (g <= 0) return null;
            const x0 = (r.box[0] - crop[0]) * s, x1 = (r.box[2] - crop[0]) * s, y = (r.box[3] - crop[1]) * s + 3;
            const dim = (r.box[3] - r.box[1]) * s;
            return <g key={i}>
              <rect x={x0 - 4} y={y - dim - 4} width={(x1 - x0 + 8) * g} height={dim + 6} fill="rgba(227,20,27,.08)" />
              <line x1={x0} y1={y} x2={x0 + (x1 - x0) * g} y2={y} stroke={RED} strokeWidth={5} strokeLinecap="round" />
            </g>; })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
