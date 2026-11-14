// TOR09 FujitaGauge: the original Fujita scale (F0-F5 wind bands, mph, as printed on the NWS Norman 3 May 1999 map legend) as a white
// column over the case's own footage. A red needle climbs to the measured wind (DOW 301 mph, reanalysis 321 mph) and runs out past the
// top of F5; then the chart's unused F6 band (319-379 mph) is drawn in as an empty dashed box: rated never.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Shot_FX } from "../lib/templates/n2fx/fx";
import { RED } from "../brand";
import { ARCH, mono, useChannelFonts } from "./TOR09_util";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const BANDS: [string, number, number][] = [["F0", 40, 72], ["F1", 73, 112], ["F2", 113, 157], ["F3", 158, 206], ["F4", 207, 260], ["F5", 261, 318]];

export const FujitaGauge: React.FC<{
  bg: string; bgFrom: number; fx?: number;
  needle: { v: number; at: number; label?: string }[]; // needle keys (frames); label shows in the value box once reached
  f5At?: number; f6At?: number; emptyAt?: number; intro?: boolean;
}> = ({ bg, bgFrom, fx = 0.62, needle, f5At, f6At, emptyAt, intro = true }) => {
  useChannelFonts();
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  const yB = 905, yT = 150, vMin = 40, vMax = 385, X = 330, W = 30;
  const y = (v: number) => yB - ((v - vMin) / (vMax - vMin)) * (yB - yT);
  const k = intro ? out(interpolate(f, [0, 16], [0, 1], cl)) : 1;
  // needle: keys hold, then a 22 f eased climb into each new value
  const keys: [number, number][] = [];
  needle.forEach((p, i) => { if (i === 0) keys.push([p.at, p.v]); else { keys.push([p.at - 22, needle[i - 1].v]); keys.push([p.at, p.v]); } });
  const v = keys.length > 1 ? mono(keys)(f) : needle[0].v;
  const ny = y(v), nOn = interpolate(f, [needle[0].at - 6, needle[0].at + 4], [0, 1], cl);
  const reached = [...needle].reverse().find((p) => f >= p.at - 2);
  const g6 = f6At !== undefined ? out(interpolate(f, [f6At, f6At + 20], [0, 1], cl)) : 0;
  const f5 = f5At !== undefined ? interpolate(f, [f5At, f5At + 10], [0, 1], cl) : 0;
  const pulse = emptyAt !== undefined && f >= emptyAt ? 0.5 + 0.5 * Math.cos(((f - emptyAt) / 30) * Math.PI) : 1;
  const capY = y(318);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Shot_FX src={bg} n={n} from={bgFrom} s0={1.04} s1={1.12} fx={fx} fy={0.55} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${0.72 * k}) 0%, rgba(0,0,0,${0.5 * k}) 34%, rgba(0,0,0,0) 62%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: k, transform: `translateX(${(1 - k) * -30}px)` }}>
        {BANDS.map(([nm, a, b], i) => {
          const top = y(b + 0.5), bot = y(a - 0.5), hot = nm === "F5" ? f5 : 0;
          return (
            <g key={nm}>
              <rect x={X} y={top + 2} width={W} height={bot - top - 4} fill={hot > 0 ? `rgba(227,20,27,${0.25 + 0.6 * hot})` : `rgba(255,255,255,${0.1 + i * 0.06})`} stroke="#fff" strokeWidth={3} />
              <text x={X - 26} y={(top + bot) / 2 + 13} textAnchor="end" fill="#fff" style={{ ...ARCH, fontSize: 38 }}>{nm}</text>
              <text x={X + W + 18} y={(top + bot) / 2 + 9} fill="rgba(255,255,255,.72)" style={{ ...ARCH, fontWeight: 700, fontSize: 24 }}>{nm === "F0" ? "UNDER 72" : `${a}–${b}`}</text>
            </g>
          );
        })}
        {/* the top of the scale as people used it: a hard white cap at 318 mph */}
        <line x1={X - 14} y1={capY} x2={X + W + 14} y2={capY} stroke="#fff" strokeWidth={5} />
        {/* F6: the band the chart had room for (319-379 mph), drawn empty */}
        {g6 > 0 && (() => { const top = y(379.5), bot = y(318.5), hgt = (bot - top) * g6;
          return <g opacity={pulse * 0.6 + 0.4}>
            <rect x={X} y={bot - hgt} width={W} height={hgt} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="10 8" />
            <text x={X - 26} y={(top + bot) / 2 + 13} textAnchor="end" fill="none" stroke="#fff" strokeWidth={2.4} style={{ ...ARCH, fontSize: 38 }} opacity={g6}>F6</text>
            <text x={X + W + 18} y={(top + bot) / 2 + 9} fill="rgba(255,255,255,.72)" style={{ ...ARCH, fontWeight: 700, fontSize: 24 }} opacity={g6}>319–379</text>
          </g>; })()}
        {/* needle */}
        <g opacity={nOn}>
          <line x1={X - 40} y1={ny} x2={X + W + 150} y2={ny} stroke="rgba(0,0,0,.5)" strokeWidth={10} />
          <line x1={X - 40} y1={ny} x2={X + W + 150} y2={ny} stroke={RED} strokeWidth={5} />
          <polygon points={`${X - 40},${ny - 12} ${X - 18},${ny} ${X - 40},${ny + 12}`} fill={RED} />
        </g>
      </svg>
      {reached?.label && (() => { const at = reached.at; const w = out(interpolate(f, [at, at + 9], [0, 1], cl));
        return <div style={{ position: "absolute", left: X + W + 170, top: ny - 30, opacity: nOn * k }}>
          <div style={{ background: RED, padding: "6px 14px", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`, boxShadow: "0 6px 18px rgba(0,0,0,.45)" }}>
            <div style={{ ...ARCH, fontSize: 42, lineHeight: 1, color: "#0B0B0B", whiteSpace: "pre" }}>{reached.label}</div>
          </div></div>; })()}
    </AbsoluteFill>
  );
};
