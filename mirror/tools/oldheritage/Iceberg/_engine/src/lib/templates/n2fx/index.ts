// Family "n2fx" (algrow-2 channel cut tools: transitions, punch / impact / speed ramp shots, film look, cold-open cards).
// Owner v3 (2026-10-26): "rough cuts, 1-frame glitches, sudden zooms" + "intro clips mid, slow push-aways" + "add the CC".
// Rules: fx.tsx FX_MIN (asserted at render) + cutlint.ts lintEdit (whole edit, at bundle) + cutcheck.py (rendered output, exit 1 on faults).
// Grade (CC) lives in the project: Disasters2/grade (look.py -> channel.cube, grade.py per-shot normalisation baked into the clips).
import React from "react";
import type { VariantDef } from "../../core";
import { FilmLook_FX, PresentsOver_FX, Shot_FX, TransDemo_FX, WarningCard_FX, type TransKind } from "./fx";
export * from "./fx";
export * from "./cutlint";

const F = "n2fx";
const demo = { a: "demo/clip_party.mp4", b: "demo/clip_park.mp4" };
const T = (name: string, kind: TransKind, ref: string, when: string, axes: VariantDef["axes"]): VariantDef => ({
  family: F, name, component: TransDemo_FX, durationInFrames: 60, thumbFrame: 30, defaultProps: { kind, ...demo }, ref, when, props: "Transitions_FX cuts=[{at, kind, len?, dir?, amt?}] wraps the edit", axes,
});
export const variants: VariantDef[] = [
  T("GlitchHandoff", "glitch", "Abyssal CCTV Iceberg Vol 4 @0:36-2:00 glitch/RGB hand-offs; entry exit 9 f block glitch (refs/abyssal)", "Card -> footage, entry -> case, CCTV -> CCTV hand-offs. 8-14 f, symmetric.", { geometry: "slices", entry: "sin envelope", layout: "full frame", accent: "rgb split" }),
  T("ColdFlash", "flash", "Abyssal entry exit @0:36.2 7 f white flash + Smoothness_Guide §5 exposure flash", "Entry card -> first story shot. Ramp 3 f, peak on the cut, decay.", { geometry: "full frame", entry: "ramp", layout: "-", accent: "cold white" }),
  T("WhipPan", "whip", "Visual Venture whip / blur push between beats (Waterpark/study/visualventure_tv)", "Fast beat change inside a montage. 8-14 f.", { geometry: "horizontal", entry: "accelerate/decelerate", layout: "-", accent: "motion blur" }),
  T("WhipDown", "whipDown", "VV vertical whip; our 'down a level' variant", "'...levels down' beats: the picture drops away. 8-16 f.", { geometry: "vertical", entry: "accelerate/decelerate", layout: "-", accent: "motion blur" }),
  T("ZoomHit", "zoomHit", "Disturbing Dose dashcam vols: hit cuts on the bass drop (refs/dd)", "Peak to peak in the hook, on a hit SFX. 8-14 f.", { geometry: "zoom", entry: "rush + land", layout: "-", accent: "zoom blur" }),
  T("BlurDip", "blurDip", "VV / Farrell soft beat change", "A calm beat change (no hit). 10-20 f.", { geometry: "full frame", entry: "blur dip", layout: "-", accent: "exposure dip" }),
  { family: F, name: "PunchImpact", component: (p: { src: string }) => React.createElement(FilmLook_FX, {}, React.createElement(Shot_FX, { src: p.src, n: 60, s0: 1.02, s1: 1.04, fx: 0.5, fy: 0.45, punches: [{ at: 14, to: 1.3, len: 10 }], impacts: [{ at: 30 }] })),
    durationInFrames: 60, thumbFrame: 34, defaultProps: { src: demo.b }, ref: "Smoothness_Guide §4 punch on the noun + DD impact frames", when: "Hook peaks: punch on the VO word, impact on the event.", props: "Shot_FX punches=[{at,to,len}] impacts=[{at,amt}] ramp={keys,fileSec}",
    axes: { geometry: "zoom", entry: "eased punch", layout: "focus point", accent: "shake + chroma" } },
  { family: F, name: "WarningCard", component: WarningCard_FX, durationInFrames: 78, thumbFrame: 60, defaultProps: { dur: 78 }, ref: "Abyssal cold open (refs/abyssal/... @0:00-0:03)", when: "Video start, before any footage.", props: "dur, title, lines", axes: { geometry: "text", entry: "typed", layout: "centre", accent: "typewriter" } },
  { family: F, name: "PresentsOver", component: PresentsOver_FX, durationInFrames: 90, thumbFrame: 50, defaultProps: { dur: 90, title: ["VIDEOS BEFORE", "DISASTERS"] }, ref: "Abyssal '<channel> presents' over the first footage (ICEBERG_SPEC_ABYSSAL intro order)", when: "Over the first hook shot.", props: "dur, title[], kicker", axes: { geometry: "text", entry: "glitch-resolve", layout: "centre", accent: "ice cyan" } },
];
