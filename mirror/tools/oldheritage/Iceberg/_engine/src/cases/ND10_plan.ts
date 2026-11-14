// ND10 plan (pure data + timeline maths, no JSX): VO parts on the take's clock, the raws between them, the shots under the VO.
// `node --experimental-strip-types src/cases/ND10_plan.ts` prints the timeline and the cutcheck allow windows.
export const FPS = 30;
export const TITLE = 4.0;
export type Part = { a: number; b: number };
export type Raw = { src: string; from: number; len: number; audio?: string; audioFrom?: number; bed?: [string, number, number]; note: string };
export type VShot = { a: number; b: number; src?: string; from?: number; still?: boolean; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; dev?: string; vo: string };

// the take (vor/CASE10.mp3, 172.4 s) split only where a raw plays; a = first word, b = the next part's first word
// 3 Nov owner rule (raws only at the incident): only the first surge across the quay and the Chikyu climax keep their raws; the ten
// raws after the height / irony / Coast Guard / oil-tank / boat-harbour / seawall / still-flooding / view lines are cut, so their parts
// are merged and that VO runs on over silent footage. Was 13 parts / 12 raws.
export const PARTS: Part[] = [
  { a: 0.0, b: 35.14 }, { a: 35.14, b: 71.47 }, { a: 71.47, b: 172.44 },
];
// raw i plays after part i. bed = [file, from, dB]: a real recording of the same tsunami under a silent clip (MAR / NAT have no sound)
export const RAWS: Raw[] = [
  { src: "chk", from: 37.0, len: 11.3, audio: "chk", note: "the sea surging across the quay below the Chikyu" },
  { src: "chk2", from: 103.0, len: 54.0, audio: "chk2", note: "CLIMAX: the Chikyu turning in the port, 'we're in big trouble ... we have just hit the quayside ... twenty degrees'" },
];
export const GAP_OUT = 0.3; // raw sound end -> next VO (the take's own pause sits before each raw)

export type Seg = { kind: "vo"; i: number; t0: number; t1: number } | { kind: "raw"; i: number; t0: number; t1: number; snd1: number };
export const timeline = () => {
  const segs: Seg[] = []; let t = TITLE;
  PARTS.forEach((p, i) => {
    const d = p.b - p.a; segs.push({ kind: "vo", i, t0: t, t1: t + d }); t += d;
    const r = RAWS[i]; if (!r) return;
    const snd1 = t + r.len; segs.push({ kind: "raw", i, t0: t, t1: snd1 + GAP_OUT, snd1 }); t = snd1 + GAP_OUT;
  });
  return { segs, end: t + 0.6 };
};
/** a take time -> timeline seconds (inside its part) */
export const tl = (take: number, isEnd = false) => { const { segs } = timeline(); for (const s of segs) if (s.kind === "vo") { const p = PARTS[s.i];
  if (isEnd ? take > p.a + 1e-6 && take <= p.b + 1e-6 : take >= p.a - 1e-6 && take < p.b - 1e-6) return s.t0 + (take - p.a); } throw new Error("take " + take); };

if (typeof process !== "undefined" && Array.isArray(process.argv) && process.argv[1] && process.argv[1].endsWith("ND10_plan.ts")) {
  const { segs, end } = timeline();
  segs.forEach((s) => console.log(s.kind, s.i, s.t0.toFixed(2), s.t1.toFixed(2)));
  console.log("end", end.toFixed(2), Math.round(end * FPS));
}
