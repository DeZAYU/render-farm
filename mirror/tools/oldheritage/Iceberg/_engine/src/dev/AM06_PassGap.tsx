// AM06 PassGap: "Just as the trains swept past each other, something hit him in the right eye, and he didn't see what it was."
// A real photo of both Dueling Dragons trains in one frame (Fire on its red track, Ice on the blue, passing) held full frame with a slow
// push. On "swept past each other" thin white corner brackets close on each train; then a short white line draws across the open
// space between the two trains (the only place anything could have come from). On "something hit him" the picture sinks into shadow
// except a soft pool over that gap, and the push eases on into it. No text, no red, no invented object.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Box = [number, number, number, number]; // frame px (picture laid out cover at 1920x1080) x0 y0 x1 y1

const Brackets: React.FC<{ b: Box; u: number }> = ({ b: [x0, y0, x1, y1], u }) => {
  const L = 34, pad = (1 - u) * 40, o = u;
  const c = (x: number, y: number, dx: number, dy: number, k: string) => (
    <path key={k} d={`M${x + dx * L},${y} L${x},${y} L${x},${y + dy * L}`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="square" opacity={o} />
  );
  return <>{c(x0 - pad, y0 - pad, 1, 1, "a")}{c(x1 + pad, y0 - pad, -1, 1, "b")}{c(x0 - pad, y1 + pad, 1, -1, "c")}{c(x1 + pad, y1 + pad, -1, -1, "d")}</>;
};

export const PassGap: React.FC<{ src: string; a: Box; b: Box; gap: [[number, number], [number, number]]; bracketAt: number; lineAt: number; sinkAt: number; s0?: number; s1?: number }> = ({ src, a, b, gap, bracketAt, lineAt, sinkAt, s0 = 1.02, s1 = 1.16 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const mid: [number, number] = [(gap[0][0] + gap[1][0]) / 2, (gap[0][1] + gap[1][1]) / 2];
  const sink = io(interpolate(f, [sinkAt, sinkAt + 20], [0, 1], cl));
  const s = s0 + (s1 - s0) * io(f / dur) + 0.12 * io(interpolate(f, [sinkAt, dur], [0, 1], cl));
  const ub = out(interpolate(f, [bracketAt, bracketAt + 12], [0, 1], cl)) * (1 - 0.6 * sink);
  const ul = out(interpolate(f, [lineAt, lineAt + 16], [0, 1], cl));
  const len = Math.hypot(gap[1][0] - gap[0][0], gap[1][1] - gap[0][1]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${(mid[0] / 1920) * 100}% ${(mid[1] / 1080) * 100}%`, willChange: "transform" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ opacity: 0.78 * sink, background: `radial-gradient(circle 260px at ${mid[0]}px ${mid[1]}px, rgba(0,0,0,0) 35%, rgba(2,3,5,.92) 100%)` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {ub > 0 && <><Brackets b={a} u={ub} /><Brackets b={b} u={ub} /></>}
          {ul > 0 && <line x1={gap[0][0]} y1={gap[0][1]} x2={gap[1][0]} y2={gap[1][1]} stroke="#fff" strokeWidth={3} strokeLinecap="round"
            strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - ul)} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.8))" }} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
