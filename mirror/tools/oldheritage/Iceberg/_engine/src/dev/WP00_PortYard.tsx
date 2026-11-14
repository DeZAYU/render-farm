// WP00 (intro): PortYard — owner 4 Nov: same family as TOR00/ND00/TP00 (3-D move through the video's real case clips) but a NEW idea
// that suits workplaces. A container port yard at dusk: rows of stacked shipping containers (corrugated, painted, tier seams, door ends),
// asphalt with yellow lane lines, floodlight masts, ship-to-shore crane silhouettes on the horizon. The case clips are screens bolted
// to the container walls. The camera moves like a yard crane: it tracks along the stacks and rises/lowers tier by tier to one hero
// clip per VO beat (~70 % of frame), cranes up and back to show the whole yard ("every one of them"), swoops down over the front row
// into the aisle behind it to a clip high on a stack ("near the top"), then lowers along the aisle to a clip at ground level ("the further
// down it goes"). Path = pathAt (monotone cubic Hermite, from TOR00_ClipField) on x/y/z plus a second track for pitch + focus distance.
// Depth of field (blur by distance from the focus), light falloff, per-face shading; motion blur + grain are added by the case file.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { pathAt, type Key } from "./TOR00_ClipField";

export const CH = 158, CL = 740, CD = 148, SX = 800; // container height / length / depth; stack pitch along x
export const ROWS = [0, -1100, -2200, -3300, -4400];  // stack centre z per row (row 0 faces the camera aisle)
const P = 1000, PW = 640, PH = 360;
const LIVE = 1500; // panels closer than this play video

export type Tex = { src: string; still?: boolean; len?: number; fit?: boolean; at?: number; q?: number };
export type Stack = { row: number; i: number; tiers: number; cols: string[]; panel?: { tex: Tex; tier: number; id: string } };
/** a hero's panel centre in world space */
export const panelPos = (row: number, i: number, tier: number) => ({ x: i * SX, y: -(tier + 1.5) * CH, z: ROWS[row] + CD / 2 + 3 });

const COLS = ["#6a2c24", "#28405a", "#34513a", "#78572e", "#46494e", "#5a2529", "#8f8a7f", "#29364a", "#7a3b28", "#3a5860"]; // weathered paint
const rnd = (n: number) => { const x = Math.sin(n * 91.345 + 12.7) * 43758.5453; return x - Math.floor(x); };

/** build the yard: fixed tiers where heroes/clearances need them, the rest pseudo-random; fillers go on free stacks >= 3 tiers */
export const buildYard = (fixed: Record<string, { tiers: number; panel?: { tex: Tex; tier: number; id: string } }>, fillers: Tex[], i0 = -6, i1 = 8): Stack[] => {
  const out: Stack[] = []; let fk = 0;
  ROWS.forEach((_, row) => {
    for (let i = i0; i <= i1; i++) {
      const k = `${row}:${i}`, seed = row * 31 + i * 7 + 100;
      const fx = fixed[k];
      const tiers = fx ? fx.tiers : 1 + Math.floor(rnd(seed) * (row === 0 ? 4 : 6));
      const cols = Array.from({ length: tiers }, (_, t) => COLS[Math.floor(rnd(seed * 3 + t * 11) * COLS.length)]);
      let panel = fx?.panel;
      if (!fx && tiers >= 3 && fk < fillers.length && rnd(seed + 5) < (row === 0 ? 0.75 : 0.62)) {
        panel = { tex: fillers[fk], tier: Math.floor(rnd(seed + 9) * (tiers - 2)), id: "f" + fk }; fk++;
      }
      out.push({ row, i, tiers, cols, panel });
    }
  });
  return out;
};

/** the clip on a panel: vertical sources are shown whole over a blurred, cover-filled copy of themselves */
const PanelTex: React.FC<{ t: Tex; live: boolean }> = ({ t, live }) => {
  const cover: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" };
  const contain: React.CSSProperties = { ...cover, objectFit: "contain" };
  const blurred: React.CSSProperties = { ...cover, filter: "blur(18px) brightness(.55)", transform: "scale(1.15)" };
  // memory: only panels near the camera decode video; the rest show a poster frame (<clip>_p.jpg)
  if (!t.still && !live) t = { ...t, src: t.src.replace(/\.mp4$/, "_p.jpg"), still: true };
  if (t.still) return <>{t.fit ? <Img src={staticFile(t.src)} style={blurred} /> : null}<Img src={staticFile(t.src)} style={t.fit ? contain : cover} /></>;
  const L = Math.max(30, Math.round((t.len ?? 3) * 30) - 2);
  const want = t.q !== undefined ? Math.round(t.q * 30) : 0, at = t.at ?? 0, k = (((want - at) % L) + L) % L;
  const v = (st: React.CSSProperties) => (
    <Sequence from={-k} layout="none"><Loop durationInFrames={L} layout="none"><OffthreadVideo src={staticFile(t.src)} muted style={st} /></Loop></Sequence>
  );
  return <>{t.fit ? v(blurred) : null}{v(t.fit ? contain : cover)}</>;
};

