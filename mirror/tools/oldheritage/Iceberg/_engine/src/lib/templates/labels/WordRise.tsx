// labels / WordRise: REF Dashcam Vol.3 E2 @0:03.4 "Northern Ontario" / @0:48.6 "July 26th, 2024" (centre of frame, white word(s) + red key word,
// Arial Rounded MT Bold class; white rises 18-20 px ease-out, alpha 0 -> .9 in 14-18 f, settled 25-28 f; red staggered, defocused -> sharp,
// rises 20-25 px, alpha .2 -> .95 in 10 f; exit 17-24 f ease-in fade + slight blur). wp3 refsys DDLabel (Intro3 "Dadifeng, Yunnan" @ abs 22).
// OUR VERSION: Varela Round + round stroke (= Arial Rounded weight, FONTS.md), crisp SVG type, a measured soft dark band behind it on bright
// footage, and a slow decelerating life drift after the settle (D2 E2) so it is never dead-still.
import React from "react";
import { H } from "../../core";
import { LabelBand, presence } from "../caseopener/shared";
import { FootPlate, RiseRow, type Word } from "./kit";
import { useCurrentFrame } from "remotion";

export type WordRiseProps = { media: string; mediaStart?: number; push?: number; words: Word[]; cap?: number; y?: number; exitAt?: number; band?: number };
export const WordRise: React.FC<WordRiseProps> = ({ media, mediaStart = 0, push = 0.045, words, cap = 104, y = 0.5 * H, exitAt, band = 0.34 }) => {
  const f = useCurrentFrame();
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      <LabelBand o={band * presence(f, words, exitAt)} y={y} h={cap * 3.6} />
      <RiseRow words={words} cap={cap} y={y} exitAt={exitAt} />
    </FootPlate>
  );
};
