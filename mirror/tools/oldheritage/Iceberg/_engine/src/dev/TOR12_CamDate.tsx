// TOR12 CamDate: the camcorder's own burned-in date ("03 13 90") is the date card. The clip plays; on the spoken date a white
// bracket draws round the stamp and the camera glides into it (eased), holds, then glides back out for the place label.
// box = stamp in SOURCE px (cover-fit into 1920x1080).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const CamDate: React.FC<{ src: string; from: number; sw: number; sh: number; box: [number, number, number, number];
  inAt: number; outAt: number; zoom?: number; date: string; place?: string; placeAt?: number }> = ({ src, from, sw, sh, box, inAt, outAt, zoom = 2.3, date, place, placeAt }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const k = Math.max(width / sw, height / sh), ox = (width - sw * k) / 2, oy = (height - sh * k) / 2;
  const bx = ox + box[0] * k, by = oy + box[1] * k, bw = (box[2] - box[0]) * k, bh = (box[3] - box[1]) * k;
  const cx = bx + bw / 2, cy = by + bh / 2;
  const zin = io(interpolate(f, [inAt, inAt + 24], [0, 1], cl)), zout = io(interpolate(f, [outAt, outAt + 22], [0, 1], cl));
  const z = 1.03 + (zoom - 1.03) * zin * (1 - zout) + 0.03 * (f / 300);
  // pivot the zoom so the stamp drifts to frame centre-left while zoomed
  let tx = (width * 0.5 - cx) * zin * (1 - zout), ty = (height * 0.5 - cy) * zin * (1 - zout);
  // keep the scaled layer covering the frame (no black reveal at the edges)
  tx = Math.min(cx * (z - 1), Math.max(-(width - cx) * (z - 1), tx)); ty = Math.min(cy * (z - 1), Math.max(-(height - cy) * (z - 1), ty));
  const g = out(interpolate(f, [inAt + 6, inAt + 22], [0, 1], cl)) * (1 - interpolate(f, [outAt - 4, outAt + 6], [0, 1], cl));
  const pad = 14, P = 2 * (bw + bh + 4 * pad);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale3d(${z.toFixed(4)}, ${z.toFixed(4)}, 1)`, transformOrigin: `${cx}px ${cy}px`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {g > 0 && <rect x={bx - pad} y={by - pad} width={bw + 2 * pad} height={bh + 2 * pad} fill="none" stroke="#fff" strokeWidth={5 / Math.max(1, z * 0.75)}
            strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }} />}
        </svg>
      </AbsoluteFill>
      {/* the zoomed stamp is low-res VHS: a soft vignette keeps the eye on it */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,${(0.45 * zin * (1 - zout)).toFixed(3)}) 100%)` }} />
      <RedLabel text={date} at={inAt + 18} hold={outAt - inAt - 18} x={0.5} y={0.16} />
      {place && <RedLabel text={place} at={placeAt ?? outAt + 16} x={0.5} y={0.88} />}
    </AbsoluteFill>
  );
};
