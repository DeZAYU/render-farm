// TOR20 OutbreakClock: South Dakota on 24 June 2003 from the SPC tornado database: every tornado the state logged drops onto a NASA Blue
// Marble map at its own start time while a white hour rail runs 4 PM -> 10 PM under it (each track drawn start -> end). At the end the
// Kingsbury County outline and the Manchester F4's track light up. One designed beat for "sixty-seven tornadoes, all in under eight hours".
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";
import { KINGSBURY, SD_OUTLINE, SD_TORNADOES } from "./TOR20_data";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const OutbreakClock: React.FC<{ base: string; iw: number; ih: number; runFrom: number; runTo: number; kingsAt: number; z: [number, number]; focus: [number, number]; label: string }> = ({ base, iw, ih, runFrom, runTo, kingsAt, z, focus, label }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames } = useVideoConfig();
  const zz = z[0] + (z[1] - z[0]) * io(f / durationInFrames);
  const b = Math.max(W / iw, H / ih) * zz;
  const ox = Math.min(0, Math.max(W - iw * b, W / 2 - focus[0] * b)), oy = Math.min(0, Math.max(H - ih * b, H / 2 - focus[1] * b));
  const S = (x: number, y: number) => [ox + x * b, oy + y * b];
  const mins = interpolate(f, [runFrom, runTo], [0, 360], cl); // minutes after 4 PM CST
  const outl = io(interpolate(f, [0, 16], [0, 1], cl));
  const d = (pts: [number, number][]) => "M" + pts.map(([x, y]) => S(x, y).map((v) => v.toFixed(1)).join(" ")).join(" L") + " Z";
  const kg = out(interpolate(f, [kingsAt, kingsAt + 14], [0, 1], cl));
  // the hour rail
  const rx0 = W * 0.2, rx1 = W * 0.8, ry = H * 0.075, RX = (m: number) => rx0 + (rx1 - rx0) * (m / 360);
  const hours = ["4 PM", "5", "6", "7", "8", "9", "10 PM"];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(base)} style={{ position: "absolute", left: ox, top: oy, width: iw * b, height: ih * b, filter: "brightness(.62) saturate(.85)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={d(SD_OUTLINE)} fill="rgba(255,255,255,.05)" stroke="#fff" strokeWidth={4} pathLength={1} strokeDasharray={`${outl} 1`} strokeLinejoin="round" />
        {kg > 0 && <path d={d(KINGSBURY)} fill={`rgba(227,20,27,${0.22 * kg})`} stroke="#fff" strokeWidth={3} opacity={kg} />}
        {SD_TORNADOES.map(([x0, y0, x1, y1, t, mag], i) => {
          const g = out(interpolate(mins, [t, t + 10], [0, 1], cl)); if (g <= 0) return null;
          const A = S(x0, y0), B = S(x1, y1), E = [A[0] + (B[0] - A[0]) * g, A[1] + (B[1] - A[1]) * g];
          const big = mag >= 3, r = (big ? 11 : 7) * (1.8 - 0.8 * g);
          const hot = mag === 4 && kg > 0;
          return <g key={i}>
            {(Math.abs(B[0] - A[0]) + Math.abs(B[1] - A[1])) > 3 && <line x1={A[0]} y1={A[1]} x2={E[0]} y2={E[1]} stroke={hot ? "#fff" : RED} strokeWidth={hot ? 7 : big ? 5 : 3} strokeLinecap="round" />}
            <circle cx={A[0]} cy={A[1]} r={r} fill={RED} stroke="#fff" strokeWidth={big ? 3 : 2} opacity={0.4 + 0.6 * g} />
          </g>;
        })}
        <line x1={rx0} y1={ry} x2={rx1} y2={ry} stroke="rgba(255,255,255,.45)" strokeWidth={3} />
        <line x1={rx0} y1={ry} x2={RX(mins)} y2={ry} stroke="#fff" strokeWidth={5} />
        {hours.map((h, i) => <g key={i}><line x1={RX(i * 60)} y1={ry - 12} x2={RX(i * 60)} y2={ry + 12} stroke="#fff" strokeWidth={2} opacity={0.8} />
          <text x={RX(i * 60)} y={ry + 44} fill="rgba(255,255,255,.85)" fontSize={26} textAnchor="middle" style={{ fontFamily: "ArchivoBlk", fontWeight: 800 }}>{h}</text></g>)}
        <circle cx={RX(mins)} cy={ry} r={9} fill={RED} stroke="#fff" strokeWidth={3} />
      </svg>
      {(() => { const [x, y] = S(1779, 625); return <RedLabel text={label} at={kingsAt + 6} x={x / W} y={(y - 150) / H} size={34} />; })()}
    </AbsoluteFill>
  );
};
