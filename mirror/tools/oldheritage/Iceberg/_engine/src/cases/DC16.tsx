// Dashcam #16 — Brook Park, Ohio, 10 Mar 2016, ~4:15 PM: Officer Harold Duncan pulls up to a crossing near Route 237 where Richard
// Boga's AT&T van is stuck across the tracks, gets him away from it, and a Norfolk Southern train hits the van. Source: the Brook
// Park PD release (FB, 15 Mar 2016) via Tony Donald (NDZwik41ibo), 640x360, upscaled (lanczos) to 1920x1080, used 0-61.3 s:
// 0-23.5 the camera's first (zoomed) view, the stamp cut off at the right; 23.9 a cut in the release to the full view with the whole
// stamp (16:15:31 ...; impact 16:15:43 at 35.6); 43-61.3 the release's own zoomed slow-motion replay; the full repeat after 61.3 is
// not used. The source is SILENT: real SFX timed to the picture.
// VO = one take (CASE16.mp3, no count word), split once at the raw:
//   A 0-43.07 @4.00 | R1 47.07-70.47 (src 19.6-43.0, main: Duncan runs to the van, walks Boga off, turns, the train hits the van and
//   shoves it away, freight cars pass) | B 43.07-end @70.47, VO ends 104.82, hold to 105.7.
// Devices: RunHold (held frame before he gets out), StampSplit (two frozen frames, the camera's own clock), PageSlide (WHDH page).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { RunHold } from "../dev/DC16_RunHold";
import { StampSplit } from "../dev/DC16_StampSplit";
import { PageSlide } from "../dev/DC16_PageSlide";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(105.7);
const OB = 27.40; // VO part B: timeline = take time + OB
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 9.0, vo: "Harold Duncan was a police officer in Brook Park, Ohio, about 10 miles southwest of Cleveland, (the cruiser driving in the rain)",
    node: (n) => <Cam src={M} from={0.0} keys={K(n, [1.06, 0.5, 0.4], [1.14, 0.5, 0.38])} />, over: <RedLabel text="BROOK PARK, OHIO" at={F(0.8)} hold={F(3.6)} /> },
  // one continuous move: down onto the camera's own date in the corner -> up to the crossing -> the flashing signal
  { a: 9.0, b: 20.71, vo: "and on the gray, rainy afternoon of March 10, 2016, he pulled up to a railroad crossing near Route 237 with his dash camera rolling. / The bells were ringing and the gates were down.",
    node: (n) => <Cam src={M} from={5.0} rate={0.8} keys={[
      { f: 0, s: 1.1, x: 0.5, y: 0.4 }, { f: F(3.6), s: 1.2, x: 0.52, y: 0.35 },
      { f: F(5.6), s: 1.3, x: 0.55, y: 0.3 }, { f: F(8.6), s: 1.35, x: 0.6, y: 0.3 }, { f: F(10.0), s: 2.2, x: 0.9, y: 0.12 }, { f: n, s: 2.3, x: 0.9, y: 0.12 }]} />, over: <RedLabel text="MARCH 10, 2016" at={F(0.5)} hold={F(3.6)} /> },
  { a: 20.71, b: 25.42, vo: "On the far side, a white AT&T work van was sitting right across the tracks. (tight on the van, 0.6x)",
    node: (n) => <Cam src={M} from={14.5} rate={0.6} keys={K(n, [1.9, 0.22, 0.2], [2.1, 0.23, 0.2])} /> },
  { a: 25.42, b: 30.62, vo: "Its driver, Richard Boga, had gone around a truck at the crossing while the lights were flashing. (the gate arm and the flashing lights, 0.5x)",
    node: (n) => <Cam src={M} from={9.0} rate={0.5} keys={K(n, [1.7, 0.72, 0.22], [1.85, 0.74, 0.2])} /> },
  { a: 30.62, b: 34.19, vo: "His front wheel dropped into the rail, and the van wouldn't budge. (held, tight on the van's front at the rail)",
    node: (n) => <Cam src={M} t={17.4} keys={K(n, [2.5, 0.19, 0.24], [2.75, 0.18, 0.25])} /> },
  { a: 34.19, b: 38.95, vo: "He'd gotten out by now, and reports said he looked calm, gathering up his things. (Boga at the open van door, 0.42x)",
    node: (n) => <Cam src={M} from={17.4} rate={0.42} keys={K(n, [2.2, 0.26, 0.2], [2.35, 0.27, 0.2])} /> },
  { a: 38.95, b: 47.07, vo: "Duncan wasn't calm at all, and he ordered Boga away. / Follow the officer as he runs for that van, with the clock ticking in the corner of the frame. (RunHold)",
    node: (n) => <RunHold src={M} t={19.6} at={8} backAt={n - 34}
      pools={[{ f: 0, x: 0.26, y: 0.32, rx: 0.3, ry: 0.36 }, { f: F(3.4), x: 0.26, y: 0.32, rx: 0.3, ry: 0.36 }, { f: F(5.6), x: 0.82, y: 0.95, rx: 0.2, ry: 0.12 }]}
      keys={[{ f: 0, s: 1.1, x: 0.4, y: 0.4 }, { f: F(3.3), s: 1.3, x: 0.3, y: 0.3 }, { f: F(5.6), s: 2.2, x: 0.8, y: 0.95 }, { f: n - 34, s: 2.25, x: 0.8, y: 0.95 }, { f: n - 2, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  // RAW 1 (main): src 19.6-43.0 — he runs to the van (20-22.5), the release cuts to the full view at 23.9 (the clock appears),
  // he walks Boga off the tracks toward the camera, turns back, the train hits the van (35.6, 16:15:43) and shoves it off, freight cars
  { a: 47.07, b: 70.47, vo: "RAW 1 (src 19.6-43.0)", node: (n) => <Cam src={M} from={19.6} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.48])} /> },
  { a: 43.07 + OB, b: 51.49 + OB, vo: "So how long did he have? By the camera's clock, about 13 seconds passed between Duncan reaching that van and the Norfolk Southern train hitting it. (StampSplit)",
    node: () => <StampSplit src={M} bgFrom={30.0} rightAt={F(1.4)}
      left={{ t: 22.4, keys: [{ f: 0, s: 2.0, x: 0.2, y: 0.17 }, { f: 250, s: 2.15, x: 0.2, y: 0.17 }] }}
      right={{ t: 35.6, keys: [{ f: 0, s: 1.05, x: 0.45, y: 0.45 }, { f: 70, s: 1.08, x: 0.5, y: 0.5 }, { f: 120, s: 3.3, x: 0.86, y: 0.955 }, { f: 260, s: 3.4, x: 0.86, y: 0.955 }] }} /> },
  { a: 51.49 + OB, b: 57.14 + OB, vo: "News reports rounded that up to about 20 seconds, but the camera's count is the one I'd trust. (PageSlide: WHDH)",
    node: () => <PageSlide bg={M} bgFrom={12.0} bgKeys={K(F(5.65), [1.1, 0.5, 0.5], [1.15, 0.5, 0.45])} sheet={GR + "whdh_sheet.png"} sw={2560} sh={1332}
      para={[228, 1150, 1650, 1250]} phrase={[1145.8, 1154.6, 1330.9, 1198.6]} moveAt={F(1.4)} moveLen={F(2.0)} /> },
  { a: 57.14 + OB, b: 62.21 + OB, vo: "Brook Park Police posted the video on Facebook five days later, and it spread from there. (the release's own slow-motion replay, to the impact)",
    node: (n) => <Cam src={M} from={46.5} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.4, 0.45])} /> },
  { a: 62.21 + OB, b: 66.80 + OB, vo: "Nobody was hurt, and the van was empty when the train hit it, though it was wrecked. (the van shoved down the line, freight passing)",
    node: (n) => <Cam src={M} from={51.8} keys={K(n, [1.12, 0.35, 0.45], [1.2, 0.3, 0.45])} /> },
  { a: 66.80 + OB, b: 72.87 + OB, vo: "Boga, the man Duncan had just walked off the tracks, got a ticket for failing to heed the crossing lights. (the two men at the roadside, 0.66x)",
    node: (n) => <Cam src={M} from={36.6} rate={0.66} keys={K(n, [1.5, 0.78, 0.55], [1.6, 0.8, 0.55])} /> },
  { a: 72.87 + OB, b: 105.7, vo: "Thirteen seconds is nothing. You'd barely get your seatbelt off in that time. (freight cars passing the crossing, 0.59x)",
    node: (n) => <Cam src={M} from={58.0} rate={0.59} keys={K(n, [1.1, 0.5, 0.45], [1.22, 0.5, 0.4])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.0), kind: "blurDip", len: 10 },
  { at: F(20.71), kind: "blurDip", len: 10 },
  { at: F(25.42), kind: "blurDip", len: 12 },  // time jump back
  { at: F(30.62), kind: "blurDip", len: 10 },
  { at: F(34.19), kind: "blurDip", len: 10 },
  { at: F(38.95), kind: "blurDip", len: 10 },
  { at: F(70.47), kind: "blurDip", len: 14 },  // raw -> the split
  { at: F(51.49 + OB), kind: "glitch", len: 10 }, // the page
  { at: F(57.14 + OB), kind: "glitch", len: 10 },
  { at: F(62.21 + OB), kind: "blurDip", len: 10 },
  { at: F(66.80 + OB), kind: "blurDip", len: 12 },
  { at: F(72.87 + OB), kind: "blurDip", len: 12 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 43.07], [70.47, 43.07, null]];