// corrugation + seams as CSS backgrounds (ribs run vertically on the long walls; door ends get a centre seam and lock bars)
const ribs = "repeating-linear-gradient(90deg, rgba(0,0,0,.22) 0 5px, rgba(255,255,255,.07) 5px 9px, rgba(0,0,0,0) 9px 16px)";
const seams = `repeating-linear-gradient(180deg, rgba(255,255,255,.10) 0 3px, rgba(0,0,0,0) 3px ${CH - 7}px, rgba(0,0,0,.6) ${CH - 7}px ${CH}px)`;
const ends = `linear-gradient(90deg, rgba(0,0,0,0) 0 ${CD / 2 - 2}px, rgba(0,0,0,.55) ${CD / 2 - 2}px ${CD / 2 + 2}px, rgba(0,0,0,0) ${CD / 2 + 2}px), repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 22px, rgba(0,0,0,.35) 22px 26px, rgba(0,0,0,0) 26px 37px)`;
const grime = "linear-gradient(180deg, rgba(20,14,10,.0) 0%, rgba(20,14,10,.32) 100%), repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 41px, rgba(60,30,15,.10) 41px 44px)";
const bands = (cols: string[]) => `linear-gradient(0deg, ${cols.map((c, t) => `${c} ${t * CH}px ${(t + 1) * CH}px`).join(", ")})`;

type Look = { blur: number; light: number };
const filt = (lk: Look, shade: number) => `blur(${lk.blur.toFixed(2)}px) brightness(${(lk.light * shade).toFixed(3)})`;

