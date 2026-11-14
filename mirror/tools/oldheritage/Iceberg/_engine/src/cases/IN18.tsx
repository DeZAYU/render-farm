// Incidents #18 — Bering Sea, ~35 km off Cape Navarin, 26 May 2012: the freezer trawler Kapitan Bolsunovsky (ice class withdrawn) is holed
// by ice pressure on her port side, floods, lists and sinks ~45 minutes later; all 91 crew taken aboard the company's Dersu Uzala.
// Source: crew phone/camera clips "from a sailor's personal archive" (Оксана Осинина, ce-AviEAAFw, 1920x1080, 14:07), the upload has a
// music bed (rawclean.py strips it from the raws). Windows used are cut into media/seg.mp4 (segs.txt: src a-b -> seg offset), mapped by
// sg(src). Avoided: uploader's red arrows (~1:12-1:23, ~4:10), close crew faces (5:15-9:20, no close crew faces used),
// the subscribe button (~13:18-13:28). VO = one take (CASE18.mp3), split only at the raws (sentence ends):
//   A 0-38.70 @4.00 | R1 43.10-55.10 (src 21-33: the lifeboat alongside the listing hull, "Нет.") | B 38.70-56.06 @55.50 (the clip runs
//   on from src 652 at 69.28 into R2) | R2a 73.26-85.26 (src 655.98-667.98: the hull on its side, the bow rising) + blur-dip time jump +
//   R2b 85.26-99.26 (src 742-756: the bow upright, sliding under) | C 56.06-end @99.66, VO ends 134.72, hold to 135.5.
// Devices: brand Aerial on NASA MODIS Aqua true colour of 26 May 2012 (the day; GIBS, public domain) with the ice off Cape Navarin;
// HullTilt (frozen frame, true vertical vs the mast). Crew not named; the captain not named.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { Credit } from "../dev/IN16_kit";
import { HullTilt } from "../dev/IN18_HullTilt";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "seg.mp4";
const SEGS: [number, number][] = [[20, 34], [104, 116], [148, 170], [182, 192], [228, 252], [286, 296], [324, 332], [538, 564], [598, 636], [650, 669], [740, 758], [764, 798]];
const sg = (src: number) => { let off = 0; for (const [a, b] of SEGS) { if (src >= a && src <= b) return off + src - a; off += b - a; } throw new Error("src not in segs: " + src); };
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(135.5);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 11.2, vo: "The Kapitan Bolsunovsky was a Russian freezer trawler, a factory ship that freezes its catch on board, (the trawler, crew on deck)",
    node: (n) => <Cam src={M} from={sg(106)} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.5, 0.45])} />, over: <><RedLabel text="KAPITAN BOLSUNOVSKY" at={F(0.4)} hold={F(3.6)} /><Credit text="FOOTAGE: A SAILOR’S ARCHIVE VIA OKSANA OSININA" at={F(4.0)} hold={F(3.0)} /></> },
  { a: 11.2, b: 17.25, vo: "and in May 2012 she'd been fishing the Bering Sea off Cape Navarin with 91 men aboard, in water packed with broken ice. (MODIS, 26 May 2012)",
    node: () => <Aerial src={GR + "navarin.jpg"} iw={2400} ih={1350} spot={[1760, 580, 2160, 840]} z0={1.0} z1={1.3} label="CAPE NAVARIN" boxAt={40} labelAt={50} /> },
  { a: 17.25, b: 19.02, vo: "She wasn't cleared to be there. (the trawler among the floes)", node: (n) => <Cam src={M} from={sg(150)} keys={K(n, [1.1, 0.5, 0.5], [1.16, 0.5, 0.5])} /> },
  { a: 19.02, b: 23.6, vo: "Ships that work in ice carry an ice class, a rating that says the hull's been strengthened for it,", node: (n) => <Cam src={M} from={sg(160.5)} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.55, 0.55])} /> },
  { a: 23.6, b: 27.43, vo: "and at her last inspection the Bolsunovsky lost hers.", node: (n) => <Cam src={M} from={sg(154)} keys={K(n, [1.12, 0.5, 0.5], [1.04, 0.5, 0.5])} /> },
  { a: 27.43, b: 31.09, vo: "Her captain knew it, and he didn't stop fishing in heavy ice.", node: (n) => <Cam src={M} from={sg(230)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.45])} /> },
  { a: 31.09, b: 33.97, vo: "On the morning of May 26, the ice won.", node: (n) => <Cam src={M} from={sg(293.05)} keys={K(n, [1.1, 0.5, 0.5], [1.18, 0.45, 0.5])} />, over: <RedLabel text="MAY 26, 2012" at={F(0.4)} hold={F(2.2)} /> },
  { a: 33.97, b: 42.7, vo: "Floes grinding against the hull split the welded seams ... and the crew pulled on survival suits while a few of them kept filming. (crew in suits on the leaning deck)",
    node: (n) => <Cam src={M} from={sg(183)} keys={K(n, [1.05, 0.5, 0.5], [1.18, 0.45, 0.55])} /> },
  { a: 42.7, b: 55.5, vo: "RAW 1 (src 21-33)", node: (n) => <Cam src={M} from={sg(20.6)} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.45, 0.5])} /> },
  { a: 55.5, b: 61.45, vo: "Seawater poured into the holds, and when a watertight door between them gave way, she started to lean. (HullTilt, src 240)",
    node: (n) => <HullTilt src={M} t={sg(240)} at={F(4.2)} foot={[0.3125, 0.611]} top={[0.236, 0.204]} keys={K(n, [1.0, 0.5, 0.5], [1.12, 0.38, 0.45])} /> },
  { a: 61.45, b: 69.28, vo: "The thing I notice most is how calm the sea looks. It's flat and white with ice, and a ship this size is rolling over in the middle of it.",
    node: (n) => <Cam src={M} from={sg(612)} keys={K(n, [1.12, 0.5, 0.55], [1.0, 0.5, 0.5])} /> },
  // runs on into RAW 2a (src = timeline + 582.72)
  { a: 69.28, b: 85.26, vo: "She went down about 45 minutes after the ice broke through. | RAW 2a", node: (n) => <Cam src={M} from={sg(652)} keys={K(n, [1.05, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
  { a: 85.26, b: 99.66, vo: "RAW 2b (src 742-756)", node: (n) => <Cam src={M} from={sg(742)} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.55])} /> },
  { a: 99.66, b: 102.0, vo: "Every one of the 91 men survived. (rafts on the empty water)", node: (n) => <Cam src={M} from={sg(766)} keys={K(n, [1.1, 0.5, 0.5], [1.18, 0.5, 0.5])} /> },
  { a: 102.0, b: 107.93, vo: "A trawler from the same company, the Dersu Uzala, wasn't far away, and it took them all aboard. (the rescue ship's side, the ladder)",
    node: (n) => <Cam src={M} from={sg(327.5)} rate={0.75} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.4])} />, over: <RedLabel text="DERSU UZALA" at={F(2.1)} hold={F(2.8)} /> },
  { a: 107.93, b: 110.7, vo: "So what happened to the man who'd taken her into the ice? (the hull on its side, from the rescue ship)", node: (n) => <Cam src={M} from={sg(608.2)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.5])} /> },
  { a: 110.7, b: 117.83, vo: "The captain pleaded guilty, and in November 2012 a Russian court convicted him of breaking maritime safety rules.",
    node: (n) => <Cam src={M} from={sg(286)} rate={0.98} keys={K(n, [1.12, 0.5, 0.5], [1.02, 0.5, 0.5])} />, over: <RedLabel text="NOVEMBER 2012" at={F(1.9)} hold={F(3.0)} /> },
  { a: 117.83, b: 126.89, vo: "The owner's losses ran past 166 million rubles, and his fine was 140,000, roughly 4,500 dollars. (the hull on its side, going)",
    node: (n) => <Cam src={M} from={sg(625.5)} keys={K(n, [1.0, 0.5, 0.5], [1.15, 0.5, 0.55])} /> },
  { a: 126.89, b: 130.35, vo: "That's not even a tenth of one percent of what the owner lost.", node: (n) => <Cam src={M} from={sg(770)} keys={K(n, [1.1, 0.5, 0.5], [1.18, 0.5, 0.55])} /> },
  { a: 130.35, b: 135.5, vo: "The Bolsunovsky's still down there, about 660 feet deep. (empty water, rafts, the rescue ship far off)", node: (n) => <Cam src={M} from={sg(778)} keys={K(n, [1.15, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 }, { at: F(11.2), kind: "glitch", len: 10 }, { at: F(17.25), kind: "glitch", len: 10 },
  ...[19.02, 23.6, 27.43, 31.09, 33.97, 61.45, 69.28, 102.0, 107.93, 110.7, 117.83, 126.89, 130.35].map((s) => ({ at: F(s), kind: "blurDip" as const, len: 10 })),
  { at: F(42.7), kind: "blurDip", len: 12 }, { at: F(55.5), kind: "blurDip", len: 14 }, { at: F(85.26), kind: "blurDip", len: 16 }, { at: F(99.66), kind: "blurDip", len: 14 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 38.7], [55.5, 38.7, 56.06], [99.66, 56.06, null]];
// raws: [timeline a, b, seg-audio s, gain dB, music duck]
const RAWS: [number, number, number, number, number][] = [[43.1, 55.1, sg(21), 2, 0.12], [73.26, 85.26, sg(655.98), 0, 0.12], [85.26, 99.26, sg(742), 0, 0.12]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE TRAWLER IN THE ICE" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/seg_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(b - a) - 10, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3 (~-19 dB, ~10 LU under the VO), ducked under the raws */}
      <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(70)} volume={(f) => {
        const t = f / 30;
        const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
        return dB(-19) * interpolate(t, [3.6, 5.0, 133.8, 135.5], [0, 1, 1, 0], cl) * duck;
      }} />
      <Sequence from={F(3.95)} layout="none"><Audio src={staticFile("sfx_n2/glitch_02.wav")} volume={dB(-26)} /></Sequence>
      <Sequence from={F(11.15)} layout="none"><Audio src={staticFile("sfx_n2/glitch_01.wav")} volume={dB(-30)} /></Sequence>
      <Sequence from={F(17.2)} layout="none"><Audio src={staticFile("sfx_n2/glitch_03.wav")} volume={dB(-30)} /></Sequence>
      <Sequence from={F(85.0)} layout="none"><Audio src={staticFile("sfx_n2/real/reverse_swell_1.wav")} volume={dB(-34)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
