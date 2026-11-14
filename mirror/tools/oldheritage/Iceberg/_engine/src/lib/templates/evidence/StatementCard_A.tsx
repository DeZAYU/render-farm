// evidence / StatementCard_A (EDITOR A sibling of StampVerdict / ReportExcerpt / TermsCard_A; Amusement Park 2026-10-19).
// A press statement as a plain sheet (no letterhead, no logos): a small source line, then the statement's points typing on line by line on
// their words (Courier-free: Inter 500 on off-white), and the key phrase gets a red BOX drawn around it (4 strokes in 10 f, like a pen
// circling a line) on its own word. Editor A motion: the sheet slides up 60 px into frame on EZ.quick, then the camera keeps a diagonal
// glide toward the key line (-9 / -5 px/s) with a +1.4 %/s push; desk background dark with a soft top light.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";

export type StatementLine = { text: string; at: number; key?: { at: number } };
export type StatementCardAProps = { source: string; lines: StatementLine[]; cap?: number };
const RED = "#D41218";
export const StatementCard_A: React.FC<StatementCardAProps> = ({ source, lines, cap = 42 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const u = EZ.quick(clamp01(f / 18));
  const cw = 1240, pitch = cap * 1.9, ch = 170 + lines.length * pitch + 40;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 55% at 50% 20%, #1d1d20, #060607 75%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${(-9 * t).toFixed(2)}px, ${(60 * (1 - u) - 5 * t).toFixed(2)}px) scale(${(1 + 0.014 * t).toFixed(5)})` }}>
        <div style={{ position: "absolute", left: (W - cw) / 2, top: (H - ch) / 2, width: cw, height: ch, background: "#F3F1EC", borderRadius: 4, boxShadow: "0 34px 80px rgba(0,0,0,.75)", transform: "rotate(1.2deg)" }}>
          <div style={{ position: "absolute", left: 70, top: 52, fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", 26), color: "#555", letterSpacing: "0.14em" }}>{source}</div>
          <div style={{ position: "absolute", left: 70, top: 98, width: cw - 140, height: 2, background: "#C9C5BC" }} />
          {lines.map((ln, i) => {
            const k = f - ln.at;
            if (k < 0) return null;
            const shown = ln.text.slice(0, Math.min(ln.text.length, Math.floor(k / 1.1) + 1));
            const bk = ln.key ? f - ln.key.at : -1;
            const b = bk >= 0 ? EZ.out3(clamp01(bk / 10)) : 0;
            const tw = Math.min(cw - 160, ln.text.length * cap * 0.55);
            const top = 140 + i * pitch;
            return (
              <div key={i} style={{ position: "absolute", left: 80, top }}>
                <span style={{ fontFamily: FONT.inter, fontWeight: 500, fontSize: fs("inter", cap), color: "#1A1A1A", whiteSpace: "nowrap" }}>{shown}</span>
                {b > 0 ? (
                  <svg width={tw + 40} height={cap * 1.9} style={{ position: "absolute", left: -20, top: -cap * 0.32, overflow: "visible" }}>
                    <rect x={2} y={2} width={tw + 36} height={cap * 1.7} rx={8} fill="none" stroke={RED} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
