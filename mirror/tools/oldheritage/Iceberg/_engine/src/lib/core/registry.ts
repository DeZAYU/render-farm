// Variant registry types. Every family folder exports `variants: VariantDef[]` from its index.ts.
import type React from "react";

export type SfxHint = { event: string; at: number; note?: string }; // sfx.json event name, LOCAL frame of its anchor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VariantDef<P = any> = {
  family: string; // folder name, lower-case (e.g. "page")
  name: string; // PascalCase variant name (= file name, e.g. "TiltedPrint")
  component: React.FC<P>;
  defaultProps: P; // placeholder content (demo media under public/demo/)
  durationInFrames: number; // demo length (30 fps)
  thumbFrame: number; // settled, representative frame -> thumbs/<family>-<name>.jpg
  stripFrames?: number[]; // frames for the motion strip check (entry), default derived
  ref: string; // reference source: "video @ timecode" (+ the wp3 file it was extracted from)
  when: string; // meaning / when to use it
  props: string; // short prop summary for CATALOGUE.md
  twist?: string; // what differs from the reference (our version)
  sfx?: SfxHint[];
  // geometry / entry / layout / accent: one word each, used to prove variants differ (CATALOGUE.md table)
  axes: { geometry: string; entry: string; layout: string; accent: string };
};
export const compId = (v: { family: string; name: string }) => `${v.family}-${v.name}`;
