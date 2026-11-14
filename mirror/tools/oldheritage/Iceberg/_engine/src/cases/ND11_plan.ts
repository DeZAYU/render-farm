// ND11 plan (pure data + timeline maths): VO parts on the take's clock, the raws between them.
export const FPS = 30;
export const TITLE = 4.0;
export type Part = { a: number; b: number };
// mute = source-second windows dipped to silence (strong language in the friends' audio)
export type Raw = { from: number; len: number; gap?: number; mute?: [number, number][]; note: string };

// 3 Nov owner rule (raws only at the incident): the run, the slide, the friend arriving, the face (climax). The three dig raws that sat
// after the fifteen-minute / kit / boring-advice explanation are cut and those parts merged (was 8 parts / 7 raws); that VO runs on over
// the silent dig.
export const PARTS: Part[] = [
  { a: 0.0, b: 24.65 }, { a: 24.65, b: 36.17 }, { a: 36.17, b: 55.01 }, { a: 55.01, b: 98.19 }, { a: 98.19, b: 112.78 },
];
export const RAWS: Raw[] = [
  { from: 15.0, len: 14.0, mute: [[21.15, 22.55]], note: "the run: whoops, then the slope goes, 'Where's James?'" },
  { from: 30.6, len: 15.35, gap: 0.85, note: "the slide slowing, the frame going white, then black (held on the source's own black)" },
  { from: 50.0, len: 14.0, note: "the friend's camera arriving at the debris, starting to search" },
  { from: 262.5, len: 28.3, mute: [[267.15, 268.55]], note: "CLIMAX: 'That's him! That's his helmet!' ... 'James?' ... 'Yeah, we got him' ... 'We're here, we're here'" },
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

if (typeof process !== "undefined" && Array.isArray(process.argv) && process.argv[1] && process.argv[1].endsWith("ND11_plan.ts")) {
  const { segs, end } = timeline();
  segs.forEach((s) => console.log(s.kind, s.i, s.t0.toFixed(2), s.t1.toFixed(2)));
  console.log("end", end.toFixed(2), Math.round(end * FPS));
}
