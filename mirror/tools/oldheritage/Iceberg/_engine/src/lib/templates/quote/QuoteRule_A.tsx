// quote / QuoteRule_A (EDITOR A sibling of QuoteOnPlate / WordSyncPhoto / RedSentence; Amusement Park 2026-10-19).
// A reported line (paraphrase or quote) over the case footage. Every word is laid out from frame 0 as a 22 % ghost and lights to full on its
// spoken time (VV §8 word sync, no per-word motion); a red vertical rule GROWS beside the block as the words light (its height = the share of
// words said); key words go red. Editor A motion: the block rides a slow diagonal drift (-10 px/s x, -6 px/s y) and the defocused footage
// behind it trucks the other way (+18 px/s) so the two layers part (parallax). Attribution Inter 600 under the rule, fades in on its time.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type QWord = { text: string; at: number; red?: boolean };
export type QuoteRuleAProps = { media: string; mediaStart?: number; lines: QWord[][]; attribution?: { text: string; at: number }; cap?: number; x?: number; y?: number; quoted?: boolean };
const RED = "#E30A10";
export const QuoteRule_A: React.FC<QuoteRuleAProps> = ({ media, mediaStart = 0, lines, attribution, cap = 58, x = 0.14 * W, y = 0.36 * H, quoted = false }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const all = lines.flat();
  const said = all.filter((w) => f >= w.at).length;
  const share = all.length ? said / all.length : 0;
  const lh = cap * 1.55;
  const blockH = lines.length * lh;
  const ak = attribution ? f - attribution.at : -1;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${(18 * t).toFixed(2)}px) scale(1.05)` }}>
        <FootPlate src={media} startFrom={mediaStart} push={0.02} filter="blur(14px) brightness(.34) saturate(.75)" />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${(-10 * t).toFixed(2)}px, ${(-6 * t).toFixed(2)}px)` }}>
        <div style={{ position: "absolute", left: x - 34, top: y, width: 7, height: blockH * share, background: RED, boxShadow: "0 0 12px rgba(227,10,16,.6)" }} />
        {lines.map((ln, li) => (
          <div key={li} style={{ position: "absolute", left: x, top: y + li * lh, display: "flex", gap: cap * 0.32, whiteSpace: "nowrap" }}>
            {ln.map((w, wi) => {
              const k = f - w.at;
              const o = k < 0 ? 0.22 : 0.22 + 0.78 * clamp01(k / 4);
              const txt = quoted && li === 0 && wi === 0 ? `“${w.text}` : quoted && li === lines.length - 1 && wi === ln.length - 1 ? `${w.text}”` : w.text;
              return <span key={wi} style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", cap), color: w.red && k >= 0 ? RED : "#F4F4F4", opacity: o, textShadow: "0 3px 12px rgba(0,0,0,.75)" }}>{txt}</span>;
            })}
          </div>
        ))}
        {attribution && ak >= 0 ? (
          <div style={{ position: "absolute", left: x, top: y + blockH + 18, opacity: clamp01(ak / 10), fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", 26), color: "rgba(240,240,240,.82)", whiteSpace: "nowrap" }}>{attribution.text}</div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
