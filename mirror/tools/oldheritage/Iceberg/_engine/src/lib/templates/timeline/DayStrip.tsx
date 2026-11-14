// timeline / DayStrip: a row of day cells that light one per day at a mechanical rhythm ("around a month", "seventeen days"), with a place label
// above and tags that land on their words below; an optional second, shorter row for a parallel story. REF: VV MOTION §15 rule 10 (mechanical
// rhythms where the meaning is mechanical: typing at exactly 5 f/char, comments every 14 f) applied to days + Farrell story NUMBER (the figure
// lands on its word, LED-style counts) + Dashcam Vol.3 @ 0:03.4 E2 label (rounded face, white + red word) for the place and tags.
// Differs from the other timelines (years, cameras, rulers): it measures a DURATION in days, cell by cell, no camera travel.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, RC, RoundText, W, clamp01, fs } from "../../core";

export type DayRow = { count: number; at: number; dur?: number; label?: string; red?: boolean; tags?: { text: string; at: number; red?: boolean }[] };
export type DayStripProps = { rows: DayRow[]; title?: { text: string; red?: string; at: number }; unit?: string;
  /** cap height (px) of the row label and the unit (M-024: >= 28). Default 30; the count is x1.25 */ cap?: number };

export const DayStrip: React.FC<DayStripProps> = ({ rows, title, unit = "days", cap = 30 }) => {
  const k = useCurrentFrame();
  const maxN = Math.max(...rows.map((r) => r.count));
  const cell = Math.min(46, 1440 / maxN - 10), gap = Math.max(6, cell * 0.22), pitchX = cell + gap;
  const rowH = 230;
  const top0 = H / 2 - (rows.length * rowH) / 2 + 60;
  const left = W / 2 - (maxN * pitchX) / 2 - 90;
  const z = 1 + 0.006 * (k / 30);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 48%, #18181a 0%, #0a0a0b 60%, #040404 100%)" }}>
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(5)})` }}>
        {title && k >= title.at ? (
          <div style={{ position: "absolute", left, top: top0 - 150, display: "flex", gap: 18, opacity: EZ.out2((k - title.at) / 14), transform: `translateY(${(19 * (1 - EZ.out3((k - title.at) / 26))).toFixed(2)}px)`,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }}>
            <RoundText text={title.text} cap={50} colour="#FDFDFD" />
            {title.red ? <div style={{ filter: "drop-shadow(0 0 6px rgba(242,37,34,.7))" }}><RoundText text={title.red} cap={50} colour={RC.placeRed} /></div> : null}
          </div>
        ) : null}
        {rows.map((r, ri) => {
          const y = top0 + ri * rowH;
          const dur = r.dur ?? Math.max(20, r.count * 1.6);
          const lit = clamp01((k - r.at) / dur) * r.count; // linear: days pass mechanically
          const n = Math.min(r.count, Math.floor(lit + 1e-6));
          const shown = clamp01((k - r.at + 10) / 10);
          return (
            <React.Fragment key={ri}>
              {r.label ? <div style={{ position: "absolute", left, top: y - cap * 1.9, fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", cap), color: "#C4C6C9", letterSpacing: "0.06em", opacity: shown }}>{r.label}</div> : null}
              {Array.from({ length: r.count }, (_, i) => {
                const on = clamp01(lit - i); // 0..1 inside the lighting frame
                const isLast = r.red && i === r.count - 1;
                const front = on > 0 && on < 1 ? 1 : 0;
                const bg = on > 0 ? (isLast ? RC.d1Red : `rgba(236,238,238,${(0.35 + 0.6 * on).toFixed(3)})`) : "rgba(255,255,255,.06)";
                return (
                  <div key={i} style={{ position: "absolute", left: left + i * pitchX, top: y, width: cell, height: cell, borderRadius: cell * 0.16, background: bg, opacity: shown,
                    border: on > 0 ? "none" : "1.5px solid rgba(255,255,255,.14)", boxSizing: "border-box",
                    boxShadow: on > 0 ? `0 0 ${(front ? 22 : 8).toFixed(0)}px ${isLast ? "rgba(235,24,25,.7)" : `rgba(255,255,255,${front ? 0.6 : 0.18})`}` : undefined }} />
                );
              })}
              <div style={{ position: "absolute", left: left + r.count * pitchX + 26, top: y + cell / 2 - fs("inter", Math.max(34, cap * 1.25)) * 0.62, whiteSpace: "nowrap", opacity: clamp01((k - r.at) / 6),
                fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", Math.max(34, cap * 1.25)), color: r.red && n === r.count ? RC.labelRed : "#F2F2F0", fontVariantNumeric: "tabular-nums" }}>
                {n} <span style={{ fontWeight: 400, fontSize: fs("inter", cap), color: "#C0C2C5" }}>{unit}</span>
              </div>
              <div style={{ position: "absolute", left, top: y + cell + 34, display: "flex", gap: 34, alignItems: "flex-end" }}>
                {(r.tags ?? []).map((t, ti) => {
                  const q = k - t.at;
                  if (q < 0) return null;
                  return (
                    <div key={ti} style={{ opacity: EZ.out2(q / 14), transform: `translateY(${(16 * (1 - EZ.out3(q / 22))).toFixed(2)}px)`, filter: t.red ? "drop-shadow(0 0 6px rgba(242,37,34,.65))" : "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}>
                      <RoundText text={t.text} cap={34} colour={t.red ? RC.placeRed : "#E6E6E6"} />
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
