// Theme Park #13 — Star City, Pasay (Manila), 2 Oct 2019: the park burns after closing. Channel grammar (TitleCard, RedLabel,
// glitch / blur-dip). Footage: AeroMark's night drone + ground camera (main; its soundtrack is added music -> always muted), a rooftop
// phone next to the fire (extra1; real sound -> the three raws), AeroMark's morning-after drone (after = source 130-350 s), a Feb 2022
// reopening walk (reopen = source 28-56 s, Travel Buddy). Devices built for this case: FireClock (24-h dial, 12:22 AM -> 4:32 AM ->
// 2:02 PM), Survivors (morning-after freeze: the coaster and the wheel that came through, everything else dimmed), Blender ballast
// (a fluorescent batten opened up, its ballast overheating while the tube fails). VO = one take, split only for the three raws.
// Source cuts: main 166.83 / 230.07 / 233.37 / 272.03 / 329.67; extra1 18.93 (bright work-light 84-91 avoided); reopen 2.23 / 7.5 /
// 19.43 / 27.93 (file s). Every window below sits between them.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { FireClock } from "../dev/TP13_FireClock";
import { Survivors } from "../dev/TP13_Survivors";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
// RAW AUDIT 3 Nov 2026: RAW 1 and RAW 2 lengthened IN CODE to 8 s (more of the same drone shot, no source cut crossed):
// X() shifts the original timeline: +3.0 s from 31.0 (RAW 1 26.0-34.0), +2.96 s more from 46.49 (RAW 2 44.45-52.45).
const X = (t: number) => t + (t >= 31.0 - 1e-6 ? 3.0 : 0) + (t >= 46.49 - 1e-6 ? 2.96 : 0);
const XF = (f: number) => F(X(f / 30));
const DUR = F(X(187.0));

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO take parts -> timeline (raws at every cut-sheet cue, in order):
// A1 take 0-22.0 @4.0 | R1 26.0-31.0 | A2 22.3-32.75 @31.0 | R2 41.45-46.49 | A3+B 32.75-39.55 @46.49 | R3 53.29-65.94 + R4 65.94-76.94
// | C1 39.6-51.2 @76.94 | R5 88.54-93.54 | C2+C3 51.2-57.95 @93.54 | R6 100.29-104.74 + R7 104.74-114.24  (3 Nov: no lone line between raws)
// | D 58.0-end @114.39
const SHOTS0: Sh[] = [
  { a: 4.0, b: 8.77, vo: "12:22 in the morning, Wednesday the 2nd of October 2019. (night drone: the glow in the dark)", src: "main.mp4", from: 0.8, s0: 1.04, s1: 1.1, fx: 0.45, fy: 0.5,
    over: <RedLabel text="OCTOBER 2, 2019" at={F(1.9)} hold={F(2.5)} /> },
  { a: 8.77, b: 13.99, vo: "Star City is an amusement park in the Cultural Center of the Philippines complex, in Pasay.", src: "main.mp4", from: 40.0, s0: 1.03, s1: 1.09, fx: 0.7, fy: 0.45,
    over: <RedLabel text="STAR CITY, PASAY" at={F(0.6)} hold={F(4.0)} /> },
  { a: 13.99, b: 17.8, vo: "It had closed for the night, and somewhere inside it a fire had started.", src: "main.mp4", from: 199.5, s0: 1.06, s1: 1.12, fx: 0.6, fy: 0.4 },
  { a: 17.8, b: 22.72, vo: "A lot of Star City is indoors, rides and attractions packed together under one roof.", src: "main.mp4", from: 211.5, s0: 1.14, s1: 1.06, fx: 0.4, fy: 0.45 },
  // "From above, the glow spread right across the complex." + RAW 1 (cue SC 0:12-0:42): the drone runs on over the glow (26.0-31.0)
  { a: 22.72, b: 31.0, vo: "From above, the glow spread right across the complex. + RAW 1 (drone, the glow across the complex)", src: "main.mp4", from: 14.0, s0: 1.02, s1: 1.14, fx: 0.5, fy: 0.5 },
  { a: 31.0, b: 33.49, vo: "For about two hours it stayed contained.", src: "main.mp4", from: 70.0, s0: 1.2, s1: 1.26, fx: 0.72, fy: 0.42 },
  { a: 33.49, b: 36.81, vo: "Then it didn't. The Bureau of Fire Protection raised the alarm (the flames burst through)", src: "main.mp4", from: 225.6, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.35 },
  // "...and in the end at least seventy turned up." + RAW 2 (cue SC 1:30-2:00): the drone over the trucks and the fire (41.45-46.49)
  { a: 36.81, b: 46.49, vo: "and sent nineteen trucks to begin with, and in the end at least seventy turned up. + RAW 2 (the road of emergency lights, the fire beyond)", src: "main.mp4", from: 100.0, s0: 1.04, s1: 1.12, fx: 0.25, fy: 0.6,
    punches: [{ at: F(1.3), to: 1.12, len: 22 }] },
  { a: 46.49, b: 50.89, vo: "Gabi ng Lagim, the park's horror attraction, was among the first things it took.", src: "main.mp4", from: 234.5, s0: 1.05, s1: 1.12, fx: 0.3, fy: 0.35 },
  { a: 50.89, b: 53.29, vo: "By now it ran the whole length of the park.", src: "main.mp4", from: 245.5, s0: 1.08, s1: 1.13, fx: 0.55, fy: 0.4 },
  // RAW 3 + RAW 4 back to back (owner 3 Nov: no lone VO line between raws): the rooftop next door, a firefighter against the flames,
  // then the long line of fire along the roofs (same phone, a later window, blur-dip between)
  { a: 53.29, b: 65.94, vo: "RAW: rooftop, firefighter and hose at the flames", src: "ex1.mp4", from: 6.0, s0: 1.02, s1: 1.06, fx: 0.3, fy: 0.45 },
  { a: 65.94, b: 76.94, vo: "RAW: the line of flames across the roofline", src: "ex1.mp4", from: 59.6, s0: 1.03, s1: 1.08, fx: 0.55, fy: 0.6 },
  { a: 76.94, b: 82.67, vo: "If you set out to design a building that burns well, you'd end up with something close to an indoor amusement park.", src: "main.mp4", from: 277.0, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.4 },
  { a: 82.67, b: 85.74, vo: "Everything is packed tight, and it's full of painted scenery and ride padding,", src: "main.mp4", from: 313.5, s0: 1.08, s1: 1.14, fx: 0.35, fy: 0.45 },
  { a: 85.74, b: 88.54, vo: "all under one shared roof. (night drone, the roof from above)", src: "main.mp4", from: 153.0, s0: 1.1, s1: 1.16, fx: 0.55, fy: 0.5 },
  // RAW 5 (cue SC 3:50-4:20): the ride buildings burning at ground level
  { a: 88.54, b: 93.54, vo: "RAW: open flames under the roofline", src: "main.mp4", from: 291.0, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.4 },
  { a: 93.54, b: 98.14, vo: "In there were the Dungeon of Terror, Bump Car Smash, Snow World and the Star Theater.", src: "main.mp4", from: 257.0, s0: 1.04, s1: 1.1, fx: 0.35, fy: 0.4 },
  { a: 98.14, b: 100.29, vo: "The crews were working right at the edge of it.", src: "main.mp4", from: 365.5, s0: 1.04, s1: 1.08, fx: 0.3, fy: 0.7 },
  // RAW 6 + RAW 7 back to back (no lone VO line between them): the ride buildings burning, then the hoses from the roof
  { a: 100.29, b: 104.74, vo: "RAW: the ride buildings burning", src: "main.mp4", from: 301.0, s0: 1.05, s1: 1.1, fx: 0.45, fy: 0.4 },
  // RAW 7 (cue SC 5:57, firefighters with hoses): the hoses arcing into it from the roof
  { a: 104.74, b: 114.24, vo: "RAW: hose streams into the fire", src: "ex1.mp4", from: 36.6, s0: 1.02, s1: 1.07, fx: 0.4, fy: 0.5 },
  // D: the morning after
  { a: 114.24, b: 122.25, vo: "Under control at 4:32 in the morning, declared out at 2:02 that afternoon, nearly fourteen hours after it started. (FireClock)",
    node: <FireClock bg={GR + "after.mp4"} bgFrom={2} start={{ t: 22 / 60, label: "12:22 AM", at: 6 }} events={[{ t: 4 + 32 / 60, label: "4:32 AM", at: F(1.3) }, { t: 14 + 2 / 60, label: "2:02 PM", at: F(4.05) }]} span={{ label: "13 HR 40 MIN", at: F(5.6) }} /> },
  { a: 122.25, b: 125.59, vo: "Nobody was hurt. (the morning: smoke still over the park)", src: "after.mp4", from: 6.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 125.59, b: 129.31, vo: "About eighty per cent of the park was damaged or destroyed, including twenty-five rides and attractions. (the roof fallen in)", src: "after.mp4", from: 132.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55,
    punches: [{ at: F(1.6), to: 1.1, len: 20 }] },
  { a: 129.31, b: 133.10, vo: "The Star Flyer coaster and the Giant Star Wheel made it through. (Survivors)",
    node: <Survivors src={GR + "after.mp4"} from={43.5} freezeAt={15} focus={[960, 560]}
      boxes={[{ box: [690, 670, 1185, 1035], label: "STAR FLYER", at: 15 }, { box: [1190, 40, 1540, 965], label: "GIANT STAR WHEEL", at: 57 }]} /> },
  { a: 133.10, b: 136.42, vo: "Investigators found gasoline and suspected arson, (back to the night: the fire from above)", src: "main.mp4", from: 126.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 136.42, b: 139.74, vo: "and management said the gasoline was for the bumper boats.", src: "after.mp4", from: 150.0, s0: 1.08, s1: 1.03, fx: 0.45, fy: 0.5 },
  { a: 139.74, b: 144.60, vo: "In December, the fire service's anti-arson task force ruled arson out.", src: "after.mp4", from: 182.0, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.5 },
  { a: 144.60, b: 152.35, vo: "It blamed an overheated light ballast at a game booth on the ground floor. A ballast is the part of a fluorescent light that controls the current. (Blender)",
    node: <AbsoluteFill style={{ background: "#000" }}><OffthreadVideo src={staticFile(GR + "ballast_soft.mp4")} muted playbackRate={0.775} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill> },
  { a: 152.35, b: 157.49, vo: "Management put the loss at a billion pesos,", src: "after.mp4", from: 166.0, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 157.49, b: 160.69, vo: "against the fire bureau's own provisional estimate of fifteen million, which is quite a gap.", src: "after.mp4", from: 120.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 160.69, b: 167.24, vo: "The labour department set aside five and a half million pesos in emergency aid for five hundred affected employees. (the park's front, smoke behind)", src: "after.mp4", from: 210.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 167.24, b: 171.69, vo: "Star City didn't reopen until the 24th of February 2022,", src: "reopen.mp4", from: 20.1, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.45,
    over: <RedLabel text="FEBRUARY 24, 2022" at={F(1.6)} hold={F(2.6)} /> },
  { a: 171.69, b: 175.33, vo: "after a planned soft opening that January was pushed back.", src: "reopen.mp4", from: 15.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 175.33, b: 178.91, vo: "Management had first hoped to reopen in October 2020. (the wheel and the coaster, running again)", src: "reopen.mp4", from: 2.95, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 178.91, b: 181.02, vo: "The gasoline got the headlines.", src: "main.mp4", from: 385.0, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 181.02, b: 187.0, vo: "The light fitting got a footnote three months later, when hardly anyone was still reading. (the last embers on the roof)", src: "ex1.mp4", from: 108.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.55 },
];

