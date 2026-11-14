// stat / FlowCount_A (EDITOR A sibling of RollUp / TwoTone / StatSwitch; Amusement Park 2026-10-19).
// REF DD Zoo stacked stats (white figure + red key word, on the case's dimmed footage) + RollUp (14 f ease-out roll, 8 px rise) + VV 2026
// continuous camera. Rows CHANGE STATE on the words: the next row rises in while the previous one is carried up and dims (state change, not a
// stack), the whole group rides a lateral truck (-30 px/s, ramped in) with an oversize 1.12 -> 1 settle on its first frame (EZ.quick).
// Figure: Nunito 900 white; word: Varela Round + stroke in DD red #F22522 with the label glow. Numbers roll only between their OWN values
// (M-069: `from` is the stated start, never 0 unless the VO counts from 0). Plate: the footage behind is darkened locally by a feathered band
// (never text on black, M-031). Silent (typing only if the case types a value).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, RoundText, W, clamp01, fs, lerp } from "../../core";

export type FlowRow = { num: string; word: string; at: number; wordAt?: number; from?: number; to?: number; prefix?: string; suffix?: string; decimals?: number };
export type FlowCountAProps = { rows: FlowRow[]; x?: number; y?: number; cap?: number; exitAt?: number; align?: "left" | "center"; truck?: number };
const LRED = "#F22522";
const fmt = (v: number, d = 0) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const FlowCount_A: React.FC<FlowCountAProps> = ({ rows, x = 300, y = 470, cap = 150, exitAt, align = "left", truck = -30 }) => {
  const f = useCurrentFrame();
  const t0 = rows[0].at;
  const k0 = f - t0;
  if (k0 < 0) return null;
  const ramp = clamp01(k0 / 20);
  const dx = truck * (k0 / 30) * ramp;
  const over = lerp(1.12, 1, EZ.quick(clamp01(k0 / 22)));
  const ex = exitAt === undefined ? 0 : EZ.in2((f - exitAt) / 14);
  const active = rows.reduce((a, r, i) => (f >= r.at ? i : a), 0);
  const lift = cap * 1.75;
  return (
    <AbsoluteFill style={{ opacity: 1 - ex, filter: ex > 0 ? `blur(${(3 * ex).toFixed(2)}px)` : undefined }}>
      <div style={{ position: "absolute", left: (align === "left" ? x - 340 : W / 2 - 900) + dx * 0.5, top: y - cap * 1.6, width: 1800, height: cap * 3.6, opacity: 0.55 * clamp01(k0 / 10),
        background: "radial-gradient(ellipse 48% 50% at 40% 50%, rgba(0,0,0,.82) 0%, rgba(0,0,0,.42) 55%, rgba(0,0,0,0) 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 1080, transform: `translateX(${dx.toFixed(2)}px) scale(${over.toFixed(4)})`, transformOrigin: `${x}px ${y}px` }}>
        {rows.map((r, i) => {
          const k = f - r.at; if (k < 0) return null;
          const carried = i < active ? EZ.quick(clamp01((f - rows[i + 1].at) / 18)) : 0;
          if (carried >= 1) return null;
          const rise = 26 * (1 - EZ.out3(k / 22));
          const o = EZ.out2(k / 10) * Math.pow(1 - carried, 2);
          const yy = y + rise - carried * lift;
          const ru = EZ.out3(clamp01(k / 14));
          const val = r.to !== undefined ? `${r.prefix ?? ""}${fmt(lerp(r.from ?? r.to, r.to, ru), r.decimals)}${r.suffix ?? ""}` : r.num;
          const wk = f - (r.wordAt ?? r.at + 6);
          const wo = wk < 0 ? 0 : EZ.out2(wk / 10);
          const wb = wk < 0 ? 8 : 8 * (1 - clamp01(wk / 10));
          return (
            <div key={i} style={{ position: "absolute", left: align === "left" ? x : 0, width: align === "left" ? undefined : W, top: yy - cap, opacity: o, display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "center", gap: cap * 0.12, transform: `scale(${lerp(1, 0.86, carried).toFixed(4)})`, transformOrigin: "0 0" }}>
              <div style={{ fontFamily: FONT.nunito, fontWeight: 900, fontSize: fs("nunito", cap), lineHeight: 1, color: "#FDFDFD", whiteSpace: "nowrap", filter: "drop-shadow(0 4px 12px rgba(0,0,0,.7))", fontVariantNumeric: "tabular-nums" }}>{val}</div>
              <div style={{ opacity: wo, transform: `translateY(${(22 * (1 - EZ.out3(wk / 21))).toFixed(2)}px)`, filter: `drop-shadow(0 0 6px rgba(242,37,34,.7)) drop-shadow(0 0 16px rgba(242,37,34,.4)) drop-shadow(0 3px 6px rgba(0,0,0,.6))${wb > 0.05 ? ` blur(${wb.toFixed(2)}px)` : ""}` }}>
                <RoundText text={r.word} cap={cap * 0.4} colour={LRED} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
