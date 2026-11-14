// caseopener / OsdLine: Dashcam "INSTRUMENT" case opener (REFERENCE_SYNTHESIS §H2 Direction A "OSD line").
// REF: D1 corner-number variant #7 @8:19.94 (numeral top-LEFT, ~150 px glyph) + Dashcam Vol.2 E9 @8:23.4 (number IN in 3 steps over 0.2 s, no
// scale) + D1 #15 (out 20 f) + Dashcam Vol.1 E4 typed stamp "MONDAY - 4:30 PM" @2:27.5 (2 f/char, on the spoken words) + Abyssal E2 typed date
// @0:42.62 (block cursor, blink 0.5 s). Footage underneath: DD linear push (+4.5 %/s, never eased).
// OUR VERSION: D-DIN Exp numeral; date + place type into ONE line along the bottom-left OSD band (y 0.90 H), like the camera's own readout; the
// cursor is an accent block. `osdDim` (source px rect) dims the source's own OSD to 50 % while ours types, so the two never double-print (M-057).
import React from "react";
import { WATERPARK, FreshLayer, H, W, clamp01, drift, linPush, measure, type Theme } from "../../core";
import { FootPlate, type Word } from "../labels/kit";
import { SHADOW_ON_FOOTAGE, type SrcRect, accentGlow, fontStr, fsOf, scrRect } from "../labels/dash1kit";
import { type CaseOpenerProps, Fill, useF } from "./shared";

export type OsdLineProps = CaseOpenerProps & {
  theme?: Theme;
  step?: number; // f per character (D1 E4: 2)
  glyph?: number; // numeral cap height px (Direction A: 150)
  numX?: number; numY?: number; // numeral top-left (screen px)
  cap?: number; // OSD line cap height (>= 40)
  x?: number; y?: number; // OSD line left edge + baseline (y 0.90 H)
  sep?: string; // separator typed before the first place word (D1 E4 "MONDAY - 4:30 PM")
  caps?: boolean; // upper-case the line (OSD style)
  lineOut?: number; // line exit start (6 f fade); defaults to dateOut ?? placeOut
  osdDim?: SrcRect; // the source's own OSD (source px): dimmed to 50 % while our line is up
  blink?: number; // cursor half-period in frames (0.5 s = 15)
  numGuard?: number; // bright-plate contrast guard: peak alpha of a soft dark radial behind the numeral (0 = off; M-024)
};

