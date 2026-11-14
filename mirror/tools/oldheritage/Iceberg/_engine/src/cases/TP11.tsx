// Theme Park #11 — Tilburg kermis, opening night (Fri 18 Jul 2014): a food tent burns among the rides, gas bottles explode.
// Footage: [TK] Kermis FM's phone shot as reposted by Tom van der Meer (bR-IWGdYTHk, credit Kermis FM per its description) and
// [TW] Wouter van der Put's close phone shot (GlY5rcwk-9g, 400x224 -> lanczos 1280x720, shown framed where it carries a raw).
// Both shots are handheld and shaky (no source cuts; TW has camera whips at 39.9-44.7, avoided). Raws keep the real crowd sound:
// cold open (TW, "kom eruit"), the fire under the dart banners (TK), the explosion and the crowd running (TK). The explosion
// comes back as a 0.5x replay under the last line. Devices (dev/): FlameFreeze (freeze-print, the witness's 4-5 m measured against
// the stall's own height, then the flats above boxed), WordFlip (Omroep Brabant's two Dutch lines set sharp, key words flip to English: replaced ChipLift 3 Nov).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { WordFlip } from "../dev/TP11_WordFlip";
import { Inset, RedLabel, TitleCard } from "../brand";
import { FlameFreeze } from "../dev/TP11_FlameFreeze";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(89.6);

