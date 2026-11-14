// Natural Disasters #9 — The inland tsunami, Toowoomba (10 Jan 2011). Footage: the office window over East Creek (twb, its filmers'
// voices), the corner of Herries & Kitchener Streets (her), the torrent past the Repco store (owr), a Rockville back yard and carport (rck);
// stills from the day (Long & Mackenzie Streets 2:35 PM) and after (CBD, 13 Jan) by Timothy Swinson (CC BY 2.0), and Queensland State
// Archives' "If it's flooded, forget it" crossing (public domain). Devices for this case's beats: RangePlate (Sentinel-2: the city on the
// range edge; then Lockyer Creek traced down the valley to Grantham), Hydrograph (8 m in 23 min at the Lockyer gauge), AfternoonRule
// (1:50 call, 2:30 rain stops). VO = one take, split only at the raws. For her / owr / rck the VO line about the place plays over the start
// of that same camera and its raw follows on without a cut (the clip's sound comes in only when the VO has finished).
// Source cuts: twb 23-24, 54-56, 61, 66-67, 111, 113, 119-127, 131-133, 141-156, 164, 172-179, 187-191, 199, 224, 229, 237-246, 297,
// 310-311, 331-353; her 4-7 (title card 0-5 never used), 11, 25-29, 49, 61, 74, 86; owr 46; rck none. owr's swearing (51-53) is never used.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { RangeEdge, ValleyRun } from "../dev/ND09_RangePlate";
import { Hydrograph } from "../dev/ND09_Hydrograph";
import { AfternoonRule } from "../dev/ND09_AfternoonRule";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, GAP = 0.25;

