// WP17 DoorWatch — "Look at the doorway.": the indoor CSB camera, full frame, frozen while everything but the doorway at the end of the
// hall sinks into shadow and white corner brackets close on the opening; then the picture runs on and the fireball fills the doorway
// inside the brackets; as its light floods the hall the shadow lifts, the brackets fade and the frame eases in. Used once.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FrameAt, cl, io, out } from "./WP01_kit";

/** box: the doorway [x0, y0, x1, y1] in display coords (0..1); t0: source second (frozen, then plays from); hold: frozen frames;
 *  flood: frame (of this shot) when the fireball's light floods the hall */
export const WP17_DoorWatch: React.FC<{ src: string; t0: number; n: number; hold: number; flood: number; box: [number, number, number, number] }> = ({ src, t0, n, hold, flood, box }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const [x0, y0, x1, y1] = box;
  const dimIn = out(interpolate(f, [2, 24], [0, 1], cl));
  const lift = io(interpolate(f, [flood, flood + 22], [0, 1], cl));
  const dim = 0.72 * dimIn * (1 - 0.8 * lift);
  const b = out(interpolate(f, [10, 26], [0, 1], cl)) * (1 - interpolate(f, [flood + 6, flood + 22], [0, 1], cl));
  const pad = 70 * (1 - out(interpolate(f, [10, 30], [0, 1], cl)));
  const s = 1 + 0.035 * io(interpolate(f, [0, hold], [0, 1], cl)) + 0.09 * io(interpolate(f, [hold, n], [0, 1], cl));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  const X0 = x0 * W - pad, Y0 = y0 * H - pad, X1 = x1 * W + pad, Y1 = y1 * H + pad, L = 46;
  const d = `M${X0},${Y0 + L} V${Y0} H${X0 + L} M${X1 - L},${Y0} H${X1} V${Y0 + L} M${X1},${Y1 - L} V${Y1} H${X1 - L} M${X0 + L},${Y1} H${X0} V${Y1 - L}`;
  // shadow outside the doorway: four rects + a feathered edge (box-shadow inset on a transparent hole)
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${cx * 100}% ${cy * 100}%`, willChange: "transform" }}>
        <Sequence durationInFrames={hold} layout="none"><AbsoluteFill><FrameAt src={src} t={t0} style={st} /></AbsoluteFill></Sequence>
        <Sequence from={hold} layout="none"><AbsoluteFill><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t0 * 30)} muted style={st} /></AbsoluteFill></Sequence>
        <div style={{ position: "absolute", left: x0 * W, top: y0 * H, width: (x1 - x0) * W, height: (y1 - y0) * H, borderRadius: 18,
          boxShadow: `0 0 0 3000px rgba(0,0,0,${dim}), inset 0 0 60px 30px rgba(0,0,0,${dim * 0.55})` }} />
        {b > 0 && (
          <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: b }}>
            <path d={d} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="square" style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.7))" }} />
          </svg>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
