// diagram / ScaleCompare (NEW 2026-10-18, zoo builder ic): true-scale line-art comparison + measured rules, built on the words.
// REF Farrell silhouette / scale explainers (refstudy/fullstudy/motion/silhouette: a white line figure beside the object, a rule draws between
// two ticks and the figure lands on its word; plane near-locked with a slow push) + VV §11 world-space infographic (quick start / long settle
// camera, bezier .31,0,0,.957) + D3 E5 stat type for the measured values.
// Ours: any glyphs (animal silhouettes, a 6 ft person outline) placed in a world plane at true relative size; rules (length / depth / height)
// draw tick-to-tick and their value lands on the spoken word; optional section lines (a pool / moat / wall outline, dashed paths) and a water
// fill; glyphs can MOVE along keyed paths (a whale dragging down, a tiger walking over); the camera re-centres on words.
// Returns well: the same world can be re-mounted on a later beat with new moves (one ledger entry per system).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, W, EZ, MBlur, camFast, clamp01, fs as capFs, lerp, type Cam } from "../../core";
import { Glyph } from "../neon/glyphs";
import { camOf, toKeys, PLATE_BG, type CamSpec } from "./kit";

export type ScaleMove = { at: number; d: number; x: number; y: number; rot?: number; ease?: "quick" | "inOut" };
export type ScaleItem = {
  glyph: string; x: number; y: number; size: number; at: number; draw?: number; colour?: string; flip?: boolean; rot?: number;
  mode?: "line" | "neon"; lineW?: number; moves?: ScaleMove[]; outAt?: number;
  label?: { text: string; at: number; dx?: number; dy?: number; colour?: string };
};
export type ScaleRule = { x0: number; y0: number; x1: number; y1: number; at: number; frames?: number; label?: string; labelAt?: number; colour?: string; side?: number; tick?: number };
export type ScaleLine = { pts: [number, number][]; at: number; frames?: number; dashed?: boolean; colour?: string; width?: number; closed?: boolean };
export type ScaleFill = { pts: [number, number][]; at: number; frames?: number; colour?: string };
export type ScaleTag = { text: string; at: number; x: number; y: number; colour?: string; cap?: number; align?: "left" | "centre" | "right"; outAt?: number };
export type ScaleCompareProps = {
  items: ScaleItem[];
  rules?: ScaleRule[];
  lines?: ScaleLine[];
  fills?: ScaleFill[];
  tags?: ScaleTag[]; // big measured values (Bebas), world-anchored
  cam0?: Cam; cam?: CamSpec[]; drift?: number;
  labelCap?: number; // item / rule label cap (M-024 >= 28, default 34)
  bg?: string;
};

const WHITE = "#F4F6F6", RED = "#E8201E";
const GLOW = "drop-shadow(0 0 3px rgba(255,255,255,.75)) drop-shadow(0 0 14px rgba(255,255,255,.22))";
const posAt = (f: number, it: ScaleItem) => {
  let x = it.x, y = it.y, r = it.rot ?? 0;
  for (const m of it.moves ?? []) {
    const u = clamp01((f - m.at) / Math.max(1, m.d));
    const e = m.ease === "inOut" ? EZ.settle(u) : EZ.quick(u);
    x = lerp(x, m.x, e); y = lerp(y, m.y, e); r = lerp(r, m.rot ?? r, e);
  }
  return { x, y, r };
};
const pathD = (pts: [number, number][], closed?: boolean) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + (closed ? " Z" : "");

const Label: React.FC<{ text: string; k: number; x: number; y: number; cap: number; colour?: string; s: number; align?: "left" | "centre" | "right"; font?: "inter" | "bebas" }> = ({ text, k, x, y, cap, colour = WHITE, s, align = "centre", font = "inter" }) => {
  if (k < 0) return null;
  const o = EZ.out2(k / 6), dy = 14 * (1 - EZ.out3(k / 10));
  const size = capFs(font, cap) / s; // keep the on-screen cap constant under the camera scale
  return (
    <text x={x} y={y + dy / s} fill={colour} opacity={o} fontFamily={font === "bebas" ? FONT.bebas : FONT.inter} fontWeight={font === "bebas" ? 400 : 700} fontSize={size}
      letterSpacing={font === "bebas" ? 0.04 * size : 0.02 * size} textAnchor={align === "left" ? "start" : align === "right" ? "end" : "middle"}
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.85))" }}>{text}</text>
  );
};

