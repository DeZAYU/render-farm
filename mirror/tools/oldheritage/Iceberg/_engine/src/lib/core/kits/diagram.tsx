// PROMOTED to core (was src/templates/diagram/kit.tsx); shared by several families. Import as "../../core/kits/diagram".
// Line-art cross-section KIT (generalised from wp3 sec_A World / PoolDiagram / CannonDiagram / IgnDiagram + sec_B WorldB / CausePicto /
// SpreadDiagram). One world plane of 1920 x 1080 units, drawn in white glowing strokes (FA evidence E1: white glyphs, 20-30 px glow), viewed
// by a camera (VV §11 world-plane infographic: quick-start / long-settle phases, log zoom). Everything is configurable: the Scene says WHERE the
// ground, pit, stage, crowd, emitters and cloud are; the variants say WHEN each element appears (local frames on their nouns).
// The Waterpark stage/pool/crowd is only the demo default (DEMO_SCENE). Particle systems are seeded and deterministic; no array is indexed by
// a raw (fractional) frame.
import React from "react";
import { H, W, EZ, PP_PATH, camAt, clamp01, lerp, rng, type Cam, type CamKey } from "../index";

export type Scene = {
  ground: number; // ground line y (units)
  pit?: { x0: number; x1: number; floor: number; inset?: number; hatch?: boolean }; // drained pool / trench / pit
  stage?: { x0: number; x1: number; deck: number; trussX0: number; trussX1: number; trussTop: number; lamps: number[]; booth?: boolean };
  crowd?: { x0: number; x1: number; floor: number; seed?: number; rows?: number; dx?: number; px?: number };
  emitters?: { x: number }[]; // pixel-person operators with a cannon + cylinder, standing on the stage deck
  cloud?: { cx: number; cy: number; rx: number; ry: number; n?: number; seed?: number };
  palette?: string[]; // particle colours (powder, smoke, water...)
};
export const POWDER = ["#FF2BD6", "#2BC8FF", "#FFE21F", "#3DF201", "#FF6A1F", "#B45CFF"];
export const FLAME = (burn: number, i: number) => (burn < 0.12 ? "#FFF2B8" : burn < 0.4 ? "#FFB224" : burn < 0.75 ? "#FF6A16" : i % 3 ? "#F2400F" : "#FF8A1E");
export const LINE = "#FDFCFD";
export const LINE_GLOW = "drop-shadow(0 0 3px rgba(255,255,255,.8)) drop-shadow(0 0 16px rgba(255,255,255,.28))";

export const DEMO_SCENE: Scene = {
  ground: 640,
  pit: { x0: 640, x1: 1800, floor: 820, inset: 20, hatch: true },
  stage: { x0: 110, x1: 570, deck: 560, trussX0: 150, trussX1: 530, trussTop: 250, lamps: [250, 340, 430], booth: true },
  crowd: { x0: 640, x1: 1800, floor: 820, seed: 77 },
  emitters: [{ x: 196 }, { x: 440 }],
  cloud: { cx: 1210, cy: 470, rx: 560, ry: 120, n: 640, seed: 424242 },
  palette: POWDER,
};

// ---------------------------------------------------------------- camera (props-friendly keys: ease by name)
export type CamSpec = { at: number; d: number; cx: number; cy: number; s: number; ease?: keyof typeof EZ };
export const toKeys = (c: CamSpec[]): CamKey[] => c.map((k) => ({ f: k.at, d: k.d, to: { cx: k.cx, cy: k.cy, s: k.s }, e: EZ[k.ease ?? "quick"] }));
export const camOf = (f: number, c0: Cam, spec: CamSpec[], driftPerS = 0) => {
  const c = camAt(f, c0, toKeys(spec));
  return { ...c, s: c.s * Math.exp(driftPerS * (Math.max(0, f) / 30)) };
};
export const toScreen = (c: Cam, x: number, y: number) => ({ x: (x - c.cx) * c.s + W / 2, y: (y - c.cy) * c.s + H / 2 });
export const worldTf = (c: Cam) => `translate(${W / 2} ${H / 2}) scale(${c.s.toFixed(5)}) translate(${(-c.cx).toFixed(3)} ${(-c.cy).toFixed(3)})`;
/** the dark plate every cross-section sits on (faint teal floor light) */
export const PLATE_BG = "radial-gradient(ellipse 70% 60% at 50% 60%, #0d1416 0%, #000 75%)";

