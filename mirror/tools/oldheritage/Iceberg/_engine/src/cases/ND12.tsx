// Natural Disasters #12: Preston's windshield on westbound I-70 at Wheat Ridge, 8 May 2017 (the Denver-west hailstorm). Channel grammar
// (TitleCard, RedLabel, Inset, glitch / blur-dip) + devices built for this case (dev/ND12_*):
//   HailCycle    a cut through the storm: the stone loops through the updraft, a ring of ice per trip (stone shown halved in an inset)
//   GlassLayers  over a freeze of his own crazed windshield: laminated glass slides apart in 3-D, crack stops at the interlayer;
//                then a tempered pane bursts into cubes
//   Upslope      the real 3DEP terrain profile along 39.74 N, plains -> Rockies, moist air forced up, the storm tower builds
//   StoneScale   the logged 2.00 / 2.75 in stones at true relative size on an inch ruler (NWS reference: hen egg / baseball)
//   ReportMap    the storm's own SPC hail reports dropped on the NAIP aerial in time order, sized by stone; I-70 traced; Colorado Mills boxed
// One source (his dashcam + phone, the uploader's own split screen in places). The dashcam's wrong date stamp is cropped out of every frame.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { ND12_HailCycle } from "../dev/ND12_HailCycle";
import { ND12_GlassLayers } from "../dev/ND12_GlassLayers";
import { ND12_Upslope } from "../dev/ND12_Upslope";
import { ND12_StoneScale } from "../dev/ND12_StoneScale";
import { ND12_ReportMap } from "../dev/ND12_ReportMap";
import { FPS, PARTS, RAWS, TITLE, timeline, tl } from "./ND12_plan";

const F = (s: number) => Math.round(s * FPS);
const GR = "case/graded/", MD = "case/media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const { segs, end } = timeline();
export const DUR = F(end);

