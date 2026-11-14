// Theme Park video — INTRO v5 = WheelField (clips as gondolas on a turning ferris wheel; owner: "adjacent intro style 3d but differently"). Was INTRO v4 ("25 Most HORRIFYING Theme Park Accidents That Will HAUNT You Forever", 3 Nov 2026). Built the way the owner
// approved on TOR00 ("ok looks good"): one continuous cinematic 3-D flight through a field of the video's own case clips (dev/TOR00_ClipField
// + dev/ClipFieldKit), silent under the music, the camera easing to one hero clip per VO beat with its red place + year: the Aachen fair
// ("built to scare you"), a rescuer at the Joker's Jinx restraints ("checks your harness"), up into the Zipper's frame ("every bolt and
// cable"); on "twenty-five times" the camera pulls back as the field fans out, then the Big Tex crowd filming, Barakaldo, Osaka, Orlando,
// the Tilburg blast, Almería, and a long slow push into the Seville fair / Steel Max masts (case 1) under the last three lines, blur-dip
// into the video title. VO straight through from 0.5 s, no clip sound. Old versions (cold open, montage, CaseWall): _engine/_bak_intro_raw/.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { VideoTitle } from "../dev/TOR00_VideoTitle";
import { WheelField, wheelCards, wheelHeroes, wheelPath, type WheelHero } from "../dev/TP00_WheelField";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V = 0.5;    // VO (INTRO.mp3, whole) starts here; last word ends V+38.83
const T = 39.6;   // blur-dip into the video title
export const DUR = F(43.6);
const D = 470;

// graded windows (CASE00/graded, each cut 1 s before the used moment from the case's graded file): fair = TP15 fair_a / jj = TP07 /
// zx = TP03 / bw = TP12 Big Tex crowd / bk = TP14 / fd = TP06 / iw = TP10 / co = TP11 tk_mb (blast at +4.0) / cause = TP08 / sx = TP01
// (Seville street 1.0, masts 10-23; the launch at sx 29.6 is never reached)
const B = [
  { id: "fair", src: "fair.mp4", len: 6, q: 1.0, at: 44, out: 132, label: "AACHEN, GERMANY · 2022" },         // "A ride is built to scare you ... That's the whole deal."
  { id: "jj", src: "jj.mp4", len: 5, q: 1.0, at: 158, out: 232, label: "MARYLAND · 2017" },                  // "You hand over your ticket, somebody checks your harness,"
  { id: "zx", src: "zx.mp4", len: 6, q: 1.0, at: 256, out: 368, label: "WILMINGTON, DELAWARE · 2023" },      // "and you trust that every bolt and cable ..."
  { id: "bw", src: "bw.mp4", len: 5, q: 1.0, at: 436, out: 478, label: "DALLAS, TEXAS · 2012" },             // "... while somebody was filming."
  { id: "bk", src: "bk.mp4", len: 3.5, q: 0.6, at: 500, out: 526, label: "BARAKALDO, SPAIN · 2015" },        // "Some of them are slow."
  { id: "fd", src: "fd.mp4", len: 4.5, q: 1.0, at: 550, out: 614, label: "OSAKA, JAPAN · 2018" },            // "Riders hang face-down for two hours in Osaka."
  { id: "iw", src: "iw.mp4", len: 6.5, q: 1.0, at: 638, out: 748, label: "ORLANDO, FLORIDA · 2022" },        // "Sixty-two people sit stuck ... New Year's Eve."
  { id: "co", src: "co.mp4", len: 7.5, q: 3.7, at: 772, out: 800, label: "TILBURG, NETHERLANDS · 2014" },    // "Some are over in a second."
  { id: "cause", src: "cause.mp4", len: 4.5, q: 1.0, at: 822, out: 870, label: "ALMERÍA, SPAIN · 2026" },    // "A few still don't have an official cause."
  { id: "sx", src: "sx.mp4", len: 28, q: 1.0, at: 896, out: 1188, label: "SEVILLE, SPAIN · 2026", push: 190 }, // "I've put the worst first ... about to let go."
] as WheelHero[];
const H = wheelHeroes(B, GR);
const card = (n: string) => ({ src: GR + "cards/TP" + n + ".jpg", still: true });
const PLANES = [...H, ...wheelCards([
  { src: GR + "tks.mp4", len: 5.9 }, card("02"), card("04"), card("05"), card("09"), card("13"), card("16"), card("17"),
  card("18"), card("19"), card("20"), card("21"), card("22"), card("23"), card("24"), card("25"),
])];
const PATH = wheelPath(B, 3, 404);

const CUTS: FxCut[] = [{ at: F(T), kind: "blurDip", len: 14 }];

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [F(0) + 772 / 30 + 0.3, X + "boom_2.wav", -27], // the Tilburg gas bottle (picture only under the VO)
  [T - 0.1, "sfx_n2/whoosh_02.wav", -28],
  [T + 0.5, "sfx_n2/title_hit_01.wav", -24],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(T)} layout="none"><AbsoluteFill>
            <FilmLook_FX grain={0.07}>
              <CameraMotionBlur samples={4} shutterAngle={150}><WheelField planes={PLANES} path={PATH} focus={D} /></CameraMotionBlur>
            </FilmLook_FX>
            {B.map((h) => <RedLabel key={h.id} text={h.label} at={h.at + 2} hold={h.id === "sx" ? 96 : h.out - h.at + 2} />)}
          </AbsoluteFill></Sequence>
          <Sequence from={F(T)} durationInFrames={DUR - F(T)} layout="none"><AbsoluteFill>
            <VideoTitle bg={GR + "titlebg.mp4"} bgFrom={1.0} ruleAt={F(1.5)} ruleAfter={1}
              lines={[{ text: "25 MOST HORRIFYING", size: 108, at: F(0.25) }, { text: "THEME PARK ACCIDENTS", size: 108, at: F(0.55) }, { text: "THAT WILL HAUNT YOU FOREVER", size: 56, at: F(1.6) }]} />
          </AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the intro take, whole and continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 4 (−11.6 LUFS file -> −21.4 dB ≈ 10 LU under the VO), swells into the title, out with it */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(12)} volume={(f) => dB(-21.4) * interpolate(f, [0, 15, F(T - 1.0), F(T), DUR - F(1.6), DUR], [0, 1, 1, 1.5, 1.5, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
