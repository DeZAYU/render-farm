// ND16/ND17 helper: lay out a case from VO-take times. Shots under the VO are given in take seconds (t0-t1); raws are inserted after a
// take time (the cut sheet's RAW cue position). The VO is split only at raw positions; each raw starts GAP_IN after the last word before it,
// the VO resumes GAP_OUT after the raw. Returns out-time shots, raw windows and VO parts.
export type TShot<X> = X & { t0: number; t1: number };
export type TRaw<X> = X & { after: number; len: number };
export type Laid<X> = X & { a: number; b: number };

export const layout = <S extends object, R extends object>(title: number, voEnd: number, shots: TShot<S>[], raws: TRaw<R>[], GAP_IN = 0.25, GAP_OUT = 0.35) => {
  const rs = [...raws].sort((p, q) => p.after - q.after);
  const parts: { t0: number; t1: number; at: number }[] = [];
  const rawOut: Laid<TRaw<R>>[] = [];
  let cursor = title, t = 0;
  for (const r of rs) {
    parts.push({ t0: t, t1: r.after, at: cursor });
    const a = cursor + (r.after - t) + GAP_IN; rawOut.push({ ...r, a, b: a + r.len });
    cursor = a + r.len + GAP_OUT; t = r.after;
  }
  parts.push({ t0: t, t1: voEnd, at: cursor });
  const end = cursor + (voEnd - t);
  const partOf = (x: number) => parts.findIndex((p) => x >= p.t0 - 1e-6 && x < p.t1 - 1e-6);
  const out = (x: number, p: number) => parts[p].at + (x - parts[p].t0);
  const laid: Laid<TShot<S>>[] = shots.map((s) => { const p = partOf(s.t0); return { ...s, a: out(s.t0, p), b: out(Math.min(s.t1, parts[p].t1), p) }; });
  // close the gaps: the first shot of a part starts at the previous raw's end, the last one runs to the next raw's start
  laid.forEach((s, i) => {
    const p = partOf(s.t0);
    const firstInPart = i === 0 || partOf(laid[i - 1].t0) !== p;
    const lastInPart = i === laid.length - 1 || partOf(laid[i + 1].t0) !== p;
    if (firstInPart) s.a = p === 0 ? title : rawOut[p - 1].b;
    if (lastInPart && p < rawOut.length) s.b = rawOut[p].a;
    if (!lastInPart) s.b = out(laid[i + 1].t0, partOf(laid[i + 1].t0));
  });
  return { shots: laid, raws: rawOut, parts, end };
};
