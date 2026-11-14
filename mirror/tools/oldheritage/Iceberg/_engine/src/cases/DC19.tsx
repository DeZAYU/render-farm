// Dashcam #19 - Lincoln County, West Virginia, Fri 12 May 2017 17:01: after a day of rain the bank beside the road gives way and seven
// trees fall across Ronald Wiley's pickup; one lands across the windshield, one across the cab roof; he reverses out, unhurt.
// One source: 3kbo1BQcDxw (Dash Cams, repost of Wiley's clip), 1920x1080, NO AUDIO; used src 6.5-43.3 (the 6 s title card cut),
// media t = src - 6.5. Silent raws -> real SFX timed to the picture (rain, slide, trunk impacts, engine in reverse).
// VO = one take (CASE19.mp3), split only at the two raws:
//   A 0-28.81 @4.00 | R1 32.81-51.31 (t 1.0-19.5: the bend, the trees fall, trunk across the windshield, buried) | B 28.81-57.30 @51.31 |
//   R2 79.80-93.80 (t 22.8-36.8: reversing out under the branches, road again) | C 57.30-end @93.80, VO ends 104.35, hold to 105.2.
// One 37 s clip carries the whole case, so the VO between the raws uses the deliberate 0.5x replay / held frames of the raw moments.
// Devices: FeedSheet (NWS warning), BankEdge, StripStack (WSLS). Radar still: IEM archive (NWS radar composite at issue time).
import React from "react";
import { RedLabel } from "../brand";
import { type FxCut } from "../lib/templates/n2fx/fx";
import { Cam } from "../dev/DC01_kit";
import { CaseRunner, type CaseDef, F, K, Still, type Sh } from "../dev/DC17_kit";
import { FeedSheet } from "../dev/DC19_FeedSheet";
import { BankEdge } from "../dev/DC19_BankEdge";
import { StripStack } from "../dev/DC19_StripStack";

const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
export const DUR = F(105.2);

const SHOTS: Sh[] = [
  { a: 4.0, b: 9.3, vo: "Ronald Wiley had his pickup on a soaked, wooded road in Lincoln County, West Virginia, (the wet road, very slow)",
    node: (n) => <Cam src={M} from={4.2} rate={0.15} keys={K(n, [1.3, 0.4, 0.45], [1.42, 0.38, 0.42])} />, over: <RedLabel text="LINCOLN COUNTY, WEST VIRGINIA" at={F(1.2)} hold={F(3.6)} size={42} /> },
  { a: 9.3, b: 14.33, vo: "just after five on a Friday afternoon, May 12, 2017. It'd been raining all day. (radar at 3:50 PM CDT, the warned counties)",
    node: (n) => <Still src={GR + "radar.jpg"} n={n} s0={1.02} s1={1.18} fx={0.4} fy={0.5} />, over: <RedLabel text="MAY 12, 2017 · 5:01 PM" at={F(0.4)} hold={F(3.9)} size={42} /> },
  { a: 14.33, b: 26.54, vo: "Eleven minutes before ... flood warning. Up to an inch and a half of rain had already fallen, ... flash flood watch ... (FeedSheet)",
    node: () => <FeedSheet bg={M} bgFrom={2.0} sheet={GR + "flw_sheet.png"} sw={1264} sh={1404} credit="NWS Charleston, 4:50 PM May 12, 2017 · IEM archive"
      beats={[{ f: 30, y0: 212, y1: 372 }, { f: 146, y0: 741, y1: 866 }, { f: 181, y0: 1189, y1: 1272 }]} /> },
  { a: 26.54, b: 32.81, vo: "There's no sound on the clip, so all you get is the picture. The trees to watch are on the bank as he comes around the bend. (BankEdge)",
    node: (n) => <BankEdge src={M} t={1.0} at={95} outAt={172} path={[[0.01, 0.76], [0.25, 0.575], [0.4, 0.47], [0.5, 0.405]]} keys={K(n, [1.0, 0.45, 0.5], [1.06, 0.4, 0.48])} /> },
  // RAW 1: the bend, the trees come down off the bank, the trunk across the windshield, buried
  { a: 32.81, b: 51.31, vo: "RAW 1 (t 1.0-19.5)", node: (n) => <Cam src={M} from={1.0} keys={K(n, [1.06, 0.4, 0.48], [1.1, 0.45, 0.48])} /> },
  { a: 51.31, b: 59.69, vo: "The bank had given way. Wiley told local news the trees just started falling like dominoes, ... he slid right into them. (0.5x replay)",
    node: (n) => <Cam src={M} from={4.6} rate={0.5} keys={K(n, [1.1, 0.42, 0.42], [1.5, 0.36, 0.36])} /> },
  { a: 59.69, b: 64.22, vo: "One trunk came down across his windshield and another across the roof of the cab. (held: the trunk on the glass)",
    node: (n) => <Cam src={M} t={11.0} keys={K(n, [1.05, 0.5, 0.5], [1.2, 0.5, 0.45])} /> },
  { a: 64.22, b: 68.76, vo: "When it was over, he counted seven trees, all tangled together around his truck. (buried under the trunks)",
    node: (n) => <Cam src={M} from={13.0} keys={K(n, [1.3, 0.5, 0.45], [1.4, 0.55, 0.45])} /> },
  { a: 68.76, b: 76.58, vo: "So how did he get out? Above him, the cable and telephone lines ... were still holding, ... (the trunks shifting, slowed)",
    node: (n) => <Cam src={M} from={19.6} rate={0.4} keys={K(n, [1.2, 0.5, 0.5], [1.35, 0.5, 0.42])} /> },
  { a: 76.58, b: 79.80, vo: "He put it in reverse and backed out from under the pile. (the pile, wide)",
    node: (n) => <Cam src={M} from={16.5} rate={0.5} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.5])} /> },
  // RAW 2: reversing out, branches dragging off the glass, the road again
  { a: 79.80, b: 93.80, vo: "RAW 2 (t 22.8-36.8)", node: (n) => <Cam src={M} from={22.8} keys={K(n, [1.04, 0.5, 0.5], [1.12, 0.5, 0.55])} /> },
  { a: 93.80, b: 105.2, vo: "Seven trees, ... broken wiper and a busted corner of the grille. He wasn't hurt at all. 'God was definitely watching over me' (StripStack)",
    node: () => <StripStack bg={M} bgT={36.4} credit="WSLS 10 News · May 17, 2017"
      a={{ src: GR + "wsls_damage.png", w: 1703, h: 140, at: 9 }} b={{ src: GR + "wsls_quote.png", w: 1703, h: 276, at: 169, rule: [868, 1436, 234] }} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.3), kind: "glitch", len: 10 }, { at: F(14.33), kind: "blurDip", len: 12 }, { at: F(26.54), kind: "blurDip", len: 12 },
  { at: F(51.31), kind: "blurDip", len: 12 }, { at: F(59.69), kind: "blurDip", len: 10 }, { at: F(64.22), kind: "blurDip", len: 10 },
  { at: F(68.76), kind: "blurDip", len: 10 }, { at: F(76.58), kind: "blurDip", len: 10 }, { at: F(79.80), kind: "blurDip", len: 10 },
  { at: F(93.80), kind: "blurDip", len: 12 },
];

