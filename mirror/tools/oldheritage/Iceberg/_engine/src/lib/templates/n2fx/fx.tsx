// n2fx = the algrow-2 channel's CUT TOOLS: transitions, punch-ins, impact hits, speed ramps, the film look (grain + vignette), and the
// cold-open cards. LOOK agent, Disasters2 v3 (2026-10-26), after the owner's v2 notes:
//   "very rough cuts on transitions: a one-frame glitch, a sudden zoom-in, feels cut carelessly"; "intro clips are mid, they just slowly
//   move away"; "add the CC".
// Every effect here is a DESIGNED MULTI-FRAME envelope (eased in and out). Nothing changes in a single frame except a plain hard cut.
// Timing rules are asserted twice: per component at render (assertFX) and for the whole edit at bundle time (cutlint.ts lintEdit).
//
// References each device adapts (frame studies on disk):
//   GlitchHandoff  Abyssal Detective CCTV Iceberg Vol 4 @0:36-2:00 (glitch / RGB-split hand-offs between clips, 3-5 f tears; entry exit
//                  9 f block glitch) -> ours 8-12 f, symmetric sin envelope around the cut, slices + RGB split + blocks at the peak only.
//   ColdFlash      Abyssal entry exit @0:36.2 "7 f white flash" (luma 94 -> 192, peak on the cut) + Smoothness_Guide §5 exposure flash
//                  (ramp up 3 f, peak on the cut, decay 4-6 f) -> cold white #E8F8FF, never a 1-frame pop.
//   WhipPan        Visual Venture (Waterpark/study/visualventure_tv, VV whip / blur push between beats): 4-6 f accelerate out with
//                  directional motion blur, 5-6 f decelerate in from the opposite side.
//   ZoomHit        Disturbing Dose dashcam vols (refs/dd): hit cuts on the bass drop: the outgoing shot rushes forward (zoom blur) and the
//                  incoming one lands from 1.12x -> 1.0 with the blur decaying; exposure lift spread over 6 f (no flash frame).
//   BlurDip        VV / Farrell soft beat change: 12 f gaussian dip with a 25 % exposure dip, centred on the cut.
//   Punch          Nocturn / Farrell punch-in (Smoothness_Guide §4: the picture lands on the noun the VO names), eased in AND out
//                  (bezier .45,0,.2,1 over >= 12 f) with motion blur proportional to the zoom speed: never a jump.
//   Impact         DD impact frames on the peak moment: 2 f rise, 10 f decay: decaying shake + contrast + chroma split, mean luma kept.
//   SpeedRamp      VV / DD speed ramps on peaks: time-remap into a 4x optical-flow file (grade/grade.py *_x4), speed keys eased.
//   FilmLook       the reference grade study (Disasters2/grade/study/ref_stats.json): vignette corners ~0.45-0.6 of centre (Abyssal .48,
//                  Fern .60, DD .23) + fine animated grain (Abyssal / Fern), on top of everything so punch-ins never scale it.
import React from "react";
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FONT, clamp01, lerp } from "../../core";

const FPS = 30;
// ---------------------------------------------------------------- easing
const bz = (a: number, b: number, c: number, d: number) => { const e = Easing.bezier(a, b, c, d); return (x: number) => e(clamp01(x)); };
export const EZ_FX = {
  punch: bz(0.45, 0, 0.2, 1), // gradual ease-in, long settle: a punch that never jumps (cutcheck ZOOMJERK < 3 %/f)
  inOut: bz(0.65, 0, 0.35, 1),
  accel: (x: number) => Math.pow(clamp01(x), 2.2), // outgoing half of a move-transition
  decel: (x: number) => 1 - Math.pow(1 - clamp01(x), 2.6), // incoming half
  sine: (x: number) => Math.sin(Math.PI * clamp01(x)),
  smooth: (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); },
};

// ---------------------------------------------------------------- rules (min/max frames per device; lintEdit uses the same table)
export const FX_MIN: Record<string, { min: number; max: number }> = {
  glitch: { min: 8, max: 14 }, flash: { min: 7, max: 12 }, whip: { min: 8, max: 14 }, whipDown: { min: 8, max: 16 }, zoomHit: { min: 8, max: 14 },
  blurDip: { min: 10, max: 20 }, hard: { min: 0, max: 0 }, punch: { min: 12, max: 24 }, impact: { min: 8, max: 18 },
  WarningCard_FX: { min: 66, max: 120 }, PresentsOver_FX: { min: 75, max: 120 },
};
export const assertFX = (kind: string, len: number) => {
  const t = FX_MIN[kind]; if (!t) throw new Error(`n2fx: no timing for ${kind}`);
  if (kind !== "hard" && (len < t.min || len > t.max)) throw new Error(`n2fx: ${kind} lasts ${len} f, allowed ${t.min}-${t.max} f (designed multi-frame effect)`);
};

