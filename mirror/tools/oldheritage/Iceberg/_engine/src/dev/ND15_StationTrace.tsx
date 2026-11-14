// ND15 StationTrace: the airport's own instrument record (IEM archive of KLCH ASOS 1-minute data) drawn as it happened, over the
// darkened garage footage. Mode "gust": the wind-gust line climbs to the record and simply stops where the sensor was destroyed.
// Mode "pressure": the pressure line sinks to its lowest as the eye passes over the airport, then starts to climb again.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export type Obs = [number, number]; // [minutes after t0, value]

export const StationTrace: React.FC<{ bg: string; bgFrom: number; data: Obs[]; t0: string; minutes: number; ticks: { m: number; label: string }[]; vmin: number; vmax: number; vticks: number[]; unit: string;
  drawAt: number; drawLen: number; mark: { m: number; label: string; at: number }; end?: { label: string; at: number }; station: string }> =
  ({ bg, bgFrom, data, minutes, ticks, vmin, vmax, vticks, unit, drawAt, drawLen, mark, end, station }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const x0 = width * 0.12, x1 = width * 0.88, y0 = height * 0.2, y1 = height * 0.78;
  const X = (m: number) => x0 + (x1 - x0) * (m / minutes), Y = (v: number) => y1 - (y1 - y0) * ((v - vmin) / (vmax - vmin));
  const g = interpolate(f, [drawAt, drawAt + drawLen], [0, 1], cl);
  const last = data[data.length - 1][0];
  const upto = g * last;
  const pts = data.filter((d) => d[0] <= upto);
  const d = pts.length > 1 ? "M" + pts.map((p) => `${X(p[0]).toFixed(1)} ${Y(p[1]).toFixed(1)}`).join(" L") : "";
  const tip = pts[pts.length - 1];
  const mk = out(interpolate(f, [mark.at, mark.at + 12], [0, 1], cl));
  const mv = data.reduce((a, p) => (Math.abs(p[0] - mark.m) < Math.abs(a[0] - mark.m) ? p : a), data[0]);
  const o = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", filter: "blur(8px) brightness(.36) saturate(.6)", transform: `scale(${1.04 + 0.04 * f / durationInFrames})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {vticks.map((v) => <g key={v}><line x1={x0} y1={Y(v)} x2={x1} y2={Y(v)} stroke="rgba(255,255,255,.18)" strokeWidth={2} />
          <text x={x0 - 18} y={Y(v) + 10} fill="rgba(255,255,255,.75)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={30} textAnchor="end">{v}</text></g>)}
        <text x={x0 - 18} y={y0 - 34} fill="rgba(255,255,255,.6)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={24} textAnchor="end">{unit}</text>
        <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="rgba(255,255,255,.8)" strokeWidth={3} />
        {ticks.map((t) => <g key={t.m}><line x1={X(t.m)} y1={y1} x2={X(t.m)} y2={y1 + 16} stroke="#fff" strokeWidth={3} />
          <text x={X(t.m)} y={y1 + 52} fill="rgba(255,255,255,.75)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={28} textAnchor="middle">{t.label}</text></g>)}
        {d && <><path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={12} strokeLinejoin="round" /><path d={d} fill="none" stroke="#fff" strokeWidth={5} strokeLinejoin="round" /></>}
        {tip && g < 1 && <circle cx={X(tip[0])} cy={Y(tip[1])} r={9} fill="#fff" />}
        {mk > 0 && <g opacity={mk}><circle cx={X(mv[0])} cy={Y(mv[1])} r={16 + 10 * (1 - mk)} fill={RED} stroke="#fff" strokeWidth={5} />
          <line x1={X(mv[0])} y1={Y(mv[1])} x2={X(mv[0])} y2={y1} stroke={RED} strokeWidth={3} strokeDasharray="8 8" /></g>}
        {end && f >= end.at && g >= 1 && <g opacity={out(interpolate(f, [end.at, end.at + 10], [0, 1], cl))}>
          <line x1={X(last) - 18} y1={Y(data[data.length - 1][1]) - 18} x2={X(last) + 18} y2={Y(data[data.length - 1][1]) + 18} stroke={RED} strokeWidth={7} />
          <line x1={X(last) - 18} y1={Y(data[data.length - 1][1]) + 18} x2={X(last) + 18} y2={Y(data[data.length - 1][1]) - 18} stroke={RED} strokeWidth={7} /></g>}
      </svg>
      <RedLabel text={station} at={6} x={0.5} y={0.09} size={36} />
      <RedLabel text={mark.label} at={mark.at + 8} x={Math.min(0.86, Math.max(0.14, X(mv[0]) / width))} y={Math.max(0.16, (Y(mv[1]) - 80) / height)} size={42} />
      {end && g >= 1 && <RedLabel text={end.label} at={end.at + 6} x={Math.min(0.86, X(last) / width + 0.04)} y={Math.min(0.9, (Y(data[data.length - 1][1]) + 80) / height)} size={34} />}
    </AbsoluteFill>
  );
};
