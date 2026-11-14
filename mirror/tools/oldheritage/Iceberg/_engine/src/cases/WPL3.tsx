// Workplace LEVEL 3 piece (WPL3): the level call (vo/raw/CASE13.mp3 0-7.60 s; case WP13 starts its VO after it) over the shared
// iceberg descent (dev/WPL_LevelDescent). VO at 0.20 s so "level" lands as "Level 3" types on the berg; music under, fade to black.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { LevelDescent } from "../dev/WPL_LevelDescent";

const F = (s: number) => Math.round(s * 30);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(8.55);

export const Comp: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <LevelDescent n={3} name="SOMEONE WAS STILL IN THERE" />
    <Sequence from={F(0.20)} durationInFrames={F(7.60)} layout="none">
      <Audio src={staticFile("vor/CASE13.mp3")} volume={(f) => interpolate(f, [F(7.60) - 4, F(7.60)], [1, 0], cl)} />
    </Sequence>
    {/* music: Epidemic ambient Music 4 (−21.4 dB ≈ 10 LU under the VO, as TP00), a different stretch per level */}
    <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(70)} volume={(f) => dB(-21.4) * interpolate(f, [0, 20, DUR - 14, DUR - 1], [0, 1, 1, 0], cl)} />
  </AbsoluteFill>
);
