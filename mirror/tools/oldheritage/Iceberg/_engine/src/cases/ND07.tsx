// Natural Disasters #7 — Driving out of Paradise (Camp Fire, 8 Nov 2018). Three cars, three cameras: the Grager family's own video (par,
// their voices), Dione Burke's brother-in-law's (db, silent upload), Megan Klepps's drive ten hours in (mk); aftermath from Mykie Mach
// Vang's drive (myk, Dec 2018) and dobsonimages' drone flight (dob, 26 Dec 2018). VO = one continuous take, split only where a raw plays.
// Devices built for this case's beats: RoadsOut (the ridge's few roads, then the Skyway jam, NAIP + TIGER roads), PlumeRun (Landsat 8 at
// 10:45: embers outrun the front into town), WireTrace (the power lines in the raw's last frame drawn over), AlertDots (7 of 52 reached),
// Aerial (brand) on the origin in the Feather River canyon. Silent db raws: Megan's own cabin sound from the same town that day as the bed.
// Source cuts: db 14-16, 39, 47, 53-66 (phone motion), 72, 76-81, 112, 121-133, 158-162, 166-169, 176-177, 193-195, 200-205, 213, 218,
// 230-236, 245-246, 263, 269, 275-279, 292-297; par / mk / myk none. Windows chosen between them; raws with phone whips are allowed.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { RoadsOut } from "../dev/ND07_RoadsOut";
import { PlumeRun } from "../dev/ND07_PlumeRun";
import { WireTrace } from "../dev/ND07_WireTrace";
import { AlertDots } from "../dev/ND07_AlertDots";
import { ROADS } from "../dev/ND07_roads";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0;

