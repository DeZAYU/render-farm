// Workplace LEVEL 5 piece (WPL5): the level call (vo/raw/CASE25.mp3 0-11.55 s; case WP25 starts its VO after it) over the shared
// iceberg descent (dev/WPL_LevelDescent). VO at 0.50 s so "level" lands as "Level 5" types on the berg; music under, fade to black.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { LevelDescent } from "../dev/WPL_LevelDescent";

const F = (s: number) => Math.round(s * 30);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(12.80);

export const Comp: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <LevelDescent n={5} name="THE BOTTOM" />
    <Sequence from={F(0.50)} durationInFrames={F(11.55)} layout="none">
      <Audio src={staticFile("vor/CASE25.mp3")} volume={(f) => interpolate(f, [F(11.55) - 4, F(11.55)], [1, 0], cl)} />
    </Sequence>
    {/* music: Epidemic ambient Music 4 (−21.4 dB ≈ 10 LU under the VO, as TP00), a different stretch per level */}
    <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(130)} volume={(f) => dB(-21.4) * interpolate(f, [0, 20, DUR - 14, DUR - 1], [0, 1, 1, 0], cl)} />
  </AbsoluteFill>
);