// ---------------------------------------------------------------- transitions: one wrapper over the whole edit
export type TransKind = "hard" | "glitch" | "flash" | "whip" | "whipDown" | "zoomHit" | "blurDip";
/** a transition centred on the cut frame `at` (absolute frame of the incoming shot's first frame). dir: whip direction (+1 = picture moves left) */
export type FxCut = { at: number; kind: TransKind; len?: number; dir?: 1 | -1; amt?: number };
export const DEF_LEN: Record<TransKind, number> = { hard: 0, glitch: 10, flash: 8, whip: 10, whipDown: 12, zoomHit: 10, blurDip: 14 };
const rnd = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

/** the active transition at frame f: k = signed progress (-1 at the start, 0 on the cut, +1 at the end) */
const activeCut = (f: number, cuts: FxCut[]) => {
  for (const c of cuts) {
    if (c.kind === "hard") continue;
    const len = c.len ?? DEF_LEN[c.kind];
    const half = len / 2;
    if (f >= c.at - half && f < c.at + half) return { c, len, k: (f - c.at + 0.5) / half }; // +0.5: frame centres, symmetric around the cut
  }
  return null;
};

const GlitchFilter: React.FC<{ id: string; e: number; seed: number }> = ({ id, e, seed }) => {
  const dx = Math.round(22 * e), disp = Math.round(120 * e), blk = e > 0.6 ? Math.round(5 + 12 * (e - 0.6) / 0.4) * 2 : 0;
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <filter id={id} x="-3%" y="-3%" width="106%" height="106%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.00001 0.04" numOctaves={1} seed={seed} result="t" />
        <feComponentTransfer in="t" result="tq"><feFuncR type="discrete" tableValues="0.5 0.5 0.15 0.5 0.85 0.5 0.32 0.5 0.5" /><feFuncG type="discrete" tableValues="0.5" /></feComponentTransfer>
        <feDisplacementMap in="SourceGraphic" in2="tq" scale={disp} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feColorMatrix in="d" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx={dx} result="ro" />
        <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feOffset in="b" dx={-dx} result="bo" />
        <feBlend in="ro" in2="g" mode="screen" result="rg" />
        <feBlend in="rg" in2="bo" mode="screen" result="rgb" />
        {blk > 0 && (<>
          <feFlood x={blk / 2} y={blk / 2} width="1" height="1" floodColor="#fff" result="fl" />
          <feComposite in="fl" width={blk} height={blk} result="cell" />
          <feTile in="cell" result="tile" />
          <feComposite in="rgb" in2="tile" operator="in" result="pts" />
          <feMorphology in="pts" operator="dilate" radius={blk / 2} />
        </>)}
      </filter>
    </svg>
  );
};
const DirBlur: React.FC<{ id: string; x: number; y: number }> = ({ id, x, y }) => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${x.toFixed(1)} ${y.toFixed(1)}`} edgeMode="duplicate" /></filter>
  </svg>
);

/** wraps the whole edit. Every cut listed gets its designed effect; unlisted cuts are plain hard cuts. */
export const Transitions_FX: React.FC<{ cuts: FxCut[]; children: React.ReactNode }> = ({ cuts, children }) => {
  const f = useCurrentFrame();
  cuts.forEach((c) => assertFX(c.kind, c.len ?? DEF_LEN[c.kind]));
  const a = activeCut(f, cuts);
  if (!a) return <AbsoluteFill>{children}</AbsoluteFill>;
  const { c, k } = a, amt = c.amt ?? 1, out = k < 0, u = Math.abs(k); // u: 1 at the outer edges, 0 on the cut
  const toward = 1 - u; // 0 at the edges -> 1 on the cut
  const id = `fx_${c.kind}_${c.at}_${f}`;
  switch (c.kind) {
    case "glitch": {
      const e = Math.sin((Math.PI / 2) * toward) * amt; // 0 at the edges, 1 on the cut
      return (<AbsoluteFill><GlitchFilter id={id} e={e} seed={Math.floor(f / 2) * 7 + c.at} /><AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill></AbsoluteFill>);
    }
    case "flash": {
      const e = (out ? EZ_FX.accel(toward) : Math.pow(toward, 1.6)) * amt; // ramp 3-4 f up, peak on the cut, decay
      return (<AbsoluteFill>{children}<AbsoluteFill style={{ background: "#E8F8FF", opacity: 0.78 * e, mixBlendMode: "screen" }} /></AbsoluteFill>);
    }
    case "whip":
    case "whipDown": {
      // dir +1: the picture travels left (or up); outgoing accelerates away, incoming arrives from the other side and settles
      const dir = c.dir ?? 1, vert = c.kind === "whipDown", W = vert ? 1080 : 1920;
      const travel = W * 0.42 * amt;
      const pos = out ? -EZ_FX.accel(toward) : 1 - EZ_FX.decel(1 - toward); // out 0 -> -1, in +1 -> 0
      const off = pos * travel * dir;
      const sc = 1 + (Math.abs(off) / W) * 1.2; // covers the edge the move exposes
      const blur = 70 * Math.sin((Math.PI / 2) * toward) * amt;
      const tr = vert ? `translateY(${off.toFixed(1)}px)` : `translateX(${off.toFixed(1)}px)`;
      return (
        <AbsoluteFill>
          <DirBlur id={id} x={vert ? 0 : blur} y={vert ? blur : 0} />
          <AbsoluteFill style={{ transform: `${tr} scale(${sc.toFixed(4)})`, filter: `url(#${id}) brightness(${(1 - 0.12 * toward).toFixed(3)})` }}>{children}</AbsoluteFill>
        </AbsoluteFill>
      );
    }
    case "zoomHit": {
      const z = out ? EZ_FX.accel(toward) : 1 - EZ_FX.decel(1 - toward); // out 0 -> 1 (rush in), in 1 -> 0 (land)
      const s = 1 + 0.12 * z * amt;
      const blur = 9 * toward * amt, lift = 1 + 0.07 * toward * amt;
      return (
        <AbsoluteFill style={{ filter: `brightness(${lift.toFixed(3)}) contrast(${(1 + 0.12 * toward).toFixed(3)})` }}>
          <AbsoluteFill style={{ transform: `scale(${s.toFixed(4)})`, filter: `blur(${(blur * 0.35).toFixed(2)}px)` }}>{children}</AbsoluteFill>
          {toward > 0.15 && <AbsoluteFill style={{ transform: `scale(${(s * (1 + 0.035 * toward)).toFixed(4)})`, opacity: 0.35 * toward, filter: `blur(${blur.toFixed(1)}px)` }}>{children}</AbsoluteFill>}
        </AbsoluteFill>
      );
    }
    case "blurDip": {
      const e = Math.sin((Math.PI / 2) * toward) * amt;
      return <AbsoluteFill style={{ filter: `blur(${(16 * e).toFixed(2)}px) brightness(${(1 - 0.25 * e).toFixed(3)})` }}>{children}</AbsoluteFill>;
    }
    default:
      return <AbsoluteFill>{children}</AbsoluteFill>;
  }
};

