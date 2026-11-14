// Workplace #18 — Exxon Baton Rouge refinery, Louisiana, Christmas Eve 1989: in a record cold snap (about 8 F that morning) gas escapes and
// ignites at about 1:30 pm; the blast shatters windows at the State Capitol and downtown; two workers killed, four injured; the tank-farm fire
// burns ~15 hours. Footage: one camcorder (ShelleyVideo, 4eE4v2Xh6jw; silent, VHS edges cropped -> graded/ex.mp4, same seconds as the
// source): the State Capitol's top, the lake, the rail yard, police at the perimeter. VO = one take, starts AFTER the level-4 call (take
// 3.18, "Christmas"); split once at the raw. Raw = the rail-yard view, the fire flaring up behind the boxcars (src 144.3-159.3, 15 s), silent
// -> real SFX. Devices: FrostCreep; Blender: the Capitol and the refinery (maps/capitol.mp4), a water line + valve freezing (assets/valve.mp4).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { useWpFonts } from "../dev/WP01_kit";
import { WP18_FrostCreep } from "../dev/WP18_FrostCreep";
import { CAPITOL, VALVE } from "../dev/WP18_mapLabels";

const C = "case/", X = C + "graded/ex.mp4";
const dB = (d: number) => Math.pow(10, d / 20);

// timeline (s): title 0-4 | VO1 take 3.18-33.25 @4.0 | RAW 34.07-49.07 | VO2 take 33.3-end @49.07
const OFF1 = 4.0 - 3.18, RAW: [number, number] = [33.25 + OFF1, 33.25 + OFF1 + 15.0], OFF2 = RAW[1] - 33.3;
const PART: [number, number, number | null][] = [[4.0, 3.18, 33.25], [RAW[1], 33.3, null]];
const RSRC = 144.3;
const FLARES = [146.0, 149.0, 156.6]; // fire flaring up behind the boxcars (source seconds)
const t1 = (take: number) => take + OFF1, t2 = (take: number) => take + OFF2;
const DURS = t2(107.0) + 1.2; // last word ends at take 106.99
export const DUR = F(DURS);

