// dash1 (Dashcam "INSTRUMENT") additions to the labels family. The lead merges `extra` into index.ts.
import type { VariantDef } from "../../core";
import { SceneTitle } from "./SceneTitle";
import { SpeakerCaptions } from "./SpeakerCaptions";

export const extra: VariantDef[] = [
  {
    family: "labels", name: "SceneTitle", component: SceneTitle, durationInFrames: 150, thumbFrame: 60, stripFrames: [4, 6, 8, 10, 13, 18, 26, 60],
    defaultProps: {
      media: "demo/clip_park.mp4", words: [{ text: "Riverside", at: 6 }, { text: "Drive", at: 13, red: true }],
      track: [{ f: 0, x: 960, y: 470 }, { f: 75, x: 968, y: 466 }, { f: 150, x: 978, y: 460 }], outAt: 132,
    },
    ref: "REFERENCE_SYNTHESIS §H8: Farrell F1 'THE KOLYMA HIGHWAY' GM 1:32.9-1:37.0 (sky band, moves with the push, +4-5 deg perspective, right letters ~4 px DOF blur, rise+fade 6-8 f, hold 3.7-7 s) + V3 0:10 'SHENZHEN / CHINA'",
    when: "Place name on moving road footage: the title hangs above the vanishing point and travels with the drive. Replaces the DD mid-frame two-tone label.",
    props: "media, mediaStart, push, words [{text,at,red=accent}], track [{f,x,y}] horizon point source px, cap (78), lift (px above the point), rot (4.5), rotZ, approach (log growth /s), dof (px), outAt, theme",
    twist: "tracked to the road's vanishing point (keys in source px) and growing with the forward motion; D-DIN 700 caps; key word in the accent; DOF via a masked sharp + blurred copy",
    sfx: [{ event: "title_word_hit", at: 6, note: "Farrell low hit at text-in; keep it low" }],
    axes: { geometry: "tracked above the vanishing point", entry: "per-word 7 f rise + fade, perspective-rotated", layout: "one caps line in the sky band", accent: "accent key word + right-side DOF blur" },
  },
  {
    family: "labels", name: "SpeakerCaptions", component: SpeakerCaptions, durationInFrames: 150, thumbFrame: 110, stripFrames: [4, 6, 8, 20, 56, 60, 96, 110],
    defaultProps: {
      media: "demo/clip_crowd.mp4", mode: "anchored",
      speakers: [{ id: "officer", role: "police", x: 1380, y: 420, side: "left" }, { id: "driver", role: "civilian", x: 540, y: 470, side: "right" }],
      lines: [
        { who: "officer", text: "Step out of the vehicle, please.", at: 8, end: 44 },
        { who: "driver", text: "What did I do wrong?", at: 58, end: 84 },
        { who: "officer", text: "Keep your hands where I can see them.", at: 96, end: 134 },
      ],
    },
    ref: "REFERENCE_SYNTHESIS §H16 + §A7: Dashcam Vol.1 speaker boxes @2:48-3:01 (168-181 s; ~85 % black, ~40 px, beside the speaker, cyan police / white civilians) + D1 kinetic 911 @18:28.8-18:38.8 (1-2 words, bold ~60 px, y 0.85-0.92, key words cyan) + D2 timing (on -0.12 s, off +0.3-0.6 s)",
    when: "Clip speech in police stops / confrontations (anchored), and 911 / radio audio over the scene (mode 'kinetic'). Never over VO.",
    props: "media, mediaStart, push, speakers [{id, role police|dispatcher|civilian|driver|caller, track?|x,y, side}], lines [{who, text (*key*), at, end, words?}], mode anchored|kinetic, face inter|theme, cap (>=40), lead (4), hang (12), maxW, gap, y (kinetic), theme",
    twist: "role colour = theme accent for police/dispatcher (DD used cyan); optional tracked anchors; kinetic chunks with *key* words in the accent",
    sfx: [],
    axes: { geometry: "boxes beside each tracked speaker", entry: "4 f early pop + 6 px rise", layout: "per-speaker anchored boxes / bottom kinetic chunks", accent: "accent text for police + dispatcher" },
  },
];