// ---------------------------------------------------------------- punches + impacts (per shot)
/** a punch-in: from frame `at` (shot-local) the framing scales by `to` over `len` frames, eased in + out. Origin = the shot's focus. */
export type FxPunch = { at: number; to: number; len?: number };
/** an impact hit on a peak (shot-local frame): decaying shake + contrast + chroma split; mean luma kept */
export type FxImpact = { at: number; amt?: number; len?: number };
export const punchScale = (f: number, punches: FxPunch[]) =>
  punches.reduce((m, p) => { const len = p.len ?? 14; assertFX("punch", len); return m * lerp(1, p.to, EZ_FX.punch((f - p.at) / len)); }, 1);
/** zoom speed (fraction per frame) -> motion blur during a punch, so it reads as a camera move */
const punchSpeed = (f: number, punches: FxPunch[]) => Math.abs(Math.log(punchScale(f + 0.5, punches) / punchScale(f - 0.5, punches)));
export const impactEnv = (f: number, impacts: FxImpact[]) =>
  impacts.reduce((m, i) => { const len = i.len ?? 12; assertFX("impact", len); const d = f - i.at; const v = d < -2 || d > len - 2 ? 0 : d < 0 ? (d + 2) / 2 : Math.pow(1 - d / (len - 2), 1.5); return Math.max(m, v * (i.amt ?? 1)); }, 0);