// ---- the take, split only at the raws (take seconds, cut in the silences between sentences)
type Raw = { src: string; a: number; b: number; sound: "own" | "bed"; bed?: number; gain?: number };
const VO: [number, number][] = [[0, 36.6], [36.6, 54.45], [54.45, 66.45], [66.45, 70.65], [70.65, 78.9], [78.9, 92.0], [92.0, 102.8], [102.8, 118.65], [118.65, 124.05], [124.05, 158.5], [158.5, 169.05], [169.05, 170.55], [170.55, 198.8]];
const RAWS: (Raw | null)[] = [
  // 3 Nov owner rule: raws only at the incident (the Gragers' drive, the fireball, what was left). The eight raws that sat after the
  // embers / Skyway / statistics / evacuation / power-line / alert explanation are cut (null); the VO runs on over silent footage.
  { src: "par", a: 9.0, b: 24.0, sound: "own" },        // "There's a structure and it's burning. We are in serious danger."
  { src: "par", a: 64.6, b: 86.0, sound: "own" },       // "This entire town is going up in flames. Paradise is on fire."
  null, // cut (3 Nov rule: no raw under explanation) — was: src: "par", a: 102.6, b: 119.0, sound: "own"      // "we are just down from Neal now … that side looks worse now"
  null, // cut (3 Nov rule: no raw under explanation) — was: src: "db", a: 17.0, b: 29.0, sound: "bed", bed: 300    // flames along the road (silent upload)
  null, // cut (3 Nov rule: no raw under explanation) — was: src: "db", a: 62.8, b: 71.8, sound: "bed", bed: 312    // houses on fire
  null, // cut (3 Nov rule: no raw under explanation) — was: src: "db", a: 113.0, b: 120.5, sound: "bed", bed: 324  // flames through the trees beside the road
  null, // cut (3 Nov rule: no raw under explanation) — was: src: "db", a: 205.8, b: 217.6, sound: "bed", bed: 334  // the fire front behind the power lines
  null, // cut (3 Nov rule: no raw under explanation) — was: src: "db", a: 280.0, b: 291.8, sound: "bed", bed: 348  // the line of fire and the smoke column
  null, // cut (3 Nov rule: no raw under explanation) — was: src: "mk", a: 68.0, b: 80.0, sound: "own"         // ten hours in: fire both sides of the road
  null, // cut (3 Nov rule: no raw under explanation) — was: src: "mk", a: 104.0, b: 117.0, sound: "own"       // flames among the burned buildings
  { src: "mk", a: 194.35, b: 205.5, sound: "own" },     // the fireball (continues the shot under "about to go up")
  { src: "mk", a: 181.5, b: 191.5, sound: "own" },      // what was left (its first 1.5 s sit under "And this is what was left.")
  null,
];
const GAP = 0.25; // after a raw, before the VO comes back
// build the timeline: VO part i, then raw i
const voStart: number[] = [], rawStart: number[] = [];
let T = TITLE;
VO.forEach(([a, b], i) => {
  voStart.push(T); T += b - a;
  const r = RAWS[i];
  if (i === 10) { rawStart.push(T); T += r!.b - r!.a; return; } // the fireball shot runs straight on from the VO line into the raw
  if (i === 11) { rawStart.push(T - (b - a)); T += r!.b - r!.a + GAP; return; } // "what was left" is said over the raw's first 1.5 s
  if (r) { rawStart.push(T); T += r.b - r.a + GAP; } else rawStart.push(T);
});
export const DUR = F(T + 2.4);
/** take second -> timeline second */
const V = (t: number) => { for (let i = VO.length - 1; i >= 0; i--) if (t >= VO[i][0] - 1e-6) return voStart[i] + (t - VO[i][0]); return TITLE; };

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode; abs?: boolean };
// shots under the VO: a/b in TAKE seconds (mapped with V); raws are added from RAWS
const VS: Sh[] = [
  { a: 0, b: 2.23, vo: "Dharali was buried in less than a minute. (Paradise burning: the row of houses from the Grager car)", src: "par", from: 126.0, s0: 1.05, s1: 1.1 },
  { a: 2.23, b: 8.17, vo: "Paradise, California burned for a whole morning, while thousands of families tried to drive out through it. (the queue out, db)", src: "db", from: 237.0, s0: 1.04, s1: 1.1, fy: 0.6,
    over: <RedLabel text="PARADISE, CALIFORNIA" at={F(0.6)} hold={F(4.2)} /> },
  { a: 8.17, b: 16.11, vo: "a town of about 26,000 people on a ridge … only a handful of roads in and out. (RoadsOut)",
    node: <RoadsOut src={GR + "naip_par.jpg"} iw={3870} ih={3035} f0={[2000, 1500]} f1={[1750, 1700]} z0={1.0} z1={1.22} tilt={26}
      roads={[{ pts: ROADS["Skyway"], at: 30, len: 40 }, { pts: ROADS["Clark Rd"], at: 58, len: 40 }, { pts: ROADS["Pentz Rd"], at: 84, len: 40 }, { pts: ROADS["Neal Rd"], at: 112, len: 36 }, { pts: ROADS["Honey Run Rd"], at: 138, len: 40 }]} /> },
  { a: 16.11, b: 19.6, vo: "Early on Thursday the 8th of November 2018, (dark, the glow through the trees; date)", src: "par", from: 30.5, s0: 1.06, s1: 1.12,
    over: <RedLabel text="NOVEMBER 8, 2018" at={F(0.3)} hold={F(2.9)} /> },
  { a: 19.6, b: 25.17, vo: "a fire started from PG&E transmission equipment up the canyon, and the wind pushed it toward town. (the origin, NAIP)",
    node: <Aerial src={GR + "naip_pulga.jpg"} iw={3000} ih={2197} spot={[1350, 900, 1875, 1350]} z0={1.0} z1={1.3} label="CAMP CREEK ROAD, FEATHER RIVER CANYON" boxAt={F(0.5)} labelAt={F(1.0)} /> },
  { a: 25.17, b: 28.49, vo: "It was first reported at around half past six in the morning. (pre-dawn glow, Grager car)", src: "par", from: 52.0, s0: 1.04, s1: 1.09 },
  { a: 28.49, b: 33.77, vo: "Within a day it had burned about 70,000 acres, close to an acre every second. (Landsat 8 at 10:45: pull out from Paradise to the whole plume)",
    src: GR + "landsat_full.jpg", still: true, s0: 3.2, s1: 1.02, fx: 0.41, fy: 0.09 },
  { a: 33.77, b: 36.6, vo: "The Grager family was in one of the cars heading out. (their car: the mirror)", src: "par", from: 0.8, s0: 1.03, s1: 1.07 },
  // VO 2
  { a: 36.6, b: 40.21, vo: "This fire reached town within hours, not days. (db: the trees burning along the road)", src: "db", from: 1.0, s0: 1.04, s1: 1.09 },
  { a: 40.21, b: 48.75, vo: "A strong, dry wind carried embers far out in front of the flames … new fires … before the main fire got there. (PlumeRun)",
    node: <PlumeRun src={GR + "landsat_crop.jpg"} iw={3017} ih={2011} origin={[2593, 349]} town={[1580, 860]} originLabel="ORIGIN" townLabel="PARADISE"
      spots={[[1420, 880], [1700, 790], [1560, 960], [1360, 810], [1650, 900], [1480, 760]]} frontAt={[8, 250]} emberAt={F(2.2)} emberEvery={9} /> },
  { a: 48.75, b: 51.6, vo: "Embers can travel more than a kilometre ahead of a fire, (fire spotting in the trees, Grager car)", src: "par", from: 57.5, s0: 1.05, s1: 1.1 },
  { a: 51.6, b: 54.45, vo: "and the town had gone months without real rain. (dry grass going up, mk)", src: "mk", from: 234.0, s0: 1.04, s1: 1.1 },
  // VO 3
  { a: 54.45, b: 57.89, vo: "Everyone was leaving at once, on the same few roads. (brake lights in the queue)", src: "db", from: 255.0, s0: 1.05, s1: 1.1, fy: 0.6 },
  { a: 57.89, b: 62.91, vo: "The Skyway, the main way out, jammed, and people abandoned their cars and ran. (RoadsOut: the Skyway fills)",
    node: <RoadsOut src={GR + "naip_par.jpg"} iw={3870} ih={3035} mode="jam" f0={[1500, 1800]} f1={[1150, 2050]} z0={1.75} z1={2.0} tilt={30} jamAt={14} label="THE SKYWAY" labelAt={10}
      roads={[{ pts: ROADS["Clark Rd"], at: 0, len: 1 }, { pts: ROADS["Neal Rd"], at: 0, len: 1 }, { pts: ROADS["Honey Run Rd"], at: 0, len: 1 }, { pts: ROADS["Skyway"], at: 0, len: 1, main: true }]} /> },
  { a: 62.91, b: 66.45, vo: "Bulldozers later pushed burned-out cars aside to clear it. (a burned-out car, Dec 2018)", src: "myk", from: 89.5, s0: 1.04, s1: 1.1 },
  // VO 4
  { a: 66.45, b: 70.65, vo: "Dione Burke's sister and brother-in-law were in another, a little further along. (their car: tail lights beside the fire)", src: "db", from: 40.5, s0: 1.04, s1: 1.08 },
  // VO 5
  { a: 70.65, b: 74.4, vo: "The Camp Fire would destroy nearly nineteen thousand buildings, (a whole row burning)", src: "par", from: 132.0, s0: 1.04, s1: 1.1 },
  { a: 74.4, b: 78.9, vo: "most of them homes, more than any wildfire in California had ever destroyed. (drone, Dec 2018: the burned shopping centre)", src: "dob_c", from: 31.0, s0: 1.02, s1: 1.08 },
  // VO 6
  { a: 78.9, b: 82.17, vo: "Evacuations fail in one very specific way. (the queue under the smoke)", src: "db", from: 264.0, s0: 1.04, s1: 1.1 },
  { a: 82.17, b: 85.3, vo: "When everyone leaves together the traffic stops, (cars stopped, fire ahead)", src: "db", from: 247.0, s0: 1.08, s1: 1.14, fy: 0.62 },
  { a: 85.3, b: 88.81, vo: "and a car that can't move is stuck wherever the fire reaches it. (mk: fire right beside the car)", src: "mk", from: 57.0, s0: 1.04, s1: 1.1 },
  { a: 88.81, b: 92.0, vo: "That happened on several roads out of Paradise that morning. (drone: a burned-out car park)", src: "dob_a", from: 12.0, s0: 1.03, s1: 1.08 },
  // VO 7
  { a: 92.0, b: 95.92, vo: "By now they're far enough down the road to see the fire front behind them.", src: "db", from: 196.0, s0: 1.04, s1: 1.09 },
  { a: 95.92, b: 98.37, vo: "From a distance it looks like a solid wall.", src: "db", from: 222.5, s0: 1.06, s1: 1.1 },
  { a: 98.37, b: 102.8, vo: "It's really a moving line where the heat is high enough to light everything ahead of it.", src: "db", from: 270.0, s0: 1.04, s1: 1.1 },
  // VO 8
  { a: 102.8, b: 106.58, vo: "Those power lines aren't the ones that started it, but they're hard to ignore. (WireTrace on the raw's last frame)",
    node: <WireTrace src={GR + "db.mp4"} sec={217.5} focus={[0.33, 0.35]} z1={1.22} at={6} every={6}
      pole={[[0.239, 0.43], [0.214, 1.0]]}
      wires={[[[0.255, 0.43], [0.35, 0.2], [0.443, 0]], [[0.266, 0.435], [0.36, 0.21], [0.466, 0]], [[0.286, 0.463], [0.42, 0.22], [0.571, 0]], [[0.302, 0.485], [0.43, 0.24], [0.583, 0]], [[0.323, 0.518], [0.49, 0.26], [0.685, 0]], [[0.339, 0.54], [0.52, 0.27], [0.742, 0]]]} /> },
  { a: 106.58, b: 114.4, vo: "Investigators traced the fire to a worn hook on a PG&E transmission tower up the canyon, a tower close to a hundred years old. (the origin again, tighter)",
    node: <Aerial src={GR + "naip_pulga.jpg"} iw={3000} ih={2197} spot={[1430, 980, 1780, 1260]} z0={1.6} z1={1.95} label="CARIBOU-PALERMO LINE, BUILT 1921" boxAt={F(1.2)} labelAt={F(2.0)} /> },
  { a: 114.4, b: 118.65, vo: "One worn hook, on a tower older than almost everyone driving beneath it. (driving under the lines, mk)", src: "mk", from: 119.5, s0: 1.04, s1: 1.1 },
  // VO 9
  { a: 118.65, b: 122.45, vo: "Megan Klepps drove through Paradise after about ten hours of fire. (her drive: smoke in the street)", src: "mk", from: 12.0, s0: 1.04, s1: 1.09 },
  { a: 122.45, b: 124.05, vo: "Much of it was still burning. (a pole burning at its foot)", src: "mk", from: 126.2, s0: 1.06, s1: 1.1 },
  // VO 10
  { a: 124.05, b: 125.9, vo: "Paradise had been warned.", src: "mk", from: 160.5, s0: 1.04, s1: 1.08 },
  { a: 125.9, b: 129.9, vo: "A fire in 2008 forced evacuations here, (the town from the air)", src: "dob_b", from: 20.0, s0: 1.03, s1: 1.08 },
  { a: 129.9, b: 133.91, vo: "and the town drew up a plan that split it into zones so everyone wouldn't leave at once.", src: "dob_a", from: 18.0, s0: 1.03, s1: 1.08 },
  { a: 133.91, b: 136.6, vo: "On the 8th, the fire moved too fast for zones to matter,", src: "mk", from: 86.5, s0: 1.04, s1: 1.1 },
  { a: 136.6, b: 139.2, vo: "and the alerts didn't keep up either.", src: "mk", from: 140.0, s0: 1.04, s1: 1.1 },
  { a: 139.2, b: 146.47, vo: "Butte County's grand jury later found that only about 7,000 of the 52,000 people who evacuated received an alert. (AlertDots)",
    node: <AlertDots bg={GR + "mk.mp4"} bgFrom={150.0} litAt={F(3.0)} label="BUTTE COUNTY GRAND JURY" /> },
  { a: 146.47, b: 150.58, vo: "Fewer than half of Paradise's residents had signed up for the zone warnings.", src: "mk", from: 153.0, s0: 1.04, s1: 1.09 },
  { a: 150.58, b: 154.4, vo: "The county also tried to send an emergency alert to every phone in the area, (a phone in the car)", src: "mk", from: 44.3, s0: 1.05, s1: 1.12, fx: 0.45 },
  { a: 154.4, b: 158.5, vo: "and it didn't go through. FEMA has no record of one being sent.", src: "mk", from: 146.5, s0: 1.04, s1: 1.09 },
  // VO 11
  { a: 158.5, b: 163.2, vo: "Most of the people who didn't make it out were elderly, and many had trouble moving. (burned walkers on a driveway)", src: "myk", from: 83.5, s0: 1.04, s1: 1.1 },
  { a: 163.2, b: 166.75, vo: "A fire this fast finds the people who need the most time.", src: "mk", from: 92.0, s0: 1.04, s1: 1.09 },
  { a: 166.75, b: 169.05, vo: "Something beside the road is about to go up. (runs on into the fireball raw)", src: "mk", from: 192.05, s0: 1.0, s1: 1.0 },
  // VO 12 ("And this is what was left." sits on the raw; the outcome)
  { a: 170.55, b: 175.49, vo: "Eighty-five people lost their lives, the deadliest wildfire in California's history. (drone: the road through the ruins)", src: "dob_c", from: 3.0, s0: 1.03, s1: 1.08 },
  { a: 175.49, b: 181.74, vo: "In June 2020, PG&E pleaded guilty to 84 counts of involuntary manslaughter. (the town from the air)", src: "dob_b", from: 40.0, s0: 1.04, s1: 1.1,
    over: <RedLabel text="JUNE 2020" at={F(0.4)} hold={F(2.6)} /> },
  { a: 181.74, b: 186.34, vo: "Its chief executive stood in court and said guilty, your honour, once for each of them. (the burned homes)", src: "myk", from: 60.0, s0: 1.04, s1: 1.08 },
  { a: 186.34, b: 189.63, vo: "The company pleaded guilty. No person went to prison.", src: "myk", from: 95.0, s0: 1.04, s1: 1.08 },
  { a: 189.63, b: 195.3, vo: "PG&E went through bankruptcy over its wildfire bills and agreed to pay billions to the victims,", src: "dob_c", from: 64.0, s0: 1.03, s1: 1.08 },
  { a: 195.3, b: 198.8, vo: "and the new power lines through Paradise are going underground. (the road and its poles)", src: "dob_c", from: 95.0, s0: 1.03, s1: 1.07 },
];

