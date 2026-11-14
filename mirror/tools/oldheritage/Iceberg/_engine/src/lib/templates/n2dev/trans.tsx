// n2dev cut devices: Fern 27 glitch-wireframe hit + Fern 38 datamosh (designed, >= 6 f per state), Disturbing Dose freeze-punch tracked replay
// (no circles), DD / VV boxed speaker captions.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp01, lerp, lerpLog } from "../../core";
import { EI, FPS, HudBox, K, Pic, Plate, type PlateP, type TK, Typed, assertDev, envIO, mono, plateMap, rnd, trackAt, typedN, typew } from "./kit";

// ---------------------------------------------------------------- shared A/B timing
type AB = { dur: number; a: string; b: string; aFrom?: number; bFrom?: number; cut: number; len?: number };
const ABPics: React.FC<{ p: AB; f: number }> = ({ p, f }) => f < p.cut
  ? <Pic src={p.a} from={p.aFrom ?? 0} />
  : <Sequence from={p.cut} layout="none"><Pic src={p.b} from={p.bFrom ?? 0} /></Sequence>;
const Push: React.FC<{ f: number; n: number; children: React.ReactNode }> = ({ f, n, children }) => {
  const s = 1.02 + 0.03 * (f / n);
  return <AbsoluteFill style={{ willChange: "transform", transform: `scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1)` }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- WireHit_D (Fern 27)
/** at the cut the picture turns into an ice-cyan edge wireframe on black: the outgoing shot holds as wireframe >= 6 f, then the incoming shot
 *  >= 6 f, each state with ONE fixed offset (no per-frame flicker), 3 f blends at the outer edges. */
export const WireHit_D: React.FC<AB> = (p) => {
  const len = p.len ?? 16, half = Math.floor(len / 2);
  assertDev("WireHit", len, () => (half < 6 ? "each wire state must last >= 6 f" : null));
  const f = useCurrentFrame();
  const inWin = f >= p.cut - half && f < p.cut + half;
  const edge = inWin ? Math.min(clamp01((f - (p.cut - half) + 1) / 3), clamp01((p.cut + half - f) / 3)) : 0;
  const state = f < p.cut ? 0 : 1;
  const off = inWin ? (state === 0 ? 10 : -8) : 0;
  const id = `wire_${p.cut}_${state}`;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
          <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
          <feComponentTransfer><feFuncR type="linear" slope="5" /><feFuncG type="linear" slope="5" /><feFuncB type="linear" slope="5" /></feComponentTransfer>
          <feColorMatrix type="matrix" values="0.45 0 0 0 0  0.95 0 0 0 0  1 0 0 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <Push f={f} n={p.dur}><ABPics p={p} f={f} /></Push>
      {edge > 0 && (
        <AbsoluteFill style={{ opacity: edge }}>
          <AbsoluteFill style={{ background: "#000" }} />
          <AbsoluteFill style={{ filter: `url(#${id})`, transform: `translate3d(${off}px, 0, 0) scale(${state === 0 ? 1.06 : 1.03})` }}><Push f={f} n={p.dur}><ABPics p={p} f={f} /></Push></AbsoluteFill>
          <AbsoluteFill style={{ filter: `url(#${id})`, transform: `translate3d(${-off}px, 0, 0) scale(${state === 0 ? 1.06 : 1.03})`, opacity: 0.35, mixBlendMode: "screen" }}><Push f={f} n={p.dur}><ABPics p={p} f={f} /></Push></AbsoluteFill>
          <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(166,246,255,.06) 0 1px, rgba(0,0,0,0) 1px 6px)" }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Datamosh_D (Fern 38)
/** the incoming shot smears through the outgoing one: ONE fixed noise field, B's share rises every frame and never falls (monotonic),
 *  the smear peaks mid-way, the last frame is pure B. len >= 12 f. */
export const Datamosh_D: React.FC<AB> = (p) => {
  const len = p.len ?? 18, start = p.cut - Math.floor(len / 2);
  const states = Math.floor(len / 6);
  assertDev("Datamosh", len, () => (states < 2 ? "needs >= 2 states of 6 f" : null));
  const f = useCurrentFrame();
  const u = f - start, inWin = u >= 0 && u < states * 6;
  const st = Math.floor(u / 6);
  // monotonic reveal: ONE fixed noise field (constant seed) + a threshold that only rises per state, so a region that shows B stays B;
  // the last state is pure B (clean end on the incoming shot)
  const W6 = states * 6;
  const cover = inWin ? EI.smooth((u + 1) / W6) : 0;
  const disp = inWin ? 110 * Math.sin(((u + 0.5) / W6) * Math.PI) : 0;
  const id = `mosh_${p.cut}_${st}`;
  const thr = Array.from({ length: 41 }, (_, i) => (i / 40 < cover - 1e-6 ? 0 : 1)).join(" ");
  const A = <Pic src={p.a} from={p.aFrom ?? 0} />;
  const B = <Sequence from={start} layout="none"><Pic src={p.b} from={Math.max(0, (p.bFrom ?? 0) - (p.cut - start) / FPS)} /></Sequence>;
  if (!inWin) return <AbsoluteFill style={{ background: "#000" }}><Push f={f} n={p.dur}><ABPics p={p} f={f} /></Push></AbsoluteFill>;
  if (cover >= 1) return <AbsoluteFill style={{ background: "#000" }}><Push f={f} n={p.dur}>{B}</Push></AbsoluteFill>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves={1} seed={p.cut} result="n" />
          <feComponentTransfer in="n" result="q"><feFuncR type="discrete" tableValues="0.2 0.5 0.8 0.5 0.35 0.65" /><feFuncG type="discrete" tableValues="0.5 0.3 0.7 0.5" /><feFuncA type="discrete" tableValues={thr} /></feComponentTransfer>
          <feDisplacementMap in="SourceGraphic" in2="q" scale={disp} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feComposite in="d" in2="q" operator="in" />
        </filter>
      </svg>
      <Push f={f} n={p.dur}>{B}</Push>
      <AbsoluteFill style={{ filter: `url(#${id})` }}><Push f={f} n={p.dur}>{A}</Push></AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- FreezeReplay_D (Disturbing Dose)
/** plays, freezes on the moment, eases a zoom onto the tracked point (soft vignette, no circle), then plays on in slow motion while the frame
 *  keeps tracking `keys`. Optional tiny tag ("REPLAY  0.5x"). */
export const FreezeReplay_D: React.FC<{ dur: number; src: string; from?: number; freezeAt: number; hold?: number; keys: TK[]; zoom?: number; rate?: number; tag?: string }> = ({ dur, src, from = 0, freezeAt, hold = 36, keys, zoom = 1.9, rate = 0.5, tag }) => {
  assertDev("FreezeReplay", dur, () => (hold < 24 ? "freeze hold < 24 f" : freezeAt < 18 ? "play >= 18 f before the freeze" : null));
  const f = useCurrentFrame();
  const resume = freezeAt + hold;
  const z = lerpLog(1, zoom, EI.cam((f - freezeAt - 2) / Math.min(28, hold - 4)));
  const T = trackAt(keys, f < resume ? freezeAt : freezeAt + (f - resume) * rate);
  const m = clamp01((z - 1) / (zoom - 1));
  const Tp = { x: lerp(T.x, 960, m * 0.7), y: lerp(T.y, 540, m * 0.7) };
  const tx = Math.min(0, Math.max(1920 - 1920 * z, Tp.x - T.x * z)), ty = Math.min(0, Math.max(1080 - 1080 * z, Tp.y - T.y * z));
  const vid = (st: number, r = 1) => <OffthreadVideo src={staticFile(src)} startFrom={st} muted playbackRate={r} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  const s0 = Math.round(from * FPS);
  const dip = f >= freezeAt && f < freezeAt + 8 ? Math.sin(((f - freezeAt) / 8) * Math.PI) : 0;
  const to = tag ? envIO(f, dur, 8, 8, freezeAt) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ willChange: "transform", transformOrigin: "0 0", transform: `translate3d(${tx.toFixed(3)}px, ${ty.toFixed(3)}px, 0) scale3d(${z.toFixed(5)}, ${z.toFixed(5)}, 1)`, filter: `brightness(${(1 + 0.12 * dip).toFixed(3)}) saturate(${lerp(1, 0.85, m).toFixed(3)})` }}>
        {f < freezeAt ? vid(s0) : f < resume ? <Freeze frame={freezeAt}>{vid(s0)}</Freeze> : <Sequence from={resume} layout="none">{vid(s0 + freezeAt, rate)}</Sequence>}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 52% 50% at ${(Tp.x / 19.2).toFixed(2)}% ${(Tp.y / 10.8).toFixed(2)}%, rgba(0,0,0,0) 45%, rgba(0,4,10,${(0.55 * m).toFixed(3)}) 100%)` }} />
      {tag && <div style={{ position: "absolute", left: 60, top: 52, ...mono(20, 500, 0.3), color: K.ice, opacity: to, textShadow: K.shadow }}>{tag}</div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- SpeakerBox_D (DD / VV)
export type SpeakLine = { t: string; at: number; end: number; tr?: boolean };
/** the speaker's words in a box BESIDE the speaker (tracked, eased lag), phrase by phrase (6 f fades), speaker name in mono on top. */
export const SpeakerBox_D: React.FC<PlateP & { dur: number; who: string; lines: SpeakLine[]; keys: TK[]; side?: 1 | -1 }> = (p) => {
  const { dur, who, lines, keys, side = 1 } = p;
  assertDev("SpeakerBox", dur, () => (lines.some((l) => l.end - l.at < 24) ? "a phrase must stay >= 24 f" : null));
  const f = useCurrentFrame();
  const a = plateMap(f, p, trackAt(keys, f - 4));
  const cur = lines.find((l) => f >= l.at - 6 && f < l.end + 6);
  const o = envIO(f, dur, 8, 10, Math.max(0, lines[0].at - 8));
  const lo = cur ? Math.min(EI.cam((f - cur.at + 6) / 6), EI.cam((cur.end + 6 - f) / 6)) : 0;
  const n = cur ? typedN(f, cur.t.length, cur.at, 60) : 0;
  return (
    <AbsoluteFill>
      <Plate {...p} />
      <div style={{ position: "absolute", left: a.x + side * 150, top: a.y - 60, transform: `translate(${side > 0 ? 0 : -100}%, -50%)`, maxWidth: 620 }}>
        <HudBox o={o} pad="14px 24px 18px">
          <div style={{ ...mono(17, 500, 0.24), color: K.cyan, marginBottom: 6 }}>{who}</div>
          <div style={{ ...typew(32, 0.01), whiteSpace: "pre-wrap", color: K.ice, lineHeight: 1.3, opacity: lo, minHeight: 42 }}>{cur ? <Typed text={cur.t} n={n} /> : " "}{cur?.tr && <span style={{ ...mono(14, 400, 0.2), color: K.frost }}>{"  (translated)"}</span>}</div>
        </HudBox>
      </div>
    </AbsoluteFill>
  );
};
export { rnd };
