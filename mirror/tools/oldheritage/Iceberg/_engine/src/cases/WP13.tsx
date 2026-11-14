// Workplace #13 — NuStar Selby terminal, Crockett, California, 15 Oct 2019: two ethanol tanks explode and burn; a contractor is found
// still inside ~20 min after the evacuation and pulled out; shelter in place, I-80 closed; 2021 report: static / poor grounding,
// the first tank's roof landed on the second.
// Footage: NU = Timothy Clark (49 subs) -u4BeyqyP8o: 0-34 landscape hillside view of the tank farm (nu.mp4); 44-88 filmed sideways ->
// rotated to portrait (nur.mp4, t = src - 44): fireball ~76, a tank roof thrown ~79-81. JAG = Joven Agapito (275 subs) PtcLYfDRFKs,
// roadside view from the hills road (jag.mp4, t = src - 15; source cuts at file 205.8, 336, 357). Raw audio = rawclean.py (nu_clean.wav,
// starts at src 66; music detector stripped 12 s).
// VO = CASE13.mp3, the level call ("We're going down to level three ... get out.") is built separately: start at 7.75 ("October" 7.85).
//   A 7.75-48.30 ("...not the first explosion.") | RAW main: NU 71-86 (fireball, roof thrown, burning) | B 48.30-end.
// Devices: Blender site (NAIP + OSM: terminal tanks outlined white, Cummings Skyway), SearchLight (dev/WP13_SearchLight.tsx),
// Blender roof mechanism (maps/roof3d.py: grounding gap spark -> first tank blows, roof lands on the second, second flares).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { AR, BlurBed, Tall, io } from "../dev/WP01_kit";
import { SearchLight } from "../dev/WP13_SearchLight";
import { SITE } from "../dev/WP13_siteLabels";
import { ROOF } from "../dev/WP13_roofLabels";

const C = "case/", NU = C + "graded/nu.mp4", NUR = C + "graded/nur.mp4", JAG = C + "graded/jag.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const VO0 = 7.75;                     // VO source second where this case starts (after the level call)
const RA = 44.55, RB = 59.55;         // main raw window on the timeline
export const DUR = F(127.3);

