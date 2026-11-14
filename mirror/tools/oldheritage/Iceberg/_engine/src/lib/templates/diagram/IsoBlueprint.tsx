// diagram / IsoBlueprint: an isometric line-art blueprint of a structure; parts draw on their nouns, the camera travels between parts on the
// words, parts recolour / crack / drop out on cue, glyphs (rafts, staff) move along it. REF VV §11 world-space infographic (Visual Venture TV
// @ 3:28.0: one plane, a camera in quick-start / long-settle phases, bezier (0.31, 0, 0, 0.957); labels never animate after arrival) + Farrell
// story "the explainer returns" (#15 / #33: the same drawing comes back and changes on the words) + D1 E4 HUD callout (@ 1:07.9).
// Ours: true isometric boxes with hidden edges dashed (blueprint convention), water / glass / solid faces, vapour wisps and an indicator lamp
// that can flicker and stay dark; red recolour + crack + drop-out for failures. Built on the diagram kit's stroke language and camera.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, RC, W, EZ, HudBox, MBlur, camFast, clamp01, lerp, rng, type Cam } from "../../core";
import { Glyph } from "../../core/kits/glyphs";
import { BLUEPRINT_BG, GridPlate, PlanText, camOf, toKeys, toScreen, worldTf, type CamSpec, PlanCap } from "../../core/kits/diagram";

type V3 = [number, number, number];
type Fx = { recolour?: { at: number; colour?: string }; crack?: { at: number }; drop?: { at: number; dz: number; d?: number } };
export type IsoPart =
  | ({ kind: "box"; id?: string; x: number; y: number; z: number; w: number; d: number; h: number; at: number; drawFrames?: number; fill?: "water" | "glass" | "solid" | "none"; colour?: string } & Fx)
  | ({ kind: "line"; id?: string; pts: V3[]; at: number; drawFrames?: number; width?: number; dashed?: boolean; colour?: string } & Fx)
  | { kind: "glyph"; id?: string; glyph: string; x: number; y: number; z: number; size?: number; at: number; colour?: string; moves?: { at: number; d: number; to: V3; rot?: number }[]; until?: number };
export type IsoBlueprintProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  unit?: number; // px per iso unit at scale 1
  origin?: { x: number; y: number }; // where iso (0,0,0) projects on the world plane
  parts: IsoPart[]; // painter's order = array order
  vapour?: { x: number; y: number; z: number; w: number; d: number; at: number; n?: number; colour?: string; rise?: number }[];
  lamps?: { x: number; y: number; z: number; at: number; label?: string; state?: "dark" | "on"; flickerAt?: number; colour?: string }[];
  labels?: { x: number; y: number; z: number; text: string; at: number; dy?: number; colour?: string; size?: number }[];
  tags?: { x: number; y: number; z: number; text: string; at: number; dx?: number; dy?: number }[]; // D1 E4 HUD callouts (screen)
  cam0: Cam; cam?: CamSpec[]; drift?: number;
  palette?: "blueprint" | "line";
};

const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
const iso = (o: { x: number; y: number }, u: number, x: number, y: number, z: number) => ({ x: o.x + (x - y) * C30 * u, y: o.y + (x + y) * S30 * u - z * u });