// ---------------------------------------------------------------- speed ramp (time-remap into a 4x optical-flow file)
/** speed keys (shot-local seconds -> playback speed). Between keys the speed eases (smoothstep) over `ease` s, never steps. */
export type SpeedKey = { t: number; v: number };
export const RAMP_X = 4; // grade.py writes the *_x4 files at 4x slow motion
/** source seconds (from the file's in-point) shown at shot-local frame f */
export const rampSrc = (f: number, keys: SpeedKey[], ease = 0.25) => {
  const ks = [...keys].sort((a, b) => a.t - b.t);
  const speed = (t: number) => {
    let v = ks[0].v;
    for (let i = 1; i < ks.length; i++) { const u = EZ_FX.smooth((t - (ks[i].t - ease / 2)) / ease); v = lerp(v, ks[i].v, u); }
    return v;
  };
  let s = 0; const dt = 1 / FPS / 4;
  for (let t = 0; t < f / FPS - 1e-9; t += dt) s += speed(t + dt / 2) * dt;
  return s;
};
export const assertRamp = (keys: SpeedKey[], ease: number, fileSec: number, n: number, srcStart: number) => {
  keys.forEach((k) => { if (k.v < 1 / RAMP_X - 1e-6 || k.v > 3.2) throw new Error(`n2fx: ramp speed ${k.v} outside 0.25-3.2 (x4 file)`); });
  if (ease < 0.2) throw new Error(`n2fx: ramp ease ${ease} s < 0.2 s: a speed step reads as a frame jump`);
  const end = srcStart + rampSrc(n, keys, ease);
  if (end * RAMP_X > fileSec + 1e-3) throw new Error(`n2fx: ramp runs to source +${end.toFixed(2)} s, the x4 file holds ${(fileSec / RAMP_X).toFixed(2)} s`);
};

// ---------------------------------------------------------------- the shot: framing, drift, punches, impacts, ramps, face blur
export type FxShotP = {
  src: string; n: number; // staticFile path, shot length (frames)
  from?: number; // seconds into the file (plain files) / source seconds into a ramp file
  ramp?: { keys: SpeedKey[]; ease?: number; fileSec: number }; // time-remap through a *_x4 file
  still?: boolean;
  fill?: boolean; // narrower than 16:9: centred on a blurred, darkened copy of itself (Abyssal intro treatment; no black bars)
  s0?: number; s1?: number; // base framing scale at the start / end (linear drift)
  fx?: number; fy?: number; // focus (transform origin) 0..1
  pan?: [number, number]; // px at start / end (x)
  panY?: [number, number]; // px at start / end (y), eased in/out (a designed tilt; e.g. down the berg)
  rot?: [number, number, number?, number?]; // deg at start, deg at end, optional eased window [from, len] frames (designed tilt)
  punches?: FxPunch[]; impacts?: FxImpact[];
  blurBand?: [number, number]; // y range 0..1 of the picture: soft blur band over faces (house censor rule)
};
const Media: React.FC<{ src: string; from: number; still?: boolean; style: React.CSSProperties; frozen?: number }> = ({ src, from, still, style, frozen }) =>
  still ? <Img src={staticFile(src)} style={style} /> : frozen !== undefined ? (
    <Freeze frame={frozen}><OffthreadVideo src={staticFile(src)} muted style={style} /></Freeze>
  ) : <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * FPS)} muted style={style} />;

