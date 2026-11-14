// Typography: font loader + cap-height sizing + the Dashcam rounded label recipe (study/fonts/FONTS.md).
import React from "react";
import { continueRender, delayRender, getRemotionEnvironment, staticFile, useCurrentFrame } from "remotion";
import { LIB_PATHS } from "./config";

/** the only fonts the library may use (FONTS.md). Family names as used in CSS. */
export const FONT = {
  round: "Varela Round", // Dashcam labels (Arial Rounded MT Bold surrogate, with the round stroke)
  nunito: "Nunito", // case number 900, wall tiles 800, captions 700/600
  lacquer: "Lacquer", // title wall drip face (YouMurderer BB surrogate)
  bebas: "Bebas Neue", // VV condensed titles / chapter box
  oswald: "Oswald", // Bebas Neue Light surrogate (wght 200)
  inter: "Inter", // Helvetica class: HUD, File Viewer, VV sentences, quotes
  vcr: "VCR OSD Mono", // Abyssal VHS dates
  courier: "Courier Prime", // typewriter / level cards
  orbitron: "Orbitron", // Eurostile Extended surrogate
  din: "D-DIN", // owner house font (2026-10-11 "D-DIN from now on"); Dashcam "INSTRUMENT" text face, 400/700
  dinCond: "D-DIN Condensed", // Dashcam labels in tight slots, 400/700
  dinExp: "D-DIN Exp", // Dashcam OSD numerals / case number, 700
  archivo: "Archivo", // N2 / IC channel (algrow 2): chart names wdth 62 wght 800, labels wdth 100 wght 500-600 (variable: wdth 62-125, wght 100-900)
  mono: "JetBrains Mono", // N2 / IC channel: data lines (level index, coordinates), 400-600
} as const;

/** cap-height / em ratios (FONTS.md): fontSize = cap / ratio */
export const CAP = { round: 0.708, nunito: 0.714, lacquer: 0.726, bebas: 0.7, oswald: 0.81, inter: 0.727, vcr: 0.683, courier: 0.58, orbitron: 0.72, din: 0.69, dinCond: 0.69, dinExp: 0.69, archivo: 0.716, mono: 0.73 } as const;
export const fs = (font: keyof typeof CAP, cap: number) => cap / CAP[font];

const FONTS: [string, string, FontFaceDescriptors][] = [
  [FONT.round, "VarelaRound-Regular.ttf", {}],
  [FONT.nunito, "Nunito-VariableFont_wght.ttf", { weight: "200 1000" }],
  [FONT.lacquer, "Lacquer-Regular.ttf", {}],
  [FONT.bebas, "BebasNeue-Regular.ttf", {}],
  [FONT.oswald, "Oswald-VariableFont_wght.ttf", { weight: "200 700" }],
  [FONT.inter, "Inter-VariableFont_opsz_wght.ttf", { weight: "100 900" }],
  [FONT.vcr, "VCR_OSD_MONO.ttf", {}],
  [FONT.courier, "CourierPrime-Bold.ttf", { weight: "700" }],
  [FONT.orbitron, "Orbitron-VariableFont_wght.ttf", { weight: "400 900" }],
  [FONT.din, "D-DIN.otf", { weight: "400" }],
  [FONT.din, "D-DIN-Bold.otf", { weight: "700" }],
  [FONT.dinCond, "D-DINCondensed.otf", { weight: "400" }],
  [FONT.dinCond, "D-DINCondensed-Bold.otf", { weight: "700" }],
  [FONT.dinExp, "D-DINExp-Bold.otf", { weight: "700" }],
  [FONT.archivo, "Archivo-wdth-wght.ttf", { weight: "100 900", stretch: "62% 125%" }],
  [FONT.mono, "JetBrainsMono-wght.ttf", { weight: "100 800" }],
];
// ---------------------------------------------------------------- font readiness (M: text must never be measured before its font is loaded)
// 1) LibFontGate loads every library font (allSettled: one failing file can no longer release the gate early), then waits until
//    document.fonts.check() is true for every family before rendering anything.
// 2) measure()/RoundText are self-guarding: if a font is still not usable when text is measured (e.g. a template mounted outside the
//    gate), measure() holds the frame with delayRender, loads that font, bumps a global "font epoch" and only then releases the frame;
//    LibFontGate re-keys its subtree on every epoch, and RoundText subscribes to it, so everything is re-measured with the real font.
let fontEpoch = 0;
const epochListeners = new Set<(n: number) => void>();
const pendingFonts = new Map<string, Promise<void>>();
const bumpEpoch = () => { fontEpoch += 1; epochListeners.forEach((l) => l(fontEpoch)); };
const fontsApi = () => (typeof document !== "undefined" ? (document.fonts as FontFaceSet | undefined) : undefined);
/** true when the CSS font string can be used for measuring right now */
let probeCtx: CanvasRenderingContext2D | null = null;
const PROBE = "mmmWWWiiil1.QAg@";
/** the quoted family of a CSS font string ('700 40px "Inter"' -> Inter) */
const familyOf = (font: string) => font.match(/"([^"]+)"/)?.[1];
/** TRUE only when the face is really in use: document.fonts.check() can say true in a fresh render tab while canvas still falls back.
 *  So we measure the probe with the family + a monospace fallback and + a serif fallback: identical widths = the real face is drawing. */
