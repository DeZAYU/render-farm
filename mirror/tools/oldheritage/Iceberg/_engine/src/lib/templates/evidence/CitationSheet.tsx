// evidence / CitationSheet: an index sheet of findings. A ruled sheet (red margin rule) lies on a dark plate; each finding lands on its words
// as a printed strip (typewriter type, or a cropped source excerpt) with the DD item entry (fade 10 f + 1.04 -> 1 settle), and a red tick
// draws in the margin beside it. The camera steps down the sheet with each new line (quick start / long settle), then pulls back to show
// the whole list.
// REF Dashcam Vol.1 E12 item timing (884.4-902.7: 10 f fade, 1.04 settle, moves .45,0,.2,1) + VV §11 phase camera @3:28.0; typewriter
// strips = Courier Prime (FONTS.md level/typewriter cards).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, FONT, MBlur, RC, asset, clamp01, fs, lerp, lerpLog } from "../../core";

export type CitationRow = { text?: string; src?: string; cssW?: number; cssH?: number; crop?: [number, number, number, number]; at: number };
export type CitationSheetProps = {
  rows: CitationRow[];
  title?: string; // optional typed heading on the sheet
  pullAt?: number; // pull back to the whole sheet
  paper?: string;
  cap?: number; // row text cap in sheet px (default 40; on screen x the pull-back zoom, ~43 at the default 4 rows)
  labelCap?: number; // heading cap (default 44)
};
const SW = 1500, ROW = 150, TOP = 170, ML = 150;
const Inner: React.FC<CitationSheetProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const SH = TOP + p.rows.length * ROW + 120;
  let cy = TOP + ROW / 2, z = 1.45;
  for (let i = 1; i < p.rows.length; i++) {
    const u = EZ.quick((f - p.rows[i].at + 2) / 24);
    cy = lerp(cy, TOP + i * ROW + ROW / 2, u);
  }
  const fit = Math.min(1700 / SW, 960 / SH);
  const pu = p.pullAt !== undefined ? EZ.settle((f - p.pullAt) / 40) : 0;
  cy = lerp(cy, SH / 2, pu); z = lerpLog(z, fit, pu) * (1 + 0.008 * t);
  const cx = lerp(SW / 2 - 120, SW / 2, pu);
  return (
    <AbsoluteFill style={{ background: "#0b0a09" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 60% at 50% 45%, #24201c 0%, #0b0a09 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px, 540px) rotate(${(-0.7 + 0.08 * t).toFixed(3)}deg) scale(${z.toFixed(4)}) translate(${-cx}px, ${-cy}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, background: p.paper ?? "#F1EEE4", boxShadow: "0 30px 70px rgba(0,0,0,.6)",
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${ROW - 2}px, rgba(70,110,170,.28) ${ROW - 2}px, rgba(70,110,170,.28) ${ROW}px)`, backgroundPosition: `0 ${TOP}px` }}>
          <div style={{ position: "absolute", left: ML - 30, top: 0, width: 3, height: SH, background: "rgba(214,40,40,.55)" }} />
          {p.title ? (
            <div style={{ position: "absolute", left: ML, top: 52, fontFamily: FONT.courier, fontWeight: 700, fontSize: fs("courier", p.labelCap ?? 44), color: "#262321", letterSpacing: "0.04em" }}>{p.title}</div>
          ) : null}
          {p.rows.map((r, i) => {
            const k = f - r.at;
            if (k < 0) return null;
            const o = clamp01(k / 10), sc = 1.04 - 0.04 * EZ.out3(k / 14);
            const y = TOP + i * ROW + 16;
            const tick = EZ.out2((k - 6) / 8);
            const rot = ((i * 37) % 5 - 2) * 0.35;
            const ih = r.src && r.cssW && r.cssH ? (() => { const c = r.crop ?? [0, 0, r.cssW!, r.cssH!]; return { c, k: 1180 / (c[2] - c[0]) }; })() : null;
            return (
              <div key={i}>
                <svg width={90} height={90} style={{ position: "absolute", left: 22, top: y + 4, overflow: "visible" }}>
                  <path d="M10 48 L34 72 L80 14" fill="none" stroke={RC.ringRed} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
                    strokeDasharray={`${tick} 1`} style={{ filter: "drop-shadow(0 0 4px rgba(227,10,16,.45))" }} />
                </svg>
                <div style={{ position: "absolute", left: ML, top: y, width: 1200, height: ROW - 32, opacity: o, transform: `scale(${sc}) rotate(${rot}deg)`, transformOrigin: "0 50%",
                  background: "#fff", boxShadow: "3px 6px 12px rgba(0,0,0,.28)", overflow: "hidden", display: "flex", alignItems: "center" }}>
                  {ih ? (
                    <Img src={asset(r.src!)} style={{ position: "absolute", left: -ih.c[0] * ih.k + 10, top: -ih.c[1] * ih.k + 4, width: r.cssW! * ih.k, mixBlendMode: "multiply" }} />
                  ) : (
                    <div style={{ paddingLeft: 30, fontFamily: FONT.courier, fontWeight: 700, fontSize: fs("courier", p.cap ?? 40), color: "#1c1b1a", whiteSpace: "nowrap" }}>{r.text}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
export const CitationSheet: React.FC<CitationSheetProps> = (p) => {
  const f = useCurrentFrame();
  const fast = p.rows.slice(1).some((r) => f > r.at + 1 && f < r.at + 12) || (p.pullAt !== undefined && f > p.pullAt + 3 && f < p.pullAt + 18);
  return <MBlur on={fast}><Inner {...p} /></MBlur>;
};
