// OHF_PanelIntro — the owner's own channel intro (Old Heritage Files, mwYeratelA0 0-17 s; _ref/IntroRef/INTRO_REF.md), rebuilt as a device:
//  1. PanelMontage: the video's strongest case clips, ~1.5-2.9 s each, each as a centred portrait / 4:3 panel (full height) over a heavily
//     blurred, colour-bloomed copy of itself (or full frame for wide shots); light VHS dropout dashes + faint scanlines over everything;
//     thin horizontal glitch slices on the cuts; optional short white flashes on chosen cuts.
//  2. DiscretionCard: "Viewer discretion / is highly advised" in a clean geometric sans (Montserrat 600, ~124 px, white, two lines centred)
//     on a dark grey scratched / noisy plate with VHS dropouts; text comes up grey -> white, goes back to grey at the end.
//  3. CaseCard: pure black, big red heavy condensed number line ("CASE 01", D-DIN Condensed Bold, ~208 px, #F20505) typed on word by word,
//     the name / place under it in red D-DIN Condensed caps typed letter by letter; glitch slices + white flash out at the end.
// Measured on the reference frames (1920x1080): CASE 01 caps 364-511 px, x 666-1257; subtitle caps ~655-718 px, x 150-1775; discretion
// lines 363-493 / 574-739 px, x 96-1814; red = (240, 4, 4).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../lib/core/type";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const F = (s: number) => Math.round(s * 30);
export const OHF_RED = "#F00505";

let mont: Promise<void> | null = null;
const useMontserrat = () => {
  const [h] = React.useState(() => delayRender("Montserrat"));
  React.useEffect(() => {
    if (!mont) mont = new FontFace("OHFMont", `url(${staticFile("fonts/Montserrat-VariableFont_wght.ttf")})`, { weight: "100 900" }).load().then((ft) => { document.fonts.add(ft); });
    mont.then(() => continueRender(h));
  }, [h]);
};

// ------------------------------------------------------------------ VHS dropouts (thin bright dashes, new pattern every frame)
export const VhsDropouts: React.FC<{ n?: number; amt?: number; seed?: string }> = ({ n = 26, amt = 1, seed = "v" }) => {
  const f = useCurrentFrame();
  const k = Math.floor(f / 2); // reference dashes hold ~2 frames
  const bars = Array.from({ length: n }, (_, i) => {
    const r = (j: number) => random(`${seed}-${k}-${i}-${j}`);
    const row = Math.floor(r(1) * 9); // dashes cluster on a few scan rows, like the reference
    return { x: r(2) * 1920, y: 60 + row * 112 + r(3) * 40, w: 18 + r(4) * r(4) * 150, o: (0.18 + r(5) * 0.42) * amt, h: r(6) < 0.8 ? 2 : 3 };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.10) 0px, rgba(0,0,0,.10) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)", opacity: amt }} />
      {bars.map((b, i) => <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 1,
        background: "linear-gradient(90deg, rgba(235,235,235,0), rgba(235,235,235,1) 12%, rgba(235,235,235,1) 88%, rgba(235,235,235,0))", opacity: b.o }} />)}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ glitch slices (copies of a layer in thin horizontal bands, shoved sideways)
