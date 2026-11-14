// Natural Disasters #10: Hachinohe, 11 March 2011, from the deck of the Chikyu (JAMSTEC). Channel grammar (TitleCard, RedLabel, Inset,
// Aerial, glitch / blur-dip) + devices built for this case's beats (dev/ND10_*):
//   CoastPlate    the hit coast traced on a tilted NASA relief plate, landing on Hachinohe at its northern end
//   ShoalProfile  why ships are safer at sea: the pulse low and long over deep water, short and tall in the shallows
//   ShipMeasure   the Chikyu's 210 m measured bow -> stern on a side-on photo
//   WallPair      Taro's seawall in 2007 and what was left of it in 2014, as two prints in 3-D
//   TrenchVoyage  the 2012 trip from Hachinohe to the JFAST drill site over the Japan Trench, past the epicentre
// Footage: the Chikyu's crew (two cameras, JAMSTEC; credit lines framed out), the Japan Coast Guard Hachinohe office (city channel),
// the Same boat harbour (silent), a house above the port (silent). Silent raws carry a real recording of the same tsunami (the Chikyu deck
// audio: wind + water, no voices) under them. VO = one take (no count word in this take), split only where a raw plays.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { ND10_CoastPlate } from "../dev/ND10_CoastPlate";
import { ND10_ShoalProfile } from "../dev/ND10_ShoalProfile";
import { ND10_ShipMeasure } from "../dev/ND10_ShipMeasure";
import { ND10_WallPair } from "../dev/ND10_WallPair";
import { ND10_TrenchVoyage } from "../dev/ND10_TrenchVoyage";
import { FPS, PARTS, RAWS, TITLE, timeline, tl, type VShot } from "./ND10_plan";

const F = (s: number) => Math.round(s * FPS);
const GR = "case/graded/", MD = "case/media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const { segs, end } = timeline();
export const DUR = F(end);

