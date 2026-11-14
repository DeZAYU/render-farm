// Natural Disasters #11: James Mort, buried in an in-bounds slab avalanche on the Swiss-French border (30 Jan 2015), dug out by his
// friends on camera. Channel grammar (TitleCard, RedLabel, Inset, glitch / blur-dip) + devices built for this case (dev/ND11_*):
//   ChargePush     patroller paying out a charge -> push through the bracket into a control blast (in bounds = the managed slopes)
//   SlabSection    the snowpack cut on the slope: crown crack, weak layer, the slab sliding as one block with the skier on it
//   SurvivalCurve  Brugger et al. 2001 survival curve, marker at 15 minutes, then the drop
//   KitStrip       beacon / probe / shovel as three panels in a 3-D arc, each lit on its word (the shovel is the dig's own red shovel)
// One source: the group's own helmet camera (O'Sullivan's dig). Strong language in the raws is dipped out. The resort is not named.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { ND11_ChargePush } from "../dev/ND11_ChargePush";
import { ND11_SlabSection } from "../dev/ND11_SlabSection";
import { ND11_SurvivalCurve } from "../dev/ND11_SurvivalCurve";
import { ND11_KitStrip } from "../dev/ND11_KitStrip";
import { FPS, PARTS, RAWS, TITLE, timeline, tl } from "./ND11_plan";

const F = (s: number) => Math.round(s * FPS);
const GR = "case/graded/", MD = "case/media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const { segs, end } = timeline();
export const DUR = F(end);

type V = { a: number; b: number; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; dev?: string; over?: React.ReactNode; vo: string };
const M = "mrt";
const SH: V[] = [
  { a: 0.0, b: 3.38, src: M, from: 4.6, s0: 1.03, s1: 1.08, over: <RedLabel text="JAMES MORT" at={F(0.3)} hold={F(2.6)} />, vo: "Those are James Mort's skis. Mort is Australian." },
  { a: 3.38, b: 8.97, src: M, from: 300.2, s0: 1.02, s1: 1.1, fy: 0.4, over: <><RedLabel text="30 JANUARY 2015" at={F(0.2)} hold={F(2.0)} /><RedLabel text="SWISS-FRENCH BORDER" at={F(2.55)} hold={F(2.6)} /></>, vo: "On the 30th of January 2015, he was at a resort on the border between Switzerland and France." },
  { a: 8.97, b: 15.16, src: M, from: 8.6, s0: 1.02, s1: 1.07, vo: "He was skiing in bounds, inside the area the resort manages, on a run that wasn't known for avalanches." },
  { a: 15.16, b: 24.65, dev: "charge", vo: "In bounds is meant to be the safe part. Ski patrols look after those slopes, often using explosives to bring down unstable snow before anyone skis it." },
  { a: 24.65, b: 32.25, dev: "slab", vo: "The snow he was standing on broke away as one slab and took him with it. Most avalanches that catch people work exactly like this." },
  { a: 32.25, b: 36.17, src: M, from: 0.3, s0: 1.08, s1: 1.16, fx: 0.6, fy: 0.3, vo: "The person caught, or someone in their own group, sets it off." },
  { a: 36.17, b: 38.35, src: M, from: 47.3, s0: 1.04, s1: 1.08, vo: "Avalanche debris isn't fresh powder." },
  { a: 38.35, b: 41.15, src: M, from: 99.5, s0: 1.03, s1: 1.08, vo: "When it stops moving it sets almost like concrete," },
  { a: 41.15, b: 44.4, src: M, from: 212.5, s0: 1.05, s1: 1.1, vo: "so even someone with a free hand usually can't dig out." },
  { a: 44.4, b: 46.65, src: M, from: 88.0, s0: 1.03, s1: 1.07, vo: "You're relying on whoever is still on top." },
  { a: 46.65, b: 49.37, src: M, from: 76.0, s0: 1.04, s1: 1.08, over: <RedLabel text="DANIEL O'SULLIVAN" at={F(0.3)} hold={F(2.2)} />, vo: "His friend Daniel O'Sullivan was on top." },
  { a: 49.37, b: 55.01, src: M, from: 191.5, s0: 1.04, s1: 1.16, fx: 0.55, fy: 0.45, vo: "According to Global News, the group found Mort after he managed to push a ski pole up through the snow." },
  { a: 55.01, b: 63.88, dev: "curve", vo: "This is the number that matters. Most people buried ... within about fifteen minutes, and after that the odds fall away fast." },
  { a: 63.88, b: 67.77, src: M, from: 165.0, s0: 1.03, s1: 1.08, vo: "By the time a professional rescue team arrives, it's usually too late," },
  { a: 67.77, b: 70.5, src: M, from: 222.0, s0: 1.04, s1: 1.08, vo: "so the person standing next to you is the rescue." },
  { a: 70.5, b: 73.69, src: M, from: 116.0, s0: 1.04, s1: 1.09, vo: "Mort said afterwards that his group was poorly prepared." },
  { a: 73.69, b: 79.97, dev: "kit", vo: "A beacon tells your friends where you are under the snow, a probe pins down the spot and a shovel gets you out." },
  { a: 79.97, b: 83.57, src: M, from: 102.0, s0: 1.04, s1: 1.09, vo: "Without them, people search by eye and dig with whatever they have." },
  { a: 83.57, b: 88.79, src: M, from: 176.0, s0: 1.03, s1: 1.08, vo: "I haven't found a reliable figure for how long he was under, so I'm not going to put a number on it." },
  { a: 88.79, b: 91.16, src: M, from: 182.5, s0: 1.1, s1: 1.15, fx: 0.4, vo: "Most good avalanche advice is boring." },
  { a: 91.16, b: 93.34, dev: "gear", vo: "Check the forecast and carry the kit." },
  { a: 93.34, b: 96.64, src: M, from: 232.5, s0: 1.04, s1: 1.09, vo: "What happened to Mort is what skipping the boring part looks like." },
  { a: 96.64, b: 98.19, src: M, from: 257.0, s0: 1.3, s1: 1.36, fx: 0.5, fy: 0.55, vo: "Watch for his face." },
  { a: 98.19, b: 102.5, src: "mrt_replay", from: 0.0, s0: 1.12, s1: 1.22, fx: 0.5, fy: 0.5, vo: "James Mort survived. He later urged... (the face cleared, half speed)" },
  { a: 102.5, b: 104.58, src: M, from: 296.0, s0: 1.03, s1: 1.07, vo: "...to learn from his group's mistakes and get avalanche training," },
  { a: 104.58, b: 107.67, src: M, from: 306.2, s0: 1.04, s1: 1.09, vo: "even if they never plan to leave the marked runs." },
  { a: 107.67, b: 112.78, src: M, from: 309.6, s0: 1.02, s1: 1.07, vo: "Admitting you were that unprepared, in public, is exactly what makes the lesson stick." },
];

