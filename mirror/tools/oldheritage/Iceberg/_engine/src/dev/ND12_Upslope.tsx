// ND12 Upslope: why the Front Range grows hail, on the real ground. The terrain profile is real: USGS 3DEP elevations sampled every
// ~3.5 km along 39.74 N from the plains east of Denver (104.2 W) to the Continental Divide country (106.0 W), drawn with the plains on the
// right and the Rockies on the left (vertical exaggeration ~25x). Moist air (white streaks) flows in from the plains, is forced up the
// slope, and a storm tower builds over the foothills. Wheat Ridge is marked on the profile. Built for "Warm, humid air from the plains is
// pushed up against the Rockies, and that lift builds storms tall enough to grow hail."
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const PROF: [number, number][] = [[-104.2, 1573], [-104.241, 1572], [-104.282, 1603], [-104.323, 1639], [-104.364, 1640], [-104.405, 1681], [-104.445, 1681], [-104.486, 1694], [-104.527, 1702], [-104.568, 1708], [-104.609, 1685], [-104.65, 1709], [-104.691, 1697], [-104.732, 1690], [-104.773, 1658], [-104.814, 1650], [-104.855, 1640], [-104.895, 1633], [-104.936, 1616], [-104.977, 1610], [-105.018, 1584], [-105.059, 1638], [-105.1, 1675], [-105.141, 1738], [-105.182, 1781], [-105.223, 1810], [-105.264, 1911], [-105.305, 2106], [-105.345, 2084], [-105.386, 2192], [-105.427, 2186], [-105.468, 2531], [-105.509, 2354], [-105.55, 2534], [-105.591, 2808], [-105.632, 3238], [-105.673, 2849], [-105.714, 2909], [-105.755, 3323], [-105.795, 3835], [-105.836, 3609], [-105.877, 3841], [-105.918, 3485], [-105.959, 3699], [-106.0, 3527]];
const X = (lon: number) => 1840 - (lon + 104.2) / -1.8 * 1760; // east (plains) on the right
const Y = (m: number) => 930 - (m - 1400) * 0.21;
const elev = (lon: number) => { for (let i = 1; i < PROF.length; i++) if (lon >= PROF[i][0]) { const [a, ea] = PROF[i - 1], [b, eb] = PROF[i]; return ea + (eb - ea) * (lon - a) / (b - a); } return PROF[PROF.length - 1][1]; };

export const ND12_Upslope: React.FC<{ bg: string; bgFrom?: number; towerAt: number; markLabel: string; rangeLabel: string }> = ({ bg, bgFrom = 0, towerAt, markLabel, rangeLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const draw = io(interpolate(f, [0, 18], [0, 1], cl));
  const tower = io(interpolate(f, [towerAt, durationInFrames], [0, 1], cl));
  const ground = "M" + PROF.map(([lon, m]) => `${X(lon).toFixed(1)} ${Y(m).toFixed(1)}`).join(" L") + ` L ${X(-106)} 1080 L ${X(-104.2)} 1080 Z`;
  // streaks: particles moving west (leftward), riding 40-160 px above the ground, lifted where it climbs
  const streaks = Array.from({ length: 16 }, (_, i) => {
    const ph = ((f * 0.006 + i / 16) % 1); const lon = -104.25 - ph * 1.25; const h = 40 + (i % 4) * 34;
    const lift = Math.max(0, (elev(lon) - 1700)) * 0.05;
    const x = X(lon), y = Y(elev(lon)) - h - lift; const len = 70;
    const lon2 = lon + 0.06; const y2 = Y(elev(lon2)) - h - Math.max(0, (elev(lon2) - 1700)) * 0.05;
    const o = Math.min(1, ph * 5) * Math.min(1, (1 - ph) * 4);
    return <line key={i} x1={x} y1={y} x2={x + len} y2={y2} stroke="#fff" strokeWidth={3} opacity={0.7 * o * draw} strokeLinecap="round" />;
  });
  const tx = X(-105.3), ty = Y(2100);
  const wr = X(-105.08);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(12px) brightness(.3) saturate(.4)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="nd12u"><rect x={1920 * (1 - draw)} y={0} width={1920} height={1080} /></clipPath></defs>
        <g clipPath="url(#nd12u)"><path d={ground} fill="rgba(12,12,12,.92)" stroke="#fff" strokeWidth={4} strokeLinejoin="round" /></g>
        {streaks}
        {/* the storm tower building over the foothills */}
        {tower > 0 && <path d={`M ${tx - 160} ${ty - 30} C ${tx - 170} ${ty - 30 - 260 * tower} ${tx - 60} ${ty - 40 - 520 * tower} ${tx + 10} ${ty - 40 - 560 * tower} C ${tx + 90} ${ty - 40 - 520 * tower} ${tx + 190} ${ty - 30 - 260 * tower} ${tx + 170} ${ty - 30} Z`}
          fill="rgba(220,228,236,.2)" stroke="#fff" strokeWidth={4} opacity={tower} />}
        <line x1={wr} y1={Y(elev(-105.08))} x2={wr} y2={Y(elev(-105.08)) - 110} stroke={RED} strokeWidth={4} />
        <circle cx={wr} cy={Y(elev(-105.08))} r={9} fill={RED} stroke="#fff" strokeWidth={3} />
      </svg>
      <RedLabel text={markLabel} at={14} x={wr / width} y={(Y(elev(-105.08)) - 140) / height} size={32} />
      <RedLabel text={rangeLabel} at={22} x={X(-105.8) / width} y={(Y(3900) - 50) / height} size={32} />
    </AbsoluteFill>
  );
};
