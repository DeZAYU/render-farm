// HOUSE RULES IN CODE for the n2page family (owner 2026-10-26: "the highlight is very bad, the dim is not removed when the highlight moves";
// "who reads screenshots 90% of the time" -> pages are rare, short, VO-synced and always readable). Every component calls assertN2P at
// render: a page that is too short / too long, whose highlight sweeps past the next phrase, or whose active text would be too small to
// read THROWS before a frame is written.
// Timings: Smoothness_Guide §3/§4.1 (pages 4-8 s, never dead-still, no cursor), OWNER_TASTE pacing (>= 1.5 s + 0.3 s/word for text the
// VO does NOT read; text the VO reads while it is lit needs >= max(1.2 s, 0.25 s/word)), PAGE_STUDY.md (Disasters2/v3_tests/pages).
export type Rect = [number, number, number, number]; // x0, y0, x1, y1 in image px
export type PSpan = {
  text: string; // the exact words on the page (used for the read-time rule and the catalogue; not drawn)
  lines: Rect[]; // one rect per text line of the phrase (tight word boxes: tools/wordboxes.py)
  at: number; // local frame the phrase becomes the active one
  sweep?: [number, number]; // local frames of the highlight wipe (default: at+4 .. at+4+0.3 s/word); put it on the spoken words
  keep?: boolean; // stays lit after the next phrase becomes active (two phrases read together); default false = eased back
};
export type N2PTiming = { min: number; max: number; entry: number; exit: number };
export const N2P_MIN: Record<string, N2PTiming> = {
  PageLight_N2P: { min: 120, max: 240, entry: 14, exit: 10 },
  ChipLift_N2P: { min: 120, max: 240, entry: 12, exit: 10 },
  SelectStrip_N2P: { min: 75, max: 210, entry: 0, exit: 0 }, // PP 8:59: a hard-cut macro, 2.5-7 s
  CutoutFade_N2P: { min: 66, max: 150, entry: 0, exit: 0 }, // PP 0:04: the page goes to black around the box over 1.3 s, then holds >= 0.9 s
  TitleMacro_N2P: { min: 45, max: 120, entry: 0, exit: 0 }, // PP 0:00 / 6:40: 1.5-4 s headline macro
  EmberLens_N2P: { min: 120, max: 240, entry: 18, exit: 12 },
  DeskSheet_N2P: { min: 120, max: 270, entry: 24, exit: 14 },
};
export const MIN_CAP_PX = 30; // on-screen line height of ACTIVE text (Smoothness: read lines cap >= 3 % H; a 36 px line box ~ 2.6 % cap)
export const words = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
/** default highlight wipe for a span: starts 4 f after it becomes active, 0.3 s per word (Bukigham REF_MEASURED: 0.17-0.36 W/s, ~0.3 s/word) */
export const sweepOf = (s: PSpan): [number, number] => s.sweep ?? [s.at + 4, s.at + 4 + Math.max(12, Math.round(words(s.text) * 9))];

/** throws with every fault: duration, span order, focus flicker, highlight overrun, unread phrases */
export const assertN2P = (kind: string, dur: number, spans: PSpan[], opt: { minScale?: number[] } = {}) => {
  const t = N2P_MIN[kind]; if (!t) throw new Error(`rules_n2p: no timing for ${kind}`);
  const e: string[] = [];
  if (dur < t.min) e.push(`${dur} f < min ${t.min} f`);
  if (dur > t.max) e.push(`${dur} f > max ${t.max} f (pages are rare and short: split it with footage)`);
  spans.forEach((s, i) => {
    const next = spans[i + 1], end = next ? next.at : dur - t.exit;
    const n = words(s.text), need = Math.max(36, Math.round(n * 7.5)); // VO-read phrase: >= max(1.2 s, 0.25 s/word) fully lit
    const [a, b] = sweepOf(s);
    if (!s.lines.length) e.push(`span ${i} has no lines`);
    if (i === 0 && s.at < t.entry) e.push(`span 0 at ${s.at} starts before the entry ends (${t.entry} f)`);
    if (next && next.at - s.at < 30) e.push(`span ${i} -> ${i + 1} only ${next.at - s.at} f apart (< 30 f: the focus would flicker)`);
    if (end - s.at < need) e.push(`span ${i} "${s.text}" is lit ${end - s.at} f, needs >= ${need} f to be read`);
    if (b <= a) e.push(`span ${i} sweep [${a},${b}] is empty`);
    if (b > end - 8) e.push(`span ${i} sweep ends at ${b}, after the phrase stops being active (${end}) - 8 f: the wipe would be cut off`);
    s.lines.forEach((r) => { if (r[2] <= r[0] || r[3] <= r[1]) e.push(`span ${i} has an empty rect ${r}`); });
    const sc = opt.minScale?.[i];
    if (sc !== undefined) {
      const lh = Math.min(...s.lines.map((r) => r[3] - r[1])) * sc;
      if (lh < MIN_CAP_PX) e.push(`span ${i} line is ${lh.toFixed(1)} px on screen (< ${MIN_CAP_PX}): too small to read, frame it tighter or split the phrase`);
    }
  });
  for (let i = 1; i < spans.length; i++) if (spans[i].at <= spans[i - 1].at) e.push(`spans must be sorted by at (${i})`);
  if (e.length) throw new Error(`rules_n2p: ${kind} FAILED:\n - ` + e.join("\n - "));
  return true;
};

/** weight (0..1) of span i at frame f: eased in over 10 f at its `at`, eased out over 10 f when the NEXT span takes over (unless keep).
 *  THE v2 BUG FIX: the lit state is a pure function of the frame and the CURRENT active span, never accumulated, so a phrase that is
 *  being read is always fully undimmed (w = 1 from at+10 to the next at) and a phrase that is no longer read eases back into the page. */
export const spanWeight = (spans: PSpan[], i: number, f: number, ease: (x: number) => number) => {
  const s = spans[i], next = spans[i + 1];
  const on = ease((f - s.at) / 10);
  const off = next && !s.keep ? ease((f - next.at) / 10) : 0;
  return Math.max(0, Math.min(1, on * (1 - off)));
};
