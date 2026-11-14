// TOR20 PressureTrace: the real reading from the probe at Manchester (probe 3, digitised from the public-domain chart courtesy of Tim
// Samaras): the line draws in real order from the moment the probe is down, dives when the tornado crosses it (~82 s), and a red bracket
// measures the 100 mb drop. Then the chart slides aside and the same bracket becomes a height: ground vs about a kilometre up.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";
import { PROBE3 } from "./TOR20_data";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const PressureTrace: React.FC<{ bg: string; keys: [number, number][]; dropAt: number; secAt: number; railAt: number }> = ({ bg, keys, dropAt, secAt, railAt }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  // data-time cursor from frame keys [frame, seconds]
  let tc = 0;
  for (let i = 1; i < keys.length; i++) { const [fa, ta] = keys[i - 1], [fb, tb] = keys[i]; if (f >= fa) tc = interpolate(f, [fa, fb], [ta, tb], cl); }
  const gx0 = 300, gx1 = 1620, gy0 = 200, gy1 = 800;
  const X = (t: number) => gx0 + (gx1 - gx0) * (t / 225), Y = (p: number) => gy0 + (gy1 - gy0) * ((960 - p) / 120);
  const pts = PROBE3.filter(([t]) => t <= tc);
  const last = pts[pts.length - 1];
  const dWhite = pts.length > 1 ? "M" + pts.map(([t, p]) => `${X(t).toFixed(1)} ${Y(p).toFixed(1)}`).join(" L") : "";
  const dip = pts.filter(([t]) => t >= 76 && t <= 96);
  const dRed = dip.length > 1 ? "M" + dip.map(([t, p]) => `${X(t).toFixed(1)} ${Y(p).toFixed(1)}`).join(" L") : "";
  // camera: start close on the opening of the trace, pull out, then slide left for the height rail
  const zIn = interpolate(f, [0, keys[2][0]], [1.32, 1.0], { ...cl, easing: io });
  const rail = io(interpolate(f, [railAt, railAt + 22], [0, 1], cl));
  const tx = -300 * rail, dim = 1 - 0.45 * rail;
  const fin = interpolate(f, [0, 10], [0, 1], cl);
  const font = { fontFamily: "ArchivoBlk", fontWeight: 800 } as const;
  const br = out(interpolate(f, [dropAt, dropAt + 14], [0, 1], cl)), sb = out(interpolate(f, [secAt, secAt + 14], [0, 1], cl));
  const bx = X(110); // the pressure bracket
  const RXr = 1560; // height rail x (after the slide, in screen px)
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fin }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(18px) brightness(.28) saturate(.7)" }} />
      <AbsoluteFill style={{ transform: `translate3d(${tx.toFixed(2)}px,0,0) scale(${zIn.toFixed(4)})`, transformOrigin: `${gx0}px ${Y(950)}px`, opacity: dim }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225].map((t) => <g key={t}><line x1={X(t)} y1={gy0} x2={X(t)} y2={gy1} stroke="rgba(255,255,255,.12)" strokeWidth={1.5} />
            <text x={X(t)} y={gy1 + 40} fill="rgba(255,255,255,.75)" fontSize={24} textAnchor="middle" style={font}>{t}</text></g>)}
          {[960, 940, 920, 900, 880, 860, 840].map((p) => <g key={p}><line x1={gx0} y1={Y(p)} x2={gx1} y2={Y(p)} stroke="rgba(255,255,255,.12)" strokeWidth={1.5} />
            <text x={gx0 - 18} y={Y(p) + 8} fill="rgba(255,255,255,.75)" fontSize={24} textAnchor="end" style={font}>{p}</text></g>)}
          <line x1={gx0} y1={gy0} x2={gx0} y2={gy1} stroke="#fff" strokeWidth={3} /><line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke="#fff" strokeWidth={3} />
          <text x={(gx0 + gx1) / 2} y={gy1 + 84} fill="#fff" fontSize={26} textAnchor="middle" style={font}>SECONDS AFTER THE PROBE WENT DOWN</text>
          <text x={gx0 - 110} y={(gy0 + gy1) / 2} fill="#fff" fontSize={26} textAnchor="middle" style={font} transform={`rotate(-90 ${gx0 - 110} ${(gy0 + gy1) / 2})`}>MILLIBARS</text>
          {dWhite && <path d={dWhite} fill="none" stroke="#fff" strokeWidth={4} strokeLinejoin="round" />}
          {dRed && <path d={dRed} fill="none" stroke={RED} strokeWidth={5} strokeLinejoin="round" />}
          {last && <circle cx={X(last[0])} cy={Y(last[1])} r={8} fill={RED} stroke="#fff" strokeWidth={3} />}
          {/* time bracket: probe down -> tornado */}
          {sb > 0 && <g opacity={sb}><line x1={X(0)} y1={gy0 - 30} x2={X(0) + (X(83.7) - X(0)) * sb} y2={gy0 - 30} stroke={RED} strokeWidth={5} />
            <line x1={X(0)} y1={gy0 - 44} x2={X(0)} y2={gy0 - 16} stroke={RED} strokeWidth={5} />{sb > 0.98 && <line x1={X(83.7)} y1={gy0 - 44} x2={X(83.7)} y2={gy0 - 16} stroke={RED} strokeWidth={5} />}</g>}
          {/* pressure bracket: 950 -> 850 */}
          {br > 0 && <g opacity={br}><line x1={bx} y1={Y(950)} x2={bx} y2={Y(950) + (Y(850) - Y(950)) * br} stroke={RED} strokeWidth={6} />
            <line x1={bx - 16} y1={Y(950)} x2={bx + 16} y2={Y(950)} stroke={RED} strokeWidth={6} />{br > 0.98 && <line x1={bx - 16} y1={Y(850)} x2={bx + 16} y2={Y(850)} stroke={RED} strokeWidth={6} />}
            <line x1={X(83.7)} y1={Y(850)} x2={bx} y2={Y(850)} stroke="rgba(227,20,27,.6)" strokeWidth={2} strokeDasharray="8 6" /></g>}
        </svg>
      </AbsoluteFill>
      {/* labels sit in screen space; they slide with the chart */}
      <RedLabel text="82 SECONDS" at={secAt + 10} hold={railAt - secAt - 14} x={((X(42) - gx0) * zIn + gx0 + tx) / W} y={(gy0 - 84) / H} size={34} />
      <RedLabel text="100 MILLIBARS" at={dropAt + 10} x={((bx + 150 - gx0) * zIn + gx0 + tx) / W} y={(Y(900)) / H} size={36} />
      {/* height rail: the same 100 mb as a height (lower pressure = higher up) */}
      {rail > 0 && <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: rail }}>
        <line x1={RXr} y1={Y(950)} x2={RXr} y2={Y(950) + (Y(850) - Y(950)) * rail} stroke="#fff" strokeWidth={6} />
        <line x1={RXr - 30} y1={Y(950)} x2={RXr + 30} y2={Y(950)} stroke="#fff" strokeWidth={6} />
        <line x1={RXr - 60} y1={Y(850)} x2={RXr + 60} y2={Y(850)} stroke="#fff" strokeWidth={6} opacity={rail > 0.98 ? 1 : 0} />
      </svg>}
      <RedLabel text="ABOUT 1 KM UP" at={railAt + 22} x={(RXr + 10) / W} y={(Y(950) - 50) / H} size={34} />
      <RedLabel text="GROUND" at={railAt + 12} x={(RXr + 10) / W} y={(Y(850) + 52) / H} size={34} />
    </AbsoluteFill>
  );
};
