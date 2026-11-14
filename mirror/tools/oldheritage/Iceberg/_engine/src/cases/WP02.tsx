// Workplace #02 — UTS tower crane fire, Broadway, Sydney, Nov 2012: the cab burns, operator Glen May swings the jib over the site,
// dogman Nuno Nunes brings him down, the luffing cable burns through and the jib folds onto the unfinished building.
// Sources (all OK in SOURCES.csv): main UeTmxKO-3dc (stuartcryan, window view, SILENT), extra1 JrBm-CHoTkY (JA, long lens, silent),
// extra2 Dji6ySZJ4UE (KO, office window, 4:3 26 fps -> 30), extra3 a2CtDH-47xE (BO, portrait 272x480 straight down on the site and
// Broadway, with sound), extra4 AhNXVojVpC0 (FULL, silent window view).
// VO = one take (CASE02.mp3), split once at the end of "...ran straight through the heat." (silence 51.94-52.47).
// ONE raw (WP_PLAN: VO 80 s > 70 s): BO 115.5-131.0, the jib up -> it folds onto the site (124.7) -> onlookers. The cut sheet put the
// drop raw on the UTS clip, but that upload has no sound, so the raw is the side angle with real sound, and the UTS angle is the replay.
// Blender (v3, 4 Nov): maps/luff3d.py replaces LuffTrace over the same VO span (the luffing ropes through the cab fire).
// Devices (new, dev/WP02_*): FoldEcho (slow replay of the fall with echo trails),
// SiteLight (spotlight Broadway -> the site on the side filmer's view).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Tall } from "../dev/WP01_kit";
import { BlenderShot } from "../dev/WP45_kit";
import { NLU } from "../dev/WP02_blLabels";
import { WP02_FoldEcho } from "../dev/WP02_FoldEcho";
import { WP02_SiteLight } from "../dev/WP02_SiteLight";

const F = (s: number) => Math.round(s * 30);
const G = "case/graded/";
const MAIN = G + "main.mp4", KO = G + "ko.mp4", KO2 = G + "ko2.mp4", JA = G + "ja.mp4", FULL = G + "full.mp4", BO = G + "bo.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(100.8);

// timeline (s): title 0-4 | VO A (0-52.25) @4.00 | RAW 56.25-71.75 (BO src 115.5-131.0) | VO B (52.25-end) @71.75 (tl = vo + 19.5),
// VO ends 99.52, hold to 100.8
const PART: [number, number, number | null][] = [[4.0, 0, 52.25], [71.75, 52.25, null]];
const RAW = { a: 56.25, b: 71.75, src: 115.5, wav0: 105.0, gain: -6 };

