// HOUSE RULES IN CODE for the IC / N2 families (owner 2026-10-25: rules live in code, not in long QA passes).
// Every IC/N2 component calls its assert at render: a device that is too short to fully enter, be read and exit THROWS before a frame
// is written, so nothing can ever appear cut off. Timings: OWNER_TASTE §2 Pacing (hold >= 1.5 s + 0.3 s/word, >= 3 s; pages 4-8 s,
// maps 3-5 s, name tag 2.1-2.9 s, entries >= 10 f), Abyssal STUDY §E1 (level card hold 1.17 s, case title hold 2.3-2.8 s).
import type { ChartBeat } from "./IcebergChart_IC";

export type N2Timing = { entry: number; hold: number; exit: number; max?: number; text?: boolean };
export const N2_MIN: Record<string, N2Timing> = {
  DateType_N2: { entry: 12, hold: 60, exit: 18, max: 225, text: true }, // typing follows the words; >= 2 s readable after the last char
  NameTag_N2: { entry: 16, hold: 63, exit: 10, max: 87 + 10, text: true }, // total 2.1-2.9 s
  PageRise_N2: { entry: 39, hold: 81, exit: 0, max: 240, text: true }, // pages 4-8 s
  SonarMap_N2: { entry: 30, hold: 60, exit: 0, max: 150, text: true }, // maps 3-5 s
  SonarMap2_N2: { entry: 30, hold: 150, exit: 0, max: 300, text: true }, // two-stage map (pin, then a second framing + line): 6-10 s
  PageBurst_N2: { entry: 6, hold: 114, exit: 0, max: 240, text: true }, // VV burst push page: 4-8 s
  RawSub_N2: { entry: 3, hold: 24, exit: 3 }, // per phrase: >= 1 s on screen
  DepthCut_N2: { entry: 7, hold: 0, exit: 7, max: 18 },
};
/** throws when a device instance is shorter than entry + hold + exit (or the word hold), or longer than its max */
export const assertN2 = (kind: string, dur: number, words = 0) => {
  const t = N2_MIN[kind]; if (!t) throw new Error(`rules_ic: no timing for ${kind}`);
  const wordHold = words ? Math.max(t.hold, Math.round((1.5 + 0.3 * words) * 30)) : t.hold;
  const need = t.entry + wordHold + t.exit;
  if (dur < need) throw new Error(`rules_ic: ${kind} is ${dur} f, needs >= ${need} f (entry ${t.entry} + hold ${wordHold} + exit ${t.exit})`);
  if (t.max && dur > t.max) throw new Error(`rules_ic: ${kind} is ${dur} f, max ${t.max} f — split it with footage`);
};
/** minimum frames each chart beat needs before the next beat (or the end of the instance) */
export const BEAT_MIN = { reveal: 18 + 96 + 12, level: 68 + 12 + 27, case: 28 + 30 + 69, title: 6 + 26 + 45, cam: 1 } as const; // case: lift lands, then >= 2.3 s title hold
export const assertIC = (name: string, dur: number, beats: ChartBeat[]) => {
  const bs = [...beats].sort((a, b) => a.at - b.at);
  bs.forEach((b, i) => {
    const end = i + 1 < bs.length ? bs[i + 1].at : dur;
    const need = b.k === "reveal" && b.quick ? 60 : BEAT_MIN[b.k];
    if (end - b.at < need) throw new Error(`rules_ic: ${name} ${b.k} beat at ${b.at} has ${end - b.at} f, needs >= ${need} f`);
    if (b.k === "case" && i + 1 < bs.length) throw new Error(`rules_ic: ${name} a case beat must be the last beat (the lifted title hands over to footage)`);
  });
};

// ---------------------------------------------------------------- IC3 (v3, Abyssal grammar: ICEBERG_SPEC_ABYSSAL.md) min / max frames per device
// LevelCard: black 24 + fade 15 + hold 33 (Level N readable >= 1.1 s) + push 11 + landing 7 = 90; EntryCard: black 21 + fade 15 + title 9 +
// hold >= 66 (2.2 s) + glitch 3 = 114; Chart: once, ~3 s, static (80-150); GlitchCut: a designed multi-frame effect, never < 5 frames.
export const IC3_MIN: Record<string, { min: number; max?: number }> = {
  WarningCard_IC3: { min: 60, max: 120 },
  Presents_IC3: { min: 60, max: 120 },
  ChartIntro_IC3: { min: 80, max: 150 },
  LevelCard_IC3: { min: 90, max: 210 },
  EntryCard_IC3: { min: 108, max: 150 },
  DateCard_IC3: { min: 90, max: 150 },
  NameTag_IC3: { min: 63, max: 97 },
  PageFocus_IC3: { min: 120, max: 240 },
  Map3D_IC3: { min: 120, max: 330 },
  GlitchCut_IC3: { min: 5, max: 12 },
  // AB (v3 photoreal berg, abyss.tsx): chart ~3 s static; level card = black 24 + fade 15 + Level N hold to 72 + push 14 + landing >= 12;
  // entry card = black 21 + fade 15 + title 9 + hold >= 66 (2.2 s) + glitch out 8 = 119
  ChartIntro_AB: { min: 75, max: 120 },
  ChartInsert_AB: { min: 36, max: 75 }, // hook insert: names all typed by ~f 12, readable >= 0.8 s
  LevelCard_AB: { min: 98, max: 210 },
  EntryCard_AB: { min: 119, max: 170 },
  EntryCardCont_AB: { min: 90, max: 150 }, // after a level card: title at 8 + 9 + hold >= 66 + glitch 8
};
export const assertIC3 = (kind: string, dur: number) => {
  const t = IC3_MIN[kind]; if (!t) throw new Error(`rules_ic: no IC3 timing for ${kind}`);
  if (dur < t.min) throw new Error(`rules_ic: ${kind} is ${dur} f, needs >= ${t.min} f`);
  if (t.max && dur > t.max) throw new Error(`rules_ic: ${kind} is ${dur} f, max ${t.max} f`);
};
/** cut-list linter (owner v3 #8): no shot shorter than 12 frames unless it is a designed glitch/impact, every punch-in eased over >= 6 f,
 *  every glitch >= 5 f. Throws with all faults. `shots` = start frames of every picture (sorted), `designed` = frames allowed to be short. */
export const lintCuts = (name: string, shots: number[], glitches: { at: number; len?: number }[], punches: { at: number; len: number }[] = []) => {
  const e: string[] = [];
  const s = [...shots].sort((a, b) => a - b);
  for (let i = 1; i < s.length; i++) if (s[i] - s[i - 1] < 12) e.push(`shot at ${s[i - 1]} lasts ${s[i] - s[i - 1]} f (< 12 f: reads as a flash-cut)`);
  glitches.forEach((g) => { if ((g.len ?? 6) < 5) e.push(`glitch at ${g.at} is ${g.len} f (< 5)`); });
  punches.forEach((p) => { if (p.len < 6) e.push(`punch-in at ${p.at} eases over ${p.len} f (< 6: a jump)`); });
  if (e.length) throw new Error(`CUT LINT FAILED (${name}):\n - ` + e.join("\n - "));
  return true;
};