// ---------------------------------------------------------------- structure: ground, pit, stage (with lamp heat)
export const Structure: React.FC<{ scene: Scene; ground?: number; pit?: number; stage?: number; heat?: number }> = ({ scene, ground = 1, pit = 1, stage = 1, heat = 0 }) => {
  const P = scene.pit, S = scene.stage, G = scene.ground;
  const ins = P?.inset ?? 20;
  const pitLen = P ? 2 * Math.hypot(ins, P.floor - G) + (P.x1 - P.x0 - 2 * ins) : 0;
  return (
    <g style={{ filter: LINE_GLOW }} stroke={LINE} fill="none" strokeLinejoin="round">
      {ground > 0 ? (
        <path d={P ? `M 0 ${G} L ${P.x0} ${G} M ${P.x1} ${G} L 1920 ${G}` : `M 0 ${G} L 1920 ${G}`} strokeWidth={4} opacity={ground} />
      ) : null}
      {P && pit > 0 ? (
        <path d={`M ${P.x0} ${G} L ${P.x0 + ins} ${P.floor} L ${P.x1 - ins} ${P.floor} L ${P.x1} ${G}`} strokeWidth={5} strokeDasharray={`${(pitLen * pit).toFixed(1)} ${pitLen + 2}`} />
      ) : null}
      {P && P.hatch !== false && pit >= 1
        ? Array.from({ length: Math.floor((P.x1 - P.x0 - 2 * ins - 20) / 28) }, (_, i) => <path key={i} d={`M ${P.x0 + ins + 10 + i * 28} ${P.floor + 8} l -16 22`} strokeWidth={2} opacity={0.6} />)
        : null}
      {S && stage > 0 ? <g opacity={stage}><Truss s={S} ground={G} heat={heat} /></g> : null}
    </g>
  );
};
const Truss: React.FC<{ s: NonNullable<Scene["stage"]>; ground: number; heat: number }> = ({ s, ground, heat }) => {
  const a = s.trussX0, b = s.trussX1, t = s.trussTop, w = 22, bays = Math.max(4, Math.round((b - a) / 29));
  const bw = (b - a) / bays, vN = Math.max(3, Math.floor((s.deck - t - w) / 24));
  return (
    <g>
      <g strokeWidth={4}>
        <rect x={s.x0} y={s.deck} width={s.x1 - s.x0} height={ground - s.deck} fill="#0b0b0b" />
        <path d={`M ${a} ${s.deck} L ${a} ${t} M ${a + w} ${s.deck} L ${a + w} ${t} M ${b - w} ${s.deck} L ${b - w} ${t} M ${b} ${s.deck} L ${b} ${t} M ${a} ${t} L ${b} ${t} M ${a} ${t + w} L ${b} ${t + w}`} />
        {Array.from({ length: bays }, (_, i) => <path key={i} d={`M ${a + i * bw} ${t} L ${a + (i + 0.5) * bw} ${t + w} L ${a + (i + 1) * bw} ${t}`} strokeWidth={2} />)}
        {Array.from({ length: vN }, (_, i) => <path key={`v${i}`} d={`M ${a} ${t + w + i * 24} L ${a + w} ${t + w + 12 + i * 24} M ${b - w} ${t + w + i * 24} L ${b} ${t + w + 12 + i * 24}`} strokeWidth={2} />)}
        {s.booth ? <rect x={(s.x0 + s.x1) / 2 - 40} y={s.deck - 44} width={84} height={44} /> : null}
      </g>
      {s.lamps.map((x) => (
        <g key={x} transform={`translate(${x} ${t + 32}) rotate(-38)`}>
          <rect x={-16} y={0} width={32} height={46} rx={4} fill={heat > 0 ? `rgba(255,${Math.round(150 - 90 * heat)},40,${(0.25 + 0.75 * heat).toFixed(2)})` : "#0b0b0b"} stroke={heat > 0 ? "#FFB347" : LINE} strokeWidth={4} />
          <path d="M -20 46 L 20 46" stroke={heat > 0 ? "#FFE6A8" : LINE} strokeWidth={6} />
        </g>
      ))}
    </g>
  );
};
export const lampPoint = (scene: Scene, i: number) => {
  const S = scene.stage!;
  const x = S.lamps[Math.max(0, Math.min(S.lamps.length - 1, i))];
  return { x, y: S.trussTop + 50 };
};