const SHOTS: Sh[] = [
  ...VS.map((s) => ({ ...s, a: V(s.a), b: s.b >= 198.8 ? V(s.b) + 2.4 : V(s.b) })),
  ...RAWS.map((r, i) => r && ({ a: rawStart[i], b: rawStart[i] + (i === 11 ? r.b - r.a + 1.5 : r.b - r.a), vo: "RAW " + r.src, src: r.src, from: i === 11 ? r.a - 1.5 : r.a,
    s0: i === 10 ? 1.0 : 1.02, s1: i === 10 ? 1.05 : 1.06 } as Sh)).filter(Boolean) as Sh[],
].sort((x, y) => x.a - y.a);
// the end: Paradise is quiet (a deer crossing the road, Dec 2018) under the last line's tail
SHOTS[SHOTS.length - 1].b = V(197.3);
SHOTS.push({ a: V(197.3), b: T + 2.4, vo: "tail: the deer crossing the empty road", src: "myk", from: 104.8, s0: 1.03, s1: 1.06 });

const at = (t: number) => F(t);
const CUTS: FxCut[] = [
  { at: at(TITLE), kind: "glitch", len: 10 },
  { at: at(rawStart[0]), kind: "blurDip", len: 12 },       // par mirror -> par raw (same camera)
  { at: at(V(36.6)), kind: "blurDip", len: 10 },
  { at: at(V(40.21)), kind: "glitch", len: 8 },            // into PlumeRun
  { at: at(V(57.89)), kind: "whip", len: 10 },             // into the Skyway
  { at: at(V(70.65)), kind: "blurDip", len: 10 },
  { at: at(V(78.9)), kind: "blurDip", len: 10 },
  { at: at(V(92.0)), kind: "blurDip", len: 10 },
  { at: at(V(95.92)), kind: "blurDip", len: 10 },
  { at: at(V(98.37)), kind: "blurDip", len: 10 },
  { at: at(V(106.58)), kind: "glitch", len: 8 },
  { at: at(V(118.65)), kind: "glitch", len: 10 },          // section: Megan's drive
  { at: at(V(139.2)), kind: "blurDip", len: 12 },
  { at: at(V(146.47)), kind: "blurDip", len: 10 },
  { at: at(rawStart[11]), kind: "blurDip", len: 14 },      // fireball -> what was left (time jump)
  { at: at(V(170.55)), kind: "glitch", len: 10 },          // the outcome
  { at: at(V(189.63)), kind: "blurDip", len: 12 },
  { at: at(V(195.3)), kind: "blurDip", len: 12 },
  { at: at(V(197.3)), kind: "blurDip", len: 16 },
];

