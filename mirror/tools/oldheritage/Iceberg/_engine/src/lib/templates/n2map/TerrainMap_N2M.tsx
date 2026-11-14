// N2M = the algrow-2 channel MAP system (v3, 2026-10-26, owner: "map style very bad -> horror/true-crime map style from the refs").
// Study: Disasters2/maps3d/MAP_STUDY.md. Adapted, measured devices:
//  - LEMMiNO "The Search for D. B. Cooper": charcoal hillshade relief + slate water + hairline roads (1:06, 7:18, 9:48), boxed tracked
//    caps labels on a leader tick, the primary label TYPES into a filled box (1:06 "SEATTL|E", ~0.5 s), dashed route + a small white plane
//    riding the line (2:28-2:42), red pin dot with a white ring (9:42-9:48);
//  - Fern "Japan's Chernobyl": the map is a lit 3D object under a tilted, drifting camera with miniature DOF, labels sit IN perspective on
//    the ground (8:24, 10:00, 12:16), one coloured ring as the only accent;
//  - DD / Abyssal: maps are silent and brief; Farrell: hard cut into a dark map (luma 5-10).
// Better than the refs: the ground is the REAL place (USGS 3DEP relief x USDA NAIP aerial, Blender Cycles, moonlit, fogged), the camera is
// one continuous eased flight, and the labels / route / pin are drawn here, crisp, from the Blender camera's per-frame projection
// (track.json), so type and timing change without a re-render. Accent = channel amber, used only on the pin + the route.
// Plate + track: Disasters2/maps3d (fetch_area.py -> make_plate.py -> build_terrain.py <shot.json>).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { clamp01, lerp } from "../../core";
import { EI, IC } from "../iceberg/ic";
import { FONT } from "../../core";
import { assertN2M } from "./rules_n2m";

export type Pt = [number, number, number]; // x, y (0..1 from the top-left), camera depth (< 0 = behind the camera)
export type MapTrack = { len: number; fps: number; pinAt?: number; track: Record<string, Record<string, Pt[]>> };
export type MapLabel = { anchor: string; text: string; kind?: "primary" | "box" | "faint"; at: number; out?: number; up?: number; dx?: number };
export type MapLine = { line: string; at: number; dur: number; from?: "start" | "end" | number }; // number = index the draw grows out from (both ways)
export type TerrainMapProps = {
  dur: number; // instance length (frames). The plate is time-stretched to fit within +-20 % (keys below are in PLATE frames)
  plate: string; // the Blender render: a JPG sequence pattern "n2map/c01/f_%04d.jpg" (preferred: exact under concurrency) or an mp4
  track?: MapTrack; trackSrc?: string; // projected anchors (inline, or a staticFile JSON)
  labels?: MapLabel[];
  road?: MapLine; // a road lit from the pin outward (ice)
  guide?: MapLine; // a faint dashed ground line (e.g. a runway's extended centreline)
  route?: MapLine & { plane?: boolean }; // the amber route in the air (+ its ground shadow "<line>@ground" and drop lines)
  pin?: { anchor: string; at: number };
  fadeIn?: number; fadeOut?: number;
};

const AMBER = IC.amber;
const NEAR = 0.6; // Blender units (60 m) in front of the lens
const W = 1920, H = 1080;

/** sample the track at a fractional plate frame (linear between frames; a point behind the camera stays null) */
const at = (T: MapTrack, key: string, pf: number): ([number, number] | null)[] => {
  const a = Math.max(0, Math.min(T.len - 1, Math.floor(pf))), b = Math.min(T.len - 1, a + 1), u = pf - a;
  const A = T.track[a]?.[key], B = T.track[b]?.[key];
  if (!A) return [];
  return A.map((p, i) => {
    const q = B?.[i] ?? p;
    if (p[2] <= NEAR || q[2] <= NEAR) return null; // near-plane: points beside/behind the lens project to nonsense
    const x = lerp(p[0], q[0], u), y = lerp(p[1], q[1], u);
    if (x < -0.6 || x > 1.6 || y < -0.6 || y > 1.6) return null;
    return [x * W, y * H];
  });
};
/** Catmull-Rom through screen points -> SVG path (keeps 3D routes from looking faceted) */
const smooth = (pts: [number, number][]) => {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};
const polyLen = (p: [number, number][]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
/** the point (and heading) at fraction u of a polyline's screen length */
const along = (p: [number, number][], u: number): { x: number; y: number; a: number } => {
  const L = polyLen(p) * clamp01(u); let s = 0;
  for (let i = 1; i < p.length; i++) {
    const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (s + l >= L || i === p.length - 1) { const k = l ? (L - s) / l : 0; return { x: lerp(p[i - 1][0], p[i][0], clamp01(k)), y: lerp(p[i - 1][1], p[i][1], clamp01(k)), a: Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0]) }; }
    s += l;
  }
  return { x: p[0][0], y: p[0][1], a: 0 };
};
/** the polyline cut at fraction u of its screen length (for dashed lines, which cannot use the dasharray draw-on) */
const partial = (p: [number, number][], u: number): [number, number][] => {
  if (u >= 1 || p.length < 2) return p;
  const L = polyLen(p) * clamp01(u); let s = 0; const out: [number, number][] = [p[0]];
  for (let i = 1; i < p.length; i++) {
    const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (s + l >= L) { const k = l ? (L - s) / l : 0; out.push([lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]); return out; }
    out.push(p[i]); s += l;
  }
  return out;
};
/** the contiguous visible run of a projected polyline: the one holding the LAST point (routes end on the pin), else the longest */
const solid = (pts: ([number, number] | null)[]): [number, number][] => {
  const runs: [number, number][][] = []; let cur: [number, number][] = [];
  pts.forEach((q) => { if (q) cur.push(q); else if (cur.length) { runs.push(cur); cur = []; } });
  if (cur.length) runs.push(cur);
  if (!runs.length) return [];
  if (pts[pts.length - 1]) return runs[runs.length - 1];
  return runs.reduce((a, b) => (b.length > a.length ? b : a));
};

