// TP13 FireClock (day-strip form): the whole day of 2 Oct 2019 as 24 hour cells across the darkened morning-after footage.
// From the start time the cells catch one by one (ember red, a hot leading edge) as each spoken time is reached: under control,
// then declared out; a white bracket under the burnt run gives the span. Times in hours (0-24). (Not a dial: TP10 uses one.)
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export type ClockEv = { t: number; label: string; at: number };
export const FireClock: React.FC<{ bg: string; bgFrom?: number; start: ClockEv; events: ClockEv[]; span?: { label: string; at: number } }> = ({ bg, bgFrom = 0, start, events, span }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const x0 = 120, x1 = width - 120, cw = (x1 - x0) / 24, y = height * 0.5, h = 120;
  const X = (t: number) => x0 + t * cw;
  let head = start.t, prev = start.t;
  for (const e of events) { if (f >= e.at - 18) { head = prev + (e.t - prev) * io(interpolate(f, [e.at - 18, e.at + 4], [0, 1], cl)); prev = e.t; } }
  const enter = out(interpolate(f, [0, 14], [0, 1], cl));
  const flick = 0.85 + 0.15 * Math.sin(f / 2.3) * Math.sin(f / 3.7);
  const gs = span ? out(interpolate(f, [span.at, span.at + 16], [0, 1], cl)) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(8px) brightness(.3) saturate(.5)", transform: `scale(${1.04 + 0.04 * f / durationInFrames})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: enter, transform: `translateY(${(1 - enter) * 20}px)` }}>
        {/* the burnt run: from start to the head, ember red, hot edge */}
        <defs><linearGradient id="tp13edge" x1="0" x2="1"><stop offset="0" stopColor={RED} stopOpacity={0.85} /><stop offset="1" stopColor="#ffb347" stopOpacity={0.95} /></linearGradient></defs>
        <rect x={X(start.t)} y={y - h / 2} width={Math.max(0, X(head) - X(start.t))} height={h} fill={RED} opacity={0.8} />
        {head > start.t && <rect x={Math.max(X(start.t), X(head) - 26)} y={y - h / 2} width={Math.min(26, X(head) - X(start.t))} height={h} fill="url(#tp13edge)" opacity={flick} />}
        {/* the 24 cells */}
        {Array.from({ length: 24 }, (_, i) => <rect key={i} x={X(i)} y={y - h / 2} width={cw} height={h} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth={i % 6 === 0 ? 4 : 2} />)}
        <rect x={x0} y={y - h / 2} width={x1 - x0} height={h} fill="none" stroke="#fff" strokeWidth={5} />
        {[[0, "MIDNIGHT"], [6, "6 AM"], [12, "NOON"], [18, "6 PM"]].map(([t, s]) => (
          <text key={s as string} x={X(t as number) + 8} y={y + h / 2 + 40} fill="rgba(255,255,255,.85)" fontFamily="ArchivoBlk" fontWeight={800} fontSize={28}>{s}</text>))}
        {/* pins on the top edge */}
        {[start, ...events].map((e, i) => { const g = out(interpolate(f, [e.at, e.at + 10], [0, 1], cl)); if (g <= 0) return null;
          return <g key={i} opacity={g}><line x1={X(e.t)} y1={y - h / 2} x2={X(e.t)} y2={y - h / 2 - 70 * g} stroke="#fff" strokeWidth={4} /><circle cx={X(e.t)} cy={y - h / 2} r={11} fill="#fff" stroke={RED} strokeWidth={4} /></g>; })}
        {/* span bracket under the burnt run */}
        {gs > 0 && (() => { const a = X(start.t), b = a + (X(events[events.length - 1].t) - a) * gs, yb = y + h / 2 + 70;
          return <g><line x1={a} y1={yb} x2={b} y2={yb} stroke="#fff" strokeWidth={5} /><line x1={a} y1={yb - 16} x2={a} y2={yb + 16} stroke="#fff" strokeWidth={5} />{gs > 0.98 && <line x1={b} y1={yb - 16} x2={b} y2={yb + 16} stroke="#fff" strokeWidth={5} />}</g>; })()}
      </svg>
      {[start, ...events].map((e, i) => <RedLabel key={i} text={e.label} at={e.at + 4} x={Math.min(0.92, Math.max(0.08, X(e.t) / width))} y={(y - h / 2 - 100) / height} size={36} />)}
      {span && <RedLabel text={span.label} at={span.at + 10} x={((X(start.t) + X(events[events.length - 1].t)) / 2) / width} y={(y + h / 2 + 135) / height} size={44} />}
    </AbsoluteFill>
  );
};
