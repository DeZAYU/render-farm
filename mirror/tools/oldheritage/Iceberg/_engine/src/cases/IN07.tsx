// Incidents #07 — Broken Bow Lake, Oklahoma, fall 2023 (uploaded 10 Nov 2023): FishWithDaddy's kayak camera (bow-mounted, facing him)
// as the green kayak beside him flips in the whitecaps; he stays with the swimmer. One source: his own upload 7LfAYVzCWcY (1920x1080 24 fps,
// 11:01), trimmed into windows wa 46-80, wb 105-119, wc 211-412, wd 524-570, we 589-606 (source cuts checked with srccuts.py).
// Music (Epidemic) stripped by rawclean.py; raws use media/main_clean.wav (src 200-660, offset 200).
// Face check (Apple Vision, 2-4 fps over every used window): the only face found is the filmer's own (uploader, fine); the capsized angler
// is never detected close in the used windows, the bank shots (10:05-10:35, where his face is close) are not used.
// VO = one take (CASE07.mp3), split only at the two raws (sentence ends); the VO's own quote "Well, I gotta go with you." (take 40.85-42.40)
// is left out because RAW 2 plays the real line:
//   A 0-28.5 @4.0 | R1 32.5-47.5 (src 330.0-345.0: the crossing side-on, "Oh my God", "You okay? You okay?"; ends before the uploader's cut at 345.3) | B 28.5-40.85 @47.5 |
//   R2 59.85-82.45 (main: src 388.0-410.6, "I don't know how to help you ... I'm just gonna head to that island ... Well, I gotta go with you.
//   I'm gonna call the marina") | C 42.40-end @82.45, VO ends 92.24, hold to 93.4.
// Device: OpenWater (NAIP aerial, water sunk dark, the marina boxed, the crossing dashed to the big island north of the dam).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { TitleStrike } from "../dev/IN16_kit";
import { OpenWater } from "../dev/IN07_OpenWater";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const WA = GR + "wa.mp4", WB = GR + "wb.mp4", WC = GR + "wc.mp4", WD = GR + "wd.mp4", WE = GR + "we.mp4";   // src offsets 46, 105, 211, 524, 589
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(93.4);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 13.62, vo: "Before sunrise one fall morning in 2023, an angler who posts as FishWithDaddy launched his yellow kayak on Broken Bow Lake in southeastern Oklahoma. (OpenWater)",
    node: (n) => <OpenWater src={GR + "naip.jpg"} mask={GR + "water_mask.png"} iw={2400} ih={1350} n={n} focus0={[1200, 675]} focus1={[1330, 560]} z0={1.0} z1={1.3}
      box={[765, 292, 835, 402]} boxAt={40} path={[[805, 405], [880, 435], [1000, 444], [1100, 422], [1300, 377], [1600, 332], [1985, 302]]} lineAt={110} lineLen={120} sinkAt={12} />,
    over: <RedLabel text="BROKEN BOW LAKE, OKLAHOMA" at={F(0.8)} hold={F(4.2)} size={42} /> },
  { a: 13.62, b: 16.87, vo: "The wind was up, and he called the dark crossing pretty sketchy. (dark, windy, him on the kayak saying it)",
    node: (n) => <Cam src={WA} from={22.0} keys={K(n, [1.1, 0.5, 0.5], [1.18, 0.55, 0.5])} />, over: <RedLabel text="FILMED BY FISHWITHDADDY" at={F(0.4)} hold={F(2.5)} size={38} /> },
  { a: 16.87, b: 19.04, vo: "By late morning he hadn't caught a thing. (fishing)", node: (n) => <Cam src={WB} from={0.5} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.5])} /> },
  { a: 19.04, b: 21.77, vo: "The open water back to the marina was whitecapping. (the lake behind him, choppy)", node: (n) => <Cam src={WC} from={1.3} keys={K(n, [1.1, 0.3, 0.4], [1.2, 0.25, 0.38])} /> },
  { a: 21.77, b: 25.89, vo: "Another angler on a green kayak pulled up, and they agreed to cross together. (the green kayak arrives)", node: (n) => <Cam src={WC} from={6.3} keys={K(n, [1.05, 0.5, 0.5], [1.1, 0.45, 0.5])} /> },
  { a: 25.89, b: 28.56, vo: "At least the water's about seventy degrees, they joked. (the 'seventy degrees' moment)", node: (n) => <Cam src={WC} from={69.5} keys={K(n, [1.1, 0.5, 0.5], [1.16, 0.5, 0.48])} /> },
  // "Out in the open water ... Then he looks across." runs on into RAW 1 (src 326.06 -> 355.0)
  { a: 28.56, b: 47.5, vo: "Out in the open water, the wind's hitting them side on. Then he looks across. + RAW 1 (src 330.0-345.0)",
    node: (n) => <Cam src={WC} from={115.06} keys={[{ f: 0, s: 1.12, x: 0.5, y: 0.5 }, { f: F(3.9), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.04, x: 0.48, y: 0.5 }]} /> },
  { a: 47.5, b: 51.41, vo: "The green kayak was upside down, its owner in the water beside it.", node: (n) => <Cam src={WC} from={145.2} keys={K(n, [1.12, 0.4, 0.5], [1.2, 0.38, 0.5])} /> },
  { a: 51.41, b: 55.69, vo: "He couldn't pull a grown man onto a loaded kayak in that chop, so what could he do?", node: (n) => <Cam src={WC} from={155.0} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.52, 0.48])} /> },
  // "He stayed, and there's the line I like most, because nothing made him say it." runs on into RAW 2, where he says it
  { a: 55.69, b: 82.45, vo: "He stayed, and there's the line I like most, because nothing made him say it. + RAW 2 (src 388.0-410.6)",
    node: (n) => <Cam src={WC} from={172.84} keys={[{ f: 0, s: 1.1, x: 0.5, y: 0.5 }, { f: F(4.16), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.05, x: 0.5, y: 0.48 }]} /> },
  { a: 82.45, b: 87.5, vo: "He called the marina and was told to call 911, and he kept checking the man wasn't cold. (on the phone, the swimmer beside)", node: (n) => <Cam src={WD} from={2.0} keys={K(n, [1.08, 0.5, 0.5], [1.15, 0.5, 0.48])} /> },
  { a: 87.5, b: 93.4, vo: "He paddled beside him all the way to the island, and they flipped the green kayak back over. (drifting toward the island)", node: (n) => <Cam src={WE} from={1.0} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.52, 0.46])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(13.62), kind: "glitch", len: 10 },
  { at: F(16.87), kind: "blurDip", len: 10 },
  { at: F(19.04), kind: "blurDip", len: 10 },
  { at: F(21.77), kind: "blurDip", len: 10 },
  { at: F(25.89), kind: "blurDip", len: 10 },
  { at: F(28.56), kind: "blurDip", len: 10 },
  { at: F(47.5), kind: "blurDip", len: 10 },
  { at: F(51.41), kind: "blurDip", len: 10 },
  { at: F(55.69), kind: "blurDip", len: 10 },
  { at: F(82.45), kind: "blurDip", len: 12 },
  { at: F(87.5), kind: "blurDip", len: 12 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 28.5], [47.5, 28.5, 40.85], [82.45, 42.40, null]];
// raws: [timeline a, b, clean-wav s (src - 200), gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [[32.5, 47.5, 130.0, 2, 0.15], [59.85, 82.45, 188.0, 2, 0.1]];
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24], [13.57, "sfx_n2/glitch_01.wav", -28]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleStrike dur={F(4.0)} title="THE GREEN KAYAK" place="BROKEN BOW LAKE, OKLAHOMA · 2023" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE07.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1, ~-15 dB, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(93.4 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-15) * interpolate(t, [4.0, 5.0, 92.0, 93.4], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
