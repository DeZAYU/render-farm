// Amusement Parks Iceberg #17 (LEVEL 4 "The Abyss", 2nd case) — Mindbender, Fantasyland (now Galaxyland), West Edmonton Mall, Edmonton,
// Saturday 14 June 1986: the back car's wheel assembly came apart before the third loop, the lap bars released, four riders thrown out,
// the train rolled back and the wrecked car hit a concrete pillar; 3 dead, Rod Chayko critically injured. No footage of 1986 exists
// outside TV (RED), and the small-channel ride clips (CivilianSatellite on/off-ride, Prairie Coasting 2011, Mindbender Supreme) hit
// YouTube's bot check on 13 Nov (not bypassed), so the case runs on real Commons photos of Mindbender itself, moved like footage
// (dev/AM1720_Still), and three real pages. VO = vor/CASE17.mp3, one take, unsplit (no raw: no incident clip exists).
// Devices: BogieLoupe (the car's wheel assembly under a glass), SunColumn (the Edmonton Sun 2011 story, Chayko's words, one red rule),
// PillarDrain (down the loops to a concrete footing, colour drains round it), InfoRow (Wikipedia infobox: the builder's rows lift out).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Still, type Cam } from "../dev/AM1720_Still";
import { BogieLoupe } from "../dev/AM17_BogieLoupe";
import { SunColumn } from "../dev/AM17_SunColumn";
import { PillarDrain } from "../dev/AM17_PillarDrain";
import { InfoRow } from "../dev/AM17_InfoRow";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TC = 4.0, VO_END = TC + 93.48;
export const DUR = F(VO_END + 1.3);

const IM: Record<string, [number, number]> = {
  wide: [1920, 1282], splash: [1920, 1280], operators: [1920, 1280], mall: [1920, 1280], galaxy: [1920, 1044], tall: [1920, 2880],
  orbiter: [3840, 2551], train: [1920, 1280], below: [1920, 1440], loops: [3840, 2560], speed: [1920, 1280], closed: [3840, 2160], station: [1920, 1440],
};
const st = (n: string, a: Cam, b: Cam, o: { ease?: boolean; look?: [number, number]; gray?: number } = {}) =>
  <Still src={GR + n + ".jpg"} iw={IM[n][0]} ih={IM[n][1]} a={a} b={b} {...o} />;

