// evidence / TermsCard_A (EDITOR A sibling of CitationSheet / StampVerdict; Amusement Park 2026-10-19).
// A plain terms / conditions card (an offer, a waiver, a statement's points): lines appear on their words, and each can be MARKED on its own
// word: a red tick (covered), a red strike-through (refused / not covered) or a red underline (the key condition). Editor A motion: the card
// sits tilted 2.5 deg on a dark desk and the camera glides diagonally across it (constant -12 / -7 px/s) with a +1.2 %/s push; each new line
// slides 30 px up into place (EZ.quick 10 f); marks draw in 8 f (tick strokes, strike left-to-right). Inter 600 on warm white paper.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";

export type TermLine = { text: string; at: number; mark?: { kind: "tick" | "strike" | "underline"; at: number } };
export type TermsCardAProps = { title: string; titleAt?: number; lines: TermLine[]; cap?: number; source?: string };
const RED = "#D41218";
export const TermsCard_A: React.FC<TermsCardAProps> = ({ title, titleAt = 0, lines, cap = 40, source }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const cw = 1180, pitch = cap * 2.1;
  const ch = 190 + lines.length * pitch;
  const tk = f - titleAt;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, #1b1b1d 0%, #070708 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${(-12 * t).toFixed(2)}px, ${(-7 * t).toFixed(2)}px) scale(${(1 + 0.012 * t).toFixed(5)})` }}>
        <div style={{ position: "absolute", left: (W - cw) / 2, top: (H - ch) / 2, width: cw, height: ch, background: "#F1EEE6", borderRadius: 6, transform: "rotate(-2.5deg)", boxShadow: "0 30px 70px rgba(0,0,0,.7)" }}>
          <div style={{ position: "absolute", left: 70, top: 56, opacity: clamp01(tk / 8), fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", 34), color: "#1A1A1A", letterSpacing: "0.12em" }}>{title}</div>
          <div style={{ position: "absolute", left: 70, top: 112, width: cw - 140, height: 3, background: RED, transform: `scaleX(${EZ.out3(clamp01(tk / 14)).toFixed(3)})`, transformOrigin: "0 50%" }} />
          {lines.map((ln, i) => {
            const k = f - ln.at;
            if (k < 0) return null;
            const u = EZ.quick(clamp01(k / 10));
            const top = 150 + i * pitch + 30 * (1 - u);
            const mk = ln.mark ? f - ln.mark.at : -1;
            const m = mk >= 0 ? EZ.out3(clamp01(mk / 8)) : 0;
            const tw = Math.min(cw - 220, ln.text.length * cap * 0.56);
            return (
              <div key={i} style={{ position: "absolute", left: 120, top, opacity: clamp01(k / 5) }}>
                <span style={{ fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", cap), color: ln.mark?.kind === "strike" && m > 0 ? "#6A6A6A" : "#1E1E1E", whiteSpace: "nowrap" }}>{ln.text}</span>
                {ln.mark?.kind === "strike" && m > 0 ? <div style={{ position: "absolute", left: -6, top: cap * 0.62, width: (tw + 12) * m, height: 5, background: RED }} /> : null}
                {ln.mark?.kind === "underline" && m > 0 ? <div style={{ position: "absolute", left: 0, top: cap * 1.32, width: tw * m, height: 4, background: RED }} /> : null}
                {ln.mark?.kind === "tick" && m > 0 ? (
                  <svg width={60} height={60} style={{ position: "absolute", left: -78, top: -6, overflow: "visible" }}>
                    <path d="M8 30 L24 46 L54 10" fill="none" stroke={RED} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - m} />
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {source ? <div style={{ position: "absolute", left: 40, bottom: 34, fontFamily: FONT.inter, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.7)" }}>{source}</div> : null}
    </AbsoluteFill>
  );
};
