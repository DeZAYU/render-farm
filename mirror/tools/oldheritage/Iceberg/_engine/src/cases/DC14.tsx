// Dashcam #14 — Nashville, 4 Jul 2021 ~10:15 PM: a lit firework thrown from a white sedan's back window into Colin Kirby's open
// convertible at the red light at 17th Avenue North and Church Street. One source: the friends' pickup dashcam, the family's own
// upload (Kathy Kirby, QYBBLyx34VI), 1920x1080 33.75 s. media/main.mp4 = whole clip with the camera's wrong clock stamp (TOGUARD
// 09/01/2019) delogo'd and both plates blurred (convertible 6-33.8 s, sedan while parked 21-28.6 s). Sound: street ambience, the
// burst at 30-33 ("Oh"); rawclean.py removed street music at 2-14 s (outside the raw).
// VO = one take (CASE14.mp3, no count word), split once at the raw:
//   A 0-27.46 @4.00 | R1 31.46-46.41 (src 18.8-33.75, main raw: the sedan rolls up, sits, the firework leaves its back window,
//   the sedan pulls away, the burst, smoke) | B 27.46-end @46.41, VO ends 103.30, hold to 104.2.
// Under the VO: src 0-18.8 before the raw (slowed opening, one continuous move to the street sign and back), after it slow
// reframed replays only (SparkHold on the throw, the burst, the cabin, the sedan leaving) + Kirby's own photo of the burned top
// and the FOX 5 page. Devices: SparkHold, PageLamp (+ brand Inset once, TitleCard, RedLabel).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { SparkHold } from "../dev/DC14_SparkHold";
import { PageLamp } from "../dev/DC14_PageLamp";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(104.2);
const B = 18.95; // VO part B: timeline = take time + B
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 9.2, vo: "Nashville's Fourth of July fireworks show had just ended in 2021 (the pickup driving through Midtown, 0.5x)",
    node: (n) => <Cam src={M} from={0.0} rate={0.5} keys={K(n, [1.12, 0.5, 0.45], [1.22, 0.5, 0.5])} />, over: <RedLabel text="NASHVILLE, TENNESSEE · JULY 4, 2021" at={F(0.6)} hold={F(3.8)} size={42} /> },
  { a: 9.2, b: 14.36, vo: "when Colin Kirby started home through Midtown in his convertible, top down, a friend in the passenger seat (tight on the convertible ahead)",
    node: (n) => <Cam src={M} from={2.6} rate={0.58} keys={K(n, [1.9, 0.47, 0.5], [2.15, 0.47, 0.52])} /> },
  // one continuous move: the pickup's hood -> the light turns red -> the 17TH AVE N sign -> back out to the two cars at the light
  { a: 14.36, b: 28.41, vo: "Two more friends followed ... dashcam running. / At about 10:15 p.m., the light turned red at 17th Avenue North and Church Street, and Kirby stopped. / From the pickup it's nothing at all, just two cars waiting at a light.",
    node: (n) => <Cam src={M} from={5.6} rate={0.94} keys={[
      { f: 0, s: 1.25, x: 0.5, y: 0.78 }, { f: F(3.2), s: 1.25, x: 0.5, y: 0.7 }, { f: F(6.4), s: 2.7, x: 0.39, y: 0.31 }, { f: F(9.6), s: 2.75, x: 0.39, y: 0.31 },
      { f: F(12.6), s: 1.18, x: 0.3, y: 0.58 }, { f: n, s: 1.15, x: 0.25, y: 0.6 }]} />,
    over: <RedLabel text="17TH AVENUE NORTH & CHURCH STREET" at={F(6.6)} hold={F(3.6)} size={40} /> },
  { a: 28.41, b: 31.46, vo: "Pay attention to the white sedan that rolls up on his left. (held frame, easing back to the full frame; the raw runs on from it)",
    node: (n) => <Cam src={M} t={18.8} keys={[{ f: 0, s: 1.15, x: 0.25, y: 0.6 }, { f: 30, s: 1.17, x: 0.2, y: 0.6 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  // RAW 1 (main): src 18.8-33.75 — the sedan pulls up, sits beside him, the firework leaves its back window (27.4), the sedan pulls
  // off (29), the first flash (30.2), the burst over the car (32), smoke
  { a: 31.46, b: 46.41, vo: "RAW 1 (src 18.8-33.75)", node: (n) => <Cam src={M} from={18.8} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.4, 0.55])} /> },
  { a: 27.46 + B, b: 32.73 + B, vo: "Police said a passenger in the back rolled the window down and threw a lit firework into the open car. (SparkHold)",
    node: (n) => <SparkHold src={M} from={26.6} rate={0.4} holdAt={68} holdLen={40} spot={[0.31, 0.52, 0.085, 0.07]}
      keys={[{ f: 0, s: 2.0, x: 0.3, y: 0.55 }, { f: 68, s: 2.25, x: 0.3, y: 0.53 }, { f: 108, s: 2.3, x: 0.36, y: 0.54 }, { f: n, s: 2.35, x: 0.4, y: 0.56 }]} /> },
  { a: 32.73 + B, b: 37.33 + B, vo: "It hit Kirby in the back of the head and went off somewhere between six and ten inches from it. (0.5x, tight on the convertible, first flash)",
    node: (n) => <Cam src={M} from={29.2} rate={0.5} keys={K(n, [2.0, 0.44, 0.58], [2.2, 0.44, 0.58])} /> },
  { a: 37.33 + B, b: 42.05 + B, vo: "He burned two fingers grabbing at it. / Kirby pulled over and called 911. (the burst blooming, smoke, pulling back)",
    node: (n) => <Cam src={M} from={31.5} rate={0.466} keys={K(n, [1.6, 0.45, 0.5], [1.12, 0.47, 0.5])} /> },
  { a: 42.05 + B, b: 47.73 + B, vo: "Apart from those fingers, slight hearing loss ..., and his passenger wasn't hurt. (the two of them in the cabin, 0.6x)",
    node: (n) => <Cam src={M} from={21.6} rate={0.6} keys={K(n, [2.6, 0.43, 0.56], [2.8, 0.43, 0.56])} /> },
  { a: 47.73 + B, b: 51.15 + B, vo: "He said afterward it could've just as easily landed in his lap. (tight on the open cabin / folded top at the light)",
    node: (n) => <Cam src={M} from={12.2} rate={0.7} keys={K(n, [3.0, 0.43, 0.56], [3.15, 0.43, 0.57])} /> },
  { a: 51.15 + B, b: 56.87 + B, vo: "The blast burned a hole through the roof and scorched the trim and a door, about $3,000 in damage. (Kirby's own photo of the burned top, Inset)",
    node: () => <Inset src={GR + "burn.jpg"} still box={0.3} ar={556 / 740} drift={0.08} /> },
  { a: 56.87 + B, b: 70.67 + B, vo: "His mother, Kathy, posted the clip ... national news. / Metro Nashville Police ... white Infiniti G37 ... aggravated assault with a deadly weapon. (PageLamp: FOX 5 page)",
    node: () => <PageLamp bg={M} bgFrom={24.0} bgKeys={K(F(13.8), [1.1, 0.4, 0.5], [1.16, 0.35, 0.5])} sheet={GR + "fox_sheet.png"} sw={2100} sh={1021}
      head={[70, 160, 2070, 601]} para={[70, 661, 1438, 951]} moveAt={F(4.6)} moveLen={F(2.6)} /> },
  { a: 70.67 + B, b: 76.13 + B, vo: "They called it random, and the ATF looked into it as well, but no arrest has ever been announced. (the sedan pulling away, 0.26x)",
    node: (n) => <Cam src={M} from={28.9} rate={0.26} keys={K(n, [2.0, 0.22, 0.58], [2.15, 0.2, 0.58])} /> },
  { a: 76.13 + B, b: 80.48 + B, vo: "Kirby said he'd forgiven whoever did it, but he still wanted them held accountable. (the sedan rolling up beside him, 0.4x)",
    node: (n) => <Cam src={M} from={19.4} rate={0.4} keys={K(n, [1.7, 0.3, 0.6], [1.85, 0.27, 0.6])} /> },
  { a: 80.48 + B, b: 104.2, vo: "I'm not sure I could forgive anybody that fast with two burned fingers. (the burst frozen at its height, slow push)",
    node: (n) => <Cam src={M} t={32.15} keys={K(n, [1.05, 0.46, 0.45], [1.25, 0.46, 0.45])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.2), kind: "blurDip", len: 10 },     // same camera, reframe
  { at: F(14.36), kind: "blurDip", len: 10 },
  { at: F(46.41), kind: "blurDip", len: 14 },   // raw -> the slow replay
  { at: F(32.73 + B), kind: "blurDip", len: 10 },
  { at: F(37.33 + B), kind: "blurDip", len: 10 },
  { at: F(42.05 + B), kind: "blurDip", len: 12 }, // time jump back to the cabin
  { at: F(47.73 + B), kind: "blurDip", len: 10 },
  { at: F(51.15 + B), kind: "glitch", len: 10 },  // the photo
  { at: F(56.87 + B), kind: "blurDip", len: 12 }, // into the page
  { at: F(70.67 + B), kind: "glitch", len: 10 },  // back to the street
  { at: F(76.13 + B), kind: "blurDip", len: 10 },
  { at: F(80.48 + B), kind: "blurDip", len: 12 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 27.46], [46.41, 27.46, null]];
