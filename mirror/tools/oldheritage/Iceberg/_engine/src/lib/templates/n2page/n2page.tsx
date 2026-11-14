// Family "n2page": the algrow-2 channel's page/screenshot treatments, rebuilt after the owner rejected the v2 pages (2026-10-26:
// "you highlight a section and dim the rest, but when you highlight another section the dim is not removed; the highlight is very bad").
// Study + timecodes: Disasters2/v3_tests/pages/PAGE_STUDY.md (Parallel Pipes "57 Minutes of Wikipedia's Strangest Pages", LEMMiNO, Fern,
// Nocturn, Farrell). Pages are RARE (<= 1-2 per case, only when the page adds a fact) and every lit phrase is the one the VO is saying.
//
// One engine (PageEngine) + seven presets, each adapting ONE measured reference treatment:
//   ChipLift_N2P    PP 44:44-44:50  the phrase lifts off the page as a crisp chip; the page darkens continuously; steady push.
//   SelectStrip_N2P PP 8:59.3-9:06  the paragraph cut out as a white strip on black; a browser selection grows word by word with the VO.
//   CutoutFade_N2P  PP 0:04.0-0:05.3 a title/box stays lit while the rest of the page sinks to black over 1.3 s.
//   TitleMacro_N2P  PP 0:00-0:03, 6:40, 10:21  the headline at macro size with a lateral drift (hard cut in/out).
//   PageLight_N2P   Farrell X3 + Nocturn push (Smoothness 4.1): wide page -> eased glide to the line, marker wipe paced to the words.
//   EmberLens_N2P   Fern device 20 + LEMMiNO k_432/k_372: dark page, out-of-focus lines soft and grey, ember bar wipes behind the phrase.
//   DeskSheet_N2P   Fern 7:05 / 20:25: the page is a physical sheet on a dark desk, one light pool, shallow depth of field, slow truck.
//
// DIM LOGIC (the v2 bug): the lit state of every phrase is a pure function of the frame (rules_n2p.spanWeight): the active phrase is an
// UNDIMMED copy of the page clipped to its lines at weight 1, the previous phrase eases back into the dimmed page over 10 f while the next
// one eases in, and the base dim never covers a copy. Nothing that is being read can stay dimmed, nothing that is no longer read stays lit.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { clamp01, lerp } from "../../core";
import { EI } from "../iceberg/ic";
import { assertN2P, spanWeight, sweepOf } from "./rules_n2p";
import type { PSpan, Rect } from "./rules_n2p";
export type { PSpan, Rect } from "./rules_n2p";

const W = 1920, H = 1080;
type HL = "chip" | "select" | "marker" | "ember" | "none";
type Cam = { x: number; y: number; s: number };
export type PageCommon = {
  dur: number; src: string; imgW: number; imgH: number;
  /** the part of the capture that is "the page" (default the whole capture) */ crop?: Rect;
  spans: PSpan[];
  /** opacity ramps of the device itself (0 = hard cut); default per preset */ inF?: number; outF?: number;
  /** ONE camera framing for all spans (their union): no pan between phrases, only the chips change. Use it when the phrases share a line
   *  or would make the camera swing back and forth (owner v4: "screenshot keyframing twitching") */ singleCam?: boolean;
  /** lateral drift px/s (preset default); give it the SAME sign as the entry landing so the path never reverses */ driftX?: number;
};
type EngineProps = PageCommon & {
  kind: string; hl: HL; dark?: boolean; plane?: "flat" | "tilt" | "desk";
  stage?: Rect; // region kept lit as a cut-out card for the whole shot (PP strip / title box)
  dimTo: number; dimBlur?: number; dimMode: "follow" | "ramp" | "black" | "hard";
  entry: "cut" | "fade" | "rise" | "wide"; wideHold?: number;
  fit?: number; zoomMax?: number; push?: number; driftX?: number; frameStage?: boolean; dof?: number; bg?: string;
};

