// TOR16 SurveyMap: the NWS Damage Assessment Toolkit survey of the Andover EF3 (event "WichitaAndoverTornado": 86 rated damage points +
// the surveyed track line) on real USGS imagery. Every survey point lands where the surveyors stood, in track order (white = EF0-EF2,
// red square = EF3); a sharp NAIP close-up of the school/YMCA block is registered inside the wide picture, so the camera can fly from
// the whole 12.8-mile path straight down onto Prairie Creek Elementary without the image going soft. Used twice with different jobs:
// (1) the path + every point, diving to the school; (2) close: the track line drawn past the school's edge (side-swiped, EF2) and
// straight through the YMCA (EF3).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Cam = { at: number; x: number; y: number; z: number };
type Box = { r: [number, number, number, number]; at: number; label?: string; red?: boolean };
type P = { wide: string; ww: number; wh: number; close?: string; closeAt?: [number, number, number, number]; pts?: [number, number, number][]; ptsIn?: [number, number];
  line?: [number, number][]; lineIn?: [number, number]; cam: Cam[]; boxes?: Box[] };

// smooth camera: monotone ease between keys, zoom interpolated in log space
const camAt = (f: number, cam: Cam[]) => {
  let c = { ...cam[0] };
  for (let i = 1; i < cam.length; i++) {
    if (f < cam[i - 1].at) break;
    const e = io(interpolate(f, [cam[i - 1].at, cam[i].at], [0, 1], cl)), a = cam[i - 1], b = cam[i];
    c = { at: f, x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * e) };
  }
  return c;
};

export const SurveyMap: React.FC<P> = ({ wide, ww, wh, close, closeAt, pts = [], ptsIn = [0, 0], line, lineIn = [0, 0], cam, boxes = [] }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const c = camAt(f, cam);
  const S = (x: number, y: number) => [width / 2 + (x - c.x) * c.z, height / 2 + (y - c.y) * c.z];
  const [ox, oy] = S(0, 0);
  // the sharp close-up fades in once it is the better picture (>= 1.6 screen px per wide px)
  const co = closeAt ? interpolate(c.z, [1.4, 2.2], [0, 1], cl) : 0;
  const order = pts.map((p, i) => i).sort((a, b) => pts[b][1] - pts[a][1]); // along the track: south -> north
  const lg = io(interpolate(f, lineIn, [0, 1], cl));
  const d = line ? "M" + line.map(([x, y]) => S(x, y).join(" ")).join(" L") : "";
  const o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <Img src={staticFile(wide)} style={{ position: "absolute", left: ox, top: oy, width: ww * c.z, height: wh * c.z, filter: "saturate(.92) contrast(1.05) brightness(.92)" }} />
      {close && closeAt && co > 0 && (() => { const [a, b] = S(closeAt[0], closeAt[1]), [e, g] = S(closeAt[2], closeAt[3]);
        return <Img src={staticFile(close)} style={{ position: "absolute", left: a, top: b, width: e - a, height: g - b, opacity: co, filter: "saturate(.92) contrast(1.05) brightness(.92)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 75%, rgba(0,0,0,0) 100%)", maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 75%, rgba(0,0,0,0) 100%)" }} />; })()}
      {/* soft vignette so the marks read */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {line && <>
          <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} pathLength={1} strokeDasharray={`${lg} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${lg} 1`} strokeLinecap="round" strokeLinejoin="round" />
        </>}
        {order.map((i, rank) => {
          const [x, y, ef] = pts[i]; const a = ptsIn[0] + (ptsIn[1] - ptsIn[0]) * rank / Math.max(1, pts.length - 1);
          const g = out(interpolate(f, [a, a + 6], [0, 1], cl)); if (g <= 0) return null;
          const [X, Y] = S(x, y); const s = (ef === 3 ? 13 : 7 + ef) * (1.7 - 0.7 * g);
          return ef === 3
            ? <rect key={i} x={X - s / 2} y={Y - s / 2} width={s} height={s} fill={RED} stroke="#fff" strokeWidth={2} opacity={g} />
            : <circle key={i} cx={X} cy={Y} r={s / 2} fill="#fff" stroke="rgba(0,0,0,.6)" strokeWidth={1.5} opacity={g * (0.55 + 0.15 * ef)} />;
        })}
        {boxes.map((b, i) => { const [x0, y0] = S(b.r[0], b.r[1]), [x1, y1] = S(b.r[2], b.r[3]); const P = 2 * ((x1 - x0) + (y1 - y0));
          const g = out(interpolate(f, [b.at, b.at + 14], [0, 1], cl));
          return <rect key={i} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="none" stroke={b.red ? RED : "#fff"} strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />; })}
      </svg>
      {boxes.map((b, i) => { if (!b.label) return null; const [x0, , x1, y1] = [...S(b.r[0], b.r[1]), ...S(b.r[2], b.r[3])];
        return <RedLabel key={i} text={b.label} at={b.at + 6} x={Math.min(0.8, Math.max(0.2, (x0 + x1) / 2 / width))} y={Math.min(0.9, (y1 + 44) / height)} size={40} />; })}
    </AbsoluteFill>
  );
};