// ---------------------------------------------------------------- crowd of pixel people (FA pixel person), 3 depth rows
export type Person = { x: number; y: number; px: number; row: number; t: number; c: string };
export const makeCrowd = (scene: Scene): Person[] => {
  const C = scene.crowd;
  if (!C) return [];
  const pal = scene.palette ?? POWDER;
  const r = rng(C.seed ?? 77);
  const px = C.px ?? 4.8, dx = C.dx ?? 27;
  const rows = [{ px: px * 0.875, y: C.floor - 6, dx: dx * 0.85, o: 2 }, { px, y: C.floor, dx, o: 1 }, { px: px * 1.125, y: C.floor + 6, dx: dx * 1.15, o: 0 }].slice(0, C.rows ?? 3);
  const out: Person[] = [];
  rows.forEach((rw, ri) => {
    for (let x = C.x0 + 34 + ri * 6; x < C.x1 - 36; x += rw.dx) out.push({ x: x + (r() - 0.5) * 6, y: rw.y - 13 * rw.px + (r() - 0.5) * 4, px: rw.px, row: rw.o, t: r(), c: pal[Math.floor(r() * pal.length)] });
  });
  return out;
};
/** fill = 0..1 share of people shown (in seeded order); tint(x) = 0..1 how much powder they wear; run = 0..1 flight away from the stage;
 *  burntBefore = people left of this x take flame colours; opacity = overall */