// timeline: title 0-4 | A @4.00 (VO 7.75-48.30, tl = src - 3.75) | RAW 44.55-59.55 | B @59.55 (VO 48.30-end, tl = src + 11.25), VO ends 126.25
const PART: [number, number, number | null][] = [[4.0, VO0, 48.3], [RB, 48.3, null]];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.26, vo: "October 2019, Crockett, California. (the tank burning on the hillside farm)",
    node: (n) => <><Clip src={NU} from={0.6} rate={0.8} n={n} s0={1.03} s1={1.1} fx={0.45} fy={0.55} />
      <RedLabel text="NUSTAR · CROCKETT, CALIFORNIA" at={6} hold={F(1.7)} size={44} /><RedLabel text="OCTOBER 15, 2019" at={F(1.95)} hold={F(1.15)} size={44} /></> },
  { a: 7.26, b: 13.26, vo: "NuStar's fuel terminal sits in the hills by the water near Rodeo, below the road through the hills. (Blender site)",
    node: () => <BlenderShot src={C + "maps/site.mp4"} track={SITE} labels={[["term", "NUSTAR FUEL TERMINAL", 36, 74, -0.13], ["road", "THE ROAD THROUGH THE HILLS", 118, 60, -0.1]]} /> },
  { a: 13.26, b: 15.0, vo: "A lot of reports called it a refinery. (smoke over the terminal from the road)",
    node: (n) => <Clip src={JAG} from={90} n={n} s0={1.0} s1={1.05} fy={0.6} /> },
  { a: 15.0, b: 18.72, vo: "It's a storage terminal, and that matters for who was on site that day. (rows of white tanks, one burning)",
    node: (n) => <Clip src={NU} from={30.0} rate={0.7} n={n} s0={1.08} s1={1.02} fx={0.5} fy={0.65} /> },
  { a: 18.72, b: 22.5, vo: "A major explosion had lit two tanks of denatured ethanol. (flames at the tank's base, close)",
    node: (n) => <Clip src={NU} from={5.2} rate={0.6} n={n} s0={1.12} s1={1.22} fx={0.42} fy={0.6} /> },
  { a: 22.5, b: 24.8, vo: "The terminal was evacuated, (flames behind the trees, cars stopped on the road)",
    node: (n) => <Clip src={JAG} from={144} n={n} s0={1.02} s1={1.08} fy={0.7} /> },
  { a: 24.8, b: 27.02, vo: "and broken lines were leaking diesel and jet fuel. (low fire along the tank farm)",
    node: (n) => <Clip src={JAG} from={306} rate={0.8} n={n} s0={1.2} s1={1.28} fx={0.35} fy={0.75} /> },
  { a: 27.02, b: 32.74, vo: "About twenty minutes after everyone was supposed to be out, firefighters found something nobody had planned for. (fire engine on the road)",
    node: (n) => <Clip src={JAG} from={275.5} n={n} s0={1.0} s1={1.08} fy={0.6} /> },
  { a: 32.74, b: 37.47, vo: "A man was still inside. He was a contractor, there to do scheduled maintenance, (SearchLight)",
    node: (n) => <SearchLight src={NU} t={2.0} n={n} r={0.17} path={[{ f: 0, p: [0.84, 0.6] }, { f: 34, p: [0.72, 0.62] }, { f: 62, p: [0.24, 0.64] }, { f: 96, p: [0.47, 0.72] }, { f: 130, p: [0.66, 0.58] }, { f: 142, p: [0.68, 0.6] }]} /> },
  { a: 37.47, b: 40.28, vo: "and they pulled him out. He wasn't seriously hurt. (the engine closer on the road)",
    node: (n) => <Clip src={JAG} from={287.5} rate={0.85} n={n} s0={1.05} s1={1.1} fy={0.6} /> },
  { a: 40.28, b: RA, vo: "The fireball coming up is a later flare up, not the first explosion. (flames flaring over the tanks)",
    node: (n) => <Clip src={JAG} from={401.6} n={n} s0={1.06} s1={1.14} fx={0.5} fy={0.6} /> },
  { a: RA, b: RB, vo: "RAW main: NU 71-86 portrait (flames, the fireball at 76, a roof thrown 79-81, burning)",
    node: (n) => <Tall src={NUR} from={27.0} n={n} s0={1.0} s1={1.07} fy={0.45} /> },
  { a: RB, b: 63.4, vo: "Nearby towns were told to shelter in place, (the fireball again, slowed)",
    node: (n) => <TallSlow src={NUR} from={31.9} rate={0.42} n={n} s0={1.12} s1={1.2} fy={0.4} /> },
  { a: 63.4, b: 67.25, vo: "which means stay indoors, shut the windows and switch off anything that pulls in outside air. (the smoke drifting over the hills)",
    node: (n) => <Clip src={JAG} from={186} rate={0.8} n={n} s0={1.0} s1={1.06} fy={0.4} /> },
  { a: 67.25, b: 69.15, vo: "Interstate 80 was closed. (the empty road toward the column)",
    node: (n) => <Clip src={JAG} from={222} n={n} s0={1.02} s1={1.07} fy={0.6} /> },
  { a: 69.15, b: 72.5, vo: "One firefighter was slightly hurt, (flames under the column)",
    node: (n) => <Clip src={JAG} from={60} rate={0.8} n={n} s0={1.1} s1={1.16} fx={0.6} fy={0.7} /> },
  { a: 72.5, b: 75.35, vo: "and seven people with breathing problems went to an emergency room in Vallejo. (the column against the sky)",
    node: (n) => <Clip src={JAG} from={210} rate={0.8} n={n} s0={1.0} s1={1.06} fy={0.5} /> },
  { a: 75.35, b: 78.4, vo: "The fire was under control by about nine that night, (late: the fire still burning low)",
    node: (n) => <Clip src={JAG} from={548} n={n} s0={1.04} s1={1.1} fy={0.65} /> },
  { a: 78.4, b: 81.53, vo: "and Cal OSHA suspended operations at the facility. (the tank rows from the hillside)",
    node: (n) => <Clip src={NU} from={27.5} rate={0.8} n={n} s0={1.0} s1={1.07} fx={0.55} fy={0.6} /> },
  { a: 81.53, b: 88.15, vo: "In 2021, investigators from federal, state and local agencies published a five hundred page report. (smoke over the tanks)",
    node: (n) => <Clip src={JAG} from={450} rate={0.7} n={n} s0={1.03} s1={1.12} fy={0.55} /> },
  { a: 88.15, b: 99.32, vo: "static ... set off the first tank. Its roof blew off and landed on the tank next to it ... second explosion. (Blender roof)",
    node: () => <BlenderShot src={C + "maps/roof.mp4"} track={ROOF} labels={[["strap", "GROUNDING STRAP", 30, 80, -0.1], ["tank1", "FIRST TANK", 172, 72, 0.3], ["tank2", "SECOND TANK", 262, 70, 0.3]]} /> },
  { a: 99.32, b: 103.77, vo: "The report found no permits or construction plans for that part of the tank farm. (the tank rows, slow push)",
    node: (n) => <Clip src={NU} from={22.0} rate={0.7} n={n} s0={1.02} s1={1.1} fx={0.6} fy={0.6} /> },
  { a: 103.77, b: 106.6, vo: "A venting safety valve had failed years earlier (a tank flaring at its top)",
    node: (n) => <Clip src={JAG} from={364} rate={0.8} n={n} s0={1.15} s1={1.22} fx={0.55} fy={0.7} /> },
  { a: 106.6, b: 109.44, vo: "and been removed, and there was no record of a replacement. (flames behind the poles)",
    node: (n) => <Clip src={JAG} from={538} rate={0.8} n={n} s0={1.04} s1={1.1} fy={0.65} /> },
  { a: 109.44, b: 113.63, vo: "The report also said the company may have tampered with evidence afterwards. (wide smoke over the farm)",
    node: (n) => <Clip src={JAG} from={100} rate={0.75} n={n} s0={1.08} s1={1.02} fy={0.5} /> },
  { a: 113.63, b: 116.95, vo: "Contractors turn up again and again in cases like this. (the road past the fire)",
    node: (n) => <Clip src={JAG} from={4} n={n} s0={1.0} s1={1.06} fy={0.6} /> },
  { a: 116.95, b: 121.73, vo: "Someone who's on site for a day doesn't always know the plan the way the regular staff do. (flames under the column from the road)",
    node: (n) => <Clip src={JAG} from={475} rate={0.8} n={n} s0={1.05} s1={1.12} fx={0.5} fy={0.6} /> },
  { a: 121.73, b: 127.3, vo: "Twenty minutes after the evacuation, the evacuation still had someone in it. (wide: the farm, smoke rising; fade)",
    node: (n) => <Clip src={NU} from={9.5} rate={0.6} n={n} s0={1.1} s1={1.0} fx={0.5} fy={0.6} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.26), kind: "blurDip", len: 14 },   // -> Blender site
  { at: F(RB), kind: "blurDip", len: 14 },     // raw -> slow replay of the same camera
  { at: F(88.15), kind: "glitch", len: 10 },   // -> the report's mechanism
  { at: F(99.32), kind: "blurDip", len: 14 },
];
// real SFX under the Blender mechanism shot (timeline s, file, dB)
const SFX: [number, string, number][] = [[93.12, "sfx_n2/real/boom_2.wav", -16], [96.45, "sfx_n2/real/metal_clank_3.wav", -18], [97.2, "sfx_n2/real/boom_4.wav", -17]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE MAN INSIDE" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX></AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      <EndFade />
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE13.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      <Sequence from={F(RA)} durationInFrames={F(RB) - F(RA)} layout="none">
        <Audio src={staticFile(C + "media/nu_clean.wav")} startFrom={F(5.0)} volume={(f) => dB(-4) * interpolate(f, [0, 6, F(RB - RA) - 16, F(RB - RA) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, s, g], i) => (
        <Sequence key={"s" + i} from={F(t)} durationInFrames={F(3)} layout="none"><Audio src={staticFile(s)} volume={(f) => dB(g) * interpolate(f, [60, 89], [1, 0], cl)} /></Sequence>
      ))}
      {/* music: Epidemic ambient Music 1 (-18.3 LUFS file) at -15.5 dB, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(127.3 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(3)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = t < RA - 0.8 || t > RB + 0.6 ? 1 : t < RA ? (RA - t) / 0.8 : t > RB ? (t - RB) / 0.6 : 0;
          return dB(-15.5) * interpolate(t, [4.0, 5.0, 125.8, 127.3], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);

const EndFade: React.FC = () => (
  <Sequence from={F(126.5)} layout="none">
    <FadeBlack len={F(0.8)} />
  </Sequence>
);
const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len], [0, 1], cl) }} />;
};

/** the portrait clip at full height over its blurred copy, slowed (the replay after the raw) */
const TallSlow: React.FC<{ src: string; from: number; rate: number; n: number; s0: number; s1: number; fy: number }> = ({ src, from, rate, n, s0, s1, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(f / n); const W = 1080 * AR;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <BlurBed src={src} from={from} rate={rate} />
      <div style={{ position: "absolute", left: 960 - W / 2, top: 0, width: W, height: 1080, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale3d(${s},${s},1)`, transformOrigin: `50% ${fy * 100}%` }} />
      </div>
    </AbsoluteFill>
  );
};
