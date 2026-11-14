// quote / MarkerQuote_A (EDITOR A sibling of QuoteOnPlate / QuoteRule_A / PageLift; Amusement Park 2026-10-19).
// A reported line set large in Inter 700 on a dark card plane; on its spoken words a translucent marker bar (red, 70 %) WIPES under the key
// phrase like a highlighter (Abyssal E5 marker logic, without a page). The attribution sits on a thin rule under the block. Words are all
// present from the first frame (no empty lead). Editor A motion: the whole plane is tilted 6 deg in Y and the camera dollies sideways
// across it (-22 px/s) with a +1.4 %/s push; the case footage behind is defocused 16 px at 30 %.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs, measure } from "../../core";
import { FootPlate } from "../labels/kit";

export type MarkSpan = { line: number; from: number; to: number; at: number; dur?: number }; // word indices (inclusive) in that line
export type MarkerQuoteAProps = { media?: string; mediaStart?: number; lines: string[]; marks: MarkSpan[]; attribution?: string; cap?: number; quoted?: boolean };
export const MarkerQuote_A: React.FC<MarkerQuoteAProps> = ({ media, mediaStart = 0, lines, marks, attribution, cap = 62, quoted = false }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const fsz = fs("inter", cap);
  const lh = cap * 1.7;
  const x0 = 0.16 * W, y0 = H / 2 - (lines.length * lh) / 2 - 30;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {media ? <FootPlate src={media} startFrom={mediaStart} push={0.02} filter="blur(16px) brightness(.3) saturate(.7)" /> : <AbsoluteFill style={{ background: "#08080a" }} />}
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transform: `translateX(${(-10 * t).toFixed(2)}px) rotateY(6deg) scale(${(1 + 0.014 * t).toFixed(5)})`, transformOrigin: "40% 50%" }}>
          {lines.map((ln, li) => {
            const words = ln.split(" ");
            const text = quoted ? (li === 0 ? "“" : "") + ln + (li === lines.length - 1 ? "”" : "") : ln;
            const offs: number[] = []; let acc = quoted && li === 0 ? 1 : 0;
            words.forEach((w) => { offs.push(acc); acc += w.length + 1; });
            return (
              <div key={li} style={{ position: "absolute", left: x0, top: y0 + li * lh, whiteSpace: "nowrap" }}>
                {marks.filter((m) => m.line === li).map((m, mi) => {
                  const u = EZ.out3(clamp01((f - m.at) / (m.dur ?? 14)));
                  if (u <= 0) return null;
                  const font = `700 ${fsz}px ${FONT.inter}`; const pre = (quoted && li === 0 ? "“" : "") + words.slice(0, m.from).join(" ") + (m.from > 0 ? " " : "");
                  const a = measure(pre, font), b = measure(pre + words.slice(m.from, m.to + 1).join(" "), font);
                  return <div key={mi} style={{ position: "absolute", left: a - 8, top: cap * 0.18, width: (b - a + 16) * u, height: cap * 1.12, background: "rgba(227,10,16,.7)", borderRadius: 3 }} />;
                })}
                <span style={{ position: "relative", fontFamily: FONT.inter, fontWeight: 700, fontSize: fsz, color: "#F6F6F6", textShadow: "0 3px 12px rgba(0,0,0,.7)" }}>{text}</span>
              </div>
            );
          })}
          {attribution ? (
            <div style={{ position: "absolute", left: x0, top: y0 + lines.length * lh + 22, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 60, height: 2, background: "rgba(255,255,255,.6)" }} />
              <span style={{ fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", 26), color: "rgba(240,240,240,.85)", whiteSpace: "nowrap" }}>{attribution}</span>
            </div>
          ) : null}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
