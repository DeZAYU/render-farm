// set "midway" (Amusement Park "MIDWAY AFTER DARK", 2026-10-18). Merged into index.ts by the lead.
import type { VariantDef } from "../../core";
import { OnRidePrint } from "./OnRidePrint";

export const extra: VariantDef[] = [
  {
    family: "photo", name: "OnRidePrint", component: OnRidePrint, durationInFrames: 150, thumbFrame: 110, stripFrames: [0, 6, 14, 24, 34, 45, 60, 110],
    defaultProps: {
      mode: "single", items: [{ src: "demo/clip_park.mp4" }], captionAt: 34,
      caption: [{ text: "PHOTO " }, { text: "#07", hot: true }, { text: "  JUL 4, 2019" }], rideName: "SKY RIDER",
    },
    ref: "Visual Venture §5 settle (drop/rotation beziers) + Dashcam Vol.2 E12 camera curve ez(0,.6,.2,1) (push, not the clothesline) + Dashcam Vol.2 E5 strip shift 55 f ez(.45,0,.25,1) + Dashcam Vol.1 typed caption 2 f/char + real on-ride photo kiosk prints; REFERENCE_SYNTHESIS §I3 / §I4 #6 (redesigned 2026-10-19)",
    when: "DROPPED 2026-10-19 (duplicates photo/Polaroid + 'souvenir' decoration is banned). Do NOT use. Was: On-ride souvenir print with the live clip (or a still) inside: a case opener or a still beat. mode 'strip' = 2-4 stills of a thin case printed as a vertical kiosk strip; items[i].at = the printer steps frame i out.",
    props: "mode single|strip, items [{src, startFrom, at, caption [{text,hot}], captionAt}], bg, bgStart, dropDur (feed frames), pull (push frames), caption, captionAt, rideName, paper, ink, theme, fire",
    twist: "the ride's photo KIOSK: magenta LED ride-name fascia, the full-bleed landscape print feeds out of the printer slot from f0, releases with a VV settle while the camera pushes in; branded band (ride name + typed caption), gloss pass. No polaroid margin, no cord. Strip = printer steps frames out (not FilmStrip)",
    sfx: [{ event: "typing_key", at: 34, note: "caption typing, one key per 2 f" }],
    axes: { geometry: "kiosk fascia + full-bleed landscape print fed from a slot", entry: "printer feed from f0 + release settle + push in", layout: "print centred under the LED fascia, branded band under the photo", accent: "magenta LED ride name + band rule + hot caption part" },
  },
];