const Slices: React.FC<{ k: number; amt: number; seed: string; children: React.ReactNode }> = ({ k, amt, seed, children }) => {
  if (amt <= 0) return null;
  const n = 5;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const r = (j: number) => random(`${seed}-${k}-${i}-${j}`);
        const y = r(1) * 1000, h = 6 + r(2) * r(2) * 70, dx = (r(3) - 0.5) * 2 * (60 + r(4) * 260) * amt;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${y}px 0px ${Math.max(0, 1080 - y - h)}px 0px)`, transform: `translateX(${dx}px)`, filter: "brightness(1.35) contrast(1.15)" }}>
            {children}
          </AbsoluteFill>
        );
      })}
      {Array.from({ length: 3 }, (_, i) => {
        const r = (j: number) => random(`${seed}-w-${k}-${i}-${j}`);
        const y = r(1) * 1060, w = 300 + r(2) * 1100, x = r(3) * (1920 - w);
        return <div key={"w" + i} style={{ position: "absolute", left: x, top: y, width: w, height: 3 + r(4) * 9, opacity: 0.55 * amt,
          background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.95) 8%, rgba(220,220,230,.7) 50%, rgba(255,255,255,.95) 92%, rgba(255,255,255,0))" }} />;
      })}
    </>
  );
};

// ------------------------------------------------------------------ one montage clip
export type PClip = {
  id: string; src: string; still?: boolean;
  start: number; end: number;   // global seconds
  from?: number;                // second in the file at `start`
  w?: number;                   // panel width px (1920 = full frame)
  pos?: string;                 // objectPosition inside the panel
  push?: number;                // panel push over the clip (default 0.05)
  z0?: number; origin?: string; // base zoom + its origin (e.g. crop a date stamp off one edge)
  flashIn?: boolean;            // short white flash on the cut into this clip
};

const ClipLayer: React.FC<{ c: PClip; dur: number }> = ({ c, dur }) => {
  const f = useCurrentFrame();
  const w = c.w ?? 1440, full = w >= 1900;
  const t = Math.min(1, f / Math.max(1, dur));
  const z = (c.z0 ?? 1) * (1 + (c.push ?? 0.05) * (1 - Math.pow(1 - t, 1.6)));
  const media = (style: React.CSSProperties) => c.still
    ? <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
    : <OffthreadVideo src={staticFile(c.src)} muted startFrom={F(c.from ?? 0)} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  const panel = (
    <div style={{ position: "absolute", left: (1920 - w) / 2, top: 0, width: w, height: 1080, overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${z})`, transformOrigin: c.origin ?? "50% 50%" }}>{media({ objectPosition: c.pos ?? "50% 50%" })}</div>
    </div>
  );
  // cut glitch: first 4 / last 3 frames of the clip
  const gIn = interpolate(f, [0, 4], [1, 0], cl), gOut = interpolate(f, [dur - 3, dur], [0, 1], cl);
  const g = Math.max(gIn, gOut);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {!full && <AbsoluteFill style={{ transform: "scale(1.25)" }}>
        {media({ filter: "blur(46px) saturate(1.9) brightness(1.18) contrast(1.05)", objectPosition: c.pos ?? "50% 50%" })}
      </AbsoluteFill>}
      {!full && <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(255,240,225,.10), rgba(0,0,0,.18) 100%)" }} />}
      {panel}
      <Slices k={f} amt={g} seed={c.id}>{panel}</Slices>
    </AbsoluteFill>
  );
};

