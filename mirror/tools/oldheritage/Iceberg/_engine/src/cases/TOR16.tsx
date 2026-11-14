// Tornado #16 — Andover, Kansas, Fri 29 April 2022, ~8:10–8:31 PM: the school and the YMCA. Channel grammar (brand.tsx) + devices built
// for THIS case: TapeInsert (the Andover Police Department's own 1991 F5 tape inside the 2022 City Hall camera), SurveyMap (the NWS
// Damage Assessment Toolkit survey: 86 rated points + the surveyed line on USGS imagery, flown from the whole path down onto Prairie Creek
// Elementary; then close: the line past the school's edge and through the YMCA). Aerial: McConnell AFB; the school and the YMCA today.
// Both sources are SILENT official CCTV (City of Andover City Hall West camera EDwVxPA3aGk; USD 385 school cameras T2Qu7cgwJmw):
// every raw is built from real recorded SFX timed to the picture. VO = one take ("Sixteen." removed), split only at the raws.
// Media offsets: city = src-185 (15 fps), school = src, tape = Commons webm-70. School source cuts: 61.73/75.27/91.10/99.6-108.6 (debris
// flashes)/118.03/130.73/134.0-134.7/140.5/153.03/165.13/207.2-209.5/213.47/217.47/221.47/225.47 — every window sits between them.
// Order change (noted): raw 6 (the cafeteria) plays after "The school lost its roof and windows." so the side-swipe map can run straight
// on into the YMCA line.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { TapeInsert } from "../dev/TOR16_TapeInsert";
import { SurveyMap } from "../dev/TOR16_SurveyMap";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(142.8);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const CT = (s: number) => s - 185;

// NWS DAT (WichitaAndoverTornado) in wide-image px (USGS z14 mosaic, origin tile 3768/6331)
const LINE: [number, number][] = [[165.8, 2639.3], [347.9, 2517.7], [450.4, 2451.2], [541.8, 2367.3], [873.2, 2003.6], [930.2, 1938.9], [956.2, 1906.1], [967.8, 1890.3], [971.2, 1883.7], [977.4, 1871.4], [1003.2, 1846.9], [1012.8, 1807.4], [1023.6, 1756.6], [1035.6, 1705.6], [1128.8, 1473.1], [1152.3, 1410.1], [1184.8, 1358.1], [1225.8, 1239.3], [1359.9, 801.2], [1461.9, 333.9]];
const PTS: [number, number, number][] = [[335.9, 2559.0, 0], [863.7, 1871.8, 1], [331.2, 2514.9, 1], [328.9, 2547.3, 1], [332.4, 2544.3, 2], [339.4, 2535.5, 0], [328.9, 2550.2, 1], [333.6, 2520.8, 1], [331.2, 2514.9, 0], [380.2, 2498.7, 2], [450.1, 2459.0, 2], [434.9, 2478.1, 1], [441.9, 2439.9, 1], [775.1, 2113.2, 3], [1150.3, 1403.6, 1], [1151.5, 1415.4, 3], [1148.0, 1402.1, 3], [1150.3, 1419.8, 3], [1151.5, 1421.2, 3], [1149.1, 1416.8, 2], [1150.3, 1421.2, 2], [1141.0, 1419.8, 1], [1152.6, 1400.6, 1], [1227.2, 1331.4, 0], [1221.4, 1282.8, 2], [994.2, 1879.2, 3], [937.1, 1941.0, 3], [935.9, 1936.6, 2], [935.9, 1933.6, 2], [935.9, 1930.7, 2], [935.9, 1926.3, 1], [935.9, 1910.1, 0], [934.8, 1926.3, 0], [934.8, 1933.6, 2], [839.2, 2042.5, 1], [838.1, 2027.8, 2], [862.5, 2026.4, 2], [859.0, 2021.9, 2], [882.3, 1985.1, 2], [881.2, 1986.6, 0], [832.2, 2041.1, 2], [833.4, 2048.4, 0], [843.9, 2014.6, 2], [850.9, 2020.5, 1], [867.2, 2004.3, 1], [871.8, 1985.1, 0], [874.2, 1983.7, 1], [441.9, 2439.9, 2], [1151.5, 1419.8, 3], [1450.9, 351.5, 0], [1362.3, 798.1, 0], [1362.3, 802.5, 1], [1362.3, 802.5, 2], [1299.4, 992.6, 1], [1466.0, 330.9, 0], [1010.5, 1808.5, 1], [1017.5, 1751.1, 2], [1014.0, 1810.0, 2], [1251.7, 1218.0, 2], [387.2, 2503.1, 0], [927.8, 1942.5, 2], [931.3, 1943.9, 0], [919.6, 1945.4, 0], [915.0, 1951.3, 1], [917.3, 1949.8, 1], [904.5, 1942.5, 1], [910.3, 1957.2, 1], [932.4, 1942.5, 0], [934.8, 1930.7, 2], [833.4, 2021.9, 0], [828.7, 2027.8, 1], [201.9, 2659.1, 0], [338.2, 2535.5, 1], [366.2, 2498.7, 2], [360.4, 2504.6, 2], [867.2, 1998.4, 0], [425.6, 2488.4, 0], [443.1, 2460.5, 1], [867.2, 1999.9, 2], [909.1, 1958.6, 2], [1011.7, 1855.6, 3], [1004.7, 1849.7, 3], [1002.3, 1845.3, 3], [998.8, 1848.2, 1], [1002.3, 1845.3, 3], [960.4, 1914.5, 2]];
const CLOSE_AT: [number, number, number, number] = [853.0, 1782.0, 1097.7, 2002.8];
const SCHOOL: [number, number, number, number] = [947.5, 1903.5, 972.5, 1925.5], YMCA: [number, number, number, number] = [965.5, 1858.5, 985.5, 1874.5];
const MAP = { wide: GR + "wide.jpg", ww: 1792, wh: 2816, close: GR + "close.jpg", closeAt: CLOSE_AT };