type Raw = { src: string; a: number; b: number };
// 3 Nov owner rule (raws only at the incident): kept = the cars by the creek, 'they're all moving', 'they're going under!', the carport.
// The six raws after the inland-tsunami / flash-flood / hollow-box / driver explanation or repeating the brown street are cut and their
// VO parts merged (was 11 parts / 10 raws); that VO runs on over silent footage.
const VO: [number, number][] = [[0, 25.75], [25.75, 35.95], [35.95, 91.0], [91.0, 98.6], [98.6, 165.32]];
const RAWS: (Raw | null)[] = [
  { src: "twb", a: 11.2, b: 22.8 },    // cars parked beside the creek, the water coming up
  { src: "twb", a: 26.0, b: 53.8 },    // "That's coming fast … should we move our cars … they're all moving"
  { src: "owr", a: 8.15, b: 30.0 },    // past the Repco store: "they're going under!"
  { src: "rck", a: 43.1, b: 61.0 },    // under the carport
  null,
];
const voStart: number[] = [], rawStart: number[] = [];
let T = TITLE;
VO.forEach(([a, b], i) => { voStart.push(T); T += b - a; rawStart.push(T); const r = RAWS[i]; if (r) T += r.b - r.a + GAP; });
export const DUR = F(T + 2.6);
const V = (t: number) => { for (let i = VO.length - 1; i >= 0; i--) if (t >= VO[i][0] - 1e-6) return voStart[i] + (t - VO[i][0]); return TITLE; };

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const ST = (n: string) => GR + n + ".jpg";
const VS: Sh[] = [
  { a: 0, b: 11.54, vo: "How does a city sitting nearly seven hundred metres up, on top of the Great Dividing Range, end up flooding? That's Toowoomba, in Queensland, and by January 2011 it had been raining for weeks. (RangeEdge)",
    node: <RangeEdge src={ST("lockyer")} city={[700, 1245]} edgeAt={F(2.4)} edgeLen={F(2.4)} cityAt={F(6.1)} rangeLabel="GREAT DIVIDING RANGE" cityLabel="TOOWOOMBA, QUEENSLAND"
      edge={[[757, 317], [827, 580], [775, 790], [880, 985], [915, 1230], [880, 1495], [740, 1760], [700, 2000]]} /> },
  { a: 11.54, b: 15.4, vo: "A strong La Niña had been soaking eastern Australia for months. (rain on the street, Herries St)", src: "her", from: 12.0, s0: 1.04, s1: 1.1 },
  { a: 15.4, b: 25.75, vo: "On Monday the 10th, more than 160 mm fell in 36 hours … Along East Creek, cars are parked where they always are. (runs on into R1)", src: "twb", from: 0.85, s0: 1.03, s1: 1.1,
    over: <RedLabel text="JANUARY 10, 2011" at={F(0.5)} hold={F(3.4)} /> },
  // V1
  { a: 25.75, b: 30.46, vo: "Then about sixty millimetres fell in half an hour, right in the middle of the lunch break.", src: "her", from: 20.0, s0: 1.04, s1: 1.1 },
  { a: 30.46, b: 33.53, vo: "Soil that saturated stops soaking anything up. (water over the lawn)", src: "rck", from: 30.0, s0: 1.04, s1: 1.1 },
  { a: 33.53, b: 35.95, vo: "Every drop runs straight off into the creeks.", src: "twb", from: 56.8, s0: 1.05, s1: 1.1 },
  // V2
  { a: 35.95, b: 38.63, vo: "People started calling it an inland tsunami.", src: "twb", from: 62.0, s0: 1.04, s1: 1.1 },
  { a: 38.63, b: 42.0, vo: "The creek runs through the middle of town, (Long and Mackenzie Streets, 2:35 PM that day)", src: ST("longmack"), still: true, s0: 1.3, s1: 1.42, fx: 0.62, fy: 0.62 },
  { a: 42.0, b: 45.5, vo: "and because the city sits on a range, the water has gravity behind it all the way down.", src: "rck", from: 72.0, s0: 1.04, s1: 1.1 },
  // V3
  { a: 45.5, b: 48.98, vo: "A flash flood is defined by speed, not size.", src: "rck", from: 80.0, s0: 1.04, s1: 1.1 },
  { a: 48.98, b: 53.85, vo: "It arrives within about six hours of the rain that causes it, and often much faster.", src: "twb", from: 134.0, s0: 1.04, s1: 1.1 },
  // V4
  { a: 53.85, b: 57.23, vo: "A parked car feels safe because it isn't going anywhere.", src: "twb", from: 164.8, s0: 1.04, s1: 1.1 },
  { a: 57.23, b: 59.7, vo: "It's really a hollow box on four tyres,", src: "twb", from: 174.8, s0: 1.08, s1: 1.14 },
  { a: 59.7, b: 62.02, vo: "and once water gets underneath, it floats.", src: "twb", from: 187.7, s0: 1.06, s1: 1.12 },
  { a: 62.02, b: 66.8, vo: "Queensland has a road safety line for exactly this. If it's flooded, forget it. (QSA: a flooded crossing)",
    node: <Inset src={ST("forget")} still box={0.4} ar={1832 / 1880} drift={0.08} /> },
  // V5-V9: the VO plays over the start of the place's own camera; the raw continues it
  { a: 66.8, b: 75.8, vo: "A few streets away … Herries and Kitchener Streets. What caught people out … from normal to this.", src: "her", from: 29.8, s0: 1.02, s1: 1.04,
    over: <RedLabel text="HERRIES & KITCHENER STREETS" at={F(1.6)} hold={F(3.6)} /> },
  { a: 75.8, b: 84.85, vo: "Every driver here is deciding whether the water is shallow enough … you can't see how fast it's moving underneath.", src: "her", from: 49.8, s0: 1.02, s1: 1.04 },
  { a: 84.85, b: 91.0, vo: "Down by a Repco store, a block from the city centre, the water was already racing past the shops.", src: "owr", from: 2.0, s0: 1.02, s1: 1.04 },
  { a: 91.0, b: 96.5, vo: "Out in Rockville, at about a quarter past two that afternoon, it was coming through back yards.", src: "rck", from: 0.8, s0: 1.02, s1: 1.03,
    over: <RedLabel text="ROCKVILLE, 2:15 PM" at={F(1.0)} hold={F(3.6)} /> },
  { a: 96.5, b: 98.6, vo: "And here, under a carport.", src: "rck", from: 41.0, s0: 1.02, s1: 1.03 },
  // V10: the warning, the gauge, the afternoon, the valley, the toll
  { a: 98.6, b: 102.43, vo: "The weather bureau had put out a general severe weather warning that morning.", src: "twb", from: 113.8, s0: 1.04, s1: 1.1 },
  { a: 102.43, b: 110.18, vo: "Upstream, a gauge on Lockyer Creek … eight metres in 23 minutes … a faulty gauge. (Hydrograph)",
    node: <Hydrograph bg={GR + "twb.mp4"} bgFrom={300.0} riseAt={F(1.0)} riseLen={F(4.0)} deadAt={F(6.0)} label="LOCKYER CREEK GAUGE" /> },
  { a: 110.18, b: 116.34, vo: "Donna Rice got through to police at ten to two, and by half past two the rain over Toowoomba had stopped. (AfternoonRule)",
    node: <AfternoonRule bg={GR + "twb.mp4"} bgFrom={320.0} events={[{ m: 50, label: "CALL TO POLICE", at: F(1.8) }, { m: 90, label: "RAIN STOPS", at: F(3.4) }]} /> },
  { a: 116.34, b: 117.61, vo: "The water hadn't.", src: "twb", from: 229.8, s0: 1.06, s1: 1.1 },
  { a: 117.61, b: 120.8, vo: "Of about 1,500 triple zero calls made that afternoon,", src: "twb", from: 288.0, s0: 1.04, s1: 1.1 },
  { a: 120.8, b: 123.97, vo: "around 400 went unanswered.", src: "owr", from: 40.0, s0: 1.04, s1: 1.1 },
  { a: 123.97, b: 136.13, vo: "The water kept going downhill into the Lockyer Valley … The surge reached Grantham at about a quarter to four … (ValleyRun)",
    node: <ValleyRun src={ST("lockyer")} at={F(0.6)} len={F(7.3)} startLabel="TOOWOOMBA" endLabel="GRANTHAM, 3:45 PM"
      creek={[[720, 1150], [827, 845], [986, 880], [1162, 933], [1338, 986], [1443, 1091], [1584, 1144], [1725, 1232], [1848, 1302], [1971, 1338], [2165, 1355]]} /> },
  { a: 136.13, b: 139.48, vo: "In Toowoomba, four people lost their lives within hours. (the CBD three days later)", src: ST("cbd4"), still: true, s0: 1.06, s1: 1.14 },
  { a: 139.48, b: 144.28, vo: "Two of them were Donna Rice and her son Jordan, caught in their car in the floodwater.", src: "her", from: 75.0, s0: 1.04, s1: 1.08 },
  { a: 144.28, b: 150.74, vo: "Jordan told rescuers to take his younger brother Blake first … Australian Bravery Medal. (rescue crews in the water)", src: "twb", from: 274.8, s0: 1.04, s1: 1.1 },
  { a: 150.74, b: 155.5, vo: "Across the Queensland floods that summer the death toll passed thirty, (the CBD cleanup)", src: ST("cbd22"), still: true, s0: 1.05, s1: 1.13, fx: 0.6 },
  { a: 155.5, b: 158.93, vo: "and the inquiry afterwards made 177 recommendations. (the cars left piled up)", src: "twb", from: 331.8, s0: 1.04, s1: 1.1 },
  { a: 158.93, b: 165.32, vo: "Of every place in these nineteen, a city on top of a mountain range is the last one most people would guess.", src: "twb", from: 311.5, s0: 1.03, s1: 1.1 },
];
const SHOTS: Sh[] = [
  ...VS.map((s) => ({ ...s, a: V(s.a), b: s.b >= 165.32 ? T + 2.6 : V(s.b) })),
  ...(RAWS.map((r, i) => r && ({ a: rawStart[i], b: rawStart[i] + r.b - r.a + GAP, vo: "RAW " + r.src, src: r.src, from: r.a, s0: r.src !== "twb" ? 1.04 : 1.02, s1: r.src !== "twb" ? 1.08 : 1.06 } as Sh)).filter(Boolean) as Sh[]),
].sort((x, y) => x.a - y.a);
// the raws hold their last frames through the 0.25 s breath (b includes GAP) — the next shot starts with the VO