export const Crowd: React.FC<{ f: number; scene: Scene; people: Person[]; uid: string; fill?: number; tint?: (x: number) => number; run?: number; runMax?: number; burntBefore?: number; opacity?: number }> = ({
  f, scene, people, uid, fill = 1, tint, run = 0, runMax = 300, burntBefore = -1, opacity = 1,
}) => {
  const C = scene.crowd;
  if (!C) return null;
  return (
    <g opacity={opacity}>
      <defs><path id={`${uid}pp`} d={PP_PATH} /></defs>
      {people.map((p, i) => {
        if (p.t > fill) return null;
        const room = (C.x1 - 40 - p.x) / (C.x1 - C.x0);
        const dx = run * Math.min(runMax * 0.87, runMax * (1 - (p.x - C.x0) / (C.x1 - C.x0))) * (0.6 + 0.4 * p.t);
        const x = run > 0 ? Math.min(C.x1 - 44 - (2 - p.row) * 6 - (i % 5) * 4, p.x + dx * Math.max(0.15, Math.min(1, room * 3))) : p.x;
        const hop = run > 0.02 ? Math.abs(Math.sin(f * 0.55 + p.t * 9)) * 2.2 * p.px * run : 0;
        const tk = tint ? tint(p.x) : 0;
        const burnt = burntBefore > 0 && x < burntBefore - 10;
        const base = p.row === 2 ? 0.45 : p.row === 1 ? 0.7 : 1;
        const col = burnt ? FLAME(0.5 + 0.3 * Math.sin(i), i) : tk > 0.02 ? p.c : LINE;
        const o = base * (burnt ? 0.9 : tk > 0.02 ? 0.55 + 0.45 * (1 - tk * 0.4) : 1);
        return <use key={i} href={`#${uid}pp`} transform={`translate(${x.toFixed(1)} ${(p.y - hop).toFixed(1)}) scale(${p.px})`} fill={col} opacity={o.toFixed(3)} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- operators with cannon + cylinder on the stage deck
const WPX = 6;
export const nozzle = (scene: Scene, i: number) => {
  const e = scene.emitters?.[i];
  const deck = scene.stage?.deck ?? scene.ground;
  return e ? { x: e.x + 120, y: deck - 13 * WPX - 4 } : { x: 0, y: 0 };
};
export const cylinderPoint = (scene: Scene, i: number) => {
  const e = scene.emitters?.[i];
  const deck = scene.stage?.deck ?? scene.ground;
  return e ? { x: e.x - 46, y: deck - 13 * WPX + 30 } : { x: 0, y: 0 };
};
export const Operators: React.FC<{ scene: Scene; k?: number; spray?: number; co2?: number }> = ({ scene, k = 99, spray = 99, co2 = 99 }) => {
  if (k < 0) return null;
  const deck = scene.stage?.deck ?? scene.ground;
  return (
    <g style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,.8)) drop-shadow(0 0 14px rgba(255,255,255,.3))" }}>
      {(scene.emitters ?? []).map(({ x }) => {
        const y = deck - 13 * WPX;
        return (
          <g key={x} opacity={clamp01(k / 4)}>
            <path d={PP_PATH} transform={`translate(${x} ${y}) scale(${WPX})`} fill={LINE} />
            {spray >= 0 ? (
              <g stroke={LINE} fill="none" strokeLinecap="round" opacity={clamp01(spray / 3)}>
                <path d={`M ${x + 30} ${y + 34} L ${x + 120} ${y - 4}`} strokeWidth={12} />
                <path d={`M ${x + 40} ${y + 32} C ${x + 14} ${y + 90} ${x - 40} ${y + 96} ${x - 46} ${y + 50}`} strokeWidth={4} />
              </g>
            ) : null}
            {co2 >= 0 ? (
              <g opacity={clamp01(co2 / 3)}>
                <rect x={x - 62} y={y + 8} width={32} height={70} rx={12} fill="#0b0b0b" stroke={LINE} strokeWidth={5} />
                <rect x={x - 53} y={y - 4} width={14} height={12} fill={LINE} />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- plume from every nozzle (k = frames since spraying started)
type PlumePt = { b: number; vx: number; vy: number; c: number; r: number; w: number };
export const makePlume = (scene: Scene, n = 420, seed = 5150): PlumePt[] => {
  const r = rng(seed), E = Math.max(1, scene.emitters?.length ?? 1);
  return Array.from({ length: n }, (_, i) => ({ b: r() * 112, vx: 13 + r() * 13, vy: -2.5 + r() * 4, c: i, r: 3 + r() * 6, w: i % E }));
};
export const Plume: React.FC<{ scene: Scene; pts: PlumePt[]; k: number; life?: number; gravity?: number; dir?: number }> = ({ scene, pts, k, life = 60, gravity = 0.11, dir = 1 }) => {
  if (k < 0) return null;
  const pal = scene.palette ?? POWDER;
  return (
    <g style={{ filter: "blur(1.2px)" }}>
      {pts.map((p, i) => {
        const n = nozzle(scene, p.w);
        const a = k - p.b * (p.w ? 1 : 0.94);
        if (a < 0 || a > life) return null;
        const x = n.x + dir * p.vx * a, y = n.y + p.vy * a + gravity * a * a * 0.5;
        const o = clamp01(a / 3) * (1 - clamp01((a - life * 0.66) / (life * 0.34)));
        return <circle key={i} cx={x} cy={y} r={p.r * (1 + a / 30)} fill={pal[p.c % pal.length]} opacity={(0.75 * o).toFixed(3)} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- the hanging cloud (k presence, dense contraction, ign = frames since the front left `src`)
type CloudPt = { x: number; y: number; r: number; c: number; dx: number; dy: number };
export const makeCloud = (scene: Scene): CloudPt[] => {
  const C = scene.cloud;
  if (!C) return [];
  const r = rng(C.seed ?? 424242);
  return Array.from({ length: C.n ?? 640 }, (_, i) => {
    const a = r() * Math.PI * 2, rr = Math.sqrt(r());
    return { x: C.cx + Math.cos(a) * rr * C.rx, y: C.cy + Math.sin(a) * rr * C.ry + (r() - 0.5) * 40, r: 3 + r() * 4, c: i, dx: (r() - 0.5) * 2, dy: (r() - 0.5) * 2 };
  });
};
export const Cloud: React.FC<{ f: number; scene: Scene; pts: CloudPt[]; uid: string; k: number; dense?: number; ign?: number; src?: { x: number; y: number }; speed?: number; fade?: number }> = ({
  f, scene, pts, uid, k, dense = 0, ign = -1, src = { x: 0, y: 0 }, speed = 1, fade = 1,
}) => {
  const C = scene.cloud;
  if (!C || k <= 0 || fade <= 0) return null;
  const pal = scene.palette ?? POWDER;
  const N = pts.length, base = Math.round(N * 0.47);
  const R = ign < 0 ? -1 : 1500 * EZ.in3(clamp01((ign * speed) / 34)) + 40 * clamp01((ign * speed) / 4);
  const nVis = Math.round(lerp(base, N, dense) * k);
  const sx = lerp(1, 0.62, dense), sy = lerp(1, 0.78, dense);
  return (
    <g opacity={fade}>
      <defs>
        <radialGradient id={`${uid}fl`}><stop offset="0%" stopColor="#FFC24A" /><stop offset="40%" stopColor="#FF6A14" /><stop offset="100%" stopColor="rgba(200,24,8,0)" /></radialGradient>
      </defs>
      {ign >= 0 ? <ellipse cx={C.cx} cy={C.cy} rx={C.rx * 1.1} ry={C.ry * 1.6} fill={`url(#${uid}fl)`} opacity={clamp01((ign * speed - 14) / 16) * 0.9} style={{ filter: "blur(30px)" }} /> : null}
      <g style={{ filter: "blur(0.6px)" }}>
        {pts.slice(0, nVis).map((p, i) => {
          const x = C.cx + (p.x - C.cx) * sx + p.dx * Math.sin((f + i) / 17) * 3, y = C.cy + (p.y - C.cy) * sy + p.dy * Math.cos((f + i) / 19) * 3;
          const d = Math.hypot(x - src.x, y - src.y);
          const burn = R < 0 ? 0 : clamp01((R - d) / 260);
          const col = burn > 0 ? FLAME(burn, i) : pal[p.c % pal.length];
          const fl = burn > 0 ? 0.72 + 0.28 * Math.sin(f * 1.9 + i * 2.3) : 1;
          const o = (0.35 + 0.45 * k) * (i < base ? 1 : clamp01((dense - (i - base) / (N - base)) * 3)) * (burn > 0 ? fl : 0.85);
          return <circle key={i} cx={x} cy={y} r={p.r * (1 + 1.1 * Math.min(1, burn * 3))} fill={col} opacity={o.toFixed(3)} />;
        })}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- heat lines from the lamps into the cloud (k = frames since "heat")
export const HeatLines: React.FC<{ f: number; scene: Scene; k: number; to?: { x: number; y: number } }> = ({ f, scene, k, to }) => {
  const S = scene.stage, C = scene.cloud;
  if (k < 0 || !S) return null;
  const T = to ?? (C ? { x: C.cx - C.rx * 0.8, y: C.cy - 40 } : { x: S.x1 + 200, y: S.trussTop + 150 });
  return (
    <g fill="none" stroke="#FFB347" strokeWidth={4} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(255,179,71,.9)) drop-shadow(0 0 14px rgba(255,120,40,.5))" }}>
      {S.lamps.map((lx, j) => {
        const p = clamp01((k - j * 3) / 14);
        const x0 = lx + 34, y0 = S.trussTop + 80, x1 = T.x + j * 40, y1 = T.y + j * 18;
        const pts = Array.from({ length: 24 }, (_, i) => {
          const u = (i / 23) * p, nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny);
          const w = Math.sin(u * 14 - f * 0.45 + j) * 9;
          return `${(x0 + (x1 - x0) * u + (nx / nl) * w).toFixed(1)},${(y0 + (y1 - y0) * u + (ny / nl) * w).toFixed(1)}`;
        }).join(" ");
        return <polyline key={lx} points={pts} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- kicked-up particles from running feet + floor fire front
type KickPt = { p: number; t: number; vx: number; vy: number; r: number; c: number };
export const makeKick = (n = 300, seed = 9090): KickPt[] => {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => ({ p: Math.floor(r() * 140), t: r(), vx: (r() - 0.5) * 1.6, vy: 1.0 + r() * 2.2, r: 2.5 + r() * 4, c: i }));
};
export const Kicked: React.FC<{ f: number; scene: Scene; people: Person[]; pts: KickPt[]; k: number; run: number; front: number }> = ({ f, scene, people, pts, k, run, front }) => {
  const C = scene.crowd;
  if (!C || k <= 0 || !people.length) return null;
  const pal = scene.palette ?? POWDER;
  return (
    <g style={{ filter: "blur(1px)" }}>
      {pts.map((q, i) => {
        const pers = people[(q.p * 7) % people.length];
        const a = k * 70 - q.t * 40;
        if (a <= 0) return null;
        const x0 = pers.x + run * 120 * (1 - (pers.x - C.x0) / (C.x1 - C.x0)) * 0.6;
        const x = x0 + q.vx * a + Math.sin((f + i) / 11) * 3, y = C.floor - 8 - q.vy * a + 0.012 * a * a;
        const burn = front > 0 ? clamp01((front - x) / 260) : 0;
        const o = clamp01(a / 4) * 0.62 * (burn > 0 ? 0.72 + 0.28 * Math.sin(f * 1.9 + i * 2.3) : 1);
        return <circle key={i} cx={x} cy={Math.min(C.floor - 4, y)} r={q.r * (1 + a / 90) * (1 + 0.8 * Math.min(1, burn * 3))} fill={burn > 0 ? FLAME(burn, i) : pal[q.c % pal.length]} opacity={o.toFixed(3)} />;
      })}
    </g>
  );
};
type FirePt = { x: number; h: number; r: number; ph: number };
export const makeFloorFire = (scene: Scene, n = 520, seed = 31337): FirePt[] => {
  const C = scene.pit ?? (scene.crowd ? { x0: scene.crowd.x0, x1: scene.crowd.x1 } : { x0: 0, x1: 1920 });
  const r = rng(seed);
  return Array.from({ length: n }, () => ({ x: C.x0 + 20 + r() * (C.x1 - C.x0 - 40), h: r(), r: 3 + r() * 6, ph: r() * 6.28 }));
};
export const FloorFire: React.FC<{ f: number; scene: Scene; pts: FirePt[]; uid: string; x1: number; floorY?: number; x0?: number }> = ({ f, scene, pts, uid, x1, floorY, x0 }) => {
  const fy = floorY ?? scene.pit?.floor ?? scene.ground;
  const left = x0 ?? (scene.pit ? scene.pit.x0 + 20 : 0);
  if (x1 <= left) return null;
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}ff`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="rgba(242,64,15,.55)" /><stop offset="0.85" stopColor="rgba(255,106,22,.55)" /><stop offset="1" stopColor="rgba(255,242,184,.8)" /></linearGradient>
      </defs>
      <rect x={left} y={fy - 170} width={Math.max(0, x1 - left)} height={170} fill={`url(#${uid}ff)`} style={{ filter: "blur(26px)" }} />
      <g style={{ filter: "blur(0.6px)" }}>
        {pts.map((q, i) => {
          if (q.x > x1) return null;
          const behind = clamp01((x1 - q.x) / 420);
          const y = fy - 6 - q.h * (50 + 150 * (0.35 + 0.65 * Math.abs(Math.sin(f * 0.21 + q.ph)))) * (0.5 + 0.5 * (1 - behind * 0.5));
          const o = (0.6 + 0.4 * Math.sin(f * 1.9 + i * 2.3)) * (q.x > x1 - 40 ? 1 : 0.85);
          return <circle key={i} cx={q.x} cy={y} r={q.r * (1 + 0.6 * (1 - behind))} fill={FLAME(behind, i)} opacity={o.toFixed(3)} />;
        })}
      </g>
    </g>
  );
};

/** D3 E5 stat over a diagram: white number rolls up (FA text R9) + red word rises in on its own word */
export const DiagramStat: React.FC<{ f: number; value: number; prefix?: string; word: string; at: number; wordAt: number; y?: number; cap?: number }> = ({ f, value, prefix = "", word, at, wordAt, y = 120, cap = 0.075 * H }) => {
  const k = f - at;
  if (k < 0) return null;
  const a = k < 5 ? lerp(0.19, 0.82, k / 5) : k < 9 ? lerp(0.82, 0.77, (k - 5) / 4) : k < 20 ? lerp(0.77, 1, (k - 9) / 11) : 1;
  const ny = 8 * (1 - EZ.out3(k / 15));
  const n = Math.round(value * EZ.out3((k + 1) / 8));
  const wk = f - wordAt;
  const wo = wk < 0 ? 0 : lerp(0.2, 0.99, EZ.out3(wk / 21));
  const wy = 46 * (1 - EZ.out3(wk / 21));
  const fsz = cap / 0.727;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: W, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 24 }}>
      <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: fsz, color: "#F2F2F2", opacity: a, transform: `translateY(${ny.toFixed(1)}px)`, textShadow: "0 4px 10px rgba(0,0,0,.6)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{prefix}{n.toLocaleString("en-US")}</div>
      <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: fsz, color: "#E30A10", opacity: wo, transform: `translateY(${wy.toFixed(1)}px)`, textShadow: "0 0 14px rgba(227,10,16,.55), 0 4px 10px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{word}</div>
    </div>
  );
};

// ================================================================ PLAN / BLUEPRINT helpers (IsoBlueprint, FloorPlan, RoofPonding, TopDownFlow, map ParkPlan)
export type P2 = { x: number; y: number };
/** Catmull-Rom through points (closed or open), n samples per segment */
export const smoothPts = (pts: P2[], closed = true, n = 12): P2[] => {
  const N = pts.length;
  if (N < 3) return pts.slice();
  const out: P2[] = [];
  const segs = closed ? N : N - 1;
  const at = (i: number) => (closed ? pts[((i % N) + N) % N] : pts[Math.max(0, Math.min(N - 1, i))]);
  for (let s = 0; s < segs; s++) {
    const p0 = at(s - 1), p1 = at(s), p2 = at(s + 1), p3 = at(s + 2);
    for (let i = 0; i < n; i++) {
      const t = i / n, t2 = t * t, t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      out.push({ x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  if (!closed) out.push(pts[N - 1]);
  return out;
};
export const ptsD = (pts: P2[], closed = false) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + (closed ? " Z" : "");
/** cumulative arc length table */
export const arcTable = (pts: P2[], closed = false) => {
  const cum = [0];
  const P = closed ? [...pts, pts[0]] : pts;
  for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y));
  return { P, cum, total: cum[cum.length - 1] };
};
/** point + tangent angle (rad) at arc length s (wraps when closed) */
export const pointAt = (t: { P: P2[]; cum: number[]; total: number }, s: number, wrap = true) => {
  const L = wrap ? ((s % t.total) + t.total) % t.total : Math.max(0, Math.min(t.total, s));
  let lo = 0, hi = t.cum.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (t.cum[m] <= L) lo = m; else hi = m; }
  const a = t.P[lo], b = t.P[hi], seg = Math.max(1e-6, t.cum[hi] - t.cum[lo]);
  const u = (L - t.cum[lo]) / seg;
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, ang: Math.atan2(b.y - a.y, b.x - a.x) };
};
export const centroid = (pts: P2[]) => ({ x: pts.reduce((a, p) => a + p.x, 0) / pts.length, y: pts.reduce((a, p) => a + p.y, 0) / pts.length });
/** red 45-degree hatch pattern (put inside <defs>) */
export const HatchDef: React.FC<{ id: string; colour?: string; gap?: number; w?: number }> = ({ id, colour = "#FF1A1A", gap = 16, w = 4 }) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={gap} height={gap} patternTransform="rotate(45)">
    <rect width={gap} height={gap} fill="rgba(255,26,26,.12)" />
    <line x1={0} y1={0} x2={0} y2={gap} stroke={colour} strokeWidth={w} />
  </pattern>
);
/** legibility context for PlanText (M-024 cap audit): when a variant provides it, every PlanText is sized in SCREEN cap px
 *  (cap * size / 26, never below 28 px) and divided by the current camera scale, so labels stay readable at any zoom. */
export const PlanCap = React.createContext<{ cap: number; scale: number } | null>(null);
/** plan label in world units (SVG text, Inter), fades 6 f from `at`; caps tracked like Farrell plan labels */
export const PlanText: React.FC<{ f: number; at: number; x: number; y: number; text: string; size?: number; colour?: string; weight?: number; anchor?: "start" | "middle" | "end"; track?: number; glow?: boolean }> = ({
  f, at, x, y, text, size = 26, colour = "#F4F6F6", weight = 700, anchor = "middle", track = 0.12, glow = true,
}) => {
  const ctx = React.useContext(PlanCap);
  const k = f - at;
  if (k < 0) return null;
  const fsz = ctx ? Math.max(28, (ctx.cap * size) / 26) / 0.727 / Math.max(0.05, ctx.scale) : size;
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily="Inter" fontWeight={weight} fontSize={fsz} letterSpacing={`${track}em`} fill={colour} opacity={EZ.out2(k / 6)}
      style={{ filter: glow ? "drop-shadow(0 2px 6px rgba(0,0,0,.85))" : undefined }}>{text}</text>
  );
};
/** blueprint grid plate (screen space) */
export const BLUEPRINT_BG = "radial-gradient(ellipse 75% 70% at 50% 45%, #0B1A26 0%, #03080D 82%)";
export const GridPlate: React.FC<{ step?: number; o?: number; iso?: boolean }> = ({ step = 48, o = 0.06, iso = false }) => (
  <div style={{ position: "absolute", inset: 0, opacity: o, backgroundImage: iso
    ? `repeating-linear-gradient(30deg, #9CD3FF 0 1px, transparent 1px ${step}px), repeating-linear-gradient(150deg, #9CD3FF 0 1px, transparent 1px ${step}px)`
    : `repeating-linear-gradient(0deg, #9CD3FF 0 1px, transparent 1px ${step}px), repeating-linear-gradient(90deg, #9CD3FF 0 1px, transparent 1px ${step}px)` }} />
);