const SHOTS: Sh[] = [
  // RAW 0 (4.0-10.0): the City Hall West camera, the funnel far out on the horizon (silent; wind built from SFX)
  { a: 4.0, b: 10.0, vo: "RAW 0 city 187.5-193.5", src: "city.mp4", from: CT(187.5), s0: 1.04, s1: 1.1, fx: 0.42, fy: 0.3 },
  // VO-A (t 10.0 = take 0.9)
  { a: 10.0, b: 12.6, vo: "Andover, Kansas, on the east side of Wichita,", src: "city.mp4", from: CT(205.0), s0: 1.22, s1: 1.3, fx: 0.4, fy: 0.3,
    over: <RedLabel text="ANDOVER, KANSAS" at={F(0.3)} hold={F(2.0)} /> },
  { a: 12.6, b: 16.9, vo: "at about ten past eight on Friday the 29th of April 2022.", src: "city.mp4", from: CT(262.0), s0: 1.06, s1: 1.12, fx: 0.42, fy: 0.35,
    over: <RedLabel text="APRIL 29, 2022" at={F(1.2)} hold={F(2.8)} /> },
  { a: 16.9, b: 21.3, vo: "Andover had already been hit by an F5 in April 1991. (the police department's 1991 tape)",
    node: <TapeInsert tape={GR + "tape.mp4"} tapeFrom={24.0} bg={GR + "city.mp4"} bgFrom={CT(300.0)} label="APRIL 26, 1991" labelAt={F(1.6)} /> },
  { a: 21.3, b: 24.4, vo: "This one touched down east of McConnell Air Force Base",
    node: <Aerial src={GR + "mcc.jpg"} iw={2048} ih={1280} spot={[425, 330, 760, 930]} z0={1.05} z1={1.3} label="McCONNELL AIR FORCE BASE" boxAt={F(0.4)} labelAt={F(0.8)} /> },
  { a: 24.4, b: 27.1, vo: "and tossed a small grain bin on its way in.", src: "city.mp4", from: CT(330.0), s0: 1.18, s1: 1.26, fx: 0.4, fy: 0.3 },
  // RAW 1 (27.1-35.1): on the ground, nearer
  { a: 27.1, b: 35.1, vo: "RAW 1 city 520-528", src: "city.mp4", from: CT(520.0), s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.4 },
  // VO-B (t 35.1 = take 18.0): low-precipitation supercell, nothing wrapped around it
  { a: 35.1, b: 38.6, vo: "It came from a low-precipitation supercell, the kind that drops little rain,", src: "city.mp4", from: CT(400.0), s0: 1.3, s1: 1.38, fx: 0.42, fy: 0.3 },
  { a: 38.6, b: 42.1, vo: "so there was almost nothing wrapped around it. (the clean funnel)", src: "city.mp4", from: CT(470.0), s0: 1.6, s1: 1.7, fx: 0.4, fy: 0.32 },
  // VO-C (t 54.1 = take 25.0)
  { a: 42.1, b: 51.3, vo: "EF3, peak winds around a hundred and fifty-five, the only strong tornado in a two-day outbreak of twenty-nine. Prairie Creek Elementary was in the way. (NWS survey points, dive to the school)",
    node: <SurveyMap {...MAP} pts={PTS} ptsIn={[F(0.4), F(3.4)]} line={LINE} lineIn={[F(0.2), F(3.0)]}
      cam={[{ at: 0, x: 900, y: 1760, z: 1.05 }, { at: F(5.0), x: 910, y: 1780, z: 1.25 }, { at: F(8.4), x: 960, y: 1906, z: 4.6 }, { at: F(9.2), x: 960, y: 1908, z: 4.9 }]}
      boxes={[{ r: SCHOOL, at: F(7.4), label: "PRAIRIE CREEK ELEMENTARY" }]} /> },
  { a: 51.3, b: 52.7, vo: "The building was empty. (the cafeteria before)", src: "school.mp4", from: 165.6, s0: 1.03, s1: 1.06, fx: 0.5, fy: 0.5 },
  // RAW 3 (52.7-60.7): the lawn camera, boards flying
  { a: 52.7, b: 60.7, vo: "RAW 3 school 7.5-15.5", src: "school.mp4", from: 7.5, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  // VO-D..F (t 60.7 = take 35.6-44.1), 3 Nov: school raws 4 + 5 removed, the three lines run on over the silent school cameras
  { a: 60.7, b: 62.7, vo: "Its windows were blown out, (the cafeteria glass gone; the source ends at 229.23)", src: "school.mp4", from: 225.6, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 62.7, b: 64.75, vo: "and the cars in its parking lot were damaged. (the walkway camera, debris across it, muted)", src: "school.mp4", from: 110.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 64.75, b: 67.0, vo: "The funnel passed right alongside it. (the tree camera: the funnel going by, muted)", src: "school.mp4", from: 131.5, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 67.0, b: 69.2, vo: "The school lost its roof and windows. (the courtyard camera)", src: "school.mp4", from: 153.8, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  // RAW 6 (69.2-81.2): the cafeteria: the window goes, the tables are thrown
  { a: 69.2, b: 81.2, vo: "RAW 6 school 169.0-181.0", src: "school.mp4", from: 169.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  // VO-G (t 81.2 = take 44.1)
  { a: 81.2, b: 90.9, vo: "That only counts as EF2 ... side-swiped ... The YMCA took a direct hit with families sheltering inside, (survey line past the school, through the YMCA)",
    node: <SurveyMap {...MAP} pts={PTS} ptsIn={[0, 2]} line={LINE} lineIn={[F(0.6), F(3.6)]}
      cam={[{ at: 0, x: 958, y: 1912, z: 7.0 }, { at: F(4.4), x: 962, y: 1906, z: 6.4 }, { at: F(6.8), x: 973, y: 1878, z: 6.8 }, { at: F(9.7), x: 975, y: 1872, z: 7.3 }]}
      boxes={[{ r: SCHOOL, at: F(0.3), label: "PRAIRIE CREEK ELEMENTARY" }, { r: YMCA, at: F(6.2), label: "ANDOVER YMCA", red: true }]} /> },
  { a: 90.9, b: 94.5, vo: "and a car was lifted about a thousand feet and dropped through its roof. (debris lofted, City Hall cam)", src: "city.mp4", from: CT(548.0), s0: 1.2, s1: 1.3, fx: 0.4, fy: 0.35 },
  { a: 94.5, b: 98.0, vo: "Around 1,074 buildings were damaged (NWS: EF3 damage to a house in Andover)", src: GR + "ef3house.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 98.0, b: 101.5, vo: "and up to four hundred destroyed, about forty-one million dollars of it. (NWS: the pet shop swept away)", src: GR + "petshop.jpg", still: true, s0: 1.1, s1: 1.03, fx: 0.5, fy: 0.55 },
  { a: 101.5, b: 107.4, vo: "never wider than 250 yards, down for only 21 minutes (the narrow tornado passing City Hall)", src: "city.mp4", from: CT(606.0), s0: 1.02, s1: 1.08, fx: 0.4, fy: 0.45 },
  { a: 107.4, b: 111.5, vo: "Afterwards, Governor Laura Kelly declared a state of emergency, (the camera after it passed)", src: "city.mp4", from: CT(626.0), s0: 1.04, s1: 1.1, fx: 0.45, fy: 0.45 },
  { a: 111.5, b: 114.8, vo: "and the base sent 150 airmen to help clear up the town. (the playground, debris)", src: "school.mp4", from: 214.16, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 114.8, b: 117.4, vo: "Three were injured and no one lost their life. (the sky clearing over City Hall)", src: "city.mp4", from: CT(662.0), s0: 1.04, s1: 1.08, fx: 0.45, fy: 0.4 },
  { a: 117.4, b: 125.2, vo: "Prairie Creek reopened on the 11th of August 2022 ... (the school from above today)",
    node: <Aerial src={GR + "close.jpg"} iw={2400} ih={2160} spot={[930, 1185, 1180, 1405]} z0={1.0} z1={1.35} label="PRAIRIE CREEK ELEMENTARY" boxAt={F(0.8)} labelAt={F(1.3)} /> },
  { a: 125.2, b: 134.4, vo: "The YMCA's walls went back up with 6,375 new limestone blocks and 22,600 square feet of glass. (the YMCA from above today)",
    node: <Aerial src={GR + "close.jpg"} iw={2400} ih={2160} spot={[1095, 745, 1320, 905]} z0={1.15} z1={1.6} label="ANDOVER YMCA" boxAt={F(0.8)} labelAt={F(1.3)} /> },
  { a: 134.4, b: 137.5, vo: "Its reopening was planned for spring 2024. (the school lawn camera, calm again)", src: "school.mp4", from: 221.7, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 137.5, b: 142.8, vo: "This was a Friday night. I'd rather not picture those classrooms on a Tuesday morning. (the wrecked cafeteria)", src: "school.mp4", from: 196.0, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(10.0), kind: "blurDip", len: 12 },
  { at: F(12.6), kind: "blurDip", len: 10 },
  { at: F(16.9), kind: "blurDip", len: 12 },
  { at: F(24.4), kind: "whip", len: 10 },
  { at: F(27.1), kind: "blurDip", len: 12 },
  { at: F(35.1), kind: "blurDip", len: 12 },
  { at: F(38.6), kind: "blurDip", len: 10 },
  { at: F(42.1), kind: "glitch", len: 10 },
  { at: F(51.3), kind: "glitch", len: 8 },
  { at: F(69.2), kind: "blurDip", len: 12 },
  { at: F(81.2), kind: "zoomHit", len: 10 },
  { at: F(101.5), kind: "blurDip", len: 12 },
  { at: F(107.4), kind: "blurDip", len: 12 },
  { at: F(117.4), kind: "glitch", len: 10 },
  { at: F(125.2), kind: "blurDip", len: 12 },
  { at: F(134.4), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

// VO parts: [edit t, take start, take end]
// 3 Nov: raws 2, 4, 5 removed (VO-B+C and VO-D+E+F run straight on)
const VO: [number, number, number][] = [[10.0, 0.9, 18.0], [35.1, 18.0, 35.6], [60.7, 35.6, 44.1], [81.2, 44.1, 105.23]];
const RAWS: [number, number][] = [[4.0, 10.0], [27.1, 35.1], [52.7, 60.7], [69.2, 81.2]];
const X = "sfx_n2/real/";
// the cameras recorded no sound: each raw gets real recordings timed to what the picture does
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [4.1, X + "wind_gust_1.wav", -24], [4.3, X + "rain_9.wav", -32],
  [16.95, X + "vhs_1.wav", -30],
  [24.4, "sfx_n2/whoosh_01.wav", -31],
  [27.2, X + "wind_gust_1.wav", -20], [27.4, X + "rain_22.wav", -30],
  [42.05, "sfx_n2/glitch_01.wav", -28],
  [51.25, "sfx_n2/glitch_03.wav", -30],
  [52.75, X + "wind_gust_1.wav", -15], [53.0, X + "rain_5.wav", -27], [54.4, X + "impact_1.wav", -24], [56.9, X + "metal_clank_1.wav", -26], [58.6, X + "impact_4.wav", -24],
  [69.25, X + "wind_gust_1.wav", -16], [71.1, X + "impact_2.wav", -12], [71.2, X + "metal_clank_4.wav", -16], [71.7, X + "impact_3.wav", -15], [71.9, X + "wind_gust_1.wav", -11],
  [72.8, X + "metal_clank_2.wav", -18], [73.7, X + "impact_4.wav", -17], [75.0, X + "metal_clank_1.wav", -20], [76.3, X + "impact_1.wav", -19], [77.5, X + "rain_22.wav", -24],
  [81.2, "sfx_n2/whoosh_03.wav", -30],
  [117.35, "sfx_n2/glitch_02.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE SCHOOL AND THE YMCA" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([t, a, b], i) => <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE16.mp3")} startFrom={F(a)} /></Sequence>)}
      {/* music: Music 1 (Epidemic ambient, 128 s): one pass, then a crossfade back into its middle for the last 45 s; low under the SFX-built raws */}
      {([[3.6, 129.0, 0], [125.0, 142.8, 30]] as [number, number, number][]).map(([a, b, off], i) => { const n = F(b) - F(a); return (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + a; let k = 1;
            for (const [ra, rb] of RAWS) k = Math.min(k, 1 - 0.6 * interpolate(t, [ra - 0.6, ra + 0.4, rb - 0.4, rb + 0.6], [0, 1, 1, 0], cl));
            return dB(-15.5) * k * interpolate(f, [0, i ? F(4) : 20, n - (i ? 50 : F(4)), n], [0, 1, 1, 0], cl);
          }} />
        </Sequence>); })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