export const ALLOW = CUTS.filter((c) => c.kind !== "hard").map((c) => `${(c.at / 30 - 0.3).toFixed(2)}-${(c.at / 30 + 0.5).toFixed(2)}`).join(",");

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src! + ".mp4";
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [V(8.17), "sfx_n2/whoosh_02.wav", -30],
  [V(19.6), "sfx_n2/whoosh_01.wav", -31],
  [V(40.2), "sfx_n2/glitch_03.wav", -29],
  [V(57.85), "sfx_n2/whoosh_03.wav", -29],
  [V(102.8), X + "camera_shutter_2.wav", -27],
  [V(106.55), "sfx_n2/glitch_01.wav", -30],
  [V(118.6), "sfx_n2/glitch_02.wav", -27],
  [V(139.2), "sfx_n2/whoosh_02.wav", -31],
  [V(170.5), "sfx_n2/glitch_03.wav", -27],
];

// music: Epidemic ambient Music 4 (-11.9 LUFS file -> -21.5 dB, about 10 LU under the VO). It plays under the VO and under db's silent
// raws, and is out under every raw with its own sound (voices, the fireball); each run starts at a different place in the file.
const MUS: [number, number, number][] = [];
{
  let runA = -1, off = 0;
  VO.forEach((_, i) => {
    if (runA < 0) runA = voStart[i] - 0.4;
    const r = RAWS[i];
    if (i === VO.length - 1 || (r && r.sound === "own")) {
      const end = r ? rawStart[i] + 0.9 : T + 2.4;
      if (end - runA > 3) MUS.push([runA, end, end - runA > 70 ? 0 : off]); off = (off + 31) % 45; runA = -1;
    }
  });
}
export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="DRIVING OUT OF PARADISE" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={Math.max(1, F(s.b) - F(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only at the raws */}
      {VO.map(([a, b], i) => (
        <Sequence key={"v" + i} from={F(voStart[i])} durationInFrames={F(b - a) + 2} layout="none"><Audio src={staticFile("vor/CASE07.mp3")} startFrom={F(a)} endAt={F(b)} /></Sequence>
      ))}
      {/* raws: their own sound (par, mk) at full level, or for db's silent upload Megan's cabin sound from the same town as the bed; out before the VO */}
      {RAWS.map((r, i) => {
        if (!r) return null;
        const st = i === 11 ? rawStart[i] + 1.5 : rawStart[i], len = r.b - r.a, srcA = r.a;
        const fadeIn = i === 10 ? 2 : 5;
        const g = r.sound === "own" ? dB(-1) : dB(-3);
        return (
          <Sequence key={"r" + i} from={F(st)} durationInFrames={F(len)} layout="none">
            <Audio src={staticFile(MD + (r.sound === "own" ? r.src : "mk") + "_clean.wav")} startFrom={F(r.sound === "own" ? srcA : r.bed!)}
              volume={(f) => g * interpolate(f, [0, fadeIn, F(len) - 20, F(len) - 4], [0, 1, 1, 0], cl)} />
            {r.sound === "bed" && <Audio src={staticFile(X + "wind_gust_1.wav")} volume={(f) => dB(-16) * interpolate(f, [0, 10, F(len) - 24, F(len) - 6], [0, 1, 1, 0], cl)} />}
          </Sequence>
        );
      })}
      {MUS.map(([a, b, off], i) => (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b - a)} layout="none">
          <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(off)} volume={(f) => dB(-21.5) * interpolate(f, [0, 30, F(b - a) - 40, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