const shot = (src: string, n: number, o: Partial<V>) => (
  <FilmLook_FX grain={0.07}><Shot_FX src={GR + src + (o.still ? "" : ".mp4")} n={n} from={o.from} still={o.still} s0={o.s0} s1={o.s1} fx={o.fx} fy={o.fy} /></FilmLook_FX>
);
const device = (d: string): React.ReactNode => {
  switch (d) {
    case "charge": return <ND11_ChargePush a={{ src: GR + "declench.jpg", iw: 960, ih: 720 }} b={{ src: GR + "blast.jpg", iw: 3456, ih: 2304 }} box={[322, 280, 402, 330]} bFocus={[1330, 1480]} boxAt={F(2.6)} pushAt={F(19.97 - 15.16) - 4} />;
    case "slab": return <ND11_SlabSection bg={GR + "mrt.mp4"} bgFrom={24.0} crackAt={F(1.2)} runLen={F(1.3)} slideAt={F(2.8)} labels={["SLAB", "WEAK LAYER", "CROWN"]} />;
    case "curve": return <ND11_SurvivalCurve bg={GR + "mrt.mp4"} bgFrom={130.0} markAt={F(60.6 - 55.01)} drawLen={F(2.4)} markLabel="15 MINUTES" />;
    case "kit": return <ND11_KitStrip bg={GR + "mrt.mp4"} bgFrom={145.0} panels={[
      { src: GR + "beacon.jpg", still: true, pos: "38% 60%", at: 0 },
      { src: GR + "probe.jpg", still: true, pos: "50% 45%", at: F(76.55 - 73.69) },
      { src: GR + "mrt.mp4", from: 150.0, pos: "45% 50%", at: F(78.75 - 73.69) },
    ]} />;
    case "gear": return <Inset src={GR + "kit.jpg"} still box={0.5} ar={2205 / 1794} drift={0.07} />;
  }
  return null;
};

