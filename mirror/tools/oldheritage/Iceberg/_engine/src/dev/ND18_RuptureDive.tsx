// ND18 RuptureDive: one geo camera over stacked real imagery (NASA Blue Marble bathymetry -> EOX Sentinel-2 2016 mid -> EOX Sentinel-2 z14).
// Phase 1: the epicentre off Sumatra pulses, the rupture is traced north along the trench (white), its length bracketed (1,300 KM).
// Phase 2: the camera flies east and dives onto Koh Ngai; white box drawn round the island, red place label.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Layer = { src: string; lon0: number; lon1: number; lat0: number; lat1: number; op: (wdeg: number) => number };
export type DiveP = {
  layers: Layer[];
  epi: [number, number]; rupture: [number, number][]; // [lon, lat]
  cam0: [number, number, number]; cam1: [number, number, number]; cam2: [number, number, number]; // lon, lat, visible width in degrees
  fly: [number, number]; // frames: dive start, dive end
  epiAt: number; traceAt: number; traceLen: number; spanLabel: string;
  box: [number, number, number, number]; boxAt: number; label: string; labelAt: number; epiLabel?: string;
};

export const RuptureDive: React.FC<DiveP> = (p) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  // camera: slow push (cam0 -> cam1) until the dive, then an eased flight with log-interpolated zoom (cam1 -> cam2)
  const pre = io(interpolate(f, [0, p.fly[0]], [0, 1], cl));
  const k = io(interpolate(f, p.fly, [0, 1], cl));
  const a = [p.cam0[0] + (p.cam1[0] - p.cam0[0]) * pre, p.cam0[1] + (p.cam1[1] - p.cam0[1]) * pre, p.cam0[2] * Math.pow(p.cam1[2] / p.cam0[2], pre)];
  // position follows the zoom (moves mostly early, so the target is centred before the last zoom-in)
  const kp = Math.min(1, k * 1.35);
  const lon = a[0] + (p.cam2[0] - a[0]) * kp, lat = a[1] + (p.cam2[1] - a[1]) * kp, wdeg = a[2] * Math.pow(p.cam2[2] / a[2], k);
  const ppd = width / wdeg;
  const X = (lo: number) => width / 2 + (lo - lon) * ppd, Y = (la: number) => height / 2 - (la - lat) * ppd;
  const mb = f > p.fly[0] && f < p.fly[1] ? Math.min(3, Math.abs(Math.log((a[2] * Math.pow(p.cam2[2] / a[2], io(interpolate(f + 1, p.fly, [0, 1], cl)))) / wdeg)) * 60) : 0;
  // overlays (phase 1) fade as the dive starts
  const ov = interpolate(f, [p.fly[0], p.fly[0] + 12], [1, 0], cl);
  const pts = p.rupture.map(([lo, la]) => [X(lo), Y(la)]);
  const d = "M" + pts.map((q) => q.join(" ")).join(" L");
  const g = io(interpolate(f, [p.traceAt, p.traceAt + p.traceLen], [0, 1], cl));
  const ep = out(interpolate(f, [p.epiAt, p.epiAt + 10], [0, 1], cl));
  const ring = ((f - p.epiAt) % 36) / 36;
  // span bracket: offset to the west of the rupture, from its south end to its north end
  const s0 = pts[0], s1 = pts[pts.length - 1];
  const sg = out(interpolate(f, [p.traceAt + p.traceLen, p.traceAt + p.traceLen + 12], [0, 1], cl));
  const bx = Math.min(s0[0], s1[0]) - 150;
  // the island box
  const bb = [X(p.box[0]), Y(p.box[3]), X(p.box[2]), Y(p.box[1])];
  const bg = out(interpolate(f, [p.boxAt, p.boxAt + 14], [0, 1], cl));
  const P = 2 * ((bb[2] - bb[0]) + (bb[3] - bb[1]));
  return (
    <AbsoluteFill style={{ background: "#03060c", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: mb > 0.3 ? `blur(${mb.toFixed(2)}px)` : undefined }}>
        {p.layers.map((L, i) => {
          const o = L.op(wdeg); if (o <= 0.001) return null;
          const w = (L.lon1 - L.lon0) * ppd, h = (L.lat1 - L.lat0) * ppd;
          if (w > 60000) return null;
          return <Img key={i} src={staticFile(L.src)} style={{ position: "absolute", left: X(L.lon0), top: Y(L.lat1), width: w, height: h, opacity: o, filter: i > 1 ? "brightness(1.35) contrast(1.06) saturate(1.1)" : "brightness(1.15)" }} />;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {ov > 0 && <g opacity={ov}>
          <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          {ep > 0 && <>
            <circle cx={X(p.epi[0])} cy={Y(p.epi[1])} r={10 + 70 * ring} fill="none" stroke="#fff" strokeWidth={3} opacity={(1 - ring) * ep} />
            <circle cx={X(p.epi[0])} cy={Y(p.epi[1])} r={13 * ep} fill={RED} stroke="#fff" strokeWidth={4} />
          </>}
          {sg > 0 && <g opacity={sg} stroke="#fff" strokeWidth={4}>
            <line x1={bx} y1={s0[1]} x2={bx} y2={s0[1] + (s1[1] - s0[1]) * sg} />
            <line x1={bx - 16} y1={s0[1]} x2={bx + 16} y2={s0[1]} />
            {sg > 0.98 && <line x1={bx - 16} y1={s1[1]} x2={bx + 16} y2={s1[1]} />}
          </g>}
        </g>}
        {bg > 0 && <rect x={bb[0]} y={bb[1]} width={bb[2] - bb[0]} height={bb[3] - bb[1]} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - bg)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />}
      </svg>
      {ov > 0.5 && p.epiLabel && <RedLabel text={p.epiLabel} at={p.epiAt + 6} hold={p.fly[0] - p.epiAt - 10} x={(X(p.epi[0]) + 190) / width} y={Y(p.epi[1]) / height} size={40} />}
      {ov > 0.5 && <RedLabel text={p.spanLabel} at={p.traceAt + p.traceLen + 8} hold={p.fly[0] - p.traceAt - p.traceLen - 12} x={(bx - 20) / width - 0.06} y={((s0[1] + s1[1]) / 2) / height} size={40} />}
      <RedLabel text={p.label} at={p.labelAt} x={((bb[0] + bb[2]) / 2) / width} y={Math.min(0.9, (bb[3] + 50) / height)} />
    </AbsoluteFill>
  );
};
