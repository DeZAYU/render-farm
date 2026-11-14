// TOR05 | WarnDial: the warning lead time as a clock face laid over the storm itself. The footage plays dimmed behind a thin
// white dial (12 ticks, house white); the minute hand starts on the first warning time and sweeps, steady then settling, to the
// time it reached the city, filling the swept sector in channel red; both clock times are named in red labels on their words.
// minutes are counted from the hour of t0 (e.g. 3:09 PM = 3 h 9 min).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.3, 0, 0.2, 1);

export const WarnDial: React.FC<{ bg: string; bgFrom: number; t0: number; t1: number; sweepAt: number; landAt: number; l0: string; l1: string; l1At: number }> = ({ bg, bgFrom, t0, t1, sweepAt, landAt, l0, l1, l1At }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const u = io(interpolate(f, [sweepAt, landAt], [0, 1], cl));
  const tm = t0 + (t1 - t0) * u; // minutes since midnight-ish (only h:mm matters)
  const cx = width / 2, cy = height * 0.44, r = 270;
  const ang = (m: number) => ((m % 60) / 60) * 360, hAng = (m: number) => ((m / 60) % 12) / 12 * 360;
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const a0 = ang(t0), sw = (t1 - t0) * 6 * u; // minute hand sweeps 6 deg per minute (wraps twice for two hours)
  const turns = Math.floor(sw / 360), rest = sw - turns * 360;
  const sector = (from: number, d: number) => { if (d <= 0.05) return ""; const e = from + Math.min(359.9, d), L = Math.min(359.9, d) > 180 ? 1 : 0, rr = r * 0.92;
    return `M ${cx} ${cy} L ${cx + rr * Math.cos(rad(from))} ${cy + rr * Math.sin(rad(from))} A ${rr} ${rr} 0 ${L} 1 ${cx + rr * Math.cos(rad(e))} ${cy + rr * Math.sin(rad(e))} Z`; };
  const mA = rad(a0 + sw), hA = rad(hAng(tm));
  const o = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "brightness(.38) saturate(.7) blur(3px)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: o }}>
        {turns >= 1 && <circle cx={cx} cy={cy} r={r * 0.92} fill="rgba(227,20,27,.22)" />}
        <path d={sector(a0, turns >= 1 ? rest : sw)} fill="rgba(227,20,27,.42)" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeWidth={5} style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,.7))" }} />
        {Array.from({ length: 12 }, (_, i) => { const a = rad(i * 30); return <line key={i} x1={cx + (r - 34) * Math.cos(a)} y1={cy + (r - 34) * Math.sin(a)} x2={cx + (r - 8) * Math.cos(a)} y2={cy + (r - 8) * Math.sin(a)} stroke="#fff" strokeWidth={i % 3 === 0 ? 6 : 3} />; })}
        <line x1={cx} y1={cy} x2={cx + r * 0.5 * Math.cos(hA)} y2={cy + r * 0.5 * Math.sin(hA)} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={cx + r * 0.82 * Math.cos(mA)} y2={cy + r * 0.82 * Math.sin(mA)} stroke={RED} strokeWidth={7} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={12} fill={RED} stroke="#fff" strokeWidth={3} />
      </svg>
      <RedLabel text={l0} at={6} hold={l1At - 10} x={0.5} y={0.87} size={42} />
      <RedLabel text={l1} at={l1At} x={0.5} y={0.87} size={42} />
    </AbsoluteFill>
  );
};
