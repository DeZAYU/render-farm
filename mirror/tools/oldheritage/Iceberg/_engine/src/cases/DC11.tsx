// Dashcam #11: The Bentley and the Bat. A UK country lane, summer evening (date unconfirmed, earliest copy 20 Mar 2022). A green Bentley
// overtakes a van, brake-checks it, is overtaken, swings back in front and stops; the driver goes to his boot, shouts at the van window,
// takes out a baseball bat, puts it back, then photographs the van driver. Nobody hurt, no contact; never identified, no police record.
// One source: Protelo repost of the filmer's Reddit clip (xcErKyvHhMg, 1920x1080 25 fps), used 0:00-1:27 only (1:28+ appended still
// skipped). Blur pass (shots in media/, script _tools-free: build/CASE11/shots/blur11.py): the filmer's handle top-left (whole clip),
// the plate (every frame it shows), the driver's face (Apple Vision detections, interpolated). The repost has music over the whole
// track: raw audio = Demucs vocals stem only (media/main_safe.wav), every swear muted (whisper-checked), + a low engine bed (real SFX).
// VO = one take (CASE11.mp3, no count word), split only at the two raws, both at sentence ends:
//   A take 0-26.25 @4.00 | R1 30.25-66.42 (src 22.23-47.0 then 49.6-61.0: swings in, stops, gets out, the van driver's taunts, boot,
//   the window close-up, the bat) | B take 26.25-49.28 @66.42 | R2 89.45-99.15 (src 76.3-86.0: phone out, photographs the van driver)
//   | C take 49.28-end @99.15, VO ends ~101.8, hold to 103.2.
// Devices: GlassVeil (fog spreads over the window from the unnamed man), PhotoTurn (his phone photo becomes a print).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { GlassVeil } from "../dev/DC11_GlassVeil";
import { PhotoTurn } from "../dev/DC11_PhotoTurn";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(103.2);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.27, vo: "A van is rolling down a wet country lane somewhere in Britain on a summer evening (0.5x, the empty lane)",
    node: (n) => <Cam src={M} from={0.0} rate={0.5} keys={K(n, [1.12, 0.5, 0.55], [1.05, 0.5, 0.52])} />, over: <RedLabel text="UNITED KINGDOM" at={F(1.3)} hold={F(2.4)} /> },
  { a: 8.27, b: 12.04, vo: "when a bright green Bentley comes up fast behind it and overtakes.", node: (n) => <Cam src={M} from={2.1} keys={K(n, [1.05, 0.52, 0.52], [1.12, 0.53, 0.45])} /> },
  { a: 12.04, b: 15.71, vo: "Then the Bentley brakes hard, for no reason anyone could see. (brake lights come on)", node: (n) => <Cam src={M} from={7.2} keys={K(n, [1.2, 0.53, 0.42], [1.5, 0.53, 0.38])} /> },
  { a: 15.71, b: 19.96, vo: "That's a brake check, slamming on in front of someone to make them brake or hit you. (0.5x replay into the brake lights)",
    node: (n) => <Cam src={M} from={8.8} rate={0.5} keys={K(n, [1.7, 0.53, 0.38], [2.1, 0.53, 0.37])} /> },
  { a: 19.96, b: 24.04, vo: "It's crawling along so slowly that the van finally overtakes it.", node: (n) => <Cam src={M} from={10.9} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  { a: 24.04, b: 30.25, vo: "That seems to be what sets the Bentley driver off. See where the green car stops when it swings back around in front. (empty lane, the Bentley comes back past; runs into RAW 1)",
    node: (n) => <Cam src={M} from={16.02} keys={[{ f: 0, s: 1.1, x: 0.5, y: 0.5 }, { f: n - 40, s: 1.02, x: 0.5, y: 0.5 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  // RAW 1 (main): swings in and stops across the lane, gets out, walks back, the van driver taunts him, the boot
  { a: 30.25, b: 55.02, vo: "RAW 1a (src 22.23-47.0)", node: (n) => <Cam src={M} from={22.23} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.55, 0.55])} /> },
  // RAW 1 cont.: the side camera, at the window shouting, back to the boot with the bat
  { a: 55.02, b: 66.42, vo: "RAW 1b (src 49.6-61.0)", node: (n) => <Cam src={M} from={49.6} keys={K(n, [1.0, 0.5, 0.5], [1.04, 0.45, 0.5])} /> },
  { a: 66.42, b: 69.01, vo: "The clip went up on Reddit and spread from there. (0.45x motion-interpolated replay of src 59.15-60.4: the bat; graded/batslow.mp4)", node: (n) => <Cam src={GR + "batslow.mp4"} from={0} keys={K(n, [1.25, 0.32, 0.5], [1.5, 0.3, 0.48])} /> },
  { a: 69.01, b: 75.97, vo: "The earliest copy dates from March 2022, and the full summer leaves suggest it was filmed a year or more before that. (held frame, tilt up into the tree)",
    node: (n) => <Cam src={M} t={7.4} keys={[{ f: 0, s: 1.15, x: 0.5, y: 0.6 }, { f: F(2.6), s: 1.2, x: 0.5, y: 0.55 }, { f: n, s: 1.75, x: 0.56, y: 0.2 }]} />,
    over: <RedLabel text="EARLIEST COPY · MARCH 20, 2022" at={F(0.9)} hold={F(2.6)} size={42} /> },
  { a: 75.97, b: 80.89, vo: "No arrest or charge was ever reported, and the man's never been publicly identified. (GlassVeil)",
    node: (n) => <GlassVeil src={M} t={53.0} from={[0.5, 0.33]} at={F(0.6)} len={F(3.6)} keys={K(n, [1.05, 0.5, 0.45], [1.18, 0.5, 0.38])} /> },
  { a: 80.89, b: 85.38, vo: "He put that bat back in the trunk as calmly as if he'd only gone to fetch an umbrella,", node: (n) => <Cam src={M} from={61.25} keys={K(n, [1.25, 0.36, 0.62], [1.35, 0.36, 0.6])} /> },
  { a: 85.38, b: 89.45, vo: "then took a photo of the van driver, like he was the one collecting evidence.", node: (n) => <Cam src={M} from={71.45} keys={K(n, [1.15, 0.45, 0.55], [1.22, 0.45, 0.52])} /> },
  // RAW 2: back at the window, phone out, photographing the van driver
  { a: 89.45, b: 99.15, vo: "RAW 2 (src 76.3-86.0)", node: (n) => <Cam src={M} from={76.3} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.45, 0.48])} /> },
  { a: 99.15, b: 103.2, vo: "I'd love to know who he planned to show it to. (PhotoTurn)", node: (n) => <PhotoTurn src={M} t={85.5} snapAt={8} dur={n} focus={[0.45, 0.45]} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(12.04), kind: "blurDip", len: 10 },
  { at: F(15.71), kind: "blurDip", len: 10 },
  { at: F(19.96), kind: "blurDip", len: 10 },
  { at: F(24.04), kind: "blurDip", len: 10 },
  { at: F(66.42), kind: "blurDip", len: 14 },  // raw -> slow replay
  { at: F(69.01), kind: "blurDip", len: 12 },
  { at: F(75.97), kind: "glitch", len: 10 },
  { at: F(80.89), kind: "blurDip", len: 12 },
  { at: F(85.38), kind: "blurDip", len: 10 },
  { at: F(89.45), kind: "blurDip", len: 10 },
  { at: F(99.15), kind: "blurDip", len: 12 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 26.25], [66.42, 26.25, 49.28], [99.15, 49.28, null]];
