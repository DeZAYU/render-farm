// TP01 TwoSystems: two white-framed pictures on one 3-D board (a coaster's wheel assembly wrapped round its rail; the slingshot's two cables),
// the camera trucks from the first to the second; on the second, its two cables are drawn in white. px = source pixels of the right picture.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
export const TwoSystems: React.FC<{ left: string; right: string; riw: number; rih: number; cables: [number, number][][]; moveAt: number; moveLen: number; traceAt: number; bg: string }> = ({ left, right, riw, rih, cables, moveAt, moveLen, traceAt, bg }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const m = io(interpolate(f, [moveAt, moveAt + moveLen], [0, 1], cl));
  const drift = f / durationInFrames;
  const W = 900, H = 600, sep = 520;
  const camX = sep - 2 * sep * m;           // board x offset: left picture centred -> right picture centred
  const ry = 16 - 32 * m + 2 * (drift - 0.5);
  const sc = 1.0 + 0.04 * drift;
  const g = io(interpolate(f, [traceAt, traceAt + 22], [0, 1], cl));
  const k = W / riw, kh = H / rih, kk = Math.max(k, kh);
  const offx = (W - riw * kk) / 2, offy = (H - rih * kk) / 2;
  const frame = (x: number, child: React.ReactNode, lit: number) => (
    <div style={{ position: "absolute", left: width / 2 + x - W / 2, top: height / 2 - H / 2 - 20, width: W, height: H, border: "6px solid #fff", boxShadow: "0 30px 70px rgba(0,0,0,.65)", overflow: "hidden", filter: `brightness(${0.55 + 0.45 * lit})` }}>{child}</div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(26px) brightness(.32)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transform: `translateX(${camX}px) rotateY(${ry}deg) scale(${sc})`, transformStyle: "preserve-3d" }}>
          {frame(-sep, <Img src={staticFile(left)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.05 * drift})` }} />, 1 - m)}
          {frame(sep, <>
            <Img src={staticFile(right)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              {cables.map((c, i) => { const d = "M" + c.map(([x, y]) => `${offx + x * kk} ${offy + y * kk}`).join(" L"); return <g key={i}>
                <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
                <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" /></g>; })}
            </svg></>, m)}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
