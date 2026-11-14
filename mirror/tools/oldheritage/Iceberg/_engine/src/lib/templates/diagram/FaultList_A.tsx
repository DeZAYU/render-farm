// diagram / FaultList_A (EDITOR A sibling of ListBuild_A / CleanDiagram; Amusement Park 2026-10-19).
// Faults found, as neon line icons in a row: each item draws its white line glyph on its word (16 f), then a red neon X (or a red ring for
// "present but wrong") slams over it 6 f later with a 2 f bloom; the caption under it rises 24 px. Editor A motion: the row sits on a
// world plane the camera re-centres onto the newest item (EZ.quick 24 f) plus a constant +1.2 %/s push and a slow lateral drift, so the
// frame never holds. Black with a faint red floor glow. Use for "fewer screws / no washers / not bolted down".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs, lerp } from "../../core";
import { Glyph } from "../neon/glyphs";

export type Fault = { glyph: string; label: string; at: number; mark?: "x" | "ring" };
export type FaultListAProps = { items: Fault[]; header?: { text: string; at: number }; size?: number; labelCap?: number };
const RED = "#E8201E";
export const FaultList_A: React.FC<FaultListAProps> = ({ items, header, size = 200, labelCap = 32 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const pitch = 540;
  const X = (i: number) => W / 2 + (i - (items.length - 1) / 2) * pitch;
  // the camera leans toward the newest item (a third of the way), never far enough to crop the row
  let cx = W / 2;
  items.forEach((it, i) => { cx = lerp(cx, W / 2 + (X(i) - W / 2) * 0.12, EZ.quick(clamp01((f - it.at + 6) / 24))); });
  const s = (items.length > 2 ? 0.9 : 1) * (1 + 0.012 * t);
  const hk = header ? f - header.at : -1;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 40% at 50% 92%, rgba(120,10,12,.35), #040404 70%)", overflow: "hidden" }}>
      {header && hk >= 0 ? <div style={{ position: "absolute", left: 0, width: W, top: 0.16 * H, textAlign: "center", opacity: clamp01(hk / 8), fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", 32), color: "#E6E6E6", letterSpacing: "0.12em" }}>{header.text}</div> : null}
      <AbsoluteFill style={{ transform: `translateX(${(W / 2 - cx - 10 * t).toFixed(2)}px) scale(${s.toFixed(5)})`, transformOrigin: "50% 50%" }}>
        {items.map((it, i) => {
          const k = f - it.at;
          if (k < 0) return null;
          const d = EZ.out3(clamp01(k / 16));
          const mk = k - 22;
          const m = mk >= 0 ? EZ.quick(clamp01(mk / 6)) : 0;
          const bloom = mk >= 0 && mk < 2 ? 1 : 0;
          const ly = 24 * (1 - EZ.out3(clamp01((k - 8) / 12)));
          return (
            <div key={i} style={{ position: "absolute", left: X(i) - size / 2, top: H * 0.48 - size / 2, width: size, height: size }}>
              <div style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.7)) drop-shadow(0 0 18px rgba(255,255,255,.25))" }}><svg width={size} height={size} style={{ overflow: "visible" }}><g transform={`translate(${size / 2} ${size / 2})`}><Glyph name={it.glyph} colour="#F4F6F6" size={size} mode="line" lineW={7} draw={d} /></g></svg></div>
              {m > 0 ? (
                <svg width={size * 1.3} height={size * 1.3} style={{ position: "absolute", left: -size * 0.15, top: -size * 0.15, overflow: "visible", filter: `drop-shadow(0 0 ${8 + 14 * bloom}px rgba(232,32,30,.9))` }}>
                  {it.mark === "ring"
                    ? <circle cx={size * 0.65} cy={size * 0.65} r={size * 0.62 * m} fill="none" stroke={RED} strokeWidth={9} />
                    : <path d={`M${size * 0.1} ${size * 0.1} L${size * 0.1 + size * 1.1 * m} ${size * 0.1 + size * 1.1 * m} M${size * 1.2} ${size * 0.1} L${size * 1.2 - size * 1.1 * m} ${size * 0.1 + size * 1.1 * m}`} stroke={RED} strokeWidth={11} strokeLinecap="round" fill="none" />}
                </svg>
              ) : null}
              <div style={{ position: "absolute", left: size / 2, top: size + 40 + ly, transform: "translateX(-50%)", opacity: clamp01((k - 8) / 10), fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", labelCap), color: "#F2F2F2", width: 480, whiteSpace: "normal", lineHeight: 1.25, textAlign: "center" }}>{it.label}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