const SHOTS: Sh[] = SHOTS0.map((s) => ({ ...s, a: X(s.a), b: X(s.b) }));

const CUTS0: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(8.77), kind: "blurDip", len: 12 },    // drone -> drone, new framing
  { at: F(17.8), kind: "blurDip", len: 12 },    // ground camera, a later window
  { at: F(31.0), kind: "blurDip", len: 12 },    // drone -> drone
  { at: F(50.89), kind: "blurDip", len: 10 },   // main -> main, later window
  { at: F(65.94), kind: "blurDip", len: 10 },   // rooftop phone -> same phone, later window
  { at: F(82.67), kind: "blurDip", len: 10 },   // night -> night (dark joins read as jumps)
  { at: F(85.74), kind: "blurDip", len: 10 },
  { at: F(88.54), kind: "blurDip", len: 10 },   // into RAW 5 (cut out): its first half + the 93.54 dip's second half = one dip at the join
  { at: F(93.54), kind: "blurDip", len: 10 },   // ground camera, an earlier window
  { at: F(98.14), kind: "blurDip", len: 10 },
  { at: F(100.29), kind: "whip", len: 10 },     // into RAW 6 (cut out): its first half + the 114.24 whip's second half = one whip
  { at: F(114.24), kind: "whip", len: 10 },     // night -> the clock (time jump)
  { at: F(122.25), kind: "blurDip", len: 14 },  // the morning after
  { at: F(133.10), kind: "blurDip", len: 12 },  // morning -> the night (time jump)
  { at: F(136.42), kind: "blurDip", len: 12 },  // back to the morning
  { at: F(144.6), kind: "zoomHit", len: 10 },   // into the ballast
  { at: F(152.35), kind: "blurDip", len: 12 },
  { at: F(167.24), kind: "glitch", len: 8 },    // 2022
  { at: F(178.91), kind: "glitch", len: 8 },    // back to the night
  { at: F(181.02), kind: "blurDip", len: 12 },
]
const CUTS: FxCut[] = CUTS0.map((c) => ({ ...c, at: XF(c.at) }));

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const XR = "sfx_n2/real/";
const SFX0: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [114.25, "sfx_n2/whoosh_01.wav", -28],   // was 114.19: moved past the RAW 6+7 cut so it survives
  [114.89, XR + "tape_click_2.wav", -30],     // the clock hand starts
  [129.74, XR + "camera_shutter_2.wav", -27], // the freeze
  [144.55, "sfx_n2/whoosh_02.wav", -30],
  [146.79, XR + "static_3.wav", -34],         // the tube failing
  [167.19, "sfx_n2/glitch_03.wav", -28],
  [178.86, "sfx_n2/glitch_01.wav", -28],
]
const SFX = SFX0.map(([t, f, d]) => [X(t), f, d] as [number, string, number]);