type Pic = { t0: number; t1: number; key: string; node: React.ReactNode };
const PICS: Pic[] = [];
SH.forEach((s) => { const t0 = tl(s.a), t1 = tl(s.b, true), n = F(t1) - F(t0);
  PICS.push({ t0, t1, key: s.dev ?? s.src!, node: <>{s.dev ? device(s.dev) : shot(s.src!, n, s)}{s.over}</> }); });
segs.forEach((g) => { if (g.kind === "raw") { const r = RAWS[g.i]; const n = F(g.t1) - F(g.t0);
  PICS.push({ t0: g.t0, t1: g.t1, key: M, node: shot(M, n, { from: r.from, s0: 1.01, s1: 1.04 }) }); } });
PICS.sort((x, y) => x.t0 - y.t0);

// same camera everywhere: every footage -> footage join gets a blur-dip unless a designed cut sits there
const GLITCH_AT = [tl(36.17), tl(98.19)];
export const CUTS: FxCut[] = [{ at: F(TITLE), kind: "glitch", len: 10 }];
for (let i = 1; i < PICS.length; i++) {
  const t = PICS[i].t0, at = F(t);
  if (GLITCH_AT.some((g) => Math.abs(g - t) < 0.05)) continue; // tl(36.17): the fade up from the source's black, below
  if (Math.abs(t - tl(55.01)) < 0.05) CUTS.push({ at, kind: "zoomHit", len: 10 });
  else if (Math.abs(t - tl(15.16)) < 0.05) CUTS.push({ at, kind: "whip", len: 10 });
  else if (PICS[i].key === PICS[i - 1].key || PICS[i].key.startsWith("mrt") && PICS[i - 1].key.startsWith("mrt")) CUTS.push({ at, kind: "blurDip", len: 12 });
}
CUTS.push({ at: F(tl(98.19)), kind: "glitch", len: 10 });

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_01.wav", -24],
  [tl(15.16) - 0.15, "sfx_n2/whoosh_02.wav", -30],
  [tl(19.97) - 0.1, X + "boom_2.wav", -22],      // the control charge going off (photo 2)
  [tl(24.65) + 1.15, X + "impact_1.wav", -28],    // the crown cracking in the section
  [tl(55.01) - 0.1, "sfx_n2/whoosh_03.wav", -28],
  [tl(98.19) - 0.05, "sfx_n2/glitch_03.wav", -28],
];

// music: Epidemic ambient Music 1 (-18.3 LUFS file, -15 dB = ~10 LU under the VO), out under every raw (the friends' voices)
const MUSIC_DB = -15.0;
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
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="BURIED IN BOUNDS" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {PICS.map((p, i) => {
            const fadeUp = Math.abs(p.t0 - tl(36.17)) < 0.05; // out of the burial black
            return (<Sequence key={i} from={F(p.t0)} durationInFrames={F(p.t1) - F(p.t0)} layout="none"><AbsoluteFill>{p.node}
              {fadeUp && <FadeFromBlack n={14} />}</AbsoluteFill></Sequence>);
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {segs.map((g, i) => g.kind === "vo" ? (
        <Sequence key={"v" + i} from={F(g.t0)} durationInFrames={F(g.t1) - F(g.t0)} layout="none"><Audio src={staticFile("vor/CASE11.mp3")} startFrom={F(PARTS[g.i].a)} /></Sequence>
      ) : null)}
      {segs.map((g, i) => { if (g.kind !== "raw") return null; const r = RAWS[g.i]; const n = F(g.snd1) - F(g.t0);
        const env = (f: number) => { let v = interpolate(f, [0, 6, n - 20, n], [0, 1, 1, 0], cl); const s = r.from + f / FPS;
          for (const [a, b] of r.mute ?? []) v *= 1 - interpolate(s, [a - 0.08, a, b, b + 0.08], [0, 1, 1, 0], cl); return v; };
        return <Sequence key={"r" + i} from={F(g.t0)} durationInFrames={n} layout="none"><Audio src={staticFile(MD + "mrt_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(1) * env(f)} /></Sequence>; })}
      <Sequence from={F(TITLE)} durationInFrames={F(end - TITLE)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(6)} loop volume={musicVol} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeFromBlack: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [1, 0], cl) }} />;
};