const Scene: React.FC<IsoBlueprintProps> = (p) => {
  const f = useCurrentFrame();
  const u = p.unit ?? 40, o = p.origin ?? { x: 960, y: 380 };
  const P = (x: number, y: number, z: number) => iso(o, u, x, y, z);
  const c = camOf(f, p.cam0, p.cam ?? [], p.drift ?? 0.008);
  const base = p.palette === "line" ? "#FDFCFD" : "#D6ECFF";
  const glow = p.palette === "line" ? "drop-shadow(0 0 3px rgba(255,255,255,.8)) drop-shadow(0 0 16px rgba(255,255,255,.28))" : "drop-shadow(0 0 3px rgba(150,210,255,.75)) drop-shadow(0 0 14px rgba(90,170,255,.3))";
  const red = RC.lineRed;
  const vap = React.useMemo(() => (p.vapour ?? []).map((v, j) => { const r = rng(700 + j); return Array.from({ length: v.n ?? 26 }, () => ({ x: v.x + r() * v.w, y: v.y + r() * v.d, ph: r() * 60, a: r() * 6.28, l: 0.6 + r() * 0.8 })); }), [p.vapour]);
  const fxColour = (fx: Fx, col: string) => {
    if (!fx.recolour) return { col, k: 0 };
    const k = clamp01((f - fx.recolour.at) / 4);
    return { col: k >= 0.5 ? fx.recolour.colour ?? red : col, k };
  };
  const dropZ = (fx: Fx) => (fx.drop ? -fx.drop.dz * EZ.in2((f - fx.drop.at) / (fx.drop.d ?? 14)) : 0);
  return (
    <AbsoluteFill>
      <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: c.s }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          {p.parts.map((pt, i) => {
            const k = f - pt.at;
            if (k < 0) return null;
            if (pt.kind === "glyph") {
              if (pt.until !== undefined && f >= pt.until) return null;
              let q: V3 = [pt.x, pt.y, pt.z], rot = 0;
              for (const m of pt.moves ?? []) { const e = EZ.quick(clamp01((f - m.at) / m.d)); q = [lerp(q[0], m.to[0], e), lerp(q[1], m.to[1], e), lerp(q[2], m.to[2], e)]; rot = lerp(rot, m.rot ?? rot, e); }
              const s = P(q[0], q[1], q[2]), sz = pt.size ?? 70;
              return (
                <g key={i} transform={`translate(${s.x.toFixed(1)} ${(s.y - sz / 2).toFixed(1)}) rotate(${rot.toFixed(2)} 0 ${sz / 2})`} opacity={EZ.out2(k / 5)} style={{ filter: glow }}>
                  <Glyph name={pt.glyph} colour={pt.colour ?? base} size={sz} mode="line" lineW={9} />
                </g>
              );
            }
            const dr = EZ.out3(k / (pt.drawFrames ?? 14));
            const { col, k: rk } = fxColour(pt, pt.colour ?? base);
            const dz = dropZ(pt);
            if (pt.kind === "line") {
              const pts = pt.pts.map(([x, y, z]) => P(x, y, z + dz));
              const d = pts.map((q, j) => `${j ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
              return <path key={i} d={d} fill="none" stroke={col} strokeWidth={pt.width ?? 4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={pt.dashed ? undefined : `${dr} 1`} opacity={pt.dashed ? dr : 1} style={{ filter: rk > 0 ? `drop-shadow(0 0 6px ${red})` : glow }} />;
            }
            const { x, y, w, d: dd, h } = pt, z = pt.z + dz;
            const v = (a: number, b: number, cz: number) => P(x + a * w, y + b * dd, z + cz * h);
            const L = (q: { x: number; y: number }[]) => q.map((r, j) => `${j ? "L" : "M"}${r.x.toFixed(1)} ${r.y.toFixed(1)}`).join(" ");
            const top = [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)];
            const right = [v(1, 0, 0), v(1, 1, 0), v(1, 1, 1), v(1, 0, 1)]; // x = x + w face
            const front = [v(0, 1, 0), v(1, 1, 0), v(1, 1, 1), v(0, 1, 1)]; // y = y + d face
            const vis = `${L(top)} Z ${L([v(1, 0, 1), v(1, 0, 0), v(1, 1, 0), v(0, 1, 0), v(0, 1, 1)])} M${v(1, 1, 0).x} ${v(1, 1, 0).y} L${v(1, 1, 1).x} ${v(1, 1, 1).y}`;
            const hid = h > 0 ? L([v(0, 0, 1), v(0, 0, 0), v(1, 0, 0)]) + " " + L([v(0, 0, 0), v(0, 1, 0)]) : "";
            const fillK = clamp01((k - 6) / 10);
            const fill = pt.fill ?? "none";
            const faceFill = fill === "solid" ? "rgba(5,11,17,.92)" : fill === "glass" ? "rgba(150,215,255,.08)" : "none";
            const crackK = pt.crack ? f - pt.crack.at : -1;
            const cr = (() => {
              if (crackK < 0) return null;
              const r = rng(31 + i), n = 7, pts: { x: number; y: number }[] = [];
              for (let j = 0; j <= n; j++) { const t = j / n; pts.push(v(t, 0.5 + (j % 2 ? 0.28 : -0.28) * (0.5 + r() * 0.5) * (j === 0 || j === n ? 0 : 1), 1)); }
              return <path d={L(pts)} fill="none" stroke={red} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={`${EZ.out3(crackK / 6)} 1`} style={{ filter: `drop-shadow(0 0 6px ${red})` }} />;
            })();
            return (
              <g key={i}>
                {fill !== "none" && fill !== "water" ? <g opacity={fillK}><path d={`${L(top)} Z`} fill={faceFill} /><path d={`${L(right)} Z`} fill={faceFill} /><path d={`${L(front)} Z`} fill={faceFill} /></g> : null}
                {fill === "water" ? <path d={`${L(top)} Z`} fill="rgba(63,190,255,.20)" opacity={fillK} /> : null}
                {hid ? <path d={hid} fill="none" stroke={col} strokeWidth={2} strokeDasharray="8 8" opacity={0.35 * dr} /> : null}
                <path d={vis} fill="none" stroke={col} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${dr} 1`} style={{ filter: rk > 0 ? `drop-shadow(0 0 7px ${red}) drop-shadow(0 0 18px rgba(255,26,26,.4))` : glow }} />
                {fill === "water" && fillK > 0 ? Array.from({ length: 4 }, (_, j) => { const a = v(0.15, 0.2 + j * 0.2, 1), b = v(0.85, 0.2 + j * 0.2, 1); return <path key={j} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke="rgba(150,225,255,.35)" strokeWidth={2} strokeDasharray="14 18" strokeDashoffset={-f * 0.6} opacity={fillK} />; }) : null}
                {cr}
              </g>
            );
          })}
          {(p.vapour ?? []).map((v, j) => {
            const k = f - v.at;
            if (k < 0) return null;
            return (
              <g key={`v${j}`} fill="none" stroke={v.colour ?? "rgba(225,240,255,.42)"} strokeWidth={9} strokeLinecap="round" style={{ filter: "blur(4px)" }}>
                {vap[j].map((q, i) => {
                  const life = 54, a0 = k - q.ph * 0.5; // each wisp starts after its own delay, then cycles
                  if (a0 < 0) return null;
                  const a = a0 % life;
                  const t = a / life, rise = (v.rise ?? 4) * t * q.l;
                  const pts = Array.from({ length: 8 }, (_, m) => { const zz = v.z + rise - m * 0.3; const s = P(q.x + Math.sin(q.a + zz * 1.6) * 0.35, q.y, Math.max(v.z, zz)); return `${s.x.toFixed(1)},${s.y.toFixed(1)}`; }).join(" ");
                  return <polyline key={i} points={pts} opacity={(Math.sin(Math.PI * t) * clamp01(k / 10)).toFixed(3)} />;
                })}
              </g>
            );
          })}
          {(p.lamps ?? []).map((l, j) => {
            const k = f - l.at;
            if (k < 0) return null;
            const s = P(l.x, l.y, l.z);
            const fk = l.flickerAt === undefined ? -1 : f - l.flickerAt;
            const fl = fk >= 0 && fk < 9 ? [0.5, 0, 0.35, 0, 0, 0.2, 0, 0, 0][Math.floor(fk)] : 0;
            const on = l.state === "on" ? 1 : fl;
            const lc = l.colour ?? red;
            return (
              <g key={`l${j}`} opacity={EZ.out2(k / 5)}>
                <circle cx={s.x} cy={s.y} r={15} fill={on > 0 ? lc : "#070b10"} fillOpacity={on > 0 ? 0.25 + 0.75 * on : 1} stroke={base} strokeWidth={3} style={{ filter: on > 0 ? `drop-shadow(0 0 ${8 + 14 * on}px ${lc})` : glow }} />
                {l.label ? <PlanText f={f} at={l.at} x={s.x} y={s.y + 44} text={l.label} size={20} colour={on > 0 ? lc : "#9FB6C8"} /> : null}
              </g>
            );
          })}
          {(p.labels ?? []).map((l, j) => { const s = P(l.x, l.y, l.z); return <PlanText key={`t${j}`} f={f} at={l.at} x={s.x} y={s.y + (l.dy ?? 0)} text={l.text} size={l.size ?? 24} colour={l.colour ?? "#CFE6FA"} />; })}
        </g>
      </svg></PlanCap.Provider>
    </AbsoluteFill>
  );
};

