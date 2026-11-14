// TP16 SkySlices: how long they were up there, told by the footage's own sky. The frame is cut into tall vertical slices; each slice is
// the filmer's clip at a later moment (day -> dusk -> blue lights, in time order), and they slide in left to right one after another,
// so the picture darkens across the screen. A thin white rail along the bottom runs from "BEFORE 6 PM" (left) to "9:45 PM" (right), its red
// fill following the slices; the span lands as a red label at the end. (No clock face: the video's other cases use clock dials.)
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const SkySlices: React.FC<{ bg: string; frames: number[]; run: [number, number]; from: string; to: string; label: string; labelAt: number; pos?: string }> = ({ bg, frames, run, from, to, label, labelAt, pos = "50% 40%" }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const n = frames.length, sw = width / n, d = io(f / durationInFrames);
  const railY = height * 0.8, x0 = width * 0.12, x1 = width * 0.88;
  const fill = io(interpolate(f, [run[0], run[1]], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {frames.map((s, i) => {
        const a = run[0] + ((run[1] - run[0]) * i) / n, k = out(interpolate(f, [a, a + 14], [0, 1], cl));
        if (k <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: i * sw, top: 0, width: sw + 1, height, overflow: "hidden", opacity: k, transform: `translateY(${(1 - k) * 40}px)` }}>
            {/* every slice shows the same framing of the full picture, so the tower lines up across the cuts */}
            <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(s * 30)} muted style={{ position: "absolute", left: -i * sw, top: 0, width, height, objectFit: "cover", objectPosition: pos,
              transform: `scale(${1.04 + 0.04 * d})`, filter: "brightness(.78)" }} />
          </div>
        );
      })}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {frames.slice(1).map((_, i) => <line key={i} x1={(i + 1) * sw} y1={0} x2={(i + 1) * sw} y2={height} stroke="rgba(255,255,255,.85)" strokeWidth={4} opacity={out(interpolate(f, [run[0] + ((run[1] - run[0]) * (i + 1)) / n, run[0] + ((run[1] - run[0]) * (i + 1)) / n + 10], [0, 1], cl))} />)}
        <rect x={0} y={railY - 70} width={width} height={height - railY + 70} fill="url(#g)" />
        <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".75" /></linearGradient></defs>
        <line x1={x0} y1={railY} x2={x1} y2={railY} stroke="#fff" strokeWidth={4} opacity={0.85} />
        <line x1={x0} y1={railY} x2={x0 + (x1 - x0) * fill} y2={railY} stroke={RED} strokeWidth={12} />
        {[x0, x1].map((x, i) => <line key={i} x1={x} y1={railY - 22} x2={x} y2={railY + 22} stroke="#fff" strokeWidth={5} />)}
        <text x={x0} y={railY + 62} fill="#fff" fontFamily="ArchivoBlk" fontWeight={800} fontSize={36} textAnchor="middle">{from}</text>
        <text x={x1} y={railY + 62} fill="#fff" fontFamily="ArchivoBlk" fontWeight={800} fontSize={36} textAnchor="middle" opacity={fill > 0.98 ? 1 : 0.35}>{to}</text>
      </svg>
      <RedLabel text={label} at={labelAt} x={0.5} y={(railY - 70) / height} size={50} />
    </AbsoluteFill>
  );
};
