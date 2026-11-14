// TP06 WalkwayTrace — the guest's frame of the lift hill freezes; white corner brackets take the stopped train, then a white line runs
// up the maintenance walkway beside the lift (the route staff used to reach the riders), ending on the deck at the top.
// Points are fractions of the source frame, measured on the frozen frame.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const WalkwayTrace: React.FC<{ src: string; from: number; freezeAt: number; box: [number, number, number, number]; path: [number, number][]; traceAt: number; traceLen: number; focus: [number, number] }> = ({ src, from, freezeAt, box, path, traceAt, traceLen, focus }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const s = 1.05 + 0.35 * io(interpolate(f, [freezeAt, durationInFrames], [0, 1], cl));
  const T = (x: number, y: number): [number, number] => [(focus[0] + (x - focus[0]) * s) * width, (focus[1] + (y - focus[1]) * s) * height];
  const b = out(interpolate(f, [freezeAt + 2, freezeAt + 18], [0, 1], cl));
  const g = io(interpolate(f, [traceAt, traceAt + traceLen], [0, 1], cl));
  const [bx, by, bw, bh] = box;
  const [x0, y0] = T(bx - bw / 2, by - bh / 2), [x1, y1] = T(bx + bw / 2, by + bh / 2);
  const L = 40 + 30 * (1 - b);
  const d = "M" + path.map(([x, y]) => T(x, y).join(" ")).join(" L");
  const vid = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  const c = (x: number, y: number, sx: number, sy: number, k: number) => <path key={k} d={`M${x + sx * L} ${y} L${x} ${y} L${x} ${y + sy * L}`} fill="none" stroke="#fff" strokeWidth={6} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%` }}>
        {f < freezeAt ? vid : <Freeze frame={freezeAt}>{vid}</Freeze>}
      </AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
        <g opacity={b}>{c(x0, y0, 1, 1, 0)}{c(x1, y0, -1, 1, 1)}{c(x0, y1, 1, -1, 2)}{c(x1, y1, -1, -1, 3)}</g>
        {g > 0 && <>
          <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={12} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        </>}
      </svg>
    </AbsoluteFill>
  );
};
