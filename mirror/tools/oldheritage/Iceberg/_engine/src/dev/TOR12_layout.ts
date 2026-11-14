// Layout helper for TOR12-14 (pure data, no React, so node can evaluate it for the cutcheck allow list):
// a case = title + an ordered list of parts: VO parts (a stretch of the one take, with shots that start on take times) and RAW parts
// (a clip window with its cleaned sound). The timeline is computed: each VO part starts LEAD after the part before it ends; shots cover
// the whole part (first shot from the part start, last to the part end); raws sit exactly where the cut sheet puts them.
export type ShotSpec = { t: number; id?: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; tr?: "blurDip" | "glitch" | "whip" | "zoomHit"; trLen?: number; label?: [string, number, number] };
export type VoPart = { kind: "vo"; t0: number; t1: number; shots: ShotSpec[] };
export type RawPart = { kind: "raw"; src: string; from: number; dur: number; audio: string; gain?: number; tr?: "blurDip" | "glitch" | "whip" | "zoomHit"; s0?: number; s1?: number; fx?: number; fy?: number; sfx?: [number, string, number][] };
export type Part = VoPart | RawPart;
export type Laid = { a: number; b: number; spec: ShotSpec | RawPart; raw: boolean };

export const LEAD = 0.45, TAIL = 0.4;
export const layout = (title: number, parts: Part[]) => {
  const shots: Laid[] = [], vo: [number, number, number][] = [], raws: [number, number, RawPart][] = [], cuts: { at: number; kind: string; len: number }[] = [];
  let c = title;
  parts.forEach((p) => {
    if (p.kind === "raw") {
      shots.push({ a: c, b: c + p.dur, spec: p, raw: true }); raws.push([c, c + p.dur, p]);
      if (p.tr) cuts.push({ at: c, kind: p.tr, len: 12 });
      c += p.dur;
    } else {
      const v0 = c + LEAD, map = (t: number) => v0 + (t - p.t0), end = map(p.t1) + TAIL;
      vo.push([v0, p.t0, p.t1]);
      p.shots.forEach((s, i) => {
        const a = i === 0 ? c : map(s.t), b = i === p.shots.length - 1 ? end : map(p.shots[i + 1].t);
        shots.push({ a, b, spec: s, raw: false });
        if (s.tr) cuts.push({ at: a, kind: s.tr, len: s.trLen ?? (s.tr === "glitch" ? 8 : s.tr === "blurDip" ? 10 : 10) });
      });
      c = end;
    }
  });
  return { shots, vo, raws, cuts, end: c };
};
export const allow = (cuts: { at: number }[]) => cuts.map((k) => `${(k.at - 0.3).toFixed(2)}-${(k.at + 0.35).toFixed(2)}`).join(",");
