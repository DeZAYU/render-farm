// TP06 HoldBars — how long a flying coaster is meant to hold you face-down vs. how long this one did, at true scale on one axis over the
// darkened footage: a short white bar (the ride, ~2 min) and, on its second mount, a red bar that keeps running across the frame to ~2 hours
// (60x). Channel look: white frame lines, red bar, RedLabels; nothing else.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const HoldBars: React.FC<{ bg: string; bgFrom: number; rideAt: number; longAt?: number; longLen?: number; preset?: boolean }> = ({ bg, bgFrom, rideAt, longAt, longLen = 70, preset }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const L = 180, R = width - 180, PX = (R - L) / 120; // 120 minutes across
  const y1 = 470, y2 = 600, bh = 70;
  const k1 = preset ? 1 : out(interpolate(f, [rideAt, rideAt + 16], [0, 1], cl));
  const k2 = longAt === undefined ? 0 : io(interpolate(f, [longAt, longAt + longLen], [0, 1], cl));
  const z = 1 + 0.03 * io(f / durationInFrames), o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(10px) brightness(.34) saturate(.7)" }} />
      <AbsoluteFill style={{ opacity: o, transform: `scale(${z})` }}>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 3px 10px rgba(0,0,0,.8))" }}>
          {/* the minute axis */}
          <line x1={L} y1={y2 + bh + 40} x2={R} y2={y2 + bh + 40} stroke="rgba(255,255,255,.7)" strokeWidth={3} />
          {[0, 30, 60, 90, 120].map((m) => <g key={m}><line x1={L + m * PX} y1={y2 + bh + 28} x2={L + m * PX} y2={y2 + bh + 52} stroke="#fff" strokeWidth={3} />
            <text x={L + m * PX} y={y2 + bh + 92} fill="rgba(255,255,255,.85)" fontFamily="ArchivoBlk, Archivo" fontWeight={900} fontSize={28} textAnchor="middle">{m} MIN</text></g>)}
          <rect x={L} y={y1} width={Math.max(2, 2 * PX * k1)} height={bh} fill="#fff" />
          {k2 > 0 && <rect x={L} y={y2} width={120 * PX * k2} height={bh} fill={RED} stroke="#fff" strokeWidth={3} />}
        </svg>
        <RedLabel text="THE RIDE: ~2 MIN" at={rideAt + 10} x={(L + 260) / width} y={(y1 + bh / 2) / height} size={36} />
        {longAt !== undefined && <RedLabel text="MAY 1, 2018: ~2 HOURS" at={longAt + longLen - 6} x={0.62} y={(y2 - 40) / height} size={40} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