const RAWS: [number, number, number, number, number][] = [[31.46, 46.41, 18.8, 4, 0.12]];
// the burst itself is ~24 dB above the street sound in the source: pulled down 14 dB from the first flash (src 30.1) so it lands a
// little above the voice instead of blasting
const BURST = (srcT: number) => interpolate(srcT, [30.0, 30.25], [1, dB(-14)], cl);
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [51.15 + B - 0.05, "sfx_n2/glitch_01.wav", -28], [56.9 + B, "sfx_n2/real/paper_2.wav", -26],
  [70.67 + B - 0.05, "sfx_n2/glitch_03.wav", -28],
  [27.46 + B + 2.25, "sfx_n2/real/tape_click_2.wav", -30],  // the freeze on the throw
];
// low, distant fireworks thuds under the opening (the show had just ended) — real booms, far down in the mix
const BED: [number, number, string, number][] = [[4.2, 9.2, "sfx_n2/real/boom_4.wav", -34]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE FIREWORK AT THE RED LIGHT" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX>{s.over}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE14.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * BURST(src + f / 30) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} volume={(f) => dB(g) * interpolate(f, [0, 12, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3 (~-20 dB), ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={DUR - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(30)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-20) * interpolate(t, [4.0, 5.0, 102.7, 104.2], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
