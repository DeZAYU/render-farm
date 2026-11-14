// TP22 CoastChain: southern England on Sentinel-2 cloudless (EOX s2maps.eu, 2016, CC BY 4.0). The burned piers are joined in
// the order they burned: a white line is traced leg by leg (a hop across country, or along the real shoreline), a dot lands on
// each pier and a real photo of that pier's fire rises out of it in a white frame with its place + year in red.
// Coordinates are image pixels of the given map; the camera eases from (focus0, z0) to (focus1, z1).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export type Stop = { x: number; y: number; at: number; photoAt?: number; photo?: string; pos?: string; label: string; px: number; py: number; pw?: number; ph?: number };
export type Leg = { pts: [number, number][]; at: number; len: number; bow?: number };

export const CoastChain: React.FC<{ src: string; iw: number; ih: number; focus0: [number, number]; focus1?: [number, number]; z0?: number; z1?: number; legs: Leg[]; stops: Stop[] }> = ({ src, iw, ih, focus0, focus1, z0 = 1, z1, legs, stops }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / durationInFrames);
  const z = z0 + ((z1 ?? z0) - z0) * u;
  const fc = [focus0[0] + ((focus1 ?? focus0)[0] - focus0[0]) * u, focus0[1] + ((focus1 ?? focus0)[1] - focus0[1]) * u];
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fc[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fc[1] * base));
  const X = (x: number) => ox + x * base, Y = (y: number) => oy + y * base;
  const legPath = (l: Leg) => {
    if (l.pts.length === 2 && l.bow) { // a hop: one bowed arc
      const [[ax, ay], [bx, by]] = l.pts; const mx = (ax + bx) / 2, my = (ay + by) / 2 - l.bow;
      return `M${X(ax)} ${Y(ay)} Q${X(mx)} ${Y(my)} ${X(bx)} ${Y(by)}`;
    }
    return "M" + l.pts.map(([x, y]) => `${X(x)} ${Y(y)}`).join(" L");
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "brightness(.82) saturate(.85) contrast(1.05)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {legs.map((l, i) => {
          const g = io(interpolate(f, [l.at, l.at + l.len], [0, 1], cl)); if (g <= 0) return null; const d = legPath(l);
          return <g key={i}>
            <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={11} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          </g>;
        })}
        {stops.map((s, i) => {
          const g = out(interpolate(f, [s.at, s.at + 10], [0, 1], cl)); if (g <= 0) return null;
          const ring = interpolate(f, [s.at, s.at + 22], [0, 1], cl);
          return <g key={i}>
            <circle cx={X(s.x)} cy={Y(s.y)} r={14 + 40 * ring} fill="none" stroke="#fff" strokeWidth={3} opacity={1 - ring} />
            <circle cx={X(s.x)} cy={Y(s.y)} r={12 * g} fill={RED} stroke="#fff" strokeWidth={4} />
          </g>;
        })}
      </svg>
      {stops.map((s, i) => {
        if (!s.photo) return null; const pa = s.photoAt ?? s.at + 4;
        const g = out(interpolate(f, [pa, pa + 16], [0, 1], cl)); if (g <= 0) return null;
        const pw = s.pw ?? 380, ph = s.ph ?? 250;
        const d = io(interpolate(f, [pa, durationInFrames], [0, 1], cl));
        // leader from the dot to the plate's nearest edge
        const cx = s.px, cy = s.py + (1 - g) * 50;
        const lx = Math.max(cx - pw / 2, Math.min(cx + pw / 2, X(s.x))), ly = Y(s.y) < cy ? cy - ph / 2 : cy + ph / 2;
        return <React.Fragment key={"p" + i}>
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: g }}>
            <line x1={X(s.x)} y1={Y(s.y)} x2={lx} y2={ly} stroke="#fff" strokeWidth={2.5} />
          </svg>
          <div style={{ position: "absolute", left: cx - pw / 2, top: cy - ph / 2, width: pw, height: ph, border: "6px solid #fff", boxShadow: "0 18px 50px rgba(0,0,0,.65)", overflow: "hidden", opacity: g, background: "#000",
            transform: `perspective(1400px) rotateX(${(1 - g) * 18}deg) scale(${0.9 + 0.1 * g})` }}>
            <Img src={staticFile(s.photo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "50% 50%", transform: `scale(${1.04 + 0.05 * d})` }} />
          </div>
          <RedLabel text={s.label} at={pa + 6} x={cx / width} y={(cy + ph / 2 + 30) / height} size={30} />
        </React.Fragment>;
      })}
    </AbsoluteFill>
  );
};
