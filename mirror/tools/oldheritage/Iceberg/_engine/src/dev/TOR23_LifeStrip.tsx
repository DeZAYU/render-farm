// TOR23 (Elkhorn) — "A tornado emergency is in effect, and it will stay up for most of this tornado's life."
// The tornado's life as one strip (NWS DAT: on the ground 3:30-4:31 PM CDT, 61 min) laid over its own footage in a white frame that
// leans back in 3-D; the strip fills white minute by minute, then the red tornado-emergency band (IEM VTEC: first issued 3:38 PM in the
// OAX warning-17 statement, re-issued 3:41 PM with warning 22, which ran to 4:30 PM) sweeps across almost all of it.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const hm = (m: number) => { const t = 15 * 60 + 30 + m; const h = Math.floor(t / 60) - 12, mm = t % 60; return `${h}:${String(mm).padStart(2, "0")}`; };

export const LifeStrip: React.FC<{ bg: string; bgFrom: number; minutes: number; band: [number, number]; ticks: number[]; fillAt: number; fillLen: number; bandAt: number }> = ({ bg, bgFrom, minutes, band, ticks, fillAt, fillLen, bandAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 16], [0, 1], cl));
  const fill = io(interpolate(f, [fillAt, fillAt + fillLen], [0, 1], cl));
  const bnd = io(interpolate(f, [bandAt, bandAt + 26], [0, 1], cl));
  const x0 = 220, x1 = width - 220, y = 880, X = (m: number) => x0 + ((x1 - x0) * m) / minutes;
  const push = 1.02 + 0.05 * (f / durationInFrames);
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(16px) brightness(.3)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: 360, top: 56, width: 1200, height: 675, border: "6px solid #fff", overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.7)",
          transform: `translateY(${(1 - k) * 40}px) rotateX(${10 * k}deg) scale(${0.96 + 0.04 * k})`, transformOrigin: "50% 100%", opacity: k }}>
          <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})` }} />
        </div>
      </AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <rect x={x0} y={y - 22} width={x1 - x0} height={44} fill="rgba(0,0,0,.55)" stroke="#fff" strokeWidth={4} opacity={k} />
        <rect x={x0 + 4} y={y - 18} width={(x1 - x0 - 8) * fill} height={36} fill="#fff" opacity={0.92} />
        {bnd > 0 && <rect x={X(band[0])} y={y - 18} width={(X(band[1]) - X(band[0])) * bnd} height={36} fill={RED} />}
        {Array.from({ length: Math.floor(minutes / 10) + 1 }, (_, i) => i * 10).map((m) => (
          <line key={m} x1={X(m)} y1={y + 26} x2={X(m)} y2={y + 40} stroke="#fff" strokeWidth={3} opacity={0.7 * k} />
        ))}
        {[0, minutes].map((m) => <text key={m} x={X(m)} y={y + 72} fill="#fff" textAnchor="middle" fontFamily="ArchivoBlk" fontWeight={900} fontSize={30} opacity={k}>{hm(m)} PM</text>)}
        {ticks.map((m, i) => { const g = out(interpolate(f, [bandAt + i * 12, bandAt + i * 12 + 12], [0, 1], cl)); if (g <= 0) return null;
          return <g key={i} opacity={g}><line x1={X(m)} y1={y - 22} x2={X(m)} y2={y - 60 - i * 34} stroke={RED} strokeWidth={4} />
            <text x={X(m) + 8} y={y - 64 - i * 34} fill="#fff" fontFamily="ArchivoBlk" fontWeight={900} fontSize={28} style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 4 }}>{hm(m)}</text></g>; })}
      </svg>
      <RedLabel text="" at={1e6} />
    </AbsoluteFill>
  );
};