export const Shot_FX: React.FC<FxShotP> = ({ src, n, from = 0, ramp, still, fill, s0 = 1.0, s1, fx = 0.5, fy = 0.5, pan = [0, 0], panY = [0, 0], rot, punches = [], impacts = [], blurBand }) => {
  const f = useCurrentFrame();
  if (ramp) assertRamp(ramp.keys, ramp.ease ?? 0.3, ramp.fileSec, n, from);
  const u = clamp01(f / Math.max(1, n - 1));
  const imp = impactEnv(f, impacts);
  const s = lerp(s0, s1 ?? s0, u) * punchScale(f, punches) * (1 + 0.025 * imp);
  const mb = Math.min(6, punchSpeed(f, punches) * 160); // px of motion blur at the punch's peak speed
  const shake = imp > 0.01 ? [Math.sin(f * 2.9) * 16 * imp, Math.cos(f * 3.7) * 10 * imp] : [0, 0];
  const r = rot ? (rot[2] !== undefined ? lerp(rot[0], rot[1], EZ_FX.inOut((f - rot[2]) / (rot[3] ?? 14))) : lerp(rot[0], rot[1], u)) : 0;
  const ty = lerp(panY[0], panY[1], EZ_FX.inOut(u));
  // translate3d / scale3d on a will-change layer: sub-pixel motion (a 2D transform is snapped to whole px: stair-stepped slow pushes)
  const tf = `translate3d(${(lerp(pan[0], pan[1], u) + shake[0]).toFixed(3)}px, ${(ty + shake[1]).toFixed(3)}px, 0) rotate(${r.toFixed(4)}deg) scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1)`;
  // ramp: frozen frame inside the 4x file = (source seconds) * RAMP_X * FPS
  const frozen = ramp ? Math.round((from + rampSrc(f, ramp.keys, ramp.ease ?? 0.3)) * RAMP_X * FPS) : undefined;
  const med = (st: React.CSSProperties) => <Media src={src} from={from} still={still} style={st} frozen={frozen} />;
  const filt = [mb > 0.3 ? `blur(${mb.toFixed(2)}px)` : "", imp > 0.02 ? `contrast(${(1 + 0.28 * imp).toFixed(3)}) saturate(${(1 - 0.3 * imp).toFixed(3)})` : ""].join(" ").trim() || undefined;
  const id = `ch_${f}_${src.length}`;
  const pic = fill ? (
    <AbsoluteFill>
      {/* blurred fill of the SAME clip (owner v4: the dark fill read as bars): bright enough to read as picture, not as black side bars */}
      <AbsoluteFill style={{ filter: "blur(30px) brightness(0.86) saturate(0.92)", transform: "scale(1.25)" }}>{med({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      <AbsoluteFill style={{ transform: tf, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }}>
        {med({ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0 36px rgba(0,0,0,.55))" })}
        {blurBand && <div style={{ position: "absolute", left: 0, right: 0, top: blurBand[0] * 1080, height: (blurBand[1] - blurBand[0]) * 1080, backdropFilter: "blur(10px)" }} />}
      </AbsoluteFill>
    </AbsoluteFill>
  ) : (
    <AbsoluteFill style={{ transform: tf, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }}>
      {med({ width: "100%", height: "100%", objectFit: "cover" })}
      {blurBand && <div style={{ position: "absolute", left: 0, right: 0, top: blurBand[0] * 1080, height: (blurBand[1] - blurBand[0]) * 1080, backdropFilter: "blur(10px)" }} />}
    </AbsoluteFill>
  );
  // chroma split on impacts (SVG, offsets R/B a few px; luma unchanged)
  const cs = imp > 0.05 ? Math.round(7 * imp) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {cs > 0 && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" /><feOffset in="r" dx={cs} result="ro" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" /><feOffset in="b" dx={-cs} result="bo" />
            <feBlend in="ro" in2="g" mode="screen" result="rg" /><feBlend in="rg" in2="bo" mode="screen" />
          </filter>
        </svg>
      )}
      <AbsoluteFill style={{ filter: [filt, cs > 0 ? `url(#${id})` : ""].join(" ").trim() || undefined }}>{pic}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- film look: vignette + grain over everything (not baked into clips)
/** grain frames: public/n2fx/grain_0..7.png (960x540, mid-grey noise; grade/make_grain.py). vig: corner darkening 0..1 */
export const FilmLook_FX: React.FC<{ vig?: number; grain?: number; children?: React.ReactNode }> = ({ vig = 1, grain = 0.12, children }) => {
  const f = useCurrentFrame();
  const g = Math.floor(rnd(f * 1.7) * 8);
  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 78% 74% at 50% 48%, rgba(0,4,8,0) 38%, rgba(0,4,8,.20) 63%, rgba(0,4,8,.48) 85%, rgba(0,4,8,.66) 100%)", opacity: vig }} />
      {grain > 0 && <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: grain }}><Img src={staticFile(`n2fx/grain_${g}.png`)} style={{ width: "100%", height: "100%", imageRendering: "auto" }} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- cold open cards
const courier = (px: number): React.CSSProperties => ({ fontFamily: FONT.courier, fontWeight: 700, fontSize: px });
const wide = (px: number, w = 700): React.CSSProperties => ({ fontFamily: FONT.archivo, fontWeight: w, fontSize: px, fontStretch: "125%", fontVariationSettings: `'wdth' 125, 'wght' ${w}`, textTransform: "uppercase" });
const fadeIO = (f: number, dur: number, i: number, o: number) => Math.min(EZ_FX.inOut(f / i), EZ_FX.inOut((dur - f) / o));

/** WARNING card (Abyssal cold open: white typewriter on black before the footage). Title fades in, then each line types at 3 char/f
 *  (staggered 6 f), so the whole card is readable >= 1.2 s before its 12 f fade-out. */
export const WarningCard_FX: React.FC<{ dur: number; title?: string; lines?: string[] }> = ({ dur, title = "WARNING", lines = ["This video contains real footage of disasters", "and the moments right before them.", "Viewer discretion is advised."] }) => {
  const f = useCurrentFrame(); assertFX("WarningCard_FX", dur);
  const op = fadeIO(f, dur, 10, 12);
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{ transform: `scale(${lerp(1, 1.025, f / dur).toFixed(4)})`, textAlign: "center", color: "#EDEFEF" }}>
        <div style={{ ...courier(58), letterSpacing: "0.32em", marginBottom: 34, color: "#F4F7F7", opacity: EZ_FX.inOut(f / 8) }}>{title}</div>
        {lines.map((ln, i) => {
          const shown = Math.max(0, Math.min(ln.length, Math.floor((f - 6 - i * 6) * 3)));
          return <div key={i} style={{ ...courier(30), color: "rgba(237,239,239,.82)", lineHeight: 1.55, whiteSpace: "pre" }}>{ln.slice(0, shown)}<span style={{ opacity: 0 }}>{ln.slice(shown)}</span></div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

/** "<title> presents" over footage (channel name TBD -> the video title). Letters resolve from glitch characters (8 f per line), hold, 14 f out. */
export const PresentsOver_FX: React.FC<{ dur: number; title: string[]; kicker?: string }> = ({ dur, title, kicker = "VOLUME 2" }) => {
  const f = useCurrentFrame(); assertFX("PresentsOver_FX", dur);
  const GL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>=+0123456789";
  const op = Math.min(EZ_FX.inOut(f / 10), EZ_FX.inOut((dur - f) / 14));
  const resolve = (s: string, start: number) => [...s].map((ch, i) => {
    const t = f - start - i * 0.7;
    if (ch === " ") return " ";
    if (t < 0) return " ";
    return t < 5 ? GL[Math.floor(rnd(i * 13 + Math.floor(f / 2)) * GL.length)] : ch;
  }).join("");
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op, pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,6,12,.55) 0%, rgba(0,6,12,0) 100%)" }} />
      <div style={{ textAlign: "center", transform: `translateY(${lerp(10, -6, EZ_FX.inOut(f / dur)).toFixed(1)}px)` }}>
        <div style={{ ...courier(26), letterSpacing: "0.5em", color: "rgba(230,244,248,.8)", marginBottom: 18, whiteSpace: "pre" }}>{resolve(kicker, 4)}</div>
        {title.map((ln, i) => (
          <div key={i} style={{ ...wide(76, 700), letterSpacing: "0.07em", lineHeight: 1.12, color: "#A6F6FF", textShadow: "0 0 5px rgba(120,240,255,.9), 0 0 18px rgba(50,215,255,.55), 0 0 40px rgba(20,170,255,.3)", whiteSpace: "pre" }}>{resolve(ln, 10 + i * 6)}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** catalogue demo: two clips joined by one transition of the given kind (cut at frame 30) */
export const TransDemo_FX: React.FC<{ kind: TransKind; a: string; b: string }> = ({ kind, a, b }) => (
  <FilmLook_FX>
    <Transitions_FX cuts={[{ at: 30, kind }]}>
      <Sequence from={0} durationInFrames={30}><Shot_FX src={a} n={30} s0={1.02} s1={1.04} /></Sequence>
      <Sequence from={30} durationInFrames={30}><Shot_FX src={b} n={30} s0={1.04} s1={1.02} /></Sequence>
    </Transitions_FX>
  </FilmLook_FX>
);
