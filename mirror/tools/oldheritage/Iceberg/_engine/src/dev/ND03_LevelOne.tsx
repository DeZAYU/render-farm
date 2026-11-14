// ND03 LevelOne: the Japan Meteorological Agency's five volcanic alert levels as they were worded in 2014 (keyword in Japanese + an English
// rendering), stacked as a lit 3-D panel over a dark copy of the hikers' own footage. The levels build up from 5 to 1, then everything
// dims except level 1, "平常 / NORMAL" (the 2014 keyword, renamed in 2015), which locks in red under a white bracket on its word.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);
const LV: [number, string, string][] = [
  [5, "避難", "EVACUATE"], [4, "避難準備", "PREPARE TO EVACUATE"], [3, "入山規制", "MOUNTAIN CLOSED"], [2, "火口周辺規制", "CRATER AREA CLOSED"], [1, "平常", "NORMAL"],
];

export const LevelOne: React.FC<{ bg: string; bgFrom: number; lockAt: number; label?: string; quick?: boolean }> = ({ bg, bgFrom, lockAt, label, quick }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = f / durationInFrames;
  const lock = out(interpolate(f, [lockAt, lockAt + 14], [0, 1], cl));
  const RW = 1080, RH = 118, G = 16, top = (height - (RH * 5 + G * 4)) / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(16px) brightness(.28) saturate(.5)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: (width - RW) / 2, top, width: RW, transform: `rotateY(${-9 + 6 * io(u)}deg) rotateX(${4 - 3 * io(u)}deg) scale(${1 + 0.05 * io(u)})` }}>
          {LV.map(([n, jp, en], i) => {
            const g = quick ? 1 : out(interpolate(f, [4 + i * 5, 16 + i * 5], [0, 1], cl));
            const isOne = n === 1, dim = isOne ? 1 : 1 - 0.65 * lock;
            return (
              <div key={n} style={{ position: "relative", height: RH, marginBottom: G, display: "flex", alignItems: "center", opacity: g * dim, transform: `translateX(${(1 - g) * 40}px)` }}>
                <div style={{ width: RH, height: RH, background: isOne ? RED : "rgba(255,255,255,.1)", border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "ArchivoBlk", fontWeight: 900, fontSize: 64, color: isOne ? "#0B0B0B" : "#fff" }}>{n}</div>
                <div style={{ flex: 1, height: RH, marginLeft: 14, border: "4px solid rgba(255,255,255,.85)", background: isOne ? `rgba(227,20,27,${0.85 * lock})` : "rgba(0,0,0,.35)", display: "flex", alignItems: "center", padding: "0 30px", gap: 28 }}>
                  <span style={{ width: 300, flexShrink: 0, whiteSpace: "nowrap", fontSize: 46, fontWeight: 700, color: "#fff", fontFamily: "'Hiragino Sans', 'Yu Gothic', sans-serif" }}>{jp}</span>
                  <span style={{ fontFamily: "ArchivoBlk", fontWeight: 900, fontSize: 44, whiteSpace: "nowrap", color: isOne && lock > 0.5 ? "#0B0B0B" : "#fff", letterSpacing: "0.01em" }}>{en}</span>
                </div>
                {isOne && lock > 0 && <svg width={RW + 80} height={RH + 60} style={{ position: "absolute", left: -40, top: -30, overflow: "visible", opacity: lock }}>
                  {[[0, 0, 1, 1], [RW + 80, 0, -1, 1], [0, RH + 60, 1, -1], [RW + 80, RH + 60, -1, -1]].map(([x, y, dx, dy], k) =>
                    <path key={k} d={`M${x} ${y + dy * 34} V${y} H${x + dx * 34}`} fill="none" stroke="#fff" strokeWidth={6} transform={`translate(${-dx * (1 - lock) * 30} ${-dy * (1 - lock) * 30})`} />)}
                </svg>}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <RedLabel text="" at={1e9} />{/* loads the channel fonts */}
      {label && <RedLabel text={label} at={10} x={0.5} y={0.075} size={36} />}
    </AbsoluteFill>
  );
};
