// WP14 device: BoomPath. The street filmer's frame of the red crane jib over the burning frame, frozen full screen (the operator is
// a dark speck on the jib). A white line runs along the jib from where it enters the smoke out to him; the stretch from him to the
// jib's tip follows as a dashed line; then the frame eases in on him while everything but a soft pool around him dims.
// Positions are in the source frame's normalised coordinates (0..1), so the overlay moves with the push.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FrameAt, cl, io } from "./WP01_kit";

type P = [number, number];
export const BoomPath: React.FC<{ src: string; t: number; n: number; from: P; man: P; tip: P; at?: { line: number; dash: number; push: number } }> = ({ src, t, n, from, man, tip, at = { line: 6, dash: 40, push: 58 } }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const pu = io(interpolate(f, [at.push, n], [0, 1], cl));
  const s = 1.04 + 0.9 * pu + 0.02 * (f / n);
  const ox = 0.5 + (man[0] - 0.5) * pu, oy = 0.5 + (man[1] - 0.5) * pu; // transform origin glides to the man
  const l1 = io(interpolate(f, [at.line, at.dash], [0, 1], cl));
  const l2 = io(interpolate(f, [at.dash, at.dash + 16], [0, 1], cl));
  const dim = interpolate(f, [at.push, at.push + 20], [0, 1], cl);
  const lineFade = interpolate(f, [n - 18, n - 4], [1, 0.0], cl);
  const P = (p: P) => [p[0] * W, p[1] * H];
  const [ax, ay] = P(from), [mx, my] = P(man), [tx, ty] = P(tip);

  const spot = `radial-gradient(ellipse 9% 15% at ${man[0] * 100}% ${man[1] * 100}%, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.62 * dim}) 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${ox * 100}% ${oy * 100}%` }}>
        <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: spot }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: lineFade }}>
          <line x1={ax} y1={ay} x2={ax + (mx - ax) * l1} y2={ay + (my - ay) * l1} stroke="#fff" strokeWidth={5 / s} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,.8))" }} />
          {l2 > 0 && <line x1={mx} y1={my} x2={mx + (tx - mx) * l2} y2={my + (ty - my) * l2} stroke="#fff" strokeWidth={4 / s} strokeDasharray={`${14 / s} ${12 / s}`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,.8))" }} />}
          <circle cx={mx} cy={my} r={(10 + 6 * Math.sin(f / 6)) / s} fill="none" stroke="#fff" strokeWidth={3 / s} opacity={interpolate(f, [at.dash - 6, at.dash + 4], [0, 1], cl)} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
