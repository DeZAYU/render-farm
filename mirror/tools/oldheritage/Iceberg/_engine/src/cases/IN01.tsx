// Incidents #01 (cold open of the video) — Whitewater area, Pacific Crest Trail, Riverside County CA, 13 Apr 2025: a thru-hiker stuck on
// a crumbling grey face for over an hour; Riverside County Sheriff's Rescue 9 lowers rescue specialist Jason Beeman, who bear-hugs her
// and is hoisted with her. One source: the aircrew's own helmet/aircraft camera (Hook-in-Hand, X2GUQ7wjmsc, 19:50, 1920x1078).
// Media: a.mp4 = src 50-545 s (a t = src - 50), b.mp4 = src 700-1140 (b t = src - 700); raw audio a_clean.wav (rawclean.py) on a's clock.
// Timeline: R0 cold raw 0-12.5 (src 423.5-436: her red shoes and shaking legs on the rock, radio "he's right at her ... coming down
// about 30 feet ... getting a little dust on her now") | title 12.5-16.5 | VO A take 0-49.83 @16.5 | R1 66.33-80.33 (src 470.5-484.5:
// Beeman reaches her, "I'm tensioning ... hold there, holding") | VO B take 49.83-61.03 @80.33 | R2 91.53-121.13 (src 502-531.6, main:
// "lifting, tensioning", they swing off the face, "I'm moving!" "No, hold on to me ... grab ahold of it on my back ... get away from
// this wall") | VO C take 61.03-end @121.13, ends 155.88, hold to 156.6.
// Faces: the hiker's face only shows 10:20-13:40 (not used) and from 14:40 (source-blurred); shots chosen around it.
// Devices: FigureFind (frozen speck on the face, drained, bracket), HeadlineCut (real Advnture page, the quoted headline line lifts off).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { FigureFind } from "../dev/IN01_FigureFind";
import { HeadlineCut } from "../dev/IN01_HeadlineCut";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", A = GR + "a.mp4", B = GR + "b.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const END = 156.6;
export const DUR = F(END);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];
const sa = (src: number) => src - 50, sb = (src: number) => src - 700;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const V1 = 16.5, V2 = 80.33, V3 = 121.13;
const SHOTS: Sh[] = [
  // R0: cold open on the crew's camera
  { a: 0, b: 12.5, vo: "RAW 0 (src 423.5-436)", node: (n) => <Cam src={A} from={sa(423.5)} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.55])} /> },
  // VO A
  { a: V1 + 0, b: V1 + 5.0, vo: "On April 13, 2025, a woman hiking the Pacific Crest Trail in Southern California (door view over the desert ridges)",
    node: (n) => <Cam src={A} from={sa(90)} keys={K(n, [1.06, 0.5, 0.5], [1.16, 0.55, 0.5])} /> },
  { a: V1 + 5.0, b: V1 + 9.65, vo: "took a wrong turn near Whitewater, just north of Interstate 10. (the valley floor beyond the ridges)",
    node: (n) => <Cam src={A} from={sa(245)} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.45])} />, over: <RedLabel text="WHITEWATER, CALIFORNIA" at={F(0.9)} hold={F(3.3)} /> },
  { a: V1 + 9.65, b: V1 + 13.2, vo: "The path ran out on a slope of loose gray rock (the grey slope)",
    node: (n) => <Cam src={A} from={sa(266)} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.5, 0.6])} /> },
  { a: V1 + 13.2, b: V1 + 16.4, vo: "above a long drop, and when she tried to move, the ground wouldn't hold her. (crumbling rock underfoot)",
    node: (n) => <Cam src={A} from={sa(371)} keys={K(n, [1.15, 0.5, 0.5], [1.25, 0.5, 0.6])} /> },
  { a: V1 + 16.4, b: V1 + 21.0, vo: "She couldn't go up or down, so she gripped the cliff with a heavy pack still on her back (her pack from above)",
    node: (n) => <Cam src={A} from={sa(464)} keys={K(n, [1.12, 0.45, 0.5], [1.22, 0.4, 0.5])} /> },
  { a: V1 + 21.0, b: V1 + 24.2, vo: "and sent one emergency text to 911 from her (the crew scanning the grey face)",
    node: (n) => <Cam src={A} from={sa(116)} keys={K(n, [1.08, 0.5, 0.5], [1.18, 0.45, 0.55])} /> },
  { a: V1 + 24.2, b: V1 + 28.07, vo: "satellite messenger. She held that same spot for more than an hour. (FigureFind: the speck on the face)",
    node: (n) => <FigureFind src={A} t={sa(332)} spot={[0.385, 0.44]} at={10}
      keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.55, x: 0.4, y: 0.45 }]} /> },
  { a: V1 + 28.07, b: V1 + 32.06, vo: "The sheriff's office later wrote that she was clearly death gripping the cliff. (HeadlineCut: Advnture, 15 Apr 2025)",
    node: (n) => <HeadlineCut bg={A} bgT={sa(412)} bgKeys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.5])} sheet={C + "assets/adv_sheet.png"} sw={1328} sh={1660}
      quote={C + "assets/adv_quote.png"} qw={1090} qh={82} qx={54} qy={240} liftAt={36} /> },
  { a: V1 + 32.06, b: V1 + 35.3, vo: "What you're watching now comes from the crew who came for her, (the cabin)",
    node: (n) => <Cam src={A} from={sa(52)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.45])} /> },
  { a: V1 + 35.3, b: V1 + 38.87, vo: "on the Riverside County Sheriff's helicopter, Rescue 9. (crew at the open door)",
    node: (n) => <Cam src={A} from={sa(203)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.6, 0.5])} />, over: <RedLabel text="RESCUE 9 · RIVERSIDE COUNTY SHERIFF" at={F(0.4)} hold={F(3.0)} size={40} /> },
  { a: V1 + 38.87, b: V1 + 42.8, vo: "Their rescue specialist, Jason Beeman, rode the hoist cable down (stepping out of the door)",
    node: (n) => <Cam src={A} from={sa(236)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.6])} />, over: <RedLabel text="JASON BEEMAN" at={F(0.5)} hold={F(3.0)} /> },
  { a: V1 + 42.8, b: V1 + 46.75, vo: "toward a tiny figure on a pale face of rock, with a camera on his helmet. (descending, the figure on the face)",
    node: (n) => <Cam src={A} from={sa(321.5)} keys={K(n, [1.0, 0.5, 0.5], [1.1, 0.35, 0.4])} /> },
  { a: V1 + 46.75, b: V1 + 49.83, vo: "When he landed beside her, her legs were shaking. (her legs, red shoes)",
    node: (n) => <Cam src={A} from={sa(447)} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.5, 0.55])} /> },
  // R1
  { a: 66.33, b: 80.33, vo: "RAW 1 (src 470.5-484.5)", node: (n) => <Cam src={A} from={sa(470.5)} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  // VO B (picks up exactly where R1 ends: one continuous take of the helmet camera)
  { a: V2 + 0, b: V2 + 4.17, vo: "Asking her to let go and lift her arms into a rescue strap was too risky,",
    node: (n) => <Cam src={A} from={sa(484.5)} keys={K(n, [1.06, 0.5, 0.5], [1.14, 0.55, 0.45])} /> },
  { a: V2 + 4.17, b: V2 + 7.22, vo: "because one slip could take her straight off the face. (the drop below the ridge)",
    node: (n) => <Cam src={A} from={sa(347)} keys={K(n, [1.05, 0.5, 0.4], [1.15, 0.5, 0.6])} /> },
  { a: V2 + 7.22, b: V2 + 11.2, vo: "So he went with something much simpler, and told her to hold on to him. (his gloved hand round her arm)",
    node: (n) => <Cam src={A} from={sa(490)} keys={K(n, [1.1, 0.5, 0.5], [1.22, 0.45, 0.5])} /> },
  // R2 (main)
  { a: 91.53, b: 121.13, vo: "RAW 2 (src 502-531.6)", node: (n) => <Cam src={A} from={sa(502)} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.05, x: 0.5, y: 0.5 }]} /> },
  // VO C
  { a: V3 + 0, b: V3 + 3.57, vo: "Once she was on solid ground, she collapsed onto her side,",
    node: (n) => <Cam src={B} from={sb(708.5)} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.5])} /> },
  { a: V3 + 3.57, b: V3 + 7.5, vo: "then sat up and drank some water while the crew checked the scrapes down her legs.",
    node: (n) => <Cam src={B} from={sb(863)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.55])} /> },
  { a: V3 + 7.5, b: V3 + 11.53, vo: "She'd been about 20 days into her hike, and she decided to end it there. (hoisted toward the cabin)",
    node: (n) => <Cam src={B} from={sb(990)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.6])} /> },
  { a: V3 + 11.53, b: V3 + 15.48, vo: "The crew said afterward that he was completely confident he could hold on to her. (the helicopter overhead)",
    node: (n) => <Cam src={B} from={sb(1010)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.45])} /> },
  { a: V3 + 15.48, b: V3 + 19.02, vo: "I'm not sure I'd have felt that confident from her side of the hug. (her in the cabin, safe)",
    node: (n) => <Cam src={B} from={sb(1022)} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.5])} /> },
  { a: V3 + 19.02, b: V3 + 24.25, vo: "That was only the first of 25, and trust me, they get a lot more disturbing from here. (the landing zone)",
    node: (n) => <Cam src={B} from={sb(1130)} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.5])} /> },
  { a: V3 + 24.25, b: V3 + 29.5, vo: "Before we're done, you'll watch a fishing trawler go down in the ice with 91 men on board. (TEASER: case 18 trawler listing among the ice, crew archive ce-AviEAAFw, src 1:06.75-1:10)",
    node: (n) => <Cam src={GR + "t.mp4"} from={0.25} rate={0.65} keys={K(n, [1.08, 0.5, 0.5], [1.18, 0.5, 0.5])} />, over: <RedLabel text="BERING SEA · 2012" at={F(0.6)} hold={F(3.6)} size={42} /> },
  { a: V3 + 29.5, b: END, vo: "If raw moments like these are your thing, subscribe ... (wide desert from the door, easing back)",
    node: (n) => <Cam src={A} from={sa(160)} keys={K(n, [1.14, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
];

const CUTS: FxCut[] = [
  { at: F(12.5), kind: "glitch", len: 10 },
  { at: F(16.5), kind: "glitch", len: 10 },
  { at: F(V1 + 24.2), kind: "blurDip", len: 12 },  // into the frozen speck
  { at: F(V1 + 28.07), kind: "blurDip", len: 12 }, // into the page
  { at: F(V1 + 32.06), kind: "blurDip", len: 12 }, // out of the page
  { at: F(66.33), kind: "blurDip", len: 10 },      // legs -> R1 (same camera, 23 s later)
  { at: F(V3 + 19.02), kind: "blurDip", len: 12 },
  { at: F(V3 + 24.25), kind: "glitch", len: 10 },
  { at: F(V3 + 29.5), kind: "glitch", len: 10 },
];

const PART: [number, number, number | null][] = [[V1, 0, 49.83], [V2, 49.83, 61.03], [V3, 61.03, null]];
// raws: [timeline a, b, a.mp4 clock s, gain dB]
const RAWS: [number, number, number, number][] = [[0, 12.5, sa(423.5), 3], [66.33, 80.33, sa(470.5), 3], [91.53, 121.13, sa(502), 2]];
const SFX: [number, string, number][] = [
  [12.45, "sfx_n2/glitch_02.wav", -24], [16.45, "sfx_n2/glitch_01.wav", -28],
  [V1 + 28.1, "sfx_n2/real/paper_2.wav", -26], [V1 + 29.3, "sfx_n2/real/paper_3.wav", -28],
];
// rotor/wind bed under the silent VO footage, low
const BED: [number, number, string, number][] = [[16.5, 66.33, "sfx_n2/real/wind_gust_1.wav", -34]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={F(12.5)} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE HIKER FROZEN ON THE CLIFF" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE01.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/a_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, i === 0 ? 1 : 6, F(b - a) - 14, F(b - a) - 3], [i === 0 ? 1 : 0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} loop volume={(f) => dB(g) * interpolate(f, [0, 20, F(b - a) - 20, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3 (~-19 dB), in after the cold open, out under the raws */}
      <Sequence from={F(12.5)} durationInFrames={F(END - 12.5)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(6)} volume={(f) => {
          const t = f / 30 + 12.5;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? 0.12 + 0.88 * (ra - t) / 0.8 : t > rb ? 0.12 + 0.88 * (t - rb) / 0.6 : 0.12), 1);
          return dB(-19) * interpolate(t, [12.5, 14.0, END - 1.5, END], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
