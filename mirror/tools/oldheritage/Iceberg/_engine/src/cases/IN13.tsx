// Incidents #13 — off Western Australia, 2024: the Fish Tucker Man crew, heading out to catch and cook, find a lone man in a life jacket
// beside his upturned fishing kayak, take him aboard by the stern ladder, right the kayak and tow it toward shore. One source: the boat's
// GoPro, the channel's own upload (E2mq7soEqrs, 1920x1080 50p -> 30p), graded/main = src 0-420. The rescued man's face is blurred by the
// uploader; his name is not used. Raw audio: rawclean.py (Epidemic music removed where detected: 11-14 s, 392-394 s; none in the raws).
// The source is edited (many cuts, see media/cuts.txt); shot windows under the VO sit between cuts, raws keep the uploader's own cuts.
// VO = CASE13.mp3 split at three raws (sentence ends):
//   A 0-19.28 @4.0 | R1 src 59.0-70.2 (closing in: "You going, mate? ... you going all right?" and the man by the kayak) | B 19.28-27.26 |
//   R2 src 88.0-106.2 (main: alongside, "Are you okay?" "Yeah I'm fine", the ladder, "I've been in the water for five minutes") |
//   C 27.26-35.02 | R3 src 120.0-130.2 ("we'll get your stuff" / "you're more important" / "there's my key in there") | D 35.02-end.
// Device: CaptionHold (the uploader's shark caption held, shadow, one red rule under the shark).
import React from "react";
import { RedLabel } from "../brand";
import { Cam } from "../dev/DC01_kit";
import { CaseLayout, F, K, StrikeTitle, type Raw, type Sh } from "../dev/IN11_kit";
import { CaptionHold } from "../dev/IN13_CaptionHold";
import type { FxCut } from "../lib/templates/n2fx/fx";

const GR = "case/graded/", M = GR + "main.mp4";
export const DUR = F(98.6);

