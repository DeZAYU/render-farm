// Theme Park #3 — the Zipper jams, St. John the Beloved carnival, Wilmington, Delaware (6 June 2023). Channel grammar (brand.tsx: TitleCard,
// RedLabel, Aerial, Inset) + devices built for this case: ZipperBoard (what a Zipper is, on Commons photos of other Zippers: the boom line
// swinging end over end, the cages' own pivots), InspectionCalendar (May/June 2023 grids, the paperwork days boxed, the jam day red, the
// 4-day gap measured), NightClock (9:30 PM -> about 12:30 AM swept on a clock face).
// Footage: zm = sONvBtlm818 (fmartinjr, 33 min fire-scene video, live scene sound + radio). Its "fmartinjr" watermark sits fixed at
// x520-780 y880-1035 -> delogo'd before the grade. Only the windows used were cut out (tp03_zmsel.mp4, map below; every window sits between
// the source's own cuts, which are dense under the flashing emergency lights). zx = TXQw3UOb9ws (looking up into the jammed frame).
// Raw sound = rawclean'd (music stripped) tracks, never the clips' own audio. VO one take (no count word), split only at the 7 raws.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { ZipperBoard } from "../dev/TP03_ZipperBoard";
import { InspectionCalendar } from "../dev/TP03_InspectionCalendar";
import { BoomHours } from "../dev/TP03_BoomHours";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", AS = C + "assets/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DUR = F(224.5);

// source window [a, b] of the 33-min video -> offset in tp03_zmsel.mp4
const MAP: [number, number, number][] = [[96.1, 101.6, 0.0], [104, 108.5, 5.5], [180, 184.5, 10.0], [197, 201.5, 14.5], [300, 304.5, 19.0], [344, 348.5, 23.5], [545, 552.5, 28.0], [655, 659.5, 35.5], [715, 719.5, 40.0], [900, 905.5, 44.5], [948, 955.5, 50.0], [1008, 1013.5, 57.5], [1060, 1066.5, 63.0], [1100.5, 1112.3, 69.5], [1124, 1127, 81.3], [1140, 1150.5, 84.3], [1199, 1205.5, 94.8], [1217, 1223.5, 101.3], [1237, 1242.5, 107.8], [1249, 1256.5, 113.3], [1282, 1287.5, 120.8], [1319.5, 1330.5, 126.3], [1333, 1338.5, 137.3], [1424.5, 1432.5, 142.8], [1447.5, 1459.5, 150.8], [1469, 1474.5, 162.8], [1487.5, 1492.5, 168.3], [1621.3, 1631.5, 173.3], [1698, 1706, 183.5], [1737.2, 1747.4, 191.5], [1869, 1874.5, 201.7], [1889, 1895.5, 207.2], [1954, 1959.5, 213.7]];
const Z = (s: number) => { const m = MAP.find(([a, b]) => s >= a - 1e-6 && s < b); if (!m) throw new Error(`TP03: source ${s} not in the selection`); return m[2] + (s - m[0]); };

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const zm = (a: number, b: number, vo: string, src: number, s0 = 1.03, s1 = 1.09, fx = 0.5, fy = 0.5, over?: React.ReactNode): Sh => ({ a, b, vo, src: "tp03_zm.mp4", from: Z(src), s0, s1, fx, fy, over });

// VO parts [take a, take b, timeline at]
const VO: [number, number, number][] = [[0, 16.1, 4.0], [16.5, 48.0, 31.99], [48.6, 62.7, 74.1], [63.3, 70.0, 100.26], [70.6, 100.85, 118.11], [101.4, 116.7, 158.67], [117.25, 124.6, 186.09], [125.4, 145.5, 203.82]];
// raws: [timeline a, b, source s, which clip]  (cut sheet order: ZM 18:28, ZM 19:00, ZX 0:03, ZM 22:00, ZM 27:00, ZM 24:09, ZM 28:30)
const RAWS: [number, number, number, "zm" | "zx"][] = [[20.1, 31.9, 1100.5, "zm"], [63.9, 74.0, 1140.0, "zm"], [88.2, 100.2, 3.5, "zx"], [107.4, 118.0, 1319.5, "zm"], [148.8, 158.6, 1621.3, "zm"], [174.4, 186.0, 1447.5, "zm"], [193.5, 203.7, 1737.2, "zm"]];

