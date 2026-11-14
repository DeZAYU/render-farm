// TOR17 CrossingBand: "never more than sixty-five yards wide" / "homes and an apartment building in south and east Ocala": on the NAIP
// picture of I-75 at State Road 200, the tornado's maximum width (65 yd = 59 m, NWS Jacksonville survey) is laid down TO SCALE as a
// white-edged band along the line of the NWS survey points, crossing the interstate: the whole damage swath is about as wide as the
// six-lane highway it crossed. Then the survey points (EF1, 105-110 mph) land along it and the apartment complex the survey names is boxed.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Cam = { at: number; x: number; y: number; z: number };

export const CrossingBand: React.FC<{ src: string; iw: number; ih: number; a: [number, number]; b: [number, number]; widthPx: number; bandIn: [number, number];
  pts: [number, number][]; ptsIn: [number, number]; box: [number, number, number, number]; boxAt: number; boxLabel: string; road: { p: [number, number]; label: string; at: number; hold: number }; cam: Cam[] }> =
  ({ src, iw, ih, a, b, widthPx, bandIn, pts, ptsIn, box, boxAt, boxLabel, road, cam }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  let c = cam[0];
  for (let i = 1; i < cam.length; i++) { if (f < cam[i - 1].at) break; const e = io(interpolate(f, [cam[i - 1].at, cam[i].at], [0, 1], cl)), p = cam[i - 1], q = cam[i];
    c = { at: f, x: p.x + (q.x - p.x) * e, y: p.y + (q.y - p.y) * e, z: Math.exp(Math.log(p.z) + (Math.log(q.z) - Math.log(p.z)) * e) }; }
  const base = Math.max(width / iw, height / ih) * c.z;
  const S = (x: number, y: number) => [width / 2 + (x - c.x) * base, height / 2 + (y - c.y) * base];
  const [ox, oy] = S(0, 0);
  const g = io(interpolate(f, bandIn, [0, 1], cl));
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, h = widthPx / 2;
  // band grows outward from the interstate crossing (the middle of the segment) in both directions
  const m = 0.43, t0 = m - m * g, t1 = m + (1 - m) * g;
  const P = (t: number, s: number) => S(a[0] + dx * t + nx * h * s, a[1] + dy * t + ny * h * s);
  const quad = [P(t0, -1), P(t1, -1), P(t1, 1), P(t0, 1)];
  const bx = io(interpolate(f, [boxAt, boxAt + 14], [0, 1], cl));
  const [x0, y0] = S(box[0], box[1]), [x1, y1] = S(box[2], box[3]); const per = 2 * ((x1 - x0) + (y1 - y0));
  const [rx, ry] = S(road.p[0], road.p[1]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: interpolate(f, [0, 8], [0, 1], cl) }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "saturate(.9) contrast(1.06)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.5) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {g > 0 && <>
          <path d={"M" + quad.map((p) => p.join(" ")).join(" L") + " Z"} fill="rgba(255,255,255,.22)" />
          <line x1={quad[0][0]} y1={quad[0][1]} x2={quad[1][0]} y2={quad[1][1]} stroke="#fff" strokeWidth={3} style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,.8))" }} />
          <line x1={quad[3][0]} y1={quad[3][1]} x2={quad[2][0]} y2={quad[2][1]} stroke="#fff" strokeWidth={3} style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,.8))" }} />
        </>}
        {pts.map(([x, y], i) => { const at = ptsIn[0] + (ptsIn[1] - ptsIn[0]) * i / Math.max(1, pts.length - 1); const k = out(interpolate(f, [at, at + 6], [0, 1], cl)); if (k <= 0) return null;
          const [X, Y] = S(x, y); return <circle key={i} cx={X} cy={Y} r={7 * (1.6 - 0.6 * k)} fill="#fff" stroke="rgba(0,0,0,.65)" strokeWidth={2} opacity={k} />; })}
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={per} strokeDashoffset={per * (1 - bx)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
      </svg>
      <RedLabel text={road.label} at={road.at} hold={road.hold} x={rx / width} y={ry / height} size={40} />
      <RedLabel text={boxLabel} at={boxAt + 6} x={Math.min(0.78, Math.max(0.22, (x0 + x1) / 2 / width))} y={Math.min(0.9, (y1 + 44) / height)} size={40} />
    </AbsoluteFill>
  );
};
