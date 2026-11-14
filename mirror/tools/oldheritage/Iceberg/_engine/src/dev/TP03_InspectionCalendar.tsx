// TP03 InspectionCalendar: the real May and June 2023 month grids on a lit, tilted sheet over the darkened footage; the days in the paperwork
// are boxed as they are spoken (white), the jam day filled red, and a bracket measures the gap between the last check and the jam.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Mark = { m: 0 | 1; d: number; at: number; fill?: boolean };
const MONTHS = [{ name: "MAY 2023", first: 0, days: 31 }, { name: "JUNE 2023", first: 3, days: 30 }]; // first = weekday index, Monday = 0
export const InspectionCalendar: React.FC<{ bg: string; bgFrom: number; marks: Mark[]; span: { from: Mark; to: Mark; at: number; label: string } }> = ({ bg, bgFrom, marks, span }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const cell = 86, gw = cell * 7, gap = 90, top = 270;
  const x0 = (width - (2 * gw + gap)) / 2;
  const t = io(f / durationInFrames);
  const pos = (m: number, d: number) => { const M = MONTHS[m], i = M.first + d - 1; return { x: x0 + m * (gw + gap) + (i % 7) * cell, y: top + 90 + Math.floor(i / 7) * cell }; };
  const lit = 30 + 40 * t;
  const sp = io(interpolate(f, [span.at, span.at + 18], [0, 1], cl));
  const a = pos(span.from.m, span.from.d), b = pos(span.to.m, span.to.d);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(18px) brightness(.28) saturate(.6)" }} />
      <AbsoluteFill style={{ perspective: 1700 }}>
        <AbsoluteFill style={{ transform: `rotateX(${14 - 6 * t}deg) rotateY(${-6 + 8 * t}deg) scale(${0.94 + 0.06 * t})`, transformOrigin: "50% 45%" }}>
          <div style={{ position: "absolute", left: x0 - 50, top: top - 60, width: 2 * gw + gap + 100, height: 6 * cell + 210, background: "#EDEBE6", boxShadow: "0 40px 90px rgba(0,0,0,.75)" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 75% at ${lit}% 35%, rgba(255,255,255,.0), rgba(0,0,0,.28) 90%)` }} />
          </div>
          <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
            {MONTHS.map((M, m) => (
              <g key={m}>
                <text x={x0 + m * (gw + gap)} y={top - 4} fontFamily="ArchivoBlk" fontWeight={900} fontSize={40} fill="#111">{M.name}</text>
                {["M", "T", "W", "T", "F", "S", "S"].map((w, i) => <text key={i} x={x0 + m * (gw + gap) + i * cell + cell / 2} y={top + 52} fontFamily="ArchivoBlk" fontWeight={700} fontSize={22} fill="#777" textAnchor="middle">{w}</text>)}
                {Array.from({ length: M.days }, (_, k) => { const p = pos(m, k + 1); return <text key={k} x={p.x + cell / 2} y={p.y + cell / 2 + 12} fontFamily="ArchivoBlk" fontWeight={600} fontSize={32} fill="#222" textAnchor="middle">{k + 1}</text>; })}
              </g>
            ))}
            {marks.map((mk, i) => {
              const g = out(interpolate(f, [mk.at, mk.at + 12], [0, 1], cl)); if (g <= 0) return null;
              const p = pos(mk.m, mk.d), s = 1.35 - 0.35 * g, w = cell - 8;
              return <g key={i} transform={`translate(${p.x + cell / 2} ${p.y + cell / 2}) scale(${s})`} opacity={g}>
                <rect x={-w / 2} y={-w / 2} width={w} height={w} fill={mk.fill ? RED : "none"} fillOpacity={mk.fill ? 0.85 : 0} stroke={mk.fill ? RED : "#111"} strokeWidth={6} />
                {mk.fill && <text x={0} y={12} fontFamily="ArchivoBlk" fontWeight={900} fontSize={32} fill="#0B0B0B" textAnchor="middle">{mk.d}</text>}
              </g>;
            })}
            {sp > 0 && (() => { const y = Math.max(a.y, b.y) + cell + 18, xa = a.x + cell / 2, xb = xa + (b.x + cell / 2 - xa) * sp;
              return <g stroke="#111" strokeWidth={5}><line x1={xa} y1={y} x2={xb} y2={y} /><line x1={xa} y1={y - 14} x2={xa} y2={y + 14} />{sp > 0.98 && <line x1={xb} y1={y - 14} x2={xb} y2={y + 14} />}</g>; })()}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      <RedLabel text={span.label} at={span.at + 16} y={0.86} />
    </AbsoluteFill>
  );
};
