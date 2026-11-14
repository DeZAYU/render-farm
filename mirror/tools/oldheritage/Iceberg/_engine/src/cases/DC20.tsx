// Dashcam #20 - Aiken County, South Carolina, Fri 3 Jul 2015 (evening): a six-ton tan Humvee taken from a Fourth of July display on
// Barton Field, Fort Gordon (Georgia), is picked up on I-20 near Aiken and chased about 20 miles; it leaves the highway across the
// grass, ends nose down in a ditch, and deputies arrest the driver (Michael Warning, 47, charged, no outcome reported).
// One source: 4gCgd_y1fYI (Political Pilot; Aiken County deputies' released cruiser cam), 720x480 letterboxed -> crop 712x400,
// used src 10-503 (channel intro and end card cut), media t = src - 10. rawclean.py: music in 3 s only.
// VO = one take (CASE20.mp3), split only at the two raws:
//   A 0-32.71 @4.00 | R1 36.71-46.71 (t 0.8-10.8: the pursuit starts, siren) | B 32.71-56.51 @46.71 |
//   R2 70.51-101.01 main, three windows of the one camera joined by blur-dips: t 307-320 (the Humvee angles off across the grass),
//   t 352.5-359 (it comes to rest nose down in the ditch), t 418-429 (the driver climbs out, deputies run in and put him down) |
//   C 56.51-end @101.01, VO ends 129.33, hold to 130.2. The driver's face is a few pixels at this distance; the walk-out
//   (t 430+, where the outline asks for a face blur) is not used.
// Devices: LineCross (Fort Gordon -> I-20 -> SC mile 11), DitchTilt. Stills: Barton Field (Wikimedia Commons, Sakai Jin, CC BY-SA 4.0),
// Sentinel-2 cloudless (EOX, CC BY 4.0), I-20 geometry (OpenStreetMap, ODbL).
import React from "react";
import { RedLabel } from "../brand";
import { type FxCut } from "../lib/templates/n2fx/fx";
import { Cam } from "../dev/DC01_kit";
import { CaseRunner, type CaseDef, F, K, Still, type Sh } from "../dev/DC17_kit";
import { LineCross } from "../dev/DC20_LineCross";
import { DitchTilt } from "../dev/DC20_DitchTilt";

const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
export const DUR = F(130.2);

