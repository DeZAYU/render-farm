// Incidents #25 (the video's last case; its VO take ends with the outro line): Graham and Ellie (Wizard in the Wild), Nov 2022:
// bricks thrown through their motorhome Merlin at ~1 a.m. in a car park on Henshall Lane near Altrincham. Source: Wizard in the Wild
// 098J6El9Tmo (1080p29.97). media/src.mov = file windows re-timed to 30 fps: A 290-700 -> 0-410 | B 750-830 -> 410-490 |
// C 1150-1240 -> 490-580 | D 105-140 -> 580-615 (graded/main.mp4). The attack is off camera (aftermath only). Their burned captions
// ("Now worked out it was 3 maybe 4…" file 425, third-brick captions 530/540, "I didn't spot this dent…" 545) are avoided or framed
// out; the dent shot (file 545) is not used: a one-frame flash in it. Their map / Street View frames are not used. The other
// motorhome's crew is never visible in the windows used (the taping raw is near-black); nobody else is shown or named.
// VO = one take (CASE25.mp3), split only at the raws:
//   A 0-16.95 @4.0 (the live film runs on into R1) | R1 main file 363.4-386.4 (Ellie: "woken up with a loud bang… is that glass?
//   Two bricks, and someone's just smashed Merlin's windows while they're sleeping… we don't recommend this as a place to stop")
//   | B 16.95-39.0 | R2 file 392.0-403.9 ("here's us in the middle of nowhere with a broken window and a cracked windscreen, 200 miles
//   from home") | C 39.0-59.94 | R3 file 483.0-492.5 (taping the window in the rain: "it's all falling down in the door") | D 59.94-end
//   incl. the video's outro line, ending on EndRecede and a fade to black.
// Device: EndRecede.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { TypeTitle, Credit } from "../dev/IN21_kit";
import { EndRecede } from "../dev/IN25_EndRecede";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const seg = (file: number) => file < 200 ? file + 475 : file < 720 ? file - 290 : file < 900 ? file - 340 : file - 660;

const SPL = [16.95, 39.0, 59.94];
const R1: [number, number] = [seg(363.4), seg(386.4)], R2: [number, number] = [seg(392.0), seg(403.9)], R3: [number, number] = [seg(483.0), seg(492.5)];
const tA = 4.0, tR1 = tA + SPL[0], tB = tR1 + R1[1] - R1[0], tR2 = tB + SPL[1] - SPL[0], tC = tR2 + R2[1] - R2[0], tR3 = tC + SPL[2] - SPL[1], tD = tR3 + R3[1] - R3[0];
const VOEND = 69.8, END = tD + VOEND - SPL[2] + 1.3;
export const DUR = F(END);
const a = (t: number) => tA + t, b = (t: number) => tB + t - SPL[0], c = (t: number) => tC + t - SPL[1], d = (t: number) => tD + t - SPL[2];
const K = (n: number, p: [number, number, number], q: [number, number, number]): CK[] => [{ f: 0, s: p[0], x: p[1], y: p[2] }, { f: n, s: q[0], x: q[1], y: q[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: a(0), b: a(6.62), vo: "Graham and Ellie travel Britain in a motorhome they call Merlin, and film it all for their channel, Wizard in the Wild. (the two of them)",
    node: (n) => <Cam src={M} from={seg(300)} keys={K(n, [1.05, 0.5, 0.45], [1.16, 0.5, 0.42])} />,
    over: <><Credit text="WIZARD IN THE WILD" at={6} hold={F(5.5)} /><RedLabel text="GRAHAM & ELLIE" at={F(1.0)} hold={F(4.0)} /></> },
  { a: a(6.62), b: a(15.49), vo: "One night in November 2022, a little after one in the morning, Graham stepped out into pouring rain ... (the car park at night)",
    node: (n) => <Cam src={M} from={seg(640)} keys={K(n, [1.05, 0.5, 0.5], [1.2, 0.5, 0.5])} />, over: <RedLabel text="NOVEMBER 2022 · 1 A.M." at={F(0.8)} hold={F(3.4)} /> },
  // the live film runs on, unbroken, into RAW 1
  { a: a(15.49), b: tB, vo: "Here's what he found. -> RAW 1", node: (n) => <Cam src={M} from={seg(363.4) - (tR1 - a(15.49))} keys={K(n, [1.0, 0.5, 0.5], [1.1, 0.5, 0.5])} /> },
  { a: tB, b: b(21.8), vo: "They'd been rushing home from the Isle of Arran because of a family emergency, (the two of them)",
    node: (n) => <Cam src={M} from={seg(111.1)} keys={K(n, [1.05, 0.5, 0.45], [1.15, 0.5, 0.45])} /> },
  { a: b(21.8), b: b(26.6), vo: "and after a long day of driving they picked a well-reviewed parking lot on Henshall Lane, near Altrincham. (night road)",
    node: (n) => <Cam src={M} from={seg(795.6)} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.5, 0.5])} />, over: <RedLabel text="HENSHALL LANE · NEAR ALTRINCHAM" at={F(0.4)} hold={F(4.0)} size={42} /> },
  { a: b(26.6), b: b(28.19), vo: "They were in bed by eleven.", node: (n) => <Cam src={M} from={seg(1160)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.5])} /> },
  { a: b(28.19), b: b(34.56), vo: "Around one, a car stereo thumped somewhere close and went quiet, and then came one enormous bang.",
    node: (n) => <Cam src={M} from={seg(660)} keys={K(n, [1.05, 0.5, 0.5], [1.22, 0.5, 0.5])} /> },
  { a: b(34.56), b: tR2, vo: "Graham thought a branch had hit the roof, but he'd parked away from the trees on purpose.", node: (n) => <Cam src={M} from={seg(630)} keys={K(n, [1.05, 0.5, 0.45], [1.15, 0.5, 0.4])} /> },
  { a: tR2, b: tC, vo: "RAW 2: Ellie, 200 miles from home", node: (n) => <Cam src={M} from={R2[0]} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.5])} /> },
  { a: tC, b: c(40.87), vo: "Later they found a third brick.", node: (n) => <Cam src={M} from={seg(534.2)} keys={K(n, [1.1, 0.5, 0.55], [1.25, 0.5, 0.58])} /> },
  { a: c(40.87), b: c(47.92), vo: "Three hits at once meant at least three people throwing, ... and nobody ever saw a face. (the broken window, next day)",
    node: (n) => <Cam src={M} from={seg(765.9)} keys={K(n, [1.05, 0.5, 0.5], [1.22, 0.5, 0.5])} /> },
  { a: c(47.92), b: c(53.11), vo: "So why them, and not the other motorhome on the same lot? I don't think anyone will ever know.", node: (n) => <Cam src={M} from={seg(685)} keys={K(n, [1.05, 0.5, 0.5], [1.18, 0.5, 0.5])} /> },
  { a: c(53.11), b: tR3, vo: "The people inside it had heard a car screech away, and they came over in the rain with garbage bags and tape for the broken window.",
    node: (n) => <Cam src={M} from={seg(470)} keys={K(n, [1.05, 0.5, 0.5], [1.16, 0.5, 0.5])} /> },
  { a: tR3, b: tD, vo: "RAW 3: taping the window in the rain", node: (n) => <Cam src={M} from={R3[0]} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.5])} /> },
  { a: tD, b: d(64.93), vo: "Graham and Ellie didn't spot the dent in the side until they were home, 200 miles later. (home in daylight)",
    node: (n) => <Cam src={M} from={seg(1232.5)} keys={K(n, [1.05, 0.5, 0.5], [1.18, 0.5, 0.5])} /> },
  { a: d(64.93), b: END, vo: "If you want to see even more disturbing incidents caught on camera, watch this one next. (EndRecede)",
    node: (n) => <EndRecede src={M} from={seg(1225)} n={n} at={F(67.3 - 64.93)} /> },
];

