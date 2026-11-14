// TOR03 | TrackTilt: the NWS damage-path map (Newcastle -> Moore, EF-scale contours) laid on a plane in 3-D.
//   mode "glide":   the plane is tipped back (AE-style camera); the camera flies low along the track from its first contour to
//                   Moore, so the length of the path is felt, not printed.
//   mode "measure": the plane eases almost flat over the widest stretch of the outer contour and a white measuring bar is
//                   drawn straight across it (end ticks, then the measured width in a red label).
// px = pixels of the cropped map image (iw x ih).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];

const along = (pts: P[], u: number): P => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const tot = seg.reduce((a, b) => a + b, 0); let d = u * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = Math.min(1, d / seg[i]); return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; } d -= seg[i]; }
  return pts[pts.length - 1];
};

export const TrackTilt: React.FC<{ src: string; iw: number; ih: number; mode: "glide" | "measure"; path?: P[]; startLabel?: string; endLabel?: string;
  bar?: [P, P]; barAt?: number; barLabel?: string; zoom?: number }> = ({ src, iw, ih, mode, path = [], startLabel, endLabel, bar, barAt = 20, barLabel, zoom = 2.2 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / Math.max(1, durationInFrames - 1));
  let c: P, s: number, tilt: number, rz = 0;
  if (mode === "glide") {
    c = along(path, 0.03 + 0.62 * u); s = zoom; tilt = 50 - 6 * u; rz = 6 - 4 * u;
  } else {
    const m: P = [(bar![0][0] + bar![1][0]) / 2, (bar![0][1] + bar![1][1]) / 2];
    c = m; s = zoom * (0.9 + 0.12 * u); tilt = 28 - 22 * out(interpolate(f, [0, 40], [0, 1], cl)); rz = 3 - 3 * u;
  }
  const o = out(interpolate(f, [0, 10], [0, 1], cl));
  const g = out(interpolate(f, [barAt, barAt + 22], [0, 1], cl));
  const plane: React.CSSProperties = { position: "absolute", left: width / 2 - c[0] * s, top: height / 2 - c[1] * s, width: iw * s, height: ih * s, transformOrigin: `${c[0] * s}px ${c[1] * s}px` };
  return (
    <AbsoluteFill style={{ background: "#05070a", overflow: "hidden", opacity: o }}>
      <AbsoluteFill style={{ perspective: 1100, perspectiveOrigin: "50% 22%" }}>
        <div style={{ ...plane, transform: `rotateX(${tilt}deg) rotateZ(${rz}deg)`, transformStyle: "preserve-3d" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", filter: "saturate(.92) contrast(1.06) brightness(.92)" }} />
          {mode === "measure" && bar && (() => {
            const [a, b] = bar; const ax = a[0] * s, ay = a[1] * s, bx = b[0] * s, by = b[1] * s;
            const ex = ax + (bx - ax) * g, ey = ay + (by - ay) * g;
            const nx = (by - ay), ny = -(bx - ax), nl = Math.hypot(nx, ny), tx = (nx / nl) * 26, ty = (ny / nl) * 26;
            return (
              <svg width={iw * s} height={ih * s} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="rgba(0,0,0,.5)" strokeWidth={13} strokeLinecap="round" />
                <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
                <line x1={ax - tx} y1={ay - ty} x2={ax + tx} y2={ay + ty} stroke="#fff" strokeWidth={6} opacity={g > 0 ? 1 : 0} />
                {g > 0.97 && <line x1={bx - tx} y1={by - ty} x2={bx + tx} y2={by + ty} stroke="#fff" strokeWidth={6} />}
              </svg>
            );
          })()}
        </div>
      </AbsoluteFill>
      {/* top/bottom haze so the tipped plane reads as distance, not as an edge */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,10,.85) 0%, rgba(5,7,10,0) 26%, rgba(5,7,10,0) 82%, rgba(5,7,10,.55) 100%)" }} />
      {mode === "glide" && startLabel && <RedLabel text={startLabel} at={6} hold={Math.round(durationInFrames * 0.28)} x={0.5} y={0.86} size={40} />}
      {mode === "glide" && endLabel && <RedLabel text={endLabel} at={Math.round(durationInFrames * 0.62)} x={0.5} y={0.86} size={40} />}
      {mode === "measure" && barLabel && <RedLabel text={barLabel} at={barAt + 20} x={0.5} y={0.86} size={44} />}
    </AbsoluteFill>
  );
};