const SHOTS: Sh[] = [
  { a: 4.0, b: 9.0, vo: "St. John the Beloved Church, on Milltown Road in Wilmington, Delaware, holds a carnival every year. (NAIP: the parish grounds)",
    node: <Aerial src={GR + "tp03_naip.jpg"} iw={2400} ih={1600} spot={[880, 480, 1480, 1140]} z0={1.0} z1={1.22} label="ST. JOHN THE BELOVED, WILMINGTON, DELAWARE" boxAt={10} labelAt={20} /> },
  zm(9.0, 12.5, "On Tuesday the 6th of June 2023,", 96.5, 1.03, 1.08, 0.5, 0.5, <RedLabel text="JUNE 6, 2023" at={F(0.8)} hold={F(2.5)} />),
  zm(12.5, 16.4, "at about half past nine at night, the carnival's Zipper stopped dead.", 180.2, 1.04, 1.12, 0.5, 0.4),
  zm(16.4, 20.1, "People were inside, and the ride couldn't let any of them off at ground level.", 197.2, 1.06, 1.14, 0.5, 0.35),
  // RAW 1 20.1-31.9: the jammed cages close, the scene's own sound
  zm(20.1, 31.9, "RAW zm 1100.5-1112.3", 1100.54, 1.0, 1.05),
  { a: 31.9, b: 38.2, vo: "A Zipper is a long boom that turns end over end. Cages hang along it, and they flip on their own as it turns. (ZipperBoard, Commons)",
    node: <ZipperBoard bg={GR + "tp03_zipnight.jpg"} swingAt={F(1.6)} moveAt={F(3.3)} pivAt={F(4.7)}
      a={{ src: GR + "tp03_zipnight.jpg", iw: 1920, ih: 1440, hub: [1005, 585], end: [1406, 375] }}
      b={{ src: GR + "tp03_zipchance.jpg", iw: 1920, ih: 1440, pivots: [[1009, 274], [1037, 476], [994, 677], [954, 865]] }} /> },
  zm(38.2, 41.0, "It folds onto a trailer, which is why it turns up", 715.3, 1.03, 1.09),
  zm(41.0, 44.0, "at county fairs and church carnivals all over America.", 344.2, 1.03, 1.08),
  { a: 44.0, b: 47.5, vo: "Here, one cage had come down on top of the cage below. (Inset: the two cages)",
    node: <Inset src={GR + "tp03_zm.mp4"} from={Z(1124.2)} box={0.6} pos="50% 45%" drift={0.1} /> },
  zm(47.5, 52.0, "CBS News Philadelphia reported that some bolts appeared to have loosened.", 1199.3, 1.08, 1.18, 0.45, 0.45),
  zm(52.0, 56.8, "Treat that as an early report from the scene, because the fire marshal was still working it out.", 1282.2),
  zm(56.8, 60.8, "Either way, the normal fix was off the table.", 1424.7, 1.03, 1.1, 0.5, 0.4),
  zm(60.8, 63.9, "You can't turn the boom to bring the cages down when the boom is the part that failed.", 1869.2, 1.05, 1.1, 0.5, 0.4),
  // RAW 2 63.5-74.0: the cages at height, radio traffic
  zm(63.9, 74.0, "RAW zm 1140-1150.5", 1140.0, 1.0, 1.05),
  zm(74.0, 80.0, "Mill Creek Fire Company already had a crew at the carnival for first-aid cover, and it called up its own high-angle team.", 948.2),
  zm(80.0, 84.5, "Three aerial ladders came in, with high-angle teams from Christiana,", 545.2, 1.03, 1.08),
  zm(84.5, 88.2, "Brandywine Hundred, Cranston Heights and the City of Wilmington among others.", 1889.2, 1.04, 1.1),
  // RAW 3 88.2-100.2: zx, looking up into the frame at the wedged cages
  { a: 88.2, b: 100.2, vo: "RAW zx 3.5-15.5", src: "tp03_zx.mp4", from: 3.5, s0: 1.0, s1: 1.06 },
  zm(100.2, 103.6, "Down at the base, New Castle County paramedics waited", 300.2, 1.03, 1.08),
  zm(103.6, 107.4, "alongside ambulance crews from Mill Creek, Belvedere and Five Points.", 900.2, 1.03, 1.08),
  // RAW 4 107-118: close shots of the jammed cages
  zm(107.4, 118.0, "RAW zm 1319.5-1330.5", 1319.5, 1.0, 1.05),
  { a: 118.0, b: 129.5, vo: "passed a safety inspection on the 24th of May ... certified it on the 2nd of June. That was four days before it jammed. (InspectionCalendar)",
    node: <InspectionCalendar bg={GR + "tp03_zm.mp4"} bgFrom={Z(1250)} marks={[{ m: 0, d: 24, at: F(2.3) }, { m: 1, d: 2, at: F(7.9) }, { m: 1, d: 6, at: F(9.2), fill: true }]}
      span={{ from: { m: 1, d: 2, at: 0 }, to: { m: 1, d: 6, at: 0 }, at: F(9.6), label: "4 DAYS" }} /> },
  zm(129.5, 134.5, "The paperwork also showed an inspection in April 2022 after what was described as a total rebuild.", 1487.53, 1.03, 1.1),
  zm(134.5, 138.5, "All of which sounds reassuring until you think about what a carnival ride actually goes through.", 1954.2, 1.03, 1.08),
  { a: 138.5, b: 144.5, vo: "It gets built up, run, taken apart and trucked somewhere new every few days. (another Zipper, Commons, full-frame push: the Inset is used once, at 44.0)",
    node: <StillPush src={GR + "tp03_zipchance.jpg"} label="A ZIPPER AT ANOTHER FAIR" /> },
  zm(144.5, 148.8, "A pass only tells you it was fine on the day somebody looked.", 1698.2, 1.04, 1.1),
  // RAW 5 148.4-158.6: the boom with cages at height, a ladder alongside
  zm(148.8, 158.6, "RAW zm 1621.3-1631.5", 1621.3, 1.0, 1.05),
  zm(158.6, 164.5, "High-angle rescue is the fire service's term for any job too high or too awkward for a ladder on its own.", 1249.2, 1.04, 1.1),
  zm(164.5, 167.8, "It means ropes and anchors and a lot of patience.", 1469.2, 1.05, 1.1),
  zm(167.8, 170.3, "A Zipper adds one more problem.", 1333.2, 1.04, 1.08),
  zm(170.3, 174.4, "Its cages are designed to spin, so each one had to be held still before anybody opened a door.", 1217.2, 1.06, 1.12),
  // RAW 6 174-186: the boom, aerial ladders alongside
  zm(174.4, 186.0, "RAW zm 1447.5-1459.5", 1447.5, 1.0, 1.05),
  zm(186.0, 188.3, "And this was a parish fundraiser.", 104.2, 1.03, 1.07),
  zm(188.3, 190.9, "Nobody in that queue was asking to see a certificate.", 1060.2, 1.03, 1.07),
  zm(190.9, 193.5, "The ladder baskets had to come almost alongside the cages.", 1008.2, 1.04, 1.09),
  // RAW 7 193.5-203.7: a ladder basket working beside the cages
  zm(193.5, 203.7, "RAW zm 1737.2-1747.4", 1737.24, 1.0, 1.05),
  { a: 203.7, b: 209.5, vo: "Everyone was off within about three hours, according to Robert Fox, the chief deputy state fire marshal. (BoomHours)",
    node: <BoomHours src={GR + "tp03_boomfreeze.jpg"} x={860} yBot={900} yTop={120} ticks={["9:30 PM", "10:30", "11:30", "12:30 AM"]} at={14} len={84}
      top="ALL OFF BY ABOUT 12:30 AM" credit="Robert Fox, chief deputy state fire marshal" /> },
  zm(209.5, 213.3, "Reports said at least twenty riders, and one said twenty-four.", 1237.2, 1.05, 1.1),
  zm(213.3, 217.3, "Two people went to Christiana Hospital with injuries that weren't life-threatening.", 1702.3, 1.03, 1.08),
  zm(217.3, 220.0, "The Zipper was taken away for the State Fire Marshal's investigation,", 1871.75, 1.04, 1.08),
  zm(220.0, 224.5, "and the carnival, impressively, carried on without it.", 655.2, 1.03, 1.08),
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.0), kind: "blurDip", len: 12 },
  { at: F(31.9), kind: "glitch", len: 10 },
  { at: F(38.2), kind: "blurDip", len: 12 },
  { at: F(44.0), kind: "zoomHit", len: 10 },
  { at: F(88.2), kind: "glitch", len: 10 },
  { at: F(129.5), kind: "blurDip", len: 12 },
  { at: F(138.5), kind: "whip", len: 10 },
  { at: F(144.5), kind: "blurDip", len: 12 },
  { at: F(203.7), kind: "glitch", len: 10 },
  { at: F(209.5), kind: "blurDip", len: 12 },
];

