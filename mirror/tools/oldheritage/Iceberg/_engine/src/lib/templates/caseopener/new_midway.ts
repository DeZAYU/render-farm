// set "midway" (Amusement Park "MIDWAY AFTER DARK", 2026-10-18). Merged into index.ts by the lead.
import type { VariantDef } from "../../core";
import { LedMarquee } from "./LedMarquee";

export const extra: VariantDef[] = [
  {
    family: "caseopener", name: "LedMarquee", component: LedMarquee, durationInFrames: 130, thumbFrame: 70, stripFrames: [0, 4, 8, 20, 26, 34, 70, 110],
    defaultProps: {
      number: "7", media: "demo/clip_crowd.mp4", numberAt: 0, clearAt: 104,
      placeWords: [{ text: "Funtown", at: 20 }, { text: "Pier,", at: 26 }, { text: "New Jersey", at: 32, hot: true }],
      dateWords: [{ text: "September", at: 50 }, { text: "12,", at: 56 }, { text: "2019", at: 62 }],
    },
    ref: "Farrell FB F10 @V4 2:49.6 (LED/neon figure: dot-matrix core + bloom, slight push) + Farrell FA F3 @V3 12:41 (3-4 px pixel texture, 30-40 px glow, 8 f fade-in) + Dashcam Vol.3 E2 word rise (18-20 px, alpha 14-18 f, stagger 6 f); REFERENCE_SYNTHESIS §I3 AP-1 / §I4 #7",
    when: "DROPPED 2026-10-19 (owner-rejected per-video look; TEMPLATE_UPGRADES verdict). Do NOT use in new videos. Was: Amusement Park (MIDWAY) case opener: the case number as park signage over the case's own first footage (blurred sigma 30, 35 %), place + date rising on their words; clearAt focuses back to the live shot.",
    props: "number, media, mediaStart, push, numberAt, placeWords/dateWords [{text,at,hot}], clearAt, cell, blur, dim, theme (MIDWAY), fire (white LEDs on fire plates)",
    twist: "5x7 dot-matrix figure built from fine 4 px dots with the unlit board ghosted (park LED sign); Oswald 600 place / Oswald 200 date; never on black",
    sfx: [{ event: "case_number_hit", at: 0, note: "first visible frame of the figure, level -0.4 (AP-1)" }],
    axes: { geometry: "centred dot-matrix sign over a blurred plate", entry: "8 f fade + focus-in, slow push; words rise 19 px", layout: "figure over place over date (centred)", accent: "magenta LED dots + 36 px bloom" },
  },
];