export const fontUsable = (font: string) => {
  if (typeof document === "undefined") return true;
  const fam = familyOf(font);
  if (!fam) return true;
  if (!probeCtx) probeCtx = document.createElement("canvas").getContext("2d");
  const base = font.replace(/"[^"]+"/, "").trim().replace(/\s+$/, "");
  probeCtx!.font = `${base} "${fam}", monospace`;
  const a = probeCtx!.measureText(PROBE).width;
  probeCtx!.font = `${base} "${fam}", serif`;
  const b = probeCtx!.measureText(PROBE).width;
  return Math.abs(a - b) < 0.5;
};
/** wait (rAF polling, max ms) until the face really draws */
const waitUsable = (font: string, ms = 8000) => new Promise<boolean>((res) => {
  const t0 = performance.now();
  const tick = () => { if (fontUsable(font)) res(true); else if (performance.now() - t0 > ms) res(false); else requestAnimationFrame(tick); };
  tick();
});
/** make sure `font` is loaded; while it is not, the current frame is held (delayRender) and the epoch is bumped when it lands */
export const ensureFont = (font: string) => {
  const fsx = fontsApi();
  if (!fsx || fontUsable(font) || pendingFonts.has(font)) return;
  const h = delayRender(`font ${font}`, { timeoutInMilliseconds: 60000 });
  const p = fsx.load(font).then(() => undefined, (e) => console.error("font load failed", font, e)).then(() => waitUsable(font)).then((ok) => {
    if (!ok) console.error("font still falls back after load:", font);
    pendingFonts.delete(font);
    bumpEpoch();
    requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); // let React re-measure + paint first
  });
  pendingFonts.set(font, p);
};
/** re-render the calling component whenever a late font lands */
export const useFontEpoch = () => {
  const [n, setN] = React.useState(fontEpoch);
  React.useEffect(() => { epochListeners.add(setN); if (n !== fontEpoch) setN(fontEpoch); return () => { epochListeners.delete(setN); }; }, [n]);
  return n;
};

