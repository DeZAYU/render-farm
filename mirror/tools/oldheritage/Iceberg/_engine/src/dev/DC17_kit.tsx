// DC17-DC20 helpers (not a device): a still with an eased push, and the case runner shared by DC17-DC20 (title, shots on the VO,
// the one VO take split only at the raws, raw audio from the cleaned wav inside raw windows only, real SFX beds, music ducked under raws).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { TitleCard } from "../brand";
import { type CK, io } from "./DC01_kit";

export const F = (s: number) => Math.round(s * 30);
export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const dB = (d: number) => Math.pow(10, d / 20);
/** two-key camera for Cam: from (s,x,y) to (s,x,y) over n frames */
export const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

/** a still filling the frame (cover) with a slow eased push toward fx/fy */
export const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number; x0?: number; x1?: number }> = ({ src, n, s0, s1, fx, fy, x0 = 0, x1 = 0 }) => {
  const f = useCurrentFrame(); const u = io(Math.min(1, f / n)); const s = s0 + (s1 - s0) * u, dx = x0 + (x1 - x0) * u;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${fx * 100}% ${fy * 100}%`, transform: `translateX(${dx}px) scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};

export type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode; grain?: number };
export type Raw = { a: number; b: number; src: number; g: number; duck: number; rate?: number };
export type CaseDef = {
  title: string; titleBg: string; titleLen?: number; vo: string; clean?: string; dur: number;
  shots: Sh[]; cuts: FxCut[]; parts: [number, number, number | null][]; raws: Raw[];
  sfx: [number, string, number][]; beds: [number, number, string, number][];
  music: { file: string; db: number; passes: [number, number, number][] };
};

export const CaseRunner: React.FC<{ c: CaseDef }> = ({ c }) => {
  const T = c.titleLen ?? 4.0;
  return (
    <LibFontGate>
      <AbsoluteFill style={{ background: "#000" }}>
        <Transitions_FX cuts={c.cuts}>
          <AbsoluteFill>
            <Sequence from={0} durationInFrames={F(T)} layout="none"><AbsoluteFill><TitleCard dur={F(T)} title={c.title} bg={c.titleBg} /></AbsoluteFill></Sequence>
            {c.shots.map((s, i) => {
              const n = F(s.b) - F(s.a);
              return (
                <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                  <AbsoluteFill><FilmLook_FX grain={s.grain ?? 0.08}>{s.node(n)}</FilmLook_FX>{s.over}</AbsoluteFill>
                </Sequence>
              );
            })}
          </AbsoluteFill>
        </Transitions_FX>
        {c.parts.map(([at, s0, s1], i) => (
          <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile(c.vo)} startFrom={F(s0)} /></Sequence>
        ))}
        {c.clean && c.raws.map((r, i) => r.g > -60 && (
          <Sequence key={"r" + i} from={F(r.a)} durationInFrames={F(r.b) - F(r.a)} layout="none">
            <Audio src={staticFile(c.clean!)} startFrom={F(r.src)} playbackRate={r.rate ?? 1} volume={(f) => dB(r.g) * interpolate(f, [0, 6, F(r.b - r.a) - 14, F(r.b - r.a) - 3], [0, 1, 1, 0], cl)} />
          </Sequence>
        ))}
        {c.beds.map(([a, b, file, g], i) => (
          <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
            <Audio src={staticFile(file)} loop volume={(f) => dB(g) * interpolate(f, [0, 10, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
          </Sequence>
        ))}
        {c.music.passes.map(([a, b, off], k) => (
          <Sequence key={"m" + k} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
            <Audio src={staticFile(c.music.file)} startFrom={F(off)} volume={(f) => {
              const t = f / 30 + a;
              const duck = c.raws.reduce((m, r) => Math.min(m, t < r.a - 0.8 || t > r.b + 0.6 ? 1 : t < r.a ? r.duck + (1 - r.duck) * (r.a - t) / 0.8 : t > r.b ? r.duck + (1 - r.duck) * (t - r.b) / 0.6 : r.duck), 1);
              const env = interpolate(t, [a, a + 1.0, b - 1.4, b], [0, 1, 1, 0], cl);
              return dB(c.music.db) * env * duck;
            }} />
          </Sequence>
        ))}
        {c.sfx.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
      </AbsoluteFill>
    </LibFontGate>
  );
};
