// timeline / VerticalStack: entries stacked DOWN a vertical rule (year + what happened), the camera tilting down as each lands, ending on an EMPTY
// slot outlined in red that fills on its word ("NOBODY WENT TO PRISON"). REF: VV @ 3:28.0 (MOTION §11 world-space camera, quick-start / long-
// settle phases, labels never move after they land), here vertical + Dashcam Vol.1 E9 red bar (the slot fills like a DD red page bar, @ 4:15.8)
// + VV §1 chapter box (red box, white caps, +0.15 em tracking, Bebas). Differs from YearScroll (a yawed column with a focus band, one year per
// beat) and WorldCamera (horizontal line with photo cards): left-anchored rule, mixed text entries, and the payoff is an absence made visible.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, MBlur, RC, W, clamp01, fs, lerp, measure } from "../../core";

export type StackRow = { year?: string; text: string; at: number };
export type VerticalStackProps = { rows: StackRow[]; slot?: { text: string; at: number; fillAt: number }; pitch?: number; cap?: number; labelCap?: number };

export const VerticalStack: React.FC<VerticalStackProps> = ({ rows, slot, pitch = 175, cap = 80, labelCap = 40 }) => {
  const k = useCurrentFrame();
  const RX = 640, Y0 = 420;
  const ys = rows.map((_, i) => Y0 + i * pitch);
  const slotY = Y0 + rows.length * pitch + 30;
  // camera: keep the newest entry around 0.46 H (quick start / long settle per landing)
  const targets = [...rows.map((r, i) => ({ at: r.at, y: ys[i] })), ...(slot ? [{ at: slot.at, y: slotY + 40 }] : [])];
  let camY = 0.46 * H, fast = false;
  targets.forEach((t, i) => {
    const u = clamp01((k - t.at + 2) / 40);
    const goal = Math.max(0.46 * H, t.y) ;
    camY = lerp(camY, goal, i % 2 ? EZ.quick(u) : EZ.phaseB(u));
    if (u > 0.05 && u < 0.4 && goal > 0.46 * H) fast = true;
  });
  const dy = 0.46 * H - camY;
  const tilt = 2 + 4 * clamp01(-dy / 600);
  const yf = fs("bebas", cap), tf = fs("inter", labelCap);
  // rule length follows the latest landed entry
  let ruleTo = Y0 - 40;
  targets.forEach((t) => { const u = EZ.out3((k - t.at) / 12); if (u > 0) ruleTo = lerp(ruleTo, t.y, u); });
  const sk = slot ? k - slot.at : -1, fk = slot ? k - slot.fillAt : -1;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 75% at 40% 45%, #19191b 0%, #0b0b0c 60%, #040404 100%)", perspective: 2400 }}>
      <MBlur on={fast} samples={6}>
        <AbsoluteFill style={{ transformOrigin: "50% 40%", transform: `rotateX(${tilt.toFixed(3)}deg) translateY(${dy.toFixed(2)}px) scale(${(1 + 0.006 * (k / 30)).toFixed(5)})` }}>
          <div style={{ position: "absolute", left: RX - 2, top: Y0 - 80, width: 4, height: Math.max(0, ruleTo - Y0 + 80), background: "linear-gradient(to bottom, rgba(233,233,230,0), rgba(233,233,230,.6) 60px)" }} />
          {rows.map((r, i) => {
            const q = k - r.at;
            if (q < 0) return null;
            const w = EZ.out3(q / 12);
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: RX - 11, top: ys[i] - 11, width: 22, height: 22, borderRadius: 11, background: "#0b0b0c", border: "4px solid #E9E9E6", boxSizing: "border-box",
                  transform: `scale(${(1.35 - 0.35 * EZ.out3(q / 8)).toFixed(3)})`, opacity: clamp01(q / 4) }} />
                {r.year ? (
                  <div style={{ position: "absolute", left: RX - 460, width: 420, top: ys[i] - yf * 0.52, textAlign: "right", fontFamily: FONT.bebas, fontSize: yf, lineHeight: 1, color: "#F2F2F0",
                    clipPath: `inset(-10% 0 -10% ${((1 - w) * 100).toFixed(2)}%)` }}>{r.year}</div>
                ) : null}
                <div style={{ position: "absolute", left: RX + 48, top: ys[i] - tf * 0.62, whiteSpace: "nowrap", fontFamily: FONT.inter, fontWeight: 500, fontSize: tf, color: "#D9DADB",
                  clipPath: `inset(-20% ${((1 - w) * 100).toFixed(2)}% -20% 0)` }}>{r.text}</div>
              </React.Fragment>
            );
          })}
          {slot && sk >= 0 ? (() => {
            const o = clamp01(sk / 8);
            const fill = fk < 0 ? 0 : EZ.out3(fk / 9);
            const slam = fk < 0 ? 1 : 1.06 - 0.06 * EZ.out3(fk / 10);
            const sf = fs("bebas", 54), sw = Math.min(W - RX - 120, measure(slot.text, `${sf}px "${FONT.bebas}"`) + 0.1 * sf * slot.text.length + 80);
            return (
              <div style={{ position: "absolute", left: RX - 30, top: slotY, width: sw, height: 120, opacity: o, transform: `scale(${slam.toFixed(4)})`, transformOrigin: "0 50%" }}>
                <div style={{ position: "absolute", inset: 0, border: `3px dashed ${fill > 0.98 ? "transparent" : "rgba(234,0,22,.85)"}` }} />
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(fill * 100).toFixed(2)}%`, background: RC.vvChapterBox, boxShadow: fill > 0 ? "0 0 26px rgba(234,0,22,.45)" : undefined }} />
                {fk >= 0 ? (
                  <div style={{ position: "absolute", left: 40, top: 0, height: "100%", display: "flex", alignItems: "center", fontFamily: FONT.bebas, fontSize: sf, letterSpacing: "0.1em", color: "#FFFBF9",
                    clipPath: `inset(0 ${((1 - fill) * 100).toFixed(2)}% 0 0)`, whiteSpace: "nowrap" }}>{slot.text}</div>
                ) : null}
              </div>
            );
          })() : null}
        </AbsoluteFill>
      </MBlur>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(4,4,4,.8) 0%, rgba(4,4,4,0) 22%, rgba(4,4,4,0) 80%, rgba(4,4,4,.85) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
