// map / ParkPlan: an illustrated plan of a site (theme park, campus, festival ground) drawn by us, never a copied park map. Themed areas tint
// in on their names, one area lights up red with a D1 map box, and later areas can burn out to charred grey (buildings char black with ember
// edges). REF D1 E10 / E4 map-box language (Dashcam Vol.1 @ 0:05.0: pin, red leader, outlined box wiping L->R, then the words) + FA evidence E1
// (Instagram @ 2:47.5: one element per noun) + Farrell evidence rule 10 (the map is still while one thing changes).
// Ours: soft organic area shapes from a few control points, a muted illustrated palette under DD red, ember speckle flicker on the burn.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, RC, W, EZ, clamp01, fs as capFs, lerp, rng, type Cam } from "../../core";
import { MapBoxCallout, type Word } from "../../core/kits/geo";
import { camOf, centroid, ptsD, smoothPts, toScreen, worldTf, type CamSpec, type P2 } from "../../core/kits/diagram";

export type ParkArea = { id: string; pts: P2[]; name?: string; colour: string; at: number; labelAt?: number; labelPos?: P2; highlightAt?: number; burnAt?: number; burnFrames?: number };
export type ParkPlanProps = {
  cap?: number; labelCap?: number; subCap?: number; // callout box / area names / callout sub line caps (M-024 >= 28)
  areas: ParkArea[];
  water?: { pts: P2[]; at: number }[];
  walks?: { pts: P2[]; at: number }[]; // footpaths (dashed)
  buildings?: { x: number; y: number; w: number; h: number; rot?: number; at: number; charAt?: number }[];
  callouts?: { x: number; y: number; at: number; words: Word[]; sub?: Word[]; elbow?: { dx: number; dy: number } }[];
  dimOthersAt?: number; // non-highlighted areas dim from here
  cam0?: Cam; cam?: CamSpec[]; drift?: number;
};

const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, t));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};
const inside = (p: P2, poly: P2[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) c = !c; } return c; };

