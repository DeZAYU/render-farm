// IN11-IN15 plumbing (not a device): the DC01 case layout as one component so the five case files hold only their data.
// Title (TitleCard style A or the typewriter strike style B), shots under FilmLook, Transitions_FX cuts, the VO take split only at the raws,
// raw audio from <case>/media/<name>_clean.wav, music ducked under the raws, SFX. Also: VCam (vertical phone clip on a blurred fill).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RED, TitleCard } from "../brand";
import { camAt, cl, io, out, placeOf, useDcFonts, type CK } from "./DC01_kit";

export const F = (s: number) => Math.round(s * 30);
export const dB = (d: number) => Math.pow(10, d / 20);
export const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

export type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
/** raw: timeline a..b, source time s, audio file (case/media/...), gain dB, music duck level, optional mute ranges in source secs */
export type Raw = { a: number; b: number; s: number; wav: string; g?: number; duck?: number; mute?: [number, number][] };

/** typewriter strike title (style B): letters struck one by one on the darkened frame, place · year line under it */
export const StrikeTitle: React.FC<{ dur: number; title: string; sub: string; bg: string; pos?: string }> = ({ dur, title, sub, bg, pos = "50% 50%" }) => {
  useDcFonts();
  const f = useCurrentFrame();
  const z = 1.05 + 0.07 * io(f / dur), per = Math.min(2.2, 64 / title.length), t0 = 10, fs = Math.min(92, Math.floor(1720 / (title.length * 0.66)));
  const shown = Math.max(0, Math.min(title.length, Math.floor((f - t0) / per) + 1));
  const sOp = out(interpolate(f, [t0 + title.length * per + 6, t0 + title.length * per + 22], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z})`, filter: "brightness(0.4) contrast(1.1) saturate(0.55) blur(2px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 455, textAlign: "center", fontFamily: "Elite", fontSize: fs, letterSpacing: "0.05em", color: "#F2F2F0", whiteSpace: "pre",
        textShadow: "0 0 18px rgba(255,255,255,.22), 0 2px 8px rgba(0,0,0,.75)" }}>
        {title.split("").map((c, i) => {
          const age = f - t0 - i * per; if (i >= shown) return <span key={i} style={{ opacity: 0 }}>{c}</span>;
          const k = interpolate(age, [0, 3], [0, 1], cl);
          return <span key={i} style={{ display: "inline-block", opacity: 0.35 + 0.65 * k, transform: `translateY(${(1 - k) * -5}px) scale(${1.12 - 0.12 * k})` }}>{c}</span>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 585, textAlign: "center", opacity: sOp }}>
        <span style={{ fontFamily: "Elite", fontSize: 34, letterSpacing: "0.22em", color: "#D8D8D4", borderTop: `2px solid ${RED}`, paddingTop: 14 }}>{sub}</span>
      </div>
    </AbsoluteFill>
  );
};

/** a vertical phone clip (iw x ih) through a camera: blurred cover fill behind, the sharp picture at full height (s=1) or pushed in */
export const VCam: React.FC<{ src: string; keys: CK[]; from?: number; t?: number; rate?: number; iw: number; ih: number }> = ({ src, keys, from = 0, rate = 1, iw, ih }) => {
  const f = useCurrentFrame(); const c = camAt(f, keys);
  const h = 1080 * c.s, w = h * iw / ih;
  const L = w <= 1920 ? (1920 - w) / 2 : Math.min(0, Math.max(1920 - w, 960 - c.x * w));
  const top = Math.min(0, Math.max(1080 - h, 540 - c.y * h));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
        style={{ position: "absolute", inset: -60, width: 2040, height: 1200, objectFit: "cover", filter: "blur(28px) brightness(.72) saturate(.85)" }} />
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
        style={{ position: "absolute", left: L, top, width: w, height: h, boxShadow: "0 0 60px rgba(0,0,0,.6)" }} />
    </AbsoluteFill>
  );
};

export const CaseLayout: React.FC<{
  vo: string; title: React.ReactNode; tDur: number; shots: Sh[]; cuts: FxCut[]; parts: [number, number, number | null][]; raws: Raw[];
  music: { file: string; db: number; passes: [number, number, number][] }; sfx: [number, string, number][]; beds?: [number, number, string, number][]; dur: number; grain?: number;
}> = ({ vo, title, tDur, shots, cuts, parts, raws, music, sfx, beds = [], dur, grain = 0.08 }) => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={cuts}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(tDur)} layout="none"><AbsoluteFill>{title}</AbsoluteFill></Sequence>
          {shots.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={grain}>{s.node(n)}</FilmLook_FX>{s.over}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {parts.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile(vo)} startFrom={F(s0)} /></Sequence>
      ))}
      {raws.map((r, i) => {
        const n = F(r.b) - F(r.a);
        return (
          <Sequence key={"r" + i} from={F(r.a)} durationInFrames={n} layout="none">
            <Audio src={staticFile(r.wav)} startFrom={F(r.s)} volume={(f) => {
              const t = r.s + f / 30;
              const m = (r.mute ?? []).reduce((v, [a, b]) => Math.min(v, t < a - 0.08 || t > b + 0.08 ? 1 : 0), 1);
              return dB(r.g ?? 0) * m * interpolate(f, [0, 6, n - 14, n - 3], [0, 1, 1, 0], cl);
            }} />
          </Sequence>
        );
      })}
      {beds.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} volume={(f) => dB(g) * interpolate(f, [0, 12, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {music.passes.map(([a, b, off], k) => (
        <Sequence key={"m" + k} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(music.file)} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + a;
            const duck = raws.reduce((m, { a: ra, b: rb, duck: lv = 0.15 }) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
            const env = interpolate(t, [a, a + 1, b - 1.5, b], [0, 1, 1, 0], cl);
            return dB(music.db) * env * duck;
          }} />
        </Sequence>
      ))}
      {sfx.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

export { TitleCard, camAt, placeOf, io, out, cl };
