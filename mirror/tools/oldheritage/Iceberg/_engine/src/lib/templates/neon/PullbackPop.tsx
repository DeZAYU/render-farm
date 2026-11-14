// neon / PullbackPop. REF VV §7 neon pictograms (Visual Venture "Most Disturbing Moments Ever Captured on TV" @ 0:32.3 TV: pops on the cut, 1 f,
// no fade, the whole group pulls back -24 % in 69 f bezier (0.522, 0.672, 1, 1) while the content swaps hard on each phrase; @ 1:44.1 crowd:
// new elements on their phrase, colour = meaning); wp3 sec_A CornPicto @ abs 2003 (heap -> cob + arrow -> colour drops fall in, the heap takes the colours).
// Ours: items can pop, draw on (arrows, 6 f) or fall in (drops, ease-in 12 f) and can re-tint on a word; Bebas words pop hard under the group.
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, W, EZ, clamp01, lerp } from "../../core";
import { NeonGlyph, NEON } from "./glyphs";
import { NeonStage, PopCaption, type CapWord } from "./shared";

export type PopItem = {
  glyph: string; colour: string; x: number; y: number; size?: number; rot?: number; // x/y = offset from the group centre (px at scale 1)
  at: number; until?: number; // pops on `at` (hard), cut on `until`
  enter?: "pop" | "draw" | "fall"; // draw = strokes draw on in 6 f; fall = drops in from 300 px above, ease-in 12 f (then gone unless `stay`)
  stay?: boolean;
  tint?: { at: number; colour: string }; // re-colours on a word (4 f cross-fade)
};
export type PullbackPopProps = {
  items: PopItem[];
  captions?: CapWord[];
  scale0?: number; // group scale at frame 0
  pull?: number; // pull-back fraction (VV -24 %)
  pullFrames?: number; // VV 69 f
  centre?: { x: number; y: number };
  floor?: string; // floor light colour (none = no floor)
  captionY?: number; captionSize?: number;
};

export const PullbackPop: React.FC<PullbackPopProps> = ({ items, captions = [], scale0 = 1.32, pull = 0.24, pullFrames = 69, centre = { x: W / 2, y: H / 2 - 20 }, floor, captionY, captionSize }) => {
  const f = useCurrentFrame();
  const sc = scale0 * (1 - pull * EZ.tvPull(clamp01(f / pullFrames)));
  return (
    <NeonStage floor={floor ? { colour: floor, y: centre.y + 130 * sc } : undefined}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${centre.x} ${centre.y}) scale(${sc.toFixed(5)})`}>
          {items.map((it, i) => {
            const k = f - it.at;
            if (k < 0 || (it.until !== undefined && f >= it.until)) return null;
            let y = it.y, o = 1, draw = 1;
            if (it.enter === "fall") {
              const u = clamp01(k / 12);
              y = lerp(it.y - 300, it.y, EZ.in2(u));
              if (u >= 1 && !it.stay) return null;
            } else if (it.enter === "draw") draw = Math.max(0.001, EZ.out3(k / 6));
            const tk = it.tint ? clamp01((f - it.tint.at) / 4) : 0;
            const glyph = <NeonGlyph name={it.glyph} colour={it.colour} x={it.x} y={y} size={it.size ?? 200} rot={it.rot ?? 0} o={o * (1 - tk)} draw={draw} />;
            return (
              <g key={i}>
                {glyph}
                {it.tint && tk > 0 ? <NeonGlyph name={it.glyph} colour={it.tint.colour} x={it.x} y={y} size={it.size ?? 200} rot={it.rot ?? 0} o={tk} /> : null}
              </g>
            );
          })}
        </g>
      </svg>
      <PopCaption f={f} words={captions} y={captionY} size={captionSize} />
    </NeonStage>
  );
};

const DROPS = [NEON.magenta, NEON.cyan, NEON.yellow, NEON.green, NEON.orange];
export const PULLBACK_DEMO: PullbackPopProps = {
  items: [
    { glyph: "heap", colour: NEON.white, x: 170, y: 40, size: 380, at: 0, tint: { at: 60, colour: "#FF4FD8" } },
    { glyph: "cob", colour: NEON.white, x: -330, y: 0, size: 300, rot: -14, at: 20 },
    { glyph: "arrow", colour: NEON.white, x: -120, y: 10, size: 120, at: 22, enter: "draw" },
    ...DROPS.map((c, i) => ({ glyph: "drop", colour: c, x: 70 + i * 50, y: -40 - ((i * 37) % 50), size: 46, at: 44 + i * 2, enter: "fall" as const })),
  ],
  captions: [{ t: "INGREDIENT", at: 20 }, { t: "+ COLOUR", at: 44, colour: NEON.yellow }],
  floor: "#FF2A3A",
};