export const CUTS: FxCut[] = [
  { at: F(TITLE), kind: "glitch", len: 10 },
  { at: F(V(11.54)), kind: "glitch", len: 8 },             // out of the plate
  { at: F(rawStart[1]), kind: "blurDip", len: 12 },         // twb 56.8 -> twb 26.0
  { at: F(V(35.95)), kind: "blurDip", len: 10 },            // twb raw -> twb 62
  { at: F(V(48.98)), kind: "blurDip", len: 10 },
  { at: F(V(53.85)), kind: "blurDip", len: 10 },
  { at: F(V(57.23)), kind: "blurDip", len: 10 },
  { at: F(V(59.7)), kind: "blurDip", len: 10 },
  { at: F(V(62.02)), kind: "whip", len: 10 },
  { at: F(V(66.8)), kind: "blurDip", len: 12 },
  { at: F(V(75.8)), kind: "blurDip", len: 12 },
  { at: F(V(84.85)), kind: "glitch", len: 8 },
  { at: F(V(91.0)), kind: "glitch", len: 8 },
  { at: F(V(96.5)), kind: "blurDip", len: 10 },             // rck -> rck carport
  { at: F(V(98.6)), kind: "glitch", len: 10 },              // section: the warnings
  { at: F(V(102.43)), kind: "blurDip", len: 12 },
  { at: F(V(116.34)), kind: "blurDip", len: 10 },
  { at: F(V(123.97)), kind: "glitch", len: 8 },
  { at: F(V(136.13)), kind: "blurDip", len: 12 },
  { at: F(V(144.28)), kind: "blurDip", len: 10 },
  { at: F(V(155.5)), kind: "blurDip", len: 10 },
  { at: F(V(158.93)), kind: "blurDip", len: 14 },
];

