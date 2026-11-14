// quote / ReportExcerpt: an official report line TYPED on report paper, attribution "- incident report". REF Farrell document typing (FA text
// T9 typed interface text at the voice's pace; FA evidence "document on desk") + DD D1 E9 red marking (a red pen bracket in the margin instead of
// a page bar: this is paper, not a web page) + FONTS.md typewriter row (Courier Prime Bold). Map: c04 #22 ("None of the ... employees appeared to be
// aware...", attribution "- fire dept. deputy chief, incident report").
// Differs from quote/Typewriter (SIRIUS caption over footage) and quote/PageLift (a captured web page): a drawn report SHEET (generic letterhead
// fields from props, ruled lines), close camera that tracks the typing line and pulls back slightly when it ends; the margin bracket draws on last.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs, ghost, lerp } from "../../core";
import { typedLine } from "../../core/kits/verdict";

export type ReportExcerptProps = { header?: string; fields?: string[]; words: { text: string; at: number }[]; attribution?: { text: string; at: number }; cpf?: number; maxChars?: number; cap?: number; labelCap?: number; subCap?: number };
const wrap = (s: string, n: number) => {
  const out: string[] = []; let cur = "";
  for (const w of s.split(" ")) { if ((cur + " " + w).trim().length > n) { out.push(cur.trim()); cur = w; } else cur += " " + w; }
  if (cur.trim()) out.push(cur.trim());
  return out;
};
export const ReportExcerpt: React.FC<ReportExcerptProps> = ({ header = "INCIDENT REPORT", fields = ["REPORT NO. ________", "DATE ________", "UNIT ________"], words, attribution, cpf = 0.8, maxChars = 38, cap = 30, labelCap = 26, subCap = 26 }) => {
  const f = useCurrentFrame();
  const full = words.map((w) => w.text).join(" ");
  const shown = typedLine(words, f, cpf);
  const fullLines = wrap(full, maxChars);
  // map the typed prefix onto the wrapped lines
  let rem = shown.length;
  const linesShown = fullLines.map((l, i) => { const take = Math.max(0, Math.min(l.length, rem)); rem -= l.length + (i < fullLines.length - 1 ? 1 : 0); return l.slice(0, take); });
  const cur = Math.max(0, linesShown.findIndex((l, i) => l.length < fullLines[i].length));
  const curLine = linesShown.every((l, i) => l.length === fullLines[i].length) ? fullLines.length - 1 : cur;
  const lastAt = words.length ? words[words.length - 1].at + words[words.length - 1].text.length / cpf : 0;
  const done = f >= lastAt;
  const pull = EZ.quick(clamp01((f - lastAt) / 40));
  const lh = 66;
  const textTop = 380;
  const camY = lerp(textTop + curLine * lh - 40, textTop + (fullLines.length * lh) / 2, pull);
  const s = lerp(1.32, 1.12, pull) * (1 + 0.006 * (f / 30));
  const brk = EZ.out2(clamp01((f - lastAt - 6) / 12));
  const sheetW = 1500, sheetH = 1900;
  return (
    <AbsoluteFill style={{ background: "#0a0908", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: W / 2, top: H / 2, transformOrigin: "0 0", transform: `scale(${s.toFixed(5)}) rotate(1.4deg) translate(${-sheetW / 2 + 0}px, ${(-camY).toFixed(2)}px)` }}>
        <div style={{ position: "relative", width: sheetW, height: sheetH, background: "linear-gradient(178deg, #F5F2EA 0%, #ECE7DB 100%)", boxShadow: "0 40px 90px rgba(0,0,0,.75)" }}>
          <div style={{ position: "absolute", left: 120, top: 90, fontFamily: FONT.courier, fontWeight: 700, fontSize: fs("courier", labelCap * 1.55), letterSpacing: "0.12em", color: "#222" }}>{header}</div>
          <div style={{ position: "absolute", left: 120, right: 120, top: 160, height: 4, background: "#2b2b2b" }} />
          {fields.map((t, i) => <div key={i} style={{ position: "absolute", left: 120 + i * 430, top: 184, fontFamily: FONT.courier, fontWeight: 700, fontSize: fs("courier", labelCap), color: "#555" }}>{t}</div>)}
          {Array.from({ length: 18 }, (_, i) => <div key={i} style={{ position: "absolute", left: 120, right: 120, top: textTop + 22 + i * lh, height: 1.5, background: "rgba(80,90,110,.16)" }} />)}
          {linesShown.map((l, i) => (
            <div key={i} style={{ position: "absolute", left: 160, top: textTop - 30 + i * lh, fontFamily: FONT.courier, fontWeight: 700, fontSize: fs("courier", cap), color: "#141414", whiteSpace: "pre" }}>
              {l}{!done && i === curLine ? <span style={{ display: "inline-block", width: 3, height: fs("courier", cap) * 0.8, background: "#141414", marginLeft: 2, opacity: Math.floor(f / 8) % 2 ? 0.2 : 1 }} /> : null}
            </div>
          ))}
          {/* red pen bracket in the margin */}
          {brk > 0.01 ? <svg width={80} height={fullLines.length * lh + 40} style={{ position: "absolute", left: 92, top: textTop - 50, overflow: "visible" }}>
            <path d={`M 40 6 Q 12 8 14 30 L 14 ${fullLines.length * lh} Q 12 ${fullLines.length * lh + 24} 40 ${fullLines.length * lh + 26}`} fill="none" stroke="#C4000E" strokeWidth={7} strokeLinecap="round"
              pathLength={1} strokeDasharray={`${brk} 1`} style={{ filter: "drop-shadow(0 1px 1px rgba(120,0,0,.4))" }} />
          </svg> : null}
          {attribution ? <div style={{ position: "absolute", left: 160, top: textTop - 10 + fullLines.length * lh + 30, fontFamily: FONT.inter, fontWeight: 500, fontStyle: "italic", fontSize: fs("inter", subCap), color: "#5a5650", opacity: ghost(f - attribution.at, 8, 0) }}>{attribution.text}</div> : null}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 50% 30%, rgba(0,0,0,0), rgba(60,40,20,.12) 100%)" }} />
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,.65) 100%)" }} />
    </AbsoluteFill>
  );
};