type V = { a: number; b: number; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; dev?: string; over?: React.ReactNode; vo: string };
const H = "hail";
const SH: V[] = [
  { a: 0.0, b: 4.62, src: H, from: 1.0, s0: 1.03, s1: 1.08, over: <RedLabel text="8 MAY 2017, 3:10 PM" at={F(0.4)} hold={F(3.6)} />, vo: "Monday the 8th of May 2017, about ten past three in the afternoon." },
  { a: 4.62, b: 8.54, src: H, from: 72.0, s0: 1.03, s1: 1.08, over: <RedLabel text="I-70 WESTBOUND, WHEAT RIDGE" at={F(0.4)} hold={F(3.0)} />, vo: "Preston is driving home from work on westbound I-70 at Wheat Ridge," },
  { a: 8.54, b: 12.66, src: H, from: 46.0, s0: 1.05, s1: 1.1, fx: 0.75, fy: 0.35, vo: "just west of Denver, while a supercell crossed the west side of the metro." },
  { a: 12.66, b: 18.55, src: H, from: 9.0, s0: 1.04, s1: 1.1, fx: 0.25, vo: "Denver sits at the foot of the Rockies, and the Front Range is one of the most hail-prone places in the United States." },
  { a: 18.55, b: 21.35, src: H, from: 60.0, s0: 1.08, s1: 1.14, fx: 0.75, fy: 0.3, vo: "Hail grows inside a thunderstorm's updraft." },
  { a: 21.35, b: 31.89, dev: "cycle", vo: "A raindrop gets carried up ... falls, gets lifted again, and every trip adds a layer of ice. The size of a hailstone tells you how strong the updraft is." },
  { a: 31.89, b: 35.17, src: H, from: 88.5, s0: 1.03, s1: 1.08, vo: "The storm has to hold the stone up until it's too heavy to stay." },
  { a: 35.17, b: 37.13, src: H, from: 135.95, s0: 1.04, s1: 1.09, vo: "Then the windshield starts to give." },
  { a: 37.13, b: 48.66, dev: "glass", vo: "A windshield is laminated ... Side windows are usually tempered glass, which bursts into thousands of little cubes." },
  { a: 48.66, b: 50.37, src: H, from: 262.0, s0: 1.03, s1: 1.07, vo: "The laminated one holds." },
  { a: 50.37, b: 51.54, src: H, from: 173.0, s0: 1.1, s1: 1.14, vo: "Up to a point." },
  { a: 51.54, b: 53.65, src: H, from: 95.0, s0: 1.03, s1: 1.07, vo: "On an interstate there's nowhere to hide." },
  { a: 53.65, b: 56.46, src: H, from: 296.0, s0: 1.03, s1: 1.08, vo: "Wherever you stop, the hail is still landing on you," },
  { a: 56.46, b: 59.95, src: H, from: 128.0, s0: 1.04, s1: 1.09, vo: "and this storm crossed west Denver just as people were heading home." },
  { a: 59.95, b: 62.24, src: H, from: 233.0, s0: 1.03, s1: 1.07, vo: "He does exactly what you're supposed to do." },
  { a: 62.24, b: 65.33, src: H, from: 366.5, s0: 1.03, s1: 1.07, vo: "Get away from the glass, cover your head and stay low." },
  { a: 65.33, b: 68.42, src: H, from: 52.0, s0: 1.06, s1: 1.12, fx: 0.75, fy: 0.3, vo: "The Front Range gets storms like this because of the mountains." },
  { a: 68.42, b: 75.19, dev: "upslope", vo: "Warm, humid air from the plains is pushed up against the Rockies, and that lift builds storms tall enough to grow hail." },
  { a: 75.19, b: 76.12, src: H, from: 331.0, s0: 1.03, s1: 1.06, vo: "When it was over," },
  { a: 76.12, b: 78.14, src: H, from: 340.5, s0: 1.03, s1: 1.07, vo: "he was still sitting on the interstate," },
  { a: 78.14, b: 80.87, src: H, from: 432.0, s0: 1.03, s1: 1.08, vo: "in a car with no windshield left to speak of." },
  { a: 80.87, b: 84.38, src: H, from: 437.2, s0: 1.03, s1: 1.07, vo: "Preston wasn't hurt, which is more than anyone could say for the car." },
  { a: 84.38, b: 87.95, src: H, from: 444.0, s0: 1.04, s1: 1.08, vo: "The storm cost insurers about 2.3 billion dollars." },
  { a: 87.95, b: 92.82, src: H, from: 385.0, s0: 1.03, s1: 1.08, vo: "At the time, that made it the most expensive single catastrophe in Colorado's history." },
  { a: 92.82, b: 98.14, src: H, from: 343.5, s0: 1.03, s1: 1.08, vo: "Hail is a big reason Colorado's home and car insurance is now some of the priciest in the country." },
  { a: 98.14, b: 99.93, src: H, from: 300.5, s0: 1.04, s1: 1.08, vo: "He never measured his stones." },
  { a: 99.93, b: 104.37, dev: "scale", vo: "The weather service logged hailstones two to two and three quarter inches across." },
  { a: 104.37, b: 112.76, dev: "map", vo: "They fell from Wheat Ridge west to the Colorado Mills mall, right beside this stretch of interstate. Hail smashed the mall's skylights and flooded its stores." },
  { a: 112.76, b: 116.4, dev: "mills", vo: "The mall stayed shut until November." },
  { a: 116.4, b: 120.57, src: H, from: 76.0, s0: 1.04, s1: 1.09, vo: "That cost the city of Lakewood an estimated 350,000 dollars a month in lost sales tax." },
  { a: 120.57, b: 127.16, src: H, from: 421.7, s0: 1.03, s1: 1.09, vo: "Insurers counted more than 150,000 car claims and about 50,000 home claims from one afternoon," },
  { a: 127.16, b: 130.85, src: H, from: 455.5, s0: 1.03, s1: 1.07, vo: "and it ranked as the second costliest hailstorm in American history." },
  { a: 130.85, b: 135.21, src: "hail_replay", from: 0.0, s0: 2.0, s1: 2.12, fx: 0.0, fy: 0.45, vo: "His windshield was built to take a beating, and this storm got through it anyway. (the crazing, half speed)" },
];

const shot = (src: string, n: number, o: Partial<V>) => (
  <FilmLook_FX grain={0.07}><Shot_FX src={GR + src + (o.still ? "" : ".mp4")} n={n} from={o.from} still={o.still} s0={o.s0} s1={o.s1} fx={o.fx} fy={o.fy} /></FilmLook_FX>
);
const device = (d: string): React.ReactNode => {
  switch (d) {
    case "cycle": return <ND12_HailCycle bg={GR + "hail.mp4"} bgFrom={112.0} freezeLabel="FREEZING LEVEL" loopAt={[F(2.6), F(4.4), F(6.3)]} fallAt={F(9.0)} />;
    case "glass": return <ND12_GlassLayers freeze={GR + "glass_freeze.jpg"} temperedAt={F(44.13 - 37.13)} labels={["LAMINATED", "PLASTIC INTERLAYER", "WINDSHIELD", "TEMPERED SIDE WINDOW"]} />;
    case "upslope": return <ND12_Upslope bg={GR + "hail.mp4"} bgFrom={80.5} towerAt={F(71.99 - 68.42)} markLabel="WHEAT RIDGE" rangeLabel="FRONT RANGE" />;
    case "scale": return <ND12_StoneScale freeze={GR + "hood_freeze.jpg"} aAt={F(1.0)} bAt={F(2.4)} aLabel="2.00 IN: HEN EGG" bLabel="2.75 IN: BASEBALL" />;
    case "map": return <ND12_ReportMap src={GR + "naip.jpg"} dropAt={6} every={7} roadAt={F(107.56 - 104.37) - 6} mallAt={F(106.2 - 104.37)} mallLabel="COLORADO MILLS" />;
    case "mills": return <Inset src={GR + "mills.jpg"} still box={0.6} ar={5435 / 2928} pos="70% 75%" label="LAKEWOOD" labelAt={F(0.6)} drift={0.08} />;
  }
  return null;
};

