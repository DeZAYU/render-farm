// Workplace LEVEL 4 piece (WPL4): the level call (vo/raw/CASE18.mp3 0-3.05 s; case WP18 starts its VO after it) over the shared
// iceberg descent (dev/WPL_LevelDescent). VO at 0.75 s so "level" lands as "Level 4" types on the berg; music under, fade to black.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { LevelDescent } from "../dev/WPL_LevelDescent";

const F = (s: number) => Math.round(s * 30);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(4.55);

export const Comp: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <LevelDescent n={4} name="THEY DIDN'T COME HOME" />
    <Sequence from={F(0.75)} durationInFrames={F(3.05)} layout="none">
      <Audio src={staticFile("vor/CASE18.mp3")} volume={(f) => interpolate(f, [F(3.05) - 4, F(3.05)], [1, 0], cl)} />
    </Sequence>
    {/* music: Epidemic ambient Music 4 (−21.4 dB ≈ 10 LU under the VO, as TP00), a different stretch per level */}
    <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(100)} volume={(f) => dB(-21.4) * interpolate(f, [0, 20, DUR - 14, DUR - 1], [0, 1, 1, 0], cl)} />
  </AbsoluteFill>
);
