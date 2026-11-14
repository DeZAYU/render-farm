// stat / CompareBars: two durations RACE as bars (8 s vs 2 s; "< 1 s" vs "the minute after"). REF Visual Venture §11 infographic in world space
// @3:28.0 (balloon altitude "19,000FT -> X2 -> 9,500FT": quick-start / long-settle camera, bezier (0.31,0,0,0.957), elements land on their words)
// + VV §15 rule 10 "mechanical rhythms where the meaning is mechanical" (a duration grows at a CONSTANT rate) + DD two-tone (white / red).
// Map: c03 #20 (slow stop 8 s vs e-stop 2 s, then the short bar greys under "LAST RESORT ONLY"), c06 #25 (the fall < 1 s vs the minute after).
// OUR VERSION: bars grow LINEARLY in (scaled) real time from a shared start line with a seconds ruler under them, the elapsed time counts at each
// bar's tip; the frame creeps in +0.8 %/s; optional grey-out with a red tag on the meaning word.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, RC, W, clamp01, fs, ghost } from "../../core";

export type Race = { label: string; seconds: number; at: number; display?: string; red?: boolean };
export type CompareBarsProps = { bars: Race[]; timeScale?: number; maxLen?: number; grey?: { index: number; at: number; tag: string }; x0?: number; cap?: number; labelCap?: number; subCap?: number };
export const CompareBars: React.FC<CompareBarsProps> = ({ bars, timeScale = 0.25, maxLen = 1300, grey, x0 = 0.14 * W, cap = 44, labelCap = 32, subCap = 28 }) => {
  const f = useCurrentFrame();
  const maxS = Math.max(...bars.map((b) => b.seconds));
  const pxs = maxLen / maxS;
  const pitch = 230, top0 = H * 0.5 - ((bars.length - 1) * pitch) / 2;
  const ticksEvery = maxS <= 12 ? 1 : maxS <= 70 ? 10 : 60;
  const push = 1 + 0.008 * (f / 30);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 45% 50%, #101214 0%, #030303 80%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push.toFixed(5)})` }}>
        {/* the shared start line */}
        <div style={{ position: "absolute", left: x0 - 3, top: top0 - 90, width: 4, height: (bars.length - 1) * pitch + 230, background: "rgba(240,240,240,.55)", opacity: clamp01((f + 1) / 6) }} />
        {/* seconds ruler */}
        <div style={{ position: "absolute", left: x0, top: top0 + (bars.length - 1) * pitch + 150, width: maxLen, height: 30, opacity: 0.55 * clamp01((f - 2) / 10) }}>
          {Array.from({ length: Math.floor(maxS / ticksEvery) + 1 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: i * ticksEvery * pxs - 1, top: 0, width: 2, height: i % 5 === 0 || ticksEvery > 1 ? 16 : 9, background: "#CFCFCF" }}>
              {i % (ticksEvery > 1 ? 1 : 2) === 0 ? <div style={{ position: "absolute", top: 20, left: -50, width: 100, textAlign: "center", fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", subCap), color: "#BDBDBD" }}>{i * ticksEvery}s</div> : null}
            </div>
          ))}
        </div>
        {bars.map((b, i) => {
          const k = f - b.at;
          const dur = b.seconds * 30 * timeScale;
          const u = clamp01(k / dur); // constant rate
          const len = Math.max(0, b.seconds * pxs * u);
          const done = k >= dur;
          const isGrey = grey && grey.index === i && f >= grey.at;
          const gk = grey ? EZ.out3(clamp01((f - grey.at) / 10)) : 0;
          const col = b.red ? RC.ringRed : "#EDEDED";
          const y = top0 + i * pitch;
          const valueText = done ? (b.display ?? `${b.seconds} s`) : `${(b.seconds * u).toFixed(b.seconds < 3 ? 1 : 0)} s`;
          const lo = ghost(k + 4, 4, 0.2);
          return (
            <div key={i} style={{ position: "absolute", left: x0, top: y, opacity: k < -4 ? 0 : 1 }}>
              <div style={{ position: "absolute", left: 4, top: -(labelCap / 0.727 + 50), fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", labelCap), letterSpacing: "0.06em", color: "#DCDCDC", opacity: lo, whiteSpace: "nowrap" }}>{b.label}</div>
              <div style={{ position: "absolute", left: 0, top: -36, width: Math.max(len, 0.0001), height: 72, background: isGrey ? `rgba(110,110,110,${(1 - 0.35 * gk).toFixed(2)})` : col,
                boxShadow: isGrey ? "none" : b.red ? "0 0 22px rgba(227,10,16,.45), inset 0 2px 0 rgba(255,255,255,.25)" : "0 0 18px rgba(255,255,255,.18), inset 0 2px 0 rgba(255,255,255,.4)" }} />
              {k >= 0 ? (
                <div style={{ position: "absolute", left: len + 22, top: -36, height: 72, display: "flex", alignItems: "center", fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", cap),
                  color: isGrey ? "#8A8A8A" : col, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textShadow: "0 3px 8px rgba(0,0,0,.7)" }}>{valueText}</div>
              ) : null}
              {isGrey ? (
                <div style={{ position: "absolute", left: len * 0.5, top: 52, transform: `translateX(-30%) rotate(-3deg) scale(${(1.3 - 0.3 * gk).toFixed(3)})`, opacity: gk, padding: "8px 18px", background: "#C8000E",
                  fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", labelCap), letterSpacing: "0.05em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 6px 16px rgba(0,0,0,.6)" }}>{grey!.tag}</div>
              ) : null}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
