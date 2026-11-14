// stat / CounterStack: up to three stacked roll-ups, or one running timer that stops SHORT of a mark. REF Farrell text R9 counters (G04 money roll
// @GoFundMe 4:08.5: linear roll at a constant rate, stops dead ~0.3 s after the spoken number, glow spike on the landing frame; R06 drain) + Dashcam
// Vol.3 E5 two-tone stat @1:47.87 (white figure + red word, pop alpha .19 -> .82 -> .77 -> 1, red word rises 46 px). Map: c02 #3 ($ / m2 / per day),
// c05 #20 (a timer 0:00 -> 7:5x that stops short of 8:00, "ALMOST 8 MINUTES").
// OUR VERSION: a LEFT-ALIGNED COLUMN; each row lands on its own word, rolls, and when the next row lands the earlier rows step back (dim to 45 %,
// shift up), so the eye always sits on the newest figure. Timer mode: the mark ("8:00") waits as a hollow outline the roll never reaches.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, FONT, H, RC, W, clamp01, fs } from "../../core";
import { DefocusPlate } from "../../core/kits/verdict";
import { fmt, numPop, wordPop } from "../../core/kits/stat";

export type StackRow = { value: number; prefix?: string; suffix?: string; word: string; at: number; roll?: number; decimals?: number };
export type CounterStackProps = {
  media?: string; mediaStart?: number; rows?: StackRow[];
  timer?: { from: number; to: number; mark: number; at: number; dur: number; label: string; labelAt: number }; // seconds
  x?: number; cap?: number; labelCap?: number;
};
const tc = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
export const CounterStack: React.FC<CounterStackProps> = ({ media, mediaStart = 0, rows = [], timer, x = 0.16 * W, cap = 96, labelCap = 54 }) => {
  const f = useCurrentFrame();
  const fsz = fs("inter", cap);
  const pitch = cap * 1.9;
  if (timer) {
    const u = clamp01((f - timer.at) / timer.dur);
    const v = timer.from + (timer.to - timer.from) * u; // linear: time passing at a constant rate, stops dead
    const land = f >= timer.at + timer.dur ? Math.max(0, 1 - (f - timer.at - timer.dur) / 6) : 0;
    const p = numPop(f - timer.at), lw = wordPop(f - timer.labelAt);
    const big = fs("inter", cap * 2.1);
    return (
      <DefocusPlate media={media} mediaStart={mediaStart}>
        <div style={{ position: "absolute", left: x, top: H * 0.5, transform: "translateY(-60%)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: cap * 0.7, opacity: p.o, transform: `translateY(${p.y.toFixed(1)}px)` }}>
            <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: big, color: "#F4F4F4", fontVariantNumeric: "tabular-nums", lineHeight: 1,
              textShadow: `0 4px 12px rgba(0,0,0,.7), 0 0 ${(6 + 22 * land).toFixed(1)}px rgba(255,255,255,${(0.15 + 0.4 * land).toFixed(2)})` }}>{tc(v)}</div>
            <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: big * 0.62, lineHeight: 1, color: "transparent", WebkitTextStroke: "2px rgba(227,10,16,.85)", fontVariantNumeric: "tabular-nums", opacity: 0.9 }}>{tc(timer.mark)}</div>
          </div>
          <div style={{ marginTop: cap * 0.5, fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", labelCap * 1.1), color: RC.ringRed, letterSpacing: "0.02em", opacity: lw.o, transform: `translateY(${lw.y.toFixed(1)}px)`,
            textShadow: "0 0 14px rgba(227,10,16,.5), 0 3px 8px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{timer.label}</div>
        </div>
      </DefocusPlate>
    );
  }
  const top0 = H / 2 - ((rows.length - 1) * pitch) / 2;
  return (
    <DefocusPlate media={media} mediaStart={mediaStart}>
      {rows.map((r, i) => {
        if (f < r.at) return null;
        const p = numPop(f - r.at), w = wordPop(f - r.at - 6);
        const rollU = EZ.out3(clamp01((f - r.at + 1) / (r.roll ?? 16)));
        // step back once a later row has landed
        const later = rows.slice(i + 1).filter((q) => f >= q.at);
        const back = later.length ? EZ.out3(clamp01((f - later[0].at) / 12)) : 0;
        const dimO = 1 - 0.55 * back;
        const y = top0 + i * pitch - 10 * back;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translateY(-50%) translateY(${p.y.toFixed(1)}px)`, display: "flex", alignItems: "baseline", gap: cap * 0.36, opacity: p.o * dimO, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fsz, color: "#F4F4F4", fontVariantNumeric: "tabular-nums", lineHeight: 1, textShadow: "0 4px 12px rgba(0,0,0,.7)" }}>
              {r.prefix ?? ""}{fmt(r.value * rollU, "comma", r.decimals ?? 0)}{r.suffix ?? ""}
            </div>
            <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", labelCap), lineHeight: 1, color: RC.ringRed, opacity: w.o, transform: `translateY(${(w.y * 0.6).toFixed(1)}px)`, textShadow: "0 0 12px rgba(227,10,16,.5), 0 3px 8px rgba(0,0,0,.6)" }}>{r.word}</div>
          </div>
        );
      })}
    </DefocusPlate>
  );
};
