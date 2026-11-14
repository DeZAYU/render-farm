// TOR21 (Marshalltown) — "EF3, up to twelve hundred yards wide, twenty-three minutes on the ground over eight point four miles".
// The NWS damage survey itself (Damage Assessment Toolkit, event 19Jul2018_Tor18): its centre line and its EF0 / EF2 / EF3 damage
// polygons, laid on a USGS NAIP aerial of Marshalltown that lies in 3-D like a table top. The camera flies along the line from the
// touchdown in the fields to the town while it draws; the swath (the 1,200-yard width) fills in, then the EF3 cores light red.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];

const along = (pts: Pt[], u: number): Pt => {
  const L: number[] = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const s = u * L[L.length - 1];
  for (let i = 1; i < pts.length; i++) if (s <= L[i]) { const k = (s - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]; }
  return pts[pts.length - 1];
};

export const SurveySwath: React.FC<{ src: string; iw: number; ih: number; track: Pt[]; polys: { ef: string; pts: Pt[] }[]; lineAt: number; lineLen: number; swathAt: number; coreAt: number; label: string; labelAt: number }> = ({ src, iw, ih, track, polys, lineAt, lineLen, swathAt, coreAt, label, labelAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(interpolate(f, [lineAt, lineAt + lineLen], [0, 1], cl));
  // camera target: rides slightly behind the drawing head, from 12 % to 92 % of the line (one eased curve)
  const cam = along(track, 0.12 + 0.6 * io(interpolate(f, [0, durationInFrames], [0, 1], cl)));
  const S = 0.62; // plane px per image px
  const W = iw * S, H = ih * S;
  const rx = 50 - 6 * (f / durationInFrames), rz = -7 + 3 * (f / durationInFrames);
  const zoom = 1.42 + 0.12 * io(f / durationInFrames);
  const pathD = (pts: Pt[]) => "M" + pts.map((p) => `${(p[0] * S).toFixed(1)} ${(p[1] * S).toFixed(1)}`).join(" L") + " Z";
  const lineD = "M" + track.map((p) => `${(p[0] * S).toFixed(1)} ${(p[1] * S).toFixed(1)}`).join(" L");
  const sw = out(interpolate(f, [swathAt, swathAt + 18], [0, 1], cl)), core = out(interpolate(f, [coreAt, coreAt + 14], [0, 1], cl));
  const head = along(track, u);
  const enter = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #8e979b 0%, #c9cfd1 38%, #2b2f2a 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1100, perspectiveOrigin: "50% 18%" }}>
        <div style={{ position: "absolute", left: width / 2 - cam[0] * S, top: height * 0.58 - cam[1] * S, width: W, height: H,
          transformOrigin: `${cam[0] * S}px ${cam[1] * S}px`, transform: `scale(${zoom}) rotateX(${rx}deg) rotateZ(${rz}deg)`, opacity: enter }}>
          <Img src={staticFile(src)} style={{ width: W, height: H, display: "block" }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {polys.filter((p) => p.ef === "EF0").map((p, i) => <path key={"a" + i} d={pathD(p.pts)} fill={`rgba(255,255,255,${0.2 * sw})`} stroke="#fff" strokeOpacity={0.9 * sw} strokeWidth={4} />)}
            {polys.filter((p) => p.ef === "EF2").map((p, i) => <path key={"b" + i} d={pathD(p.pts)} fill={`rgba(255,255,255,${0.28 * sw})`} stroke="#fff" strokeOpacity={0.55 * sw} strokeWidth={2} />)}
            {polys.filter((p) => p.ef === "EF3").map((p, i) => <path key={"c" + i} d={pathD(p.pts)} fill={RED} fillOpacity={0.75 * core} stroke="#fff" strokeOpacity={core} strokeWidth={3} />)}
            <path d={lineD} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={16} pathLength={1} strokeDasharray={`${u} 1`} strokeLinecap="round" strokeLinejoin="round" />
            <path d={lineD} fill="none" stroke="#fff" strokeWidth={7} pathLength={1} strokeDasharray={`${u} 1`} strokeLinecap="round" strokeLinejoin="round" />
            {u > 0 && u < 1 && <circle cx={head[0] * S} cy={head[1] * S} r={13} fill={RED} stroke="#fff" strokeWidth={4} />}
          </svg>
        </div>
      </AbsoluteFill>
      {/* haze toward the horizon + vignette */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(190,198,200,.85) 0%, rgba(190,198,200,.25) 22%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(0,0,0,.45) 100%)" }} />
      <RedLabel text={label} at={labelAt} x={0.5} y={0.88} />
    </AbsoluteFill>
  );
};