type Pic = { t0: number; t1: number; key: string; node: React.ReactNode };
const PICS: Pic[] = [];
SH.forEach((s) => { const t0 = tl(s.a), t1 = tl(s.b, true), n = F(t1) - F(t0);
  PICS.push({ t0, t1, key: s.dev ?? s.src!, node: <>{s.dev ? device(s.dev) : shot(s.src!, n, s)}{s.over}</> }); });
segs.forEach((g) => { if (g.kind === "raw") { const r = RAWS[g.i]; const n = F(g.t1) - F(g.t0);
  PICS.push({ t0: g.t0, t1: g.t1, key: H, node: shot(H, n, { from: r.from, s0: 1.01, s1: 1.04 }) }); } });
PICS.sort((x, y) => x.t0 - y.t0);

// one camera: every footage -> footage join is a blur-dip; designed cuts: glitch after the title and into the aftermath, whip into the
// hail-growth section, zoom-hit into the glass section
export const CUTS: FxCut[] = [{ at: F(TITLE), kind: "glitch", len: 10 }];
for (let i = 1; i < PICS.length; i++) {
  const t = PICS[i].t0, at = F(t);
  if (Math.abs(t - tl(80.87)) < 0.05) CUTS.push({ at, kind: "glitch", len: 10 });
  else if (Math.abs(t - tl(21.35)) < 0.05) CUTS.push({ at, kind: "whip", len: 10 });
  else if (Math.abs(t - tl(37.13)) < 0.05) CUTS.push({ at, kind: "zoomHit", len: 10 });
  else if (PICS[i].key.startsWith(H) && PICS[i - 1].key.startsWith(H)) CUTS.push({ at, kind: "blurDip", len: 12 });
}

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [tl(21.35) - 0.15, "sfx_n2/whoosh_01.wav", -30],
  [tl(37.13) - 0.1, "sfx_n2/whoosh_03.wav", -28],
  [tl(37.13) + 1.5, X + "impact_4.wav", -30],          // the crack in the top glass
  [tl(44.13) + 0.6, X + "metal_clank_3.wav", -30],     // the tempered pane letting go
  [tl(68.42), X + "wind_gust_1.wav", -30],
  [tl(80.87) - 0.05, "sfx_n2/glitch_03.wav", -28],
  [tl(104.37) + 0.1, "sfx_n2/whoosh_02.wav", -32],
];

// music: Epidemic ambient Music 3 (-13.8 LUFS file, -19.5 dB), out under every raw (the hail is the sound)
const MUSIC_DB = -19.5;
const musicVol = (fr: number) => {
  const t = fr / FPS + TITLE; let v = 1;
  for (const g of segs) if (g.kind === "raw") v = Math.min(v, 1 - interpolate(t, [g.t0 - 0.2, g.t0 + 0.8, g.t1 - 1.0, g.t1 + 0.2], [0, 1, 1, 0], cl));
  return dB(MUSIC_DB) * v * interpolate(fr, [0, 30, F(end - TITLE) - 50, F(end - TITLE) - 5], [0, 1, 1, 0], cl);
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="HAIL ON I-70" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {PICS.map((p, i) => <Sequence key={i} from={F(p.t0)} durationInFrames={F(p.t1) - F(p.t0)} layout="none"><AbsoluteFill>{p.node}</AbsoluteFill></Sequence>)}
        </AbsoluteFill>
      </Transitions_FX>
      {segs.map((g, i) => g.kind === "vo" ? (
        <Sequence key={"v" + i} from={F(g.t0)} durationInFrames={F(g.t1) - F(g.t0)} layout="none"><Audio src={staticFile("vor/CASE12.mp3")} startFrom={F(PARTS[g.i].a)} /></Sequence>
      ) : null)}
      {segs.map((g, i) => { if (g.kind !== "raw") return null; const r = RAWS[g.i]; const n = F(g.snd1) - F(g.t0);
        const env = (f: number) => interpolate(f, [0, 6, n - 20, n], [0, 1, 1, 0], cl);
        return <Sequence key={"r" + i} from={F(g.t0)} durationInFrames={n} layout="none"><Audio src={staticFile(MD + "hail_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(r.from > 400 ? 6 : -1) * env(f)} /></Sequence>; })}
      <Sequence from={F(TITLE)} durationInFrames={F(end - TITLE)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(40)} loop volume={musicVol} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
