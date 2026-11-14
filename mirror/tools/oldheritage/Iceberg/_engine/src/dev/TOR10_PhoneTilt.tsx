// TOR10 PhoneTilt: the witness's vertical phone clip kept vertical: a clean white-framed phone panel turning slowly in 3-D
// (eased yaw, a hair of pitch) over a soft, darkened, blurred copy of the same clip; the panel casts a shadow on the backdrop.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.55, 1);
export const PhoneTilt: React.FC<{ src: string; from: number; yaw?: [number, number]; pitch?: [number, number]; h?: number; x?: number; zoom?: [number, number] }> = ({ src, from, yaw = [-9, 7], pitch = [3, -2], h = 1000, x = 0.5, zoom = [1.0, 1.05] }) => {
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  const u = io(f / Math.max(1, n - 1));
  const ry = yaw[0] + (yaw[1] - yaw[0]) * u, rx = pitch[0] + (pitch[1] - pitch[0]) * u, z = zoom[0] + (zoom[1] - zoom[0]) * u;
  const H = h, W = (H * 240) / 426;
  const k = interpolate(f, [0, 10], [0.96, 1], cl);
  const vid = (st: React.CSSProperties) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(26px) brightness(.5) saturate(.85)", transform: `scale(${1.3 + 0.04 * u})` }}>{vid({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.55) 100%)" }} />
      <AbsoluteFill style={{ perspective: 1900 }}>
        <div style={{ position: "absolute", left: 1920 * x - W / 2, top: (1080 - H) / 2, width: W, height: H, transformStyle: "preserve-3d",
          transform: `rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg) scale(${(k * z).toFixed(4)})`,
          border: "6px solid #fff", borderRadius: 34, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.75), 0 0 0 1px rgba(0,0,0,.4)", background: "#000" }}>
          {vid({ width: "100%", height: "100%", objectFit: "cover" })}
          {/* a soft sheen moving across the glass as it turns */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${110 + ry * 2}deg, rgba(255,255,255,0) 35%, rgba(255,255,255,.07) 50%, rgba(255,255,255,0) 65%)` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