export const ParkPlan: React.FC<ParkPlanProps> = (p) => {
  const f = useCurrentFrame();
  const c = camOf(f, p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1 }, p.cam ?? [], p.drift ?? 0.008);
  const shapes = React.useMemo(() => p.areas.map((a) => smoothPts(a.pts, true, 10)), [p.areas]);
  const embers = React.useMemo(() => p.areas.map((a, i) => {
    const poly = shapes[i], xs = poly.map((q) => q.x), ys = poly.map((q) => q.y), r = rng(321 + i), out: { x: number; y: number; ph: number }[] = [];
    let g = 0;
    while (out.length < 60 && g++ < 2000) { const q = { x: Math.min(...xs) + r() * (Math.max(...xs) - Math.min(...xs)), y: Math.min(...ys) + r() * (Math.max(...ys) - Math.min(...ys)) }; if (inside(q, poly)) out.push({ ...q, ph: r() * 6.28 }); }
    return out;
  }), [p.areas, shapes]);
  const dim = p.dimOthersAt === undefined ? 0 : EZ.out2((f - p.dimOthersAt) / 10);
  return (
    <AbsoluteFill style={{ background: "#0A0D0B", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 48%, #1B231B 0%, #0A0D0B 85%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          {p.areas.map((a, i) => {
            const k = f - a.at;
            if (k < 0) return null;
            const bk = a.burnAt === undefined ? 0 : EZ.out2((f - a.burnAt) / (a.burnFrames ?? 24));
            const hl = a.highlightAt !== undefined && f >= a.highlightAt;
            const fillC = mix(a.colour, "#2A2A2A", bk), fo = 0.5 * EZ.out2(k / 8) * (hl ? 1 : 1 - 0.55 * dim);
            const edge = bk > 0.5 ? "#6E6E6E" : hl ? RC.lineRed : "#E9EDE4";
            return (
              <g key={a.id}>
                <path d={ptsD(shapes[i], true)} fill={fillC} fillOpacity={fo} stroke="none" />
                <path d={ptsD(shapes[i], true)} fill="none" stroke={edge} strokeWidth={hl ? 6 : 3} strokeOpacity={hl ? 1 : 0.7 * (1 - 0.5 * dim)} pathLength={1} strokeDasharray={`${EZ.out3(k / 12)} 1`}
                  style={{ filter: hl ? `drop-shadow(0 0 8px ${RC.lineRed}) drop-shadow(0 0 22px rgba(255,26,26,.4))` : undefined }} />
                {bk > 0 ? embers[i].map((e, j) => {
                  const fl = 0.5 + 0.5 * Math.sin(f * 0.9 + e.ph * 3);
                  const o = clamp01((bk - j / 120) * 3) * (1 - clamp01((f - (a.burnAt! + 60)) / 60)) * fl;
                  return o > 0.02 ? <circle key={j} cx={e.x} cy={e.y} r={3 + 3 * fl} fill={j % 3 ? "#FF6A16" : "#FFB224"} opacity={o} style={{ filter: "blur(1px)" }} /> : null;
                }) : null}
              </g>
            );
          })}
          {(p.water ?? []).map((w, i) => (f >= w.at ? <path key={`w${i}`} d={ptsD(smoothPts(w.pts, true, 10), true)} fill="rgba(63,150,200,.45)" stroke="#9FD8F0" strokeWidth={3} opacity={EZ.out2((f - w.at) / 8)} /> : null))}
          {(p.walks ?? []).map((w, i) => (f >= w.at ? <path key={`p${i}`} d={ptsD(smoothPts(w.pts, false, 8))} fill="none" stroke="#D9D2BE" strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" opacity={0.55 * EZ.out2((f - w.at) / 8)} /> : null))}
          {(p.buildings ?? []).map((b, i) => {
            if (f < b.at) return null;
            const ck = b.charAt === undefined ? 0 : EZ.out2((f - b.charAt) / 10);
            return (
              <rect key={`b${i}`} x={b.x - b.w / 2} y={b.y - b.h / 2} width={b.w} height={b.h} transform={`rotate(${b.rot ?? 0} ${b.x} ${b.y})`} rx={4}
                fill={ck > 0 ? mix("#CFC8B4", "#0B0B0B", ck) : "#CFC8B4"} stroke={ck > 0 ? "#FF5A1A" : "#F5F1E6"} strokeWidth={3} opacity={EZ.out2((f - b.at) / 6)}
                style={{ filter: ck > 0 ? `drop-shadow(0 0 ${(4 + 6 * (0.5 + 0.5 * Math.sin(f * 0.7 + i))).toFixed(1)}px rgba(255,90,26,.85))` : "drop-shadow(0 2px 3px rgba(0,0,0,.6))" }} />
            );
          })}
        </g>
      </svg>
      {/* area names (screen space, readable at any zoom) */}
      {p.areas.map((a, i) => {
        const at = a.labelAt ?? a.at + 4;
        if (!a.name || f < at) return null;
        const q = a.labelPos ?? centroid(shapes[i]), s = toScreen(c, q.x, q.y);
        const hl = a.highlightAt !== undefined && f >= a.highlightAt, burnt = a.burnAt !== undefined && f >= a.burnAt + 10;
        return (
          <div key={`n${a.id}`} style={{ position: "absolute", left: s.x - 300, width: 600, top: s.y, transform: "translateY(-50%)", textAlign: "center", fontFamily: FONT.inter, fontWeight: 800,
            fontSize: capFs("inter", (p.labelCap ?? 30) * (hl ? 1.25 : 1)), letterSpacing: "0.14em", color: burnt ? "#8A8A8A" : hl ? "#FF3B3B" : "#F2F0E8", opacity: EZ.out2((f - at) / 6) * (hl ? 1 : 1 - 0.45 * dim),
            textShadow: hl ? "0 0 8px rgba(255,40,40,.8), 0 2px 8px rgba(0,0,0,.8)" : "0 2px 8px rgba(0,0,0,.85)" }}>{a.name}</div>
        );
      })}
      {(p.callouts ?? []).map((co, i) => { const s = toScreen(c, co.x, co.y); return <MapBoxCallout key={`c${i}`} f={f} p={s} start={co.at} words={co.words} sub={co.sub} elbow={co.elbow} cap={p.cap ?? 36} subCap={p.subCap ?? 30} />; })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const PARK_DEMO: ParkPlanProps = {
  areas: [
    { id: "a", name: "AREA ONE", colour: "#5C8A4E", at: 2, pts: [{ x: 300, y: 300 }, { x: 640, y: 230 }, { x: 760, y: 420 }, { x: 600, y: 560 }, { x: 330, y: 520 }] },
    { id: "b", name: "NORTHERN AREA", colour: "#4E6E9A", at: 10, labelPos: { x: 1040, y: 470 }, highlightAt: 52, burnAt: 112, pts: [{ x: 800, y: 210 }, { x: 1180, y: 190 }, { x: 1260, y: 430 }, { x: 1040, y: 520 }, { x: 820, y: 420 }] },
    { id: "c", name: "HARBOUR AREA", colour: "#A0784A", at: 18, labelPos: { x: 1460, y: 360 }, burnAt: 126, pts: [{ x: 1300, y: 260 }, { x: 1640, y: 330 }, { x: 1620, y: 640 }, { x: 1330, y: 600 }, { x: 1280, y: 440 }] },
    { id: "d", name: "AREA FOUR", colour: "#8A5C7A", at: 26, pts: [{ x: 340, y: 600 }, { x: 640, y: 640 }, { x: 760, y: 860 }, { x: 420, y: 900 }] },
    { id: "e", name: "AREA FIVE", colour: "#7A8A44", at: 34, pts: [{ x: 1200, y: 680 }, { x: 1600, y: 700 }, { x: 1560, y: 900 }, { x: 1160, y: 880 }] },
  ],
  water: [{ at: 6, pts: [{ x: 820, y: 580 }, { x: 1060, y: 560 }, { x: 1160, y: 700 }, { x: 980, y: 840 }, { x: 800, y: 760 }] }],
  walks: [{ at: 8, pts: [{ x: 250, y: 580 }, { x: 780, y: 520 }, { x: 1200, y: 560 }, { x: 1680, y: 660 }] }],
  buildings: [
    { x: 1000, y: 330, w: 150, h: 80, rot: -6, at: 12, charAt: 112 },
    { x: 1160, y: 330, w: 70, h: 50, at: 14, charAt: 116 },
    { x: 1460, y: 500, w: 110, h: 70, rot: 8, at: 20, charAt: 128 },
    { x: 430, y: 480, w: 90, h: 60, at: 6 },
  ],
  callouts: [{ x: 1000, y: 330, at: 72, words: [{ t: "RIDE", at: 80 }, { t: "NAME", at: 84 }, { t: "· 1987", at: 90 }], elbow: { dx: -170, dy: -110 } }],
  dimOthersAt: 52,
  cam0: { cx: 960, cy: 560, s: 1.0 },
  cam: [{ at: 50, d: 40, cx: 1080, cy: 440, s: 1.35, ease: "quick" }, { at: 104, d: 46, cx: 1100, cy: 480, s: 1.1, ease: "settle" }],
};