export const ALLOW = CUTS.filter((c) => c.kind !== "hard").map((c) => `${(c.at / 30 - 0.3).toFixed(2)}-${(c.at / 30 + 0.5).toFixed(2)}`).join(",");

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src! + ".mp4";
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [TITLE + 0.2, X + "rain_9.wav", -30],
  [V(11.5), "sfx_n2/glitch_01.wav", -30],
  [V(62.0), "sfx_n2/whoosh_02.wav", -30],
  [V(62.1), X + "camera_shutter_2.wav", -28],
  [V(98.55), "sfx_n2/glitch_03.wav", -28],
  [V(102.45), "sfx_n2/whoosh_01.wav", -31],
  [V(123.95), "sfx_n2/glitch_02.wav", -29],
];

// music: Epidemic ambient Music 5 (-20.9 LUFS file -> -13 dB); under the VO only, out under every raw (they all carry their own sound)
const MUS: [number, number, number][] = VO.map(([a, b], i) => [voStart[i] - 0.3, voStart[i] + (b - a) + 0.9, (i * 23) % 60] as [number, number, number]);
MUS[MUS.length - 1][1] = T + 2.6;

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="THE INLAND TSUNAMI" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={Math.max(1, F(s.b) - F(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b], i) => (
        <Sequence key={"v" + i} from={F(voStart[i])} durationInFrames={F(b - a) + 2} layout="none"><Audio src={staticFile("vor/CASE09.mp3")} startFrom={F(a)} endAt={F(b)} /></Sequence>
      ))}
      {RAWS.map((r, i) => {
        if (!r) return null; const len = r.b - r.a;
        return (
          <Sequence key={"r" + i} from={F(rawStart[i])} durationInFrames={F(len)} layout="none">
            <Audio src={staticFile(MD + r.src + "_clean.wav")} startFrom={F(r.a)} volume={(f) => dB(-1) * interpolate(f, [0, 8, F(len) - 18, F(len) - 3], [0, 1, 1, 0], cl)} />
          </Sequence>
        );
      })}
      {MUS.map(([a, b, off], i) => (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b - a)} layout="none">
          <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(off)} loop volume={(f) => dB(-13) * interpolate(f, [0, 12, F(b - a) - 24, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
