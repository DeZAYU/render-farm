// map / PlanReplay (set dash2, Dashcam "INSTRUMENT" H3): a top-down collision reconstruction on a real satellite still.
// REF VisualVenture §11 world infographic @3:28.0-3:36 (one world plane; the camera tells the story in three eased phases: A log-zoom
// bezier(0.31,0,0,0.957) with position bezier(0.281,-0.431,0,1.354), B bezier(0.185,0,0.021,0.619), C position bezier(0.242,-0.22,0,1.144);
// labels clip-wipe 6-8 f on their words) + Dashcam Vol.1 E10 satellite map @0:04.8 + Farrell FA F7 route draw GM @2:57.1 (line behind a
// leading head) + Dashcam Vol.3 E9 PiP geometry (0.459 W top-right, x 990-1871 y 20-523).
// Ours: a dark-graded satellite of the junction (`src`, coords in its own px); simple top-down car / truck / train outlines move on keys copied
// from the dashcam's OWN timecode (clip frames), the footage plays in the PiP in sync, the camera runs VV phases A/B/C on the sentences, labels
// wipe in 7 f on their words, and an accent impact marker lands on the collision frame. Silent (the PiP footage carries the sound).
import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { WATERPARK, EZ, H, Media, PlateVig, W, asset, clamp01, drift, lerp, lerpLog, linPush, measure, type Theme } from "../../core";
import { themeFont, themeFs } from "../lookhere/dash2kit";

type P2 = { x: number; y: number };
export type VKey = { f: number; x: number; y: number; rot?: number }; // f = CLIP frame (source timecode of the footage, 30 fps), x/y = still px
export type Vehicle = { kind: "car" | "truck" | "train"; keys: VKey[]; role?: "accent" | "neutral" | "dim"; len?: number; wid?: number; cars?: number; path?: boolean };
export type PlanLabel = { text: string; at: number; x?: number; y?: number; vehicle?: number; dx?: number; dy?: number; accent?: boolean; outAt?: number; cap?: number };
export type PlanCam = { cx: number; cy: number; s: number; rot?: number };
export type PlanPhase = { at: number; phase: "A" | "B" | "C"; to: PlanCam; d?: number };
export type PipSide = "auto" | "tr" | "tl" | "br" | "bl";
export type PlanReplayProps = {
  src: string; srcW?: number; srcH?: number; // satellite / aerial still and its pixel size
  grade?: string; // CSS filter for the dark grade
  media?: string; mediaStart?: number; clipAt?: number; // PiP footage: source frame `mediaStart` plays at local `clipAt`
  pipW?: number; // PiP width fraction (D3 0.459)
  pipSide?: PipSide; // PiP corner; "auto" (default) = the corner that keeps the impact / vehicles / labels clear (farthest from the impact)
  vehicles: Vehicle[];
  labels?: PlanLabel[];
  impact?: { f: number; x: number; y: number }; // CLIP frame + still px
  cam0: PlanCam; phases?: PlanPhase[];
  driftPerS?: number; // life drift on top of the camera (>= 0.16 %/s)
  theme?: Theme;
};

const bz = (a: number, b: number, c: number, d: number) => { const e = Easing.bezier(a, b, c, d); return (x: number) => e(clamp01(x)); };
const PHASE = {
  A: { s: EZ.quick, p: bz(0.281, -0.431, 0, 1.354), d: 36 },
  B: { s: EZ.phaseB, p: EZ.phaseB, d: 75 },
  C: { s: EZ.settle, p: bz(0.242, -0.22, 0, 1.144), d: 30 },
};
const camOf = (k: number, c0: PlanCam, ph: PlanPhase[]): Required<PlanCam> => {
  let c: Required<PlanCam> = { rot: 0, ...c0 };
  for (const q of ph) {
    const P = PHASE[q.phase];
    const t = (k - q.at) / (q.d ?? P.d);
    if (t <= 0) continue;
    const us = P.s(t), up = P.p(t);
    c = { cx: lerp(c.cx, q.to.cx, up), cy: lerp(c.cy, q.to.cy, up), s: lerpLog(c.s, q.to.s, us), rot: lerp(c.rot, q.to.rot ?? c.rot, us) };
  }
  return c;
};

