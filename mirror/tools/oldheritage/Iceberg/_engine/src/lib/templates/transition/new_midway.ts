// set "midway" (Amusement Park "MIDWAY AFTER DARK", 2026-10-18). Merged into index.ts by the lead.
import type { VariantDef } from "../../core";
import { PushIntoLight } from "./PushIntoLight";

export const extra: VariantDef[] = [
  {
    family: "transition", name: "PushIntoLight", component: PushIntoLight, durationInFrames: 110, thumbFrame: 70, stripFrames: [12, 30, 50, 66, 76, 80, 84, 90],
    defaultProps: { a: "demo/clip_party.mp4", b: "demo/clip_park.mp4", cut: 80, light: { x: 1200, y: 362 } },
    ref: "Farrell FB F8 push-into-light @V5 10:03.3 (also V2 9:22): lamp disc 0.34 W -> full white over 68 f ease-in, audio to -61 dB over the last 0.9 s; Farrell exposure-flash decay (SG 5, 8-12 f); REFERENCE_SYNTHESIS §I3 AP-1 / §I4 #8",
    when: "MIDWAY case exits: push into a real light of the outgoing shot (ride bulbs, show lights) and cut to the next case on full white. Host: dip the bed to 0.35 over the last 27 f (never silent, M-030). Max once per case.",
    props: "a/b media or A/B nodes, cut, light {x,y} (screen px of A), dur (68), decay (10), maxScale (1.6), disc0 (0.34), tint",
    twist: "the disc is born from a real lamp in the outgoing frame and the camera pushes about that lamp (log, ease-in); short squared white decay over B",
    sfx: [],
    axes: { geometry: "radial disc from a light point", entry: "68 f ease-in push + growing white disc", layout: "anchored on the lamp", accent: "white-out light" },
  },
];
