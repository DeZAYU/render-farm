// Family "endscreen": outro / end-screen plates.
import type { VariantDef } from "../../core";
import { Slot } from "./Slot";

export const variants: VariantDef[] = [
  {
    family: "endscreen", name: "Slot", component: Slot,
    defaultProps: {
      media: ["demo/clip_crowd.mp4", "demo/ken_1908.png", "demo/cna_abandoned_g.png", "demo/clip_park.mp4"], hold: 90, layout: "right",
      words: [{ text: "Watch", at: 30 }, { text: "this", at: 36 }, { text: "next", at: 42, red: true }],
    },
    durationInFrames: 300, thumbFrame: 120, stripFrames: [0, 8, 14, 22, 30, 42, 60, 120, 200],
    ref: "YouTube end-screen geometry (video element ~0.31 W, circular subscribe element); house look: Dashcam Vol.2 @ 0:33.4 carousel 'next clip' card (E5 / I9) + Dashcam Vol.3 @ 0:03.4 rounded label (E2) + DD grade vignette",
    when: "The last 5-20 s of a video, under the YouTube end-screen elements (the narrator says 'another video is on your screen now').",
    props: "media string[] (montage), hold, layout 'right'|'centre', words {text, at, red?}[], subscribe, guides (draw the YouTube element boxes for a layout check)",
    twist: "the empty slot is the DD red-bordered 'next clip' card; the montage is the video's own media, blurred and dark, still moving",
    sfx: [{ event: "sub_boom", at: 8, note: "low, as the card settles" }],
    axes: { geometry: "card slot + ring over a blurred plate", entry: "fade-up, card settle, ring settle", layout: "slot right, subscribe left", accent: "DD red card border + red key word" },
  },
];
