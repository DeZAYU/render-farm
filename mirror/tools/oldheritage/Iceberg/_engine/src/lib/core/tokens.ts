// Template Library core tokens. Extracted from Waterpark v4 (remotion/src/wp3/refsys.tsx) + study/visualventure_tv/MOTION.md + study/fonts/FONTS.md.
// Rule 0 (V3_FIX_BRIEF): Disturbing Dose base look + Nocturn technique; VV/Farrell/Abyssal/SIRIUS only where DD and Nocturn have no device.
import { Easing } from "remotion";

export const W = 1920, H = 1080, FPS = 30;

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, x: number) => clamp01((x - a) / (b - a));
/** log-space interpolation (zoom / scale moves always interpolate in log space) */
export const lerpLog = (a: number, b: number, t: number) => Math.exp(lerp(Math.log(a), Math.log(b), t));

/** reference colours (sampled in the studies; refsys.tsx RC + MOTION.md cores) */
export const RC = {
  d1Red: "#EB1819", // D1 E1
  labelRed: "#F9090F", // D1 date-label year core
  placeRed: "#F22522", // D3 place-label red word
  hudRed: "#EF020C", // D1 HUD bracket callout
  lineRed: "#FF1A1A", // D1 E4 / E10 leader line + box stroke
  ringRed: "#E30A10", // D3 E3 circle
  ringCore: "#C8060A", // D1 E5 tracked-ring core
  pageRed: "#E01E1E", // D1 E9 page highlight bar
  inkRed: "#ED001A", // red "ink" words (lighten over black text)
  caseRedTop: "#D61E18", caseRedMid: "#B81209", caseRedBot: "#870608", // D3 case number gradient
  tileRed: "#C00010", // D3 wall tile
  wallRed: "#D21A1F", // title wall red line (ours, Bebas) / #AA191D Lacquer
  vvRed: "#D90008", // VV red sentence
  vvYellow: "#DCEB0B", // VV slam / pop yellow
  vvHighlight: "#D5DE10", // VV §6 highlighter
  vvAmber: "#D0B53E", // VV §3 date-card subtitle
  vvTeal: "#62DACA", // VV §5 neon name
  vvChapterBox: "#EA0016", // VV §1 chapter box
  abYellow: "#F5B800", // Abyssal E5 marker
  cavingRed: "#FC0E11", // Caving watch-page bar
  farrellRedLed: "#ED0000", // Farrell 7-seg
  farrellCyan: "#0AB7BC", // Farrell map outline
  neonWhite: "#FDFCFD", // VV §7 neon white
  white: "#FFFFFF",
  offWhite: "#F2F2F2",
  ink: "#07090B",
};

/** measured easings (MOTION.md section in brackets). All return clamped 0..1 */
const bz = (a: number, b: number, c: number, d: number) => {
  const e = Easing.bezier(a, b, c, d);
  return (x: number) => e(clamp01(x));
};
export const EZ = {
  out3: (x: number) => 1 - Math.pow(1 - clamp01(x), 3),
  out2: (x: number) => 1 - Math.pow(1 - clamp01(x), 2),
  in2: (x: number) => Math.pow(clamp01(x), 2),
  in3: (x: number) => Math.pow(clamp01(x), 3),
  quick: bz(0.31, 0, 0.0, 0.957), // VV §11 phase A: quick start / long settle
  settle: bz(0.242, 0, 0.0, 1.0), // VV §11 phase C
  phaseB: bz(0.185, 0, 0.021, 0.619), // VV §11 phase B
  chapterScale: bz(0.054, 0.096, 0.178, 0.711), // VV §1 recession
  chapterRise: bz(0.133, 0.16, 0.205, 0.683), // VV §1 rise
  chapterBox: bz(0.404, 0.252, 0.291, 0.94), // VV §1 title box
  dateSlide: bz(0.221, 0.496, 0.454, 1.01), // VV §3 subtitle slide
  photoPull: bz(0.559, 0, 0.181, 0.609), // VV §5 pull-back
  photoRot: bz(0.0, 0.45, 0.4, 1.0), // VV §5 rotation
  photoY: bz(0.503, 0, 0.201, 0.819), // VV §5 drop
  nameWipe: bz(0.466, 0.663, 0.856, 0.968), // VV §5 name wipe
  hlWipe: bz(0.15, 0.6, 0.35, 1), // VV §6 highlighter
  commentScroll: bz(0.267, 0.094, 0.003, 0.998), // VV §12
  tankBurst: bz(0.326, 0, 0.143, 0.807), // VV §7 tank (log-zoom)
  tvPull: bz(0.522, 0.672, 1, 1), // VV §7 TV pull-back
  gunPush: bz(0.39, 0, 0.59, 0.64), // VV §7 accelerating push
  ddCam: bz(0.45, 0, 0.2, 1), // DD V1 corkboard camera
  ddScroll: bz(0.5, 0, 0.12, 1), // DD V3 E4 scroll
  punch: bz(0.33, 0, 0.12, 1), // D1 E6 look-here punch-in
  move: bz(0.55, 0, 0.12, 1), // page move (wp3 sec C)
  inout: bz(0.45, 0, 0.25, 1), // the only "in-out": camera moves between two held items
  hardOut: bz(0.015, -0.151, 0.012, 0.998), // VV §13 "?" rise
};

/** seeded PRNG (mulberry32) */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
/** stateless hash -> 0..1 */
export const hash = (a: number) => {
  const h = Math.sin(a * 12.9898 + 78.233) * 43758.5453;
  return h - Math.floor(h);
};
