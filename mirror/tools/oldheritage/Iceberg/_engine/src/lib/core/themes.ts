// Themes. SUPERSEDED 2026-10-19: per-video identities were REJECTED by the owner. Every video uses the channel style = WATERPARK (below),
// which is the default of every themed template. Variety comes from sibling variants (*_A / *_B), never from a new palette or font family.
import { FONT } from "./type";

export type Theme = {
  id: string;
  accent: string; // key words, rings, trails, cursors
  accentGlow: string; // rgba glow of the accent
  neutral: string; // main type colour
  dim: string; // unlit digits, de-emphasised side
  plateDark: string; // translucent dark plate under type (never pure black: no text on black)
  text: { face: string; weight: number }; // body / labels
  title: { face: string; weight: number }; // places, titles
  light: { face: string; weight: number }; // connector words
  num: { face: string; weight: number }; // numerals, readouts, case numbers
  fallbackAccent: string; // M-024: use on fire / sunset / red plates where the accent would vanish
};

/** Dashcam: "INSTRUMENT". The dashcam's own on-screen readout becomes the graphic language. Needle orange + D-DIN. */
export const DASH: Theme = {
  id: "dashcam-instrument",
  accent: "#FF5A1F",
  accentGlow: "rgba(255,90,31,.55)",
  neutral: "#F4F6F7",
  dim: "#9AA3A8",
  plateDark: "rgba(6,8,10,.72)",
  text: { face: FONT.din, weight: 700 },
  title: { face: FONT.din, weight: 700 },
  light: { face: FONT.din, weight: 400 },
  num: { face: FONT.dinExp, weight: 700 },
  fallbackAccent: "#F4F6F7",
};

/** Amusement Park: "MIDWAY AFTER DARK". The park's own lights: LED marquee digits, magenta, condensed Oswald. */
export const MIDWAY: Theme = {
  id: "amusement-midway",
  accent: "#E3006B",
  accentGlow: "rgba(227,0,107,.55)",
  neutral: "#FDFCFD",
  dim: "#8E7F86",
  plateDark: "rgba(10,4,8,.70)",
  text: { face: FONT.nunito, weight: 700 },
  title: { face: FONT.oswald, weight: 600 },
  light: { face: FONT.oswald, weight: 200 },
  num: { face: FONT.oswald, weight: 600 },
  fallbackAccent: "#FDFCFD",
};

/** THE CHANNEL STYLE (owner 2026-10-19: "Waterpark was pretty good", "don't ruin my style of the channel"). DEFAULT for every template.
 * Tokens from CHANNEL_STYLE.md §0 / TEMPLATE_UPGRADES.md "Reskin route". Labels that need the DD round stroke should use RoundText
 * with title.face, not a plain font swap. DASH and MIDWAY above were REJECTED by the owner (2026-10-19); keep them only so old
 * Dashcam/AP code still compiles, never pass them in a new video. */
export const WATERPARK: Theme = {
  id: "channel-waterpark",
  accent: "#E30A10",
  accentGlow: "rgba(227,10,16,.55)",
  neutral: "#FDFDFD",
  dim: "#9A9A9A",
  plateDark: "rgba(8,8,10,.72)",
  text: { face: FONT.inter, weight: 700 },
  title: { face: FONT.round, weight: 400 },
  light: { face: FONT.oswald, weight: 200 },
  num: { face: FONT.nunito, weight: 900 },
  fallbackAccent: "#FDFDFD",
};

export const THEMES = { waterpark: WATERPARK, dashcam: DASH, midway: MIDWAY } as const;
