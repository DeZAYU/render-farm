// TOR19 TwoViews: the same tornado from two cameras in the same minutes, side by side: the car on the Trans-Canada (Hughes) and a
// resident in Elie (Roque) with the houses under it. Two white-framed panels swing in on a shallow 3-D angle (facing each other), each with
// its red place label, over a dark blurred copy of the highway view.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);

type V = { src: string; from: number; pos?: string; label: string; ar: number };
export const TwoViews: React.FC<{ left: V; right: V; labelAt?: number }> = ({ left, right, labelAt = 10 }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames } = useVideoConfig();
  const k = (d: number) => out(interpolate(f, [d, d + 16], [0, 1], cl));
  const drift = io(f / durationInFrames);
  const PW = W * 0.43;
  const panel = (v: V, side: -1 | 1, delay: number) => {
    const g = k(delay), ph = PW / v.ar;
    const x = W / 2 + side * (W * 0.235) - PW / 2 + side * (1 - g) * 120;
    return (
      <div style={{ position: "absolute", left: x, top: H * 0.45 - ph / 2, width: PW, height: ph, opacity: g,
        transform: `perspective(1600px) rotateY(${(-side * (7 - 2 * drift)).toFixed(3)}deg) scale(${(0.96 + 0.04 * g).toFixed(4)})`, transformOrigin: side < 0 ? "100% 50%" : "0% 50%",
        border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.65)", overflow: "hidden", background: "#000" }}>
        <OffthreadVideo src={staticFile(v.src)} startFrom={Math.round(v.from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: v.pos ?? "50% 50%", transform: `scale(${1.02 + 0.05 * drift})` }} />
      </div>
    );
  };
  const lh = PW / Math.max(left.ar, right.ar);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(left.src)} startFrom={Math.round(left.from * 30)} muted style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(18px) brightness(.45)" }} />
      {panel(left, -1, 0)}
      {panel(right, 1, 5)}
      <RedLabel text={left.label} at={labelAt} x={0.5 - 0.235} y={(H * 0.45 + lh / 2 + 52) / H} size={36} />
      <RedLabel text={right.label} at={labelAt + 5} x={0.5 + 0.235} y={(H * 0.45 + lh / 2 + 52) / H} size={36} />
    </AbsoluteFill>
  );
};
