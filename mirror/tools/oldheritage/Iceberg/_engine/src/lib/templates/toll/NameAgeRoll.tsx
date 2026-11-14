// toll / NameAgeRoll: a memorial roll. Names are TYPED one per line on their words (no photos), then ages or a status type in on their own words;
// lines can fade (the survivors / children leave the list) or turn red (critical). REF: Farrell memorial roll / Farrell text R2 (names typed,
// Arial/Helvetica class, each name on its word; T9 typed text ~1 character per frame) + Farrell story §2 NUMBER (the figure lands on its first
// syllable) + Dashcam Vol.1 E4 typed time (D1 0:16.9 "40 minutes" red typed per character ~2 f/char).
// Differs from every other toll variant: no glyph field at all, the people are their names; the only motion is typing, fades and a slow upward roll.
import React from "react";
import { useCurrentFrame } from "remotion";
import { FONT, H, RC, W, clamp01, fs } from "../../core";
import { Plate } from "../../core/kits/toll";

export type RollRow = { name: string; at: number; age?: string; ageAt?: number; note?: string; noteAt?: number; fadeAt?: number; redAt?: number };
export type NameAgeRollProps = { rows: RollRow[]; cap?: number; step?: number; roll?: number; subCap?: number };

const typed = (t: string, q: number, step: number) => (q < 0 ? "" : t.slice(0, Math.min(t.length, Math.floor(q / step) + 1)));

export const NameAgeRoll: React.FC<NameAgeRollProps> = ({ rows, cap = 40, step = 1.5, roll = 3, subCap = 28 }) => {
  const k = useCurrentFrame();
  const f = fs("inter", cap), fa = fs("inter", cap * 1.05), fn = fs("inter", subCap);
  const pitch = cap * 2.35;
  const blockH = rows.length * pitch;
  const top = H / 2 - blockH / 2 - (roll * k) / 30;
  const left = W / 2 - 400, ageX = W / 2 + 400;
  return (
    <Plate bg="#040404">
      {rows.map((r, i) => {
        const y = top + i * pitch;
        const fade = r.fadeAt === undefined ? 0 : clamp01((k - r.fadeAt) / 14);
        const red = r.redAt === undefined ? 0 : clamp01((k - r.redAt) / 6);
        const q = k - r.at;
        if (q < 0) return null;
        const nm = typed(r.name, q, step);
        const cursor = nm.length < r.name.length;
        const ag = r.age !== undefined ? typed(r.age, k - (r.ageAt ?? r.at + 30), 2) : "";
        const nt = r.note !== undefined ? typed(r.note, k - (r.noteAt ?? r.at + 20), 1.2) : "";
        const nameCol = red > 0 ? `rgb(${Math.round(242 - 0 * red)},${Math.round(242 - 205 * red)},${Math.round(240 - 206 * red)})` : "#F2F2F0";
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: y, width: W, height: pitch, opacity: 1 - 0.74 * fade }}>
            <div style={{ position: "absolute", left: left - 46, top: pitch / 2 - 7, width: 14, height: 14, borderRadius: 7, background: red > 0 ? RC.d1Red : "#5C5E61",
              boxShadow: red > 0 ? `0 0 ${(12 * red).toFixed(1)}px rgba(235,24,25,.8)` : undefined, opacity: clamp01(q / 4) }} />
            <div style={{ position: "absolute", left, top: 0, height: pitch, display: "flex", alignItems: "center", gap: 22, whiteSpace: "pre" }}>
              <span style={{ fontFamily: FONT.inter, fontWeight: 500, fontSize: f, color: nameCol, textShadow: red > 0 ? "0 0 10px rgba(235,24,25,.45)" : "0 2px 8px rgba(0,0,0,.6)" }}>
                {nm}<span style={{ opacity: cursor && Math.floor(k / 4) % 2 === 0 ? 0.8 : 0 }}>|</span>
              </span>
              {nt ? <span style={{ fontFamily: FONT.inter, fontWeight: 400, fontSize: fn, color: "#9C9EA1" }}>{nt}</span> : null}
            </div>
            {ag ? (
              <div style={{ position: "absolute", left: ageX - 300, width: 300, top: 0, height: pitch, display: "flex", alignItems: "center", justifyContent: "flex-end",
                fontFamily: FONT.inter, fontWeight: 600, fontSize: fa, color: RC.labelRed, fontVariantNumeric: "tabular-nums", textShadow: "0 0 10px rgba(249,9,15,.45)" }}>{ag}</div>
            ) : null}
          </div>
        );
      })}
    </Plate>
  );
};