const CUTS: FxCut[] = [
  { at: F(tA), kind: "glitch", len: 10 },
  { at: F(a(15.49)), kind: "blurDip", len: 12 },
  { at: F(tB), kind: "blurDip", len: 12 },
  { at: F(b(34.56)), kind: "blurDip", len: 10 },
  { at: F(tR2), kind: "blurDip", len: 10 },
  { at: F(tC), kind: "blurDip", len: 10 },
  { at: F(c(47.92)), kind: "blurDip", len: 10 },
  { at: F(tR3), kind: "blurDip", len: 10 },
  { at: F(tD), kind: "blurDip", len: 10 },
  { at: F(d(64.93)), kind: "blurDip", len: 12 },
];
export const ALLOW = CUTS.map((x) => `${(x.at / 30 - 0.35).toFixed(2)}-${(x.at / 30 + 0.45).toFixed(2)}`).join(",");

const PART: [number, number, number | null][] = [[tA, 0, SPL[0]], [tB, SPL[0], SPL[1]], [tC, SPL[1], SPL[2]], [tD, SPL[2], null]];
const RAWS: [number, number, number, number, number][] = [[tR1, tB, R1[0], 2, 0.15], [tR2, tC, R2[0], 2, 0.2], [tR3, tD, R3[0], 3, 0.25]];
const SFX: [number, string, number][] = [[tA - 0.05, "sfx_n2/glitch_02.wav", -24], [b(33.4), "sfx_n2/real/impact_2.wav", -26]];
const BED: [number, number, string, number][] = [[a(6.62), a(15.49), "sfx_n2/real/rain_5.wav", -30], [b(28.19), tR2, "sfx_n2/real/rain_9.wav", -32]];
const MUS: [number, number, number][] = [[tA, tR1 + 1.5, 20], [tR1 + 2, END, 40]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(tA)} layout="none"><AbsoluteFill><TypeTitle dur={F(tA)} title="BRICKS THROUGH THE WINDOW" place="NEAR ALTRINCHAM, ENGLAND · 2022" bg={GR + "title.jpg"} size={84} /></AbsoluteFill></Sequence>
          {SHOTS.map((sh, i) => {
            const n = F(sh.b) - F(sh.a);
            return (
              <Sequence key={i} from={F(sh.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{sh.node(n)}</FilmLook_FX>{sh.over}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE25.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([ra, rb, src, g], i) => (
        <Sequence key={"r" + i} from={F(ra)} durationInFrames={F(rb) - F(ra)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(rb - ra) - 12, F(rb - ra) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([ba, bb, file, g], i) => (
        <Sequence key={"b" + i} from={F(ba)} durationInFrames={F(bb) - F(ba)} layout="none">
          <Audio src={staticFile(file)} volume={(f) => dB(g) * interpolate(f, [0, 15, F(bb - ba) - 15, F(bb - ba)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {MUS.map(([ma, mb, off], k) => (
        <Sequence key={"m" + k} from={F(ma)} durationInFrames={F(mb) - F(ma)} layout="none">
          <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + ma;
            const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
            const env = interpolate(t, [ma, ma + 1, mb - 1.2, mb], [0, 1, 1, 0], cl);
            return dB(-20) * env * duck;
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, g], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(g)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
