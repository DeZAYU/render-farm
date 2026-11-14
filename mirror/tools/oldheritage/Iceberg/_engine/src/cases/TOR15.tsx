// Tornado #15 — the Cullman–Arab EF4, Alabama, Wed 27 April 2011 (2:40–3:38 PM CDT). Channel grammar (brand.tsx) + devices built for
// THIS case's beats: PathStrip (the NWS track unrolled flat on USGS imagery, Arab -> Cullman, mile ruler), PhotoWall (Karen Lee's
// Cullman damage photographs piling onto a 3-D wall on "867 homes and 94 businesses"), Aerial on two real NWS/NOAA survey maps (the EF4
// pocket near Ruth; the EF4 core through downtown), Inset (the courthouse's own broken sign; the SPC storm-report map of the day), and
// the real SPC PDS watch text (ChipLift page). VO = one take: "This is fifteen." removed (take 5.0-6.5), split only where a raw plays.
// Footage: YARD = barn13owl (HtXmxXqjY5U, near Fairview), CLAY = David Clay (nBxAd__dFcA, Cullman, "as it was forming"), LEE = Karen Lee
// via garlan gudger (YmHcSvCxhEY, the tornado entering Cullman + her aftermath photos). Media offsets: yard = src-18, clay = src-8,
// lee = src-5. Source cuts: yard 33.18/40.60/54.67/73.32/116.97/201.8; clay 92.10/131-148/243.1; lee 36.84 then a photo every 2 s.
// Swearing in YARD (src 90.0-90.8, 97.3-98.0) is never inside a raw window.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { PathStrip } from "../dev/TOR15_PathStrip";
import { PhotoWall } from "../dev/TOR15_PhotoWall";
import { WatchCrawl } from "../dev/TOR15_WatchCrawl";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", SH = C + "shots/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(152.0);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const Y = (s: number) => s - 18, CY = (s: number) => s - 8, LE = (s: number) => s - 5;

const WALL = ["l02", "l03", "l05", "l06", "l07", "l08", "l13", "l14", "l15", "l16", "l19", "l21", "l22", "l23", "l24", "l26", "l27", "l28", "l30", "l31",
  "l33", "l36", "l37", "l38", "l39", "l40", "l41", "l44", "l47", "l50", "l53", "l55", "l04", "l09", "l10", "l11", "l12", "l17", "l18", "l20"].map((n) => GR + n + ".jpg");

