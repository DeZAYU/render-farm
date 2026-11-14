// WP08 GateCams — three of the terminal's own security cameras, each on the second the blast reached it, as white-framed 4:3 panels in a
// shallow 3-D arc (outer panels turned in). Panels rise in one after another and play their own window; a window that ends holds its last
// frame. The blurred, darkened middle camera fills the back. Built for "the pressure wave damaged buildings around the terminal".
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Cam = { from: number; to: number };
const Vid: React.FC<{ src: string; cam: Cam; f: number; style: React.CSSProperties }> = ({ src, cam, f, style }) => {
  const len = Math.round((cam.to - cam.from) * 30);
  if (f < len) return <Freeze frame={f}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(cam.from * 30)} muted style={style} /></Freeze>;
  return <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(cam.from * 30) + len - 1} muted style={style} /></Freeze>;
};

export const WP08_GateCams: React.FC<{ src: string; cams: [Cam, Cam, Cam]; n: number; stagger?: number }> = ({ src, cams, n, stagger = 9 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const W = 624, H = 468, gap = 22;
  const push = 1.0 + 0.08 * io(f / n);
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(36px) brightness(0.32) saturate(0.8)", transform: "scale(1.2)" }}>
        <Vid src={src} cam={cams[1]} f={f} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: "50% 50%" }}>
        <AbsoluteFill style={{ transform: `scale3d(${push},${push},1)`, transformStyle: "preserve-3d" }}>
          {cams.map((c, i) => {
            const k = i - 1, a = f - i * stagger;
            const e = out(interpolate(a, [0, 16], [0, 1], cl));
            const x = width / 2 + k * (W + gap) - W / 2, y = height / 2 - H / 2 + (1 - e) * 60;
            const ry = -k * 13, tz = -Math.abs(k) * 40;
            if (a < 0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: W, height: H, opacity: e,
                transform: `translateZ(${tz}px) rotateY(${ry}deg)`, boxShadow: "0 18px 50px rgba(0,0,0,.7)", outline: "5px solid #fff", outlineOffset: 0, overflow: "hidden", background: "#000" }}>
                <Vid src={src} cam={c} f={Math.max(0, a)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
