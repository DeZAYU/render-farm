// ND09 Hydrograph — the Lockyer Creek gauge reading as a stage graph over a dark, slow copy of the flood: a white metre axis (0-9 m) and a
// minute axis (0-30 min) draw in, the river line climbs 8 m in 23 minutes (the gauge's reported rise; the shape between is drawn as a
// steady climb, no invented wiggles), a red bracket marks the 23-minute span; the gauge is named. Then the trace "goes dead": the line
// greys out and flattens while the label stays (the reading was dismissed as a faulty gauge).
// Built for "Upstream, a gauge on Lockyer Creek showed the water rising eight metres in 23 minutes, and staff dismissed it as a faulty gauge."
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const Hydrograph: React.FC<{ bg: string; bgFrom: number; riseAt: number; riseLen: number; deadAt: number; label: string }> = ({ bg, bgFrom, riseAt, riseLen, deadAt, label }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const x0 = 470, x1 = 1450, y0 = 820, y1 = 250; // axes box
  const X = (min: number) => x0 + (min / 30) * (x1 - x0), Y = (m: number) => y0 - (m / 9) * (y0 - y1);
  const ax = out(interpolate(f, [4, 24], [0, 1], cl));
  const g = io(interpolate(f, [riseAt, riseAt + riseLen], [0, 1], cl));
  // stage: 0.4 m base for 2 min, then 8 m rise to minute 25 (2 + 23), shape = smoothstep (steady climb, eased at the ends)
  const pts: [number, number][] = [];
  const N = 60;
  for (let i = 0; i <= N * g; i++) { const m = (i / N) * 25; const u = Math.min(1, Math.max(0, (m - 2) / 23)); const s = u * u * (3 - 2 * u); pts.push([X(m), Y(0.4 + 8 * s)]); }
  const dead = out(interpolate(f, [deadAt, deadAt + 14], [0, 1], cl));
  const br = out(interpolate(f, [riseAt + riseLen, riseAt + riseLen + 14], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted playbackRate={0.5}
        style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(8px) brightness(.3) saturate(.6)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g opacity={ax}>
          <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * ax} y2={y0} stroke="#fff" strokeWidth={3} />
          <line x1={x0} y1={y0} x2={x0} y2={y0 - (y0 - y1) * ax} stroke="#fff" strokeWidth={3} />
          {Array.from({ length: 10 }, (_, m) => <g key={"y" + m}><line x1={x0 - (m % 2 ? 10 : 20)} y1={Y(m)} x2={x0} y2={Y(m)} stroke="#fff" strokeWidth={2} opacity={0.8} />
            {m % 2 === 0 && <text x={x0 - 32} y={Y(m) + 9} fill="rgba(255,255,255,.85)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={26} textAnchor="end">{m} M</text>}
            <line x1={x0} y1={Y(m)} x2={x1} y2={Y(m)} stroke="rgba(255,255,255,.08)" strokeWidth={1} /></g>)}
          {Array.from({ length: 7 }, (_, i) => i * 5).map((m) => <g key={"x" + m}><line x1={X(m)} y1={y0} x2={X(m)} y2={y0 + 16} stroke="#fff" strokeWidth={2} />
            <text x={X(m)} y={y0 + 50} fill="rgba(255,255,255,.85)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={26} textAnchor="middle">{m} MIN</text></g>)}
        </g>
        {pts.length > 1 && <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={dead > 0 ? `rgba(255,255,255,${1 - 0.6 * dead})` : "#fff"} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={dead > 0.5 ? "14 10" : undefined} />}
        {g >= 1 && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={11} fill={dead > 0.5 ? "rgba(255,255,255,.4)" : RED} stroke="#fff" strokeWidth={3} />}
        {br > 0 && <g opacity={br}>
          <line x1={X(2)} y1={y1 - 40} x2={X(2) + (X(25) - X(2)) * br} y2={y1 - 40} stroke={RED} strokeWidth={5} />
          <line x1={X(2)} y1={y1 - 54} x2={X(2)} y2={y1 - 26} stroke={RED} strokeWidth={5} />
          {br > 0.98 && <line x1={X(25)} y1={y1 - 54} x2={X(25)} y2={y1 - 26} stroke={RED} strokeWidth={5} />}
        </g>}
      </svg>
      <RedLabel text={label} at={10} y={0.92} size={42} />
    </AbsoluteFill>
  );
};