export const IsoBlueprint: React.FC<IsoBlueprintProps> = (p) => {
  const f = useCurrentFrame();
  const fast = p.cam ? camFast(f, toKeys(p.cam), 0.05, 0.5) : false;
  const u = p.unit ?? 40, o = p.origin ?? { x: 960, y: 380 };
  const c = camOf(f, p.cam0, p.cam ?? [], p.drift ?? 0.008);
  return (
    <AbsoluteFill style={{ background: p.palette === "line" ? "#000" : BLUEPRINT_BG, overflow: "hidden" }}>
      <GridPlate iso o={p.palette === "line" ? 0 : 0.05} />
      <MBlur on={fast}><Scene {...p} /></MBlur>
      {(p.tags ?? []).map((t, i) => { const w = iso(o, u, t.x, t.y, t.z), s = toScreen(c, w.x, w.y); return <HudBox key={i} k={f - t.at} p={s} elbow={{ x: s.x + (t.dx ?? 140), y: s.y + (t.dy ?? -160) }} dir={(t.dx ?? 140) < 0 ? -1 : 1} text={t.text} cap={Math.max(28, p.labelCap ?? 34)} />; })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const ISO_DEMO: IsoBlueprintProps = {
  unit: 40, origin: { x: 960, y: 330 },
  parts: [
    { kind: "line", pts: [[-1, -1, 0], [15, -1, 0], [15, 11, 0], [-1, 11, 0], [-1, -1, 0]], at: 0, drawFrames: 16, width: 3 },
    { kind: "box", id: "pool", x: 0, y: 0, z: -2.5, w: 14, d: 10, h: 2.5, at: 4, drawFrames: 16, fill: "water" },
    { kind: "box", id: "plant", x: 17, y: 0, z: 0, w: 7, d: 6, h: 5, at: 26, fill: "solid" },
    { kind: "box", id: "ctrl", x: 24, y: 1.2, z: 1.4, w: 0.6, d: 2, h: 2.2, at: 34, fill: "solid" },
    { kind: "line", pts: [[18, 8.5, 1], [15.6, 8.5, 1], [15.6, 8.5, 0.2], [14, 8.5, 0.2]], at: 36, width: 5 },
    { kind: "line", pts: [[20, 7.5, 1.2], [20, 6, 1.2], [20, 6, 2]], at: 38, width: 5 },
    { kind: "box", id: "skid", x: 18, y: 7.5, z: 0, w: 4.5, d: 2, h: 2, at: 30, fill: "solid", recolour: { at: 128 }, crack: { at: 132 } },
  ],
  vapour: [{ x: 1, y: 1, z: 0, w: 12, d: 8, at: 46, n: 30, rise: 4.5 }],
  lamps: [{ x: 24.6, y: 2.2, z: 2.6, at: 34, label: "ALARM", state: "dark", flickerAt: 72 }],
  labels: [{ x: 7, y: 5, z: 0, text: "POOL", at: 14, dy: 10 }, { x: 20.5, y: 3, z: 5, text: "PLANT ROOM", at: 30, dy: -18 }],
  tags: [{ x: 20.2, y: 9.5, z: 2, text: "installed incorrectly", at: 132, dx: -150, dy: -230 }],
  cam0: { cx: 1150, cy: 600, s: 1.18 },
  cam: [{ at: 96, d: 40, cx: 1300, cy: 620, s: 1.4, ease: "quick" }],
  drift: 0.008,
};
