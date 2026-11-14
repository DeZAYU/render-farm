// n2dev info-animation (Farrell: BuildOnWords, CountUp, IconGrid toll, dignified), number counters (RollUp, RecedeNumber, ClockSweep),
// timelines (YearScroll, RulerTicker, DayStrip). Dark navy plate (or a dimmed, blurred source), ice type, ice-cyan accent, amber = the active item.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp01, lerp, lerpLog } from "../../core";
import { Glyph } from "../../core/kits/glyphs";
import { EI, K, Plate, type PlateP, Svg, Typed, assertDev, cond, envIO, mono, typedN, wide } from "./kit";

type Base = PlateP & { dur: number };
const Bg: React.FC<PlateP> = (p) => <Plate {...p} dim={p.src ? (p.dim ?? 0.72) : undefined} blur={p.src ? (p.blur ?? 14) : undefined} />;
const fmt = (v: number, dec = 0) => v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
/** whole-composition slow camera (sub-pixel) */
const Drift: React.FC<{ f: number; dur: number; children: React.ReactNode; s?: [number, number] }> = ({ f, dur, children, s = [1, 1.04] }) => {
  const z = lerp(s[0], s[1], EI.smooth(f / dur));
  return <AbsoluteFill style={{ willChange: "transform", transform: `scale3d(${z.toFixed(5)}, ${z.toFixed(5)}, 1)` }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- BuildOnWords_D (Farrell)
export type BuildItem = { icon: string; t: string; at: number };
/** a row of clean line icons that draw on, each ON its spoken word, its word set under it; the newest item carries the accent. */
export const BuildOnWords_D: React.FC<Base & { items: BuildItem[]; joiner?: string }> = (p) => {
  const { dur, items, joiner = "→" } = p;
  assertDev("BuildOnWords", dur, () => (items.some((it, i) => i > 0 && it.at - items[i - 1].at < 10) ? "items < 10 f apart" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const n = items.length, gap = Math.min(380, 1500 / n), x0 = 960 - (gap * (n - 1)) / 2;
  const last = items.filter((it) => f >= it.at).length - 1;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg {...p} />
      <Drift f={f} dur={dur}>
        <Svg>
          {items.map((it, i) => {
            const k = EI.cam((f - it.at) / 16);
            if (k <= 0) return null;
            const c = i === last ? K.cyan : K.ice;
            return (
              <g key={i} transform={`translate(${x0 + i * gap} ${470 + (1 - EI.land(k)) * 14})`} opacity={clamp01(k * 2)} style={{ filter: i === last ? K.cyanGlow : undefined }}>
                <Glyph name={it.icon} colour={c} size={150} mode="line" lineW={7} draw={k} />
              </g>
            );
          })}
          {items.slice(1).map((it, i) => {
            const k = EI.cam((f - it.at + 4) / 10);
            return k > 0 ? <text key={i} x={x0 + (i + 0.5) * gap} y={482} textAnchor="middle" fill={K.frost} opacity={k} style={{ ...mono(40, 400, 0), whiteSpace: "normal" }}>{joiner}</text> : null;
          })}
        </Svg>
        {items.map((it, i) => (
          <div key={i} style={{ position: "absolute", left: x0 + i * gap, top: 600, transform: "translateX(-50%)", ...wide(26, 560, 100, 0.26), color: i === last ? K.ice : K.frost, opacity: EI.cam((f - it.at - 4) / 10) }}>
            <Typed text={it.t} n={typedN(f, it.t.length, it.at + 4, 30)} />
          </div>
        ))}
      </Drift>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CountUp_D (Farrell)
/** a number counts up on the word (eased, long settle), tabular mono digits, label typed under it; no flash, no shake (dignified). */
export const CountUp_D: React.FC<Base & { to: number; from?: number; at?: number; len?: number; prefix?: string; suffix?: string; label?: string; dec?: number }> = (p) => {
  const { dur, to, from = 0, at = 6, len = 40, prefix = "", suffix = "", label, dec = 0 } = p;
  assertDev("CountUp", dur, () => (len < 18 ? "count < 18 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const v = lerp(from, to, EI.quick((f - at) / len));
  const done = clamp01((f - at - len) / 10);
  const n = label ? typedN(f, label.length, at + len * 0.5, 26) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg {...p} />
      <Drift f={f} dur={dur}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center" }}>
          <div style={{ ...mono(170, 500, 0.02), fontVariantNumeric: "tabular-nums", color: K.ice, textShadow: `0 0 ${lerp(0, 24, done)}px rgba(166,246,255,.35)` }}>{prefix}{fmt(v, dec)}{suffix}</div>
          {label && <div style={{ ...wide(30, 520, 100, 0.34), color: K.frost, marginTop: 18 }}><Typed text={label} n={n} /></div>}
          <div style={{ margin: "26px auto 0", width: 420 * EI.cam((f - at) / len), height: 2, background: K.cyan, opacity: 0.8 }} />
        </div>
      </Drift>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- IconGrid_D (Farrell toll)
/** a grid of person icons fills in order (dim ice -> lit ice), the count in mono; the `mark` share takes the accent. Dignified: no red. */
export const IconGrid_D: React.FC<Base & { total: number; mark: number; cols?: number; at?: number; len?: number; label?: string; icon?: string }> = (p) => {
  const { dur, total, mark, cols = 20, at = 8, len = 54, label, icon = "person" } = p;
  assertDev("IconGrid", dur, () => (total > 400 ? "> 400 icons: use CountUp" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const rows = Math.ceil(total / cols), cell = Math.min(1500 / cols, 600 / rows), x0 = 960 - (cols * cell) / 2 + cell / 2, y0 = 470 - (rows * cell) / 2 + cell / 2;
  const lit = Math.round(mark * EI.quick((f - at) / len));
  const n = label ? typedN(f, label.length, at + len, 26) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg {...p} />
      <Drift f={f} dur={dur}>
        <Svg>
          {Array.from({ length: total }, (_, i) => {
            const appear = EI.cam((f - (i / total) * 18) / 8);
            const on = i < lit;
            return (
              <g key={i} transform={`translate(${x0 + (i % cols) * cell} ${y0 + Math.floor(i / cols) * cell})`} opacity={appear * (on ? 1 : 0.22)}>
                <Glyph name={icon} colour={on ? K.cyan : K.ice} size={cell * 0.82} />
              </g>
            );
          })}
        </Svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: y0 + rows * cell + 10, textAlign: "center" }}>
          <span style={{ ...mono(64, 500, 0.02), color: K.ice }}>{fmt(lit)}</span>
          {label && <span style={{ ...wide(26, 520, 100, 0.3), color: K.frost, marginLeft: 26 }}><Typed text={label} n={n} /></span>}
        </div>
      </Drift>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- RollUp_D (odometer)
/** odometer digits roll vertically to the value (each digit slower than the one to its right, eased settle, motion blur while rolling). */
export const RollUp_D: React.FC<Base & { value: number; at?: number; len?: number; suffix?: string; label?: string }> = (p) => {
  const { dur, value, at = 6, len = 46, suffix = "", label } = p;
  assertDev("RollUp", dur, () => (len < 24 ? "roll < 24 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const digits = String(Math.round(value)).split("");
  const H = 190;
  const n = label ? typedN(f, label.length, at + len, 26) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg {...p} />
      <Drift f={f} dur={dur}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 540 - H / 2 - 40, display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
          {digits.map((d, i) => {
            const spins = digits.length - i; // left digits spin less
            const u = EI.quick((f - at - i * 3) / (len - i * 3));
            const pos = (+d + 10 * spins) * u; // in digit units
            const prev = (+d + 10 * spins) * EI.quick((f - 1 - at - i * 3) / (len - i * 3));
            const blur = Math.min(8, Math.abs(pos - prev) * 6);
            return (
              <div key={i} style={{ width: 118, height: H, overflow: "hidden", position: "relative", borderTop: "1.5px solid rgba(166,246,255,.25)", borderBottom: "1.5px solid rgba(166,246,255,.25)", margin: "0 3px" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: -((pos % 10) * H), filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
                  {Array.from({ length: 11 }, (_, k) => <div key={k} style={{ height: H, ...mono(170, 500, 0), lineHeight: `${H}px`, textAlign: "center", color: K.ice }}>{k % 10}</div>)}
                </div>
              </div>
            );
          })}
          {suffix && <div style={{ ...mono(80, 400, 0), color: K.frost, marginLeft: 16, marginBottom: 20 }}>{suffix}</div>}
        </div>
        {label && <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...wide(28, 520, 100, 0.34), color: K.frost }}><Typed text={label} n={n} /></div>}
      </Drift>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- RecedeNumber_D
/** the number arrives from in front of the camera (huge, soft), recedes into the dark to rest (extruded depth layers, fog), label types. */
export const RecedeNumber_D: React.FC<Base & { text: string; label?: string; at?: number }> = (p) => {
  const { dur, text, label, at = 0 } = p;
  assertDev("RecedeNumber", dur);
  const f = useCurrentFrame();
  const k = EI.quick((f - at) / 40), out = 1 - EI.cam((f - dur + 12) / 12);
  const s = lerpLog(5, 1, k) * lerp(1, 0.96, clamp01((f - at - 40) / (dur - 40)));
  const blur = (1 - EI.land(k)) * 18;
  const n = label ? typedN(f, label.length, at + 36, 24) : 0;
  const layers = 10;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bg {...p} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1)`, filter: `blur(${blur.toFixed(2)}px)`, opacity: clamp01(k * 3) }}>
          {Array.from({ length: layers }, (_, i) => (
            <div key={i} style={{ position: i === 0 ? "relative" : "absolute", left: 0, top: 0, ...cond(300, 800), color: i === 0 ? K.ice : `rgba(${20 + i * 4},${50 + i * 6},${70 + i * 6},1)`, transform: `translate3d(${(i * 1.6).toFixed(1)}px, ${(i * 2.2).toFixed(1)}px, 0)`, zIndex: layers - i }}>{text}</div>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(2,8,20,0) 40%, rgba(2,8,20,.75) 100%)" }} />
      {label && <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", ...wide(30, 520, 100, 0.36), color: K.frost }}><Typed text={label} n={n} /></div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ClockSweep_D
/** a thin clock face (60 ticks), the hand sweeps from t0 to t1 minutes, the swept sector fills in ice-cyan, the elapsed time types. */
export const ClockSweep_D: React.FC<Base & { m0: number; m1: number; at?: number; len?: number; label?: string; clock0?: string }> = (p) => {
  const { dur, m0, m1, at = 10, len = 50, label, clock0 } = p;
  assertDev("ClockSweep", dur, () => (len < 30 ? "sweep < 30 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const m = lerp(m0, m1, EI.cam((f - at) / len));
  const R = 250, cx = 960, cy = 470;
  const ang = (mm: number) => ((mm / 60) * 360 - 90) * (Math.PI / 180);
  const pt = (mm: number, r: number) => ({ x: cx + Math.cos(ang(mm)) * r, y: cy + Math.sin(ang(mm)) * r });
  const a0 = pt(m0, R - 14), a1 = pt(m, R - 14), large = m - m0 > 30 ? 1 : 0;
  const n = label ? typedN(f, label.length, at + len, 24) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg {...p} />
      <Drift f={f} dur={dur}>
        <Svg>
          <circle cx={cx} cy={cy} r={R} fill="rgba(2,8,20,.5)" stroke="rgba(244,247,247,.55)" strokeWidth={2} />
          {Array.from({ length: 60 }, (_, i) => { const a = pt(i, R - (i % 5 ? 10 : 22)), b = pt(i, R - 2); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={K.ice} strokeWidth={i % 5 ? 1.2 : 3} opacity={i % 5 ? 0.45 : 0.85} />; })}
          {m > m0 + 0.05 && <path d={`M${cx} ${cy} L${a0.x} ${a0.y} A${R - 14} ${R - 14} 0 ${large} 1 ${a1.x} ${a1.y} Z`} fill="rgba(166,246,255,.22)" stroke={K.cyan} strokeWidth={1.5} />}
          <line x1={cx} y1={cy} x2={pt(m, R - 30).x} y2={pt(m, R - 30).y} stroke={K.ice} strokeWidth={4} strokeLinecap="round" style={{ filter: K.cyanGlow }} />
          <line x1={cx} y1={cy} x2={pt(m0, R - 30).x} y2={pt(m0, R - 30).y} stroke={K.frost} strokeWidth={2} opacity={0.6} strokeDasharray="6 6" />
          <rect x={cx - 6} y={cy - 6} width={12} height={12} fill={K.ice} />
        </Svg>
        {clock0 && <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", ...mono(24, 500, 0.3), color: K.frost }}>{clock0}</div>}
        {label && <div style={{ position: "absolute", left: 0, right: 0, top: 765, textAlign: "center", ...wide(36, 560, 100, 0.34), color: K.ice }}><Typed text={label} n={n} /></div>}
      </Drift>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- YearScroll_D
/** years glide past a fixed centre reading line and settle on the target year (amber); earlier marked years leave a cyan tick. */
export const YearScroll_D: React.FC<Base & { y0: number; y1: number; at?: number; len?: number; marks?: { year: number; t: string }[] }> = (p) => {
  const { dur, y0, y1, at = 4, len = 56, marks = [] } = p;
  assertDev("YearScroll", dur, () => (len < 30 ? "scroll < 30 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const y = lerp(y0, y1, EI.quick((f - at) / len));
  const step = 260;
  const lo = Math.floor(Math.min(y0, y1)) - 5, hi = Math.ceil(Math.max(y0, y1)) + 5;
  const settled = clamp01((f - at - len + 8) / 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg {...p} />
      <Svg>
        <line x1={0} y1={600} x2={1920} y2={600} stroke="rgba(244,247,247,.35)" strokeWidth={1.5} />
        {Array.from({ length: (hi - lo) * 4 + 1 }, (_, i) => { const yy = lo + i / 4, x = 960 + (yy - y) * step; return x < -20 || x > 1940 ? null : <line key={i} x1={x} y1={600} x2={x} y2={600 + (i % 4 ? 12 : 26)} stroke={K.ice} strokeWidth={i % 4 ? 1 : 2} opacity={0.6} />; })}
        <line x1={960} y1={430} x2={960} y2={640} stroke={K.cyan} strokeWidth={2} opacity={0.85} />
      </Svg>
      {Array.from({ length: hi - lo + 1 }, (_, i) => {
        const yy = lo + i, x = 960 + (yy - y) * step, d = Math.abs(yy - y);
        if (x < -200 || x > 2120) return null;
        const tgt = yy === Math.round(y1) && settled > 0;
        const mk = marks.find((m) => m.year === yy);
        return (
          <div key={yy} style={{ position: "absolute", left: x, top: 470, transform: `translateX(-50%) scale(${lerp(1, 0.62, clamp01(d / 2.2)).toFixed(4)})`, transformOrigin: "50% 100%", textAlign: "center" }}>
            <div style={{ ...wide(110, 700, 90, 0.02), color: tgt ? K.amber : K.ice, opacity: lerp(1, 0.28, clamp01(d / 2.5)) }}>{yy}</div>
            {mk && <div style={{ ...mono(20, 500, 0.2), color: K.cyan, marginTop: 70, opacity: clamp01(1 - d / 2) }}>{mk.t}</div>}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- RulerTicker_D
export type TickEvent = { min: number; t: string };
/** a time ruler (hh:mm) slides under a fixed needle from m0 to m1 minutes after midnight; events type their label as they pass the needle. */
export const RulerTicker_D: React.FC<Base & { m0: number; m1: number; events: TickEvent[]; at?: number; len?: number; pxPerMin?: number }> = (p) => {
  const { dur, m0, m1, events, at = 6, len, pxPerMin = 26 } = p;
  const L = len ?? dur - 30;
  assertDev("RulerTicker", dur, () => (L < 45 ? "slide < 45 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const m = lerp(m0, m1, EI.cam((f - at) / L));
  const hhmm = (v: number) => `${String(Math.floor(v / 60) % 24).padStart(2, "0")}:${String(Math.floor(v % 60)).padStart(2, "0")}`;
  const ticks: React.ReactNode[] = [];
  for (let t = Math.floor(m - 960 / pxPerMin); t <= m + 960 / pxPerMin; t++) {
    const x = 960 + (t - m) * pxPerMin, big = t % 10 === 0;
    ticks.push(<line key={t} x1={x} y1={640} x2={x} y2={640 - (big ? 34 : t % 5 === 0 ? 20 : 10)} stroke={K.ice} strokeWidth={big ? 2 : 1} opacity={big ? 0.8 : 0.4} />);
    if (big) ticks.push(<text key={`l${t}`} x={x} y={680} textAnchor="middle" fill={K.frost} style={mono(18, 400, 0.1)}>{hhmm(t)}</text>);
  }
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg {...p} />
      <Svg>
        <line x1={0} y1={640} x2={1920} y2={640} stroke="rgba(244,247,247,.45)" strokeWidth={1.5} />
        {ticks}
        {events.map((e, i) => { const x = 960 + (e.min - m) * pxPerMin, past = m >= e.min; return <rect key={i} x={x - 6} y={634} width={12} height={12} fill={past ? K.amber : K.cyan} transform={`rotate(45 ${x} 640)`} />; })}
        <line x1={960} y1={330} x2={960} y2={650} stroke={K.cyan} strokeWidth={2} />
      </Svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", ...mono(72, 500, 0.06), color: K.ice }}>{hhmm(m)}</div>
      {events.map((e, i) => {
        if (m < e.min - 0.5) return null;
        const passF = at + L * 0; // label types from the moment the marker reaches the needle
        const age = (m - e.min) * pxPerMin;
        const n = Math.min(e.t.length, Math.floor(age / 6));
        const x = 960 + (e.min - m) * pxPerMin;
        return <div key={i} style={{ position: "absolute", left: x + 14, top: 560 - (i % 2) * 44, ...mono(22, 500, 0.16), color: K.ice, opacity: clamp01(1 - (age - 500) / 300) + passF * 0 }}><Typed text={e.t} n={n} /></div>;
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- DayStrip_D
export type DayCell = { d: string; sub?: string; mark?: string };
/** a strip of day cells; the camera glides from `from` to `to` cell, marked days lift a cyan flag; an arc draws between the two (\"two days earlier\"). */
export const DayStrip_D: React.FC<Base & { days: DayCell[]; from: number; to: number; at?: number; len?: number; label?: string }> = (p) => {
  const { dur, days, from, to, at = 12, len = 46, label } = p;
  assertDev("DayStrip", dur, () => (len < 30 ? "glide < 30 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const W = 230, u = EI.cam((f - at) / len);
  const camX = lerp(from, to, u) * W;
  const x = (i: number) => 960 + i * W - camX;
  const arc = EI.cam((f - at) / len);
  const n = label ? typedN(f, label.length, at + len, 24) : 0;
  const ax = x(from), bx = x(to), top = 380;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Bg {...p} />
      {days.map((c, i) => {
        const active = i === to && u > 0.85;
        return (
          <div key={i} style={{ position: "absolute", left: x(i) - W / 2 + 8, top: 440, width: W - 16, height: 200, border: `1.5px solid ${active ? K.amber : "rgba(244,247,247,.35)"}`, background: active ? "rgba(255,178,63,.08)" : "rgba(2,8,20,.45)", textAlign: "center", paddingTop: 34, boxSizing: "border-box" }}>
            <div style={{ ...wide(40, 640, 90, 0.08), color: active ? K.amber : K.ice }}>{c.d}</div>
            {c.sub && <div style={{ ...mono(18, 400, 0.2), color: K.frost, marginTop: 10 }}>{c.sub}</div>}
            {c.mark && <div style={{ ...mono(16, 500, 0.12), color: K.cyan, marginTop: 18 }}>{c.mark}</div>}
          </div>
        );
      })}
      <Svg>
        <path d={`M${ax} 430 Q${(ax + bx) / 2} ${top - 70} ${bx} 430`} fill="none" stroke={K.cyan} strokeWidth={2} pathLength={1} strokeDasharray={`${arc} 1`} style={{ filter: K.cyanGlow }} />
      </Svg>
      {label && <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", ...wide(32, 560, 100, 0.34), color: K.ice }}><Typed text={label} n={n} /></div>}
    </AbsoluteFill>
  );
};
