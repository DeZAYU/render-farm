// toll / MemorialLine_A (EDITOR A sibling of NameAgeRoll; Amusement Park 2026-10-19).
// For the people who died: a quiet card, no photos, no red. Each name types on in white (Inter 600, 1.4 f per character) on its spoken word,
// then a thin grey line draws under it and the detail ("19 · died that night") fades up in light grey. Editor A motion, kept gentle: a very
// slow push (+0.8 %/s) and a soft warm light that drifts across the dark background (radial, 6 % opacity), so the frame is never still but
// never busy either. No SFX hits on this device.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";

export type Remembered = { name: string; at: number; detail?: string; detailAt?: number };
export type MemorialLineAProps = { people: Remembered[]; header?: { text: string; at: number }; cap?: number };
export const MemorialLine_A: React.FC<MemorialLineAProps> = ({ people, header, cap = 58 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const lx = 30 + 40 * Math.sin(t * 0.35);
  const pitch = cap * 3.6;
  const y0 = H / 2 - (people.length * pitch) / 2 + 20;
  const hk = header ? f - header.at : -1;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 60% at ${lx.toFixed(1)}% 45%, rgba(255,214,160,.06), rgba(0,0,0,0) 70%), #050505`, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${(1 + 0.008 * t).toFixed(5)})` }}>
        {header && hk >= 0 ? <div style={{ position: "absolute", left: 0, width: W, top: y0 - cap * 1.6, textAlign: "center", opacity: clamp01(hk / 12) * 0.85, fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", 26), color: "#BDBDBD", letterSpacing: "0.18em" }}>{header.text}</div> : null}
        {people.map((p, i) => {
          const k = f - p.at;
          if (k < 0) return null;
          const shown = p.name.slice(0, Math.min(p.name.length, Math.floor(k / 1.4) + 1));
          const ln = EZ.out3(clamp01((k - p.name.length * 1.4) / 14));
          const dk = f - (p.detailAt ?? p.at + p.name.length * 1.4 + 8);
          return (
            <div key={i} style={{ position: "absolute", left: 0, width: W, top: y0 + i * pitch, textAlign: "center" }}>
              <div style={{ fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", cap), color: "#F2F2F2", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{shown}</div>
              <div style={{ margin: "14px auto 0", width: 420 * ln, height: 1.5, background: "rgba(220,220,220,.5)" }} />
              {p.detail && dk >= 0 ? <div style={{ marginTop: 14, opacity: clamp01(dk / 14) * 0.9, fontFamily: FONT.inter, fontWeight: 500, fontSize: fs("inter", 28), color: "#B8B8B8", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{p.detail}</div> : null}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