const SHOTS: Sh[] = [
  { a: 4.0, b: 7.74, vo: "A small fishing boat is heading out off the coast of Western Australia (the wake off the rail)",
    node: (n) => <Cam src={M} from={43.5} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.55, 0.45])} />, over: <RedLabel text="WESTERN AUSTRALIA · 2024" at={F(0.5)} hold={F(2.9)} /> },
  { a: 7.74, b: 11.48, vo: "on a bright morning in 2024, a GoPro bolted to the rail. (the deck, rods)", node: (n) => <Cam src={M} from={41.0} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.5, 0.45])} /> },
  { a: 11.48, b: 14.81, vo: "The Fish Tucker Man crew are out to catch and cook their dinner. (the bait tub)", node: (n) => <Cam src={M} from={2.0} keys={K(n, [1.05, 0.4, 0.5], [1.15, 0.4, 0.5])} /> },
  { a: 14.81, b: 19.49, vo: "Then the skipper notices something strange in the distance, and his gut says go look. (his caption: 'I noticed something')",
    node: (n) => <Cam src={M} from={8.5} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.4, 0.55])} /> },
  { a: 19.49, b: 23.28, vo: "So what is floating out there? From this far, it could be anything. (the skipper at the wheel, turning)",
    node: (n) => <Cam src={M} from={27.2} keys={K(n, [1.05, 0.5, 0.5], [1.18, 0.55, 0.45])} /> },
  // RAW 1: closing in on him
  { a: 23.28, b: 34.48, vo: "RAW 1 (src 59.0-70.2)", node: (n) => <Cam src={M} from={59.0} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.5])} /> },
  { a: 34.48, b: 37.92, vo: "It's a man in a life jacket, holding onto his upturned kayak. (0.5x replay, pushing in on him)",
    node: (n) => <Cam src={M} from={66.5} rate={0.5} keys={K(n, [1.3, 0.68, 0.25], [1.75, 0.7, 0.22])} /> },
  { a: 37.92, b: 42.46, vo: "They pull him up the ladder at the stern, and he says he's been in the water maybe five minutes. (aboard, in his red life jacket)",
    node: (n) => <Cam src={M} from={152.2} keys={K(n, [1.1, 0.5, 0.45], [1.2, 0.48, 0.45])} /> },
  // RAW 2 (main): alongside, the ladder, five minutes
  { a: 42.46, b: 60.66, vo: "RAW 2 (src 88.0-106.2)", node: (n) => <Cam src={M} from={88.0} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.5])} /> },
  { a: 60.66, b: 64.0, vo: "He's worried about his bag, because his key is in it. (the upturned kayak alongside, the cooler)",
    node: (n) => <Cam src={M} from={112.5} keys={K(n, [1.1, 0.5, 0.5], [1.22, 0.45, 0.5])} /> },
  { a: 64.0, b: 68.42, vo: "\"You're more important,\" the skipper tells him, and I think that's exactly the right answer. (the skipper on deck)",
    node: (n) => <Cam src={M} from={170.0} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.55, 0.45])} /> },
  // RAW 3: the bag, the key, "you're more important"
  { a: 68.42, b: 78.62, vo: "RAW 3 (src 120.0-130.2)", node: (n) => <Cam src={M} from={120.0} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.5])} /> },
  { a: 78.62, b: 81.6, vo: "The crew flip the kayak and fish out his gear, (hands righting the kayak)", node: (n) => <Cam src={M} from={223.0} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.5, 0.5])} /> },
  { a: 81.6, b: 85.09, vo: "and all he really wants now is his paddle, so he can get himself back. (the caption: 'If you can find my paddle')",
    node: (n) => <Cam src={M} from={287.5} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.55])} /> },
  { a: 85.09, b: 88.77, vo: "They tow the kayak toward the coast until houses come into view. (the yellow kayak on the tow line)",
    node: (n) => <Cam src={M} from={320.5} keys={K(n, [1.1, 0.5, 0.5], [1.25, 0.45, 0.5])} /> },
  { a: 88.77, b: 91.4, vo: "And five minutes out there is longer than it sounds. (open water, glare)", node: (n) => <Cam src={M} from={50.5} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.5, 0.45])} /> },
  { a: 91.4, b: 98.6, vo: "On screen, the crew say a great white about 15 feet long had been sighted in those same waters a week earlier. (CaptionHold)",
    node: (n) => <CaptionHold src={M} t={21.0} band={[0.69, 0.91]} rule={[0.305, 0.6, 0.785]} shadeAt={10} ruleAt={F(1.4)}
      keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: 20, s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.16, x: 0.44, y: 0.8 }]} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(23.28), kind: "blurDip", len: 10 }, { at: F(34.48), kind: "blurDip", len: 12 },
  { at: F(60.66), kind: "blurDip", len: 12 }, { at: F(78.62), kind: "glitch", len: 10 },
  { at: F(91.4), kind: "blurDip", len: 12 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 19.28], [34.48, 19.28, 27.26], [60.66, 27.26, 35.02], [78.62, 35.02, null]];
const W = "case/media/main_clean.wav";
const RAWS: Raw[] = [
  { a: 23.28, b: 34.48, s: 59.0, wav: W, g: 0, duck: 0.15 },
  { a: 42.46, b: 60.66, s: 88.0, wav: W, g: 1, duck: 0.12 },
  { a: 68.42, b: 78.62, s: 120.0, wav: W, g: 1, duck: 0.15 },
];
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_01.wav", -24], [78.57, "sfx_n2/glitch_02.wav", -30]];

export const Comp: React.FC = () => (
  <CaseLayout vo="vor/CASE13.mp3" tDur={4.0} dur={DUR}
    title={<StrikeTitle dur={F(4.0)} title="THE MAN BESIDE THE UPTURNED KAYAK" sub="WESTERN AUSTRALIA · 2024" bg={GR + "title.jpg"} />}
    shots={SHOTS} cuts={CUTS} parts={PART} raws={RAWS} sfx={SFX}
    music={{ file: "music/Music 1.mp3", db: -14.5, passes: [[4.0, 98.6, 30]] }} />
);
