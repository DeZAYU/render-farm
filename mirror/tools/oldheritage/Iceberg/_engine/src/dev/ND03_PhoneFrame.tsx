// ND03 PhoneFrame: the hiker's vertical phone recording in a clean rounded white frame (no fake UI), centred over a bright blurred copy
// of itself, a slow 3-D sway (the frame turns a few degrees as the camera breathes); optional red place label under the frame.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const PhoneFrame: React.FC<{ src: string; from: number; ar?: number; sway?: number; label?: string; labelAt?: number; labelHold?: number; zoom?: [number, number] }> = ({ src, from, ar = 608 / 1080, sway = 1, label, labelAt = 12, labelHold = 100, zoom = [1, 1.04] }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(Math.min(1, f / Math.max(1, durationInFrames - 1)));
  const H = 960, W = H * ar;
  const ry = sway * (-5 + 10 * u), rx = sway * 2 * Math.sin(f / 90);
  const z = zoom[0] + (zoom[1] - zoom[0]) * u;
  const v = (st: React.CSSProperties) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {v({ position: "absolute", inset: -80, width: width + 160, height: height + 160, objectFit: "cover", filter: "blur(34px) brightness(.72) saturate(.9)", transform: `scale(${1.1 + 0.03 * u})` })}
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left: width / 2 - W / 2, top: (height - H) / 2 - (label ? 20 : 0), width: W, height: H, borderRadius: 34, border: "6px solid #fff", overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,.6)", transform: `rotateY(${ry}deg) rotateX(${rx}deg) scale(${z})`, background: "#111" }}>
          {v({ width: "100%", height: "100%", objectFit: "cover" })}
        </div>
      </AbsoluteFill>
      {label && <RedLabel text={label} at={labelAt} hold={labelHold} x={0.5} y={0.955} size={38} />}
    </AbsoluteFill>
  );
};