type Rect = { x: number; y: number; w: number; h: number };
type Corner = Exclude<PipSide, "auto">;
const CORNERS: Corner[] = ["tr", "tl", "br", "bl"];
const KEEP = 24; // px every label / the impact keeps outside the PiP rect
const grow = (r: Rect, m: number): Rect => ({ x: r.x - m, y: r.y - m, w: r.w + 2 * m, h: r.h + 2 * m });
const hit = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const inside = (p: P2, r: Rect) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
/** never show beyond the still: raise the scale until the (rotated) screen fits, then keep the centre inside the still's edges */
const clampCam = (c: Required<PlanCam>, srcW: number, srcH: number): Required<PlanCam> => {
  const r = (c.rot * Math.PI) / 180, ac = Math.abs(Math.cos(r)), as = Math.abs(Math.sin(r));
  const ex = W * ac + H * as, ey = W * as + H * ac; // screen extent along the still's axes at scale 1
  const sc = Math.max(c.s, ex / srcW, ey / srcH);
  const hx = ex / (2 * sc), hy = ey / (2 * sc);
  return { cx: Math.min(srcW - hx, Math.max(hx, c.cx)), cy: Math.min(srcH - hy, Math.max(hy, c.cy)), s: sc, rot: c.rot };
};
const mapWith = (c: Required<PlanCam>, p: P2): P2 => {
  const rr = (c.rot * Math.PI) / 180, cs = Math.cos(rr), sn = Math.sin(rr);
  const dx = (p.x - c.cx) * c.s, dy = (p.y - c.cy) * c.s;
  return { x: W / 2 + dx * cs - dy * sn, y: H / 2 + dx * sn + dy * cs };
};

/** Catmull-Rom through time-keyed points (clip frames), clamped at the ends */
const posAt = (keys: VKey[], t: number): P2 => {
  if (t <= keys[0].f) return keys[0];
  const n = keys.length;
  if (t >= keys[n - 1].f) return keys[n - 1];
  let i = 0;
  while (i < n - 2 && t > keys[i + 1].f) i++;
  const p0 = keys[Math.max(0, i - 1)], p1 = keys[i], p2 = keys[i + 1], p3 = keys[Math.min(n - 1, i + 2)];
  const u = (t - p1.f) / Math.max(1e-6, p2.f - p1.f), u2 = u * u, u3 = u2 * u;
  const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * u + (2 * a - 5 * b + 4 * cc - d) * u2 + (-a + 3 * b - 3 * cc + d) * u3);
  return { x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) };
};
/** heading in degrees: explicit key rot if given, else the direction of travel (segment direction while parked) */
const headingAt = (keys: VKey[], t: number) => {
  if (keys.some((k) => k.rot !== undefined)) {
    const a = keys.filter((k) => k.rot !== undefined);
    if (t <= a[0].f) return a[0].rot!;
    for (let i = 0; i < a.length - 1; i++) if (t <= a[i + 1].f) return lerp(a[i].rot!, a[i + 1].rot!, (t - a[i].f) / Math.max(1e-6, a[i + 1].f - a[i].f));
    return a[a.length - 1].rot!;
  }
  const p = posAt(keys, t - 0.5), q = posAt(keys, t + 0.5);
  if (Math.hypot(q.x - p.x, q.y - p.y) > 0.05) return (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].f) i++;
  let j = Math.min(i + 1, keys.length - 1);
  while (j > 0 && Math.hypot(keys[j].x - keys[j - 1].x, keys[j].y - keys[j - 1].y) < 0.5) j--;
  return j > 0 ? (Math.atan2(keys[j].y - keys[j - 1].y, keys[j].x - keys[j - 1].x) * 180) / Math.PI : 0;
};

