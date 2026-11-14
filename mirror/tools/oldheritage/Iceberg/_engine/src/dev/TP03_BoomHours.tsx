// TP03 BoomHours (replaces NightClock, 3 Nov audit): the night measured up the Zipper's own boom. A freeze of the jammed boom (scene video,
// cages and a ladder basket alongside), darkened and slowly pushed; a white rule is laid up the boom from 9:30 PM at its foot to about
// 12:30 AM at its head, hour ticks every hour, a red fill climbs it as the hours pass; "3 HOURS" bracket beside it; the source credited
// small (Robert Fox, chief deputy state fire marshal). The rule sits in the pushed layer, so it stays on the boom.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const BoomHours: React.FC<{ src: string; x: number; yBot: number; yTop: number; ticks: string[]; at?: number; len?: number; top: string; credit: string }> = ({ src, x, yBot, yTop, ticks, at = 18, len = 84, top, credit }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = 1.0 + 0.07 * io(f / durationInFrames);
  const draw = out(interpolate(f, [4, at], [0, 1], cl));          // the rule draws up the boom
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));        // red fill: the hours pass
  const H = yBot - yTop, yDraw = yBot - H * draw, yFill = yBot - H * g;
  const n = ticks.length - 1;
  const br = out(interpolate(f, [at + len, at + len + 14], [0, 1], cl));
  const cr = interpolate(f, [at + len + 6, at + len + 18], [0, 1], cl);
  const T = (s: number, extra: React.CSSProperties = {}) => ({ fontFamily: "ArchivoBlk", fontWeight: 900, fontSize: s, fill: "#fff", ...extra } as React.CSSProperties);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${x}px ${(yTop + yBot) / 2}px` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.42) saturate(.75)" }} />
        <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,0) 30%)" }} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* rule: dark under-stroke so it reads on the lit boom */}
          <line x1={x} y1={yBot} x2={x} y2={yDraw} stroke="rgba(0,0,0,.75)" strokeWidth={22} strokeLinecap="square" />
          <line x1={x} y1={yBot} x2={x} y2={yDraw} stroke="#fff" strokeWidth={8} strokeLinecap="square" />
          {g > 0 && <line x1={x} y1={yBot} x2={x} y2={yFill} stroke={RED} strokeWidth={8} strokeLinecap="square" />}
          {ticks.map((t, i) => {
            const y = yBot - H * (i / n), on = draw * n >= i - 0.01, lit = g * n >= i - 0.02;
            const o = interpolate(f, [at + (len * i) / n - 2, at + (len * i) / n + 8], [0, 1], cl);
            const end = i === 0 || i === n;
            return on ? (
              <g key={i}>
                <line x1={x - (end ? 34 : 24)} y1={y} x2={x + (end ? 34 : 24)} y2={y} stroke="rgba(0,0,0,.7)" strokeWidth={14} />
                <line x1={x - (end ? 34 : 24)} y1={y} x2={x + (end ? 34 : 24)} y2={y} stroke={lit ? RED : "#fff"} strokeWidth={6} />
                <g opacity={i === 0 ? draw : o}>
                  <rect x={x - 66 - (end ? 290 : 220)} y={y - 30} width={end ? 290 : 220} height={60} fill="rgba(0,0,0,.72)" />
                  <text x={x - 82} y={y + 16} textAnchor="end" style={T(end ? 44 : 38, { fill: lit && i > 0 ? "#fff" : "#fff", opacity: end ? 1 : 0.85 })}>{t}</text>
                </g>
              </g>
            ) : null;
          })}
          {/* span bracket on the right side of the boom */}
          {br > 0 && (
            <g opacity={br} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }}>
              <path d={`M ${x + 70} ${yBot} L ${x + 100} ${yBot} L ${x + 100} ${yBot - H * br} L ${x + 70} ${yBot - H * br}`} fill="none" stroke="#fff" strokeWidth={6} />
              <rect x={x + 120} y={(yTop + yBot) / 2 - 42} width={300} height={84} fill="rgba(0,0,0,.72)" />
              <text x={x + 140} y={(yTop + yBot) / 2 + 22} style={T(64)}>3 HOURS</text>
            </g>
          )}
        </svg>
      </AbsoluteFill>
      <RedLabel text={top} at={at + len + 4} x={0.33} y={0.92} size={42} />
      <div style={{ position: "absolute", right: 60, bottom: 44, opacity: cr, fontFamily: "Elite", fontSize: 30, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.9)" }}>{credit}</div>
    </AbsoluteFill>
  );
};