// VO parts [take a, take b, comp start]
const VO: [number, number, number][] = [[0.0, 25.15, 15.0], [25.15, 32.47, 48.65], [32.47, 54.7, 66.47]];
// raws [comp a, comp b, src file, src from, gain dB]
const RAWS: [number, number, string, number, number][] = [
  [4.0, 15.0, "media/tw_clean.wav", 0.3, -3],
  [40.15, 48.65, "media/tk_clean.wav", 2.5, 0],
  [55.97, 66.47, "media/tk_clean.wav", 33.6, 0],
];

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const TK = "tk_mb.mp4", TW = "tw.mp4"; // tk_mb = graded TK + 3-frame motion blend (tmix 1-2-1): the phone whips read as cuts to cutcheck without it
const SHOTS: Sh[] = [
  { a: 4.0, b: 15.0, vo: "RAW A (cold open): flames at the stall front, bystanders shouting", node: <Inset src={GR + TW} from={0.3} box={0.66} drift={0.05} /> },
  { a: 15.0, b: 18.66, vo: "The Tilburg kermis is one of the biggest funfairs in the Benelux.", src: TK, from: 22.5, s0: 1.03, s1: 1.08,
    over: <RedLabel text="TILBURG, NETHERLANDS" at={F(0.5)} hold={F(2.7)} /> },
  { a: 18.66, b: 22.62, vo: "It's about eight o'clock on Friday the 18th of July 2014,", src: TK, from: 12.4, s0: 1.04, s1: 1.09, fx: 0.55,
    over: <RedLabel text="JULY 18, 2014" at={F(0.9)} hold={F(2.6)} /> },
  { a: 22.62, b: 25.07, vo: "the fair's very first evening of the year.", src: TW, from: 13.0, s0: 1.06, s1: 1.12 },
  { a: 25.07, b: 28.07, vo: "A food tent has caught fire in the middle of the rides.", src: TK, from: 27.0, s0: 1.03, s1: 1.08, fx: 0.6 },
  { a: 28.07, b: 30.13, vo: "Staff tried to put it out and couldn't.", src: TW, from: 18.5, s0: 1.06, s1: 1.12, fy: 0.45 },
  { a: 30.13, b: 34.1, vo: "Bystanders told Omroep Brabant they heard two gas bottles explode,", src: TK, from: 17.0, s0: 1.03, s1: 1.08 },
  { a: 34.1, b: 40.15, vo: "and one said the flames went four or five metres up through the tent roof. There are flats above that square. (FlameFreeze)",
    node: <FlameFreeze src={GR + "tk_freeze.jpg"} iw={1920} ih={1080} roof={[1040, 1250]} rule={{ x: 770, y0: 590, y1: 105, at: F(20.37 - 19.1) - 4, label: "4–5 M" }}
      box={[1270, 20, 1905, 520]} boxAt={F(23.35 - 19.1) - 2} /> },
  { a: 40.15, b: 48.65, vo: "RAW B: the stall burning under the dart banners, the crowd", src: TK, from: 2.5, s0: 1.0, s1: 1.05 },
  { a: 48.65, b: 51.44, vo: "The popcorn stall next door was badly damaged.", src: TW, from: 26.0, s0: 1.05, s1: 1.1 },
  { a: 51.44, b: 55.97, vo: "The area was cleared, and a trauma helicopter took off and then turned around.", src: TK, from: 45.0, s0: 1.03, s1: 1.08 },
  { a: 55.97, b: 66.47, vo: "RAW C: the gas bottle goes up, the crowd runs", src: TK, from: 33.6, s0: 1.0, s1: 1.04 },
  { a: 66.47, b: 68.74, vo: "The staff got away with minor scratches,", src: TK, from: 50.0, s0: 1.04, s1: 1.08 },
  { a: 68.74, b: 71.06, vo: "and the square reopened at about nine.", src: TW, from: 36.0, s0: 1.05, s1: 1.1 },
  { a: 71.06, b: 78.28, vo: "Then it came out that the food tents hadn't been inspected ... whether the owner had been negligent, (WordFlip: Omroep Brabant's two Dutch lines, flipped to English)",
    node: <WordFlip bg={GR + "tk.mp4"} bgFrom={46.0} credit="SOURCE: OMROEP BRABANT, JULY 2014"
      lines={[
        { pre: "Vooraf zijn de eettentjes ", nl: "niet gecontroleerd.", en: "NOT INSPECTED.", post: "", gloss: "Beforehand, the food tents were not inspected.", at: 6, flipAt: F(39.19 - 37.06) },
        { pre: "Onderzocht wordt of de eigenaar ", nl: "nalatig", en: "NEGLIGENT", post: " is geweest.", gloss: "Under investigation: whether the owner was negligent.", at: F(41.22 - 37.06) - 4, flipAt: F(43.49 - 37.06) - 3 },
      ]} /> },
  { a: 78.28, b: 81.61, vo: "and the city ordered checks on every food stall at the fair.", src: TW, from: 22.0, s0: 1.08, s1: 1.14, fy: 0.45 },
  { a: 81.61, b: 83.92, vo: "We spend all our worry on the rides.", src: TK, from: 55.0, s0: 1.03, s1: 1.07 },
  { a: 83.92, b: 89.6, vo: "Until this one, I had never given a single thought to the gas bottle behind the counter. (0.5x replay of the explosion)",
    src: "tk_slow.mp4", from: 0.2, s0: 1.18, s1: 1.3, fx: 0.62, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(15.0), kind: "blurDip", len: 12 },
  { at: F(34.1), kind: "zoomHit", len: 10 },
  { at: F(40.15), kind: "blurDip", len: 12 },
  { at: F(48.65), kind: "blurDip", len: 12 },
  { at: F(66.47), kind: "glitch", len: 8 },
  { at: F(83.92), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [34.1, "sfx_n2/whoosh_02.wav", -28],
  [66.45, "sfx_n2/glitch_03.wav", -28],
  [71.1, X + "page_turn_1.wav", -26],
  [83.9, X + "reverse_swell_1.wav", -24],
  [85.4, X + "boom_4.wav", -22],        // under the slow replay, where the fireball blooms (slow t ~1.5 s)
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="GAS BOTTLES ON OPENING NIGHT" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE11.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {/* raw sound only inside its window, faded to 0 before the VO returns */}
      {RAWS.map(([a, b, src, from, g], i) => {
        const n = F(b) - F(a);
        return <Sequence key={"r" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile(C + src)} startFrom={F(from)} volume={(f) => dB(g) * interpolate(f, [0, 6, n - 12, n - 2], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {/* music: Epidemic ambient Music 1 (−18.3 LUFS file -> −15 dB), out under each raw, back after */}
      {[[15.0, 40.15, 0], [48.65, 55.97, 30], [66.47, 89.6, 45]].map(([a, b, off], i) => {
        const n = F(b) - F(a);
        return <Sequence key={"m" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off)} volume={(f) => dB(-15) * interpolate(f, [0, 24, n - 20, n - 2], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
