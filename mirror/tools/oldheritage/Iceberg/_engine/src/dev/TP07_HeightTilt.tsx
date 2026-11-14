// TP07 (Joker's Jinx) measurement pair, built for this case's two spoken figures:
//   HeightStaff  the stopped train on a real photo (the morning after, same spot): a measuring staff rises from the ground line to the
//                train's level with a tick every tenth, a dashed leader from the train to the staff top, then the red figure.
//   (a TiltGauge on the bucket camera was dropped: from below, the camera cannot show the train's pitch honestly.)
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const SH = "drop-shadow(0 2px 5px rgba(0,0,0,.7))";

/** px = image pixels of `src` (iw x ih). Inset photo in a white frame over its own blurred copy. */
export const HeightStaff: React.FC<{ src: string; iw: number; ih: number; staffX: number; groundY: number; topY: number; target: [number, number]; label: string; at?: number; box?: number }> = ({ src, iw, ih, staffX, groundY, topY, target, label, at = 8, box = 0.66 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 12], [0, 1], cl)), d = io(f / durationInFrames);
  const W = width * box, H = (W * ih) / iw, L = (width - W) / 2, T = (height - H) / 2 - 24;
  const rise = io(interpolate(f, [at, at + 26], [0, 1], cl));
  const lead = out(interpolate(f, [at + 22, at + 36], [0, 1], cl));
  const yTop = groundY + (topY - groundY) * rise;
  const ticks = Array.from({ length: 11 }, (_, i) => groundY + ((topY - groundY) * i) / 10);
  const z = 1 + 0.05 * d; // slow push inside the frame, about the train
  const sx = L + W / 2 + (staffX * (W / iw) - W / 2), sy = T + H / 2 + (topY * (H / ih) - H / 2);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(16px) brightness(.55)", transform: `scale(${1.05 + 0.04 * d})` }} />
      <div style={{ position: "absolute", left: L, top: T, width: W, height: H, border: "6px solid #fff", boxShadow: "0 18px 50px rgba(0,0,0,.6)", overflow: "hidden", transform: `scale(${0.94 + 0.06 * k})`, opacity: k }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: `${(target[0] / iw) * 100}% ${(target[1] / ih) * 100}%` }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
          <svg viewBox={`0 0 ${iw} ${ih}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: SH, overflow: "visible" }}>
            {rise > 0 && <line x1={staffX} y1={groundY} x2={staffX} y2={yTop} stroke="#fff" strokeWidth={5} vectorEffect="non-scaling-stroke" />}
            {ticks.map((y, i) => (rise > 0 && (groundY - y) <= (groundY - yTop) + 0.01 ? (
              <line key={i} x1={staffX - (i % 5 === 0 ? 9 : 5)} y1={y} x2={staffX + (i % 5 === 0 ? 9 : 5)} y2={y} stroke="#fff" strokeWidth={i % 5 === 0 ? 4 : 2.5} vectorEffect="non-scaling-stroke" />
            ) : null))}
            {lead > 0 && <line x1={target[0]} y1={topY} x2={target[0] + (staffX - target[0]) * lead} y2={topY} stroke="#fff" strokeWidth={3} strokeDasharray="10 8" vectorEffect="non-scaling-stroke" />}
            {lead > 0 && <circle cx={target[0]} cy={target[1]} r={7 * lead} fill="none" stroke="#fff" strokeWidth={3} vectorEffect="non-scaling-stroke" />}
          </svg>
        </div>
      </div>
      <RedLabel text={label} at={at + 30} x={Math.min(0.9, (sx + 24) / width + 0.06)} y={Math.max(0.08, sy / height)} size={44} />
    </AbsoluteFill>
  );
};

