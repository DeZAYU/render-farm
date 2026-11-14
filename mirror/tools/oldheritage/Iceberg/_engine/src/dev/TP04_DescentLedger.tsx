// TP04 DescentLedger — the eight riders as eight lit seats at the top of the arm, drawn over the darkened footage of the real arm:
// one by one each mark slides down the arm to the 30 m ladder platform and on to the ground; the eighth lands as the time label
// reads 6:00 AM, then a red bracket spans the night (stop -> last down) for the nine hours. No per-rider times are claimed:
// the descents are evenly paced, only the last time and the total are reported facts.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const DescentLedger: React.FC<{ bg: string; bgFrom: number; start: number; every: number; lastAt: number; spanAt: number }> = ({ bg, bgFrom, start, every, lastAt, spanAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const AX = width * 0.5, TOP = 150, GND = 960, LAD = GND - (GND - TOP) * 30 / 50;
  const z = 1 + 0.04 * io(f / durationInFrames), o = interpolate(f, [0, 8], [0, 1], cl);
  const span = out(interpolate(f, [spanAt, spanAt + 16], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(9px) brightness(.3) saturate(.6)" }} />
      <AbsoluteFill style={{ opacity: o, transform: `scale(${z})` }}>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 8px rgba(0,0,0,.8))" }}>
          <line x1={AX - 420} y1={GND} x2={AX + 420} y2={GND} stroke="rgba(255,255,255,.8)" strokeWidth={4} />
          <line x1={AX} y1={GND} x2={AX} y2={TOP} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
          <line x1={AX} y1={GND} x2={AX} y2={TOP} stroke="rgba(255,255,255,.3)" strokeWidth={24} style={{ filter: "blur(6px)" }} />
          {/* the ladder platform at 30 m */}
          <rect x={AX + 14} y={LAD - 10} width={70} height={20} fill="none" stroke="#fff" strokeWidth={4} />
          <line x1={AX + 84} y1={LAD + 10} x2={AX + 250} y2={GND} stroke="#fff" strokeWidth={4} />
          <text x={AX + 100} y={LAD - 22} fill="#fff" fontFamily="ArchivoBlk, Archivo" fontWeight={900} fontSize={28}>30 M</text>
          <text x={AX + 40} y={TOP + 10} fill="#fff" fontFamily="ArchivoBlk, Archivo" fontWeight={900} fontSize={28}>50 M</text>
          {Array.from({ length: 8 }, (_, i) => {
            const t0 = i === 7 ? lastAt - 30 : start + i * every;
            const u = io(interpolate(f, [t0, t0 + 26], [0, 1], cl));
            const xTop = AX - 133 + i * 38, xGnd = AX - 70 - 34 * i;
            let x: number, y: number;
            if (u <= 0) { x = xTop; y = TOP - 14; }
            else if (u < 0.15) { const v = u / 0.15; x = xTop + (AX - 34 - xTop) * v; y = TOP - 14 + 44 * v; }
            else if (u < 0.65) { const v = (u - 0.15) / 0.5; x = AX - 34; y = TOP + 30 + (LAD - TOP - 30) * v; }
            else { const v = (u - 0.65) / 0.35; x = AX - 34 + (xGnd - AX + 34) * v; y = LAD + (GND - 16 - LAD) * v; }
            return <rect key={i} x={x - 12} y={y - 12} width={24} height={24} fill={u >= 1 ? "#fff" : RED} stroke="#fff" strokeWidth={3} />;
          })}
          {span > 0 && <g>
            <line x1={AX + 330} y1={TOP} x2={AX + 330} y2={TOP + (GND - TOP) * span} stroke={RED} strokeWidth={6} />
            <line x1={AX + 312} y1={TOP} x2={AX + 348} y2={TOP} stroke={RED} strokeWidth={6} />
            {span > 0.98 && <line x1={AX + 312} y1={GND} x2={AX + 348} y2={GND} stroke={RED} strokeWidth={6} />}
          </g>}
        </svg>
        <RedLabel text="6:00 AM" at={lastAt + 2} hold={spanAt - lastAt + 2} x={(AX - 260) / width} y={(GND - 70) / height} size={40} />
        <RedLabel text="9 HOURS" at={spanAt + 14} x={(AX + 470) / width} y={((TOP + GND) / 2) / height} size={44} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
