// set "midway" (Amusement Park "MIDWAY AFTER DARK", 2026-10-18). Merged into index.ts by the lead.
import type { VariantDef } from "../../core";
import { RiderCamTakeover } from "./RiderCamTakeover";

export const extra: VariantDef[] = [
  {
    family: "footage", name: "RiderCamTakeover", component: RiderCamTakeover, durationInFrames: 260, thumbFrame: 20, stripFrames: [0, 4, 20, 40, 70, 117, 150, 230],
    defaultProps: { media: "demo/clip_crowd.mp4", rider: "demo/clip_park.mp4", inAt: 0, growAt: 40, shrinkAt: 140, corner: "tr" },
    ref: "Dashcam Vol.2 E6 PiP grow/shrink @7:26.87 (grow 2.57 s bez(0.40,0.22,0,0.92), shrink 3.63 s bez(0.47,0.12,0.01,0.85)) + Dashcam Vol.1 PiP @0:00 + Nocturn nA6 floating card @FINAL 0:02; REFERENCE_SYNTHESIS §I1 / §I4 #5",
    when: "DROPPED 2026-10-19 (duplicates footage/PipCam; TEMPLATE_UPGRADES verdict). Do NOT use. Was: Rider POV vs ground shot of the same incident: the PiP grows to full frame when the VO turns to the riders, shrinks back for the onlookers.",
    props: "media, mediaStart, rider, riderStart, push, rest (0.36 W), corner tr|tl|br|bl, inAt, growAt, growDur (77), shrinkAt, shrinkDur (109), border (housing rim, 6), tag (LED text, 'RIDER CAM'), theme, fire",
    twist: "the PiP IS the rider cam: dark action-cam housing rim + fisheye lens mask (barrel corners, lens fall-off) that relaxes into the full frame as it grows (D2 stops at 0.787 W), small magenta LED 'RIDER CAM' tag riding in its corner; no coloured border",
    sfx: [],
    axes: { geometry: "fisheye-masked cam housing -> full frame -> housing", entry: "8 f pop-in, eased grow / shrink", layout: "corner (any of four)", accent: "magenta LED RIDER CAM tag (no border)" },
  },
];
