// WP05 device RailWord: the NTSB's probable-cause sentence (ntsb.gov, DCA14FR008) typed in Elite straight onto the near-frozen car-window
// shot of the cars burning on the tracks. On "a broken rail" those words turn red and a red rule draws under them; on "Hold on to those
// two words" every other word sinks back (dims, softens) so only BROKEN RAIL stays on the burning frame.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RED } from "../brand";
import { ARCH, useWpFonts } from "./WP01_kit";
import { Clip, cl, io } from "./WP45_kit";

const TEXT = "We determined that the probable cause of this accident was a broken rail caused by a reverse detail fracture with evidence of rolling contact fatigue.";
const KEY = [11, 12]; // "broken" "rail"

export const RailWord: React.FC<{ src: string; from: number; rate: number; n: number; at: { type0: number; type1: number; red: number; hold: number } }> = ({ src, from, rate, n, at }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const words = TEXT.split(" ");
  const typed = Math.round(interpolate(f, [at.type0, at.type1], [0, TEXT.length], cl));
  const red = io(interpolate(f, [at.red, at.red + 10], [0, 1], cl));
  const rule = io(interpolate(f, [at.red + 4, at.red + 22], [0, 1], cl));
  const sink = io(interpolate(f, [at.hold, at.hold + 24], [0, 1], cl));
  const s = 1.0 + 0.05 * io(Math.min(1, f / n));
  let pos = 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Clip src={src} from={from} rate={rate} n={n} s0={1.06} s1={1.16} fx={0.68} fy={0.72} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.6) 45%, rgba(0,0,0,0) 72%)" }} />
      <div style={{ position: "absolute", left: 120, top: 250, width: 980, transform: `scale(${s})`, transformOrigin: "0% 50%" }}>
        <div style={{ ...ARCH, fontSize: 24, color: "rgba(255,255,255,.85)", letterSpacing: "0.04em", whiteSpace: "nowrap", marginBottom: 34, opacity: interpolate(f, [0, 10], [0, 1], cl) * (1 - 0.8 * sink) }}>
          NATIONAL TRANSPORTATION SAFETY BOARD · PROBABLE CAUSE
        </div>
        <div style={{ fontFamily: "Elite", fontSize: 56, lineHeight: 1.36, color: "#F2F0EA", textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>
          {words.map((w, i) => {
            const start = pos; pos += w.length + 1;
            const shown = Math.max(0, Math.min(w.length, typed - start));
            const key = KEY.includes(i);
            return (
              <span key={i} style={{ position: "relative", color: key ? `rgb(${242 + (227 - 242) * red},${240 + (20 - 240) * red},${234 + (27 - 234) * red})` : undefined,
                opacity: key ? 1 : 1 - 0.86 * sink, filter: key ? undefined : `blur(${2.5 * sink}px)` }}>
                {w.slice(0, shown)}<span style={{ opacity: 0 }}>{w.slice(shown)}</span>
                {key && <span style={{ position: "absolute", left: 0, bottom: 2, height: 6, width: `${(i === KEY[KEY.length - 1] ? 100 : 118) * rule}%`, background: RED }} />}
                {" "}
              </span>
            );
          })}
        </div>
        <div style={{ fontFamily: "Elite", fontSize: 21, color: "rgba(255,255,255,.65)", marginTop: 30, opacity: interpolate(f, [at.type1, at.type1 + 12], [0, 1], cl) * (1 - sink) }}>
          NTSB · DCA14FR008 · LYNCHBURG, VIRGINIA
        </div>
      </div>
    </AbsoluteFill>
  );
};
