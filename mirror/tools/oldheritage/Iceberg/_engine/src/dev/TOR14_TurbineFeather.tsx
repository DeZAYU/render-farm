// TOR14 TurbineFeather: the mechanism the line describes, drawn in white over the real wind farm (blurred footage): a turbine's rotor
// spins in rising wind (streaks), then each blade pitches edge-on into the wind (feathers: the blade outline narrows to a sliver) and
// the rotor coasts to a stop with the brake. Line art only, channel white; one red dot marks the brake on the hub when it engages.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const TurbineFeather: React.FC<{ bg: string; bgFrom: number; featherAt: number; stopAt: number }> = ({ bg, bgFrom, featherAt, stopAt }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  // rotor angle: constant speed, then decelerate (integral of an eased speed curve)
  const w0 = 9; // deg per frame
  const decel = (fr: number) => { const a = featherAt, b = stopAt; if (fr <= a) return w0 * fr; const T = b - a, x = Math.min(fr - a, T); return w0 * a + w0 * (x - (x * x) / (2 * T)); };
  const ang = decel(f) % 360;
  const pitch = io(interpolate(f, [featherAt, featherAt + 22], [0, 1], cl)); // 0 = flat to the wind, 1 = feathered
  const brake = interpolate(f, [stopAt - 10, stopAt], [0, 1], cl);
  const cx = width * 0.5, cy = height * 0.4, R = height * 0.33, tower = height * 0.95;
  const blade = (deg: number, i: number) => {
    const wMax = 34, w = wMax * (1 - 0.85 * pitch);
    const pts = [[0, -14], [w, -R * 0.18], [w * 0.55, -R * 0.75], [0, -R], [-w * 0.35, -R * 0.75], [-w * 0.6, -R * 0.18]].map(([x, y]) => `${x},${y}`).join(" ");
    return <polygon key={i} points={pts} transform={`translate(${cx} ${cy}) rotate(${deg})`} fill="rgba(255,255,255,.12)" stroke="#fff" strokeWidth={4} strokeLinejoin="round" />;
  };
  const streak = (i: number) => { const y = height * (0.15 + 0.1 * i), sp = 38 * (1 + 0.4 * (i % 3)); const x = ((f * sp + i * 433) % (width + 600)) - 300;
    return <line key={i} x1={x} y1={y} x2={x + 220} y2={y} stroke="rgba(255,255,255,.35)" strokeWidth={2} strokeLinecap="round" />; };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(9px) brightness(.42) saturate(.6)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 3px 8px rgba(0,0,0,.6))" }}>
        {Array.from({ length: 8 }, (_, i) => streak(i))}
        <polygon points={`${cx - 12},${cy + 20} ${cx + 12},${cy + 20} ${cx + 22},${tower} ${cx - 22},${tower}`} fill="rgba(255,255,255,.1)" stroke="#fff" strokeWidth={4} />
        <rect x={cx - 34} y={cy - 18} width={78} height={36} rx={10} fill="rgba(255,255,255,.12)" stroke="#fff" strokeWidth={4} />
        {[0, 120, 240].map((d, i) => blade(ang + d, i))}
        <circle cx={cx} cy={cy} r={15} fill={brake > 0 ? `rgba(227,20,27,${brake})` : "#111"} stroke="#fff" strokeWidth={4} />
      </svg>
    </AbsoluteFill>
  );
};
