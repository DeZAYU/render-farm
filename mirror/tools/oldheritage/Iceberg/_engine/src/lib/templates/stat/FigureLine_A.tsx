// stat / FigureLine_A (EDITOR A sibling of CounterStack / TwoTone; Amusement Park 2026-10-19).
// Two to four short FIGURES in one horizontal line, each landing on its spoken word: the figure (Bebas, white or red) rises 40 px into place
// with a 6 px defocus clearing over 10 f (EZ.quick), its small label (Inter 700 caps) wipes in under it 4 f later, a thin rule draws between
// neighbours. Editor A motion: the line rides a constant truck (-16 px/s) with a +1 %/s push, and the defocused case footage behind it trucks
// the other way (+12 px/s), so the frame never parks. Use it for "3 days / HK$50,000 / paid by insurance" style facts.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type Fig = { value: string; label: string; at: number; red?: boolean };
export type FigureLineAProps = { media?: string; mediaStart?: number; figs: Fig[]; cap?: number; labelCap?: number; y?: number; header?: { text: string; at: number } };
const RED = "#E30A10";
export const FigureLine_A: React.FC<FigureLineAProps> = ({ media, mediaStart = 0, figs, cap = 120, labelCap = 28, y = 0.46 * H, header }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const n = figs.length;
  const slot = (0.84 * W) / n;
  const x0 = 0.08 * W;
  const hk = header ? f - header.at : -1;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {media ? (
        <AbsoluteFill style={{ transform: `translateX(${(12 * t).toFixed(2)}px) scale(1.05)` }}>
          <FootPlate src={media} startFrom={mediaStart} push={0.02} filter="blur(16px) brightness(.32) saturate(.7)" />
        </AbsoluteFill>
      ) : <AbsoluteFill style={{ background: "#060606" }} />}
      <AbsoluteFill style={{ transform: `translateX(${(-16 * t).toFixed(2)}px) scale(${(1 + 0.01 * t).toFixed(5)})` }}>
        {header && hk >= 0 ? <div style={{ position: "absolute", left: x0, top: y - cap * 1.3, opacity: clamp01(hk / 8), fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", 30), color: "#E6E6E6", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{header.text}</div> : null}
        {figs.map((g, i) => {
          const k = f - g.at;
          if (k < 0) return null;
          const u = EZ.quick(clamp01(k / 10));
          const lw = EZ.out3(clamp01((k - 4) / 10));
          const cx = x0 + slot * (i + 0.5);
          return (
            <React.Fragment key={i}>
              {i > 0 ? <div style={{ position: "absolute", left: x0 + slot * i - 1, top: y - cap * 0.55, width: 2, height: cap * 1.5 * EZ.out3(clamp01(k / 12)), background: "rgba(255,255,255,.35)" }} /> : null}
              <div style={{ position: "absolute", left: cx, top: y - cap * 0.62 + 40 * (1 - u), transform: "translateX(-50%)", opacity: clamp01(k / 4), filter: `blur(${(6 * (1 - u)).toFixed(2)}px) drop-shadow(0 6px 16px rgba(0,0,0,.7))${g.red ? " drop-shadow(0 0 12px rgba(227,10,16,.45))" : ""}`, whiteSpace: "nowrap" }}>
                <span style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), color: g.red ? RED : "#FDFDFD", lineHeight: 1 }}>{g.value}</span>
              </div>
              <div style={{ position: "absolute", left: cx, top: y + cap * 0.55, transform: "translateX(-50%)", clipPath: `inset(0 ${(100 * (1 - lw)).toFixed(1)}% 0 0)`, whiteSpace: "nowrap" }}>
                <span style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", labelCap), color: "#E8E8E8", letterSpacing: "0.08em" }}>{g.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
