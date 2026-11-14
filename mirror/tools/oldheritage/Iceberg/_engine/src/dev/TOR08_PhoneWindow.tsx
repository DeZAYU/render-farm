// TOR08 | PhoneWindow: the vertical phone footage from the Lužice window, kept vertical and whole: the clip stands in a clean white
// frame at full height, turned a few degrees in 3-D and drifting slowly back to square, over a BRIGHT blurred copy of itself (no dark
// side bars). An optional eased push into a point of the clip (s0 -> s1 around fx/fy) keeps it moving on the words.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const io = Easing.bezier(0.45, 0, 0.2, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const PhoneWindow: React.FC<{ src: string; from: number; ar?: number; s0?: number; s1?: number; fx?: number; fy?: number; turn?: number }> = ({ src, from, ar = 592 / 1080, s0 = 1.0, s1 = 1.06, fx = 0.5, fy = 0.5, turn = 6 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / Math.max(1, durationInFrames - 1));
  const H = height * 0.94, W = H * ar;
  const s = s0 + (s1 - s0) * u;
  const k = interpolate(f, [0, 6], [0.97, 1], cl);
  const vid = (st: React.CSSProperties) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} />;
  return (
    <AbsoluteFill style={{ background: "#222", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(38px) brightness(1.35) contrast(.85) saturate(1.05)", transform: `scale(${1.35 + 0.05 * u})` }}>{vid({ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%" })}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,0,0,.25) 0%, rgba(0,0,0,0) 70%)" }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2, width: W, height: H, border: "6px solid #fff", overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,.55)", transform: `rotateY(${turn * (1 - u)}deg) scale(${k})`, background: "#000" }}>
          <div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>{vid({ width: "100%", height: "100%", objectFit: "cover" })}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// PhoneEcho (3 Nov): the same vertical window clip twice in depth: a few seconds earlier set back, smaller and dimmed on the left,
// the later moment in front on the right, overlapping it; the front frame slides out from behind the back one and the pair turns
// square, over one bright blurred copy. Reads as "the same street, minutes apart" without a split screen.
export const PhoneEcho: React.FC<{ src: string; fromBack: number; fromFront: number; ar?: number }> = ({ src, fromBack, fromFront, ar = 592 / 1080 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / Math.max(1, durationInFrames - 1));
  const slide = interpolate(f, [0, 22], [0, 1], { ...cl, easing: io });
  const H = height * 0.86, W = H * ar;
  const vid = (from: number, st: React.CSSProperties) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} />;
  const frame = (from: number, x: number, sc: number, dim: number, rot: number, z: number) => (
    <div style={{ position: "absolute", left: width / 2 - W / 2 + x, top: (height - H) / 2, width: W, height: H, zIndex: z,
      transform: `rotateY(${rot}deg) scale(${sc})`, border: "6px solid #fff", overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.6)", background: "#000" }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${1.02 + 0.05 * u})`, filter: `brightness(${dim})` }}>{vid(from, { width: "100%", height: "100%", objectFit: "cover" })}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#222", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(40px) brightness(1.3) contrast(.85)", transform: `scale(${1.35 + 0.05 * u})` }}>{vid(fromFront, { width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" })}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,0,0,.28) 0%, rgba(0,0,0,0) 70%)" }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        {frame(fromBack, -60 - 170 * slide, 0.84, 0.62, 10 * (1 - u) + 4, 1)}
        {frame(fromFront, 40 + 170 * slide, 1.0, 1.0, -6 * (1 - u), 2)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
