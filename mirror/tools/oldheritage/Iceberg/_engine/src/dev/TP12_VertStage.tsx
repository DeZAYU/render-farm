// TP12 | VertStage: the fairgoer's VERTICAL phone shot (360x638) shown at a size it can hold: a white-framed portrait panel, turned a few
// degrees in 3-D and drifting, over its own blurred copy. Optional `detail`: a landscape white-framed magnifier of the SAME moment (same
// clip, same time, zoomed on a point: the head, the boots) on the other side, so the low-res figure and the detail read together.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const VertStage: React.FC<{
  src: string; from: number; iw?: number; ih?: number; x?: number; rot?: [number, number]; z?: [number, number];
  detail?: { fx: number; fy: number; zoom: number; at?: number }; fadeIn?: boolean;
}> = ({ src, from, iw = 720, ih = 1276, x = 0.5, rot = [-6, 2], z = [1.0, 1.04], detail, fadeIn = false }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(f / durationInFrames);
  const H = 960, W = (H * iw) / ih;
  const sc = z[0] + (z[1] - z[0]) * t, ry = rot[0] + (rot[1] - rot[0]) * t;
  const k = fadeIn ? out(interpolate(f, [0, 12], [0, 1], cl)) : 1;
  const st = Math.round(from * 30);
  const panelX = x * width - W / 2;
  const d = detail ? out(interpolate(f, [detail.at ?? 6, (detail.at ?? 6) + 14], [0, 1], cl)) : 0;
  const DW = 820, DH = 500, dx = x < 0.5 ? width * 0.73 - DW / 2 : width * 0.27 - DW / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={st} muted style={{ position: "absolute", inset: -80, width: width + 160, height: height + 160, objectFit: "cover", filter: "blur(26px) brightness(.45) saturate(.9)", transform: `scale(${1.05 + 0.04 * t})` }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left: panelX, top: (height - H) / 2, width: W, height: H, border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.65)", overflow: "hidden",
          transform: `rotateY(${ry}deg) scale(${sc * (0.96 + 0.04 * k)})`, opacity: k }}>
          <OffthreadVideo src={staticFile(src)} startFrom={st} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {detail && d > 0 && (
          <div style={{ position: "absolute", left: dx, top: (height - DH) / 2 - 20, width: DW, height: DH, border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.65)", overflow: "hidden",
            opacity: d, transform: `rotateY(${-ry * 0.6}deg) translateY(${(1 - d) * 24}px) scale(${0.95 + 0.05 * d})` }}>
            <OffthreadVideo src={staticFile(src)} startFrom={st} muted style={{ position: "absolute", width: DW * detail.zoom, height: (DW * detail.zoom * ih) / iw,
              left: DW / 2 - detail.fx * DW * detail.zoom, top: DH / 2 - detail.fy * ((DW * detail.zoom * ih) / iw), maxWidth: "none" }} />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