const LabelBox: React.FC<{ x: number; y: number; text: string; kind: NonNullable<MapLabel["kind"]>; u: number; o: number; up: number; dx: number; typed: number }> = ({ x, y, text, kind, u, o, up, dx, typed }) => {
  const px = kind === "primary" ? 30 : kind === "box" ? 24 : 21;
  const shown = text.slice(0, Math.round(text.length * typed));
  const cur = typed < 1 && kind !== "faint";
  const font: React.CSSProperties = { fontFamily: FONT.archivo, fontWeight: kind === "primary" ? 640 : 560, fontSize: px, fontStretch: "80%", fontVariationSettings: `'wdth' 80, 'wght' ${kind === "primary" ? 640 : 560}`, textTransform: "uppercase", letterSpacing: "0.2em", lineHeight: 1, whiteSpace: "pre" };
  if (kind === "faint") return (
    <div style={{ position: "absolute", left: x + dx, top: y - up, transform: "translate(-50%, -100%)", opacity: o * u }}>
      <div style={{ ...font, color: IC.frost, opacity: 0.8, textShadow: "0 1px 2px rgba(0,0,0,.9), 0 0 12px rgba(0,6,16,.8)" }}>{text}</div>
    </div>
  );
  const fill = kind === "primary";
  const bw = text.length * px * 0.66 + (fill ? 34 : 28); // estimated box width (Archivo wdth 80, +0.2 em tracking)
  const cx = Math.max(56 + bw / 2, Math.min(W - 56 - bw / 2, x + dx)); // keep the whole box inside the frame (title-safe 56 px)
  return (
    <div style={{ position: "absolute", left: cx, top: Math.max(70, y - up), opacity: o }}>
      {/* the box draws open from its centre (LEMMiNO 2:30: the empty outline appears first, then the name types in) */}
      <div style={{ position: "absolute", left: 0, bottom: 0, transform: `translateX(-50%) scaleX(${0.2 + 0.8 * u})`, transformOrigin: "50% 100%",
        padding: fill ? "9px 14px 8px 18px" : "7px 11px 6px 15px", border: `2px solid ${IC.ice}`, background: fill ? IC.ice : "rgba(2,8,20,0.55)",
        boxShadow: "0 4px 18px rgba(0,0,0,.55)" }}>
        <div style={{ ...font, color: fill ? IC.abyss : IC.ice, opacity: u >= 0.99 ? 1 : 0, position: "relative" }}>
          <span>{shown}</span><span style={{ opacity: 0 }}>{text.slice(shown.length)}</span>
          {cur && u >= 0.99 && <span style={{ position: "absolute", left: `${(shown.length / Math.max(1, text.length)) * 100}%`, top: -2, bottom: -2, width: "0.55em", background: fill ? IC.abyss : IC.ice, opacity: 0.85 }} />}
        </div>
      </div>
    </div>
  );
};

