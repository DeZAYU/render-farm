// TOR12 TwinTrack: a real aerial (USGS NAIP, graded) laid as a tilted plane in perspective (2.5-D), the camera glides over it while
// the tornado tracks are drawn in as they are spoken (SPC track ends + the towns the NWS names). Tracks are drawn ON the plane (they
// recede with it); the red labels are projected to screen so the type stays flat and sharp.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export type CamKey = { f: number; cx: number; cy: number; z: number };
export type Track = { pts: [number, number][]; at: number; len: number; color?: string; w?: number; head?: boolean };
export type PlaneLabel = { x: number; y: number; text: string; at: number; hold?: number; dot?: boolean };

const camAt = (f: number, keys: CamKey[]) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (f <= b.f) { const t = io((f - a.f) / (b.f - a.f)); return { f, cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, z: a.z + (b.z - a.z) * t }; }
  }
  return keys[keys.length - 1];
};

const segLen = (p: [number, number][]) => { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; };
const pointAt = (p: [number, number][], u: number): [number, number] => {
  const L = segLen(p) * u; let acc = 0;
  for (let i = 1; i < p.length; i++) { const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (acc + l >= L) { const t = (L - acc) / l; return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t]; } acc += l; }
  return p[p.length - 1];
};

export const TwinTrack: React.FC<{ src: string; iw: number; ih: number; keys: CamKey[]; tilt?: number; persp?: number; tracks: Track[]; labels: PlaneLabel[]; fadeIn?: number }> = ({ src, iw, ih, keys, tilt = 34, persp = 1500, tracks, labels, fadeIn = 8 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const c = camAt(f, keys);
  const base = Math.max(width / iw, height / ih) * c.z; // image px -> plane px
  const ox = width / 2 - c.cx * base, oy = height / 2 - c.cy * base; // plane coords (pre-tilt)
  const th = (tilt * Math.PI) / 180;
  // project a plane point (screen space before tilt) through rotateX(tilt) about the frame centre + perspective
  const proj = (x: number, y: number) => { const X = x - width / 2, Y = y - height / 2; const yr = Y * Math.cos(th), zr = Y * Math.sin(th); const s = persp / (persp - zr); return [width / 2 + X * s, height / 2 + yr * s]; };
  const fade = interpolate(f, [0, fadeIn], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#05070a", overflow: "hidden", opacity: fade }}>
      <AbsoluteFill style={{ perspective: persp, perspectiveOrigin: "50% 50%" }}>
        <AbsoluteFill style={{ transform: `rotateX(${tilt}deg)`, transformOrigin: "50% 50%", transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", filter: "saturate(.9) contrast(1.06) brightness(.92)" }} />
            <svg width={iw * base} height={ih * base} viewBox={`0 0 ${iw} ${ih}`} style={{ position: "absolute", inset: 0 }}>
              {tracks.map((t, i) => {
                const g = io(interpolate(f, [t.at, t.at + t.len], [0, 1], cl)); if (g <= 0) return null;
                const d = "M" + t.pts.map((p) => p.join(" ")).join(" L"), w = (t.w ?? 9) / c.z * 1.6;
                const hd = pointAt(t.pts, g);
                return <g key={i}>
                  <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={w * 2.2} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
                  <path d={d} fill="none" stroke={t.color ?? "#fff"} strokeWidth={w} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
                  {t.head !== false && g < 0.999 && <circle cx={hd[0]} cy={hd[1]} r={w * 1.5} fill={t.color ?? "#fff"} stroke="#fff" strokeWidth={w * 0.4} />}
                </g>;
              })}
              {labels.filter((l) => l.dot !== false).map((l, i) => { const g = interpolate(f, [l.at - 6, l.at + 4], [0, 1], cl); return g > 0 ? <circle key={i} cx={l.x} cy={l.y} r={11 / c.z * 1.6} fill="#fff" stroke="#000" strokeOpacity={0.5} strokeWidth={3 / c.z} opacity={g} /> : null; })}
            </svg>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* depth haze toward the far edge */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,10,14,.85) 0%, rgba(8,10,14,.25) 22%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 85%, rgba(0,0,0,.35) 100%)" }} />
      {labels.map((l, i) => { const [sx, sy] = proj(ox + l.x * base, oy + l.y * base); return <RedLabel key={i} text={l.text} at={l.at} hold={l.hold} x={sx / width} y={(sy - 52) / height} size={34} />; })}
    </AbsoluteFill>
  );
};
