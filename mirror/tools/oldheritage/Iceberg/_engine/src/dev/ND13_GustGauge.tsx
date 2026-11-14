// ND13 GustGauge: forecast vs. reality on one wind-speed ruler (mph) over the darkened drive. The forecast band (sustained range) fills
// in white, the forecast gust gets its tick, then a red bar runs past it to the gust that was measured. Every number is a spoken fact.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const GustGauge: React.FC<{ bg: string; bgFrom: number; max?: number; band: [number, number]; bandAt: number; gust: number; gustAt: number; real: number; realAt: number; bandLabel: string; gustLabel: string; realLabel: string }> =
  ({ bg, bgFrom, max = 100, band, bandAt, gust, gustAt, real, realAt, bandLabel, gustLabel, realLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const x0 = width * 0.1, x1 = width * 0.9, y = height * 0.6;
  const X = (v: number) => x0 + (x1 - x0) * (v / max);
  const o = interpolate(f, [0, 10], [0, 1], cl);
  const gb = out(interpolate(f, [bandAt, bandAt + 16], [0, 1], cl));
  const gg = out(interpolate(f, [gustAt, gustAt + 12], [0, 1], cl));
  const gr = io(interpolate(f, [realAt, realAt + 22], [0, 1], cl));
  const drift = 1.04 + 0.05 * (f / durationInFrames);
  const shake = gr > 0 && gr < 1 ? Math.sin(f * 3.1) * 3 * (1 - gr) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", transform: `scale(${drift})`, filter: "blur(7px) brightness(.48) saturate(.75)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke="rgba(255,255,255,.8)" strokeWidth={3} />
        {Array.from({ length: max / 5 + 1 }, (_, i) => i * 5).map((v) => (
          <g key={v}>
            <line x1={X(v)} y1={y - (v % 10 === 0 ? 24 : 12)} x2={X(v)} y2={y} stroke="#fff" strokeWidth={v % 10 === 0 ? 3 : 1.5} opacity={v % 10 === 0 ? 0.9 : 0.5} />
            {v % 10 === 0 && <text x={X(v)} y={y + 56} fill="rgba(255,255,255,.75)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={36} textAnchor="middle">{v}</text>}
          </g>
        ))}
        <text x={x1 + 18} y={y + 8} fill="rgba(255,255,255,.6)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={24}>MPH</text>
        {/* forecast band */}
        {gb > 0 && <rect x={X(band[0])} y={y - 70} width={(X(band[1]) - X(band[0])) * gb} height={70} fill="rgba(255,255,255,.22)" stroke="#fff" strokeWidth={4} />}
        {/* forecast gust */}
        {gg > 0 && <g opacity={gg}><line x1={X(gust)} y1={y - 120 * gg} x2={X(gust)} y2={y} stroke="#fff" strokeWidth={5} strokeDasharray="10 8" /></g>}
        {/* what came */}
        {gr > 0 && <g>
          <rect x={X(band[1])} y={y - 34} width={(X(real) - X(band[1])) * gr} height={34} fill={RED} opacity={0.9} />
          <line x1={X(band[1]) + (X(real) - X(band[1])) * gr} y1={y - 150} x2={X(band[1]) + (X(real) - X(band[1])) * gr} y2={y} stroke={RED} strokeWidth={7} />
        </g>}
      </svg>
      <RedLabel text={bandLabel} at={bandAt + 6} hold={realAt - bandAt - 14} x={(X(band[0]) + X(band[1])) / 2 / width} y={(y - 120) / height} size={36} />
      <RedLabel text={gustLabel} at={gustAt + 6} hold={realAt - gustAt - 14} x={X(gust) / width} y={(y - 170) / height} size={36} />
      <RedLabel text={realLabel} at={realAt + 18} x={Math.min(0.88, X(real) / width)} y={(y - 205) / height} size={48} />
    </AbsoluteFill>
  );
};