export const TerrainMap_N2M: React.FC<TerrainMapProps> = (p) => {
  const f = useCurrentFrame();
  const [loaded, setLoaded] = useState<MapTrack | null>(p.track ?? null);
  const [handle] = useState(() => (p.track ? null : delayRender("n2map track")));
  useEffect(() => {
    if (p.track || !p.trackSrc) return;
    fetch(staticFile(p.trackSrc)).then((r) => r.json()).then((j) => { setLoaded(j); if (handle !== null) continueRender(handle); });
  }, [p.trackSrc]);
  const T = loaded;
  const plateLen = T?.len ?? p.dur;
  const rate = plateLen / p.dur;
  assertN2M(p, plateLen, rate);
  const pf = Math.min(plateLen - 1, f * rate); // plate frame
  const fadeIn = p.fadeIn ?? 9, fadeOut = p.fadeOut ?? 0;
  const vis = Math.min(fadeIn ? EI.land(f / fadeIn) : 1, fadeOut ? clamp01((p.dur - f) / fadeOut) : 1);
  if (!T) return <AbsoluteFill style={{ background: IC.abyss }} />;

  // ---- road glow (from the pin outward, both ways)
  const road = p.road ? solid(at(T, p.road.line, pf)) : [];
  const ru = p.road ? EI.cam(clamp01((pf - p.road.at) / p.road.dur)) : 0;
  let roadA: [number, number][] = [], roadB: [number, number][] = [];
  if (road.length > 1 && p.road) {
    const pin = p.pin ? at(T, p.pin.anchor, pf)[0] : null;
    let k = typeof p.road.from === "number" ? p.road.from : 0;
    if (pin && typeof p.road.from !== "number") { let best = 1e9; road.forEach((q, i) => { const d = Math.hypot(q[0] - pin[0], q[1] - pin[1]); if (d < best) { best = d; k = i; } }); }
    roadA = road.slice(0, k + 1).reverse(); roadB = road.slice(k);
  }
  // ---- guide (faint dashed ground line), route (amber, in the air) + its ground shadow + drop lines
  const g0 = p.guide ? solid(at(T, p.guide.line, pf)) : [];
  const guide = p.guide?.from === "end" ? [...g0].reverse() : g0;
  const gu = p.guide ? EI.smooth(clamp01((pf - p.guide.at) / p.guide.dur)) : 0;
  const routeRaw = p.route ? at(T, p.route.line, pf) : [];
  const route = solid(routeRaw);
  const groundRaw = p.route ? at(T, p.route.line + "@ground", pf) : [];
  const ou = p.route ? EI.cam(clamp01((pf - p.route.at) / p.route.dur)) : 0;
  const head = route.length > 1 ? along(route, ou) : null;
  const done = p.route ? clamp01((pf - p.route.at - p.route.dur) / 10) : 0;
  // ---- pin
  const pin = p.pin ? at(T, p.pin.anchor, pf)[0] : null;
  const pu = p.pin ? EI.quick(clamp01((pf - p.pin.at) / 10)) : 0;
  const pinOn = p.pin && pf >= p.pin.at;

  return (
    <AbsoluteFill style={{ background: IC.abyss, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: vis }}>
        {p.plate.includes("%04d")
          ? <Img src={staticFile(p.plate.replace("%04d", String(Math.round(pf)).padStart(4, "0")))} style={{ width: W, height: H }} />
          : <OffthreadVideo src={staticFile(p.plate)} muted playbackRate={rate} style={{ width: W, height: H }} />}
        {/* night grade: cold soft-light, sky held down, heavy corner falloff (LEMMiNO's dark edges) */}
        <AbsoluteFill style={{ background: "#0B2A44", mixBlendMode: "soft-light", opacity: 0.30 }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(2,8,20,.62) 0%, rgba(2,8,20,.18) 22%, rgba(2,8,20,0) 40%)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 68% at 50% 54%, rgba(0,0,0,0) 50%, rgba(0,3,9,.62) 100%)" }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <filter id="n2m-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
          </defs>
          {/* guide: faint ice dashes on the ground */}
          {guide.length > 1 && gu > 0 && <path d={smooth(partial(guide, gu))} fill="none" stroke={IC.ice} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="10 9" />}
          {/* road lit from the pin outward */}
          {[roadA, roadB].map((r, i) => r.length > 1 && ru > 0 ? (
            <g key={i}>
              <path d={smooth(r)} pathLength={1} fill="none" stroke={IC.ice} strokeWidth={12} strokeOpacity={0.22} strokeDasharray={`${ru} 1`} filter="url(#n2m-glow)" />
              <path d={smooth(r)} pathLength={1} fill="none" stroke={IC.ice} strokeWidth={2.6} strokeOpacity={0.92} strokeDasharray={`${ru} 1`} strokeLinecap="round" />
            </g>) : null)}
          {/* route: ground shadow, drop lines, the amber line in the air, the plane riding its head */}
          {route.length > 1 && ou > 0 && (
            <g>
              {solid(groundRaw).length > 1 && <path d={smooth(solid(groundRaw))} pathLength={1} fill="none" stroke={AMBER} strokeOpacity={0.42} strokeWidth={1.6} strokeDasharray={`${ou} 1`} />}
              {routeRaw.map((q, i) => {
                const g = groundRaw[i]; if (!q || !g || i === routeRaw.length - 1 || i % 7 !== 3) return null;
                const reach = polyLen(solid(routeRaw.slice(0, i + 1))) / Math.max(1, polyLen(route));
                const v = EI.quick(clamp01((ou - reach) * 8));
                return v > 0 ? <line key={i} x1={q[0]} y1={q[1]} x2={lerp(q[0], g[0], v)} y2={lerp(q[1], g[1], v)} stroke={AMBER} strokeOpacity={0.55} strokeWidth={1.4} strokeDasharray="3 4" /> : null;
              })}
              <path d={smooth(route)} pathLength={1} fill="none" stroke={AMBER} strokeWidth={10} strokeOpacity={0.30} strokeDasharray={`${ou} 1`} filter="url(#n2m-glow)" />
              <path d={smooth(route)} pathLength={1} fill="none" stroke={AMBER} strokeWidth={3.2} strokeDasharray={`${ou} 1`} strokeLinecap="round" />
              {p.route?.plane && head && done < 1 && (
                <g transform={`translate(${head.x},${head.y}) rotate(${(head.a * 180) / Math.PI})`} opacity={(1 - done) * clamp01(ou * 10)}>
                  {/* small top-down light aircraft (LEMMiNO's white plane glyph), nose along +x */}
                  <path d="M13,0 L5,-1.6 L2,-12 L-1.5,-12 L-0.5,-1.8 L-8,-1.6 L-11,-5 L-13,-5 L-11.5,0 L-13,5 L-11,5 L-8,1.6 L-0.5,1.8 L-1.5,12 L2,12 L5,1.6 Z" fill="#fff" stroke="rgba(0,0,0,.6)" strokeWidth={0.8} />
                </g>)}
            </g>)}
          {/* pin: amber core + white heart, ring, sonar pings (channel), a burst when the route lands */}
          {pin && pinOn && (
            <g>
              {[0, 1, 2].map((i) => { const t0 = p.pin!.at + 6 + i * 11; if (pf < t0) return null; const u = ((pf - t0) % 33) / 33; return <circle key={i} cx={pin[0]} cy={pin[1]} r={10 + 70 * EI.land(u)} fill="none" stroke={AMBER} strokeWidth={1.6} opacity={(1 - u) * 0.75} />; })}
              {done > 0 && <circle cx={pin[0]} cy={pin[1]} r={14 + 60 * EI.land(done)} fill="none" stroke={IC.ice} strokeWidth={2} opacity={(1 - done) * 0.9} />}
              <circle cx={pin[0]} cy={pin[1]} r={15 * pu} fill="none" stroke="#fff" strokeWidth={3} />
              <circle cx={pin[0]} cy={pin[1]} r={11 * pu} fill={AMBER} />
              <circle cx={pin[0]} cy={pin[1]} r={3.6 * pu} fill="#fff" />
            </g>)}
          {/* label leader ticks */}
          {(p.labels ?? []).map((l, i) => {
            const q = at(T, l.anchor, pf)[0]; if (!q || l.kind === "faint") return null;
            const u = EI.quick(clamp01((pf - l.at) / 8)), o = l.out ? clamp01((l.out - pf) / 8) : 1; if (u <= 0 || o <= 0) return null;
            const up = l.up ?? 56, px = l.kind === "primary" ? 30 : 24, bw = l.text.length * px * 0.66 + (l.kind === "primary" ? 34 : 28);
            const bx = Math.max(56 + bw / 2, Math.min(W - 56 - bw / 2, q[0] + (l.dx ?? 0))), by = Math.max(70, q[1] - up);
            return <line key={i} x1={q[0]} y1={q[1] - (l.anchor === p.pin?.anchor ? 16 : 0)} x2={lerp(q[0], bx, u)} y2={lerp(q[1], by, u)} stroke={IC.ice} strokeWidth={2} opacity={o} />;
          })}
        </svg>
        {(p.labels ?? []).map((l, i) => {
          const q = at(T, l.anchor, pf)[0]; if (!q) return null;
          const u = EI.quick(clamp01((pf - l.at - (l.kind === "faint" ? 0 : 5)) / 7)), o = l.out ? clamp01((l.out - pf) / 8) : 1;
          if (pf < l.at || o <= 0) return null;
          const typed = clamp01((pf - l.at - 12) / Math.max(6, l.text.length * 0.9));
          return <LabelBox key={i} x={q[0]} y={q[1]} text={l.text} kind={l.kind ?? "box"} u={u} o={o} up={l.up ?? 56} dx={l.dx ?? 0} typed={l.kind === "faint" ? 1 : typed} />;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
