// TP09 ArmStop (replaces FreezeBracket, 3 Nov audit): "jams while it's upside down". The clip's frame of a rider hanging head-down,
// darkened and pushed toward him; beside it a white-framed panel with a white-line side view of the ride: tower, hub, arm with the
// seat row at one end and a counterweight at the other. The arm swings from the loading position up over the top, catches with a small
// jolt and stops there; the seat row is now above the hub with every rider head-down (heads toward the hub); a red ring closes on
// the seat row and the RedLabel "STOPPED UPSIDE DOWN" lands.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const ArmStop: React.FC<{ src: string; focus: [number, number]; swingAt?: number; swingLen?: number }> = ({ src, focus, swingAt = 8, swingLen = 34 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = 1.03 + 0.09 * io(f / durationInFrames);
  const pin = out(interpolate(f, [0, 12], [0, 1], cl));
  // arm angle (deg, 0 = seat end straight down, 180 = straight up); swing up, overshoot, settle with a jolt = the jam
  const sw = io(interpolate(f, [swingAt, swingAt + swingLen], [0, 1], cl));
  const stopF = swingAt + swingLen;
  const jolt = f > stopF ? 7 * Math.exp(-(f - stopF) / 4) * Math.sin((f - stopF) * 1.3) : 0;
  const ang = 180 * sw + jolt;
  const ring = out(interpolate(f, [stopF + 4, stopF + 16], [0, 1], cl));
  // panel geometry
  const PX = 80, PY = 150, PW = 560, PH = 780;
  const hx = PX + PW / 2, hy = PY + 340, L = 250, Lc = 120;
  const r = (ang * Math.PI) / 180;
  const ex = hx - L * Math.sin(r), ey = hy + L * Math.cos(r);       // seat end
  const cx = hx + Lc * Math.sin(r), cy = hy - Lc * Math.cos(r);     // counterweight end
  // seat row: perpendicular to the arm at the seat end; riders sit "outward" from the hub, heads away from the hub when at the bottom
  const ux = Math.cos(r), uy = Math.sin(r);          // along the seat row
  const vx = -Math.sin(r), vy = Math.cos(r);         // from hub outward (down at rest)
  const seats = [-1.5, -0.5, 0.5, 1.5];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${focus[0]}px ${focus[1]}px` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${0.85 - 0.25 * pin})` }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: PX, top: PY, width: PW, height: PH, border: "5px solid #fff", background: "rgba(8,8,10,.78)", boxShadow: "0 18px 50px rgba(0,0,0,.7)",
        transform: `translateX(${(1 - pin) * -60}px)`, opacity: pin }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: pin, transform: `translateX(${(1 - pin) * -60}px)` }}>
        {/* tower */}
        <path d={`M ${hx - 120} ${PY + PH - 90} L ${hx} ${hy} L ${hx + 120} ${PY + PH - 90}`} fill="none" stroke="#fff" strokeWidth={6} />
        <line x1={hx - 170} y1={PY + PH - 90} x2={hx + 170} y2={PY + PH - 90} stroke="#fff" strokeWidth={6} />
        <text x={hx} y={PY + PH - 40} textAnchor="middle" style={{ fontFamily: "ArchivoBlk", fontWeight: 900, fontSize: 30, fill: "#fff", opacity: 0.8 }}>GROUND</text>
        {/* arm */}
        <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
        <rect x={cx - 26} y={cy - 26} width={52} height={52} fill="none" stroke="#fff" strokeWidth={6} transform={`rotate(${ang} ${cx} ${cy})`} />
        <circle cx={hx} cy={hy} r={14} fill="#fff" />
        {/* seat row + riders: seats fixed to the arm, heads toward the hub (up at loading, down over the top) */}
        <line x1={ex - ux * 90} y1={ey - uy * 90} x2={ex + ux * 90} y2={ey + uy * 90} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
        {seats.map((k, i) => {
          const sx = ex + ux * 45 * k, sy = ey + uy * 45 * k;
          const bx = sx - vx * 30, by = sy - vy * 30, hx2 = sx - vx * 52, hy2 = sy - vy * 52;
          return (
            <g key={i}>
              <line x1={sx} y1={sy} x2={bx} y2={by} stroke={ring > 0.5 ? RED : "#fff"} strokeWidth={6} strokeLinecap="round" />
              <circle cx={hx2} cy={hy2} r={11} fill={ring > 0.5 ? RED : "#fff"} />
            </g>
          );
        })}
        {ring > 0 && <circle cx={ex - vx * 22} cy={ey - vy * 22} r={128 - 24 * ring} fill="none" stroke={RED} strokeWidth={7} opacity={ring} />}
      </svg>
      <RedLabel text="STOPPED UPSIDE DOWN" at={stopF + 8} x={0.66} y={0.9} />
    </AbsoluteFill>
  );
};
