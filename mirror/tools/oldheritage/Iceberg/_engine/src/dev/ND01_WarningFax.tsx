// ND01 WarningFax: the JMA report's own sentences come out of a fax slot. A cream sheet feeds up out of a dark machine line by line,
// each line printing left to right in sharp type (the report's words, verbatim); the figure that matters in each line turns red and
// gets a hand-drawn red underline once it has printed. Small source credit bottom left. Built for "the problem was what it said":
// the warning's numbers arrive the way the warning itself did, as a printout.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.45, 0, 0.55, 1);

export type FaxLine = { text: string; at: number; mark?: string };

export const WarningFax: React.FC<{ lines: FaxLine[]; credit: string; cps?: number }> = ({ lines, credit, cps = 1.6 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const d = io(f / durationInFrames);
  const PW = width * 0.66, LH = 92, PAD = 70, FS = 46;
  const slotY = height * 0.78;
  // the sheet feeds one line height per printed line (smooth), plus the top margin on the first line
  const fed = lines.reduce((a, l) => a + out(interpolate(f, [l.at - 8, l.at + 6], [0, 1], cl)), 0);
  const feedPx = PAD * Math.min(1, fed) + LH * fed;
  const paperTop = slotY - feedPx;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #222 0%, #0b0b0b 70%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 2000 }}>
        <AbsoluteFill style={{ transform: `rotateX(${10 - 4 * d}deg) scale(${1.0 + 0.07 * d}) translateY(${-20 * d}px)`, transformOrigin: "50% 80%" }}>
          {/* the sheet (clipped at the slot) */}
          <div style={{ position: "absolute", left: (width - PW) / 2, top: 0, width: PW, height: slotY, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: paperTop, width: PW, height: feedPx + 40, background: "linear-gradient(#f4f1e8, #ebe7da)",
              boxShadow: "0 0 40px rgba(0,0,0,.6)" }}>
              <div style={{ position: "absolute", left: 50, right: 50, top: 34, height: 3, background: "#1b1b1b", opacity: 0.8 }} />
              {lines.map((l, i) => {
                const n = l.text.length, dur = Math.max(10, n / cps);
                const p = interpolate(f, [l.at, l.at + dur], [0, 1], cl);
                if (f < l.at - 8) return null;
                const mi = l.mark ? l.text.indexOf(l.mark) : -1;
                const done = l.at + dur;
                const red = mi >= 0 ? interpolate(f, [done, done + 8], [0, 1], cl) : 0;
                const ul = mi >= 0 ? out(interpolate(f, [done + 2, done + 16], [0, 1], cl)) : 0;
                const col = `rgb(${27 + (227 - 27) * red}, ${27 - 7 * red}, ${27}`;
                return (
                  <div key={i} style={{ position: "absolute", left: 56, top: PAD + i * LH, width: PW - 112, whiteSpace: "nowrap", fontFamily: "Courier Prime", fontWeight: 700,
                    fontSize: FS, lineHeight: `${LH}px`, color: "#1b1b1b", clipPath: `inset(-20px ${(1 - p) * 100}% -20px 0)`, letterSpacing: "-0.01em" }}>
                    {mi < 0 ? l.text : <>
                      {l.text.slice(0, mi)}
                      <span style={{ position: "relative", color: col + ")" }}>{l.mark}
                        <svg style={{ position: "absolute", left: -6, bottom: -4, overflow: "visible" }} width="100%" height="18" viewBox="0 0 100 18" preserveAspectRatio="none">
                          <path d="M0 10 C 25 15, 60 4, 104 9" stroke={RED} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ul} vectorEffect="non-scaling-stroke" />
                        </svg>
                      </span>
                      {l.text.slice(mi + l.mark!.length)}
                    </>}
                  </div>
                );
              })}
            </div>
          </div>
          {/* the machine: a dark body with the slot */}
          <div style={{ position: "absolute", left: (width - PW * 1.14) / 2, top: slotY - 6, width: PW * 1.14, height: height - slotY + 80, background: "linear-gradient(#2c2c2c, #121212 30%)",
            borderRadius: "14px 14px 0 0", boxShadow: "0 -10px 40px rgba(0,0,0,.7)" }}>
            <div style={{ position: "absolute", left: "6%", right: "6%", top: 0, height: 12, background: "#050505", borderRadius: 6 }} />
            <div style={{ position: "absolute", right: "8%", top: 44, width: 14, height: 14, borderRadius: 7, background: RED, opacity: 0.5 + 0.5 * Math.round((Math.sin(f / 5) + 1) / 2) }} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, bottom: 40, fontFamily: "D-DIN", fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "rgba(255,255,255,.62)" }}>{credit}</div>
    </AbsoluteFill>
  );
};