const SHOTS: Sh[] = [
  { a: 4.0, b: 9.76, vo: "Friday, July 3, 2015, was the start of the Fourth of July weekend at Fort Gordon, (Barton Field panorama)",
    node: (n) => <Still src={GR + "barton.jpg"} n={n} s0={1.02} s1={1.08} fx={0.5} fy={0.5} x0={260} x1={-260} />, over: <RedLabel text="FORT GORDON, GEORGIA · JULY 3, 2015" at={F(1.0)} hold={F(4.2)} size={42} /> },
  { a: 9.76, b: 15.87, vo: "the big Army post outside Augusta, Georgia, and military vehicles were out on display on Barton Field. (the field)",
    node: (n) => <Still src={GR + "barton2.jpg"} n={n} s0={1.04} s1={1.14} fx={0.5} fy={0.55} />, over: <RedLabel text="BARTON FIELD" at={F(4.9)} hold={F(1.1)} /> },
  { a: 15.87, b: 20.31, vo: "One of them, a six-ton tan Humvee, drove off and didn't come back. (the Humvee, close)",
    node: (n) => <Cam src={M} from={25.0} keys={K(n, [1.6, 0.52, 0.45], [1.75, 0.52, 0.45])} /> },
  { a: 20.31, b: 25.66, vo: "Police say the man behind the wheel was Michael Warning, a 47-year-old military veteran. (the Humvee ahead)",
    node: (n) => <Cam src={M} from={45.0} keys={K(n, [1.35, 0.5, 0.45], [1.45, 0.5, 0.45])} />, over: <RedLabel text="MICHAEL WARNING, 47" at={F(1.9)} hold={F(3.2)} /> },
  { a: 25.66, b: 36.71, vo: "The Humvee made it across the line into South Carolina. On Interstate 20, about 15 miles in near Aiken, ... the lights came on. (LineCross)",
    node: () => <LineCross src={GR + "s2.jpg"} iw={1792} ih={1792} base={[366, 1029]} z0={1.3} z1={1.4} dashAt={6} runAt={18} runLen={150} riverX={790}
      labels={[{ text: "I-20 · AIKEN COUNTY, S.C.", at: 182 }]} /> },
  // RAW 1: the pursuit under way, siren
  { a: 36.71, b: 46.71, vo: "RAW 1 (t 0.8-10.8)", node: (n) => <Cam src={M} from={0.8} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.48])} /> },
  { a: 46.71, b: 51.03, vo: "It didn't stop. Aiken County deputies chased it for about 20 miles, (through an intersection)",
    node: (n) => <Cam src={M} from={60.0} keys={K(n, [1.2, 0.5, 0.45], [1.3, 0.5, 0.45])} /> },
  { a: 51.03, b: 56.76, vo: "and according to police, it nearly hit a patrol car and at one point ran up onto a sidewalk. (side roads)",
    node: (n) => <Cam src={M} from={100.0} keys={K(n, [1.2, 0.5, 0.45], [1.32, 0.52, 0.45])} /> },
  { a: 56.76, b: 60.02, vo: "It also hit a guardrail and later went through a fence. (the cruiser cuts across the grass)",
    node: (n) => <Cam src={M} from={122.0} keys={K(n, [1.15, 0.5, 0.5], [1.25, 0.5, 0.5])} /> },
  { a: 60.02, b: 63.83, vo: "Out on a long four-lane highway, with cruisers stacking up behind it, (the highway)",
    node: (n) => <Cam src={M} from={160.0} keys={K(n, [1.15, 0.5, 0.5], [1.3, 0.55, 0.45])} /> },
  { a: 63.83, b: 66.59, vo: "it drifted onto the shoulder and wobbled back. (the shoulder, slowed)",
    node: (n) => <Cam src={M} from={212.3} rate={0.75} keys={K(n, [1.35, 0.6, 0.45], [1.5, 0.6, 0.45])} /> },
  { a: 66.59, b: 70.51, vo: "Stay with the Humvee as it starts to angle off toward the grass. (the Humvee on the highway)",
    node: (n) => <Cam src={M} from={302.0} keys={K(n, [1.3, 0.62, 0.45], [1.45, 0.66, 0.45])} /> },
  // RAW 2 (main): off across the grass -> nose down in the ditch -> the driver out, deputies run in
  { a: 70.51, b: 83.51, vo: "RAW 2a (t 307-320)", node: (n) => <Cam src={M} from={307.0} keys={K(n, [1.05, 0.55, 0.5], [1.12, 0.7, 0.5])} /> },
  { a: 83.51, b: 90.01, vo: "RAW 2b (t 352.5-359)", node: (n) => <Cam src={M} from={352.5} keys={K(n, [1.05, 0.7, 0.5], [1.12, 0.75, 0.5])} /> },
  { a: 90.01, b: 101.01, vo: "RAW 2c (t 418-429)", node: (n) => <Cam src={M} from={418.0} keys={K(n, [1.1, 0.7, 0.55], [1.18, 0.7, 0.55])} /> },
  { a: 101.01, b: 106.31, vo: "Six deputies made the arrest, and Warning was taken to the Aiken County Detention Center. (the Humvee in the ditch, wide)",
    node: (n) => <Cam src={M} from={385.0} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.6, 0.5])} /> },
  { a: 106.31, b: 109.41, vo: "The FBI and military police looked into it as well. (tight on the Humvee)",
    node: (n) => <Cam src={M} from={395.0} keys={K(n, [2.0, 0.88, 0.5], [2.1, 0.88, 0.5])} /> },
  { a: 109.41, b: 116.77, vo: "Deputies said he'd be charged with attempted murder, ... failing to stop for blue lights and a siren. (the highway pursuit, slowed)",
    node: (n) => <Cam src={M} from={240.0} rate={0.75} keys={K(n, [1.2, 0.55, 0.45], [1.35, 0.55, 0.45])} /> },
  { a: 116.77, b: 119.09, vo: "No plea or verdict has been reported. (the empty ditch scene)",
    node: (n) => <Cam src={M} from={404.0} keys={K(n, [1.2, 0.5, 0.5], [1.25, 0.45, 0.5])} /> },
  { a: 119.09, b: 122.39, vo: "I wouldn't have wanted to be in the patrol car it nearly hit. (the Humvee's tail, close)",
    node: (n) => <Cam src={M} from={33.0} keys={K(n, [1.6, 0.52, 0.45], [1.7, 0.52, 0.45])} /> },
  { a: 122.39, b: 130.2, vo: "A Humvee that had been parked on Barton Field ... nose down in a ditch in another state. (DitchTilt)",
    node: (n) => <DitchTilt src={M} t={375.0} levelAt={40} roofAt={150} pivot={[0.836, 0.41]} roof={[0.954, 0.342]} keys={K(n, [1.1, 0.75, 0.5], [1.55, 0.85, 0.45])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(15.87), kind: "glitch", len: 10 }, { at: F(20.31), kind: "blurDip", len: 10 }, { at: F(25.66), kind: "glitch", len: 10 },
  { at: F(36.71), kind: "glitch", len: 10 }, { at: F(46.71), kind: "blurDip", len: 12 }, { at: F(51.03), kind: "blurDip", len: 10 },
  { at: F(56.76), kind: "blurDip", len: 10 }, { at: F(60.02), kind: "blurDip", len: 10 }, { at: F(63.83), kind: "blurDip", len: 10 },
  { at: F(66.59), kind: "blurDip", len: 10 }, { at: F(70.51), kind: "blurDip", len: 10 }, { at: F(83.51), kind: "blurDip", len: 14 },
  { at: F(90.01), kind: "blurDip", len: 14 }, { at: F(101.01), kind: "blurDip", len: 12 }, { at: F(106.31), kind: "blurDip", len: 10 },
  { at: F(109.41), kind: "blurDip", len: 10 }, { at: F(116.77), kind: "blurDip", len: 10 }, { at: F(119.09), kind: "blurDip", len: 10 },
  { at: F(122.39), kind: "blurDip", len: 12 },
];

const def: CaseDef = {
  title: "THE STOLEN HUMVEE", titleBg: GR + "title.jpg", vo: "vor/CASE20.mp3", clean: C + "media/main_clean.wav", dur: 130.2,
  shots: SHOTS, cuts: CUTS,
  parts: [[4.0, 0, 32.71], [46.71, 32.71, 56.51], [101.01, 56.51, null]],
  raws: [{ a: 36.71, b: 46.71, src: 0.8, g: -8, duck: 0.2 },
    { a: 70.51, b: 83.51, src: 307.0, g: -6, duck: 0.2 }, { a: 83.51, b: 90.01, src: 352.5, g: -6, duck: 0.2 }, { a: 90.01, b: 101.01, src: 418.0, g: -6, duck: 0.2 }],
  sfx: [[3.95, "sfx_n2/glitch_02.wav", -24], [15.82, "sfx_n2/glitch_01.wav", -30], [25.61, "sfx_n2/glitch_03.wav", -30], [36.66, "sfx_n2/glitch_01.wav", -30]],
  beds: [],
  music: { file: "music/Music 5.mp3", db: -13, passes: [[4.0, 72.0, 8], [70.0, 130.2, 30]] },
};

export const Comp: React.FC = () => <CaseRunner c={def} />;
