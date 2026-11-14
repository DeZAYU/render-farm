// N2 = the algrow-2 channel devices (everything that is not the chart). One file per device would split 7 tiny components that share
// the same grade/type/rules; they live together here and are registered one by one in index.ts.
// Look: cold grade, Archivo (ExtraCondensed names / tracked labels) + JetBrains Mono data, ONE accent (beacon amber). No boxes, no
// lower-third plates, no text that restates the VO, no look-here circles (owner 2026-10-25).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { clamp01, lerp, lerpLog } from "../../core";
import { EI, IC, NAME_SHADOW, T } from "../iceberg/ic";
import { assertN2 } from "../iceberg/rules_ic";

// ---------------------------------------------------------------- footage + channel grade
/** cold channel grade on any picture: sat .80, teal-lifted shadows, 1.5 % black lift, soft vignette (footage only, never on pages) */
export const ColdGrade: React.FC<{ children: React.ReactNode; vignette?: number }> = ({ children, vignette = 0.42 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: "saturate(0.80) contrast(1.07) brightness(0.96)" }}>{children}</AbsoluteFill>
    <AbsoluteFill style={{ background: "#0B2A44", mixBlendMode: "soft-light", opacity: 0.38 }} />
    <AbsoluteFill style={{ background: "rgba(6,22,38,1)", mixBlendMode: "lighten", opacity: 0.06 }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,4,10,${vignette}) 100%)` }} />
  </AbsoluteFill>
);
/** a footage window: constant LINEAR push (never eased on footage), optional focus point; blurred cover fill for vertical sources */
export const Shot: React.FC<{ src: string; from?: number; push?: number; focus?: [number, number]; vertical?: boolean; muted?: boolean; volume?: number; grade?: boolean }> = ({ src, from = 0, push = 0.022, focus = [0.5, 0.5], vertical, muted = true, volume = 1, grade = true }) => {
  const f = useCurrentFrame();
  const s = 1.02 + push * (f / 30);
  const v = (st: React.CSSProperties, m = muted) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted={m} volume={volume} style={st} />;
  const pic = vertical ? (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(40px) brightness(0.32)", transform: "scale(1.2)" }}>{v({ width: "100%", height: "100%", objectFit: "cover" }, true)}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>{v({ width: "100%", height: "100%", objectFit: "contain" })}</AbsoluteFill>
    </AbsoluteFill>
  ) : (
    <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%` }}>{v({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
  );
  return grade ? <ColdGrade>{pic}</ColdGrade> : pic;
};

// ---------------------------------------------------------------- DateType_N2: date + place typed WITH the spoken words
// Abyssal STUDY §E2 (typed as spoken ~18 char/s, block cursor, 0.85 s fade) adapted: left-aligned lockup, Archivo date, tracked place line,
// mono coordinates, amber caret (thin, not a block), no blur box: a soft corner shade keeps it legible (>= 4.5:1 on lit footage).
export type TypedWord = { t: string; at: number; end: number }; // local frames of the spoken word
export const DateType_N2: React.FC<{ dur: number; date: TypedWord[]; place: TypedWord[]; coords?: string }> = ({ dur, date, place, coords }) => {
  const f = useCurrentFrame();
  assertN2("DateType_N2", dur);
  const typed = (ws: TypedWord[]) => ws.map((w, i) => {
    const n = Math.round(w.t.length * clamp01((f - w.at + 4) / Math.max(4, w.end - w.at)));
    return w.t.slice(0, n) + (i < ws.length - 1 && n === w.t.length && f >= ws[i + 1].at - 4 ? " " : "");
  }).join("");
  const d = typed(date), p = typed(place);
  const lastEnd = Math.max(...[...date, ...place].map((w) => w.end));
  const out = EI.cam(clamp01((f - (dur - 18)) / 18));
  const shade = EI.land(clamp01(f / 12)) * (1 - out);
  const started = (ws: TypedWord[]) => Math.max(-1, ...ws.filter((w) => f >= w.at - 4).map((w) => w.at));
  const typingP = started(place) > started(date);
  const caretOn = f < lastEnd ? 1 : Math.floor((f - lastEnd) / 15) % 2 === 0 ? 1 : 0;
  const cu = EI.quick(clamp01((f - lastEnd) / 16));
  const caret = <span style={{ display: "inline-block", width: 4, height: "0.86em", marginLeft: 6, verticalAlign: "-0.06em", background: IC.amber, opacity: caretOn * (1 - out), boxShadow: `0 0 8px ${IC.amber}` }} />;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 0% 100%, rgba(0,6,16,.62) 0%, rgba(0,6,16,0) 70%)", opacity: shade }} />
      <div style={{ position: "absolute", left: 128, bottom: 150, opacity: 1 - out, filter: `blur(${out * 3}px)` }}>
        <div style={{ ...T.name(76), color: IC.ice, textShadow: NAME_SHADOW, minHeight: 76 }}>{d}{!typingP && caret}</div>
        <div style={{ ...T.label(25, 560), color: IC.frost, marginTop: 14, textShadow: NAME_SHADOW, minHeight: 30 }}>{p}{typingP && caret}</div>
        {coords && <div style={{ ...T.mono(17, 500), color: "rgba(169,216,236,.72)", marginTop: 10, opacity: cu, transform: `translateY(${(1 - cu) * 6}px)` }}>{coords}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- NameTag_N2 (first mention of a key person only)
export const NameTag_N2: React.FC<{ dur: number; name: string; role: string }> = ({ dur, name, role }) => {
  const f = useCurrentFrame();
  assertN2("NameTag_N2", dur);
  const rule = EI.quick(clamp01(f / 10)), slide = EI.quick(clamp01((f - 4) / 14)), roleU = EI.quick(clamp01((f - 10) / 14));
  const out = EI.cam(clamp01((f - (dur - 10)) / 10));
  return (
    <div style={{ position: "absolute", left: 128, bottom: 160, display: "flex", alignItems: "stretch", gap: 18 }}>
      <div style={{ width: 4, background: IC.amber, transform: `scaleY(${rule * (1 - out)})`, transformOrigin: "50% 100%", boxShadow: `0 0 10px ${IC.amber}` }} />
      <div style={{ overflow: "hidden", paddingRight: 30 }}>
        <div style={{ ...T.name(58), color: IC.ice, textShadow: NAME_SHADOW, transform: `translateX(${(-1 + slide) * 110 - out * 110}%)` }}>{name}</div>
        <div style={{ ...T.label(20, 560), color: IC.frost, marginTop: 8, opacity: roleU * (1 - out), textShadow: NAME_SHADOW }}>{role}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- PageRise_N2: real page excerpt rising out of the dark
// Abyssal §E5 (flat excerpt rises from below, 1.3 s ease-out, then drifts -0.2 % H/s; marker wipes WITH the words) + VV page line focus
// (the highlighted line full ink, the rest of the page veiled). Background = the current footage, cold, blurred 18 px, 40 % brightness.
export type PageBox = { x0: number; y0: number; x1: number; y1: number; at: number; end: number }; // image px, local frames
// motion "burst" (VV MOTION §6, measured 1:32.51 / 5:13.86): no rise, the card is on screen from the cut and the camera pushes toward the
// marked line with a velocity ramp (x1.28 per 2 f to a peak at +1.05 s, then decay tau 1.45 s), still moving at the cut. Use it to vary
// consecutive pages (Smoothness_Guide §6: never the same page entry twice in a row).
const vvProg = (fr: number) => { let a = 0; for (let k = 0; k < fr; k++) { const t = k / 30; a += t < 1.05 ? Math.pow(1.28, (t - 1.05) * 12) : Math.exp(-(t - 1.05) / 1.45); } return a; };
export const PageRise_N2: React.FC<{ dur: number; src: string; imgW: number; imgH: number; focusY: number; boxes: PageBox[]; bg?: string; bgFrom?: number; cropX?: [number, number]; motion?: "rise" | "burst" }> = ({ dur, src, imgW, imgH, focusY, boxes, bg, bgFrom = 0, cropX = [0.04, 0.70], motion = "rise" }) => {
  const f = useCurrentFrame();
  assertN2(motion === "burst" ? "PageBurst_N2" : "PageRise_N2", dur);
  const burst = motion === "burst" ? Math.exp(0.0040 * vvProg(f)) : 1; // ~x1.18 over 4 s: the card stays inside the frame
  const rise = motion === "burst" ? 1 : EI.land(clamp01(f / 39));
  const viewW = (cropX[1] - cropX[0]) * imgW; // image px shown across the card
  const cardW = 1500, k = cardW / viewW, cardH = 640;
  const drift = 1 + 0.004 * (f / 30);
  const ty = lerp(1080 * 0.42, 0, rise) - 0.002 * 1080 * (f / 30);
  const top = focusY * k - cardH * 0.48; // image y (in card px) at the card's top
  const fb = boxes[0];
  return (
    <AbsoluteFill>
      {bg && <AbsoluteFill style={{ filter: "blur(18px) brightness(0.4)", transform: "scale(1.08)" }}><Shot src={bg} from={bgFrom} push={0.01} /></AbsoluteFill>}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,10,24,0) 30%, rgba(0,4,12,.7) 100%)" }} />
      <div style={{ position: "absolute", left: 960 - cardW / 2, top: 540 - cardH / 2, width: cardW, height: cardH, overflow: "hidden", opacity: motion === "burst" ? 1 : clamp01(f / 8),
        transform: `translateY(${ty}px) scale(${lerp(0.9, 1, rise) * (motion === "burst" ? burst : drift)})`, boxShadow: "0 40px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.06)", background: "#F4F7F9" }}>
        <div style={{ position: "absolute", left: -cropX[0] * imgW * k, top: -top, width: imgW * k, height: imgH * k }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", filter: "saturate(0.85)" }} />
          {boxes.map((b, i) => {
            const u = EI.smooth(clamp01((f - b.at) / Math.max(6, b.end - b.at)));
            return <div key={i} style={{ position: "absolute", left: b.x0 * k - 4, top: b.y0 * k + (b.y1 - b.y0) * k * 0.08, height: (b.y1 - b.y0) * k * 0.86, width: ((b.x1 - b.x0) * k + 8) * u, background: IC.amber, mixBlendMode: "multiply", opacity: 0.62 }} />;
          })}
        </div>
        {/* line focus: veil above and below the highlighted line */}
        {fb && (() => { const y0 = fb.y0 * k - top - 14, y1 = fb.y1 * k - top + 14, v = EI.cam(clamp01((f - fb.at + 10) / 16)) * 0.62; return (<>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: Math.max(0, y0), background: `rgba(244,247,249,${v})` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: y1, bottom: 0, background: `rgba(244,247,249,${v})` }} />
        </>); })()}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,0) 12%, rgba(0,0,0,0) 88%, rgba(0,0,0,.10))" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- SonarMap_N2: public-domain satellite in the channel's cold duotone + sonar ping
// VV26 snap-zoom (log burst, EZ tankBurst class) then +1.2 %/s drift; the pin is a SONAR PING (amber core, 3 rings expanding/fading,
// one every 0.9 s). Place + coords sit beside it, no plate. Optional STAGE 2 (DD Dashcam satellite "second look", 2026-10-25 v2): the camera
// glides (EI.cam 1.2 s) to a second framing and an amber dashed line draws between two image points (e.g. the runway's extended centreline
// to the crash pin) WITH the spoken words. Positions are fractions of the 16:9 image.
export type MapStage2 = { at: number; z: number; c: [number, number]; line?: [[number, number], [number, number]]; lineDur?: number };
export const SonarMap_N2: React.FC<{ dur: number; src: string; pin: [number, number]; place: string; coords: string; z0?: number; z1?: number; stage2?: MapStage2 }> = ({ dur, src, pin, place, coords, z0 = 1.0, z1 = 1.55, stage2 }) => {
  const f = useCurrentFrame();
  assertN2(stage2 ? "SonarMap2_N2" : "SonarMap_N2", dur);
  const snap = EI.quick(clamp01(f / 24));
  const px = pin[0] * 1920, py = pin[1] * 1080;
  // stage 1 camera: centre leans 85 % of the way onto the pin as the zoom lands
  let s = lerpLog(z0, z1, snap) * (1 + 0.012 * Math.max(0, f - 24) / 30);
  let cx = lerp(960, px, 0.85 * (1 - 1 / s) / (1 - 1 / Math.max(z1, 1.0001))), cy = lerp(540, py, 0.85 * (1 - 1 / s) / (1 - 1 / Math.max(z1, 1.0001)));
  let u2 = 0;
  if (stage2) {
    u2 = EI.cam(clamp01((f - stage2.at) / 36));
    const s2 = stage2.z * (1 + 0.010 * Math.max(0, f - stage2.at - 36) / 30);
    s = lerpLog(s, s2, u2); cx = lerp(cx, stage2.c[0] * 1920, u2); cy = lerp(cy, stage2.c[1] * 1080, u2);
  }
  const scr = (x: number, y: number) => ({ x: 960 + (x - cx) * s, y: 540 + (y - cy) * s });
  const P = scr(px, py);
  const lab = EI.quick(clamp01((f - 22) / 16));
  const lu = stage2?.line ? EI.smooth(clamp01((f - stage2.at - 12) / (stage2.lineDur ?? 30))) : 0;
  const L0 = stage2?.line ? scr(stage2.line[0][0] * 1920, stage2.line[0][1] * 1080) : P, L1 = stage2?.line ? scr(stage2.line[1][0] * 1920, stage2.line[1][1] * 1080) : P;
  return (
    <AbsoluteFill style={{ background: IC.abyss, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`, transformOrigin: "0 0" }}>
        <Img src={staticFile(src)} style={{ width: 1920, height: 1080, objectFit: "cover", filter: "grayscale(1) contrast(1.25) brightness(0.92)" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0B3768, #04142E)", mixBlendMode: "multiply", opacity: 0.85 }} />
        <AbsoluteFill style={{ background: "#7FD3F2", mixBlendMode: "soft-light", opacity: 0.28 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,4,12,.75) 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {lu > 0 && <line x1={L0.x} y1={L0.y} x2={lerp(L0.x, L1.x, lu)} y2={lerp(L0.y, L1.y, lu)} stroke={IC.amber} strokeWidth={3} strokeDasharray="14 10" opacity={0.92} style={{ filter: `drop-shadow(0 0 6px ${IC.amber})` }} />}
        {[0, 1, 2].map((i) => { const k = ((f - 18 - i * 9) % 27 + 27) % 27, on = f >= 18 + i * 9; const u = k / 27; return on ? <circle key={i} cx={P.x} cy={P.y} r={10 + 150 * EI.land(u)} fill="none" stroke={IC.amber} strokeWidth={2} opacity={(1 - u) * 0.85} /> : null; })}
        <circle cx={P.x} cy={P.y} r={9 * EI.quick(clamp01((f - 14) / 8))} fill={IC.amber} />
        <circle cx={P.x} cy={P.y} r={3.5 * EI.quick(clamp01((f - 14) / 8))} fill="#fff" />
        {place && <line x1={P.x + 16} y1={P.y} x2={P.x + 16 + 90 * lab} y2={P.y} stroke={IC.frost} strokeWidth={1.5} opacity={0.8} />}
      </svg>
      {place && <div style={{ position: "absolute", left: P.x + 122, top: P.y - 34, opacity: lab, transform: `translateX(${(1 - lab) * -14}px)`, whiteSpace: "nowrap" }}>
        <div style={{ ...T.name(60), color: IC.ice, textShadow: NAME_SHADOW }}>{place}</div>
        <div style={{ ...T.mono(19, 500), color: IC.frost, marginTop: 8, textShadow: NAME_SHADOW }}>{coords}</div>
      </div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- RawSub_N2: subtitles on raws (genuine clip sound), per phrase
export type SubLine = { t: string; at: number; end: number; who?: string; tr?: boolean }; // tr = translated
export const RawSub_N2: React.FC<{ lines: SubLine[] }> = ({ lines }) => {
  const f = useCurrentFrame();
  lines.forEach((l) => assertN2("RawSub_N2", l.end - l.at));
  const l = lines.find((x) => f >= x.at && f < x.end);
  if (!l) return null;
  const a = Math.min(clamp01((f - l.at) / 3), clamp01((l.end - f) / 3));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 72%, rgba(0,4,10,.42) 100%)", opacity: a }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 92, textAlign: "center", opacity: a }}>
        {l.who && <div style={{ ...T.mono(16, 600), color: IC.amber, marginBottom: 8, letterSpacing: "0.18em" }}>{l.who.toUpperCase()}{l.tr ? <span style={{ color: IC.frost }}>{"  ·  TRANSLATED"}</span> : null}</div>}
        <div style={{ fontFamily: T.label(10).fontFamily, fontWeight: 620, fontSize: 48, fontVariationSettings: "'wdth' 92, 'wght' 620", color: "#fff", textShadow: "0 2px 3px rgba(0,0,0,.9), 0 0 18px rgba(0,0,0,.6)", maxWidth: 1400, margin: "0 auto", lineHeight: 1.18 }}>{l.t}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- DepthCut_N2: the channel transition (refraction ripple through cold light)
// Built from the Smoothness_Guide exposure-flash spec (ramp 6-14 f, peak on the cut, decay 8-12 f) but with a water refraction ripple instead
// of white: the outgoing picture ripples and cools, the incoming one settles out of the ripple. 14 f total, <= 3 per minute.
export const DepthCut_N2: React.FC<{ a: React.ReactNode; b: React.ReactNode; cut: number; len?: number }> = ({ a, b, cut, len = 14 }) => {
  const f = useCurrentFrame();
  assertN2("DepthCut_N2", len);
  const h = len / 2, u = clamp01((f - (cut - h)) / len); // 0..1 across the transition
  const amp = Math.sin(Math.PI * u) * 46, lift = Math.sin(Math.PI * u) * 0.32;
  const showB = f >= cut;
  const id = `dc${cut}`;
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.03" numOctaves={2} seed={3 + Math.floor(f / 2)} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={amp} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: amp > 0.5 ? `url(#${id}) brightness(${1 + lift}) saturate(${1 - lift})` : undefined }}>{showB ? b : a}</AbsoluteFill>
      <AbsoluteFill style={{ background: "#BDEBFF", mixBlendMode: "screen", opacity: lift * 0.55 }} />
    </AbsoluteFill>
  );
};

/** DepthCut as a wrapper: the ripple + cold lift is applied to whatever the children show (both sides keep their own timelines). */
export const DepthCutWrap: React.FC<{ cut: number; len?: number; children: React.ReactNode }> = ({ cut, len = 14, children }) => {
  const f = useCurrentFrame();
  assertN2("DepthCut_N2", len);
  const u = clamp01((f - (cut - len / 2)) / len), amp = Math.sin(Math.PI * u) * 46, lift = Math.sin(Math.PI * u) * 0.32;
  const id = `dcw${cut}`;
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.03" numOctaves={2} seed={3 + Math.floor(f / 2)} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={amp} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: amp > 0.5 ? `url(#${id}) brightness(${1 + lift}) saturate(${1 - lift})` : undefined }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "#BDEBFF", mixBlendMode: "screen", opacity: lift * 0.55 }} />
    </AbsoluteFill>
  );
};
