// TP12 | ShellWipe: "fabric over a frame". Two freezes from the SAME fairgoer's camera, minutes apart: the clothed figure with the first
// flames at his collar, and the bare steel frame he was built on. Both are scaled/offset so the figure lines up, in one white-framed
// portrait panel; a white line burns DOWN the figure (head first, like the fire), revealing the frame below it.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Al = { s: number; dx: number; dy: number }; // scale about the panel centre + offset (panel px)

export const ShellWipe: React.FC<{ a: string; b: string; iw: number; ih: number; alA: Al; alB: Al; at: number; len: number; y0?: number; y1?: number }> = ({ a, b, iw, ih, alA, alB, at, len, y0 = 0.08, y1 = 0.92 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const H = 980, W = (H * iw) / ih;
  const w = io(interpolate(f, [at, at + len], [0, 1], cl));
  const yl = H * (y0 + (y1 - y0) * w);
  const z = 1 + 0.05 * io(f / durationInFrames);
  const img = (src: string, al: Al): React.CSSProperties => ({ position: "absolute", left: (W - W * al.s) / 2 + al.dx, top: (H - H * al.s) / 2 + al.dy, width: W * al.s, height: H * al.s, maxWidth: "none" });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(b)} style={{ position: "absolute", inset: -80, width: width + 160, height: height + 160, objectFit: "cover", filter: "blur(28px) brightness(.4)" }} />
      <div style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2, width: W, height: H, border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.65)", overflow: "hidden", transform: `scale(${z})` }}>
        <Img src={staticFile(b)} style={img(b, alB)} />
        <div style={{ position: "absolute", left: 0, right: 0, top: w > 0 ? yl : 0, bottom: 0, overflow: "hidden" }}>
          <Img src={staticFile(a)} style={{ ...img(a, alA), top: (H - H * alA.s) / 2 + alA.dy - (w > 0 ? yl : 0) }} />
        </div>
        {w > 0 && w < 1 && <div style={{ position: "absolute", left: 0, right: 0, top: yl - 3, height: 6, background: "#fff", boxShadow: "0 0 16px rgba(0,0,0,.7)" }} />}
      </div>
    </AbsoluteFill>
  );
};
