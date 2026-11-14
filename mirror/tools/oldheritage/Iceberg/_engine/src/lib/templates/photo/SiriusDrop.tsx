// photo / SiriusDrop: SIRIUS E5 photo card on pure black, the vertical "gravity" move (SIRIUS 13:18 Paret portrait: slides UP from below,
// top 860 -> 112 over 1.80 s, y = y0 + d(1-(1-u)^2.5), peak 96 %H/s; 14:10 Goldstein: drops from the top in 1.2 s; exits by falling out of
// the bottom, ease-in u^2.5 over 1.25 s). Card h = 0.79 H, no border, no rotation, no scale. Optional SIRIUS R4 context note (lowercase rounded,
// #DCDBDD, bottom-left, pops on its word). Our version: the photo sits in the DD grade (inner vignette), the hold is not dead: a +0.6 %/s
// linear push inside the card (Farrell photo push), motion blur on the fast first half of the entry and on the exit.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, MBlur, Media, RoundText, W, clamp01 } from "../../core";
import { CardVig } from "./shared";

export type SiriusDropProps = {
  src: string;
  aspect?: number; // w/h (SIRIUS 695 x 853 = 0.815)
  pos?: string;
  from?: "below" | "above";
  exitAt?: number; // local frame the card starts falling out (omit = holds to the cut)
  note?: string[]; // context note lines (lowercase)
  noteAt?: number;
  mono?: number; // 0 colour .. 1 B/W
  labelCap?: number; // context-note cap height (px)
};

const IN = { below: { d: 54, y0: 860, y1: 112 }, above: { d: 36, y0: -900, y1: 102 } };

export const SiriusDrop: React.FC<SiriusDropProps> = ({ src, aspect = 0.815, pos = "50% 40%", from = "below", exitAt, note, noteAt = 20, mono = 0, labelCap = 30 }) => {
  const k = useCurrentFrame();
  const ch = 0.79 * H, cw = ch * aspect;
  const m = IN[from];
  const y0 = from === "above" ? -ch : m.y0;
  const u = clamp01(k / m.d);
  let top = y0 + (m.y1 - y0) * (1 - Math.pow(1 - u, 2.5));
  let fast = u < 0.45;
  if (exitAt !== undefined && k > exitAt) {
    const e = clamp01((k - exitAt) / 37);
    top = m.y1 + (H + 200 - m.y1) * Math.pow(e, 2.5);
    fast = e > 0.35 && e < 1;
  }
  const push = 1 + 0.006 * (k / 30);
  const lines = note ?? [];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MBlur on={fast} samples={6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: W / 2 - cw / 2, top, width: cw, height: ch, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, transform: `scale(${push.toFixed(5)})` }}>
              <Media src={src} pos={pos} style={{ filter: `grayscale(${mono}) contrast(1.06)` }} />
            </div>
            <CardVig k={0.45} />
          </div>
        </AbsoluteFill>
      </MBlur>
      {lines.length && k >= noteAt ? (
        <div style={{ position: "absolute", left: 110, top: 1040 - lines.length * labelCap * 1.67 }}>
          {lines.map((t, i) => <RoundText key={i} text={t} cap={labelCap} colour="#DCDBDD" style={{ position: "absolute", left: 0, top: i * labelCap * 1.67 }} />)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