export const PanelMontage: React.FC<{ clips: PClip[]; seed?: string }> = ({ clips, seed = "m" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {clips.map((c) => {
        const a = F(c.start), d = F(c.end) - a;
        return <Sequence key={c.id} from={a} durationInFrames={d} layout="none"><ClipLayer c={c} dur={d} /></Sequence>;
      })}
      <VhsDropouts seed={seed} amt={0.85} />
      {clips.filter((c) => c.flashIn).map((c) => {
        const o = interpolate(f, [F(c.start) - 2, F(c.start), F(c.start) + 6], [0, 0.92, 0], cl);
        return o > 0 ? <AbsoluteFill key={"fl" + c.id} style={{ background: "#fff", opacity: o }} /> : null;
      })}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ "Viewer discretion is highly advised"
export const DiscretionCard: React.FC<{ dur: number; lines?: [string, string] }> = ({ dur, lines = ["Viewer discretion", "is highly advised"] }) => {
  useMontserrat();
  const f = useCurrentFrame();
  const up = interpolate(f, [0, 12], [0, 1], cl), down = interpolate(f, [dur - 8, dur], [1, 0], cl);
  const lum = Math.round(interpolate(Math.min(up, down), [0, 1], [130, 255]));
  const op = interpolate(f, [0, 3], [0.4, 1], cl) * interpolate(f, [dur - 3, dur], [1, 0.5], cl);
  const z = 1 + 0.025 * (f / dur);
  const g = Math.max(interpolate(f, [0, 3], [1, 0], cl), interpolate(f, [dur - 3, dur], [0, 1], cl));
  const text = (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${z})` }}>
      <div style={{ fontFamily: "OHFMont", fontWeight: 600, fontSize: 166, lineHeight: "212px", letterSpacing: "0.055em", textAlign: "center",
        color: `rgb(${lum},${lum},${lum})`, opacity: op, marginTop: -6, textShadow: "0 2px 10px rgba(0,0,0,.4)" }}>
        {lines[0]}<br />{lines[1]}
      </div>
    </AbsoluteFill>
  );
  const k = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{ background: "#1b1b1c", overflow: "hidden" }}>
      {/* plate: soft uneven grey, darker edges */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 48% 55%, #2a2829 0%, #1e1d1e 55%, #0f0f10 100%)" }} />
      {/* scratches: a few fine vertical hairlines that jump every couple of frames */}
      {Array.from({ length: 4 }, (_, i) => {
        const r = (j: number) => random(`sc-${k}-${i}-${j}`);
        return r(0) < 0.6 ? <div key={i} style={{ position: "absolute", left: r(1) * 1920, top: r(2) * 300, width: 1, height: 400 + r(3) * 700, background: "rgba(200,200,200,.12)" }} /> : null;
      })}
      {/* noise */}
      <AbsoluteFill style={{ opacity: 0.22, mixBlendMode: "screen" }}>
        <svg width="1920" height="1080"><filter id={`dn${k}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={k % 50} /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="1920" height="1080" filter={`url(#dn${k})`} opacity={0.5} /></svg>
      </AbsoluteFill>
      {text}
      <Slices k={f} amt={g} seed="disc">{text}</Slices>
      <VhsDropouts seed="disc" n={34} amt={1} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ CASE 01 / name / place  (pure black, red condensed)
export const CaseCard: React.FC<{ dur: number; big: string; sub: string; flashOut?: number }> = ({ dur, big, sub, flashOut = 9 }) => {
  const f = useCurrentFrame();
  const words = big.split(" ");
  const nW = f < 5 ? 1 : words.length;                        // "CASE" ... "CASE 01" (reference types it on in two beats)
  const nS = Math.floor(interpolate(f, [1, 13], [0, sub.length], cl)); // subtitle letter by letter
  const z = interpolate(f, [0, 10], [1.035, 1], { ...cl, easing: (x) => 1 - Math.pow(1 - x, 3) }) * (1 + 0.012 * (f / dur));
  const g = interpolate(f, [dur - flashOut - 5, dur - flashOut], [0, 1], cl) * interpolate(f, [dur - flashOut, dur - flashOut + 4], [1, 0.4], cl);
  const flash = interpolate(f, [dur - flashOut, dur - flashOut + 4, dur], [0, 1, 1], cl);
  const card = (
    <AbsoluteFill style={{ transform: `scale(${z})` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 322, textAlign: "center", fontFamily: FONT.dinCond, fontWeight: 700, fontSize: 210,
        lineHeight: "230px", color: OHF_RED, letterSpacing: "0.03em" }}>
        {words.slice(0, nW).join(" ")}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 636, textAlign: "center", fontFamily: FONT.dinCond, fontWeight: 400, fontSize: 88,
        lineHeight: "100px", color: OHF_RED, whiteSpace: "pre", letterSpacing: "0.045em" }}>
        <span>{sub.slice(0, nS)}</span><span style={{ opacity: 0 }}>{sub.slice(nS)}</span>
      </div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {card}
      <Slices k={f} amt={g} seed="case">{card}</Slices>
      <VhsDropouts seed="case" n={10} amt={0.35 + g * 0.65} />
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash }} />}
    </AbsoluteFill>
  );
};
