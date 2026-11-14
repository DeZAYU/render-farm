// ND01 RisingStaff: a true-scale side elevation over a darkened frame of the harbour. A two-storey house (7.5 m to the ridge) is the
// yardstick; the water rises to the first forecast (3 m, 14:49), then the 15:14 upgrade (6 m), then the camera pulls back while a red
// line climbs to the run-up estimated for Ofunato (23.6 m). Heights in metres, drawn to one scale (px per metre eases as the camera
// pulls out). Built for ND01's beat: "a number you can hold up against a harbour wall ... the real wave was many times that".
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const RisingStaff: React.FC<{ bg: string; at3: number; at6: number; atBig: number; big?: number; bigLabel: string }> = ({ bg, at3, at6, atBig, big = 23.6, bigLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // camera: px per metre 46 -> 28 as the red line climbs; ground line rises a little so 23.6 m fits
  const pull = io(interpolate(f, [atBig - 6, atBig + 34], [0, 1], cl));
  const ppm = 46 + (28 - 46) * pull, gy = 900 + (960 - 900) * pull;
  const Y = (m: number) => gy - m * ppm;
  const lvl = interpolate(f, [at3 - 4, at3 + 26, at6 - 4, at6 + 26], [0, 3, 3, 6], { ...cl, easing: io });
  const red = io(interpolate(f, [atBig, atBig + 40], [0, 1], cl)) * big;
  const hx = 1270; // house left edge (px at the start scale is re-derived from ppm)
  const hw = 9 * ppm, wall = 5.6 * ppm, ridge = 7.5 * ppm;
  const sx = 560; // staff x
  const drift = 1.06 + 0.04 * (f / durationInFrames);
  const o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", transform: `scale(${drift})`, filter: "blur(7px) brightness(.32) saturate(.55)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 55% 55%, rgba(255,255,255,.05) 0%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* water body up to the forecast level */}
        {lvl > 0.02 && <g>
          <rect x={0} y={Y(lvl)} width={width} height={gy - Y(lvl)} fill="rgba(150,180,200,.28)" />
          <line x1={0} x2={width} y1={Y(lvl)} y2={Y(lvl)} stroke="#fff" strokeWidth={3} />
        </g>}
        {/* ground */}
        <line x1={0} x2={width} y1={gy} y2={gy} stroke="rgba(255,255,255,.85)" strokeWidth={4} />
        {/* house, line art, true scale */}
        <path d={`M${hx} ${gy} V${gy - wall} L${hx + hw / 2} ${gy - ridge} L${hx + hw} ${gy - wall} V${gy} M${hx} ${gy - wall / 2} H${hx + hw}`} fill="none" stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
        {[0.2, 0.62].map((k, i) => <rect key={i} x={hx + hw * k} y={gy - wall * 0.42} width={hw * 0.18} height={wall * 0.22} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={2.5} />)}
        {[0.2, 0.62].map((k, i) => <rect key={"u" + i} x={hx + hw * k} y={gy - wall * 0.9} width={hw * 0.18} height={wall * 0.22} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={2.5} />)}
        {/* staff: a tick each metre, longer every 5 */}
        <line x1={sx} x2={sx} y1={gy} y2={Y(25)} stroke="rgba(255,255,255,.8)" strokeWidth={3} />
        {Array.from({ length: 26 }, (_, m) => (
          <g key={m}>
            <line x1={sx} x2={sx - (m % 5 === 0 ? 30 : 14)} y1={Y(m)} y2={Y(m)} stroke="#fff" strokeWidth={m % 5 === 0 ? 3 : 1.6} opacity={m % 5 === 0 ? 0.95 : 0.6} />
            {m % 5 === 0 && m > 0 && <text x={sx - 44} y={Y(m) + 10} fill="rgba(255,255,255,.85)" fontFamily="ArchivoBlk" fontWeight={800} fontSize={28} textAnchor="end">{m} M</text>}
          </g>
        ))}
        {/* the real run-up: red line climbing the staff, a red band from the ground to it */}
        {red > 0.05 && <g>
          <rect x={sx + 8} y={Y(red)} width={18} height={gy - Y(red)} fill={RED} opacity={0.9} />
          <line x1={sx - 30} x2={width} y1={Y(red)} y2={Y(red)} stroke={RED} strokeWidth={5} />
        </g>}
      </svg>
      <RedLabel text="FIRST FORECAST · 3 M" at={at3 + 10} hold={at6 - at3 - 8} x={0.5} y={(Y(3) - 44) / height} size={38} />
      <RedLabel text="15:14 · 6 M" at={at6 + 12} hold={atBig - at6 - 6} x={0.5} y={(Y(6) - 44) / height} size={38} />
      <RedLabel text={bigLabel} at={atBig + 36} x={0.5} y={(Y(big) - 44) / height} size={42} />
    </AbsoluteFill>
  );
};