const unionR = (rs: Rect[]): Rect => [Math.min(...rs.map((r) => r[0])), Math.min(...rs.map((r) => r[1])), Math.max(...rs.map((r) => r[2])), Math.max(...rs.map((r) => r[3]))];
const lerpR = (a: Rect, b: Rect, t: number): Rect => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
const lerpC = (a: Cam, b: Cam, t: number): Cam => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), t)) });

/** camera keys: one per span (the phrase fills `fit` of the width, never past zoomMax, never taller than 58 % of the frame) */
export const camKeys = (spans: PSpan[], o: { fit?: number; zoomMax?: number; stage?: Rect; frameStage?: boolean; singleCam?: boolean }): Cam[] =>
  spans.map((s) => {
    const r = o.frameStage && o.stage ? o.stage : o.singleCam ? unionR(spans.flatMap((x) => x.lines)) : unionR(s.lines);
    const bw = r[2] - r[0], bh = r[3] - r[1];
    const sc = Math.min(o.zoomMax ?? 2.2, ((o.fit ?? 0.72) * W) / bw, (0.58 * H) / bh);
    return { x: (r[0] + r[2]) / 2, y: (r[1] + r[3]) / 2, s: sc };
  });

const PageImg: React.FC<{ src: string; imgW: number; imgH: number; ox: number; oy: number; filter?: string }> = ({ src, imgW, imgH, ox, oy, filter }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", left: -ox, top: -oy, width: imgW, height: imgH, maxWidth: "none", filter }} />
);
const DARK = "invert(0.93) hue-rotate(180deg) brightness(0.92) contrast(1.08)";