const SHOTS: Sh[] = [
  // VO-A (t 4.0): "Back to the 27th of April 2011, about two and a half hours before Tuscaloosa."
  { a: 4.0, b: 9.0, vo: "Back to the 27th of April 2011 (CLAY: the lowering over the Cullman warehouses; date)", src: "clay.mp4", from: CY(10.0), s0: 1.2, s1: 1.26, fx: 0.5, fy: 0.85,
    over: <RedLabel text="APRIL 27, 2011" at={F(0.5)} hold={F(3.6)} /> },
  // VO-B (t 9.25)
  { a: 9.0, b: 10.9, vo: "It formed at 2:40. (CLAY: the funnel coming down)", src: "clay.mp4", from: CY(40.0), s0: 1.12, s1: 1.16, fx: 0.62, fy: 0.6, punches: [{ at: 14, to: 1.12, len: 18 }] },
  { a: 10.9, b: 14.0, vo: "Minutes later it was crossing the countryside near Fairview in Cullman County, Alabama, (YARD: over the trees)", src: "yard.mp4", from: Y(41.3), s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.45,
    over: <RedLabel text="NEAR FAIRVIEW, ALABAMA" at={F(0.6)} hold={F(2.2)} /> },
  { a: 14.0, b: 17.15, vo: "with houses all around it. (YARD: the house next door)", src: "yard.mp4", from: Y(20.0), s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  // RAW 1 (17.15-34.35): "major tornado on the ground ... it's going right to his mom's ... major tornado in Fairview, Alabama"
  { a: 17.15, b: 34.35, vo: "RAW 1 YARD 55.4-72.6", src: "yard.mp4", from: Y(55.4), s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.45 },
  // VO-C (t 34.6): "North of Fairview it strengthened very quickly and destroyed two well-built homes."
  { a: 34.35, b: 36.6, vo: "North of Fairview it strengthened very quickly (YARD, muted)", src: "yard.mp4", from: Y(76.0), s0: 1.14, s1: 1.2, fx: 0.55, fy: 0.42 },
  { a: 36.6, b: 39.15, vo: "and destroyed two well-built homes. (YARD: it widens over the houses, muted)", src: "yard.mp4", from: Y(84.0), s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  // RAW 2 (39.15-54.95): "no, no, no ... don't hit mom's ... oh my God"
  { a: 39.15, b: 54.95, vo: "RAW 2 YARD 118.0-133.8", src: "yard.mp4", from: Y(118.0), s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.45 },
  // VO-D (t 54.95) "And it hasn't finished growing." (3 Nov: its wind-only raw 3 removed, the line runs on into VO-E)
  { a: 54.95, b: 56.65, vo: "And it hasn't finished growing. (YARD, muted)", src: "yard.mp4", from: Y(158.3), s0: 1.08, s1: 1.03, fx: 0.5, fy: 0.45 },
  // VO-E (t 64.65): "Even while it was still forming, it had a debris cloud churning at its base."
  { a: 56.65, b: 60.75, vo: "Even while it was still forming, it had a debris cloud churning at its base. (CLAY: on the ground)", src: "clay.mp4", from: CY(57.0), s0: 1.1, s1: 1.18, fx: 0.62, fy: 0.62 },
  // RAW 4 (68.75-84.35): "it's coming round the side ... it's hitting that house ... look at all the crap in the air"
  { a: 60.75, b: 76.35, vo: "RAW 4 CLAY 94.0-109.6", src: "clay.mp4", from: CY(94.0), s0: 1.02, s1: 1.07, fx: 0.55, fy: 0.55 },
  // VO-F (t 84.35): "It went on to Arab, in Marshall County, which is why it's known as the Cullman and Arab tornado."
  { a: 76.35, b: 81.55, vo: "Arab ... the Cullman and Arab tornado (PathStrip: Arab -> Cullman on the NWS track)",
    node: <PathStrip src={GR + "track.jpg"} iw={2560} ih={1792} a={[262.0, 1583.0]} b={[2129.7, 166.5]} miles={47}
      towns={[{ name: "ARAB, MARSHALL COUNTY", p: [1758.7, 693.7], at: F(0.8), hold: F(2.4) }, { name: "CULLMAN", p: [745.7, 1234.3], at: F(3.5) }]}
      cam={[{ at: 0, u: 0.74, k: 1.25 }, { at: F(1.2), u: 0.72, k: 1.2 }, { at: F(3.6), u: 0.49, k: 0.82 }, { at: F(5.2), u: 0.48, k: 0.78 }]} /> },
  // VO-G (t 95.95): "EF4, up to a hundred and ninety near Ruth, almost forty-seven miles long. Then Cullman itself."
  { a: 81.55, b: 86.9, vo: "EF4, up to 190 near Ruth, almost 47 miles long (NWS survey contour map: the EF4 pocket by Ruth)",
    node: <Aerial src={GR + "contour.jpg"} iw={1085} ih={810} spot={[945, 98, 1068, 186]} z0={1.0} z1={1.3} label="RUTH" boxAt={F(1.6)} labelAt={F(2.0)} /> },
  // "Then Cullman itself." over CLAY, running straight into RAW 6 (102.75-109.15, 6.4 s to the clip end): "it's tearing up Cullman right now"
  { a: 86.9, b: 94.75, vo: "Then Cullman itself. + RAW 6 CLAY 205.5-211.9", src: "clay.mp4", from: CY(204.05), s0: 1.06, s1: 1.14, fx: 0.55, fy: 0.55 },
  // VO-H (t 107.35 = take 36.75)
  { a: 94.75, b: 97.0, vo: "Middle of a Wednesday afternoon, people at work, (LEE: the tornado coming into Cullman)", src: "lee.mp4", from: LE(9.0), s0: 1.22, s1: 1.28, fx: 0.42, fy: 0.5 },
  { a: 97.0, b: 99.4, vo: "and downtown took a direct hit. (NOAA survey: the EF4 core through downtown)",
    node: <Aerial src={GR + "dtmap.jpg"} iw={777} ih={552} spot={[330, 150, 540, 325]} z0={1.0} z1={1.18} label="DOWNTOWN CULLMAN" boxAt={F(0.3)} labelAt={F(0.6)} /> },
  { a: 99.4, b: 101.4, vo: "Christ Lutheran Church collapsed, (Karen Lee photo: downtown, a building gone)", src: GR + "l51.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.62, fy: 0.45 },
  { a: 101.4, b: 105.7, vo: "and the Busy Bee Café was destroyed, reopening exactly a year later. (Karen Lee: a storefront)", src: GR + "l56.jpg", still: true, s0: 1.12, s1: 1.03, fx: 0.5, fy: 0.5 },
  { a: 105.7, b: 108.8, vo: "The courthouse (its own sign, letters gone)",
    src: GR + "l67.jpg", still: true, s0: 1.02, s1: 1.14, fx: 0.5, fy: 0.42, over: <RedLabel text="CULLMAN COUNTY COURTHOUSE" at={8} /> },
  { a: 108.8, b: 111.7, vo: "and the emergency management building were both hit, just as Tuscaloosa's would be a few hours later.", src: GR + "l63.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.55 },
  { a: 111.7, b: 117.4, vo: "867 homes and 94 businesses in the city were left damaged or in ruins. (PhotoWall)",
    node: <PhotoWall pics={WALL} cols={8} rows={5} first={4} last={F(3.9)} /> },
  { a: 117.4, b: 119.7, vo: "Almost two hundred power poles were levelled.", src: GR + "l34.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 119.7, b: 122.8, vo: "The city had about thirteen and a half million dollars of damage,", src: GR + "l58.jpg", still: true, s0: 1.1, s1: 1.03, fx: 0.55, fy: 0.55 },
  { a: 122.8, b: 126.3, vo: "and the state later gave it almost six million for recovery. (NWS: EF4 damage downtown)", src: GR + "ef4dt.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.55 },
  { a: 126.3, b: 129.1, vo: "The whole tornado lasted fifty-eight minutes. (YARD: the tornado over the field)", src: "yard.mp4", from: Y(148.0), s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 129.1, b: 131.9, vo: "Six people lost their lives, (NWS survey: a home wiped to the slab on this track)", src: GR + "nws3086.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 131.9, b: 134.6, vo: "five of them one family in Ruth whose well-built home was levelled. (NWS survey)", src: GR + "nws3091.jpg", still: true, s0: 1.1, s1: 1.04, fx: 0.4, fy: 0.5 },
  { a: 134.6, b: 140.5, vo: "That day was the most violent ... since the 1974 Super Outbreak. (SPC: every report of the day)",
    node: <Inset src={GR + "rpts.jpg"} still box={0.56} ar={582 / 408} drift={0.08} label="APRIL 27, 2011" labelAt={14} /> },
  { a: 140.5, b: 144.4, vo: "On almost any other day, this is the tornado everyone would remember. (the widest moment again, slow)", src: "yard_replay.mp4", from: 0.2, s0: 1.06, s1: 1.16, fx: 0.5, fy: 0.45 },
  { a: 144.4, b: 152.0, vo: "A PDS tornado watch had gone out for northern Alabama at 1:45 that afternoon. (SPC watch 235)", node: <WatchCrawl bg={GR + "clay.mp4"} bgFrom={CY(10.0)} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(17.15), kind: "blurDip", len: 12 },
  { at: F(34.35), kind: "blurDip", len: 12 },
  { at: F(36.6), kind: "blurDip", len: 10 },
  { at: F(39.15), kind: "blurDip", len: 12 },
  { at: F(54.95), kind: "blurDip", len: 12 },
  { at: F(60.75), kind: "blurDip", len: 12 },
  { at: F(76.35), kind: "glitch", len: 10 },
  { at: F(81.55), kind: "blurDip", len: 10 },
  { at: F(111.7), kind: "zoomHit", len: 10 },
  { at: F(134.6), kind: "whip", len: 10 },
  { at: F(140.5), kind: "blurDip", len: 12 },
  { at: F(144.4), kind: "glitch", len: 10 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

// VO parts: [edit t, take start, take end]
// 3 Nov: raws 3 + 5 removed (VO-D+E and VO-F+G now run straight on), raw 6 lengthened 4.6 -> 6.4 s
const VO: [number, number, number][] = [[4.0, 0.0, 5.0], [9.25, 6.5, 14.4], [34.6, 14.4, 18.95], [54.95, 18.95, 24.75],
  [76.35, 24.75, 36.75], [94.75, 36.75, 93.29]];
// raw sound: [edit a, edit b, media file, media start, gain dB]
const RAW: [number, number, string, number, number][] = [
  [17.15, 34.35, "yard_clean.wav", Y(55.4), -2], [39.15, 54.95, "yard_clean.wav", Y(118.0), -2],
  [60.75, 76.35, "clay_clean.wav", CY(94.0), -1], [88.35, 94.75, "clay_clean.wav", CY(205.5), -1],
];
// music (Music 4, Epidemic ambient) plays only under the VO, picking up where it left off
const MUS: [number, number, number][] = [[3.8, 17.4, -22.5], [34.3, 39.4, -22.5], [54.7, 61.0, -22.5], [76.1, 88.6, -22.5], [94.5, 152.0, -22.5]];
const MUS_AT = MUS.reduce<number[]>((acc, m, i) => { acc.push(i === 0 ? 2 : acc[i - 1] + (MUS[i - 1][1] - MUS[i - 1][0])); return acc; }, []);

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [76.3, "sfx_n2/glitch_01.wav", -27],
  [76.6, "sfx_n2/whoosh_03.wav", -30],
  [81.55, "sfx_n2/whoosh_01.wav", -31],
  [97.0, "sfx_n2/whoosh_02.wav", -32],
  [111.7, X + "paper_2.wav", -30],
  [113.0, X + "paper_3.wav", -32],
  [114.4, X + "page_turn_1.wav", -33],
  [134.6, "sfx_n2/whoosh_02.wav", -30],
  [144.35, "sfx_n2/glitch_01.wav", -28],
  [144.6, X + "static_1.wav", -31],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="DOWNTOWN ON A WEDNESDAY AFTERNOON" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([t, a, b], i) => <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE15.mp3")} startFrom={F(a)} /></Sequence>)}
      {RAW.map(([a, b, m, s, g], i) => { const n = F(b) - F(a); return (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile(MD + m)} startFrom={Math.round(s * 30)} volume={(f) => dB(g) * interpolate(f, [0, 6, n - 20, n - 1], [0, 1, 1, 0], cl)} />
        </Sequence>); })}
      {MUS.map(([a, b, g], i) => { const n = F(b) - F(a); return (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(MUS_AT[i])} volume={(f) => dB(g) * interpolate(f, [0, 12, n - 24, n], [0, 1, 1, 0], cl)} />
        </Sequence>); })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
