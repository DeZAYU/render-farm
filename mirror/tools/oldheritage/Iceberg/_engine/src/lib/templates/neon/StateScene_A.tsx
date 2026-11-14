// neon / StateScene_A (EDITOR A sibling of ChainReaction / GlyphSwapX / SplitContrast; Amusement Park 2026-10-19).
// REF VV 2026 "Impossible Cold Cases" 0:56-1:02 (family -> couple -> red divider -> weapon), 2:16-2:22, 11:05-12:35 (TEMPLATE_UPGRADES #5):
// ONE neon line-art scene that CHANGES STATE on the VO's words: figures fade out, a red dashed divider draws, an object is added, a part turns
// red, small red typed words appear. Camera never still: oversize 1.1 -> 1 settle (EZ.quick), +3 %/s push, -24 px/s drift, -0.35 deg/s roll
// (VV measured +8.6 %/s / 30 px/s / -0.65 deg/s; ours is calmer so the words stay readable), drift ramps in over 20 f (no linear start).
// Entry: 9 f cross-dissolve from the footage plate (VV26 55.4 s), silent. Skin: white glow strokes + #E30A10 key (never VV teal/magenta).
// SFX: typing_key on each typed word (case mix), nothing on the dissolve.
import React from "react";
import { LineScene, type LCam, type LItem, type LWord } from "./lineEngine_A";

export type StateSceneAProps = { items: LItem[]; words?: LWord[]; cam?: LCam; plate?: React.ReactNode; outAt?: number; labelCap?: number; skel?: string };
export const StateScene_A: React.FC<StateSceneAProps> = ({ items, words, cam, plate, outAt, labelCap = 34, skel }) => (
  <LineScene look="neon" items={items} words={words} cam={{ s0: 1.1, push: 0.03, dx: -24, roll: -0.35, ...cam }} plate={plate} outAt={outAt} labelCap={labelCap} skel={skel} />
);
