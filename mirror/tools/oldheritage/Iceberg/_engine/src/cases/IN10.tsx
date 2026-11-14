// Incidents #10 — Mather Point, Grand Canyon South Rim, 3 Jun 2017 ~3 PM: a barefoot man past the guard rail, filmed by a visitor (Cyndi,
// her own upload 5nF9Mp27ABA, 1920x1080 30 fps, 2:10; source cuts 28.27, 87.3, 109.7). Second angle (other visitor, linked in her
// description): "Escape Mode" (161 subs) 6h8QR8K2NSo, letterboxed 2.39:1, cropped to 16:9 (media/a2.mp4, src 0-140; its "One slip and down
// he fell..." card at ~50 s is never used). Handle with care: CUT before he slips (raw ends src 49.8; he leaves frame ~50.5); the drop
// shots (52-110) are never shown; his face is blurred (shots/blur10.py, hand-tracked 27-51); his name is never used; profanity
// "fucking beautiful" muted in the raw (src 46.5-47.45). rawclean.py: no music in her clip.
// VO = one take (CASE10.mp3), split only at the two raws (sentence ends, in the pauses):
//   A 0-38.05 @4.0 | R1 42.05-53.35 (main: src 38.5-49.8, over the fence: "He's coming back", "I'm coming back...", "It is, but...") |
//   B 38.05-52.6 @53.35 | R2 67.9-80.4 (src 112.45-124.95, the rescue helicopter over the rim, vertical clip) | C 52.6-end @80.4,
//   VO ends 101.84, hold to 103.0.
// Devices: RailLine (freeze, the rail itself drawn as the boundary, beyond it cools), DescStrips (her real YouTube page: update + park
// statement as paper strips).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { TitleStrike, Tall } from "../dev/IN16_kit";
import { RailLine } from "../dev/IN10_RailLine";
import { DescStrips } from "../dev/IN10_DescStrips";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4", A2 = GR + "a2.mp4", HE = GR + "heli.mp4";   // heli src offset 109.8
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(103.0);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];
const HAR = 1084 / 1080;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 9.30, vo: "On June 3, 2017, at around three in the afternoon, Mather Point was packed. (second angle: the crowded overlook)",
    node: (n) => <Cam src={A2} from={8.0} keys={K(n, [1.05, 0.4, 0.45], [1.14, 0.35, 0.42])} />, over: <RedLabel text="MATHER POINT · JUNE 3, 2017" at={F(0.6)} hold={F(3.8)} size={42} /> },
  { a: 9.30, b: 16.96, vo: "It's the busiest viewpoint on the Grand Canyon's South Rim, and a visitor named Cyndi was there for her birthday weekend, filming over the railing.",
    node: (n) => <Cam src={M} from={0.5} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.55, 0.45])} />, over: <RedLabel text="FILMED BY CYNDI" at={F(2.4)} hold={F(3.6)} size={40} /> },
  { a: 16.96, b: 18.75, vo: "Then the crowd started calling out. (the crowd at the overlook)", node: (n) => <Cam src={A2} from={20.0} keys={K(n, [1.12, 0.38, 0.45], [1.2, 0.36, 0.45])} /> },
  { a: 18.75, b: 20.7, vo: "A barefoot man in his twenties had climbed over the guard rail (him beyond the chain-link, face blurred)",
    node: (n) => <Cam src={M} from={28.97} keys={K(n, [1.05, 0.45, 0.55], [1.12, 0.45, 0.55])} /> },
  { a: 20.7, b: 27.04, vo: "and sat down on a rock ledge a few feet below it, with the canyon dropping away behind him. By Cyndi's account, (second angle, the overlook and the rock below it)",
    node: (n) => <Cam src={A2} from={34.0} keys={K(n, [1.1, 0.3, 0.55], [1.3, 0.3, 0.6])} /> },
  { a: 27.04, b: 29.38, vo: "he'd been drinking. (the crowd leaning on the rail)", node: (n) => <Cam src={A2} from={44.0} keys={K(n, [1.2, 0.3, 0.45], [1.28, 0.3, 0.45])} /> },
  { a: 29.38, b: 32.12, vo: "I keep coming back to how Cyndi put it afterward. (her view over the railing)", node: (n) => <Cam src={M} from={9.0} keys={K(n, [1.08, 0.5, 0.5], [1.15, 0.5, 0.55])} /> },
  { a: 32.12, b: 35.71, vo: "Past that rail, she said, you're on your own responsibility. (RailLine on src 31.5)",
    node: (n) => <RailLine src={M} t={31.5} at={8} len={40} rail={[[0, 878], [300, 884], [600, 893], [1010, 903], [1920, 905]]} keys={K(n, [1.0, 0.5, 0.5], [1.18, 0.42, 0.52])} /> },
  // "Everyone keeps telling him ... They ask him one more time." runs on into RAW 1 (src 32.16 -> 49.8)
  { a: 35.71, b: 53.35, vo: "Everyone keeps telling him to come back up ... They ask him one more time. + RAW 1 (src 38.5-49.8)",
    node: (n) => <Cam src={M} from={32.16} keys={[{ f: 0, s: 1.1, x: 0.45, y: 0.55 }, { f: F(6.3), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.05, x: 0.52, y: 0.6 }]} /> },
  { a: 53.35, b: 57.17, vo: "He didn't come back up. Seconds later he lost his grip and went over. (second angle: the canyon wall, no people)",
    node: (n) => <Cam src={A2} from={61.0} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.5, 0.58])} /> },
  { a: 57.17, b: 60.76, vo: "Somebody shouted not to look, and someone called 911. (the rim and the drop from her side, no people)",
    node: (n) => <Cam src={M} from={12.0} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.5, 0.55])} /> },
  { a: 60.76, b: 65.85, vo: "A helicopter was over the rim in about five minutes, Cyndi wrote, but reaching him took hours. (second angle: the helicopter over the canyon)",
    node: (n) => <Cam src={A2} from={100.0} keys={K(n, [1.1, 0.5, 0.45], [1.25, 0.5, 0.4])} /> },
  // "This is the helicopter that came for him." runs on into RAW 2 (her vertical clip, src 110.4 -> 124.95)
  { a: 65.85, b: 80.4, vo: "This is the helicopter that came for him. + RAW 2 (src 112.45-124.95)",
    node: (n) => <Tall src={HE} from={0.6} ar={HAR} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.45])} /> },
  { a: 80.4, b: 83.67, vo: "Three responders were lowered down the cliff to stabilize him. (second angle: the helicopter at the cliff)",
    node: (n) => <Cam src={A2} from={112.0} keys={K(n, [1.15, 0.5, 0.45], [1.3, 0.5, 0.42])} /> },
  { a: 83.67, b: 89.5, vo: "Then he was short-hauled out, hanging on a rope under the helicopter, and taken to Flagstaff Medical Center. (the helicopter leaving over the canyon)",
    node: (n) => <Cam src={A2} from={118.0} keys={K(n, [1.1, 0.5, 0.45], [1.22, 0.55, 0.4])} /> },
  { a: 89.5, b: 93.16, vo: "So did he make it? For weeks, Cyndi had no idea. (her canyon view)", node: (n) => <Cam src={M} from={16.0} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.45, 0.48])} /> },
  { a: 93.16, b: 103.0, vo: "Then word reached her through his family that he was alive, with some brain injury. The park put his total fall at about 100 feet, and he survived it. (DescStrips)",
    node: (n) => <DescStrips bg={A2} bgFrom={86.0} n={n} head={{ src: GR + "yt_head.png", w: 560, h: 160 }} a={{ src: GR + "yt_update.png", w: 1060, h: 66 }}
      b={{ src: GR + "yt_nps.png", w: 1740, h: 122 }} swapAt={F(4.33)} rule={[718, 1068, 112]} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.30), kind: "blurDip", len: 10 },
  { at: F(16.96), kind: "blurDip", len: 10 },
  { at: F(18.75), kind: "blurDip", len: 10 },
  { at: F(20.7), kind: "blurDip", len: 10 },
  { at: F(27.04), kind: "blurDip", len: 10 },
  { at: F(29.38), kind: "blurDip", len: 10 },
  { at: F(32.12), kind: "blurDip", len: 10 },
  { at: F(35.71), kind: "blurDip", len: 10 },
  { at: F(53.35), kind: "blurDip", len: 14 },  // out of the raw, before the slip
  { at: F(57.17), kind: "blurDip", len: 10 },
  { at: F(60.76), kind: "blurDip", len: 10 },
  { at: F(65.85), kind: "blurDip", len: 10 },
  { at: F(80.4), kind: "blurDip", len: 10 },
  { at: F(83.67), kind: "blurDip", len: 10 },
  { at: F(89.5), kind: "blurDip", len: 10 },
  { at: F(93.16), kind: "blurDip", len: 12 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 38.05], [53.35, 38.05, 52.6], [80.4, 52.6, null]];
// raws: [timeline a, b, src s, gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [[42.05, 53.35, 38.5, 2, 0.12], [67.9, 80.4, 112.45, 0, 0.15]];
const MUTE: [number, number] = [46.5, 47.45];   // profanity inside RAW 1 (src seconds)
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24], [93.2, "sfx_n2/real/paper_2.wav", -28], [97.5, "sfx_n2/real/paper_3.wav", -30]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleStrike dur={F(4.0)} title="PAST THE RAIL" place="MATHER POINT, GRAND CANYON · 2017" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE10.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => {
            const s = src + f / 30;
            const mute = i === 0 ? interpolate(s, [MUTE[0] - 0.04, MUTE[0], MUTE[1], MUTE[1] + 0.04], [1, 0, 0, 1], cl) : 1;
            return dB(g) * mute * interpolate(f, [0, 6, F(b - a) - 10, F(b - a)], [0, 1, 1, 0], cl);
          }} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3, ~-19 dB, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(103.0 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(95)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-19) * interpolate(t, [4.0, 5.0, 101.6, 103.0], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
