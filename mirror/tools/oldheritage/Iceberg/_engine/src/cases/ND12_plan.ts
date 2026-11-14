// ND12 plan (pure data + timeline maths): VO parts on the take's clock, the raws between them.
export const FPS = 30;
export const TITLE = 4.0;
export type Part = { a: number; b: number };
// mute = source-second windows dipped to silence
export type Raw = { from: number; len: number; gap?: number; mute?: [number, number][]; note: string };

// 3 Nov owner rule (raws only at the incident): first stones, the windshield giving, the broken glass as he gets low, afterwards. The
// four raws after the hail-growth / laminated-glass / interstate / Front Range explanation are cut and those parts merged (was 9 parts /
// 8 raws); that VO runs on over silent footage.
export const PARTS: Part[] = [
  { a: 0.0, b: 18.55 }, { a: 18.55, b: 37.13 }, { a: 37.13, b: 65.33 }, { a: 65.33, b: 80.87 }, { a: 80.87, b: 135.21 },
];
export const RAWS: Raw[] = [
  { from: 23.0, len: 14.0, note: "first stones on the glass: 'Dude, that one is a hail ... hail, baby' (dash + phone, the uploader's split)" },
  { from: 141.0, len: 16.4, note: "the windshield starring and crazing under the stones (dash + phone split, up to the source cut at 2:37.7)" },
  { from: 240.0, len: 16.0, note: "broken glass over the dash as the hail keeps coming" },
  { from: 402.7, len: 17.8, note: "afterwards: the dented blue car, glass gone" },
];
export const GAP_OUT = 0.3;

export type Seg = { kind: "vo"; i: number; t0: number; t1: number } | { kind: "raw"; i: number; t0: number; t1: number; snd1: number };
export const timeline = () => {
  const segs: Seg[] = []; let t = TITLE;
  PARTS.forEach((p, i) => {
    const d = p.b - p.a; segs.push({ kind: "vo", i, t0: t, t1: t + d }); t += d;
    const r = RAWS[i]; if (!r) return;
    const snd1 = t + r.len; const t1 = snd1 + (r.gap ?? GAP_OUT); segs.push({ kind: "raw", i, t0: t, t1, snd1 }); t = t1;
  });
  return { segs, end: t + 0.6 };
};
export const tl = (take: number, isEnd = false) => { const { segs } = timeline(); for (const s of segs) if (s.kind === "vo") { const p = PARTS[s.i];
  if (isEnd ? take > p.a + 1e-6 && take <= p.b + 1e-6 : take >= p.a - 1e-6 && take < p.b - 1e-6) return s.t0 + (take - p.a); } throw new Error("take " + take); };

if (typeof process !== "undefined" && Array.isArray(process.argv) && process.argv[1] && process.argv[1].endsWith("ND12_plan.ts")) {
  const { segs, end } = timeline();
  segs.forEach((s) => console.log(s.kind, s.i, s.t0.toFixed(2), s.t1.toFixed(2)));
  console.log("end", end.toFixed(2), Math.round(end * FPS));
}
