// EDITOR A (Amusement Park, 2026-10-19) shared engine for two siblings: neon/StateScene_A (VV 2026 neon pictograms that CHANGE STATE on the
// words) and diagram/LineSection_A (Farrell line-art explainer built on the words). Not a variant itself.
// Scene = stroked SVG items in world px (1920 x 1080 plane) + words; every item has its own appear / draw-on / red / move / exit times
// (LOCAL frames). Camera = never still (VV26: push + drift + roll) and re-centres between stations on EZ.quick (fast start, long settle).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, RoundText, W, clamp01, fs, lerp } from "../../core";

export type LKey = { f: number; x: number; y: number; rot?: number; s?: number };
export type LItem = {
  d: string; // SVG path in world px (or local px when x/y given)
  x?: number; y?: number; s?: number; rot?: number; // placement of a local-space path
  at: number; out?: number; // appear / exit (local frames)
  draw?: number; // draw-on frames (0 = fade in 6 f)
  red?: number; redOut?: number; // turns red at (and back at)
  dash?: boolean; sw?: number; fill?: boolean; o?: number; // dashed red divider style / stroke width / filled / base opacity
  move?: LKey[]; // keyed offsets (world px / deg / scale), eased between keys on EZ.quick
  pulse?: number; // red pulse 2x from this frame (failing part)
};
export type LWord = { text: string; at: number; out?: number; x: number; y: number; red?: boolean; cap?: number; align?: "left" | "center"; typed?: boolean; leader?: { x: number; y: number } };
export type LStation = { f: number; d?: number; cx: number; cy: number; s: number };
export type LCam = { s0?: number; settle?: number; push?: number; dx?: number; dy?: number; roll?: number; stations?: LStation[] };

const RED = "#E30A10", LRED = "#F22522", INK = "#F2F2F2";
const easeKeys = (keys: LKey[], f: number) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) if (f <= keys[i + 1].f) {
    const a = keys[i], b = keys[i + 1]; const u = EZ.quick((f - a.f) / Math.max(1, b.f - a.f));
    return { f, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), rot: lerp(a.rot ?? 0, b.rot ?? 0, u), s: lerp(a.s ?? 1, b.s ?? 1, u) };
  }
  return keys[keys.length - 1];
};
export const camOfL = (f: number, c: LCam) => {
  const st = c.stations ?? [];
  let cx = W / 2, cy = H / 2, s = 1;
  if (st.length) {
    cx = st[0].cx; cy = st[0].cy; s = st[0].s;
    for (let i = 1; i < st.length; i++) {
      const k = st[i]; const u = EZ.quick((f - k.f) / (k.d ?? 24));
      cx = lerp(cx, k.cx, u); cy = lerp(cy, k.cy, u); s = lerp(s, k.s, u);
    }
  }
  const t = f / 30;
  const over = lerp(c.s0 ?? 1.1, 1, EZ.quick(f / (c.settle ?? 30))); // oversize -> settle
  const ramp = clamp01(f / 20); // no linear start: drift fades in over 20 f
  const z = over * Math.exp((c.push ?? 0.03) * t);
  return { cx: cx - (c.dx ?? -24) * t * ramp, cy: cy - (c.dy ?? 0) * t * ramp, s: s * z, rot: (c.roll ?? -0.35) * t * ramp };
};

