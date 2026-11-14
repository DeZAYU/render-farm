// neon / LineObject: ONE object in white neon LINE work, drawn stroke by stroke, then a single meaningful change: a wall clock whose hands sweep
// and stop dead at a time; a phone handset whose number glows on its word; or any library glyph in line mode with a word. REF VV §7 neon
// pictograms (Visual Venture TV @ 0:32.3 / 19:26.4: white #FDFCFD neon, warm 30-40 px bloom, slow push) + VV §9 hard word pop.
// Ours: line-only (no fills), a constant slow push, the stop is the event: the hands stop on the frame, a 2 f bloom flash marks it.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, W, EZ, clamp01, lerp } from "../../core";
import { Glyph, NEON, neonFilter, hexA } from "./glyphs";

export type LineObjectProps = {
  kind: "clock" | "phone" | "glyph";
  glyph?: string; // kind "glyph"
  drawAt?: number; drawFrames?: number;
  clock?: { from: string; to: string; sweepAt: number; stopAt: number }; // "h:mm"
  text?: { t: string; at: number; colour?: string; y?: number }; // e.g. "7:13", "911"
  colour?: string;
  pushPerS?: number;
};
const hm = (s: string) => { const [h, m] = s.split(":").map(Number); return (h % 12) * 60 + m; };

export const LineObject: React.FC<LineObjectProps> = ({ kind, glyph = "phone", drawAt = 0, drawFrames = 18, clock, text, colour = NEON.white, pushPerS = 0.012 }) => {
  const f = useCurrentFrame();
  const dr = Math.max(0.001, EZ.out3((f - drawAt) / drawFrames));
  const s = 1 + pushPerS * (Math.max(0, f) / 30);
  const stopK = clock ? f - clock.stopAt : -1;
  const flash = stopK >= 0 && stopK < 3 ? [0.55, 0.3, 0.1][Math.floor(stopK)] : 0;
  let minutes = 0;
  if (clock) {
    const a = hm(clock.from), b = hm(clock.to) < a ? hm(clock.to) + 720 : hm(clock.to);
    const u = clamp01((f - clock.sweepAt) / Math.max(1, clock.stopAt - clock.sweepAt));
    minutes = lerp(a, b, EZ.in2(u) * 0.35 + 0.65 * u); // speeds up into the stop, then dead still
  }
  const R = 250;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 40% 45% at 50% 48%, ${hexA(colour, 0.08 + flash * 0.4)}, rgba(0,0,0,0) 100%)` }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W / 2} ${H / 2 - 30}) scale(${s.toFixed(5)})`} style={{ filter: neonFilter(colour, 1, 1 + flash * 2) }} fill="none" stroke={colour} strokeLinecap="round" strokeLinejoin="round">
          {kind === "clock" ? (
            <>
              <circle r={R} strokeWidth={12} pathLength={1} strokeDasharray={`${dr} 1`} transform="rotate(-90)" />
              {Array.from({ length: 12 }, (_, i) => (dr > i / 12 ? <path key={i} d={`M0 ${-R + 26} V${-R + (i % 3 === 0 ? 70 : 50)}`} strokeWidth={i % 3 === 0 ? 10 : 6} transform={`rotate(${i * 30})`} /> : null))}
              {dr >= 1 ? (
                <>
                  <path d={`M0 0 V${-R * 0.5}`} strokeWidth={14} transform={`rotate(${((minutes / 720) * 360).toFixed(2)})`} />
                  <path d={`M0 0 V${-R * 0.78}`} strokeWidth={9} transform={`rotate(${(((minutes % 60) / 60) * 360).toFixed(2)})`} />
                  <circle r={12} fill={colour} />
                </>
              ) : null}
            </>
          ) : (
            <g transform="translate(0 0)"><Glyph name={kind === "phone" ? "phone" : glyph} colour={colour} size={520} mode="line" lineW={9} draw={dr} /></g>
          )}
        </g>
      </svg>
      {text && f >= text.at ? (
        <div style={{ position: "absolute", left: 0, width: W, top: text.y ?? (kind === "clock" ? H - 210 : H / 2 - 110), textAlign: "center", fontFamily: FONT.bebas, fontSize: kind === "phone" ? 150 : 120, letterSpacing: "0.08em",
          color: text.colour ?? NEON.red, textShadow: `0 0 12px ${hexA(text.colour ?? NEON.red, 0.9)}, 0 0 40px ${hexA(text.colour ?? NEON.red, 0.5)}`, lineHeight: 1 }}>{text.t}</div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const LINEOBJ_DEMO: LineObjectProps = {
  kind: "clock", drawAt: 0, drawFrames: 20,
  clock: { from: "4:40", to: "7:13", sweepAt: 22, stopAt: 64 },
  text: { t: "7:13", at: 64 },
};
