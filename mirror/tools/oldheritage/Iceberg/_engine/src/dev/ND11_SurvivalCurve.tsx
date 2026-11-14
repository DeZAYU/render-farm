// ND11 SurvivalCurve: the avalanche survival curve, drawn over a dark copy of the dig footage. Data: Brugger et al. 2001 (Swiss
// avalanche data 1981-1998, completely buried victims): ~91 % alive at 18 min, ~34 % at 35 min, a plateau, ~7 % at 130 min.
// The curve draws minute by minute; a white marker stands at 15 minutes, the red label lands on it, then the line drops away.
// Built for "Most people buried in an avalanche survive if they're dug out within about fifteen minutes, and after that the odds fall away fast."
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const DATA: [number, number][] = [[0, 100], [10, 96], [18, 91], [22, 78], [27, 58], [31, 44], [35, 34], [45, 31], [60, 29], [90, 26], [110, 15], [130, 7], [150, 5]];
const surv = (m: number) => { for (let i = 1; i < DATA.length; i++) if (m <= DATA[i][0]) { const [a, pa] = DATA[i - 1], [b, pb] = DATA[i]; return pa + (pb - pa) * (m - a) / (b - a); } return DATA[DATA.length - 1][1]; };

export const ND11_SurvivalCurve: React.FC<{ bg: string; bgFrom?: number; markAt: number; drawLen: number; mark?: number; markLabel: string }> = ({ bg, bgFrom = 0, markAt, drawLen, mark = 15, markLabel }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const X0 = 260, X1 = 1700, Y0 = 860, Y1 = 230, M = 150;
  const X = (m: number) => X0 + (X1 - X0) * m / M, Y = (p: number) => Y0 - (Y0 - Y1) * p / 100;
  // drawing: the line reaches the marker exactly at markAt, then continues to the end over drawLen
  const k = f < markAt ? io(interpolate(f, [6, markAt], [0, 1], cl)) * mark : mark + (M - mark) * io(interpolate(f, [markAt + 8, markAt + 8 + drawLen], [0, 1], cl));
  const pts: string[] = []; for (let m = 0; m <= k; m += 0.5) pts.push(`${X(m).toFixed(1)} ${Y(surv(m)).toFixed(1)}`);
  pts.push(`${X(k).toFixed(1)} ${Y(surv(k)).toFixed(1)}`);
  const mk = out(interpolate(f, [markAt - 4, markAt + 10], [0, 1], cl));
  const o = interpolate(f, [0, 8], [0, 1], cl);
  const tick = (m: number) => <g key={m}><line x1={X(m)} y1={Y0} x2={X(m)} y2={Y0 + 14} stroke="rgba(255,255,255,.7)" strokeWidth={2} /><text x={X(m)} y={Y0 + 48} fill="rgba(255,255,255,.75)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={26} textAnchor="middle">{m}</text></g>;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(12px) brightness(.3) saturate(.5)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="rgba(255,255,255,.75)" strokeWidth={3} />
        <line x1={X0} y1={Y0} x2={X0} y2={Y1 - 20} stroke="rgba(255,255,255,.75)" strokeWidth={3} />
        {[0, 30, 60, 90, 120, 150].map(tick)}
        {[0, 50, 100].map((p) => <text key={p} x={X0 - 20} y={Y(p) + 9} fill="rgba(255,255,255,.75)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={26} textAnchor="end">{p}%</text>)}
        <text x={(X0 + X1) / 2} y={Y0 + 92} fill="rgba(255,255,255,.6)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={24} textAnchor="middle" letterSpacing={2}>MINUTES UNDER THE SNOW</text>
        <text x={X0 + 18} y={Y1 - 34} fill="rgba(255,255,255,.6)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={24} letterSpacing={2}>ALIVE WHEN FOUND</text>
        {mk > 0 && <line x1={X(mark)} y1={Y0} x2={X(mark)} y2={Y0 - (Y0 - Y1 + 40) * mk} stroke="#fff" strokeWidth={4} strokeDasharray="12 8" />}
        <polyline points={pts.join(" ")} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={pts.join(" ")} fill="none" stroke={RED} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={X(k)} cy={Y(surv(k))} r={10} fill="#fff" />
      </svg>
      <RedLabel text={markLabel} at={markAt + 2} x={(X(mark) + 190) / width} y={(Y1 + 110) / height} size={40} />
    </AbsoluteFill>
  );
};
