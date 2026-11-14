// TP21 | RoundCut: a second filmer's clip of the SAME fire as a white-ringed round cutaway in the corner, over the main clip
// (passed as children). The ring draws itself on, the disc pops in with an ease, the clip inside is reframed (zoom + focus) so the
// low-res source fills the circle; it leaves with a short fade. Used for the cut sheet's "small round icon in the corner" cue.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);

export const RoundCut: React.FC<{
  src: string; from: number; iw: number; ih: number; // the cutaway clip (file px)
  d?: number; cx?: number; cy?: number;               // disc diameter + centre (screen px)
  zoom?: number; fx?: number; fy?: number;            // reframe inside the disc: zoom over "cover", focus point 0..1 in the clip
  inAt?: number; look?: string; children?: React.ReactNode;
}> = ({ src, from, iw, ih, d = 420, cx = 1590, cy = 740, zoom = 1.15, fx = 0.5, fy = 0.4, inAt = 4, look, children }) => {
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  const k = out(interpolate(f, [inAt, inAt + 14], [0, 1], cl));
  const ring = io(interpolate(f, [inAt, inAt + 18], [0, 1], cl));
  const o = interpolate(f, [n - 9, n - 1], [1, 0], cl);
  const drift = io(f / n);
  // "cover" the disc, then zoom; place the focus point at the disc centre (clamped so no edge shows)
  const base = Math.max(d / iw, d / ih) * (zoom + 0.05 * drift);
  const vw = iw * base, vh = ih * base;
  const left = Math.min(0, Math.max(d - vw, d / 2 - fx * vw)), top = Math.min(0, Math.max(d - vh, d / 2 - fy * vh));
  const R = d / 2 + 3, C = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      {children}
      <div style={{ position: "absolute", left: cx - d / 2, top: cy - d / 2, width: d, height: d, opacity: o * Math.min(1, k * 1.4),
        transform: `scale(${0.72 + 0.28 * k})`, filter: "drop-shadow(0 18px 40px rgba(0,0,0,.6))" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "#000" }}>
          <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted
            style={{ position: "absolute", left, top, width: vw, height: vh, maxWidth: "none", filter: look }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 40px rgba(0,0,0,.45)" }} />
        </div>
        <svg width={d + 20} height={d + 20} style={{ position: "absolute", left: -10, top: -10, overflow: "visible" }}>
          <circle cx={d / 2 + 10} cy={d / 2 + 10} r={R} fill="none" stroke="#fff" strokeWidth={6}
            strokeDasharray={C} strokeDashoffset={C * (1 - ring)} transform={`rotate(-90 ${d / 2 + 10} ${d / 2 + 10})`} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