const Credit: React.FC<{ text: string; at?: number; hold?: number }> = ({ text, at = 10, hold = 80 }) => {
  useWpFonts(); const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 10, at + hold, at + hold + 10], [0, 1, 1, 0], cl);
  return <div style={{ position: "absolute", left: 56, bottom: 40, fontFamily: "Elite", fontSize: 24, color: "rgba(242,242,240,.78)", opacity: o, textShadow: "0 2px 6px rgba(0,0,0,.9)" }}>{text}</div>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: t1(6.51), vo: "Christmas Eve, 1989. Baton Rouge. (from the top of the State Capitol: the columns over the refinery)",
    node: (n) => <><Clip src={X} from={70.0} n={n} s0={1.02} s1={1.08} fx={0.4} fy={0.6} />
      <RedLabel text="BATON ROUGE, LOUISIANA" at={6} hold={F(1.4)} size={44} /><RedLabel text="DECEMBER 24, 1989" at={F(1.7)} hold={F(1.5)} size={44} />
      <Credit text="CAMCORDER VIDEO · 1989" at={10} hold={80} /></> },
  { a: t1(6.51), b: t1(8.62), vo: "This is the oldest case on the iceberg.",
    node: (n) => <Clip src={X} from={0.9} n={n} s0={1.1} s1={1.04} fx={0.5} fy={0.5} /> },
  { a: t1(8.62), b: t1(15.22), vo: "That morning it had dropped to about eight degrees Fahrenheit ... a cold snap the whole South remembers. (FrostCreep)",
    node: (n) => <WP18_FrostCreep src={X} from={17.0} n={n} rate={0.85} fx={0.5} fy={0.45} /> },
  { a: t1(15.22), b: t1(20.24), vo: "At about one thirty that afternoon, gas escaped at the Exxon refinery and ignited.",
    node: (n) => <><Clip src={X} from={52.2} n={n} s0={1.0} s1={1.1} fx={0.3} fy={0.7} /><RedLabel text="EXXON REFINERY" at={F(2.2)} hold={F(2.4)} size={44} /></> },
  { a: t1(20.24), b: t1(26.78), vo: "It was then the second largest refinery in the country ... four hundred and fifty five thousand barrels a day.",
    node: (n) => <Clip src={X} from={96.9} n={n} s0={1.02} s1={1.12} fx={0.35} fy={0.6} /> },
  { a: t1(26.78), b: RAW[0], vo: "The blast shattered windows at the State Capitol and right across downtown. People felt it about forty miles away. (Blender)",
    node: () => <BlenderShot src={C + "maps/capitol.mp4"} track={CAPITOL} labels={[["refinery", "EXXON REFINERY", 12, 120, -0.06], ["capitol", "STATE CAPITOL", 64, 120, -0.07]]} /> },
  { a: RAW[0], b: RAW[1], vo: "RAW: the rail yard, the fire flaring up behind the boxcars (src 144.3-159.3)",
    node: (n) => <Clip src={X} from={RSRC} n={n} s0={1.0} s1={1.1} fx={0.4} fy={0.6} /> },
  { a: RAW[1], b: t2(36.63), vo: "Two workers never made it home, and four were injured. (the big flare again, half speed)",
    node: (n) => <Clip src={X} from={156.2} n={n} rate={0.5} s0={1.25} s1={1.38} fx={0.3} fy={0.62} /> },
  { a: t2(36.63), b: t2(42.54), vo: "Their names aren't in any of the sources for this case ... older cases like this one. (police at the perimeter)",
    node: (n) => <Clip src={X} from={191.0} n={n} s0={1.02} s1={1.1} fx={0.45} fy={0.45} /> },
  { a: t2(42.54), b: t2(49.67), vo: "That Christmas was a record cold snap across the American South ... a refinery built for Louisiana.",
    node: (n) => <Clip src={X} from={77.0} n={n} s0={1.1} s1={1.02} fx={0.5} fy={0.55} /> },
  { a: t2(49.67), b: t2(53.62), vo: "Water in lines and valves can freeze, and steel gets more brittle. (Blender valve)",
    node: () => <BlenderShot src={C + "assets/valve.mp4"} track={VALVE} labels={[["ice", "ICE INSIDE THE LINE", 40, 75, 0.12]]} /> },
  { a: t2(53.62), b: t2(57.46), vo: "Equipment that has never had to cope with eight degrees suddenly has to.",
    node: (n) => <Clip src={X} from={34.3} n={n} s0={1.04} s1={1.14} fx={0.3} fy={0.6} /> },
  { a: t2(57.46), b: t2(61.68), vo: "According to the Oil and Gas Journal, the fire was in the refinery's tank farm.",
    node: (n) => <Clip src={X} from={108.0} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.6} /> },
  { a: t2(61.68), b: t2(67.95), vo: "It engulfed two tanks holding three point six million gallons of heating oil, and three more holding lubricating oil.",
    node: (n) => <Clip src={X} from={136.5} n={n} s0={1.0} s1={1.08} fx={0.45} fy={0.55} /> },
  { a: t2(67.95), b: t2(73.85), vo: "All chemical production at the refinery was shut down ... still out of service a week later.",
    node: (n) => <Clip src={X} from={180.5} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.45} /> },
  { a: t2(73.85), b: t2(79.15), vo: "The fire burned for about fifteen hours and was out by about five in the morning on Christmas Day.",
    node: (n) => <Clip src={X} from={89.4} n={n} s0={1.0} s1={1.06} fx={0.5} fy={0.4} /> },
  { a: t2(79.15), b: t2(85.75), vo: "WAFB, the Baton Rouge station, said in a look back that the extreme cold likely built up pressure and caused the leak.",
    node: (n) => <Clip src={X} from={205.0} n={n} s0={1.02} s1={1.12} fx={0.35} fy={0.5} /> },
  { a: t2(85.75), b: t2(91.65), vo: "That's a TV station's explanation, and a published investigation finding doesn't seem to exist.",
    node: (n) => <Clip src={X} from={9.5} n={n} s0={1.12} s1={1.02} fx={0.5} fy={0.4} /> },
  { a: t2(91.65), b: t2(96.0), vo: "More than thirty five years later, there isn't much more on record than that.",
    node: (n) => <Clip src={X} from={46.5} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: t2(96.0), b: t2(102.1), vo: "Two families got the news on Christmas Eve ... who those two men were. (police close)",
    node: (n) => <Clip src={X} from={221.0} n={n} s0={1.04} s1={1.1} fx={0.5} fy={0.45} /> },
  { a: t2(102.1), b: DURS, vo: "Weather is a hazard a refinery has to plan for, and never an excuse afterwards. (the lake, every column)",
    node: (n) => <Clip src={X} from={26.5} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.45} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(t1(26.78)), kind: "glitch", len: 10 },
  { at: F(RAW[0]), kind: "blurDip", len: 12 },
  { at: F(RAW[1]), kind: "blurDip", len: 14 }, // raw -> the same flare, slowed
  { at: F(t2(49.67)), kind: "blurDip", len: 12 },
  { at: F(t2(53.62)), kind: "blurDip", len: 12 },
  { at: F(t2(79.15)), kind: "glitch", len: 10 },
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="CHRISTMAS EVE" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX></AbsoluteFill>
              </Sequence>
            );
          })}
          <Sequence from={F(DURS) - 18} layout="none"><Fade n={18} /></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw: silent camcorder -> real SFX: the fire's roar, cold wind, a deep thud on each flare */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} loop volume={(f) => dB(-10) * interpolate(f, [0, 20, F(RAW[1] - RAW[0]) - 30, F(RAW[1] - RAW[0]) - 6], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} loop volume={(f) => dB(-22) * interpolate(f, [0, 20, F(RAW[1] - RAW[0]) - 30, F(RAW[1] - RAW[0]) - 6], [0, 1, 1, 0], cl)} />
      </Sequence>
      {FLARES.map((s, i) => (
        <Sequence key={"fl" + i} from={F(RAW[0] + s - RSRC) - 3} durationInFrames={Math.min(F(4), F(RAW[1] - (RAW[0] + s - RSRC)))} layout="none">
          <Audio src={staticFile(i === 2 ? "sfx_n2/real/boom_2.wav" : "sfx_n2/real/impact_3.wav")} volume={(f) => dB(i === 2 ? -8 : -15) * interpolate(f, [F(RAW[1] - (RAW[0] + s - RSRC)) - 20, F(RAW[1] - (RAW[0] + s - RSRC)) - 4], [1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3 at -20 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(DURS - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(95)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-20) * interpolate(t, [4.0, 5.0, DURS - 1.6, DURS], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);

const Fade: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />;
};