export const ScaleCompare: React.FC<ScaleCompareProps> = (p) => {
  const f = useCurrentFrame();
  const keys = toKeys(p.cam ?? []);
  const c0 = p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1 };
  const c = camOf(f, c0, p.cam ?? [], p.drift ?? 0.01);
  const fast = camFast(f, keys, 0.04, 0.6);
  const lc = p.labelCap ?? 34;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: p.bg ?? PLATE_BG }} />
      <MBlur on={fast}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(${W / 2} ${H / 2}) scale(${c.s.toFixed(5)}) translate(${(-c.cx).toFixed(2)} ${(-c.cy).toFixed(2)})`}>
            {(p.fills ?? []).map((fl, i) => {
              const u = EZ.out2(clamp01((f - fl.at) / (fl.frames ?? 20)));
              return u > 0 ? <path key={`f${i}`} d={pathD(fl.pts, true)} fill={fl.colour ?? "rgba(80,170,210,.16)"} opacity={u} /> : null;
            })}
            <g style={{ filter: GLOW }}>
              {(p.lines ?? []).map((l, i) => {
                const u = EZ.out3(clamp01((f - l.at) / (l.frames ?? 18)));
                if (u <= 0) return null;
                return <path key={`l${i}`} d={pathD(l.pts, l.closed)} fill="none" stroke={l.colour ?? WHITE} strokeWidth={(l.width ?? 4) / c.s} strokeLinecap="round" strokeLinejoin="round"
                  pathLength={1} strokeDasharray={l.dashed ? `${0.012} ${0.012}` : `${u} 1`} opacity={l.dashed ? u : 1} />;
              })}
              {p.items.map((it, i) => {
                const k = f - it.at;
                if (k < 0 || (it.outAt !== undefined && f >= it.outAt + 8)) return null;
                const out = it.outAt !== undefined ? 1 - clamp01((f - it.outAt) / 8) : 1;
                const draw = EZ.out3(clamp01(k / (it.draw ?? 18)));
                const { x, y, r } = posAt(f, it);
                return (
                  <g key={`i${i}`} transform={`translate(${x.toFixed(2)} ${(y - it.size / 2).toFixed(2)}) rotate(${r.toFixed(2)}) scale(${it.flip ? -1 : 1} 1)`} opacity={out}>
                    <Glyph name={it.glyph} colour={it.colour ?? WHITE} size={it.size} mode={it.mode ?? "line"} lineW={(it.lineW ?? 5) * 200 / it.size / c.s} draw={draw} />
                  </g>
                );
              })}
              {(p.rules ?? []).map((ru, i) => {
                const u = EZ.quick(clamp01((f - ru.at) / (ru.frames ?? 20)));
                if (u <= 0) return null;
                const col = ru.colour ?? RED, t = (ru.tick ?? 18) / c.s;
                const dx = ru.x1 - ru.x0, dy = ru.y1 - ru.y0, len = Math.hypot(dx, dy) || 1, nx = -dy / len * t, ny = dx / len * t;
                const xe = lerp(ru.x0, ru.x1, u), ye = lerp(ru.y0, ru.y1, u);
                return (
                  <g key={`r${i}`} stroke={col} strokeWidth={4 / c.s} strokeLinecap="round" fill="none">
                    <path d={`M${ru.x0 - nx} ${ru.y0 - ny} L${ru.x0 + nx} ${ru.y0 + ny} M${ru.x0} ${ru.y0} L${xe} ${ye}`} />
                    {u >= 1 ? <path d={`M${ru.x1 - nx} ${ru.y1 - ny} L${ru.x1 + nx} ${ru.y1 + ny}`} /> : null}
                  </g>
                );
              })}
            </g>
            {p.items.map((it, i) => {
              if (!it.label) return null;
              const { x, y } = posAt(f, it);
              return <Label key={`il${i}`} text={it.label.text} k={f - it.label.at} x={x + (it.label.dx ?? 0)} y={y - it.size - 30 / c.s + (it.label.dy ?? 0)} cap={lc} colour={it.label.colour} s={c.s} />;
            })}
            {(p.rules ?? []).map((ru, i) => {
              if (!ru.label) return null;
              const side = ru.side ?? 1, dx = ru.x1 - ru.x0, dy = ru.y1 - ru.y0, len = Math.hypot(dx, dy) || 1;
              const mx = (ru.x0 + ru.x1) / 2 + (-dy / len) * 46 / c.s * side, my = (ru.y0 + ru.y1) / 2 + (dx / len) * 46 / c.s * side;
              const vertical = Math.abs(dy) > Math.abs(dx);
              return <Label key={`rl${i}`} text={ru.label} k={f - (ru.labelAt ?? ru.at + (ru.frames ?? 20))} x={mx} y={my + lc * 0.5 / c.s} cap={lc + 6} colour={ru.colour ?? RED} s={c.s}
                align={vertical ? (side > 0 ? "right" : "left") : "centre"} />;
            })}
            {(p.tags ?? []).map((tg, i) => {
              if (tg.outAt !== undefined && f >= tg.outAt) return null;
              return <Label key={`t${i}`} text={tg.text} k={f - tg.at} x={tg.x} y={tg.y} cap={tg.cap ?? 84} colour={tg.colour} s={c.s} align={tg.align} font="bebas" />;
            })}
          </g>
        </svg>
      </MBlur>
    </AbsoluteFill>
  );
};

/** demo: an orca beside a 6 ft person, length rule on the word, weight tag */
export const SCALE_DEMO: ScaleCompareProps = {
  items: [
    { glyph: "orca", x: 1020, y: 640, size: 620, at: 4, draw: 26, label: { text: "KASATKA", at: 30 } },
    { glyph: "person", x: 470, y: 640, size: 220, at: 10, draw: 14, label: { text: "6 FT", at: 22 } },
  ],
  rules: [{ x0: 710, y0: 720, x1: 1330, y1: 720, at: 50, frames: 24, label: "≈ 17 FT", labelAt: 66 }],
  lines: [{ pts: [[260, 642], [1660, 642]], at: 0, frames: 14, width: 2, colour: "rgba(255,255,255,.35)" }],
  tags: [{ text: "5,000+ LB", at: 96, x: 1420, y: 330, colour: "#E8201E", cap: 96 }],
  cam0: { cx: 960, cy: 560, s: 1.0 }, cam: [{ at: 46, d: 34, cx: 1000, cy: 600, s: 1.12, ease: "quick" }], drift: 0.01,
};