// raw windows: [timeline a, b, source s, gain dB]. Sound = extra1's own track cleaned by rawclean.py (+6 dB, limited: ex1_clean_amp).
// The four main-camera raws (its track is added music only) get the same fire's real roar from the rooftop phone (ex1 96-108 s, no speech).
const RAWS0: [number, number, number, number][] = [[26.0, 31.0, 96.0, -8], [41.45, 46.49, 101.0, -8], [53.29, 65.94, 6.0, -6], [65.94, 76.94, 59.6, 0],
  [88.54, 93.54, 104.0, -6], [100.29, 104.74, 97.5, -6], [104.74, 114.24, 36.6, -3]];
// RAWS 5-7 stay listed: their windows are cut out below (cutOut), and they keep the music dipped at the joins
const RAWS = RAWS0.map(([a, b, src, g]) => [X(a), X(b), src, g] as [number, number, number, number]);

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="STAR CITY BURNS AFTER CLOSING" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only where the raws play (cut-sheet cue positions) */}
      {([[4.0, 0, 22.0], [31.0, 22.3, 32.75], [46.49, 32.75, 39.55], [76.94, 39.6, 51.2], [93.54, 51.2, 57.95]] as const).map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(X(at))} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE13.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      <Sequence from={F(X(114.39))} layout="none"><Audio src={staticFile("vor/CASE13.mp3")} startFrom={F(58.0)} /></Sequence>
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/ex1_clean_amp.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 4), dipped under each raw, a second pass from a later offset for the morning after */}
      <Sequence from={F(4.0)} durationInFrames={F(X(114.4)) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(6)} volume={(f) => {
          const t = f / 30 + 4.0; const duck = RAWS.reduce((m, [a, b]) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);
          return dB(-22) * interpolate(f, [0, 30, F(X(113.4) - 4.0), F(X(114.4) - 4.0)], [0, 1, 1, 0], cl) * (0.12 + 0.88 * duck);
        }} />
      </Sequence>
      <Sequence from={F(X(114.24))} durationInFrames={F(X(187.0)) - F(X(114.24))} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(40)} volume={(f) => dB(-22) * interpolate(f, [0, F(1.5), F(70.0), F(72.7)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): RAW 5 (open flames, after the 'building that burns well' explanation)
// and RAW 6+7 (ride buildings + hoses, a near-duplicate of the main rooftop raw) removed: windows in X() timeline. 7 -> 3 raw moments.
const _cut = cutOut(CompFull, DUR, [[X(88.54), X(93.54)], [X(100.29), X(114.24)]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
