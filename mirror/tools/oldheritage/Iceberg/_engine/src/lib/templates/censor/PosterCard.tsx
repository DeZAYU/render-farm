// censor / PosterCard: Abyssal posterised censor card (abyssal_chinese_iceberg STUDY §7 @ 13:53.7-14:04.5, 10.8 s: the worst image turned into
// colour-noise posterisation with one small VCR-mono line at y .88). Full-frame replacement, harsher and more "found footage" than CensorCard:
// the clip (kept moving: a frozen frame flickers under SVG filters) is crushed to a few colour levels, heavily mosaicked (block 1/24 W) and broken by animated RGB noise; the line types on.
// Our version: our own note ("FOOTAGE REMOVED: TOO GRAPHIC"), a slow push so it is never dead, and a soft entry through 3 f of noise.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, W, clamp01, drift, fs } from "../../core";
import { Footage, Graded } from "./shared";

export type PosterCardProps = { media: string; startFrom?: number; freezeAt: number; note: string; noteAt?: number; block?: number; id?: string };
export const PosterCard: React.FC<PosterCardProps> = ({ media, startFrom = 0, freezeAt, note, noteAt, block = 80, id = "lib-poster" }) => {
  const f = useCurrentFrame();
  const k = f - freezeAt;
  const plate = <Footage src={media} startFrom={startFrom} />;
  const seed = Math.floor(f / 2);
  const na = noteAt ?? freezeAt + 10;
  const n = Math.max(0, Math.min(note.length, Math.floor((f - na) / 2)));
  const h = Math.floor(block / 2);
  if (k < 0) return <Graded>{plate}</Graded>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feFlood x={h} y={h} width={2} height={2} /><feComposite width={block} height={block} /><feTile result="g" />
          <feComposite in="SourceGraphic" in2="g" operator="in" /><feMorphology operator="dilate" radius={h} result="m" />
          <feComponentTransfer in="m">
            <feFuncR type="discrete" tableValues="0.04 0.28 0.6 0.88" /><feFuncG type="discrete" tableValues="0.03 0.18 0.42" /><feFuncB type="discrete" tableValues="0.06 0.24 0.5" />
          </feComponentTransfer>
        </filter>
        <filter id={`${id}-n`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={seed} /><feColorMatrix type="matrix" values="1.6 0 0 0 -0.4  0 1.6 0 0 -0.45  0 0 1.6 0 -0.3  0 0 0 0 0.55" /></filter>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id}) saturate(1.05)` }}>
        {/* the filtered layer itself must stay untransformed (a scaled 1-px flood rounds away -> empty frames); the drift lives inside */}
        <Footage src={media} startFrom={startFrom} push={0} style={{ filter: "blur(2px)", transform: `scale(${drift(k, 0.015).toFixed(5)})` }} />
      </AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: k < 3 ? 0.9 : 0.35 }}><rect width={W} height={H} filter={`url(#${id}-n)`} /></svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.6) 100%)" }} />
      <div style={{ position: "absolute", left: 0, width: W, top: 0.88 * H - 30, textAlign: "center", fontFamily: FONT.vcr, fontSize: fs("vcr", 30), color: "#F2F2F2", letterSpacing: "0.06em",
        textShadow: "2px 0 rgba(255,0,0,.6), -2px 0 rgba(0,160,255,.6), 0 0 8px rgba(255,255,255,.4)", opacity: clamp01((f - na) / 2) }}>
        {note.slice(0, n)}<span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>_</span>
      </div>
    </AbsoluteFill>
  );
};