export const OsdLine: React.FC<OsdLineProps> = ({
  number, dateWords, placeWords = [], media, mediaStart = 0, push = 0.045, numberAt = 0, numberOut = 54, dateOut, placeOut,
  theme = WATERPARK, step = 2, glyph = 150, numX = 0.072 * W, numY = 0.105 * H, cap = 44, x = 0.072 * W, y = 0.9 * H, sep = "-", caps = true,
  lineOut, osdDim, blink = 15, numGuard = 0.45,
}) => {
  const f = useF();
  const th = theme;
  // ---- numeral: 3 steps in 0.2 s (D2 E9), hold, out 20 f ease-in (D1 #15); a slow life drift while held
  const k = f - numberAt;
  const inO = k < 0 ? 0 : k < 2 ? 0.55 : k < 4 ? 0.78 : 1;
  const outU = clamp01((f - numberOut) / 20);
  const numO = inO * (1 - outU * outU);
  const numSize = fsOf(th.num.face, glyph);
  const numW = measure(number, fontStr(th.num, numSize)); // for the contrast guard behind the numeral
  // ---- OSD line: words type from their own spoken frame at `step` f/char; the separator comes with the first place word
  const out = lineOut ?? dateOut ?? placeOut;
  const cs = Math.max(40, cap);
  const size = fsOf(th.num.face, cs);
  const font = fontStr(th.num, size);
  const up = (t: string) => (caps ? t.toUpperCase() : t);
  const all: (Word & { dim?: boolean })[] = [...dateWords.map((w) => ({ ...w, text: up(w.text) }))];
  if (placeWords.length) {
    if (sep && dateWords.length) all.push({ text: sep, at: Math.max(0, placeWords[0].at - 2), dim: true });
    all.push(...placeWords.map((w) => ({ ...w, text: up(w.text) })));
  }
  const parts = all
    .map((w) => ({ ...w, n: f < w.at ? 0 : Math.min(w.text.length, Math.floor((f - w.at) / step) + 1) }))
    .filter((w) => w.n > 0);
  const typing = parts.some((w) => w.n < w.text.length);
  const line = parts.map((w) => w.text.slice(0, w.n)).join(" ");
  const ls = 0.04 * size; // OSD letter spacing
  const lineW = line ? measure(line, font) + ls * line.length : 0;
  const oU = out === undefined ? 0 : clamp01((f - out) / 6);
  const lineO = 1 - oU * oU;
  const first = all.length ? all[0].at : 0;
  const lastDone = parts.length ? Math.max(...parts.map((w) => w.at + w.text.length * step)) : first;
  // cursor: solid while a word is typing, then blinks with a 0.5 s half-period (Abyssal E2)
  const curOn = f >= first && (typing || Math.floor((f - lastDone) / blink) % 2 === 0);
  // ---- source OSD dim (50 %), up with the first character, released with the line
  const dimA = 0.5 * clamp01((f - first + 3) / 6) * lineO;
  const s = linPush(f, push); // the plate scale, for mapping the source rect
  const dr = osdDim ? scrRect(osdDim, s) : null;
  return (
    <Fill>
      <FootPlate src={media} startFrom={mediaStart} push={push}>
        {dr && dimA > 0.002 ? (
          <div style={{ position: "absolute", left: dr.x - 6, top: dr.y - 6, width: dr.w + 12, height: dr.h + 12, background: `rgba(0,0,0,${dimA.toFixed(3)})`, filter: "blur(4px)" }} />
        ) : null}
        {numO > 0.002 ? (
          <FreshLayer>
            <div style={{ position: "absolute", left: numX, top: numY, opacity: numO, transformOrigin: "0 0", transform: `scale(${drift(Math.max(0, k), 0.006).toFixed(5)})`,
              fontFamily: th.num.face, fontWeight: th.num.weight, fontSize: numSize, lineHeight: 1, color: th.neutral, whiteSpace: "pre", textShadow: "0 0 3px rgba(0,0,0,.55), 0 4px 16px rgba(0,0,0,.75), 0 1px 3px rgba(0,0,0,.8)" }}>
              {/* contrast guard (M-024): a feathered dark radial behind the numeral so white D-DIN Exp holds on bright sky; no box edge */}
              {numGuard > 0 ? (
                <div style={{ position: "absolute", left: -glyph * 1.25, top: -glyph * 1.0, width: numW + glyph * 2.5, height: numSize + glyph * 2.0, pointerEvents: "none",
                  background: `radial-gradient(closest-side, ${[0, 0.25, 0.5, 0.75, 1].map((q) => `rgba(0,0,0,${(numGuard * Math.exp(-2 * q * q) * (1 - q * q)).toFixed(3)}) ${(q * 100).toFixed(0)}%`).join(", ")})` }} />
              ) : null}
              <span style={{ position: "relative" }}>{number}</span>
            </div>
          </FreshLayer>
        ) : null}
        {f >= first && lineO > 0.002 ? (
          <div style={{ position: "absolute", left: x, top: 0, opacity: lineO }}>
            {/* baseline ~ y (D-DIN ascent ~0.8 em at line-height 1) */}
            <div style={{ position: "absolute", left: 0, top: y - 0.8 * size, fontFamily: th.num.face, fontWeight: th.num.weight, fontSize: size, lineHeight: 1, letterSpacing: ls, whiteSpace: "pre", textShadow: SHADOW_ON_FOOTAGE }}>
              {parts.map((w, i) => (
                <span key={i} style={{ color: w.red ? th.accent : w.dim ? th.dim : th.neutral, textShadow: w.red ? accentGlow(th, 0.8) : undefined }}>
                  {w.text.slice(0, w.n)}{i < parts.length - 1 ? " " : ""}
                </span>
              ))}
            </div>
            {curOn ? <div style={{ position: "absolute", left: lineW + (line ? ls : 0), top: y - cs * 1.04, width: cs * 0.62, height: cs * 1.14, background: th.accent, boxShadow: `0 0 8px ${th.accentGlow}` }} /> : null}
          </div>
        ) : null}
      </FootPlate>
    </Fill>
  );
};
