// ND09 AfternoonRule — 10 January 2011 from 1 PM to 4 PM as a horizontal tape over a dark copy of the street footage: half-hour ticks,
// the camera slides along the tape so each spoken time lands at centre on its word; each event drops a white stem + a red dot and gets
// its RedLabel above the tape (call / rain stops). A grey band shades the half-hour of the cloudburst it follows from.
// Built for "Donna Rice got through to police at ten to two, and by half past two the rain over Toowoomba had stopped."
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** times in minutes after 1:00 PM */
export const AfternoonRule: React.FC<{ bg: string; bgFrom: number; events: { m: number; label: string; at: number }[]; band?: [number, number] }> = ({ bg, bgFrom, events, band }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const pxm = 15, y = H * 0.6;
  let cx = events[0].m - 12, prev = cx;
  for (const e of events) { if (f >= e.at - 16) { const k = io(interpolate(f, [e.at - 16, e.at + 4], [0, 1], cl)); cx = prev + (e.m - prev) * k; prev = e.m; } }
  const X = (m: number) => W / 2 + (m - cx) * pxm;
  const lab = (m: number) => { const h = 1 + Math.floor(m / 60), mm = Math.round(m % 60); return `${h}:${String(mm).padStart(2, "0")}`; };
  const o = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted playbackRate={0.5}
        style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(9px) brightness(.32) saturate(.6)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {band && <rect x={X(band[0])} y={y - 34} width={(band[1] - band[0]) * pxm} height={34} fill="rgba(255,255,255,.16)" />}
        <line x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,.8)" strokeWidth={3} />
        {Array.from({ length: 19 }, (_, i) => i * 10).map((m) => <g key={m}>
          <line x1={X(m)} y1={y - (m % 30 === 0 ? 28 : 12)} x2={X(m)} y2={y} stroke="#fff" strokeWidth={m % 30 === 0 ? 3 : 1.5} opacity={m % 30 === 0 ? 0.95 : 0.55} />
          {m % 30 === 0 && <text x={X(m)} y={y + 46} fill="rgba(255,255,255,.8)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={28} textAnchor="middle">{lab(m)} PM</text>}
        </g>)}
        {events.map((e, i) => { const g = out(interpolate(f, [e.at, e.at + 10], [0, 1], cl)); if (g <= 0) return null;
          return <g key={i} opacity={g}><line x1={X(e.m)} y1={y} x2={X(e.m)} y2={y - 70 * g} stroke="#fff" strokeWidth={2.5} /><circle cx={X(e.m)} cy={y} r={10 * g + 4} fill={RED} stroke="#fff" strokeWidth={3} /></g>; })}
      </svg>
      {events.map((e, i) => <RedLabel key={i} text={`${e.label} ${lab(e.m)}`} at={e.at + 4} x={Math.min(0.8, Math.max(0.2, X(e.m) / W))} y={(y - 130) / H} size={40} />)}
    </AbsoluteFill>
  );
};