export const PortYard: React.FC<{ stacks: Stack[]; path: Key[]; aim: Key[] }> = ({ stacks, path, aim }) => {
  // aim keys: y = focus distance, z = pitch (deg, negative = looking down); x unused
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const e = pathAt(path, f), a = pathAt(aim, f), focus = a.y, pitch = a.z;
  const e0 = pathAt(path, f - 1), e1 = pathAt(path, f + 1);
  const roll = Math.max(-1.6, Math.min(1.6, (e1.x - e0.x) * 0.012));
  const look = (x: number, y: number, z: number): Look => {
    const d = Math.hypot(x - e.x, y - e.y, z - e.z);
    return { blur: Math.min(9, Math.abs(d - focus) / 230), light: 1 - Math.min(0.66, Math.max(0, (d - 600) / 6500)) };
  };
  const ahead = (z: number) => e.z - z > 60;
  const lateral = (x: number, z: number) => Math.abs(x - e.x) < (e.z - z) * 1.6 + 2600;
  const vis = stacks.filter((s) => ahead(ROWS[s.row] + CD / 2) && lateral(s.i * SX, ROWS[s.row]));
  // ground tiles (asphalt + lane lines in the aisles), culled near/behind the camera
  const tiles: { x: number; z: number }[] = [];
  for (let gx = -6; gx <= 8; gx++) for (let gz = -5; gz <= 4; gz++) { const x = gx * 1100, z = gz * 1100; if (e.z - (z + 550) > 120 && lateral(x, z)) tiles.push({ x, z }); }
  const masts = [-3.5, -0.5, 2.5, 5.5].flatMap((mx, k) => [{ x: mx * SX, z: 560, k }, { x: (mx + 1.5) * SX, z: -1650, k: k + 4 }, { x: (mx + 0.7) * SX, z: -3850, k: k + 8 }]).filter((m) => ahead(m.z) && lateral(m.x, m.z));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0b1220 0%, #1b2231 38%, #4a3427 62%, #1a1714 100%)", overflow: "hidden", perspective: P, perspectiveOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: width / 2, top: height / 2, transformStyle: "preserve-3d",
        transform: `translateZ(${P}px) rotateZ(${roll.toFixed(3)}deg) rotateX(${pitch.toFixed(3)}deg) translate3d(${(-e.x).toFixed(2)}px, ${(-e.y).toFixed(2)}px, ${(-e.z).toFixed(2)}px)` }}>
        {/* horizon: ship-to-shore cranes + a far quay line, a flat backdrop far behind the yard */}
        <div style={{ position: "absolute", left: -16000, top: -5200, width: 32000, height: 5200, transform: "translateZ(-11000px)",
          filter: "blur(2px) brightness(.9)" }}>
          <svg width="32000" height="5200" viewBox="0 0 32000 5200" preserveAspectRatio="none">
            <rect x="0" y="4950" width="32000" height="250" fill="#120f0e" />
            {[9000, 12600, 15200, 18800, 22400].map((cx, k) => (
              <g key={k} fill="#14110f" stroke="#14110f">
                <rect x={cx - 700} y={2200 + (k % 2) * 300} width="120" height={2800 - (k % 2) * 300} />
                <rect x={cx + 580} y={2200 + (k % 2) * 300} width="120" height={2800 - (k % 2) * 300} />
                <rect x={cx - 1900} y={2100 + (k % 2) * 300} width="4200" height="170" />
                <path d={`M${cx - 700} ${2200 + (k % 2) * 300} L${cx - 60} ${1300 + (k % 2) * 300} L${cx + 700} ${2200 + (k % 2) * 300}`} strokeWidth="60" fill="none" />
                <rect x={cx - 640} y={3400} width="1340" height="90" />
                <circle cx={cx - 60} cy={1300 + (k % 2) * 300} r="40" fill="#ff5a3c" stroke="none" opacity={0.85} />
              </g>
            ))}
          </svg>
        </div>
        {tiles.map((t) => {
          const lk = look(t.x, 0, t.z);
          return (
            <div key={`g${t.x}:${t.z}`} style={{ position: "absolute", left: -550, top: -550, width: 1100, height: 1100,
              transform: `translate3d(${t.x}px, 0px, ${t.z}px) rotateX(90deg)`,
              background: `linear-gradient(0deg, rgba(0,0,0,0) 0 ${1100 - 280}px, rgba(214,170,40,.55) ${1100 - 280}px ${1100 - 270}px, rgba(0,0,0,0) ${1100 - 270}px), repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 2px, rgba(0,0,0,0) 2px 47px), #2a2a2d`,
              filter: filt({ blur: Math.min(4, lk.blur * 0.5), light: lk.light }, 0.85) }} />
          );
        })}
        {masts.map((m) => {
          const lk = look(m.x, -1500, m.z);
          return (
            <div key={`m${m.k}`} style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: `translate3d(${m.x}px, 0px, ${m.z}px)` }}>
              <div style={{ position: "absolute", left: -9, top: -1500, width: 18, height: 1500, background: "#2a2b2e", filter: filt(lk, 1) }} />
              <div style={{ position: "absolute", left: -260, top: -1760, width: 520, height: 520, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,214,150,.95) 0%, rgba(255,190,110,.35) 18%, rgba(255,170,90,0) 62%)", filter: `blur(${(lk.blur * 0.5).toFixed(2)}px)` }} />
            </div>
          );
        })}
        {vis.map((s) => {
          const x = s.i * SX, zc = ROWS[s.row], h = s.tiers * CH, lk = look(x, -h / 2, zc + CD / 2);
          const face: React.CSSProperties = { position: "absolute", backgroundBlendMode: "normal" };
          return (
            <div key={`s${s.row}:${s.i}`} style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: `translate3d(${x}px, ${-h / 2}px, ${zc}px)` }}>
              <div style={{ ...face, left: -CL / 2, top: -h / 2, width: CL, height: h, transform: `translateZ(${CD / 2}px)`, background: `${seams}, ${grime}, ${ribs}, ${bands(s.cols)}`, filter: filt(lk, 0.8) + " saturate(.8)" }} />
              <div style={{ ...face, left: -CD / 2, top: -h / 2, width: CD, height: h, transform: `rotateY(-90deg) translateZ(${CL / 2}px)`, background: `${seams}, ${grime}, ${ends}, ${bands(s.cols)}`, filter: filt(lk, 0.5) + " saturate(.8)" }} />
              <div style={{ ...face, left: -CD / 2, top: -h / 2, width: CD, height: h, transform: `rotateY(90deg) translateZ(${CL / 2}px)`, background: `${seams}, ${grime}, ${ends}, ${bands(s.cols)}`, filter: filt(lk, 0.58) + " saturate(.8)" }} />
              <div style={{ ...face, left: -CL / 2, top: -CD / 2, width: CL, height: CD, transform: `rotateX(90deg) translateZ(${h / 2}px)`,
                background: `repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 3px, rgba(0,0,0,0) 3px 26px), ${s.cols[s.cols.length - 1]}`, filter: filt(lk, 0.9) + " saturate(.75)" }} />
            </div>
          );
        })}
        {vis.filter((s) => s.panel).map((s) => {
          const p = panelPos(s.row, s.i, s.panel!.tier), lk = look(p.x, p.y, p.z);
          return (
            <div key={`p${s.panel!.id}`} style={{ position: "absolute", left: -PW / 2, top: -PH / 2, width: PW, height: PH, overflow: "hidden", background: "#000",
              transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`, filter: filt(lk, 1), boxShadow: "0 0 0 6px #111, 0 18px 50px rgba(0,0,0,.7)" }}>
              <PanelTex t={s.panel!.tex} live={Math.hypot(p.x - e.x, p.y - e.y, p.z - e.z) < LIVE} />
              <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 3px rgba(255,255,255,.85)" }} />
            </div>
          );
        })}
      </div>
      {/* soft light falloff toward the frame edges */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
