// Theme Park #12 — Big Tex burns, State Fair of Texas, Fair Park, Dallas (Fri 19 Oct 2012).
// Footage: [BT] a fairgoer's VERTICAL phone shot (tzHhUF6YTIk, reposted by Cowboy Dave; filmer not identified; 360x638, lanczos x2),
// [BW] B Ward's crowd shot (yWwCJaKL1-c, 1280x720), [BS] Don K Seale's close shot (MDBMff3aYLI, 568x320 -> 1280x720).
// BT is already smoking at 0:00 (the cut sheet's "standing normally" is not in the file), so the lines before the fire use real photos
// (Library of Congress / Highsmith PD 2012, Praefcke 2008, Afroswede 17 Oct 2012, Big-tex-1956, the fire-morning photo set, 2013/2019/2026).
// Raws: the cut sheet's seven 30 s raws trimmed to 10-13 s where the crowd sound and the picture carry it; BS and BW raws continue straight
// out of their VO shot (one continuous window). Devices (dev/): VertStage (portrait panel + synced magnifier), ToBoot (collar -> right-boot
// bracket on the fire-morning photo), ShellWipe (clothed -> bare frame, same camera), closing 0.5x replay of the head catching fire.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { VertStage } from "../dev/TP12_VertStage";
import { ToBoot } from "../dev/TP12_ToBoot";
import { ShellWipe } from "../dev/TP12_ShellWipe";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DUR = F(209.6);

const VO: [number, number, number][] = [
  [0.0, 30.45, 4.0], [30.45, 45.55, 46.45], [45.55, 64.95, 71.55], [64.95, 66.95, 100.95], [66.95, 68.75, 113.95], [68.75, 71.9, 125.75], [71.9, 76.8, 138.9], [76.8, 129.5, 155.8],
];
// raw sound [comp a, comp b, src, src from, gain dB]
const RAWS: [number, number, string, number, number][] = [
  [34.45, 46.45, "media/bt_clean.wav", 77.0, 0], [61.55, 71.55, "media/bt_clean.wav", 120.0, 0], [90.95, 100.95, "media/bw_clean.wav", 3.0, 0],
  [102.95, 113.95, "media/bs_clean.wav", 3.0, 0], [115.75, 125.75, "media/bw_clean.wav", 51.8, 0], [128.9, 138.9, "media/bt_clean.wav", 262.0, 0],
  [143.8, 155.8, "media/bt_clean.wav", 325.0, 0],
];

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const BT = GR + "bt.mp4";
const V = (from: number, o: Partial<React.ComponentProps<typeof VertStage>> = {}) => <VertStage src={BT} from={from} {...o} />;
const Photo = (src: string, o: { s0?: number; s1?: number; fx?: number; fy?: number } = {}) => ({ src: GR + src, still: true, ...o });