export const LineScene: React.FC<{
  items: LItem[]; words?: LWord[]; cam?: LCam; look: "neon" | "line"; plate?: React.ReactNode; plateDim?: number; dissolve?: number; outAt?: number; labelCap?: number; skel?: string;
}> = ({ items, words = [], cam: cam0 = {}, look, plate, plateDim = 0.26, dissolve = 12, outAt, labelCap = 36, skel }) => {
  const f = useCurrentFrame();
  // SKELETONS (AP pacing pass 2026-10-20): the same explainer engine must not read as one template; each skeleton changes plate, frame, camera and build.
  const sk0 = (skel ?? "").replace(/^n(?=split|tilt|iris|grid)/, "");
  const sk = !plate && (sk0 === "split" || sk0 === "trace") ? "wide" : sk0; // no footage to split against -> wide pull-in skeleton
  const cam: LCam = sk === "wide" ? { ...cam0, s0: 0.8, settle: 42, push: 0.018, roll: 0 } : sk === "tilt" ? { ...cam0, roll: 0, dx: -(cam0.dx ?? -24) } : sk === "split" ? { ...cam0, roll: 0, dx: 0, dy: -10 } : sk === "grid" ? { ...cam0, roll: 0.25 } : cam0;
  const c = camOfL(f, cam);
  const ex = outAt === undefined ? 0 : EZ.in2((f - outAt) / 10);
  const neon = look === "neon";
  const din = neon ? clamp01(f / dissolve) : 1;
  const tf = `translate(${W / 2} ${H / 2}) rotate(${c.rot.toFixed(3)}) scale(${c.s.toFixed(5)}) translate(${(-c.cx).toFixed(2)} ${(-c.cy).toFixed(2)})`;
  const glow = (red: boolean) => (neon
    ? (red ? "drop-shadow(0 0 3px rgba(255,40,40,.95)) drop-shadow(0 0 12px rgba(227,10,16,.8)) drop-shadow(0 0 30px rgba(227,10,16,.45))" : "drop-shadow(0 0 3px rgba(255,255,255,.9)) drop-shadow(0 0 12px rgba(255,255,255,.5)) drop-shadow(0 0 28px rgba(255,255,255,.22))")
    : (red ? "drop-shadow(0 0 8px rgba(227,10,16,.8))" : "drop-shadow(0 0 6px rgba(255,255,255,.35))"));
  const scr = (x: number, y: number) => {
    const dx = (x - c.cx) * c.s, dy = (y - c.cy) * c.s; const r = (c.rot * Math.PI) / 180;
    return { x: W / 2 + dx * Math.cos(r) - dy * Math.sin(r), y: H / 2 + dx * Math.sin(r) + dy * Math.cos(r) };
  };
  const k12 = EZ.out3(f / 18), k40 = EZ.out3(f / 40);
  const wrap: React.CSSProperties =
    sk === "split" ? { transform: `translateX(${(W * 0.2 + 60 * (1 - k12)).toFixed(1)}px) scale(.6)`, transformOrigin: "50% 50%" }
    : sk === "tilt" ? { transform: `perspective(1800px) rotateX(${lerp(26, 9, k40).toFixed(2)}deg) translateY(${lerp(60, 0, k40).toFixed(1)}px)`, transformOrigin: "50% 62%" }
    : sk === "iris" ? { clipPath: `circle(${(1300 * EZ.out3(f / 20)).toFixed(0)}px at 50% 52%)` }
    : {};
  const panelBg = neon ? "radial-gradient(ellipse 62% 58% at 50% 54%, rgba(20,7,8,.3) 0%, rgba(6,2,3,.25) 68%, rgba(0,0,0,.55) 100%)" : "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(12,8,8,0) 42%, rgba(12,8,8,.62) 100%)";
  const gridBg = `repeating-linear-gradient(0deg, rgba(255,255,255,.045) 0 2px, transparent 2px 64px), repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 2px, transparent 2px 64px), rgba(6,3,3,.5)`;
  const plateFilter = sk === "trace" ? "brightness(.5) saturate(.75)" : sk === "split" ? "brightness(.8) saturate(.9)" : neon ? `brightness(${lerp(1, 0.5, din).toFixed(3)}) saturate(${lerp(1, 0.6, din).toFixed(3)}) blur(${(5 * din).toFixed(2)}px)` : `brightness(${plateDim}) saturate(.6) blur(3px)`;
  const plateO = 1; // owner 2026-10-20: line-art never on flat black -> the case footage stays under every skeleton, dimmed + blurred
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {plate && sk === "split" ? <AbsoluteFill style={{ filter: `brightness(${plateDim}) saturate(.6) blur(4px)` }}>{plate}</AbsoluteFill> : null}
      {plate ? <AbsoluteFill style={{ opacity: plateO, filter: plateFilter, clipPath: sk === "split" ? `inset(0 ${(100 - 40 * k12).toFixed(2)}% 0 0)` : undefined }}>{plate}</AbsoluteFill> : null}
      {sk === "split" ? <div style={{ position: "absolute", left: 0.4 * W - 2, top: 0, width: 4, height: H * k12, background: RED, boxShadow: "0 0 12px rgba(227,10,16,.7)", opacity: 1 - ex }} /> : null}
      <AbsoluteFill style={{ opacity: din * (1 - ex), clipPath: sk === "split" ? "inset(0 0 0 40%)" : undefined, background: sk === "grid" ? gridBg : sk === "trace" ? "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" : sk === "split" ? "rgba(7,3,3,.35)" : panelBg }}>
      <AbsoluteFill style={wrap}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={tf}>
            {items.map((it, i) => {
              const k = f - it.at; if (k < 0) return null;
              const eo = it.out === undefined ? 0 : clamp01((f - it.out) / 8);
              if (eo >= 1) return null;
              const isRed = (it.red !== undefined && f >= it.red && (it.redOut === undefined || f < it.redOut)) || it.dash;
              const pl = it.pulse !== undefined && f >= it.pulse && f < it.pulse + 24 ? 0.55 + 0.45 * Math.cos(((f - it.pulse) / 12) * Math.PI * 2) : 1;
              const dr = it.draw ? EZ.out3(k / it.draw) : 1;
              const o = (it.draw ? clamp01(k / 3) : EZ.out2(k / 6)) * (1 - eo) * (it.o ?? 1) * pl;
              const m = it.move ? easeKeys(it.move, f) : { x: 0, y: 0, rot: 0, s: 1 };
              const col = isRed ? RED : INK;
              const sw = (it.sw ?? (neon ? 6 : 4)) / Math.max(0.2, (it.s ?? 1) * (m.s ?? 1));
              const g = `translate(${((it.x ?? 0) + m.x).toFixed(2)} ${((it.y ?? 0) + m.y).toFixed(2)}) rotate(${((it.rot ?? 0) + (m.rot ?? 0)).toFixed(3)}) scale(${((it.s ?? 1) * (m.s ?? 1)).toFixed(4)})`;
              return (
                <g key={i} transform={g} opacity={o} style={{ filter: glow(!!isRed) }}>
                  <path d={it.d} fill={it.fill ? col : "none"} stroke={it.fill ? "none" : col} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
                    pathLength={it.draw ? 1 : undefined} strokeDasharray={it.dash ? `${(18 / (it.s ?? 1)).toFixed(1)} ${(14 / (it.s ?? 1)).toFixed(1)}` : it.draw ? `${dr.toFixed(4)} 1.001` : undefined} />
                </g>
              );
            })}
            {words.filter((w) => w.leader && f >= w.at).map((w, i) => {
              const u = EZ.out3((f - w.at) / 8); const eo = w.out === undefined ? 0 : clamp01((f - w.out) / 8);
              return <line key={`l${i}`} x1={w.x} y1={w.y} x2={lerp(w.x, w.leader!.x, u)} y2={lerp(w.y, w.leader!.y, u)} stroke={w.red ? RED : INK} strokeWidth={3 / c.s} opacity={1 - eo} style={{ filter: glow(!!w.red) }} />;
            })}
          </g>
        </svg>
        {words.map((w, i) => {
          const k = f - w.at; if (k < 0) return null;
          const eo = w.out === undefined ? 0 : clamp01((f - w.out) / 10);
          if (eo >= 1) return null;
          const p0 = scr(w.x, w.y);
          const p = { x: Math.min(W * 0.92, Math.max(W * 0.08, p0.x)), y: Math.min(H * 0.9, Math.max(H * 0.12, p0.y)) }; // M-084: never pushed past the frame edge
          if (w.align !== "left") { const half = (w.text.length * (w.cap ?? labelCap) * 0.36); p.x = Math.min(W - 60 - half, Math.max(60 + half, p.x)); }
          else p.x = Math.min(W - 60 - w.text.length * (w.cap ?? labelCap) * 0.72, p.x);
          const cap = (w.cap ?? labelCap) * Math.min(1.25, Math.max(0.85, c.s));
          const nextAt = Math.min(...words.filter((v) => v.at > w.at).map((v) => v.at), outAt ?? 1e9, w.out ?? 1e9);
          const typeDur = Math.max(6, Math.min(w.text.length * 2, nextAt - 45 - w.at)); // owner 2026-10-20: fully typed + held >= 1.5 s before the next element
          const shown = w.typed ? w.text.slice(0, Math.min(w.text.length, Math.floor((k / typeDur) * w.text.length) + 1)) : w.text;
          const rise = w.typed ? 0 : 16 * (1 - EZ.out3(k / 20));
          const o = (w.typed ? 1 : EZ.out2(k / 12)) * (1 - eo);
          const sh = w.red ? "drop-shadow(0 0 6px rgba(242,37,34,.7)) drop-shadow(0 0 16px rgba(242,37,34,.4)) drop-shadow(0 3px 6px rgba(0,0,0,.6))" : "drop-shadow(0 3px 8px rgba(0,0,0,.8))";
          return (
            <div key={`w${i}`} style={{ position: "absolute", left: p.x, top: p.y + rise, opacity: o, transform: `translate(${w.align === "left" ? "0" : "-50%"}, -62%) rotate(${c.rot.toFixed(3)}deg)`, filter: `${sh}${w.red && !w.typed && k < 10 ? ` blur(${(6 * (1 - k / 10)).toFixed(2)}px)` : ""}`, whiteSpace: "nowrap" }}>
              <RoundText text={shown} cap={cap} colour={w.red ? LRED : "#FDFDFD"} />
            </div>
          );
        })}
      </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- path helpers (world px). Line-art vocabulary for ride explainers.
export const P = {
  person: (x: number, y: number, h = 150) => { const k = h / 150; const hd = 18 * k; return `M${x} ${y - h + hd * 2} m${-hd} 0 a${hd} ${hd} 0 1 0 ${2 * hd} 0 a${hd} ${hd} 0 1 0 ${-2 * hd} 0 M${x} ${y - h + 2 * hd} L${x} ${y - 50 * k} M${x} ${y - h + 50 * k} L${x - 26 * k} ${y - 74 * k} M${x} ${y - h + 50 * k} L${x + 26 * k} ${y - 74 * k} M${x} ${y - 50 * k} L${x - 20 * k} ${y} M${x} ${y - 50 * k} L${x + 20 * k} ${y}`; },
  seated: (x: number, y: number, h = 90) => { const k = h / 90; const hd = 14 * k; return `M${x} ${y - h + hd} m${-hd} 0 a${hd} ${hd} 0 1 0 ${2 * hd} 0 a${hd} ${hd} 0 1 0 ${-2 * hd} 0 M${x} ${y - h + 2 * hd} L${x} ${y - 30 * k} L${x + 32 * k} ${y - 30 * k} L${x + 32 * k} ${y} M${x} ${y - h + 40 * k} L${x + 26 * k} ${y - h + 56 * k}`; },
  line: (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" "),
  circle: (x: number, y: number, r: number) => `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`,
  rect: (x: number, y: number, w: number, h: number, r = 0) => (r ? `M${x + r} ${y} h${w - 2 * r} q${r} 0 ${r} ${r} v${h - 2 * r} q0 ${r} ${-r} ${r} h${-(w - 2 * r)} q${-r} 0 ${-r} ${-r} v${-(h - 2 * r)} q0 ${-r} ${r} ${-r} Z` : `M${x} ${y} h${w} v${h} h${-w} Z`),
  wheel: (x: number, y: number, r: number, spokes = 16) => { let d = `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 `; for (let i = 0; i < spokes / 2; i++) { const a = (i / spokes) * Math.PI * 2; d += `M${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)} L${(x - r * Math.cos(a)).toFixed(1)} ${(y - r * Math.sin(a)).toFixed(1)} `; } return d; },
  capsule: (x: number, y: number, w = 90, h = 60) => `M${x - w / 2 + h / 2} ${y - h / 2} h${w - h} a${h / 2} ${h / 2} 0 0 1 0 ${h} h${-(w - h)} a${h / 2} ${h / 2} 0 0 1 0 ${-h} Z`,
  gondola: (x: number, y: number, w = 80, h = 70) => `M${x} ${y - h / 2 - 26} L${x} ${y - h / 2} M${x - w / 2} ${y - h / 2} h${w} l-8 ${h} h${-(w - 16)} Z M${x - w / 2 + 10} ${y - 4} h${w - 20}`,
  car: (x: number, y: number, w = 170, h = 64) => `M${x - w / 2} ${y} v${-h * 0.55} q0 ${-h * 0.45} ${h * 0.45} ${-h * 0.45} h${w - h * 0.9} q${h * 0.45} 0 ${h * 0.45} ${h * 0.45} v${h * 0.55} Z M${x - w * 0.3} ${y + 14} m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M${x + w * 0.3} ${y + 14} m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0`,
  tower: (x: number, top: number, base: number, w = 60) => `M${x - w / 2} ${base} L${x - w / 4} ${top} L${x + w / 4} ${top} L${x + w / 2} ${base} M${x - w * 0.42} ${base - (base - top) * 0.25} L${x + w * 0.42} ${base - (base - top) * 0.25} M${x - w * 0.34} ${base - (base - top) * 0.5} L${x + w * 0.34} ${base - (base - top) * 0.5} M${x - w * 0.29} ${base - (base - top) * 0.75} L${x + w * 0.29} ${base - (base - top) * 0.75}`,
  ground: (x0: number, x1: number, y: number) => `M${x0} ${y} L${x1} ${y}`,
  arrow: (x0: number, y0: number, x1: number, y1: number, head = 22) => { const a = Math.atan2(y1 - y0, x1 - x0); return `M${x0} ${y0} L${x1} ${y1} M${x1} ${y1} L${(x1 - head * Math.cos(a - 0.45)).toFixed(1)} ${(y1 - head * Math.sin(a - 0.45)).toFixed(1)} M${x1} ${y1} L${(x1 - head * Math.cos(a + 0.45)).toFixed(1)} ${(y1 - head * Math.sin(a + 0.45)).toFixed(1)}`; },
  arc: (x: number, y: number, r: number, a0: number, a1: number) => { const p = (a: number) => `${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`; return `M${p(a0)} A${r} ${r} 0 ${Math.abs(a1 - a0) > Math.PI ? 1 : 0} ${a1 > a0 ? 1 : 0} ${p(a1)}`; },
  cross: (x: number, y: number, r = 26) => `M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`,
  zig: (x0: number, y0: number, x1: number, y1: number, n = 8, amp = 12) => { let d = `M${x0} ${y0}`; for (let i = 1; i <= n; i++) { const u = i / n; const nx = -(y1 - y0), ny = x1 - x0; const L = Math.hypot(nx, ny) || 1; const s = i === n ? 0 : (i % 2 ? amp : -amp); d += ` L${(x0 + (x1 - x0) * u + (nx / L) * s).toFixed(1)} ${(y0 + (y1 - y0) * u + (ny / L) * s).toFixed(1)}`; } return d; },
  flame: (x: number, y: number, h = 120) => { const k = h / 120; return `M${x} ${y} C${x - 60 * k} ${y - 20 * k} ${x - 50 * k} ${y - 80 * k} ${x - 10 * k} ${y - 120 * k} C${x - 10 * k} ${y - 80 * k} ${x + 20 * k} ${y - 80 * k} ${x + 20 * k} ${y - 110 * k} C${x + 60 * k} ${y - 70 * k} ${x + 60 * k} ${y - 10 * k} ${x} ${y} Z`; },
};
export const lineCap = (cap: number) => fs("round", cap);
export { FONT };