// raws: [timeline a, b, src s, gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [[30.25, 55.02, 22.23, 3, 0.15], [55.02, 66.42, 49.6, 3, 0.15], [89.45, 99.15, 76.3, 3, 0.2]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [75.92, "sfx_n2/glitch_01.wav", -28], [99.15 + 8 / 30, "sfx_n2/real/camera_shutter_2.wav", -16],
];
// the van's engine idling under the raws (the repost's own track carries music, so only the voices are kept from it)
const BED: [number, number, string, number][] = [[30.25, 66.42, "sfx_n2/real/car_engine_2.wav", -30], [89.45, 99.15, "sfx_n2/real/car_engine_2.wav", -30],
  // extra idle where the swears are muted (window close-up) and under the quiet photo raw (added to the master by post-mix 14 Nov)
  [57.6, 66.2, "sfx_n2/real/car_engine_2.wav", -21], [89.6, 99.0, "sfx_n2/real/car_engine_2.wav", -21]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE BENTLEY AND THE BAT" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE11.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_safe.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 12, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} loop volume={(f) => dB(g) * interpolate(f, [0, 12, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 (~10 LU under the VO, matched to Music 5 at -13), ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(99.2)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(3)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-22) * interpolate(t, [4.0, 5.0, 101.7, 103.2], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
