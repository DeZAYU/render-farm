// AM11 RiverLoop: the real USGS NAIP aerial of Disneyland's Rivers of America (public domain), both ships visible on the water: the camera
// eases down over the river while a white line runs the Columbia's circuit round Tom Sawyer Island along the channel (start and end at the
// Frontierland landing), then a white box closes round the Columbia herself at the dock. Light tilt-shift falloff, no text of ours
// except the brand RedLabel (place).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** catmull-rom through points -> svg path */
const smooth = (p: [number, number][]) => {
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};

export const RiverLoop: React.FC<{ src: string; iw: number; ih: number; path: [number, number][]; box: [number, number, number, number]; cam: [number, number, number, number, number, number]; drawAt: number; drawLen: number; boxAt: number }> = ({ src, iw, ih, path, box, cam, drawAt, drawLen, boxAt }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const u = io(f / dur);
  const [cx0, cy0, w0, cx1, cy1, w1] = cam;                      // camera: centre + visible width (image px), start -> end
  const cx = cx0 + (cx1 - cx0) * u, cy = cy0 + (cy1 - cy0) * u, w = w0 + (w1 - w0) * u;
  const k = 1920 / w;
  const draw = out(interpolate(f, [drawAt, drawAt + drawLen], [0, 1], cl));
  const b = out(interpolate(f, [boxAt, boxAt + 12], [0, 1], cl));
  const [bx0, by0, bx1, by1] = box, bcx = (bx0 + bx1) / 2, bcy = (by0 + by1) / 2;
  const bw = (bx1 - bx0) * (1.6 - 0.6 * b), bh = (by1 - by0) * (1.6 - 0.6 * b);
  const d = smooth(path);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - cx * k, top: 540 - cy * k, width: iw * k, height: ih * k }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%" }} />
        <svg viewBox={`0 0 ${iw} ${ih}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={14 / k} pathLength={1} strokeDasharray={`${draw} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#F4F4F2" strokeWidth={5.5 / k} pathLength={1} strokeDasharray={`${draw} 1`} strokeLinecap="round" strokeLinejoin="round" />
          {b > 0 && <rect x={bcx - bw / 2} y={bcy - bh / 2} width={bw} height={bh} fill="none" stroke="#F4F4F2" strokeWidth={5 / k} opacity={b} />}
        </svg>
      </div>
      <AbsoluteFill style={{ backdropFilter: "blur(3px)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 28%, transparent 72%, #000 100%)", maskImage: "linear-gradient(180deg, #000 0%, transparent 28%, transparent 72%, #000 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
