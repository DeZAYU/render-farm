// footage / RadioWave (set dash2, Dashcam "INSTRUMENT" H6): a 911 call / police-radio excerpt as picture.
// REF Nocturn NA B1 / WV1 DOOR @2:04.5-2:08 (a waveform band at y 0.25-0.35 H over the footage while the call plays + per-speaker captions) +
// Dashcam Vol.1 kinetic 911 captions @18:28.8-18:38.8 (1108.8-1118.8 s: 1-2 words at a time, key role in colour) + D1 speaker boxes 168-181
// (police in colour, civilians white) + VV kinetic words (ghost 0.25-0.4 -> 1 in 3-6 f).
// Ours: the call audio drives a waveform band over the DIMMED scene footage (never on black: owner rule on WV2/WV3); the past half of the band
// is lit in the accent, the coming half in the dim colour, the playhead at the centre. Captions are 1-2-word kinetic chunks: dispatcher in the
// accent, caller in white. No audio analysis at runtime: `peaks` (0..1, 30 per s) come from `_shared_tools/peaks.py`. The call itself is the
// sound (no designed SFX).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WATERPARK, EZ, H, W, clamp01, ghost, type Theme } from "../../core";
import { FootPlate } from "../../core/kits/labels";
import { themeFs } from "../lookhere/dash2kit";

export type RadioChunk = { text: string; at: number; who: "dispatcher" | "caller"; out?: number };
export type RadioWaveProps = {
  media: string; mediaStart?: number; push?: number;
  dim?: number; // footage brightness under the band (0.5)
  peaks: number[]; peaksStart?: number; // peaks[i] = level of the call at 30/s; peaksStart = index played at local 0
  bandY?: number; bandH?: number; // band centre / height as fractions of H (NA 0.25-0.35 -> 0.30 / 0.10)
  windowSec?: number; // seconds of audio across the band
  in?: number; outAt?: number; // band in (8 f) / out (8 f)
  chunks: RadioChunk[]; capCap?: number; captionY?: number;
  theme?: Theme;
};

/** peak level at a fractional index (linear) */
const pk = (P: number[], i: number) => {
  if (i < 0 || i > P.length - 1) return 0;
  const a = Math.floor(i), u = i - a;
  return (P[a] ?? 0) * (1 - u) + (P[Math.min(P.length - 1, a + 1)] ?? 0) * u;
};

export const RadioWave: React.FC<RadioWaveProps> = ({
  media, mediaStart = 0, push = 0.03, dim = 0.5, peaks, peaksStart = 0, bandY = 0.3, bandH = 0.1, windowSec = 4, in: inAt = 0, outAt,
  chunks, capCap = 48, captionY = 0.74, theme = WATERPARK,
}) => {
  const f = useCurrentFrame();
  const bIn = EZ.out3((f - inAt) / 8) * (outAt === undefined ? 1 : 1 - EZ.out2((f - outAt) / 8));
  const dimO = (1 - dim) * EZ.out2((f - inAt) / 10) * (outAt === undefined ? 1 : 1 - EZ.out2((f - outAt) / 10));
  // waveform: bars every 2 samples across 84 % of the width, current sample at the centre
  const x0 = W * 0.08, x1 = W * 0.92, cy = H * bandY, half = (H * bandH) / 2;
  const nWin = windowSec * 30, step = 2, bars = Math.floor(nWin / step);
  const pitch = (x1 - x0) / bars, bw = Math.max(3, pitch * 0.5);
  const now = peaksStart + f;
  const rects: React.ReactNode[] = [];
  for (let j = 0; j <= bars + 1; j++) {
    const idx = (Math.floor((now - nWin / 2) / step) + j) * step; // each bar = one fixed sample index, sliding left with time
    const xi = W / 2 + ((idx - now) / step) * pitch - bw / 2;
    if (xi < x0 - pitch || xi > x1) continue;
    const v = Math.max(0.04, Math.pow(clamp01(pk(peaks, idx)), 0.8));
    const past = idx <= now;
    const edge = Math.min(1, (xi - x0) / 80, (x1 - xi) / 80); // soft ends
    const hgt = half * v * bIn;
    rects.push(<rect key={j} x={xi.toFixed(1)} y={(cy - hgt).toFixed(1)} width={bw.toFixed(1)} height={(2 * hgt).toFixed(1)} rx={bw / 2} fill={past ? theme.accent : theme.dim} opacity={clamp01(edge) * (past ? 1 : 0.55)} />);
  }
  // kinetic chunks (1-2 words): the active chunk is the LAST started one only (M-063); it ends at the next chunk's `at` or its own `out`,
  // and once it has ended nothing is shown (never fall back to an earlier chunk)
  const last = chunks.filter((c) => f >= c.at).reduce<RadioChunk | undefined>((m, c) => (!m || c.at >= m.at ? c : m), undefined);
  const act = last && (last.out === undefined || f < last.out) ? last : undefined;
  const capF = themeFs(theme.title.face, capCap);
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {dimO > 0 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dimO.toFixed(3)})` }} /> : null}
      {bIn > 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <g style={{ filter: `drop-shadow(0 0 6px ${theme.accentGlow}) drop-shadow(0 2px 3px rgba(0,0,0,.6))` }}>{rects}</g>
          <line x1={W / 2} x2={W / 2} y1={cy - half * 1.15} y2={cy + half * 1.15} stroke={theme.neutral} strokeWidth={2} opacity={0.8 * bIn} />
        </svg>
      ) : null}
      {act && bIn > 0 ? (() => {
        const k = f - act.at;
        const o = ghost(k, 4, 0.3) * bIn;
        const sc = 1 + 0.06 * (1 - EZ.out3(k / 6));
        return (
          <div key={act.at} style={{ position: "absolute", left: 0, width: W, top: H * captionY, transform: `translateY(-50%) scale(${sc.toFixed(4)})`, textAlign: "center", opacity: o,
            fontFamily: theme.title.face, fontWeight: theme.title.weight, fontSize: capF, lineHeight: 1, textTransform: "uppercase", letterSpacing: "0.02em",
            color: act.who === "dispatcher" ? theme.accent : theme.neutral, textShadow: `0 3px 10px rgba(0,0,0,.85)${act.who === "dispatcher" ? `, 0 0 18px ${theme.accentGlow}` : ""}` }}>
            {act.text}
          </div>
        );
      })() : null}
    </FootPlate>
  );
};

/** deterministic speech-like demo peaks (bursts and gaps), 30 per s */
export const demoPeaks = (n: number, seed = 3) => Array.from({ length: n }, (_, i) => {
  const t = i / 30;
  const env = Math.max(0, Math.sin(t * 1.9 + seed) * 0.6 + Math.sin(t * 0.7 + 2 * seed) * 0.5);
  const syl = 0.55 + 0.45 * Math.abs(Math.sin(t * 13.7 + seed * 1.3));
  const h = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return Math.round(clamp01(env * syl * (0.75 + 0.25 * (h - Math.floor(h)))) * 1000) / 1000;
});
