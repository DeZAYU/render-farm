// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { MemorialLine_A } from "./MemorialLine_A";

export const extra: VariantDef[] = [
  {
    family: "toll", name: "MemorialLine-A", component: MemorialLine_A, durationInFrames: 210, thumbFrame: 190, stripFrames: [0, 6, 12, 24, 50, 100, 150, 190],
    defaultProps: {
      header: { text: "PARK WORKERS", at: 6 },
      people: [{ name: "J. DOE", at: 12, detail: "19 · DIED THAT NIGHT", detailAt: 50 }, { name: "A. SMITH", at: 100, detail: "DIED TWO DAYS LATER", detailAt: 150 }],
    },
    ref: "NameAgeRoll sibling (Editor A, gentle): names type on 1.4 f/char, thin grey rule draws under, detail fades up; +0.8 %/s push and a drifting warm light (6 %). Used AP C23 (OnPlate).",
    when: "For the people who died: a quiet card, no photos, no red, no SFX hits. Its own background is dark: in a video run it over the case's defocused footage, never alone on black. Hold >= 3 s; at most ~5 Editor A devices per video, never in consecutive cases; Waterpark channel style.",
    props: "people [{name,at,detail,detailAt}], header {text,at}, cap",
    twist: "no accent colour at all; motion kept to a very slow push and a soft light drift so the frame is never still but never busy",
    sfx: [],
    axes: { geometry: "centred names with grey rules", entry: "name types on 1.4 f/char, rule draws, detail fades", layout: "header over name / detail pairs", accent: "none (white + light grey only)" },
  },
];
