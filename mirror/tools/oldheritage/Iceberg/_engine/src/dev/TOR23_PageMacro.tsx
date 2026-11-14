// TOR23 (Elkhorn) — the NWS Omaha statement of 29 July 2024 upgrading the tornado to EF-4 (IEM text archive). A third page language,
// unlike the neighbours' sheet-in-3-D (TOR21) and chip-lift (TOR22): a flat macro read. The camera sits very close to the type and
// tracks ALONG each proving line at reading speed (one eased curve through both lines), a warm light pool rides with it, the proven
// words get a thin red rule drawn under them, and everything off the line falls out of focus.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Line = { box: [number, number, number, number]; at: number; len: number };
export const PageMacro: React.FC<{ src: string; iw: number; ih: number; lines: Line[]; zoom?: number }> = ({ src, iw, ih, lines, zoom = 1.7 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  // camera x/y: along the active line from its start to its end; between lines a smooth glide
  let cx = lines[0].box[0] + 250, cy = (lines[0].box[1] + lines[0].box[3]) / 2;
  lines.forEach((l, i) => {
    const mid = (l.box[1] + l.box[3]) / 2;
    if (i > 0) { const g = io(interpolate(f, [l.at - 18, l.at], [0, 1], cl)); cy = cy + (mid - cy) * g; cx = cx + (l.box[0] + 250 - cx) * g; }
    const r = io(interpolate(f, [l.at, l.at + l.len], [0, 1], cl));
    if (f >= l.at) cx = l.box[0] + 250 + (l.box[2] - l.box[0] - 500) * r;
  });
  const S = zoom; const ox = width * 0.42 - cx * S, oy = height / 2 - cy * S;
  return (
    <AbsoluteFill style={{ background: "#f4f5f6", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * S, height: ih * S, filter: "blur(2.6px)" }} />
      {/* the sharp band = the line being read */}
      <div style={{ position: "absolute", left: 0, right: 0, top: height / 2 - 70, height: 140, overflow: "hidden",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy - (height / 2 - 70), width: iw * S, height: ih * S }} />
      </div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {lines.map((l, i) => { const r = io(interpolate(f, [l.at + 4, l.at + l.len], [0, 1], cl)); if (r <= 0) return null;
          const x0 = ox + l.box[0] * S, x1 = ox + l.box[2] * S, y = oy + l.box[3] * S + 8;
          return <line key={i} x1={x0} y1={y} x2={x0 + (x1 - x0) * r} y2={y} stroke={RED} strokeWidth={6} strokeLinecap="round" />; })}
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 45% at 42% 50%, rgba(255,244,226,.10) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)` }} />
    </AbsoluteFill>
  );
};
