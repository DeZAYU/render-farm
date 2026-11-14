// page / TranslateOverlay: a foreign-language page (RU / ID / ZH...) where English translation CHIPS pin onto the phrases as the VO says them.
// The page fades up from black (Farrell EN2) and lies flat with a slow push; on each chip's word a red underline draws under the source
// phrase, a short leader drops from it and a D3 boxed caption (Nunito 700, white on #000) types the translation, pinned to the page so it
// moves with it; the camera re-frames to each phrase (quick start / long settle). Earlier chips stay, dimmed.
// REF D3 I13 boxed caption (Dashcam Vol.3 @8:12.5) typed like Farrell T9 (29-38 c/s), applied to a page; Farrell EN2 fade-up (IS 4:54.8);
// VV §11 phase moves. wp3 sec_B YTPage translation (screen-space caption) -> here the captions live ON the page, at the phrase.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CHIP_TONE, EZ, FONT, MBlur, RC, clamp01, fs, lerp, type Rect } from "../../core";
import { Entered, PageSheet, type PageSrc } from "./shared";

export type Chip = { r: Rect; text: string; at: number; side?: "right" | "below" | "above"; below?: boolean /* alias of side: "below" */ };
const sideOf = (c: Chip) => c.side ?? (c.below ? "below" : "right");
export type TranslateOverlayProps = PageSrc & {
  clip?: [number, number];
  x1?: number;
  cam: { cx: number; cy: number; s: number }; // opening framing
  chips: Chip[];
  follow?: boolean; // camera re-frames to each chip (default true)
  cpf?: number; // typing speed, chars per frame (default 1.2)
  labelCap?: number; // chip cap height on screen (default 34)
  /** chip look: "black" (default, D3 I13 boxed caption) or "light" (core CHIP_TONE: white type, red outline, dark translucent fill) */
  chipTone?: "black" | "light";
  /** dim earlier chips (default false: M-024, a dimmed chip reads grey-on-white on the page) */
  dimOld?: boolean;
};
const MOVE = 30;
const Inner: React.FC<TranslateOverlayProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  let cx = p.cam.cx, cy = p.cam.cy;
  if (p.follow !== false) {
    for (const c of p.chips) {
      const u = EZ.quick((f - c.at + 6) / MOVE);
      cy = lerp(cy, c.r[1] + c.r[3] / 2 + (sideOf(c) === "below" ? 40 : sideOf(c) === "above" ? -40 : 0), u);
    }
  }
  const s = p.cam.s * (1 + 0.008 * t);
  const capCss = fs("nunito", p.labelCap ?? 34) / s; // chip type size in CSS px so it reads at cap 34 on screen
  const last = p.chips.reduce((a, c, i) => (f >= c.at ? i : a), -1);
  return (
    <AbsoluteFill style={{ background: "#101010" }}>
      <PageSheet {...p} cx={cx} cy={cy} s={s} slices={p.clip ? [{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }] : undefined} x1={p.x1} shadow="0 0 0 rgba(0,0,0,0)">
        {p.chips.map((c, i) => {
          const k = f - c.at;
          if (k < 0) return null;
          const ul = EZ.out2(k / 8);
          const side = sideOf(c);
          const lead = clamp01((k - 6) / 4);
          const txt = c.text.slice(0, Math.max(0, Math.ceil((Math.floor(k) - 9) * (p.cpf ?? 1.2))));
          const dim = p.dimOld && i < last ? 0.55 : 1;
          const light = p.chipTone === "light";
          const uy = c.r[1] + c.r[3] + 3;
          const L = 26 / s;
          const box: React.CSSProperties = { position: "absolute", background: light ? CHIP_TONE.light.fill : "#000", color: light ? CHIP_TONE.light.text : "#fff", border: light ? `${3 / s}px solid ${RC.lineRed}` : undefined, textShadow: light ? CHIP_TONE.light.shadow : undefined, fontFamily: FONT.nunito, fontWeight: 700, fontSize: capCss, lineHeight: 1.18,
            padding: `${(0.16 * capCss).toFixed(2)}px ${(0.36 * capCss).toFixed(2)}px`, whiteSpace: "nowrap", boxShadow: `0 ${6 / s}px ${16 / s}px rgba(0,0,0,.35)` };
          const ex = c.r[0] + c.r[2];
          return (
            <div key={i} style={{ opacity: dim }}>
              <div style={{ position: "absolute", left: c.r[0], top: uy - 1.5 / s, width: c.r[2] * ul, height: 3.5 / s, background: RC.pageRed }} />
              {side === "right" ? (
                <div style={{ position: "absolute", left: ex + 6 / s, top: c.r[1] + c.r[3] / 2 - 1.5 / s, width: L * lead, height: 3 / s, background: "#111" }} />
              ) : (
                <div style={{ position: "absolute", left: c.r[0] + 14 / s, top: side === "below" ? uy : c.r[1] - 4 / s - L * lead, width: 3 / s, height: L * lead, background: "#111" }} />
              )}
              {txt ? (
                side === "right" ? <div style={{ ...box, left: ex + 6 / s + L, top: c.r[1] + c.r[3] / 2, transform: "translateY(-50%)" }}>{txt}</div>
                  : <div style={{ ...box, left: c.r[0], top: side === "below" ? uy + L : c.r[1] - 4 / s - L, transform: side === "below" ? undefined : "translateY(-100%)" }}>{txt}</div>
              ) : null}
            </div>
          );
        })}
      </PageSheet>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 64% 58% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,.45) 80%, rgba(0,0,0,.75) 100%)" }} />
    </AbsoluteFill>
  );
};
export const TranslateOverlay: React.FC<TranslateOverlayProps> = (p) => {
  const f = useCurrentFrame();
  const moving = p.follow !== false && p.chips.some((c) => f > c.at - 5 && f < c.at - 6 + MOVE * 0.4);
  return <Entered entry="fade" fadeDur={30}><MBlur on={moving}><Inner {...p} /></MBlur></Entered>;
};