type Sh = { a: number; b: number; vo: string; node: React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.00, b: 9.77, vo: "Rod Chayko and David Sager were the last two to board Mindbender on June 14, 1986, (Mindbender's station, trains in, 2014)",
    node: st("wide", { x: 0.36, y: 0.62, s: 1.04 }, { x: 0.3, y: 0.72, s: 1.16 }),
    over: <><RedLabel text="ROD CHAYKO & DAVID SAGER" at={F(0.3)} hold={F(2.6)} /><RedLabel text="JUNE 14, 1986" at={F(3.5)} hold={F(2.0)} /></> },
  { a: 9.77, b: 16.35, vo: "so the friends got the back car. In front of them sat an engaged couple, Tony Mandrusiak and Cindy Sims. (the loops, a train in the station, push to its last car)",
    node: st("splash", { x: 0.5, y: 0.5, s: 1.0 }, { x: 0.2, y: 0.84, s: 1.5 }),
    over: <RedLabel text="TONY MANDRUSIAK & CINDY SIMS" at={F(4.1)} hold={F(2.2)} /> },
  { a: 16.35, b: 19.55, vo: "The ride had been briefly shut that evening, then reopened. (operators in the Mindbender booth)",
    node: st("operators", { x: 0.62, y: 0.5, s: 1.05 }, { x: 0.68, y: 0.5, s: 1.15 }) },
  { a: 19.55, b: 25.39, vo: "Mindbender ran inside West Edmonton Mall in Canada, the biggest shopping mall anywhere in the mid-eighties. (the park under the mall's glass roof)",
    node: st("mall", { x: 0.5, y: 0.45, s: 1.02 }, { x: 0.52, y: 0.4, s: 1.12 }),
    over: <RedLabel text="WEST EDMONTON MALL, CANADA" at={F(1.34)} hold={F(2.6)} /> },
  { a: 25.39, b: 30.01, vo: "It had opened in December 1985 as the tallest indoor coaster in the world, (off-ride 2023, CivilianSatellite: a train through the loops)",
    node: <Shot_FX src={GR + "off.mp4"} n={F(30.01) - F(25.39)} from={1.0} s0={1.02} s1={1.08} fx={0.35} fy={0.5} /> },
  { a: 30.01, b: 33.99, vo: "about 145 feet of steel with three vertical loops. (tilt up the loops, floor to roof)",
    node: st("tall", { x: 0.5, y: 0.74, s: 1.0 }, { x: 0.5, y: 0.3, s: 1.03 }) },
  { a: 33.99, b: 36.53, vo: "After the big drop, heading for the third loop, (on-ride POV 2023, CivilianSatellite: over the crest into the drop)",
    node: <Shot_FX src={GR + "pov.mp4"} n={F(36.53) - F(33.99)} from={2.6} s0={1.0} s1={1.04} /> },
  { a: 36.53, b: 40.71, vo: "the back car started to fishtail. Its wheel assembly had come apart. (BogieLoupe: glass from the riders to the wheel assembly)",
    node: <BogieLoupe src={GR + "train.jpg"} iw={1920} ih={1280} from={[0.42, 0.42]} to={[0.78, 0.33]} fx={0.6} fy={0.42} r={255} mag={2.2} at={44} /> },
  { a: 40.71, b: 47.78, vo: "Chayko said his lap bar just let go, and there wasn't anything else holding them in. The train didn't have the speed for the last loop. (SunColumn)",
    node: <SunColumn page={C + "shots/sun_crop.png"} pw={1340} ph={1460} bg={GR + "below.jpg"} narrowAt={34} cx={860} rule={{ box: [638, 1258, 852, 1286], at: 48 }} para={[1205, 1325]}
      keys={[{ at: 0, y: 900, k: 1.08 }, { at: 34, y: 1240, k: 1.18 }, { at: 212, y: 1250, k: 1.26 }]} />,
    over: <RedLabel text="EDMONTON SUN, 2011" at={F(0.5)} hold={F(2.0)} y={0.12} size={34} /> },
  { a: 47.78, b: 51.90, vo: "It rolled backwards, and the wrecked car slammed into a concrete pillar. (PillarDrain)",
    node: <PillarDrain src={GR + "below.jpg"} iw={1920} ih={1440} from={{ x: 0.36, y: 0.25, s: 1.25 }} to={{ x: 0.38, y: 0.8, s: 1.5 }} band={[0.335, 0.435]} moveEnd={62} drainAt={58} hitAt={64} /> },
  { a: 51.90, b: 59.09, vo: "Somewhere in all that, the four riders in the back car were thrown out. Tony and Cindy didn't survive, and neither did David. (the empty loop, lights going down)",
    node: st("loops", { x: 0.68, y: 0.42, s: 1.3 }, { x: 0.7, y: 0.38, s: 1.48 }, { look: [0, 0.8] }) },
  { a: 59.09, b: 66.70, vo: "Chayko spent more than six months in the hospital and had to learn to walk again. He didn't find out his best friend was dead until three days later. (the station below the loops, near grey)",
    node: st("tall", { x: 0.5, y: 0.9, s: 1.18 }, { x: 0.44, y: 0.93, s: 1.32 }, { gray: 0.65 }) },
  { a: 66.70, b: 73.63, vo: "A provincial inquiry found the bolts holding the wheel assembly had worked loose and fallen out. How many bolts were holding it on? (the lower bogie, bolted wheel arms)",
    node: st("train", { x: 0.5, y: 0.82, s: 1.6 }, { x: 0.47, y: 0.85, s: 1.85 }) },
  { a: 73.63, b: 77.21, vo: "Four. I honestly expected a bigger number than that. (punch in: the bolt heads on one wheel arm)",
    node: st("train", { x: 0.44, y: 0.87, s: 2.7 }, { x: 0.44, y: 0.87, s: 2.85 }) },
  { a: 77.21, b: 82.96, vo: "The inquiry didn't blame the mall. It blamed design and manufacturing faults by the West German builder. (InfoRow: Manufacturer Anton Schwarzkopf / Designer Werner Stengel)",
    node: <InfoRow page={C + "shots/wiki_box.png"} pw={650} ph={1140} bg={GR + "orbiter.jpg"} rows={[482, 590]} y0={300} liftAt={52} k={1.3} /> },
  { a: 82.96, b: 87.20, vo: "Mindbender came back in 1987 with shorter trains and seat belts, (off-ride 2023: a train through the top of a loop)",
    node: <Shot_FX src={GR + "off.mp4"} n={F(87.20) - F(82.96)} from={14.0} s0={1.03} s1={1.09} fx={0.6} fy={0.4} />,
    over: <RedLabel text="1987" at={F(1.27)} hold={F(1.8)} /> },
  { a: 87.20, b: 92.89, vo: "and it ran for another 35 years before it closed for good on January 30, 2023. (the ride the day after it closed)",
    node: st("closed", { x: 0.5, y: 0.5, s: 1.02 }, { x: 0.55, y: 0.48, s: 1.12 }),
    over: <RedLabel text="JANUARY 30, 2023" at={F(3.26)} hold={F(2.1)} /> },
  { a: 92.89, b: VO_END + 1.3, vo: "Chayko spent decades asking for a memorial at the site, and there's never been one. (people walking past the track; fade)",
    node: st("station", { x: 0.5, y: 0.5, s: 1.04 }, { x: 0.46, y: 0.52, s: 1.14 }) },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },     // title card -> the case
  { at: F(40.71), kind: "blurDip", len: 12 },  // into the Sun story
  { at: F(51.90), kind: "blurDip", len: 14 },  // the crash -> the toll
  { at: F(77.21), kind: "blurDip", len: 12 },  // into the infobox
];

const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [37.9, "sfx_n2/real/metal_clank_2.wav", -30],
  [40.71, "sfx_n2/real/page_turn_1.wav", -26],
  [49.92, "sfx_n2/real/impact_2.wav", -21],
  [73.63, "sfx_n2/real/sub_drop_2.wav", -24],
  [77.21, "sfx_n2/real/paper_2.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="MINDBENDER" bg={GR + "orbiter.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none">
              <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>{s.over}</AbsoluteFill>
            </Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(VO_END + 0.2)} layout="none"><FadeBlack len={F(1.1)} /></Sequence>
      <Sequence from={F(TC)} layout="none"><Audio src={staticFile("vor/CASE17.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 3, ~-19.5 dB (≈ the AM01 bed level), a small dip on the deaths */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(25)} volume={(f) => {
          const t = f / 30;
          const dip = interpolate(t, [55.0, 56.0, 60.0, 62.0], [1, 0.6, 0.6, 1], cl);
          return dB(-19.5) * interpolate(t, [0, 1.2, VO_END - 0.5, VO_END + 1.3], [0, 1, 1, 0], cl) * dip;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