export const PageEngine: React.FC<EngineProps> = (p) => {
  const f = useCurrentFrame();
  const { dur, src, imgW, imgH, spans, hl } = p;
  const crop: Rect = p.crop ?? [0, 0, imgW, imgH];
  const [cx0, cy0, cx1, cy1] = crop, cw = cx1 - cx0, ch = cy1 - cy0;
  // flat pages never show their own edge (M-073: a black band when the camera sits near a page edge): the view is clamped inside the crop
  const clampOn = (p.plane ?? "flat") !== "desk" && (p.dimMode === "follow" || p.dimMode === "ramp");
  const clampCam = (q: Cam): Cam => {
    if (!clampOn) return q;
    const hw = W / 2 / q.s, hh = H / 2 / q.s;
    // SMOOTH clamp (owner 10-26 "screenshot keyframing twitching"): a hard min/max makes the camera stop dead (a velocity kink) the frame it
    // touches an edge, and the centred branch switches when the push crosses the page size. Soft-min/max (5 % of the view) keeps the path C1.
    const soft = (v: number, lo: number, hi: number, k: number) => {
      if (hi <= lo) return (lo + hi) / 2;
      const sp = (z: number) => (z > 20 ? z : Math.log1p(Math.exp(z)));
      const a = lo + k * sp((v - lo) / k); return hi - k * sp((hi - a) / k);
    };
    return { s: q.s, x: soft(q.x, cx0 + hw, cx1 - hw, 0.05 * hw), y: soft(q.y, cy0 + hh, cy1 - hh, 0.05 * hh) };
  };
  const keys = camKeys(spans, p).map(clampCam);
  assertN2P(p.kind, dur, spans, { minScale: keys.map((k) => k.s) });
  // every active phrase must sit fully inside the frame (40 px margin) at its own camera key
  spans.forEach((s, i) => {
    const r = unionR(s.lines), q = keys[i];
    const sx0 = W / 2 + (r[0] - q.x) * q.s, sx1 = W / 2 + (r[2] - q.x) * q.s, sy0 = H / 2 + (r[1] - q.y) * q.s, sy1 = H / 2 + (r[3] - q.y) * q.s;
    if (sx0 < 40 || sx1 > W - 40 || sy0 < 40 || sy1 > H - 40) throw new Error(`rules_n2p: ${p.kind} span ${i} "${s.text}" is not fully on screen at its key (${sx0.toFixed(0)}..${sx1.toFixed(0)} x ${sy0.toFixed(0)}..${sy1.toFixed(0)})`);
  });
  const inF = p.inF ?? 12, outF = p.outF ?? 10;

  // ---- camera: entry framing -> key 0 -> key i (eased, the camera leads the phrase by 8 f), then a constant linear push + drift
  const wideCam: Cam = { x: (cx0 + cx1) / 2, y: (cy0 + cy1) / 2, s: Math.min((0.9 * W) / cw, (0.92 * H) / ch) };
  const pre: Cam = p.entry === "wide" ? wideCam : { ...keys[0], s: keys[0].s * 0.93 };
  const wh = p.wideHold ?? 22;
  let c = p.entry === "wide" ? lerpC(pre, keys[0], EI.cam((f - wh) / 26)) : lerpC(pre, keys[0], EI.land(f / (inF + 24)));
  for (let i = 1; i < spans.length; i++) c = lerpC(c, keys[i], EI.cam((f - (spans[i].at - 8)) / 22));
  const sNow = c.s * (1 + (p.push ?? 0.006) * (f / 30));
  const cc = clampCam({ s: sNow, x: c.x + ((p.driftX ?? 0) * (f / 30)) / sNow, y: c.y });
  const xNow = cc.x, yNow = cc.y;
  const k = 1 / sNow; // page px per screen px
  // runtime rule: once the camera has settled on a phrase, the lit phrase never leaves the frame (drift/push can't cut it off)
  if ((p.plane ?? "flat") === "flat") spans.forEach((s, i) => {
    const settled = f >= (i === 0 ? s.at : s.at + 16) && (!spans[i + 1] || f < spans[i + 1].at - 8) && f < dur - outF;
    if (!settled) return;
    const r = unionR(s.lines), X0 = W / 2 + (r[0] - xNow) * sNow, X1 = W / 2 + (r[2] - xNow) * sNow, Y0 = H / 2 + (r[1] - yNow) * sNow, Y1 = H / 2 + (r[3] - yNow) * sNow;
    if (X0 < 16 || X1 > W - 16 || Y0 < 16 || Y1 > H - 16) throw new Error(`rules_n2p: ${p.kind} f${f}: active phrase ${i} "${s.text}" drifts off screen (${X0.toFixed(0)}..${X1.toFixed(0)} x ${Y0.toFixed(0)}..${Y1.toFixed(0)}); lower push/driftX or fit`);
  });

  // ---- dim of everything that is not lit (never applied to a lit copy)
  const a0 = spans[0].at;
  const D = p.dimMode === "hard" ? p.dimTo
    : p.dimMode === "black" ? p.dimTo * clamp01((f - a0) / 39) // PP 0:04.0-0:05.3: linear sink to black over 1.3 s
    : p.dimMode === "ramp" ? p.dimTo * (0.62 * EI.cam((f - a0 + 6) / 14) + 0.38 * clamp01((f - a0) / Math.max(30, dur - a0 - 10))) // PP 44:44: steps down, then keeps darkening
    : p.dimTo * EI.cam((f - (a0 - 8)) / 14);
  const blurPx = ((p.dimBlur ?? 0) * D + (p.dof ?? 0)) * k;

  // ---- device opacity / entry
  const oIn = inF ? (p.entry === "rise" ? EI.land(f / (inF * 0.6)) : EI.land(f / inF)) : 1;
  const oOut = outF ? 1 - EI.smooth((f - (dur - outF)) / outF) : 1;
  const rise = p.entry === "rise" ? (1 - EI.land(f / (inF + 26))) * 140 : 0;

  // ---- plane
  const prog = clamp01(f / dur);
  const plane = p.plane ?? "flat";
  const tilt = plane === "tilt" ? `rotateX(${lerp(11, 4, EI.smooth(prog))}deg) rotateY(${lerp(-8, -3, EI.smooth(prog))}deg) rotateZ(${lerp(-1.1, -0.4, prog)}deg)`
    : plane === "desk" ? `rotateX(${lerp(36, 31, EI.smooth(prog))}deg) rotateZ(${lerp(-7, -5, prog)}deg)` : "none";
  const filt = p.dark ? DARK : plane === "desk" ? "sepia(0.18) contrast(1.04) brightness(0.97)" : "contrast(1.04)";

  // ---- copies
  const pad = (r: Rect, px = 10, py = 6): Rect => [r[0] - px, r[1] - py, r[2] + px, r[3] + py];
  const Cut: React.FC<{ r: Rect; style?: React.CSSProperties; filter?: string }> = ({ r, style, filter }) => (
    <div style={{ position: "absolute", left: r[0] - cx0, top: r[1] - cy0, width: r[2] - r[0], height: r[3] - r[1], overflow: "hidden", ...style }}>
      <PageImg src={src} imgW={imgW} imgH={imgH} ox={r[0]} oy={r[1]} filter={filter} />
    </div>
  );
  // focus band (DOF presets): the active phrase +- 1.6 lines stays sharp, eased with the camera
  const bands = spans.map((s) => unionR(s.lines));
  let band = bands[0];
  for (let i = 1; i < spans.length; i++) band = lerpR(band, bands[i], EI.cam((f - (spans[i].at - 8)) / 22));
  const lh = band[3] - band[1], bandR: Rect = [cx0, band[1] - Math.max(70, lh * 1.6), cx1, band[3] + Math.max(70, lh * 1.6)];

  const hlNodes: React.ReactNode[] = [];
  const litNodes: React.ReactNode[] = [];
  spans.forEach((s, i) => {
    const w = spanWeight(spans, i, f, EI.cam);
    if (w <= 0.001) return;
    const [a, b] = sweepOf(s);
    const prgs = clamp01((f - a) / (b - a)); // ONE continuous linear wipe across the lines, paced to the words (Bukigham REF_MEASURED)
    const tot = s.lines.reduce((t, r) => t + (r[2] - r[0]), 0);
    let acc = 0;
    s.lines.forEach((r, j) => {
      const lw = r[2] - r[0], q = clamp01((prgs * tot - acc) / lw); acc += lw;
      const h = r[3] - r[1];
      const lift = hl === "chip" ? w : 0;
      // lit copy (always undimmed; chips rise off the page)
      litNodes.push(
        <Cut key={`l${i}_${j}`} r={pad(r, hl === "chip" ? 14 : 8, hl === "chip" ? 9 : 5)} filter={filt}
          style={{ opacity: w, borderRadius: hl === "chip" ? 3 : 2, background: p.dark ? "#0b0d0f" : "#fff",
            transform: lift ? `translateY(${-5 * lift * k}px) scale(${1 + 0.045 * lift})` : undefined,
            boxShadow: lift ? `0 ${16 * k}px ${36 * k}px rgba(0,0,0,${0.62 * lift}), 0 0 0 ${1.2 * k}px rgba(0,0,0,${0.16 * lift})` : undefined }} />,
      );
      if (q <= 0 || hl === "none") return;
      const x = r[0] - cx0 - 6, y = r[1] - cy0, wid = (lw + 12) * q;
      if (hl === "marker") hlNodes.push(
        <div key={`h${i}_${j}`} style={{ position: "absolute", left: x, top: y - h * 0.04, width: wid, height: h * 1.1, opacity: 0.9 * w, mixBlendMode: "multiply", borderRadius: `${3}px ${h * 0.25}px ${h * 0.25}px ${3}px`,
          background: "linear-gradient(180deg, rgba(255,214,64,.80) 0%, rgba(255,222,84,.95) 18%, rgba(255,214,64,.92) 82%, rgba(255,200,40,.70) 100%)" }} />,
      );
      else if (hl === "select") hlNodes.push(
        <div key={`h${i}_${j}`} style={{ position: "absolute", left: x + 4, top: y - 3, width: wid - 4, height: h + 6, overflow: "hidden", opacity: w }}>
          <div style={{ position: "absolute", inset: 0, background: "#2F6FE4" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: lw + 12, height: h + 6, overflow: "hidden", mixBlendMode: "lighten" }}>
            <PageImg src={src} imgW={imgW} imgH={imgH} ox={r[0] - 2} oy={r[1] - 3} filter="invert(1) grayscale(1) contrast(1.6)" />
          </div>
        </div>,
      );
      else if (hl === "ember") hlNodes.push(
        <div key={`h${i}_${j}`} style={{ position: "absolute", left: x, top: y + h * 0.02, width: wid, height: h * 0.98, opacity: w, mixBlendMode: "screen", borderRadius: 2,
          background: "linear-gradient(180deg, #C2410C 0%, #E8661C 45%, #B23A0A 100%)", boxShadow: `0 0 ${22 * k}px rgba(255,120,30,.55)` }} />,
      );
      else if (hl === "chip") hlNodes.push(
        <div key={`h${i}_${j}`} style={{ position: "absolute", left: r[0] - cx0 - 14, top: r[3] - cy0 + 9 + 4 * k, width: (lw + 28) * q, height: 3 * k, opacity: w * 0.95,
          transform: `translateY(${-5 * lift * k}px)`, background: "#E5322D", boxShadow: `0 0 ${8 * k}px rgba(229,50,45,.6)` }} />,
      );
    });
  });
  const stageNode = p.stage ? <Cut r={p.stage} filter={filt} style={{ boxShadow: `0 ${10 * k}px ${40 * k}px rgba(0,0,0,.7), 0 0 0 ${1 * k}px rgba(170,180,185,.55)`, background: "#fff" }} /> : null;

  return (
    <AbsoluteFill style={{ background: p.bg ?? "radial-gradient(ellipse 80% 70% at 50% 50%, #151414, #050505)", overflow: "hidden", opacity: oIn * oOut }}>
      {plane === "desk" ? <Desk /> : null}
      <AbsoluteFill style={{ perspective: plane === "desk" ? 1500 : 2200, transform: `translateY(${rise}px)` }}>
        <AbsoluteFill style={{ transform: tilt, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: cw, height: ch, transformOrigin: "0 0", willChange: "transform", backfaceVisibility: "hidden",
            // one composited 3D layer, full float precision: a 2D translate()/scale() on a plain div is snapped to whole device px by Chrome,
            // which turned the slow drift/push into a stair-step (measured: every 4th frame stalled on the v3 KTVU page)
            transform: `translate3d(${(W / 2 - (xNow - cx0) * sNow).toFixed(3)}px, ${(H / 2 - (yNow - cy0) * sNow).toFixed(3)}px, 0) scale3d(${sNow.toFixed(5)}, ${sNow.toFixed(5)}, 1)`,
            boxShadow: plane === "flat" ? undefined : `0 ${40 * k}px ${90 * k}px rgba(0,0,0,.8)` }}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: p.dark ? "#0b0d0f" : "#fff" }}>
              <PageImg src={src} imgW={imgW} imgH={imgH} ox={cx0} oy={cy0} filter={`${filt} blur(${blurPx.toFixed(2)}px)`} />
              {p.dof ? (
                <div style={{ position: "absolute", left: 0, top: bandR[1] - cy0, width: cw, height: bandR[3] - bandR[1], overflow: "hidden",
                  WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 28%, #000 72%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 28%, #000 72%, transparent 100%)" }}>
                  <PageImg src={src} imgW={imgW} imgH={imgH} ox={cx0} oy={bandR[1]} filter={`${filt} blur(${((p.dimBlur ?? 0) * D * k).toFixed(2)}px)`} />
                </div>
              ) : null}
              <div style={{ position: "absolute", inset: 0, background: `rgba(3,6,8,${D.toFixed(3)})` }} />
            </div>
            {stageNode}
            {litNodes}
            {hlNodes}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {plane === "desk" ? <AbsoluteFill style={{ background: "radial-gradient(ellipse 62% 58% at 46% 46%, rgba(255,226,180,.10) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,.78) 100%)" }} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 78% 72% at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/** dark desk surface for DeskSheet (procedural: wood-ish low-key gradient + grain; no stock texture) */
const Desk: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 46% 44%, #2a221b 0%, #15110d 55%, #070605 100%)" }}>
    <AbsoluteFill style={{ opacity: 0.35, mixBlendMode: "overlay",
      background: "repeating-linear-gradient(97deg, rgba(255,255,255,.05) 0px, rgba(0,0,0,.08) 3px, rgba(255,255,255,.03) 7px, rgba(0,0,0,.06) 13px)" }} />
  </AbsoluteFill>
);

// ================================================================ presets (each = one reference treatment, see PAGE_STUDY.md)
/** PP 44:44-44:50 "37 deaths and 113 injuries": the phrase lifts as a crisp chip, the page keeps darkening, steady push. Default for case pages. */
export const ChipLift_N2P: React.FC<PageCommon & { dark?: boolean }> = (p) => (
  <PageEngine {...p} kind="ChipLift_N2P" hl="chip" dimTo={0.78} dimBlur={1.6} dimMode="ramp" entry="fade" inF={p.inF ?? 12} outF={p.outF ?? 10} fit={0.55} zoomMax={1.3} push={0.03} driftX={p.driftX ?? -14} />
);
/** PP 8:59.3: the paragraph alone as a white strip on black, a browser selection grows word by word on the spoken words. Hard-cut macro. */
export const SelectStrip_N2P: React.FC<PageCommon & { strip: Rect }> = (p) => (
  <PageEngine {...p} kind="SelectStrip_N2P" hl="select" stage={p.strip} frameStage dimTo={1} dimMode="hard" entry="cut" inF={p.inF ?? 0} outF={p.outF ?? 0} fit={0.84} zoomMax={1.6} push={0.012} driftX={-8} bg="#000" />
);
/** PP 0:04.0-0:05.3: a title / box stays lit while the rest of the page sinks to black over 1.3 s (linear), slow push. */
export const CutoutFade_N2P: React.FC<PageCommon & { box: Rect }> = (p) => (
  <PageEngine {...p} kind="CutoutFade_N2P" hl="none" stage={p.box} dimTo={1} dimMode="black" entry="cut" inF={p.inF ?? 0} outF={p.outF ?? 0} fit={0.8} zoomMax={1.4} push={0.01} frameStage bg="#000" />
);
/** PP 0:00-0:03 / 6:40 / 10:21: the headline at macro size, lateral drift, no dim, no highlight. 1.5-4 s between other shots. */
export const TitleMacro_N2P: React.FC<PageCommon> = (p) => (
  <PageEngine {...p} kind="TitleMacro_N2P" hl="none" dimTo={0} dimMode="hard" entry="cut" inF={p.inF ?? 0} outF={p.outF ?? 0} fit={0.84} zoomMax={2.4} push={0.008} driftX={-22} bg="#fff" />
);
/** Farrell X3 / Nocturn: wide page held ~0.7 s, eased glide to the line, a yellow marker wipes behind the spoken words (light pages). */
export const PageLight_N2P: React.FC<PageCommon & { tilt?: boolean }> = (p) => (
  <PageEngine {...p} kind="PageLight_N2P" hl="marker" plane={p.tilt ? "tilt" : "flat"} dimTo={0.62} dimBlur={0.8} dimMode="follow" entry="wide" wideHold={20} inF={p.inF ?? 14} outF={p.outF ?? 10} fit={0.7} zoomMax={1.9} push={0.006} />
);
/** Fern device 20 + LEMMiNO k_432: the page in dark mode, out-of-focus lines soft and grey, an ember bar wipes behind the phrase. */
export const EmberLens_N2P: React.FC<PageCommon> = (p) => (
  <PageEngine {...p} kind="EmberLens_N2P" hl="ember" dark dof={2.6} dimTo={0.55} dimBlur={1.2} dimMode="follow" entry="fade" inF={p.inF ?? 18} outF={p.outF ?? 12} fit={0.7} zoomMax={1.9} push={0.008} driftX={-10} bg="#050607" />
);
/** Fern 7:05 / 20:25: the page as a physical sheet on a dark desk, one warm light pool, shallow DOF, slow truck; marker optional. */
export const DeskSheet_N2P: React.FC<PageCommon & { marker?: boolean }> = (p) => (
  <PageEngine {...p} kind="DeskSheet_N2P" hl={p.marker === false ? "none" : "marker"} plane="desk" dof={2.2} dimTo={0.3} dimBlur={0.6} dimMode="follow" entry="rise" inF={p.inF ?? 24} outF={p.outF ?? 14} fit={0.6} zoomMax={1.5} push={0.008} driftX={-22} bg="#070605" />
);