/** top-down outline facing +x, centred on 0,0 */
const Body: React.FC<{ kind: Vehicle["kind"]; L: number; Wd: number; col: string }> = ({ kind, L, Wd, col }) => {
  const st = { fill: col, fillOpacity: 0.38, stroke: col, strokeWidth: 3, vectorEffect: "non-scaling-stroke" as const };
  const ln = { stroke: col, strokeWidth: 2, vectorEffect: "non-scaling-stroke" as const, fill: "none" };
  if (kind === "truck") {
    const cab = L * 0.2, gap = L * 0.03;
    return (
      <g>
        <rect x={-L / 2} y={-Wd / 2} width={L - cab - gap} height={Wd} rx={2} {...st} />
        <rect x={L / 2 - cab} y={-Wd * 0.46} width={cab} height={Wd * 0.92} rx={Wd * 0.14} {...st} />
        <line x1={L / 2 - cab * 0.45} y1={-Wd * 0.36} x2={L / 2 - cab * 0.45} y2={Wd * 0.36} {...ln} />
      </g>
    );
  }
  if (kind === "train") {
    return (
      <g>
        <rect x={-L / 2} y={-Wd / 2} width={L} height={Wd} rx={Wd * 0.3} {...st} />
        <line x1={L / 2 - Wd * 0.6} y1={-Wd * 0.38} x2={L / 2 - Wd * 0.6} y2={Wd * 0.38} {...ln} />
        <line x1={-L / 2 + Wd * 0.3} y1={0} x2={L / 2 - Wd * 0.9} y2={0} {...ln} strokeDasharray="6 5" />
      </g>
    );
  }
  return (
    <g>
      <rect x={-L / 2} y={-Wd / 2} width={L} height={Wd} rx={Wd * 0.32} {...st} />
      <path d={`M ${L * 0.16} ${-Wd * 0.4} Q ${L * 0.24} 0 ${L * 0.16} ${Wd * 0.4}`} {...ln} />
      <path d={`M ${-L * 0.3} ${-Wd * 0.38} Q ${-L * 0.36} 0 ${-L * 0.3} ${Wd * 0.38}`} {...ln} />
    </g>
  );
};

