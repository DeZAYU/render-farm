// TP01 StepStrip: the lowering, as frames pulled from the vertical phone clip at successive moments, laid side by side on a tilted 2.5-D
// strip (each lands with a clank); then a white line joins the capsule in each frame, stepping down. px = source pixels of each frame.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export const StepStrip: React.FC<{ bg: string; bgFrom: number; frames: { src: string; cap: [number, number] }[]; iw: number; ih: number; at: number; every: number; lineAt: number }> = ({ bg, bgFrom, frames, iw, ih, at, every, lineAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const n = frames.length, gap = 30, pw = Math.min(330, (width - 140 - gap * (n - 1)) / n), ph = pw * ih / iw, k = pw / iw;
  const x0 = (width - (n * pw + (n - 1) * gap)) / 2, y0 = (height - ph) / 2;
  const t = io(f / durationInFrames);
  const ry = 9 - 14 * t, sc = 0.96 + 0.05 * t;
  const pts = frames.map((fr, i) => [x0 + i * (pw + gap) + fr.cap[0] * k, y0 + fr.cap[1] * k]);
  const g = io(interpolate(f, [lineAt, lineAt + 26], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.4) saturate(.8)" }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <AbsoluteFill style={{ transform: `rotateY(${ry}deg) scale(${sc})`, transformStyle: "preserve-3d" }}>
          {frames.map((fr, i) => {
            const a = out(interpolate(f, [at + i * every, at + i * every + 12], [0, 1], cl));
            return <div key={i} style={{ position: "absolute", left: x0 + i * (pw + gap), top: y0 + (1 - a) * 60, width: pw, height: ph, opacity: a, border: "5px solid #fff", boxSizing: "content-box", marginLeft: -5, marginTop: -5, boxShadow: "0 22px 50px rgba(0,0,0,.6)", overflow: "hidden" }}>
              <Img src={staticFile(fr.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>;
          })}
          <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
            <path d={"M" + pts.map((p) => p.join(" ")).join(" L")} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={12} pathLength={1} strokeDasharray={`${g} 1`} strokeLinejoin="round" />
            <path d={"M" + pts.map((p) => p.join(" ")).join(" L")} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinejoin="round" />
            {pts.map((p, i) => g * (n - 1) >= i - 0.01 && <circle key={i} cx={p[0]} cy={p[1]} r={8} fill="#fff" stroke="rgba(0,0,0,.5)" strokeWidth={3} />)}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