const RAWS: [number, number][] = [[47.07, 70.47]];
// raw picture time -> timeline: T = src + 27.47
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [43.07 + OB + 0.05, "sfx_n2/real/camera_shutter_2.wav", -30], [43.07 + OB + 1.45, "sfx_n2/real/camera_shutter_2.wav", -30],
  [51.49 + OB - 0.05, "sfx_n2/glitch_01.wav", -28], [57.14 + OB - 0.05, "sfx_n2/glitch_03.wav", -28], [51.6 + OB, "sfx_n2/real/paper_2.wav", -26],
  // the raw: door, footsteps on the wet road, the impact (35.6), the van shoved along, the cars
  [47.6, "sfx_n2/real/flashlight_click_2.wav", -26], [47.9, "sfx_n2/real/footsteps_gravel_2.wav", -24], [53.4, "sfx_n2/real/footsteps_gravel_2.wav", -28],
  [63.05, "sfx_n2/real/impact_4.wav", -12], [63.1, "sfx_n2/real/metal_clank_1.wav", -14], [63.3, "sfx_n2/real/boom_2.wav", -18], [64.0, "sfx_n2/real/metal_clank_3.wav", -20],
  [58.6, "case/media/horn.wav", -14],                     // the locomotive's horn as it comes into the crossing (CC BY 4.0)
  [84.54 + 4.0, "sfx_n2/real/metal_clank_1.wav", -26],
];
const BED: [number, number, string, number][] = [
  [4.0, 47.07, "sfx_n2/real/rain_5.wav", -30], [47.07, 70.47, "sfx_n2/real/rain_5.wav", -22],
  [61.2, 70.47, "sfx_n2/real/car_engine_2.wav", -16],   // the locomotive and the freight cars rolling through
  [84.54, 105.7, "sfx_n2/real/rain_5.wav", -32],
  // the crossing bell (Wikimedia Commons, CC BY-SA 4.0): faint under "the bells were ringing", louder in the raw, gone after it
  [17.6, 47.07, "case/media/bell.wav", -34], [47.07, 70.47, "case/media/bell.wav", -24],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title={"THIRTEEN\u00A0SECONDS AT\u00A0THE\u00A0CROSSING"} bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE16.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} loop volume={(f) => dB(g) * interpolate(f, [0, 12, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 (~-22 dB), ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={DUR - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20)} loop volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? 0.2 + 0.8 * (ra - t) / 0.8 : t > rb ? 0.2 + 0.8 * (t - rb) / 0.6 : 0.2), 1);
          return dB(-22) * interpolate(t, [4.0, 5.0, 104.2, 105.7], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
