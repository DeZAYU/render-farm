// neon / IconPair: two linked neon glyphs on a diagonal; the first DRAWS on stroke by stroke, a link (dotted signal / wire) runs from it to the
// second, and the second reacts on its word (a glint, a REC dot blinking, a swap to an "open" state). REF VV §7 neon pictograms (Visual Venture
// TV @ 0:32.3 TV: content changes hard on the phrase; colour = meaning) + VV §8 word ghost for the chip labels.
// Ours: draw-on entry instead of a pop, diagonal low-left -> high-right layout, the link is a travelling dotted signal, the camera eases toward B.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, W, EZ, clamp01, ghost, lerp } from "../../core";
import { Glyph, NeonGlyph, NEON, neonFilter, hexA } from "./glyphs";

export type IconPairProps = {
  a: { glyph: string; colour: string; at: number; label?: string; drawFrames?: number };
  b: { glyph: string; colour: string; at: number; label?: string; swapTo?: { glyph: string; at: number } };
  link: { at: number; frames?: number; style?: "dots" | "wire"; colour?: string };
  react?: { kind: "glint" | "rec"; at: number; colour?: string; on?: "a" | "b" };
  layout?: "diagonal" | "row";
};

export const IconPair: React.FC<IconPairProps> = ({ a, b, link, react, layout = "diagonal" }) => {
  const f = useCurrentFrame();
  const A = layout === "row" ? { x: W * 0.3, y: H * 0.47 } : { x: W * 0.32, y: H * 0.6 };
  const B = layout === "row" ? { x: W * 0.7, y: H * 0.47 } : { x: W * 0.68, y: H * 0.38 };
  // camera eases a little toward B once it arrives
  const ck = EZ.quick((f - b.at) / 40);
  const s = 1 + 0.06 * ck + 0.0006 * Math.max(0, f);
  const cx = lerp(W / 2, (W / 2 + B.x) / 2, 0.35 * ck), cy = lerp(H / 2, (H / 2 + B.y) / 2, 0.35 * ck);
  const ad = EZ.out3((f - a.at) / (a.drawFrames ?? 14));
  const lk = EZ.out3((f - link.at) / (link.frames ?? 16));
  const lc = link.colour ?? NEON.white;
  const r1 = 190, r2 = 180, dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const p0 = { x: A.x + ux * r1, y: A.y + uy * r1 }, p1 = { x: B.x - ux * r2, y: B.y - uy * r2 };
  const bName = b.swapTo && f >= b.swapTo.at ? b.swapTo.glyph : b.glyph;
  const bPop = b.swapTo && f >= b.swapTo.at ? 1 + 0.2 * (1 - EZ.out3((f - b.swapTo.at) / 8)) : 1;
  const rk = react ? f - react.at : -1;
  const R = react?.on === "a" ? A : B;
  const chip = (x: number, y: number, t: string, at: number, c: string) => (
    <div style={{ position: "absolute", left: x - 300, width: 600, top: y, textAlign: "center", fontFamily: FONT.bebas, fontSize: 64, letterSpacing: "0.06em", color: c, opacity: ghost(f - at), textShadow: `0 0 14px ${hexA(c, 0.5)}` }}>{t}</div>
  );
  const scr = (q: { x: number; y: number }) => ({ x: (q.x - cx) * s + W / 2, y: (q.y - cy) * s + H / 2 });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${s.toFixed(5)}) translate(${-cx} ${-cy})`}>
          {f >= a.at ? <g transform={`translate(${A.x} ${A.y})`} style={{ filter: neonFilter(a.colour) }}><Glyph name={a.glyph} colour={a.colour} size={340} mode="line" lineW={10} draw={Math.max(0.001, ad)} /></g> : null}
          {f >= a.at + (a.drawFrames ?? 14) ? <NeonGlyph name={a.glyph} colour={a.colour} x={A.x} y={A.y} size={340} o={EZ.out2((f - a.at - (a.drawFrames ?? 14)) / 6)} /> : null}
          {lk > 0 ? (link.style === "wire" ? (
            <path d={`M${p0.x} ${p0.y} L${lerp(p0.x, p1.x, lk)} ${lerp(p0.y, p1.y, lk)}`} stroke={lc} strokeWidth={8} strokeLinecap="round" style={{ filter: neonFilter(lc) }} />
          ) : (
            <g fill={lc} style={{ filter: neonFilter(lc) }}>
              {Array.from({ length: 14 }, (_, i) => {
                const u = i / 13;
                if (u > lk) return null;
                const pulse = 0.45 + 0.55 * Math.max(0, Math.sin((u * 6 - (f - link.at) * 0.35) * Math.PI));
                return <circle key={i} cx={lerp(p0.x, p1.x, u)} cy={lerp(p0.y, p1.y, u)} r={7} opacity={pulse} />;
              })}
            </g>
          )) : null}
          {f >= b.at ? <NeonGlyph name={bName} colour={b.colour} x={B.x} y={B.y} size={320 * bPop} /> : null}
          {react && rk >= 0 && react.kind === "glint" ? (
            <g transform={`translate(${R.x + 70} ${R.y - 80}) rotate(${rk * 4}) scale(${(EZ.out3(rk / 5) * (1 - 0.6 * clamp01((rk - 8) / 14))).toFixed(3)})`} style={{ filter: neonFilter("#FFFFFF") }}>
              <path d="M0 -46 L9 -9 L46 0 L9 9 L0 46 L-9 9 L-46 0 L-9 -9 Z" fill="#FFFFFF" />
            </g>
          ) : null}
          {react && rk >= 0 && react.kind === "rec" ? (
            <g opacity={Math.floor(rk / 12) % 2 === 0 ? 1 : 0.25}>
              <circle cx={R.x + 120} cy={R.y - 110} r={18} fill={react.colour ?? NEON.red} style={{ filter: neonFilter(react.colour ?? NEON.red) }} />
              <text x={R.x + 150} y={R.y - 96} fontFamily={FONT.bebas} fontSize={46} fill={react.colour ?? NEON.red}>REC</text>
            </g>
          ) : null}
        </g>
      </svg>
      {a.label ? chip(scr(A).x, scr(A).y + 200 * s, a.label, a.at + 6, a.colour) : null}
      {b.label ? chip(scr(B).x, scr(B).y + 190 * s, b.label, b.swapTo?.at ?? b.at + 4, b.colour) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const PAIR_DEMO: IconPairProps = {
  a: { glyph: "wristband", colour: NEON.white, at: 0, label: "WRISTBAND", drawFrames: 16 },
  link: { at: 30, frames: 18, style: "dots", colour: NEON.cyan },
  b: { glyph: "locker", colour: NEON.cyan, at: 48, label: "LOCKER OPENS", swapTo: { glyph: "lockerOpen", at: 74 } },
  react: { kind: "glint", at: 22, on: "a" },
};
