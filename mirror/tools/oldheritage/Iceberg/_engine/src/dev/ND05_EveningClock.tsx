// ND05 EveningClock — the evening of 29 Oct 2024 on one white clock face over a dark copy of the street footage: the hands run from the
// first event (the Poyo over its banks, ~18:30) to the phone alert (20:11); the hour sector they cover fills red as they go. Each event
// gets a RedLabel on its own word. Built for "Now hold on to the timing … By then the Poyo had been over its banks for well over an hour."
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Ev = { min: number; label: string; at: number }; // min = minutes after 12:00 (18:30 -> 390)
export const EveningClock: React.FC<{ bg: string; bgFrom: number; events: Ev[]; moves: { to: number; at: number; len: number }[]; start: number }> = ({ bg, bgFrom, events, moves, start }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  let m = start;
  for (const mv of moves) { const k = io(interpolate(f, [mv.at, mv.at + mv.len], [0, 1], cl)); if (k > 0) m = m + (mv.to - m) * k; }
  const cx = W * 0.5, cy = H * 0.45, R = 300;
  const appear = out(interpolate(f, [0, 16], [0, 1], cl));
  const push = 1 + 0.04 * io(f / D);
  const ang = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const pt = (deg: number, r: number) => [cx + Math.cos(ang(deg)) * r, cy + Math.sin(ang(deg)) * r];
  const hourDeg = (mm: number) => ((mm / 60) % 12) * 30, minDeg = (mm: number) => (mm % 60) * 6;
  // red sector: from the first event's hour angle to the current hour angle
  const a0 = hourDeg(start), a1 = hourDeg(m);
  const [sx, sy] = pt(a0, R - 26), [ex, ey] = pt(a1, R - 26);
  const sector = a1 - a0 > 0.2 ? `M${cx} ${cy} L${sx} ${sy} A${R - 26} ${R - 26} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${ex} ${ey} Z` : "";
  const [hx, hy] = pt(hourDeg(m), R * 0.52), [mx, my] = pt(minDeg(m), R * 0.82);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(10px) brightness(.3) saturate(.6)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: appear, transform: `scale(${push * (0.96 + 0.04 * appear)})`, transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r={R} fill="rgba(0,0,0,.35)" stroke="#fff" strokeWidth={6} />
        {sector && <path d={sector} fill={RED} opacity={0.55} />}
        {Array.from({ length: 60 }, (_, i) => { const big = i % 5 === 0; const [x0, y0] = pt(i * 6, R - (big ? 34 : 16)), [x1, y1] = pt(i * 6, R - 6);
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#fff" strokeWidth={big ? 5 : 2} opacity={big ? 0.95 : 0.55} />; })}
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={12} fill={RED} stroke="#fff" strokeWidth={4} />
      </svg>
      {events.map((e, i) => <RedLabel key={i} text={e.label} at={e.at} hold={events[i + 1] ? events[i + 1].at - e.at - 8 : 9999} x={0.5} y={0.86} size={44} />)}
    </AbsoluteFill>
  );
};