/** wrap every composition that uses library templates (loads all library fonts once, blocks render until they are usable) */
// fonts are loaded ONCE per page (tab); every LibFontGate (nested, re-mounted per frame) shares the same promise
let libFontsReady = false;
let libFontsPromise: Promise<void> | null = null;
const loadLibFonts = () => {
  if (libFontsPromise) return libFontsPromise;
  const fsx = document.fonts as unknown as FontFaceSet & { add: (x: FontFace) => void };
  libFontsPromise = Promise.allSettled(FONTS.map(([fam, file, d]) => new FontFace(fam, `url(${staticFile(LIB_PATHS.fonts + file)})`, d).load().then((ff) => fsx.add(ff))))
    .then((rs) => { rs.forEach((r, i) => { if (r.status === "rejected") console.error("LibFontGate: font failed", FONTS[i][1], r.reason); }); })
    .then(() => Promise.allSettled(FONTS.map(([fam]) => fsx.load(`700 40px "${fam}"`))))
    .then(() => fsx.ready)
    .then(() => Promise.all(FONTS.map(([fam]) => waitUsable(`40px "${fam}"`))))
    .then(() => {
      const missing = FONTS.filter(([fam]) => !fontUsable(`40px "${fam}"`)).map(([fam]) => fam);
      if (missing.length) console.error("LibFontGate: fonts not usable after load:", missing.join(", "));
      libFontsReady = true;
    });
  return libFontsPromise;
};
/** wrap every composition that uses library templates (loads all library fonts once per tab, blocks render until they really draw) */
export const LibFontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = React.useState(libFontsReady);
  const [h] = React.useState(() => (libFontsReady ? null : delayRender("lib-fonts", { timeoutInMilliseconds: 60000 })));
  const epoch = useFontEpoch();
  React.useEffect(() => {
    if (h === null) return;
    loadLibFonts().then(() => { setReady(true); requestAnimationFrame(() => continueRender(h)); });
  }, [h]);
  // RENDER ONLY: re-create the whole subtree on every frame, so each frame starts from fresh DOM exactly like a single still.
  // Long-lived render tabs (concurrency > 1) otherwise reuse stale compositor rasters for text under animated transforms + filters
  // (c07/c13 openers: words drawn at the wrong scale and cut off). Studio playback keeps the normal reconciliation.
  const frame = Math.floor(useCurrentFrame());
  const rendering = getRemotionEnvironment().isRendering;
  return ready ? <React.Fragment key={rendering ? `${epoch}:${frame}` : epoch}>{children}</React.Fragment> : null;
};

let ctx2d: CanvasRenderingContext2D | null = null;
/** text width in px for a CSS font string, e.g. measure("Bali", `700 55px Inter`) */
export const measure = (t: string, font: string) => {
  ensureFont(font); // if the real face is not drawing yet: hold the frame, load it, bump the epoch -> everything re-measures
  if (!ctx2d) ctx2d = document.createElement("canvas").getContext("2d");
  ctx2d!.font = font;
  return ctx2d!.measureText(t).width;
};

/** FONTS.md recipe: Varela Round + round stroke in the fill colour = Arial Rounded MT Bold weight (all Dashcam labels).
 *  cap = target cap height in px. SVG so the joins are round (CSS text-stroke is mitred). */
export const RoundText: React.FC<{ text: string; cap: number; colour: string; style?: React.CSSProperties; weight?: number }> = ({ text, cap, colour, style, weight = 0.076 }) => {
  useFontEpoch(); // re-render when a late font lands
  const sw = weight * cap;
  const fsz = (cap - sw) / CAP.round;
  const asc = fsz * 0.92, desc = fsz * 0.26;
  const pad = sw / 2 + 2;
  // The box is sized by the BROWSER from the real text (a hidden HTML twin in the same face), not by a canvas measurement:
  // whatever font the page actually draws with, the box always fits the glyphs (multi-tab render race, c07/c13 clipped words).
  // The SVG draws the visible text on top (round stroke joins, FONTS.md recipe) and may overflow freely.
  return (
    <span style={{ position: "relative", display: "block", width: "max-content", height: asc + desc, ...style }}>
      <span aria-hidden style={{ display: "block", visibility: "hidden", whiteSpace: "pre", fontFamily: FONT.round, fontSize: fsz, lineHeight: `${asc + desc}px`, padding: `0 ${pad}px` }}>{text}</span>
      <svg width="100%" height={asc + desc} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <text x={pad} y={asc} fontFamily={FONT.round} fontSize={fsz} fill={colour} stroke={colour} strokeWidth={sw} strokeLinejoin="round" paintOrder="stroke">{text}</text>
      </svg>
    </span>
  );
};
/** width of a RoundText (for layout) */
export const roundWidth = (text: string, cap: number, weight = 0.076) => {
  const sw = weight * cap;
  return measure(text, `${(cap - sw) / CAP.round}px "${FONT.round}"`) + sw + 4;
};
