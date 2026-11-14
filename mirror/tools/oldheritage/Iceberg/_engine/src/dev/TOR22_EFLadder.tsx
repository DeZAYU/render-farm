// TOR22 — "EF2 on the scale covers winds of a hundred and eleven to a hundred and thirty-five." The Enhanced Fujita scale (NWS / SPC
// 3-second-gust ranges) as a column of six white-framed bands standing beside the deputy's own footage (the footage shrinks into a
// white frame on the left, the column rises on the right). The EF2 band fills red; a tick marks the survey's estimated peak, 125 mph
// (NWS Boulder PNS, 22 May 2025).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);
const BANDS: [string, number, number][] = [["EF0", 65, 85], ["EF1", 86, 110], ["EF2", 111, 135], ["EF3", 136, 165], ["EF4", 166, 200], ["EF5", 200, 235]];

export const EFLadder: React.FC<{ bg: string; bgFrom: number; hi: string; hiAt: number; peak?: number; peakAt?: number }> = ({ bg, bgFrom, hi, hiAt, peak, peakAt = 9999 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = io(interpolate(f, [0, 18], [0, 1], cl));
  // the footage: full frame -> a framed panel on the left
  const pw = width - (width - 980) * k, ph = (pw * 9) / 16, px = 90 * k, py = (height - ph) / 2;
  const colX = 1220, colW = 300, y0 = 930, y1 = 150; // mph 60 at y0, 240 at y1
  const Y = (mph: number) => y0 - ((mph - 60) / 180) * (y0 - y1);
  const g = out(interpolate(f, [hiAt, hiAt + 14], [0, 1], cl)), pk = out(interpolate(f, [peakAt, peakAt + 12], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#060606", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(18px) brightness(.32) saturate(.7)" }} />
      <div style={{ position: "absolute", left: px, top: py, width: pw, height: ph, border: `${6 * k}px solid #fff`, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.6)" }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + 0.05 * (f / durationInFrames)})` }} />
      </div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {BANDS.map(([n, a, b], i) => {
          const r = out(interpolate(f, [8 + i * 4, 22 + i * 4], [0, 1], cl)); if (r <= 0) return null;
          const top = Y(b), bot = Y(a), h = (bot - top) * r, isHi = n === hi;
          return <g key={n} opacity={isHi ? 1 : 1 - 0.45 * g}>
            {isHi && <rect x={colX} y={bot - h} width={colW} height={h} fill={RED} opacity={0.92 * g} />}
            <rect x={colX} y={bot - h} width={colW} height={h} fill="none" stroke="#fff" strokeWidth={4} />
            <text x={colX + 22} y={bot - h / 2 + 15} fill={isHi && g > 0.5 ? "#0b0b0b" : "#fff"} fontFamily="ArchivoBlk" fontWeight={900} fontSize={40} opacity={r}>{n}</text>
            <text x={colX + colW + 18} y={bot + 8} fill="rgba(255,255,255,.75)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={24} opacity={r}>{a}</text>
          </g>;
        })}
        {peak !== undefined && pk > 0 && (() => { const y = Y(peak); return <g opacity={pk}>
          <line x1={colX - 16} y1={y} x2={colX - 16 + (colW + 110) * pk} y2={y} stroke="#fff" strokeWidth={4} strokeDasharray="10 6" />
          <text x={colX + colW + 100} y={y + 10} fill="#fff" textAnchor="start" fontFamily="ArchivoBlk" fontWeight={900} fontSize={28}>{peak} MPH</text>
        </g>; })()}
      </svg>
      <RedLabel text="" at={1e6} />{/* loads the channel fonts for the svg text */}
    </AbsoluteFill>
  );
};