const SHOTS: (Sh & { still?: boolean })[] = [
  { a: 4.0, b: 8.56, vo: "For sixty years, Big Tex was the first thing you saw at the State Fair of Texas. (LoC/Highsmith 2012)", ...Photo("bt2012.jpg", { s0: 1.0, s1: 1.1, fy: 0.3 }),
    over: <RedLabel text="STATE FAIR OF TEXAS" at={F(1.0)} hold={F(3.0)} /> },
  { a: 8.56, b: 11.84, vo: "A giant cowboy standing over Fair Park in Dallas, (Praefcke 2008)", ...Photo("fair2008.jpg", { s0: 1.04, s1: 1.12, fx: 0.62, fy: 0.45 }),
    over: <RedLabel text="FAIR PARK, DALLAS" at={F(1.5)} hold={F(1.6)} /> },
  { a: 11.84, b: 15.5, vo: "talking to the crowd, his mouth and head moving with the words. (17 Oct 2012)", ...Photo("talkin.jpg", { s0: 1.2, s1: 1.45, fx: 0.62, fy: 0.42 }) },
  { a: 15.5, b: 20.63, vo: "He started life in 1949 as a giant Santa Claus in the town of Kerens. (the face, close)", ...Photo("bt2012.jpg", { s0: 1.9, s1: 2.15, fx: 0.33, fy: 0.27 }) },
  { a: 20.63, b: 26.84, vo: "In 1951 the fair bought the parts for $750 and turned him into a cowboy. (Big Tex, 1956)", node: <FilmLook_FX grain={0.08}><Shot_FX src={GR + "bt1956w.jpg"} still n={F(26.84) - F(20.63)} s0={1.02} s1={1.1} fx={0.45} fy={0.3} /></FilmLook_FX> }, // audit 3 Nov: inset -> full-frame tilt down the 1956 figure
  { a: 26.84, b: 30.16, vo: "On the morning of Friday the 19th of October 2012, the last weekend of the fair, (the fire-morning photo)", ...Photo("btfire8c.jpg", { s0: 1.0, s1: 1.08, fx: 0.4, fy: 0.4 }),
    over: <RedLabel text="OCTOBER 19, 2012" at={F(0.4)} hold={F(2.6)} /> },
  { a: 30.16, b: 34.45, vo: "smoke started coming from near his collar. (BT, magnifier on the collar)", node: V(60.0, { x: 0.32, rot: [-8, -3], detail: { fx: 0.76, fy: 0.34, zoom: 2.2, at: 18 } }) },
  { a: 34.45, b: 46.45, vo: "RAW 1: flames at the head, the crowd", node: V(77.0, { x: 0.5, rot: [4, -2], z: [1.0, 1.05] }) },
  { a: 46.45, b: 49.36, vo: "On the day, the fair's spokeswoman, Sue Gooding,", src: "bw.mp4", from: 20.0, s0: 1.03, s1: 1.08, fx: 0.55, fy: 0.4 },
  { a: 49.36, b: 57.09, vo: "pointed to the wiring that worked his mouth and head. The official investigation later traced it to an electrical panel under his right boot. (ToBoot)",
    node: <ToBoot src={GR + "btfire4.jpg"} iw={1920} ih={1434} a={[330, 200, 500, 400]} b={[225, 1030, 360, 1230]} aAt={F(34.02 - 33.36)} moveAt={F(38.9 - 33.36)} moveLen={36} z={[1.25, 1.45]} label="ELECTRICAL PANEL" /> },
  { a: 57.09, b: 61.55, vo: "That panel was believed to power the air compressor that kept his clothes puffed out. (BT, the clothes)", node: V(96.0, { x: 0.68, rot: [6, 2], detail: { fx: 0.16, fy: 0.42, zoom: 2.0, at: 10 } }) },
  { a: 61.55, b: 71.55, vo: "RAW 2: thick black smoke pouring off the figure", node: V(120.0, { x: 0.5, rot: [-3, 3], z: [1.02, 1.07] }) },
  { a: 71.55, b: 74.61, vo: "Big Tex was a steel frame wearing giant clothes,", node: V(150.0, { x: 0.36, rot: [-6, -2] }) },
  { a: 74.61, b: 76.46, vo: "a shirt and jeans and a hat. (17 Oct 2012, the clothes)", ...Photo("talkin.jpg", { s0: 1.35, s1: 1.45, fx: 0.65, fy: 0.6 }) },
  { a: 76.46, b: 79.88, vo: "Once the fire reached the fabric, nothing was going to slow it. (legs burning)", node: V(185.0, { x: 0.66, rot: [5, 1], detail: { fx: 0.36, fy: 0.58, zoom: 2.0, at: 8 } }) },
  { a: 79.88, b: 82.09, vo: "He was light for his size, too.", src: "bw.mp4", from: 30.0, s0: 1.03, s1: 1.07 },
  { a: 82.09, b: 84.96, vo: "The replacement would weigh twenty-five thousand pounds. (the new Big Tex, 2026, framed)", node: <FilmLook_FX grain={0.08}><Shot_FX src={GR + "bt2026w.jpg"} still n={F(84.96) - F(82.09)} s0={1.0} s1={1.07} fx={0.6} fy={0.5} /></FilmLook_FX> }, // audit 3 Nov: inset -> full-frame, the boots and legs (scale)
  { a: 84.96, b: 87.91, vo: "That's nineteen thousand more than the one burning here.", node: V(205.0, { x: 0.5, rot: [-4, 0] }) },
  { a: 87.91, b: 90.95, vo: "So most of the old Big Tex was fabric over a frame. (ShellWipe)",
    node: <ShellWipe a={GR + "bt_shell.jpg"} b={GR + "bt_frame.jpg"} iw={720} ih={1276} alA={{ s: 1.35, dx: 90, dy: -51 }} alB={{ s: 1.46, dx: -90, dy: 51 }} at={8} len={F(64.3 - 61.91) - 8} /> },
  { a: 90.95, b: 100.95, vo: "RAW 3: black smoke streaming over the crowd, raised phones", src: "bw.mp4", from: 3.0, s0: 1.0, s1: 1.05 },
  { a: 100.95, b: 113.95, vo: "Someone standing much closer. + RAW 4 (one window): the figure fully in flames", src: "bs.mp4", from: 1.0, s0: 1.02, s1: 1.1, fy: 0.45 },
  { a: 113.95, b: 125.75, vo: "Then the crews got water on him. + RAW 5 (one window): white smoke as crews spray", src: "bw.mp4", from: 50.0, s0: 1.02, s1: 1.07 },
  { a: 125.75, b: 128.9, vo: "A few minutes in, there was almost nothing left to save.", node: V(240.0, { x: 0.34, rot: [-7, -3] }) },
  { a: 128.9, b: 138.9, vo: "RAW 6: open flames climbing the figure, the fence", node: V(262.0, { x: 0.6, rot: [5, 0], detail: { fx: 0.56, fy: 0.3, zoom: 1.8, at: 90 } }) },
  { a: 138.9, b: 143.8, vo: "What's left inside the flames is the frame he was built on, and by the end it's all there is. (BS, the frame in silhouette)", src: "bs.mp4", from: 30.0, s0: 1.08, s1: 1.18, fy: 0.4 },
  { a: 143.8, b: 155.8, vo: "RAW 7: the figure burning down to its frame", node: V(325.0, { x: 0.5, rot: [3, -3], z: [1.0, 1.06] }) },
  { a: 155.8, b: 157.5, vo: "Nobody in the crowd was hurt.", src: "bw.mp4", from: 80.0, s0: 1.03, s1: 1.06 },
  { a: 157.5, b: 161.18, vo: "The fair's vice president of marketing believed it was an electrical short.", src: "bw.mp4", from: 95.0, s0: 1.08, s1: 1.14, fx: 0.65 },
  { a: 161.18, b: 165.57, vo: "The Dallas Morning News later reported that the authorities traced it to a short circuit.", node: V(345.0, { x: 0.3, rot: [-6, -1], detail: { fx: 0.59, fy: 0.4, zoom: 2.0, at: 12 } }) },
  { a: 165.57, b: 168.88, vo: "Workers took the frame away, and the fair promised he'd be back.", src: "bw.mp4", from: 112.0, s0: 1.06, s1: 1.12, fx: 0.62 },
  { a: 168.88, b: 172.47, vo: "He was, on the 26th of September 2013. (the new Big Tex, 27 Sep 2013)", node: <Inset src={GR + "bt2013.jpg"} still box={0.32} ar={800 / 1200} pos="50% 35%" drift={0.07} label="SEPTEMBER 26, 2013" labelAt={F(1.1)} /> },
  { a: 172.47, b: 175.18, vo: "The rebuild cost five hundred thousand dollars. (2019)", ...Photo("bt2019c.jpg", { s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.4 }) },
  { a: 175.18, b: 181.48, vo: "The new Big Tex is three feet taller, at fifty-five feet, and built to stand in hundred-mile-an-hour winds. (2026, tilt up the figure)",
    ...Photo("bt2026c.jpg", { s0: 1.0, s1: 1.1, fx: 0.3, fy: 0.4 }) },
  { a: 181.48, b: 185.35, vo: "Obviously this one doesn't belong next to people stuck fifty metres up.", src: "bw.mp4", from: 70.0, s0: 1.03, s1: 1.08 },
  { a: 185.35, b: 187.22, vo: "Nobody's life was in danger.", node: V(290.0, { x: 0.66, rot: [4, 1] }) },
  { a: 187.22, b: 189.1, vo: "It's here because of that crowd. (raised phones)", src: "bw.mp4", from: 40.0, s0: 1.1, s1: 1.16, fy: 0.75 },
  { a: 189.1, b: 194.62, vo: "These were people who'd grown up with this cowboy, standing there on the last weekend of the fair while he burned.", src: "bw.mp4", from: 23.5, s0: 1.04, s1: 1.1, fy: 0.6 },
  { a: 194.62, b: 196.29, vo: "Rides break and get fixed.", src: "bs.mp4", from: 40.0, s0: 1.05, s1: 1.1 },
  { a: 196.29, b: 199.71, vo: "A landmark like that is part of how a city remembers itself. (Fair Park, 2008)", ...Photo("fair2008.jpg", { s0: 1.0, s1: 1.06, fx: 0.4, fy: 0.5 }) },
  { a: 199.71, b: 201.33, vo: "Even his voice changed. (the old face, 2012)", ...Photo("talkin.jpg", { s0: 1.9, s1: 2.05, fx: 0.63, fy: 0.3 }) },
  { a: 201.33, b: 209.6, vo: "Bill Bragg ... was let go after that fair for revealing himself as the man behind it. (0.5x replay: the head catching fire)",
    node: <VertStage src={GR + "bt_slow.mp4"} from={0.0} x={0.68} rot={[4, 1]} z={[1.0, 1.05]} detail={{ fx: 0.55, fy: 0.38, zoom: 1.7, at: 40 }} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(30.16), kind: "blurDip", len: 12 },
  { at: F(34.45), kind: "blurDip", len: 12 },
  { at: F(49.36), kind: "zoomHit", len: 10 },
  { at: F(61.55), kind: "blurDip", len: 12 },
  { at: F(71.55), kind: "blurDip", len: 12 },
  { at: F(87.91), kind: "blurDip", len: 12 },
  { at: F(100.95), kind: "glitch", len: 8 },
  { at: F(128.9), kind: "blurDip", len: 12 },
  { at: F(143.8), kind: "blurDip", len: 12 },
  { at: F(155.8), kind: "glitch", len: 8 },
  { at: F(168.88), kind: "whip", len: 10 },
  { at: F(201.33), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh & { still?: boolean } }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.still ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [49.36, "sfx_n2/whoosh_02.wav", -30],
  [87.95, "sfx_n2/whoosh_01.wav", -30],
  [100.9, "sfx_n2/glitch_03.wav", -28],
  [155.75, "sfx_n2/glitch_03.wav", -28],
  [168.88, "sfx_n2/whoosh_03.wav", -30],
  [201.3, X + "reverse_swell_1.wav", -26],
];

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="BIG TEX BURNS" bg={GR + "title.jpg"} pos="20% 30%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE12.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, from, g], i) => {
        const n = F(b) - F(a);
        return <Sequence key={"r" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile(C + src)} startFrom={F(from)} volume={(f) => dB(g) * interpolate(f, [0, 8, n - 14, n - 2], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {/* music: Epidemic ambient Music 5 (−20.9 LUFS file -> −13 dB), out under each raw (real crowd sound), back after */}
      {[[4.0, 34.45, 0], [46.45, 61.55, 30], [71.55, 90.95, 45], [155.8, 209.6, 64]].map(([a, b, off], i) => {
        const n = F(b) - F(a);
        return <Sequence key={"m" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(off)} volume={(f) => dB(-13) * interpolate(f, [0, 24, n - 20, n - 2], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): raw 2 (smoke, after the investigation line), raw 3 (BW smoke, after the ShellWipe explanation), raw 5's raw part (after 'Then the crews got water on him.'), raw 6 (near-dup of raw 7) removed; VO runs on. 7 -> 3 raws (1, 4, 7).
const _cut = cutOut(CompFull, DUR, [[61.55, 71.55], [90.95, 100.95], [115.75, 125.75], [128.9, 138.9]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
