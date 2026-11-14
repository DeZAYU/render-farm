// n2dev HUD devices (Fern teardown frames D:/titlecut/refs/docs3d/teardown/fern/devices): 01-03 HUD bracket label, 12 dimension bracket,
// 13 data box on the object, 14/42 radio transcript HUD + waveform box, 18 date engraved in the scene, 20 document magnifier, 25 radar rings.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { clamp01, lerp } from "../../core";
import { Anchor, Brackets, DrawLine, EI, HudBox, K, Plate, type PlateP, Svg, type TK, Typed, assertDev, envIO, mono, plateMap, plateScale, rnd, trackAt, typedN, typew, wide } from "./kit";

type Base = PlateP & { dur: number };

// ---------------------------------------------------------------- HudBracket_D (Fern 01-03)
/** corner brackets snap round a label beside the object; a thin leader from a cross-hair on the object; the label types in. Tracks `keys`. */
export const HudBracket_D: React.FC<Base & { text: string; sub?: string; kind?: "object" | "person" | "place"; keys: TK[]; off?: [number, number]; at?: number }> = (p) => {
  const { dur, text, sub, kind = "object", keys, off = [150, -110], at = 6 } = p;
  assertDev("HudBracket", dur);
  const f = useCurrentFrame();
  const a = plateMap(f, p, trackAt(keys, f));
  const out = dur - 16;
  const box = envIO(f, dur, 8, 10, at - 4);
  const lead = EI.quick((f - at + 8) / 10) * (1 - EI.cam((f - out - 4) / 8));
  const n1 = typedN(f, text.length, at + 2, 30, dur - 2, 14);
  const subT = kind === "place" && !sub ? "" : sub ?? "";
  const n2 = typedN(f, subT.length, at + 2 + Math.ceil(text.length / 30 * 30) * 0.5, 34, dur - 2, 12);
  const right = off[0] >= 0;
  const bx = a.x + off[0], by = a.y + off[1];
  const elbow = { x: a.x + off[0] * 0.55, y: by };
  return (
    <AbsoluteFill>
      <Plate {...p} />
      {kind !== "person" && <Svg><Anchor p={a} o={lead} /></Svg>}
      <Svg>
        <DrawLine a={a} b={elbow} p={lead * 2} w={2} colour="rgba(166,246,255,.85)" />
        <DrawLine a={elbow} b={{ x: bx, y: by }} p={lead * 2 - 1} w={2} colour="rgba(166,246,255,.85)" />
      </Svg>
      <div style={{ position: "absolute", left: bx, top: by, transform: `translate(${right ? 0 : -100}%, -50%)` }}>
        <HudBox o={box}>
          <div style={{ ...mono(40, 500, 0.16), color: K.ice, minHeight: 48 }}><Typed text={text} n={n1} caret /></div>
          {subT && <div style={{ ...mono(21, 400, 0.18), color: K.frost, marginTop: 6 }}><Typed text={subT} n={n2} /></div>}
        </HudBox>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- DimBracket_D (Fern 12)
/** a measure line draws between two tracked points (end ticks perpendicular), value centred on it, offset on the normal. */
export const DimBracket_D: React.FC<Base & { a: TK[]; b: TK[]; value: string; sub?: string; off?: number; at?: number }> = (p) => {
  const { dur, value, sub, off = -40, at = 4 } = p;
  assertDev("DimBracket", dur);
  const f = useCurrentFrame();
  const A = plateMap(f, p, trackAt(p.a, f)), B = plateMap(f, p, trackAt(p.b, f));
  const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const o = (q: { x: number; y: number }) => ({ x: q.x + nx * off, y: q.y + ny * off });
  const A2 = o(A), B2 = o(B), M = { x: (A2.x + B2.x) / 2, y: (A2.y + B2.y) / 2 };
  const g = EI.quick((f - at) / 18) * (1 - EI.cam((f - dur + 12) / 12));
  const tick = EI.quick((f - at - 10) / 10) * (1 - EI.cam((f - dur + 12) / 12));
  let ang = (Math.atan2(dy, dx) * 180) / Math.PI; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
  const n = typedN(f, value.length, at + 14, 22, dur - 2, 10), n2 = sub ? typedN(f, sub.length, at + 18, 26, dur - 2, 10) : 0;
  const T = 16 * tick;
  const half = (q: { x: number; y: number }) => ({ x: lerp(M.x, q.x, g), y: lerp(M.y, q.y, g) });
  const ea = half(A2), eb = half(B2);
  const side = Math.sign(off) || -1;
  return (
    <AbsoluteFill>
      <Plate {...p} />
      <Svg style={{ filter: K.cyanGlow }}>
        {g > 0 && <line x1={ea.x} y1={ea.y} x2={eb.x} y2={eb.y} stroke={K.ice} strokeWidth={2.2} />}
        {[A2, B2].map((q, i) => <line key={i} x1={q.x - nx * T} y1={q.y - ny * T} x2={q.x + nx * T} y2={q.y + ny * T} stroke={K.ice} strokeWidth={2.2} opacity={tick} />)}
        {[A, B].map((q, i) => <line key={`l${i}`} x1={q.x} y1={q.y} x2={q.x + nx * off * tick} y2={q.y + ny * off * tick} stroke={K.cyanDim} strokeWidth={1.4} strokeDasharray="4 5" />)}
      </Svg>
      <div style={{ position: "absolute", left: M.x + nx * 34 * side, top: M.y + ny * 34 * side, transform: `translate(-50%, -50%) rotate(${ang.toFixed(3)}deg)`, textAlign: "center", textShadow: K.shadow }}>
        {sub && <div style={{ ...mono(18, 400, 0.12), color: K.frost }}><Typed text={sub} n={n2} /></div>}
        <div style={{ ...mono(34, 600, 0.08), color: K.ice }}><Typed text={value} n={n} /></div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- DataBox_D (Fern 13)
/** a data box pinned to a moving object: big value (+ sub) and/or key:value rows, leader from the object. */
export const DataBox_D: React.FC<Base & { keys: TK[]; big?: string; sub?: string; rows?: { k: string; v: string }[]; off?: [number, number]; at?: number }> = (p) => {
  const { dur, keys, big, sub, rows = [], off = [170, -150], at = 6 } = p;
  assertDev("DataBox", dur);
  const f = useCurrentFrame();
  const a = plateMap(f, p, trackAt(keys, f));
  const o = envIO(f, dur, 9, 12, at - 4);
  const lead = EI.quick((f - at + 8) / 10) * (1 - EI.cam((f - dur + 16) / 8));
  const right = off[0] >= 0, bx = a.x + off[0], by = a.y + off[1];
  let t = at + 4;
  const step = (s: string, cps = 30) => { const n = typedN(f, s.length, t, cps, dur - 2, 12); t += Math.ceil((s.length / cps) * 30) + 4; return n; };
  const nb = big ? step(big, 20) : 0, ns = sub ? step(sub) : 0;
  const nr = rows.map((r) => [step(r.k, 40), step(r.v)]);
  return (
    <AbsoluteFill>
      <Plate {...p} />
      <Svg><Anchor p={a} o={lead} /><DrawLine a={a} b={{ x: bx, y: by }} p={lead} w={1.8} colour="rgba(166,246,255,.8)" /></Svg>
      <div style={{ position: "absolute", left: bx, top: by, transform: `translate(${right ? 0 : -100}%, -50%)` }}>
        <HudBox o={o} pad="22px 34px 24px" all>
          {big && <div style={{ ...mono(64, 500, 0.04), color: K.ice, lineHeight: 1.1 }}><Typed text={big} n={nb} caret /></div>}
          {sub && <div style={{ ...mono(28, 400, 0.06), color: K.frost, marginTop: 4 }}><Typed text={sub} n={ns} /></div>}
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 22, marginTop: i === 0 && (big || sub) ? 14 : 6 }}>
              <div style={{ ...mono(20, 400, 0.2), color: K.cyan, minWidth: 120 }}><Typed text={r.k} n={nr[i][0]} /></div>
              <div style={{ ...mono(24, 500, 0.08), color: K.ice }}><Typed text={r.v} n={nr[i][1]} /></div>
            </div>
          ))}
        </HudBox>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- RadioHud_D (Fern 14 / 42)
export type RadioLine = { who: string; t: string; at: number; end: number };
/** a live waveform box (oscilloscope trace; real per-frame amplitudes via `amps`, else derived from the line windows) + typed transcript lines
 *  with a boxed speaker tag. The last 3 lines show; older ones dim and slide up. */
export const RadioHud_D: React.FC<Base & { lines: RadioLine[]; channel?: string; amps?: number[]; pos?: "left" | "centre" }> = (p) => {
  const { dur, lines, channel = "DISPATCH  ·  CH 2", amps, pos = "left" } = p;
  assertDev("RadioHud", dur, () => (lines.some((l) => l.end - l.at < 30) ? "a transcript line must stay >= 30 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const amp = (fr: number) => amps ? (amps[Math.max(0, Math.min(amps.length - 1, Math.round(fr)))] ?? 0)
    : lines.reduce((m, l) => Math.max(m, fr >= l.at && fr <= l.end ? 0.35 + 0.65 * Math.abs(Math.sin(fr * 0.9) * Math.sin(fr * 0.37 + 1)) : 0), 0.04);
  const WW = 620, WH = 110, N = 120;
  const pts = Array.from({ length: N }, (_, i) => {
    const fr = f - (N - i) * 0.25, a = amp(fr) * clamp01(o * 1.5);
    const y = WH / 2 + (rnd(i * 3.1 + Math.floor(f * 2)) - 0.5) * 2 * a * (WH * 0.42) * Math.sin((i / N) * Math.PI);
    return `${((i / (N - 1)) * WW).toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const shown = lines.filter((l) => f >= l.at - 2);
  const vis = shown.slice(-3);
  const x0 = pos === "left" ? 140 : 960 - 440;
  return (
    <AbsoluteFill>
      <Plate {...p} dim={p.src ? (p.dim ?? 0.35) : undefined} />
      <div style={{ position: "absolute", left: x0, top: 300, opacity: clamp01(o * 1.3), transform: `translate3d(0, ${lerp(14, 0, EI.quick(o)).toFixed(2)}px, 0)` }}>
        <div style={{ ...mono(18, 500, 0.3), color: K.cyan, marginBottom: 12 }}>{channel}<span style={{ opacity: Math.floor(f / 15) % 2 ? 1 : 0.25, color: K.amber }}>  ● REC</span></div>
        <div style={{ position: "relative", width: WW, height: WH, background: "rgba(2,8,20,.72)", border: "1.5px solid rgba(166,246,255,.55)" }}>
          <svg width={WW} height={WH} style={{ position: "absolute" }}>
            <line x1={0} y1={WH / 2} x2={WW} y2={WH / 2} stroke="rgba(166,246,255,.18)" strokeWidth={1} />
            <polyline points={pts} fill="none" stroke={K.cyan} strokeWidth={2} style={{ filter: K.cyanGlow }} />
          </svg>
        </div>
        <div style={{ marginTop: 26, width: 900 }}>
          {vis.map((l, i) => {
            const age = vis.length - 1 - i;
            const lo = Math.min(EI.cam((f - l.at + 2) / 8), age === 0 ? EI.cam((dur - f) / 10) : 1);
            const n = typedN(f, l.t.length, l.at, 24);
            return (
              <div key={l.at} style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 16, opacity: lo * (age === 0 ? 1 : age === 1 ? 0.55 : 0.3) }}>
                <div style={{ ...typew(22, 0.02), color: K.ice, border: "1.5px solid rgba(244,247,247,.8)", padding: "4px 10px", lineHeight: 1.15, minWidth: 120 }}>{l.who}</div>
                <div style={{ position: "relative", ...typew(30, 0.01), color: K.ice, lineHeight: 1.35, whiteSpace: "pre-wrap", paddingLeft: 16, paddingTop: 2 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, width: 10, height: 2, background: K.ice }} /><div style={{ position: "absolute", left: 0, top: 0, width: 2, height: 10, background: K.ice }} />
                  <Typed text={l.t} n={n} caret />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- EngravedDate_D (Fern 18)
/** the date set INTO the scene on a perspective plane (wall/floor/hull): engraved (dark top edge, light bottom edge), blended with the
 *  picture, each glyph racks from soft to sharp. The plane rides the plate's push. Year line in amber (locked rule). */
export const EngravedDate_D: React.FC<Base & { lines: string[]; yearLine?: number; plane?: { x: number; y: number; rx?: number; ry?: number; rz?: number; px?: number }; at?: number }> = (p) => {
  const { dur, lines, yearLine = lines.length - 1, plane = { x: 300, y: 620, rx: 0, ry: 28, rz: 0, px: 120 }, at = 4 } = p;
  assertDev("EngravedDate", dur);
  const f = useCurrentFrame();
  const c = plateMap(f, p, { x: plane.x, y: plane.y }), s = plateScale(f, p);
  const out = 1 - EI.cam((f - dur + 16) / 16);
  let ci = 0;
  return (
    <AbsoluteFill>
      <Plate {...p} />
      <div style={{ position: "absolute", left: c.x, top: c.y, perspective: 1300, transformStyle: "preserve-3d" }}>
        <div style={{ transform: `scale(${s.toFixed(5)}) rotateX(${plane.rx ?? 0}deg) rotateY(${plane.ry ?? 0}deg) rotateZ(${plane.rz ?? 0}deg)`, transformOrigin: "0 50%", mixBlendMode: "screen" }}>
          {lines.map((ln, li) => (
            <div key={li} style={{ ...wide((plane.px ?? 120) * (li === yearLine ? 1.15 : 1), 700, 92, 0.06), lineHeight: 1.0 }}>
              {[...ln].map((ch, i) => {
                const k = clamp01((f - at - (ci++) * 2.2) / 14), e = EI.cam(k) * out;
                const yr = li === yearLine;
                return <span key={i} style={{ display: "inline-block", opacity: e * (yr ? 0.92 : 0.8), color: yr ? K.amber : "rgba(214,232,240,1)", filter: `blur(${((1 - EI.land(k)) * 9).toFixed(2)}px)`,
                  textShadow: "0 -2px 1px rgba(0,0,0,.55), 0 2px 1px rgba(255,255,255,.18)", transform: `translate3d(0, ${((1 - EI.land(k)) * 10).toFixed(2)}px, 0)` }}>{ch === " " ? "\u00A0" : ch}</span>;
              })}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- LoupeGlide_D (Fern 20, re-skinned: no circle)
export type LSpan = { r: [number, number, number, number]; at: number; sweep?: number }; // image px rect of the quoted line, local frame
/** a dark, dimmed, shallow-focus page; a rounded-rect loupe (2x) glides along each quoted line in one direction, an amber hairline grows
 *  under the words inside it. Page drifts one way (no jitter). */
export const LoupeGlide_D: React.FC<{ dur: number; src: string; imgW: number; imgH: number; crop: [number, number, number, number]; spans: LSpan[]; mag?: number; credit?: string }> = ({ dur, src, crop, spans, mag = 1.9, credit }) => {
  assertDev("LoupeGlide", dur, () => (spans.some((s) => (s.sweep ?? 40) < 24) ? "sweep < 24 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 12, 14);
  const sc = 1760 / crop[2], drift = lerp(0, -40, f / dur);
  const toScr = (x: number, y: number) => ({ x: 80 + (x - crop[0]) * sc + drift, y: 540 + (y - (crop[1] + crop[3] / 2)) * sc });
  // loupe centre: along the active span's line, eased; glides between spans
  let cur = spans[0], i0 = 0;
  spans.forEach((s, i) => { if (f >= s.at - 14) { cur = s; i0 = i; } });
  const sw = cur.sweep ?? 40;
  const u = EI.cam((f - cur.at) / sw);
  const lx = lerp(cur.r[0] + 60, cur.r[0] + cur.r[2] - 60, u), ly = cur.r[1] + cur.r[3] / 2;
  const prev = spans[i0 - 1];
  const g = prev ? EI.cam((f - cur.at + 14) / 14) : 1;
  const px = prev ? lerp(prev.r[0] + prev.r[2] - 60, lx, g) : lx, py = prev ? lerp(prev.r[1] + prev.r[3] / 2, ly, g) : ly;
  const P0 = toScr(px, py);
  const P = { x: P0.x + (Math.min(1380, Math.max(540, P0.x)) - P0.x), y: P0.y };
  const LW = 640, LH = 150;
  const page = (s: number, cx: number, cy: number, extra?: React.CSSProperties) => (
    <Img src={staticFile(src)} style={{ position: "absolute", left: cx - (px - 0) * s, top: cy - py * s, width: undefined, transformOrigin: "0 0", transform: `scale(${s.toFixed(5)})`, maxWidth: "none", ...extra }} />
  );
  const lo = EI.quick((f - spans[0].at + 16) / 12) * o;
  return (
    <AbsoluteFill style={{ background: K.abyss, opacity: o }}>
      <AbsoluteFill style={{ filter: "brightness(0.38) saturate(0.4) blur(2.4px)" }}>{page(sc, P.x, P.y)}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(2,8,20,0) 30%, rgba(2,8,20,.75) 100%)" }} />
      <div style={{ position: "absolute", left: P.x - LW / 2, top: P.y - LH / 2, width: LW, height: LH, overflow: "hidden", borderRadius: 18, opacity: lo, transform: `scale(${lerp(0.92, 1, EI.quick(lo)).toFixed(4)})`,
        boxShadow: "0 18px 50px rgba(0,0,0,.6), 0 0 0 1.5px rgba(166,246,255,.7)", background: "#fff" }}>
        <div style={{ position: "absolute", inset: 0, filter: "contrast(1.08)" }}>{page(sc * mag, LW / 2, LH / 2)}</div>
        {spans.map((s, i) => {
          const hw = EI.cam((f - s.at) / (s.sweep ?? 40));
          if (f < s.at - 14) return null;
          const x0 = LW / 2 + (s.r[0] - px) * sc * mag, y0 = LH / 2 + (s.r[1] + s.r[3] - py) * sc * mag + 4;
          return <div key={i} style={{ position: "absolute", left: x0, top: y0, width: s.r[2] * sc * mag * hw, height: 3, background: K.amber, opacity: 0.95 }} />;
        })}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,0) 40%)" }} />
      </div>
      {credit && <div style={{ position: "absolute", left: 44, bottom: 30, ...mono(15, 400, 0.08), color: "rgba(220,226,230,.6)" }}>{credit}</div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- RadarRings_D (Fern 25)
/** thin ice-cyan rings expand from a tracked centre (sea/map search), a soft sweep wedge turns, a mono label types. */
export const RadarRings_D: React.FC<Base & { keys: TK[]; label?: string; sub?: string; rings?: number; period?: number; maxR?: number }> = (p) => {
  const { dur, keys, label, sub, rings = 4, period = 54, maxR = 900 } = p;
  assertDev("RadarRings", dur, () => (period < 30 ? "ring period < 30 f" : null));
  const f = useCurrentFrame();
  const c = plateMap(f, p, trackAt(keys, f));
  const o = envIO(f, dur, 14, 16);
  const ang = (f * 2.2) % 360;
  const n1 = label ? typedN(f, label.length, 20, 26, dur - 2) : 0, n2 = sub ? typedN(f, sub.length, 30, 30, dur - 2) : 0;
  return (
    <AbsoluteFill>
      <Plate {...p} />
      <AbsoluteFill style={{ opacity: o }}>
        <div style={{ position: "absolute", left: c.x - maxR, top: c.y - maxR, width: maxR * 2, height: maxR * 2, borderRadius: "50%",
          background: `conic-gradient(from ${ang}deg, rgba(166,246,255,.16) 0deg, rgba(166,246,255,0) 70deg, rgba(166,246,255,0) 360deg)`, mixBlendMode: "screen",
          maskImage: "radial-gradient(circle, #000 0%, #000 55%, transparent 72%)" }} />
        <Svg style={{ filter: K.cyanGlow }}>
          {Array.from({ length: rings }, (_, i) => {
            const t = ((f + (i * period) / rings) % period) / period + Math.floor((f + (i * period) / rings) / period) * 0;
            const r = lerp(30, maxR, EI.land(t)), a = (1 - t) * clamp01(t * 6);
            return <circle key={i} cx={c.x} cy={c.y} r={r} fill="none" stroke={K.cyan} strokeWidth={2} opacity={a * 0.9} />;
          })}
          <rect x={c.x - 5} y={c.y - 5} width={10} height={10} fill={K.cyan} transform={`rotate(45 ${c.x} ${c.y})`} />
        </Svg>
        {label && (
          <div style={{ position: "absolute", left: c.x + 40, top: c.y + 30, textShadow: K.shadow }}>
            <div style={{ ...mono(30, 500, 0.18), color: K.ice }}><Typed text={label} n={n1} caret /></div>
            {sub && <div style={{ ...mono(19, 400, 0.18), color: K.frost, marginTop: 4 }}><Typed text={sub} n={n2} /></div>}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export { Brackets };
