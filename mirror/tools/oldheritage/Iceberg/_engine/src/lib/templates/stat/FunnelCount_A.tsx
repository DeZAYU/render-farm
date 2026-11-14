// stat / FunnelCount_A (EDITOR A sibling of Arithmetic / CountUp_A; Amusement Park 2026-10-19).
// A casualty count that NARROWS: each stage is a bar whose width is proportional to its number (log-ish, so 65 vs 4 both read), stacked
// top-down and joined by a funnel outline that draws between them on the next stage's word; the number counts up inside the bar (16 f) and
// its label sits to the right. The last stage can split into parts ("4 burns + 1 fall"). Editor A motion: the whole funnel rides a slow
// downward camera tilt that keeps the newest stage at 55 % height (EZ.quick re-centre) plus a +1 %/s push; plate = case footage at 34 %.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs, lerp } from "../../core";
import { FootPlate } from "../labels/kit";

export type Stage = { value: number; label: string; at: number; red?: boolean; parts?: { value: number; label: string }[] };
export type FunnelCountAProps = { media?: string; mediaStart?: number; stages: Stage[]; max?: number; cap?: number; labelCap?: number };
export const FunnelCount_A: React.FC<FunnelCountAProps> = ({ media, mediaStart = 0, stages, max, cap = 64, labelCap = 30 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const M = max ?? Math.max(...stages.map((s) => s.value));
  const wOf = (v: number) => 220 + 760 * Math.sqrt(v / M);
  const pitch = 170;
  const cx = 0.36 * W;
  let camY = 0;
  stages.forEach((s, i) => { camY = lerp(camY, Math.max(0, i * pitch - 1.2 * pitch), EZ.quick(clamp01((f - s.at + 4) / 22))); });
  const y0 = 0.3 * H;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {media ? <FootPlate src={media} startFrom={mediaStart} push={0.02} filter="blur(10px) brightness(.34) saturate(.75)" /> : <AbsoluteFill style={{ background: "#070707" }} />}
      <AbsoluteFill style={{ transform: `translateY(${(-camY).toFixed(2)}px) scale(${(1 + 0.01 * t).toFixed(5)})` }}>
        <svg width={W} height={H * 2} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {stages.slice(1).map((s, i) => {
            const k = f - s.at;
            if (k < 0) return null;
            const u = EZ.out3(clamp01(k / 10));
            const a = stages[i], wa = wOf(a.value), wb = wOf(s.value);
            const ya = y0 + i * pitch + 96, yb = y0 + (i + 1) * pitch;
            const yl = lerp(ya, yb, u);
            return <g key={i} stroke="rgba(255,255,255,.45)" strokeWidth={2} fill="none">
              <line x1={cx - wa / 2} y1={ya} x2={lerp(cx - wa / 2, cx - wb / 2, u)} y2={yl} />
              <line x1={cx + wa / 2} y1={ya} x2={lerp(cx + wa / 2, cx + wb / 2, u)} y2={yl} />
            </g>;
          })}
        </svg>
        {stages.map((s, i) => {
          const k = f - s.at;
          if (k < 0) return null;
          const w = wOf(s.value) * EZ.quick(clamp01(k / 10));
          const top = y0 + i * pitch;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: cx - w / 2, top, width: w, height: 96, background: s.red ? "rgba(227,10,16,.88)" : "rgba(245,245,245,.92)", borderRadius: 4, boxShadow: s.red ? "0 0 22px rgba(227,10,16,.45)" : "0 8px 22px rgba(0,0,0,.5)" }} />
              <div style={{ position: "absolute", left: cx, top: top + 48, transform: "translate(-50%,-50%)", fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", cap), color: s.red ? "#fff" : "#111", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {s.parts && k > 20 ? s.parts.map((p) => `${p.value} ${p.label}`).join("  +  ") : s.value}
              </div>
              <div style={{ position: "absolute", left: cx + wOf(s.value) / 2 + 30, top: top + 48, transform: "translateY(-50%)", opacity: clamp01((k - 6) / 8), fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", labelCap), color: "#EDEDED", letterSpacing: "0.06em", whiteSpace: "nowrap", textShadow: "0 3px 10px rgba(0,0,0,.7)" }}>{s.label}</div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
