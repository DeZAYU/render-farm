// IcebergChart_IC: the channel's signature. ONE data-driven chart that the whole video travels down.
//   beats (local frames): reveal  -> camera starts on the tip, title lockup, pulls back to the full chart while the bars draw out
//                                    from the centre (0.26 s/level, 1.2 s each) and the names rise in (0.30 s/level + 0.08 s/name, 0.7 s)
//                         level   -> camera sinks to band N (smoothstep-class EI.cam, 1.2 s, vertical motion blur from real velocity),
//                                    other bands dim, LEVEL N lockup lands, holds >= 1.1 s, then FLIES THROUGH (x(1+2.2u^2), blur, fade,
//                                    12 f) while the camera lands +17 % on the band (ease-out 0.9 s) and the band's names wake up
//                         case    -> the name is marked (amber bar grows), camera eases onto it, then the name LIFTS off its band into the
//                                    case title (screen-space twin, EI.quick 1.0 s), chart defocuses + darkens, kicker + rule land; holds.
// Sources: refs/iceberg/ICEBERG_MOTION.md §1 (reveal stagger, dive/sink, 45 % dim, fly-through x(1+2.2u^2)), Abyssal STUDY §E1 (level card
// 1.17 s hold, 0.40 s zoom-through + ease-out landing, low boom ~0.5 s after the zoom starts), owner reference image (bands, bars, names).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { clamp01, lerp, lerpLog } from "../../core";
import { CW, EI, IC, NAME_SHADOW, PLATE_CHART, T, band, chartH, nameW, placeNames, type ChartLevel, type PlateLayout, type Placed } from "./ic";
import { assertIC } from "./rules_ic";

export type ChartBeat =
  | { k: "reveal"; at: number; quick?: boolean } // quick = Abyssal Vol 4 0:12.0: hard cut to the full chart, bars + names build in ~1.4 s
  | { k: "title"; at: number; out?: number } // video title over the snow tip (camera x1.9 on the tip, chart bars/names not built yet)
  | { k: "cam"; at: number; cy: number; s: number; d: number; cx?: number } // eased camera glide (cy/cx = 0..1 of the chart), e.g. "deeper"
  | { k: "level"; at: number; level: number } // level index 0-based
  | { k: "case"; at: number; id: string };
export type IcebergChartProps = {
  plate?: PlateLayout;
  levels: ChartLevel[];
  beats: ChartBeat[];
  title?: { line1: string; line2: string; sub: string }; // only with a reveal beat
  dur: number; // frames this instance is on screen (asserted against the beats' minimum lengths)
  namePx?: number;
  snow?: boolean;
  veilFrom?: number; // names of levels >= veilFrom (0-based) are frosted until the camera reaches them (Abyssal: unrevealed names blurred)
};

type Cam = { cx: number; cy: number; s: number };
// beat timing (frames @30) — exported so hosts, rules and SFX placement use the same numbers
export const IC_T = {
  quick: { barStart: 2, barStep: 3, barDur: 14, nameStart: 8, nameStepLevel: 4, nameStepItem: 2, nameDur: 12 },
  title: { cam: { cx: 0.36, cy: 0.14, s: 1.9 }, out: 70 },
  reveal: { tipHold: 18, pull: 96, barStart: 62, barStep: 8, barDur: 36, nameStart: 76, nameStepLevel: 9, nameStepItem: 2.4, nameDur: 21, titleIn: 6, titleOut: 44 },
  level: { sink: 36, textIn: 20, textDur: 14, hold: 34, fly: 12, land: 27 }, // text lands at 34, fly starts at 68 (1.13 s readable)
  case: { mark: 12, cam: 30, lift: 28, liftDur: 30, kicker: 46, rule: 52 },
} as const;
export const levelFlyAt = () => IC_T.level.textIn + IC_T.level.textDur + IC_T.level.hold; // 68
const FULL = (H: number): Cam => ({ cx: CW / 2, cy: H / 2, s: 1 });