// a Commons still full-frame with a slow push (3 Nov audit: replaces the second Inset)
function StillPush({ src, label }: { src: string; label: string }) {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = 1.04 + 0.1 * Easing.bezier(0.45, 0, 0.2, 1)(f / durationInFrames);
  return (
    <FilmLook_FX grain={0.08}><AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%", transform: `scale(${z})`, transformOrigin: "52% 40%" }} />
      <RedLabel text={label} at={10} x={0.5} y={0.9} />
    </AbsoluteFill></FilmLook_FX>
  );
}

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [8.95, "sfx_n2/whoosh_01.wav", -33],
  [31.85, "sfx_n2/glitch_01.wav", -27],
  [33.5, X + "metal_clank_1.wav", -30],
  [43.95, "sfx_n2/whoosh_02.wav", -32],
  [88.15, "sfx_n2/glitch_03.wav", -27],
  [120.3, X + "marker_1.wav", -28],
  [125.9, X + "marker_1.wav", -28],
  [127.2, X + "marker_1.wav", -26],
  [138.45, "sfx_n2/whoosh_03.wav", -31],
  [203.65, "sfx_n2/glitch_02.wav", -28],
];

// music: Epidemic ambient Music 5 (-20.9 LUFS file -> -13 dB), out under every raw; two passes of the file (it is 126 s)
const musicVol = (T: number) => {
  let v = 1;
  for (const [a, b] of RAWS) v *= T < a - 0.6 || T > b + 0.9 ? 1 : T < a ? interpolate(T, [a - 0.6, a], [1, 0], cl) : T > b ? interpolate(T, [b, b + 0.9], [0, 1], cl) : 0;
  return v * interpolate(T, [4.0, 5.0, 223.0, 224.5], [0, 1, 1, 0], cl);
};

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE ZIPPER THAT STOPPED" bg={AS + "tp03_title.png"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE03.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, clip], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + (clip === "zm" ? "media/tp03_zm_clean.wav" : "media/tp03_zx_clean.wav"))} startFrom={F(clip === "zm" ? Z(src) : src)}
            volume={(f) => dB(0) * interpolate(f, [0, 6, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(4.0)} durationInFrames={F(118.0) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} volume={(f) => dB(-13) * musicVol(4.0 + f / 30)} />
      </Sequence>
      <Sequence from={F(117.4)} durationInFrames={F(224.5) - F(117.4)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(12)} volume={(f) => dB(-13) * musicVol(117.4 + f / 30) * interpolate(f, [0, 18], [0, 1], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): RAW 2 (19:00, near-duplicate of RAW 1 after the explanation), RAW 4 (22:00, near-dup leading into the inspection), RAW 5 (27:00, between explanations), RAW 6 (24:09, explanation/commentary) removed; each prior shot extended 0.4 s so the VO joins keep a ~0.5 s breath. 7 -> 3 raws. NightClock -> BoomHours (new); second Inset -> full-frame StillPush.
const _cut = cutOut(CompFull, DUR, [[63.9, 74.0], [107.4, 118.0], [148.8, 158.6], [174.4, 186.0]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