// the burning cab's position (red-glow centroid) through the fall, for FoldEcho's stabilisation
const CAB: [number, number, number][] = [[193.9,863,585],[194.0,851,580],[194.1,857,584],[194.2,859,600],[194.3,853,610],[194.4,846,626],[194.5,843,656],[194.6,839,678],[194.7,840,680],[194.8,840,676],[194.9,842,667],[195.0,841,653],[195.1,840,648],[195.2,842,645],[195.3,842,640],[195.4,842,637],[195.5,842,629],[195.6,842,613],[195.7,842,603],[195.8,844,597],[195.9,849,593],[196.0,845,594]];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; grain?: boolean };
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.0, vo: "The UTS tower crane, Sydney, November 2012.", grain: true,
    node: (n) => <><Shot_FX src={MAIN} from={40} n={n} s0={1.02} s1={1.1} fx={0.45} fy={0.45} />
      <RedLabel text="BROADWAY · SYDNEY, AUSTRALIA" at={8} hold={F(1.9)} size={44} /><RedLabel text="NOVEMBER 2012" at={F(2.25)} hold={F(1.5)} size={44} /></> },
  { a: 8.0, b: 14.24, vo: "It stood over a building site on Broadway, at the University of Technology, and around mid morning its cab caught fire.", grain: true,
    node: (n) => <><Tall src={BO} from={0.5} n={n} s0={1.0} s1={1.08} fy={0.35} />
      <RedLabel text="UNIVERSITY OF TECHNOLOGY SYDNEY" at={F(1.0)} hold={F(3.2)} size={38} y={0.9} /></> },
  { a: 14.24, b: 17.82, vo: "Hundreds of people stopped in the street and at office windows. (KO: from an office window)", grain: true,
    node: (n) => <Shot_FX src={KO} from={10} n={n} fill s0={1.0} s1={1.06} /> },
  { a: 17.82, b: 21.85, vo: "According to CNN, firefighters believed diesel was involved. (JA long lens: black smoke off the cab)", grain: true,
    node: (n) => <Shot_FX src={JA} from={1.5} n={n} s0={1.02} s1={1.14} fx={0.42} fy={0.35} /> },
  { a: 21.85, b: 25.54, vo: "In the cab was the operator, Glen May, who was sixty. (punch-in on the burning cab)", grain: true,
    node: (n) => <><Shot_FX src={MAIN} from={100} n={n} s0={1.9} s1={2.1} fx={0.44} fy={0.42} />
      <RedLabel text="GLEN MAY · CRANE OPERATOR, 60" at={10} hold={F(3.0)} size={42} /></> },
  { a: 25.54, b: 29.4, vo: "He fought the fire first. Then, before he got down,", grain: true,
    node: (n) => <Shot_FX src={FULL} from={5} n={n} s0={1.18} s1={1.28} fx={0.4} fy={0.55} /> },
  { a: 29.4, b: 33.09, vo: "he went back into the burning cab and swung the jib round. (JA: the jib above the smoke)", grain: true,
    node: (n) => <Shot_FX src={JA} from={24} n={n} s0={1.06} s1={1.16} fx={0.6} fy={0.3} /> },
  { a: 33.09, b: 37.21, vo: "Now it hung over the building site instead of over Broadway and the crowds. (SiteLight)",
    node: (n) => <WP02_SiteLight src={BO} t={103.5} n={n} move={[48, 76]}
      a={{ x: 0.45, y: 0.8, rx: 0.75, ry: 0.2, label: "BROADWAY" }} b={{ x: 0.42, y: 0.38, rx: 0.85, ry: 0.22, label: "THE BUILDING SITE" }} /> },
  { a: 37.21, b: 43.17, vo: "For well over twenty minutes, the crane stood over the city with its cab burning and the jib still up.", grain: true,
    node: (n) => <Shot_FX src={KO} from={30} n={n} fill s0={1.0} s1={1.1} fx={0.4} fy={0.4} /> },
  { a: 43.17, b: 45.49, vo: "Nobody below could do anything about it. (BO: Broadway below)", grain: true,
    node: (n) => <Tall src={BO} from={106.3} n={n} s0={1.0} s1={1.05} fy={0.6} /> },
  { a: 45.49, b: 51.11, vo: "A dogman on the site, Nuno Nunes, climbed the crane to reach him and brought him down. (up the mast)", grain: true,
    node: (n) => <><Shot_FX src={MAIN} from={130} n={n} s0={1.55} s1={1.75} fx={0.44} fy={0.62} />
      <RedLabel text="NUNO NUNES · DOGMAN (CRANE RIGGER)" at={F(0.9)} hold={F(3.6)} size={40} /></> },
  { a: 51.11, b: 56.25, vo: "The jib was held at its angle by a luffing cable, and that cable ran straight through the heat. (Blender luff: the rope pair lights up, then glows hot where it rises through the cab fire)", grain: true,
    node: () => <BlenderShot src={"case/maps/luff.mp4"} track={NLU} scale={1.12} oy={0.45} labels={[["cable", "LUFFING CABLE", 56, 72, -0.07]]} /> },
  { a: 56.25, b: 71.75, vo: "RAW (main): BO side angle, jib up -> folds onto the site at 124.7 -> onlookers (src 115.5-131.0)",
    node: (n) => <Tall src={BO} from={RAW.src} n={n} s0={1.0} s1={1.04} fy={0.3} /> },
  { a: 71.75, b: 75.89, vo: "The cable burned through, and the jib folded onto the unfinished building, (FoldEcho: UTS angle, 0.45x)",
    node: (n) => <WP02_FoldEcho src={MAIN} t0={193.9} rate={0.45} n={n} landed={195.4} focus={[870, 420]} s0={1.2} s1={1.36} track={CAB} /> },
  { a: 75.89, b: 79.35, vo: "exactly where May had put it, and not across Broadway. (BO: the jib lying over the site)", grain: true,
    node: (n) => <Tall src={BO} from={141.0} n={n} s0={1.0} s1={1.07} fy={0.5} /> },
  { a: 79.35, b: 83.12, vo: "Once the jib was down, the flames finally broke out of the cab.", grain: true,
    node: (n) => <Shot_FX src={MAIN} from={203.5} n={n} s0={1.25} s1={1.4} fx={0.4} fy={0.33} /> },
  { a: 83.12, b: 90.34, vo: "Lend Lease, which ran the site, said nobody was injured, and May and Nunes were both later given bravery awards.", grain: true,
    node: (n) => <><Shot_FX src={KO2} from={12} n={n} fill s0={1.0} s1={1.12} fx={0.38} fy={0.45} />
      <RedLabel text="LEND LEASE · THE BUILDER" at={10} hold={F(2.4)} size={40} /></> },
  { a: 90.34, b: 93.7, vo: "No finding on what started the fire was ever published.", grain: true,
    node: (n) => <Shot_FX src={KO2} from={32} n={n} fill s0={1.15} s1={1.24} fx={0.35} fy={0.4} /> },
  { a: 93.7, b: 100.8, vo: "A safe ending that depends on one man climbing back into a burning cab is luck with a name on it.", grain: true,
    node: (n) => <Tall src={BO} from={151.5} n={n} s0={1.0} s1={1.12} fy={0.3} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(51.11), kind: "blurDip", len: 12 }, // into Blender luff
  { at: F(56.25), kind: "blurDip", len: 12 }, // Blender -> raw
  { at: F(71.75), kind: "blurDip", len: 14 }, // raw -> replay from the other camera
  { at: F(90.34), kind: "blurDip", len: 12 }, // same camera (KO2) later on
  { at: F(93.7), kind: "blurDip", len: 14 },  // closing line
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE JIB CAME DOWN" bg={G + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill>{s.grain ? <FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX> : s.node(n)}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE02.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output of the BO window (no music found), never under the VO */}
      <Sequence from={F(RAW.a)} durationInFrames={F(RAW.b) - F(RAW.a)} layout="none">
        <Audio src={staticFile("case/media/bo_clean.wav")} startFrom={F(RAW.src - RAW.wav0)}
          volume={(f) => dB(RAW.gain) * interpolate(f, [0, 8, F(RAW.b - RAW.a) - 18, F(RAW.b - RAW.a) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 5 (-21 LUFS file) at -13 dB, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(100.8 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(18)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = t < RAW.a - 0.8 || t > RAW.b + 0.6 ? 1 : t < RAW.a ? (RAW.a - t) / 0.8 : t > RAW.b ? (t - RAW.b) / 0.6 : 0;
          return dB(-13) * interpolate(t, [4.0, 5.0, 99.6, 100.8], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