/** camera + chart state at frame f (pure; used by the chart and by hosts that need the name's screen position) */
export const chartState = (f: number, plate: PlateLayout, levels: ChartLevel[], beats: ChartBeat[], namePx = 58) => {
  const H = chartH(plate), names = placeNames(plate, levels, namePx);
  const bs = [...beats].sort((a, b) => a.at - b.at);
  const TC = IC_T.title.cam;
  const b0 = bs[0];
  let cam: Cam = b0?.k === "reveal" && !b0.quick ? { cx: CW / 2, cy: H * Math.max(0.09, plate.waterline * 0.55), s: 2.2 }
    : b0?.k === "title" ? { cx: CW * TC.cx, cy: H * TC.cy, s: TC.s } : FULL(H);
  let lastEnd = 0, activeLevel = -1, activeCase: Placed | null = null, caseAt = -1, levelAt = -1, since = -1;
  const setLevel = (lv: number, at: number) => { if (lv !== activeLevel) since = at; activeLevel = lv; };
  const go = (to: Cam, a: number, d: number, e: (x: number) => number) => {
    if (f < a) return false;
    const u = e(clamp01((f - a) / d));
    cam = { cx: lerp(cam.cx, to.cx, u), cy: lerp(cam.cy, to.cy, u), s: lerpLog(cam.s, to.s, u) };
    lastEnd = a + d; return true;
  };
  for (const b of bs) {
    if (f < b.at) break;
    if (b.k === "reveal" && !b.quick) go(FULL(H), b.at + IC_T.reveal.tipHold, IC_T.reveal.pull, EI.cam);
    if (b.k === "reveal" && b.quick) go({ cx: CW / 2, cy: H / 2, s: 1.0 }, b.at, 1, EI.cam);
    if (b.k === "title") go({ cx: CW * TC.cx, cy: H * TC.cy, s: TC.s }, b.at, 1, EI.cam);
    if (b.k === "cam") go({ cx: CW * (b.cx ?? 0.5), cy: H * b.cy, s: b.s }, b.at, b.d, EI.cam);
    if (b.k === "level") {
      const bd = band(plate, b.level); setLevel(b.level, b.at); levelAt = b.at; activeCase = null; caseAt = -1;
      // zoom so the band's names all fit with a 140 px margin (and the band is <= ~45 % of the frame height)
      const bn = names.filter((n) => n.level === b.level);
      const xs0 = Math.min(...bn.map((n) => n.x - nameW(n) / 2)), xs1 = Math.max(...bn.map((n) => n.x + nameW(n) / 2));
      const s0 = Math.max(1.1, Math.min(2.1, (1080 * 0.45) / bd.h, 1540 / (2 * Math.max(CW / 2 - xs0, xs1 - CW / 2))));
      go({ cx: CW / 2, cy: bd.mid, s: s0 }, b.at, IC_T.level.sink, EI.cam);
      // landing zoom: Abyssal cross-zoom, capped so every name of the band stays inside the frame with a 6 % margin (never cut off)
      const ext = Math.max(CW / 2 - xs0, xs1 - CW / 2);
      go({ cx: CW / 2, cy: bd.mid, s: Math.max(s0, Math.min(s0 * 1.3, (0.94 * 960) / ext)) }, b.at + levelFlyAt(), IC_T.level.land, EI.land); // Abyssal: the background cross-zooms in as the text flies through, ease-out landing
    }
    if (b.k === "case") {
      const nm = names.find((n) => n.id === b.id); if (!nm) throw new Error(`IcebergChart_IC: case ${b.id} not in levels`);
      activeCase = nm; caseAt = b.at; setLevel(nm.level, b.at);
      const bd = band(plate, nm.level);
      go({ cx: nm.x, cy: bd.mid, s: Math.min(1.6, 1500 / nameW(nm)) }, b.at, IC_T.case.cam, EI.cam);
    }
  }
  // constant "life" drift after every landing (no dead holds): +0.6 %/s zoom, 3 px/s pan (Smoothness_Guide 4.1: >= 0.16 %/s)
  const t = Math.max(0, f - lastEnd) / 30;
  cam = { ...cam, s: cam.s * Math.exp(0.006 * t), cx: cam.cx + 3 * t };
  // never show past the plate (no empty band above the sky / beside the chart): clamp the view window inside it
  const hw = 960 / cam.s, hh = 540 / cam.s;
  cam = { s: cam.s, cx: Math.min(CW - hw, Math.max(hw, cam.cx)), cy: hh * 2 >= H ? H / 2 : Math.min(H - hh, Math.max(hh - 300, cam.cy)) }; // up to 300 chart px of extended sky above the plate
  return { cam, H, names, activeLevel, activeCase, caseAt, levelAt, since };
};
const toScreen = (c: Cam, x: number, y: number) => ({ x: 960 + (x - c.cx) * c.s, y: 540 + (y - c.cy) * c.s });