// shots under the VO, on the take's clock (a / b = take seconds)
const V: VShot[] = [
  { a: 0.0, b: 4.11, src: "chk2", from: 14.0, s0: 1.04, s1: 1.1, vo: "We've already seen what the 2011 tsunami did in narrow bays further south." },
  { a: 4.11, b: 8.18, src: "cga", from: 62.0, s0: 1.03, s1: 1.09, fy: 0.6, vo: "Hachinohe shows what it looked like in a port that mostly got away with it." },
  { a: 8.18, b: 13.37, dev: "coast", vo: "Hachinohe, in Aomori Prefecture, sits at the northern end of the coast that was hit." },
  { a: 13.37, b: 16.0, src: "nat", from: 2.0, s0: 1.03, s1: 1.08, vo: "It's a big fishing and industrial port" },
  { a: 16.0, b: 18.79, src: "cga", from: 16.0, s0: 1.08, s1: 1.14, fy: 0.45, vo: "behind a long breakwater built to take the edge off storm waves." },
  { a: 18.79, b: 21.24, src: "chk", from: 9.2, s0: 1.03, s1: 1.08, vo: "The Chikyu was tied up there that afternoon." },
  { a: 21.24, b: 26.15, dev: "chikyu1", vo: "It's a deep-sea drilling ship run by JAMSTEC, Japan's marine research agency." },
  { a: 26.15, b: 29.87, src: "chikyu2.jpg", still: true, s0: 1.55, s1: 1.75, fx: 0.73, fy: 0.12, vo: "It was built to drill deeper into the sea floor than any ship before it, (the derrick)" },
  { a: 29.87, b: 32.47, src: "chk", from: 1.0, s0: 1.04, s1: 1.1, vo: "into the same kind of fault that had just slipped. (the first water coming in under the ship's crane)" },
  { a: 32.47, b: 35.14, src: "chk", from: 13.0, s0: 1.03, s1: 1.07, vo: "Its crew were aboard, along with visitors. (walking the deck)" },
  { a: 35.14, b: 38.28, src: "chk", from: 52.0, s0: 1.04, s1: 1.1, vo: "At Hachinohe the tsunami ran five to six metres," },
  { a: 38.28, b: 40.41, src: "chk2", from: 60.5, s0: 1.05, s1: 1.1, vo: "and eight to nine in the port area." },
  { a: 40.41, b: 43.3, src: "chk2", from: 66.0, s0: 1.04, s1: 1.09, vo: "There's an irony here. In a tsunami," },
  { a: 43.3, b: 45.89, src: "chk2", from: 26.0, s0: 1.06, s1: 1.1, vo: "ships are usually safer out at sea than tied up in port." },
  { a: 45.89, b: 50.53, dev: "shoal", vo: "In deep water the wave is low and spread out. It only piles up in the shallows." },
  { a: 50.53, b: 55.39, src: "chk2", from: 38.5, s0: 1.12, s1: 1.22, fx: 0.45, fy: 0.55, vo: "Some fishing crews along this coast raced straight out of harbour toward the wave that afternoon." },
  { a: 55.39, b: 56.93, src: "chk", from: 68.5, s0: 1.03, s1: 1.06, vo: "The Chikyu was tied up." },
  { a: 56.93, b: 61.44, src: "chk2", from: 46.0, s0: 1.04, s1: 1.09, vo: "The ship got out of the port as soon as it could, with one of its six thrusters damaged." },
  { a: 61.44, b: 65.67, src: "chk2", from: 228.5, s0: 1.03, s1: 1.07, vo: "JAMSTEC said everyone aboard was accounted for, staff and visitors alike." },
  { a: 65.67, b: 69.0, dev: "measure", vo: "The Chikyu is 210 metres long," },
  { a: 69.0, b: 71.47, src: "chk2", from: 88.0, s0: 1.04, s1: 1.08, vo: "and in water like this even a ship that size can only hold on." },
  { a: 71.47, b: 73.29, src: "cga", from: 120.0, s0: 1.03, s1: 1.07, vo: "At the Coast Guard office by the harbour," },
  { a: 73.29, b: 76.31, src: "cga", from: 195.0, s0: 1.04, s1: 1.08, vo: "watching this water was the actual job that afternoon." },
  { a: 76.31, b: 79.26, src: "cga", from: 240.0, s0: 1.05, s1: 1.1, vo: "The first surges into a port can look almost harmless." },
  { a: 79.26, b: 81.69, src: "cga", from: 271.0, s0: 1.04, s1: 1.09, vo: "What matters is how much water is behind them." },
  { a: 81.69, b: 84.84, src: "cgb", from: 140.0, s0: 1.03, s1: 1.07, vo: "On the town side of the port, the water was already in the streets." },
  { a: 84.84, b: 88.28, src: "cgb", from: 196.0, s0: 1.04, s1: 1.09, vo: "Even here, the small oil tanks in the port were swept away," },
  { a: 88.28, b: 90.23, src: "cgb", from: 250.0, s0: 1.05, s1: 1.09, vo: "and their fuel went into the water." },
  { a: 90.23, b: 93.6, dev: "same", vo: "Further along the shore, in the Same district," },
  { a: 93.6, b: 96.91, src: "mar", from: 24.0, fill: true, s0: 1.0, s1: 1.04, vo: "the boat harbour beside the city's fisheries museum was taking the surge head on." },
  { a: 96.91, b: 100.16, src: "mar", from: 105.0, fill: true, s0: 1.0, s1: 1.04, vo: "Small boat harbours take some of the worst damage in a tsunami," },
  { a: 100.16, b: 103.89, src: "mar", from: 150.0, fill: true, s0: 1.02, s1: 1.06, vo: "because the water speeds up as it squeezes through their narrow mouths." },
  { a: 103.89, b: 106.17, src: "mar", from: 165.5, fill: true, s0: 1.0, s1: 1.04, vo: "At the seawall, it went straight over." },
  { a: 106.17, b: 113.22, dev: "walls", vo: "Japan spent decades building seawalls along this coast, and in a lot of places the 2011 wave went straight over them." },
  { a: 113.22, b: 116.37, src: "cga", from: 90.0, s0: 1.06, s1: 1.1, fy: 0.45, vo: "Bigger ones have gone up since, and some locals hate them," },
  { a: 116.37, b: 119.37, src: "cga", from: 150.0, s0: 1.04, s1: 1.08, vo: "because now they can't see the sea they're meant to be watching." },
  { a: 119.37, b: 122.88, src: "nat", from: 10.0, s0: 1.03, s1: 1.08, vo: "By about four o'clock, more than an hour after the earthquake," },
  { a: 122.88, b: 126.19, src: "nat", from: 90.0, s0: 1.06, s1: 1.11, fx: 0.55, vo: "the port was still flooding. That's the part people forget." },
  { a: 126.19, b: 129.51, src: "nat", from: 130.0, s0: 1.03, s1: 1.08, vo: "The port fills, drains and fills again for hours." },
  { a: 129.51, b: 134.04, src: "nat", from: 110.0, s0: 1.0, s1: 1.05, fy: 0.7, vo: "For the people living above this port, this was the view from their windows every day." },
  { a: 134.04, b: 136.98, src: "nat", from: 289.0, s0: 1.04, s1: 1.09, vo: "In Hachinohe the tsunami threw fishing boats ashore," },
  { a: 136.98, b: 140.61, src: "cgb", from: 300.0, s0: 1.03, s1: 1.08, vo: "badly damaged the port and destroyed about a hundred homes." },
  { a: 140.61, b: 142.37, src: "cgb", from: 240.0, s0: 1.05, s1: 1.08, vo: "Across the whole disaster," },
  { a: 142.37, b: 146.5, src: "cgb", from: 340.0, s0: 1.03, s1: 1.07, vo: "official figures give 19,759 people who lost their lives" },
  { a: 146.5, b: 150.99, src: "chk", from: 150.0, s0: 1.04, s1: 1.09, vo: "and 2,553 still missing." },
  { a: 150.99, b: 154.12, dev: "fuku", vo: "Three reactors at Fukushima Daiichi melted down." },
  { a: 154.12, b: 162.22, dev: "voyage", vo: "A year later, the Chikyu went back out and drilled into the fault that caused all of it. The aim was to measure the heat the slip had left behind in the rock." },
  { a: 162.22, b: 165.4, src: "chk2", from: 239.5, s0: 1.04, s1: 1.08, vo: "JAMSTEC had to cancel the 68-day drilling expedition" },
  { a: 165.4, b: 168.56, src: "chk2", from: 254.6, s0: 1.03, s1: 1.07, vo: "the ship was due to start four days after the wave." },
  { a: 168.56, b: 172.44, src: "chk2", from: 0.8, s0: 1.02, s1: 1.07, vo: "The ship that rode out the tsunami went back to find where it came from." },
];

