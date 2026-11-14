// CUT LINT (timeline side of the cut-point checker; the render side is cutcheck.py). Runs at bundle time from the edit's plan file and
// THROWS, so a careless cut can't reach a render. Owner v2 note: "very rough cuts on transitions: a one-frame glitch, a sudden zoom-in,
// feels cut carelessly". Each rule below is one of those failure modes, made impossible:
//   SHORT     a shot shorter than 12 f (9 f inside a declared flurry) reads as a flash-cut / stray frame
//   TRANS     a designed transition outside its min/max frames (FX_MIN), not centred on a real cut, or overlapping another transition
//   PUNCH@CUT a punch-in that starts < 5 f after its shot starts or ends < 4 f before it ends: a zoom that lands on a cut = "sudden zoom"
//   PUNCH     a punch shorter than 12 f (a jump) or bigger than x1.6 in one move
//   JUMPCUT   two consecutive shots of the SAME source whose framing differs by less than x1.22 and whose source time is continuous (< 0.5 s gap)
//             with no transition: that is the classic accidental "frame jump". A cut-in must change the framing by >= x1.22 (deliberate).
//   IMPACT    impact hits closer than 20 f, or shorter than 8 f
//   ZOOMSTACK a punch running through a zoomHit/whip window (two zooms stacked = the lurch the owner saw)
import { FX_MIN, DEF_LEN, type FxCut, type FxPunch, type FxImpact } from "./fx";

export type LintShot = {
  at: number; n: number; // absolute start frame, length
  key: string; // source identity (same source = same key)
  srcIn?: number; srcOut?: number; // source seconds at the shot's first / last frame (for JUMPCUT continuity)
  scaleIn?: number; scaleOut?: number; // framing scale at the first / last frame (base framing incl. fill/crop factor)
  punches?: FxPunch[]; impacts?: FxImpact[]; // shot-local frames
  flurry?: boolean; // part of a declared rapid flurry (min 9 f instead of 12)
};
export const lintEdit = (name: string, shots: LintShot[], cuts: FxCut[], end?: number) => {
  const e: string[] = [];
  const s = [...shots].sort((a, b) => a.at - b.at);
  const cutAt = new Map(cuts.map((c) => [c.at, c]));
  s.forEach((sh, i) => {
    const nx = s[i + 1];
    if (nx && sh.at + sh.n !== nx.at) e.push(`GAP/OVERLAP: shot ${sh.key}@${sh.at} ends ${sh.at + sh.n}, next starts ${nx.at}`);
    if (sh.n < (sh.flurry ? 9 : 12)) e.push(`SHORT: ${sh.key}@${sh.at} lasts ${sh.n} f`);
    (sh.punches ?? []).forEach((p) => {
      const len = p.len ?? 14;
      if (len < FX_MIN.punch.min) e.push(`PUNCH: ${sh.key}@${sh.at} punch at +${p.at} eases over ${len} f (< ${FX_MIN.punch.min})`);
      if (p.to > 1.6 || p.to < 1 / 1.6) e.push(`PUNCH: ${sh.key}@${sh.at} punch x${p.to} (> x1.6 in one move)`);
      if (p.at < 5) e.push(`PUNCH@CUT: ${sh.key}@${sh.at} punch starts ${p.at} f after the cut (>= 5)`);
      if (p.at + len > sh.n - 4) e.push(`PUNCH@CUT: ${sh.key}@${sh.at} punch ends ${sh.n - p.at - len} f before the next cut (>= 4)`);
      cuts.forEach((c) => {
        if (c.kind !== "zoomHit" && c.kind !== "whip" && c.kind !== "whipDown") return;
        const L = c.len ?? DEF_LEN[c.kind], a0 = sh.at + p.at, a1 = a0 + len;
        if (a1 > c.at - L / 2 && a0 < c.at + L / 2) e.push(`ZOOMSTACK: ${sh.key} punch ${a0}-${a1} overlaps the ${c.kind} at ${c.at}`);
      });
    });
    const imps = (sh.impacts ?? []).map((m) => ({ ...m, abs: sh.at + m.at }));
    imps.forEach((m) => { if ((m.len ?? 12) < 8) e.push(`IMPACT: ${sh.key}@${m.abs} lasts ${m.len} f (< 8)`); });
    if (nx && nx.key === sh.key && !cutAt.has(nx.at)) {
      const ratio = (nx.scaleIn ?? 1) / (sh.scaleOut ?? 1);
      const cont = sh.srcOut !== undefined && nx.srcIn !== undefined ? Math.abs(nx.srcIn - sh.srcOut) < 0.5 : true;
      if (cont && ratio < 1.22 && ratio > 1 / 1.22) e.push(`JUMPCUT: ${sh.key} ${sh.at + sh.n}: same source, continuous time, framing x${ratio.toFixed(2)} (< x1.22): reads as a frame jump. Make it a real cut-in or add a transition`);
    }
  });
  const allImp = s.flatMap((sh) => (sh.impacts ?? []).map((m) => sh.at + m.at)).sort((a, b) => a - b);
  for (let i = 1; i < allImp.length; i++) if (allImp[i] - allImp[i - 1] < 20) e.push(`IMPACT: hits at ${allImp[i - 1]} and ${allImp[i]} are < 20 f apart`);
  const starts = new Set(s.map((x) => x.at));
  const cs = [...cuts].sort((a, b) => a.at - b.at);
  cs.forEach((c, i) => {
    const L = c.len ?? DEF_LEN[c.kind];
    const t = FX_MIN[c.kind];
    if (c.kind !== "hard" && (L < t.min || L > t.max)) e.push(`TRANS: ${c.kind} at ${c.at} is ${L} f (allowed ${t.min}-${t.max})`);
    if (!starts.has(c.at)) e.push(`TRANS: ${c.kind} at ${c.at} is not on a cut (no shot starts there)`);
    const nx = cs[i + 1];
    if (nx) { const Ln = nx.len ?? DEF_LEN[nx.kind]; if (c.at + L / 2 + 4 > nx.at - Ln / 2) e.push(`TRANS: ${c.kind}@${c.at} and ${nx.kind}@${nx.at} overlap or touch (< 4 f clear)`); }
    const sh = s.find((x) => x.at === c.at), pv = s.find((x) => x.at + x.n === c.at);
    if (sh && sh.n < L / 2 + 6) e.push(`TRANS: the shot after the ${c.kind}@${c.at} lasts ${sh.n} f, needs >= ${Math.ceil(L / 2 + 6)}`);
    if (pv && pv.n < L / 2 + 6) e.push(`TRANS: the shot before the ${c.kind}@${c.at} lasts ${pv.n} f, needs >= ${Math.ceil(L / 2 + 6)}`);
  });
  if (end !== undefined && s.length && s[s.length - 1].at + s[s.length - 1].n !== end) e.push(`END: the last shot ends ${s[s.length - 1].at + s[s.length - 1].n}, the edit ends ${end}`);
  if (e.length) throw new Error(`CUT LINT FAILED (${name}):\n - ` + e.join("\n - "));
  return { shots: s.length, cuts: cuts.filter((c) => c.kind !== "hard").length };
};