// ---------------------------------------------------------------- marine snow (screen space, parallax on the camera)
const SNOW = Array.from({ length: 90 }, (_, i) => {
  const r = (n: number) => { const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
  return { x: r(1) * 1920, y: r(2) * 1080, z: 0.35 + r(3) * 0.9, sz: 1 + r(4) * 2.4, a: 0.12 + r(5) * 0.35, v: 5 + r(6) * 12 };
});
const Snow: React.FC<{ f: number; cam: Cam; wl: number }> = ({ f, cam, wl }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    {SNOW.map((p, i) => {
      const y = (((p.y - f * p.v / 30 - (cam.cy * cam.s) * p.z * 0.35) % 1080) + 1080) % 1080;
      const x = (((p.x - cam.cx * cam.s * p.z * 0.05 + Math.sin(f / 40 + i) * 6) % 1920) + 1920) % 1920;
      if (y < wl + 6) return null;
      return <circle key={i} cx={x} cy={y} r={p.sz * (0.6 + p.z * 0.5)} fill="#CFF1FF" opacity={p.a * clamp01((y - wl) / 120)} style={{ filter: p.z > 1 ? "blur(1.2px)" : undefined }} />;
    })}
  </svg>
);

// ---------------------------------------------------------------- metallic bar (the owner's reference: bright bars between the levels)
const Bar: React.FC<{ y: number; draw: number; surface: boolean; glint: number }> = ({ y, draw, surface, glint }) => (
  <div style={{ position: "absolute", left: -1400, width: CW + 2800, top: y - (surface ? 4 : 5.5), height: surface ? 8 : 11, transform: `scaleX(${draw})`, transformOrigin: "50% 50%" }}>
    <div style={{ position: "absolute", inset: 0, background: surface
      ? "linear-gradient(180deg, rgba(190,240,255,.0) 0%, rgba(214,246,255,.95) 45%, #FFFFFF 55%, rgba(127,211,242,.7) 100%)"
      : "linear-gradient(180deg, #2B353C 0%, #8A98A2 22%, #F4F8FA 46%, #FFFFFF 52%, #A7B4BC 70%, #3A454D 100%)",
      boxShadow: surface ? "0 0 18px rgba(127,211,242,.75), 0 0 46px rgba(127,211,242,.35)" : "0 2px 6px rgba(0,0,0,.65), 0 -1px 0 rgba(255,255,255,.08)" }} />
    {glint > 0 && glint < 1 && (
      <div style={{ position: "absolute", top: -6, bottom: -6, width: 420, left: 1400 + lerp(-500, CW + 100, glint),
        background: "radial-gradient(ellipse at center, rgba(255,255,255,.95) 0%, rgba(214,246,255,.35) 30%, rgba(255,255,255,0) 70%)", mixBlendMode: "screen" }} />
    )}
  </div>
);

export const IcebergChart_IC: React.FC<IcebergChartProps> = ({ plate = PLATE_CHART, levels, beats, title, dur, namePx = 58, snow = true, veilFrom = 3 }) => {
  const f = useCurrentFrame();
  assertIC("IcebergChart_IC", dur, beats);
  const st = chartState(f, plate, levels, beats, namePx);
  const prev = chartState(f - 1, plate, levels, beats, namePx);
  const { cam, H, names, activeLevel, activeCase, caseAt, levelAt, since } = st;
  const reveal = beats.find((b) => b.k === "reveal") as Extract<ChartBeat, { k: "reveal" }> | undefined;
  const titleB = beats.find((b) => b.k === "title") as Extract<ChartBeat, { k: "title" }> | undefined;
  const firstLevel = beats.filter((b) => b.k === "level").map((b) => b.at).sort((a, b) => a - b)[0] ?? 1e9;
  const L = IC_T.level, C = IC_T.case;
  const R = reveal?.quick ? { ...IC_T.reveal, ...IC_T.quick } : IC_T.reveal;
  const rk = reveal ? f - reveal.at : 1e6;
  // a title opening: bars and names are not built yet; they build out as the camera leaves the tip for level 1
  const built = titleB ? (f < firstLevel ? 0 : 1) : 1;
  const bk = titleB ? f - firstLevel : 1e6;
  // vertical motion blur from the real camera speed (px/frame on screen), only while it moves fast
  const vy = Math.abs((cam.cy * cam.s) - (prev.cam.cy * prev.cam.s)) + Math.abs(Math.log(cam.s / prev.cam.s)) * 600;
  const vblur = Math.min(9, Math.max(0, (vy - 6) * 0.35));
  // dim everything outside the active band (ICEBERG_MOTION: other levels to 45 %), eased 18 f from the beat
  const dimU = activeLevel < 0 ? 0 : EI.cam(clamp01((f - since) / 18)) * 0.65; // other bands to ~60 %: the berg stays visible through them
  const act = activeLevel >= 0 ? band(plate, activeLevel) : null;
  // level card + fly-through
  const lk = levelAt >= 0 ? f - levelAt : -1;
  const flyU = lk >= 0 ? clamp01((lk - levelFlyAt()) / L.fly) : 0;
  // case lift
  const ck = caseAt >= 0 ? f - caseAt : -1;
  const liftU = ck >= 0 ? EI.quick(clamp01((ck - C.lift) / C.liftDur)) : 0;
  const lifting = ck >= C.lift;
  const defocus = lifting ? liftU : 0;
  const wlScreen = toScreen(cam, 0, plate.waterline * H).y;
  return (
    <AbsoluteFill style={{ background: IC.abyss, overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="ic-vblur" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation={`0 ${vblur.toFixed(2)}`} /></filter>
      </svg>
      <AbsoluteFill style={{ filter: `${vblur > 0.3 ? "url(#ic-vblur) " : ""}blur(${(defocus * 9).toFixed(2)}px) brightness(${(1 - defocus * 0.45).toFixed(3)})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: CW, height: H, transformOrigin: "0 0",
          transform: `translate(960px,540px) scale(${cam.s}) translate(${-cam.cx}px,${-cam.cy}px)` }}>
          <Img src={staticFile(plate.src)} style={{ position: "absolute", left: 0, top: 0, width: CW, height: H }} />
          {/* extended sky above the plate (the camera may centre the sky band) + abyss below: never a black band */}
          <div style={{ position: "absolute", left: -1000, right: -1000, top: -700, height: 820,
            background: "radial-gradient(ellipse 60% 120% at 50% 100%, rgb(33,42,51) 0%, rgb(22,27,35) 45%, rgb(9,11,15) 100%)",
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 82%, rgba(0,0,0,0) 100%)" }} />
          <div style={{ position: "absolute", left: -2000, right: -2000, top: H, height: 2000, background: IC.abyss }} />
          {/* band dimming */}
          {act && (<>
            {activeLevel > 0 && <div style={{ position: "absolute", left: -2000, width: CW + 4000, top: -2000, height: act.top + 2000, background: "rgba(0,5,14,.62)", opacity: dimU }} />}
            <div style={{ position: "absolute", left: -2000, width: CW + 4000, top: act.bot, height: H - act.bot + 2000, background: "rgba(0,5,14,.62)", opacity: dimU }} />
          </>)}
          {plate.bars.map((y, i) => {
            const d = (reveal ? EI.quick(clamp01((rk - R.barStart - i * R.barStep) / R.barDur)) : 1) * (titleB ? (built ? EI.quick(clamp01((bk - 4 - i * 3) / 16)) : 0) : 1);
            const g = act && (i === activeLevel - 1 || i === activeLevel) && levelAt >= 0 ? clamp01((f - levelAt - 10) / 40) : 0;
            return <Bar key={i} y={y * H} draw={d} surface={i === 0} glint={g} />;
          })}
          {names.map((n) => {
            const ri = reveal ? EI.quick(clamp01((rk - R.nameStart - n.level * R.nameStepLevel - n.slot * R.nameStepItem) / R.nameDur)) : 1;
            let a = ri * (titleB ? (built ? EI.quick(clamp01((bk - 10 - n.level * 3) / 14)) : 0) : 1);
            if (activeLevel >= 0 && n.level !== activeLevel) a *= lerp(1, 0.42, dimU);
            // during the LEVEL card the band's names sleep, then wake as the lockup flies through
            if (lk >= 0 && n.level === activeLevel && caseAt < 0) a *= lerp(0.25, 1, clamp01((lk - levelFlyAt() + 2) / 14));
            if (lk >= 0 && caseAt < 0) a *= lerp(1, 0.4, clamp01(lk / 20) * (1 - flyU)); // everything rests under the LEVEL lockup
            const isAct = activeCase?.id === n.id;
            const visited = activeCase && n.level === activeLevel && !isAct && n.slot < activeCase.slot;
            if (activeCase && n.level === activeLevel && !isAct) a *= visited ? 0.42 : 0.62;
            if (isAct && lifting) a *= lerp(1, 0, Math.min(1, liftU * 1.6)); // the name leaves its slot (no ghost behind the lifted title)
            const mark = isAct ? EI.quick(clamp01(ck / C.mark)) : 0;
            const rise = (1 - ri) * 14;
            // frosted (unrevealed) names: deeper than the teaser line and not yet reached by the camera (Abyssal blurs unrevealed entries)
            const veil = n.level >= veilFrom && n.level > activeLevel ? 1 : 0;
            return (
              <div key={n.id} style={{ position: "absolute", left: n.x, top: n.y + rise, transform: "translate(-50%,-50%)", opacity: a * (veil ? 0.75 : 1), textAlign: "center", whiteSpace: "nowrap", color: IC.ice, ...T.name(n.px), textShadow: NAME_SHADOW, filter: veil ? "blur(7px)" : undefined }}>
                {mark > 0 && <div style={{ position: "absolute", left: -18, top: "8%", width: 5, height: `${84 * mark}%`, background: IC.amber, boxShadow: `0 0 12px ${IC.amber}` }} />}
                {n.lines.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {snow && <Snow f={f} cam={cam} wl={wlScreen} />}
      {/* depth gauge (screen space): one tick per level, amber pointer = where the camera is */}
      <DepthGauge plate={plate} H={H} cam={cam} levels={levels.length} active={activeLevel} opacity={clamp01((cam.s - 1.25) / 0.35) * (reveal ? clamp01((rk - R.nameStart) / 20) : 1)} />
      {/* intro title lockup over the tip */}
      {title && reveal && !reveal.quick && rk < R.titleOut + 30 && <TitleLock k={rk} t={title} outAt={R.titleOut} />}
      {title && titleB && f - titleB.at < (titleB.out ?? IC_T.title.out) + 26 && <TitleLock k={f - titleB.at} t={title} outAt={titleB.out ?? IC_T.title.out} />}
      {/* LEVEL N lockup + fly-through */}
      {lk >= 0 && caseAt < 0 && lk < levelFlyAt() + L.fly + 2 && <LevelLock k={lk} n={levels[activeLevel].n} name={levels[activeLevel].name} flyU={flyU} />}
      {/* case title lifted off the band */}
      {activeCase && lifting && <Lift n={activeCase} k={ck} u={liftU} cam={chartState(caseAt + C.lift, plate, levels, beats, namePx).cam} levelN={levels[activeCase.level].n} />}
    </AbsoluteFill>
  );
};

const DepthGauge: React.FC<{ plate: PlateLayout; H: number; cam: Cam; levels: number; active: number; opacity: number }> = ({ plate, H, cam, levels, active, opacity }) => {
  const top = 200, bot = 880, ys = [0, ...plate.bars, plate.bottom];
  const pos = clamp01(((cam.cy / H) - 0) / plate.bottom);
  return (
    <div style={{ position: "absolute", left: 58, top, height: bot - top, width: 120, opacity: 0.85 * opacity }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1.5, background: "linear-gradient(180deg, rgba(169,216,236,.55), rgba(169,216,236,.12))" }} />
      {Array.from({ length: levels }, (_, i) => {
        const y = ((ys[i] + ys[i + 1]) / 2 / plate.bottom) * (bot - top);
        const on = i === active;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: y, transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: on ? 18 : 10, height: 1.5, background: on ? IC.amber : "rgba(169,216,236,.7)" }} />
            <div style={{ ...T.mono(15, on ? 600 : 400), color: on ? IC.amber : "rgba(169,216,236,.75)" }}>{String(i + 1).padStart(2, "0")}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: -9, top: pos * (bot - top), transform: "translateY(-50%)", width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: `8px solid ${IC.amber}` }} />
    </div>
  );
};

const TitleLock: React.FC<{ k: number; t: { line1: string; line2: string; sub: string }; outAt: number }> = ({ k, t, outAt }) => {
  const R = IC_T.reveal;
  const inU = (d: number) => EI.quick(clamp01((k - R.titleIn - d) / 26));
  const out = EI.cam(clamp01((k - outAt) / 24));
  const ln = (s: string, d: number, px: number) => (
    <div style={{ ...T.name(px), color: IC.ice, textShadow: NAME_SHADOW, opacity: inU(d) * (1 - out), transform: `translateY(${(1 - inU(d)) * 22 - out * 12}px)`, filter: `blur(${out * 4}px)` }}>{s}</div>
  );
  return (
    <div style={{ position: "absolute", left: 150, top: 300 }}>
      {ln(t.line1, 0, 112)}{ln(t.line2, 4, 112)}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, opacity: inU(12) * (1 - out) }}>
        <div style={{ width: 70 * inU(12), height: 3, background: IC.amber }} />
        <div style={{ ...T.label(24, 600), color: IC.frost }}>{t.sub}</div>
      </div>
    </div>
  );
};

const LevelLock: React.FC<{ k: number; n: number; name: string; flyU: number }> = ({ k, n, name, flyU }) => {
  const L = IC_T.level;
  const inU = EI.quick(clamp01((k - L.textIn) / L.textDur));
  const s = (0.96 + 0.04 * inU) * (1 + 2.2 * flyU * flyU) * (1 + 0.012 * Math.max(0, k - L.textIn) / 30);
  return (<>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 38% 42% at 50% 50%, rgba(0,6,16,.55) 0%, rgba(0,6,16,0) 100%)", opacity: inU * (1 - flyU) }} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: inU * (1 - Math.pow(flyU, 1.5)), filter: `blur(${(14 * flyU * flyU).toFixed(2)}px)`, transform: `scale(${s})` }}>
      <div style={{ ...T.label(26, 600), color: IC.frost, letterSpacing: "0.62em", marginBottom: 6, textShadow: NAME_SHADOW }}>LEVEL</div>
      <div style={{ ...T.name(300), color: IC.ice, lineHeight: 0.86, textShadow: NAME_SHADOW }}>{String(n).padStart(2, "0")}</div>
      <div style={{ width: 110 * inU, height: 3, background: IC.amber, margin: "18px 0 14px" }} />
      <div style={{ ...T.label(28, 600), color: IC.ice, textShadow: NAME_SHADOW }}>{name}</div>
    </AbsoluteFill>
  </>);
};

const Lift: React.FC<{ n: Placed; k: number; u: number; cam: Cam; levelN: number }> = ({ n, k, u, cam, levelN }) => {
  const C = IC_T.case;
  const from = toScreen(cam, n.x, n.y), fromPx = n.px * cam.s;
  const est = Math.max(...n.lines.map((l) => l.length)) * 0.44; const toPx = Math.min(128, 1560 / est), to = { x: 960, y: 520 };
  const px = lerp(fromPx, toPx, u), x = lerp(from.x, to.x, u), y = lerp(from.y, to.y, u);
  const ku = EI.quick(clamp01((k - C.kicker) / 16)), ru = EI.quick(clamp01((k - C.rule) / 20));
  const drift = 1 + 0.008 * Math.max(0, k - C.lift - C.liftDur) / 30;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${drift})`, textAlign: "center", whiteSpace: "nowrap" }}>
        <div style={{ ...T.mono(22, 500), color: IC.frost, opacity: ku, marginBottom: 14 * (px / toPx), transform: `translateY(${(1 - ku) * 10}px)` }}>
          LEVEL {String(levelN).padStart(2, "0")}<span style={{ color: IC.amber }}>{"  /  "}</span>CASE {String(n.number).padStart(2, "0")}
        </div>
        <div style={{ ...T.name(px), color: IC.ice, textShadow: `0 ${4 + 20 * u}px ${8 + 40 * u}px rgba(0,4,12,${0.55 + 0.25 * u}), 0 0 ${14 + 20 * u}px rgba(0,10,26,.6)` }}>
          {n.lines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
        <div style={{ width: 260 * ru, height: 3, background: IC.amber, margin: "22px auto 0", boxShadow: `0 0 10px ${IC.amber}` }} />
      </div>
    </AbsoluteFill>
  );
};