export const PlanReplay: React.FC<PlanReplayProps> = ({
  src, srcW = 1920, srcH = 1080, grade = "brightness(.6) saturate(.55) contrast(1.15)", media, mediaStart = 0, clipAt = 0, pipW = 0.459, pipSide = "auto",
  vehicles, labels = [], impact, cam0, phases = [], driftPerS = 0.005, theme = WATERPARK,
}) => {
  const f = useCurrentFrame();
  const { durationInFrames: dur } = useVideoConfig();
  const clipOf = (t: number) => mediaStart + (t - clipAt); // the footage's own timecode at local t
  const impactLocal = impact ? clipAt + (impact.f - mediaStart) : 0;
  // camera: VV phases + life drift, clamped to the still's edges (never shows beyond the still)
  const baseCam = (t: number) => { const c = camOf(t, cam0, phases); return clampCam({ ...c, s: c.s * drift(t, driftPerS) }, srcW, srcH); };
  // ---- PiP geometry (D3: 0.459 W, margins 49 / 20) in the chosen corner
  const pw = pipW * W, ph = (pw * 9) / 16;
  const pipRect = (sd: Corner): Rect => ({ x: sd[1] === "r" ? W - 49 - pw : 49, y: sd[0] === "t" ? 20 : H - 20 - ph, w: pw, h: ph });
  const hasPip = !!media;
  const side: Corner = (() => {
    if (pipSide !== "auto") return pipSide;
    if (!hasPip) return "tr";
    // auto: score every corner over the whole shot (impact under the PiP >> vehicles under it > fixed label anchors); tie -> farthest from the impact
    const ipEnd = impact ? mapWith(baseCam(Math.min(dur - 1, Math.max(0, impactLocal))), impact) : { x: W / 2, y: H / 2 };
    let best: Corner = "tr", bestS = Infinity;
    for (const cn of CORNERS) {
      const R = grow(pipRect(cn), KEEP + 30);
      let sc = 0;
      for (let t = 0; t < dur; t += 3) {
        const c = baseCam(t), cf = clipOf(t);
        if (impact && t >= impactLocal - 15 && inside(mapWith(c, impact), R)) sc += 1000;
        vehicles.forEach((v) => { if (inside(mapWith(c, posAt(v.keys, cf)), R)) sc += 10; });
        labels.forEach((lb) => { if (t >= lb.at && lb.vehicle === undefined && inside(mapWith(c, { x: lb.x ?? 0, y: lb.y ?? 0 }), R)) sc += 3; });
      }
      const pr = pipRect(cn);
      sc -= Math.hypot(pr.x + pr.w / 2 - ipEnd.x, pr.y + pr.h / 2 - ipEnd.y) / 1000; // tie-break: farthest from the impact
      if (sc < bestS - 1e-9) { bestS = sc; best = cn; }
    }
    return best;
  })();
  const PIP = pipRect(side);
  // ---- impact keep-out: if the impact would sit under / within 24 px of the PiP, the camera slides it out along ONE axis (picked once, at the
  // impact frame, so it never flips); the slide is continuous because the overlap is. The still clamp still wins at the still's edges.
  const keepR = grow(PIP, KEEP + 34); // 34 = marker radius at landing
  const axis: "x" | "y" | null = (() => {
    if (!hasPip || !impact) return null;
    const q = mapWith(baseCam(Math.max(0, impactLocal)), impact);
    const dxNeed = side[1] === "r" ? q.x - keepR.x : keepR.x + keepR.w - q.x;
    const dyNeed = side[0] === "t" ? keepR.y + keepR.h - q.y : q.y - keepR.y;
    return dxNeed <= dyNeed ? "x" : "y";
  })();
  const camAtT = (t: number): Required<PlanCam> => {
    const c = baseCam(t);
    if (!axis || !impact) return c;
    const q = mapWith(c, impact);
    if (!inside(q, keepR)) return c;
    let sx = 0, sy = 0; // screen shift the impact needs
    if (axis === "x") sx = side[1] === "r" ? keepR.x - q.x : keepR.x + keepR.w - q.x;
    else sy = side[0] === "t" ? keepR.y + keepR.h - q.y : keepR.y - q.y;
    const rr = (c.rot * Math.PI) / 180, cs = Math.cos(rr), sn = Math.sin(rr);
    const wx = (sx * cs + sy * sn) / c.s, wy = (-sx * sn + sy * cs) / c.s; // screen shift -> still px
    return clampCam({ ...c, cx: c.cx - wx, cy: c.cy - wy }, srcW, srcH);
  };
  const c = camAtT(f);
  const s = c.s;
  const map = (p: P2) => mapWith(c, p);
  const clipF = clipOf(f);
  const roleCol = (r?: Vehicle["role"]) => (r === "accent" ? theme.accent : r === "dim" ? theme.dim : theme.neutral);
  const vPos = vehicles.map((v) => posAt(v.keys, clipF));
  // impact
  const kI = impact ? f - impactLocal : -1;
  const ip = impact ? map(impact) : { x: 0, y: 0 };
  // ---- label layout with collision avoidance: earlier labels keep their place; a later label that would hit an earlier one, the PiP (+24 px),
  // the impact marker or the frame edge is stacked above / below (or flipped to the anchor's other side) into the nearest free slot, with a short
  // leader back to its anchor. Picks are STICKY (simulated from the first label: a label keeps its slot while that slot stays free), and the
  // shown offset is the +-8 f average of the sticky picks, so a label slides (eased) into a new slot instead of jumping. Deterministic per frame.
  const lbSize = (lb: PlanLabel) => themeFs(theme.text.face, lb.cap ?? 34);
  const lbW = labels.map((lb) => measure(lb.text, themeFont(theme.text, lb.cap ?? 34)) + 0.02 * lbSize(lb) * lb.text.length + 4);
  const order = labels.map((_, i) => i).sort((a, b) => labels[a].at - labels[b].at || a - b);
  const layoutAt = (t: number, prev: (P2 | null)[]): (P2 | null)[] => {
    const ct = camAtT(t), cf = clipOf(t);
    const placed: Rect[] = [];
    const obst: Rect[] = [];
    if (hasPip && t >= clipAt) obst.push(grow(PIP, KEEP));
    if (impact && t - impactLocal >= -6) { const q = mapWith(ct, impact); obst.push({ x: q.x - 36, y: q.y - 36, w: 72, h: 72 }); }
    const out: (P2 | null)[] = labels.map(() => null);
    for (const i of order) {
      const lb = labels[i];
      if (t < lb.at || (lb.outAt !== undefined && t >= lb.outAt + 6)) continue;
      const anchor = lb.vehicle !== undefined && vehicles[lb.vehicle] ? posAt(vehicles[lb.vehicle].keys, cf) : { x: lb.x ?? 0, y: lb.y ?? 0 };
      const p = mapWith(ct, anchor);
      const hh = lbSize(lb) * 1.15, w = lbW[i], dx = lb.dx ?? 28, dy = lb.dy ?? -28;
      const base: Rect = { x: p.x + dx, y: p.y + dy - hh / 2, w, h: hh };
      const flip = -(2 * dx + w);
      const cands: P2[] = [{ x: 0, y: 0 }, { x: flip, y: 0 }];
      for (let n = 1; n <= 6; n++) for (const sg of [1, -1]) { cands.push({ x: 0, y: sg * n * (hh + 10) }); cands.push({ x: flip, y: sg * n * (hh + 10) }); }
      cands.sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y));
      const ok = (r: Rect) => r.x >= KEEP && r.x + r.w <= W - KEEP && r.y >= KEEP && r.y + r.h <= H - KEEP && !obst.some((o) => hit(r, o)) && !placed.some((o) => hit(r, grow(o, 6)));
      const okQ = (q: P2) => ok({ ...base, x: base.x + q.x, y: base.y + q.y });
      const pv = prev[i];
      const pick = (pv && okQ(pv) ? pv : cands.find(okQ)) ?? pv ?? { x: 0, y: 0 };
      placed.push({ ...base, x: base.x + pick.x, y: base.y + pick.y });
      out[i] = pick;
    }
    return out;
  };
  const offs: P2[] = (() => {
    const acc = labels.map(() => ({ x: 0, y: 0, w: 0 }));
    if (!labels.length) return [];
    let prev: (P2 | null)[] = labels.map(() => null);
    const t0 = Math.min(f - 8, ...labels.map((lb) => lb.at));
    for (let t = t0; t <= f + 8; t++) {
      prev = layoutAt(t, prev);
      const d = t - f;
      if (d < -8) continue;
      const wt = 9 - Math.abs(d);
      prev.forEach((q, i) => { if (q) { acc[i].x += q.x * wt; acc[i].y += q.y * wt; acc[i].w += wt; } });
    }
    return acc.map((a) => (a.w > 0 ? { x: a.x / a.w, y: a.y / a.w } : { x: 0, y: 0 }));
  })();
  return (
    <AbsoluteFill style={{ background: "#05080B", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) rotate(${c.rot.toFixed(3)}deg) scale(${s.toFixed(5)}) translate(${(-c.cx).toFixed(2)}px, ${(-c.cy).toFixed(2)}px)` }}>
        <Img src={asset(src)} style={{ position: "absolute", left: 0, top: 0, width: srcW, height: srcH, filter: grade }} />
        <svg width={srcW} height={srcH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {vehicles.map((v, i) => {
            const col = roleCol(v.role);
            const L = v.len ?? (v.kind === "truck" ? 120 : v.kind === "train" ? 160 : 46), Wd = v.wid ?? (v.kind === "truck" ? 26 : v.kind === "train" ? 30 : 20);
            const t0 = v.keys[0].f, t1 = Math.min(clipF, v.keys[v.keys.length - 1].f);
            const trail: string[] = [];
            if (v.path !== false && t1 > t0) for (let t = t0; t <= t1 + 0.001; t += Math.max(1, (t1 - t0) / 60)) { const q = posAt(v.keys, Math.min(t, t1)); trail.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`); }
            const nCars = v.kind === "train" ? Math.max(1, v.cars ?? 3) : 1;
            return (
              <g key={i} style={{ filter: `drop-shadow(0 0 5px ${v.role === "accent" ? theme.accentGlow : "rgba(0,0,0,.7)"})` }}>
                {trail.length > 1 ? <polyline points={[...trail, `${vPos[i].x.toFixed(1)},${vPos[i].y.toFixed(1)}`].join(" ")} fill="none" stroke={col} strokeOpacity={0.55} strokeWidth={2} strokeDasharray="8 7" vectorEffect="non-scaling-stroke" /> : null}
                {Array.from({ length: nCars }, (_, j) => {
                  // train cars trail the locomotive by one car length along the keyed path (in time: lag from the local speed)
                  let t = clipF;
                  if (j > 0) {
                    const a = posAt(v.keys, clipF - 3), b = posAt(v.keys, clipF + 3);
                    const sp = Math.max(0.5, Math.hypot(b.x - a.x, b.y - a.y) / 6);
                    t = clipF - (j * (L + 6)) / sp;
                  }
                  const p = j === 0 ? vPos[i] : posAt(v.keys, t);
                  return <g key={j} transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${headingAt(v.keys, t).toFixed(2)})`}><Body kind={v.kind} L={L} Wd={Wd} col={col} /></g>;
                })}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <PlateVig k={0.5} tint="0,0,0" inner={50} />
      {/* impact marker: lands on the collision frame (scale 1.5 -> 1 in 6 f) + one expanding ring over 18 f */}
      {impact && kI >= 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform={`translate(${ip.x.toFixed(1)} ${ip.y.toFixed(1)})`} style={{ filter: `drop-shadow(0 0 8px ${theme.accentGlow})` }}>
            <circle r={20 + 70 * EZ.out3(kI / 18)} fill="none" stroke={theme.accent} strokeWidth={4} opacity={1 - clamp01(kI / 18)} />
            <g transform={`scale(${(1 + 0.5 * (1 - EZ.out3(kI / 6))).toFixed(3)})`} opacity={clamp01(kI / 2 + 0.5)}>
              <circle r={22} fill="none" stroke={theme.accent} strokeWidth={5} />
              <path d="M -11 -11 L 11 11 M 11 -11 L -11 11" stroke={theme.accent} strokeWidth={5} strokeLinecap="round" />
            </g>
          </g>
        </svg>
      ) : null}
      {labels.map((lb, i) => {
        const k = f - lb.at;
        if (k < 0) return null;
        const o = lb.outAt === undefined ? 1 : 1 - EZ.out2((f - lb.outAt) / 6);
        if (o <= 0) return null;
        const anchor = lb.vehicle !== undefined && vPos[lb.vehicle] ? vPos[lb.vehicle] : { x: lb.x ?? 0, y: lb.y ?? 0 };
        const p = map(anchor);
        const w = EZ.out2(k / 7);
        const sz = lbSize(lb), hh = sz * 1.15;
        const off = offs[i];
        const lx = p.x + (lb.dx ?? 28) + off.x, ly = p.y + (lb.dy ?? -28) + off.y; // left edge / vertical centre
        const col = lb.accent ? theme.accent : theme.neutral;
        // leader (only when collision avoidance moved the label): from just off the anchor to the nearest point of the label box, drawn in 6 f
        const mv = Math.hypot(off.x, off.y);
        const nx = Math.min(lx + lbW[i], Math.max(lx, p.x)), ny = Math.min(ly + hh / 2, Math.max(ly - hh / 2, p.y));
        const ll = Math.hypot(nx - p.x, ny - p.y), g0 = Math.min(14, ll * 0.3);
        const ux = ll > 0 ? (nx - p.x) / ll : 0, uy = ll > 0 ? (ny - p.y) / ll : 0;
        const le = g0 + Math.max(0, ll - g0 - 4) * EZ.out2(k / 6);
        return (
          <React.Fragment key={i}>
            {mv > 6 && ll > g0 + 6 ? (
              <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o * clamp01((mv - 6) / 18) }}>
                <line x1={(p.x + ux * g0).toFixed(1)} y1={(p.y + uy * g0).toFixed(1)} x2={(p.x + ux * le).toFixed(1)} y2={(p.y + uy * le).toFixed(1)} stroke={col} strokeWidth={2.5} strokeLinecap="round" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.9))" }} />
              </svg>
            ) : null}
            <div style={{ position: "absolute", left: lx, top: ly, transform: "translateY(-50%)", whiteSpace: "pre", opacity: o, lineHeight: 1.15,
              clipPath: `inset(-20% ${(100 * (1 - w)).toFixed(2)}% -20% 0)`, fontFamily: theme.text.face, fontWeight: theme.text.weight, fontSize: sz,
              color: col, textShadow: "0 2px 4px rgba(0,0,0,.9), 0 0 14px rgba(0,0,0,.7)", letterSpacing: "0.02em" }}>{lb.text}</div>
          </React.Fragment>
        );
      })}
      {media ? (
        <Sequence from={clipAt} layout="none">
          <div style={{ position: "absolute", left: PIP.x, top: PIP.y, width: pw, height: ph, border: `3px solid ${theme.neutral}`, boxShadow: "0 0 12px rgba(0,0,0,.75), 0 10px 26px rgba(0,0,0,.5)", overflow: "hidden", background: "#000" }}>
            <div style={{ width: "100%", height: "100%", transform: `scale(${linPush(f - clipAt, 0.02).toFixed(5)})` }}><Media src={media} startFrom={mediaStart} /></div>
          </div>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
