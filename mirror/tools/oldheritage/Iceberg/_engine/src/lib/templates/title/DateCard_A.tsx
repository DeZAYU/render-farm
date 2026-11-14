// title / DateCard_A (EDITOR A sibling of ChapterCard / TypedDate / TitlePlace; Amusement Park 2026-10-19).
// A dated story card over the case footage: a small kicker (place / who) types on, then the big line (a date or a short title) WIPES in
// left-to-right behind a red bar that leads the wipe (the bar then shrinks into an underline), and an optional sub line rises under it.
// Editor A motion: the footage behind is defocused 12 px at 36 % and trucks right (+18 px/s); the text block drifts up-left (-8, -4 px/s).
// Bebas for the big line, Inter 700 for kicker and sub.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type DateCardAProps = { media?: string; mediaStart?: number; kicker?: string; kickerAt?: number; big: string; bigAt: number; sub?: string; subAt?: number; cap?: number; x?: number; y?: number; redBig?: boolean };
const RED = "#E30A10";
export const DateCard_A: React.FC<DateCardAProps> = ({ media, mediaStart = 0, kicker, kickerAt = 0, big, bigAt, sub, subAt, cap = 150, x = 0.1 * W, y = 0.42 * H, redBig = false }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const kk = f - kickerAt;
  const kShown = kicker ? kicker.slice(0, Math.max(0, Math.min(kicker.length, Math.floor(kk / 1.4)))) : "";
  const bk = f - bigAt;
  const w = EZ.quick(clamp01(bk / 14));
  const bar = clamp01((bk - 14) / 10);
  const sk = sub ? f - (subAt ?? bigAt + 12) : -1;
  const so = clamp01(sk / 10), sy = 26 * (1 - EZ.out3(clamp01(sk / 12)));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {media ? (
        <AbsoluteFill style={{ transform: `translateX(${(18 * t).toFixed(2)}px) scale(1.06)` }}>
          <FootPlate src={media} startFrom={mediaStart} push={0.02} filter="blur(12px) brightness(.36) saturate(.75)" />
        </AbsoluteFill>
      ) : <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 40% 50%, #141416, #050506)" }} />}
      <AbsoluteFill style={{ transform: `translate(${(-8 * t).toFixed(2)}px, ${(-4 * t).toFixed(2)}px)` }}>
        {kShown ? <div style={{ position: "absolute", left: x, top: y - cap * 0.62, fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", 30), color: "#E8E8E8", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>{kShown}</div> : null}
        {bk >= 0 ? (
          <div style={{ position: "absolute", left: x, top: y, whiteSpace: "nowrap" }}>
            <div style={{ clipPath: `inset(0 ${(100 * (1 - w)).toFixed(1)}% 0 0)` }}>
              <span style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), color: redBig ? RED : "#FDFDFD", lineHeight: 1, filter: "drop-shadow(0 6px 18px rgba(0,0,0,.7))" }}>{big}</span>
            </div>
            <div style={{ position: "absolute", left: `${(100 * w).toFixed(1)}%`, top: 0, width: 14, height: cap * 1.05, background: RED, opacity: 1 - bar, transform: "translateX(-14px)" }} />
            <div style={{ position: "absolute", left: 0, top: cap * 1.08, height: 6, width: `${(100 * bar).toFixed(1)}%`, background: RED }} />
          </div>
        ) : null}
        {sub && sk >= 0 ? <div style={{ position: "absolute", left: x, top: y + cap * 1.3 + sy, opacity: so, fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", 36), color: "#F2F2F2", whiteSpace: "nowrap", textShadow: "0 3px 10px rgba(0,0,0,.7)" }}>{sub}</div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
