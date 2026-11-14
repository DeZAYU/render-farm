// ND05 GaugeStaff — the Poyo gauge's last reading as a river gauge staff: a white graduated staff over a dark copy of the flood footage,
// its top warning level marked in red; the water column climbs past it to fifteen times that height (the flow's real ratio, 2,282 vs the
// warning threshold), the reading is named, then the staff tips over and is carried out of frame ("Then the water carried the gauge away").
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1), inn = Easing.bezier(0.5, 0, 0.9, 0.4);

export const GaugeStaff: React.FC<{ bg: string; bgFrom: number; ratio: number; warnAt: number; riseAt: number; riseLen: number; readLabel: string; readAt: number; loseAt: number; warnLabel?: string; warn2At?: number }> =
  ({ bg, bgFrom, ratio, warnAt, riseAt, riseLen, readLabel, readAt, loseAt, warnLabel = "TOP WARNING LEVEL", warn2At }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const base = H * 0.9, unit = 52;                 // px per "warning level" step
  const staffH = unit * (ratio + 1.2), x = W * 0.42, sw = 74;
  const lvl = ratio * io(interpolate(f, [riseAt, riseAt + riseLen], [0, 1], cl)) + 0.25;
  // the camera starts low on the warning mark and rises with the water
  const camY = 0; // the whole staff fits the frame: water and warning mark stay in view together
  const lose = inn(interpolate(f, [loseAt, loseAt + 26], [0, 1], cl));
  const appear = out(interpolate(f, [0, 14], [0, 1], cl));
  const waterTop = base - lvl * unit;
  const wave = (k: number) => Array.from({ length: 25 }, (_, i) => `${(i / 24) * W} ${waterTop + Math.sin(i * 0.9 + f * 0.25 + k) * 5}`).join(" L");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(9px) brightness(.3) saturate(.7)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: appear }}>
        <g transform={`translate(0 ${-camY})`}>
          {/* the staff: carried off at the end (tilts, slides right and down) */}
          <g transform={`translate(${lose * 900} ${lose * 160}) rotate(${lose * 38} ${x} ${base})`} opacity={1 - lose * 0.2}>
            <rect x={x - sw / 2} y={base - staffH} width={sw} height={staffH} fill="rgba(245,245,240,.92)" stroke="#fff" strokeWidth={4} />
            {Array.from({ length: Math.round(ratio + 1.2) * 5 }, (_, i) => { const y = base - (i / 5) * unit; const big = i % 5 === 0;
              return <rect key={i} x={x - sw / 2} y={y - (big ? 5 : 3)} width={big ? sw * 0.62 : sw * 0.34} height={big ? 6 : 4} fill="#111" />; })}
            {/* the top warning level */}
            <rect x={x - sw / 2 - 30} y={base - unit - 4} width={sw + 60} height={8} fill={RED} />
          </g>
          {/* water */}
          <path d={`M0 ${H * 4} L${wave(0)} L${W} ${H * 4} Z`} fill="rgba(150,110,70,.55)" />
          <path d={`M${wave(0)}`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.85} />
        </g>
      </svg>
      <RedLabel text={warnLabel} at={warnAt} hold={riseAt + 34 - warnAt} x={0.64} y={(base - unit - camY) / H} size={38} />
      {warn2At !== undefined && <RedLabel text={warnLabel} at={warn2At} hold={loseAt - warn2At - 4} x={0.64} y={(base - unit - camY) / H} size={38} />}
      <RedLabel text={readLabel} at={readAt} hold={loseAt - readAt + 6} x={0.68} y={0.2} size={46} />
    </AbsoluteFill>
  );
};