type Pic = { t0: number; t1: number; key: string; node: React.ReactNode };
const shot = (src: string, n: number, o: Partial<VShot>) => (
  <FilmLook_FX grain={0.07}><Shot_FX src={GR + src + (o.still ? "" : ".mp4")} n={n} from={o.from} still={o.still} fill={o.fill} s0={o.s0} s1={o.s1} fx={o.fx} fy={o.fy} /></FilmLook_FX>
);
const device = (d: string, n: number): React.ReactNode => {
  switch (d) {
    case "coast": return <ND10_CoastPlate src={GR + "bm.jpg"} label="HACHINOHE, AOMORI" drawAt={4} drawLen={F(3.0)} pinAt={F(3.25)} />;
    case "chikyu1": return <>{shot("chikyu1.jpg", n, { still: true, s0: 1.03, s1: 1.16, fx: 0.5, fy: 0.6 })}<RedLabel text="CHIKYU · JAMSTEC" at={F(1.0)} y={0.86} /></>; // full frame (one Inset per case)
    case "shoal": return <ND10_ShoalProfile bg={GR + "chk2.mp4"} bgFrom={30} deepLabel="OPEN OCEAN: UNDER 1 M" shallowLabel="PORT: 8-9 M" />;
    case "measure": return <ND10_ShipMeasure src={GR + "chikyu2.jpg"} iw={1938} ih={1449} bow={[40, 1300]} stern={[1905, 1300]} focus={[969, 1000]} at={6} len={F(1.4)} label="210 METRES" z0={1.0} z1={1.05} />;
    case "same": return <Aerial src={GR + "same16.jpg"} iw={1536} ih={1536} spot={[1170, 500, 1430, 750]} z0={1.0} z1={1.3} label="SAME, HACHINOHE" boxAt={8} labelAt={16} />;
    case "walls": return <ND10_WallPair a={GR + "taro_high.jpg"} b={GR + "taro_wall.jpg"} at={F(109.43 - 106.17)} aLabel="TARO SEAWALL, 2007" bLabel="TARO SEAWALL, 2014" bPos="40% 60%" />;
    case "fuku": return <Inset src={GR + "fuku.jpg"} still box={0.62} ar={1576 / 916} label="FUKUSHIMA DAIICHI, MARCH 2011" labelAt={F(0.7)} drift={0.07} />;
    case "voyage": return <ND10_TrenchVoyage src={GR + "bm2.jpg"} trackAt={8} trackLen={F(4.2)} epiAt={F(2.0)} siteAt={F(4.5)} depthAt={F(5.4)} label="JFAST DRILL SITE, 2012" />;
  }
  return null;
};

const PICS: Pic[] = [];
V.forEach((s, i) => {
  const t0 = tl(s.a), t1 = tl(s.b, true), n = F(t1) - F(t0);
  PICS.push({ t0, t1, key: s.dev ?? s.src!, node: s.dev ? device(s.dev, n) : shot(s.src!, n, s) });
  void i;
});
segs.forEach((g) => { if (g.kind === "raw") { const r = RAWS[g.i]; const n = F(g.t1) - F(g.t0);
  PICS.push({ t0: g.t0, t1: g.t1, key: r.src, node: shot(r.src, n, { from: r.from, fill: r.src === "mar", s0: r.src === "mar" ? 1.0 : 1.02, s1: r.src === "mar" ? 1.03 : 1.05 }) }); } });
