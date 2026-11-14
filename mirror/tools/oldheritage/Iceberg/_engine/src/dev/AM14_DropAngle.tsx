// AM14 DropAngle: a real side-on photo of the New Texas Giant's lift and first drop (Martin Lewison, Aug 2013, CC BY-SA 2.0).
// A white line runs along the rail from the crest down the drop face; a straight tangent on the steep face and a dashed ground line
// meet, a thin arc closes between them and the angle (79°) types beside it in the channel's typewriter face. Then the frame sinks into
// shadow except a soft band round the drop face while the camera pushes in ("as close to a wall as I'd ever want to ride").
// Coordinates are fractions of the photo (iw x ih), the photo is laid out as one plane so the drawing sticks to it.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAmFonts } from "./AM_LevelEntry";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];

export const DropAngle: React.FC<{ src: string; iw: number; ih: number; rail: P[]; base: P; deg: number; len: number; focus: P;
  at?: { trace: number; angle: number; spot: number } }> = ({ src, iw, ih, rail, base, deg, len, focus, at = { trace: 0, angle: 12, spot: 70 } }) => {
  useAmFonts();
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  // plane: photo scaled to cover 1920x1080, camera push around the focus
  const k0 = Math.max(1920 / iw, 1080 / ih);
  const s = 1.03 + 0.13 * io(interpolate(f, [0, dur], [0, 1], cl));
  const W = iw * k0, H = ih * k0;
  const fx = focus[0] * W, fy = focus[1] * H;
  const left = (1920 - W) / 2, top = (1080 - H) / 2; // plane covers the frame; scaled about the focus (stays covered)
  const X = (p: P) => p[0] * W, Y = (p: P) => p[1] * H;
  // rail polyline length for the trace
  const pts = rail.map((p) => [X(p), Y(p)] as P);
  let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const tr = io(interpolate(f, [at.trace, at.trace + 30], [0, 1], cl));
  // tangent: from the base point up-left at `deg` to the ground (screen px)
  const r = (deg * Math.PI) / 180, bx = X(base), by = Y(base);
  const tx = bx - Math.cos(r) * len, ty = by - Math.sin(r) * len;
  const a1 = out(interpolate(f, [at.angle, at.angle + 16], [0, 1], cl));
  const a2 = out(interpolate(f, [at.angle + 8, at.angle + 24], [0, 1], cl));
  const R = 190, arcEnd: P = [bx - Math.cos(r) * R, by - Math.sin(r) * R];
  const arcLen = (R * r);
  const txt = out(interpolate(f, [at.angle + 14, at.angle + 26], [0, 1], cl));
  const mid = r / 2, lx = bx - Math.cos(mid) * (R + 70), ly = by - Math.sin(mid) * (R + 70);
  const spot = io(interpolate(f, [at.spot, at.spot + 30], [0, 1], cl));
  const sx = left + fx, sy = top + fy;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top, width: W, height: H, transform: `scale(${s})`, transformOrigin: `${fx}px ${fy}px` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: W, height: H }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs><filter id="dsh"><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#000" floodOpacity="0.7" /></filter></defs>
          <g filter="url(#dsh)" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
            <polyline points={pts.map((p) => p.join(",")).join(" ")} strokeWidth={6 / s} strokeDasharray={`${L * tr} ${L}`} opacity={0.95} />
            <line x1={bx} y1={by} x2={bx + (tx - bx) * a1} y2={by + (ty - by) * a1} strokeWidth={4 / s} opacity={0.95} />
            <line x1={bx} y1={by} x2={bx - len * 0.75 * a2} y2={by} strokeWidth={3 / s} strokeDasharray="14 10" opacity={0.9} />
            <path d={`M ${bx - R} ${by} A ${R} ${R} 0 0 1 ${arcEnd[0]} ${arcEnd[1]}`} strokeWidth={3 / s} strokeDasharray={`${arcLen * a2} ${arcLen}`} />
          </g>
        </svg>
        <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(-50%,-50%) scale(${1 / s})`, fontFamily: "Elite", fontSize: 86, color: "#F4F4F2",
          opacity: txt, filter: `blur(${(1 - txt) * 4}px)`, textShadow: "0 0 14px rgba(0,0,0,.85), 0 2px 6px rgba(0,0,0,.9)" }}>{deg}°</div>
      </div>
      {/* the frame sinks into shadow except a soft band along the drop face */}
      <AbsoluteFill style={{ opacity: spot * 0.8, background: `radial-gradient(ellipse 380px 620px at ${sx}px ${sy}px, rgba(0,0,0,0) 35%, rgba(0,0,0,.85) 100%)` }} />
    </AbsoluteFill>
  );
};