const def: CaseDef = {
  title: "SEVEN TREES IN LINCOLN COUNTY", titleBg: GR + "title.jpg", vo: "vor/CASE19.mp3", dur: 105.2,
  shots: SHOTS, cuts: CUTS,
  parts: [[4.0, 0, 28.81], [51.31, 28.81, 57.30], [93.80, 57.30, null]],
  raws: [{ a: 32.81, b: 51.31, src: 1.0, g: -99, duck: 0.35 }, { a: 79.80, b: 93.80, src: 22.8, g: -99, duck: 0.35 }],
  // the clip is silent: rain, the slide, the trunks landing, the engine in reverse (real recordings)
  sfx: [[3.95, "sfx_n2/glitch_02.wav", -24], [9.25, "sfx_n2/glitch_01.wav", -30], [14.35, "sfx_n2/real/paper_3.wav", -26],
    [37.8, "sfx_n2/real/wind_gust_1.wav", -18], [38.6, "sfx_n2/real/tires_gravel_1.wav", -18], [40.6, "sfx_n2/real/impact_3.wav", -8],
    [40.65, "sfx_n2/real/metal_clank_1.wav", -18], [44.6, "sfx_n2/real/impact_1.wav", -12], [50.3, "sfx_n2/real/boom_2.wav", -16],
    [79.9, "sfx_n2/real/tires_gravel_1.wav", -22], [93.85, "sfx_n2/real/paper_2.wav", -26], [99.45, "sfx_n2/real/paper_3.wav", -26]],
  beds: [[32.81, 51.31, "sfx_n2/real/rain_5.wav", -20], [79.80, 93.80, "sfx_n2/real/rain_5.wav", -22], [80.2, 93.6, "sfx_n2/real/car_engine_4.wav", -24]],
  music: { file: "music/Music 1.mp3", db: -15, passes: [[4.0, 105.2, 20]] },
};

export const Comp: React.FC = () => <CaseRunner c={def} />;