PICS.sort((x, y) => x.t0 - y.t0);

// transitions: glitch after the title and into each new place (Coast Guard office, Same, the outcome); blur-dip on every same-camera
// join; a zoom-hit into the shoaling section; everything else hard
const GLITCH_AT = [TITLE, tl(71.47), tl(90.23), tl(134.04)];
export const CUTS: FxCut[] = [];
for (let i = 1; i < PICS.length; i++) {
  const at = F(PICS[i].t0), same = PICS[i].key === PICS[i - 1].key;
  if (GLITCH_AT.some((g) => Math.abs(g - PICS[i].t0) < 0.05)) CUTS.push({ at, kind: "glitch", len: 10 });
  else if (same) CUTS.push({ at, kind: "blurDip", len: 12 });
  else if (Math.abs(PICS[i].t0 - tl(45.89)) < 0.05) CUTS.push({ at, kind: "zoomHit", len: 10 });
}
CUTS.unshift({ at: F(TITLE), kind: "glitch", len: 10 });

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [tl(8.18), "sfx_n2/whoosh_01.wav", -30],
  [tl(45.89) - 0.15, "sfx_n2/whoosh_03.wav", -28],
  [tl(71.47) - 0.05, "sfx_n2/glitch_03.wav", -28],
  [tl(90.23) - 0.05, "sfx_n2/glitch_01.wav", -28],
  [tl(106.17) + 0.05, X + "page_turn_1.wav", -26],
  [tl(109.43) - 0.2, "sfx_n2/whoosh_02.wav", -30],
  [tl(134.04) - 0.05, "sfx_n2/glitch_02.wav", -28],
  [tl(154.12), "sfx_n2/whoosh_01.wav", -30],
];

// music: Epidemic ambient Music 4 (-11.9 LUFS file, ~-21.5 dB = ~10 LU under the VO), ducked out under the raws, back for the VO
const MUSIC_DB = -21.5;
const musicVol = (fr: number) => {
  const t = fr / FPS + TITLE;
  let v = 1;
  for (const g of segs) if (g.kind === "raw") {
    const quiet = RAWS[g.i].src === "chk2" ? 0 : 0.35; // the climax plays with no music at all
    const k = interpolate(t, [g.t0 - 0.2, g.t0 + 0.8, g.t1 - 1.0, g.t1 + 0.2], [0, 1, 1, 0], cl);
    v = Math.min(v, 1 - (1 - quiet) * k);
  }
  return dB(MUSIC_DB) * v * interpolate(fr, [0, 30, F(end - TITLE) - 50, F(end - TITLE) - 5], [0, 1, 1, 0], cl);
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="FROM THE DECK OF THE CHIKYU" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {PICS.map((p, i) => (
            <Sequence key={i} from={F(p.t0)} durationInFrames={F(p.t1) - F(p.t0)} layout="none"><AbsoluteFill>{p.node}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the one take, split only at the raws (each part runs to the next part's first word, so the take's own pauses stay) */}
      {segs.map((g, i) => g.kind === "vo" ? (
        <Sequence key={"v" + i} from={F(g.t0)} durationInFrames={F(g.t1) - F(g.t0)} layout="none"><Audio src={staticFile("vor/CASE10.mp3")} startFrom={F(PARTS[g.i].a)} /></Sequence>
      ) : null)}
      {/* raw sound: only inside the raw windows, faded to 0 before the VO returns */}
      {segs.map((g, i) => { if (g.kind !== "raw") return null; const r = RAWS[g.i]; const n = F(g.snd1) - F(g.t0);
        const env = (f: number) => interpolate(f, [0, 6, n - 20, n], [0, 1, 1, 0], cl);
        return (<React.Fragment key={"r" + i}>
          {r.audio && <Sequence from={F(g.t0)} durationInFrames={n} layout="none"><Audio src={staticFile(MD + r.audio + "_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(r.audio === "chk2" ? 2 : 0) * env(f)} /></Sequence>}
          {r.bed && <Sequence from={F(g.t0)} durationInFrames={n} layout="none"><Audio src={staticFile(MD + r.bed[0] + "_clean.wav")} startFrom={F(r.bed[1])} volume={(f) => dB(r.bed![2]) * env(f)} /></Sequence>}
        </React.Fragment>); })}
      <Sequence from={F(TITLE)} durationInFrames={F(end - TITLE)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(14)} loop volume={musicVol} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
