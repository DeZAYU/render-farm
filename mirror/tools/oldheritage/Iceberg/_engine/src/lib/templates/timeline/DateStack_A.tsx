// timeline / DateStack_A (EDITOR A sibling of TypedDate / VhsDate / DateLine_A; Amusement Park 2026-10-19).
// A date (and optional time) as a STACK of lines over the case footage: weekday / day + month / year, each revealed by a vertical wipe on its
// spoken word (bottom -> top, 9 f, EZ.out3), the year in red; an optional time line in Inter types on. Editor A motion: the stack rides a
// constant downward tilt of the footage (+16 px/s, inside a linear push) while the text block itself drifts up (-5 px/s), so the frame keeps
// moving with no parked hold. Faces: Bebas for the stack, Inter 700 for the time. The plate is dimmed only on the stack's side.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type DLine = { text: string; at: number; red?: boolean; small?: boolean };
export type DateStackAProps = { media: string; mediaStart?: number; lines: DLine[]; cap?: number; x?: number; y?: number; right?: boolean; plateFilter?: string };
const RED = "#E30A10";
export const DateStack_A: React.FC<DateStackAProps> = ({ media, mediaStart = 0, lines, cap = 96, x, y = 0.3 * H, right = false, plateFilter = "brightness(.66) saturate(.88)" }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const X = x ?? (right ? 0.56 * W : 0.12 * W);
  let top = y - 5 * t;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateY(${(-30 + 16 * t).toFixed(2)}px) scale(1.07)` }}>
        <FootPlate src={media} startFrom={mediaStart} push={0.025} filter={plateFilter} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: right ? "linear-gradient(270deg, rgba(0,0,0,.8) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,0) 75%)" : "linear-gradient(90deg, rgba(0,0,0,.8) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,0) 75%)" }} />
      {lines.map((ln, i) => {
        const c = ln.small ? cap * 0.42 : cap;
        const yy = top;
        top += c * (ln.small ? 1.7 : 1.08);
        const k = f - ln.at;
        if (k < 0) return null;
        const w = EZ.out3(clamp01(k / 9));
        return (
          <div key={i} style={{ position: "absolute", left: X, top: yy, clipPath: `inset(${(100 * (1 - w)).toFixed(1)}% 0 0 0)`, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: ln.small ? FONT.inter : FONT.bebas, fontWeight: ln.small ? 700 : 400, fontSize: ln.small ? fs("inter", c) : fs("bebas", c), color: ln.red ? RED : "#F6F6F6", letterSpacing: ln.small ? "0.1em" : "0.02em", filter: `drop-shadow(0 4px 14px rgba(0,0,0,.7))${ln.red ? " drop-shadow(0 0 10px rgba(227,10,16,.45))" : ""}` }}>{ln.text}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
