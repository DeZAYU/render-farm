// diagram / LineSection_A (EDITOR A sibling of StructureSection / BuildOnWords; Amusement Park 2026-10-19).
// REF Farrell McGuire line-art explainers (FA/FB: white strokes, red key part, labels on the spoken word) + CHANNEL_STYLE §15 diagrams.
// The ride's geometry draws on the words over the case's own footage dimmed to .26 (never empty black); the failing part turns red and pulses;
// Varela labels with leader lines land on their words. Editor A motion: oversize 1.08 -> 1 settle, then the camera MOVES between stations
// (EZ.quick re-centres, VV §11 phase A) with a slow +1 %/s push and lateral drift; no roll (Farrell keeps the horizon level). Silent.
import React from "react";
import { LineScene, type LCam, type LItem, type LWord } from "../neon/lineEngine_A";

export type LineSectionAProps = { items: LItem[]; words?: LWord[]; cam?: LCam; plate: React.ReactNode; plateDim?: number; outAt?: number; labelCap?: number; skel?: string };
export const LineSection_A: React.FC<LineSectionAProps> = ({ items, words, cam, plate, plateDim = 0.26, outAt, labelCap = 36, skel }) => (
  <LineScene look="line" items={items} words={words} cam={{ s0: 1.08, push: 0.01, dx: -14, roll: 0, ...cam }} plate={plate} plateDim={plateDim} outAt={outAt} labelCap={labelCap} skel={skel} />
);
