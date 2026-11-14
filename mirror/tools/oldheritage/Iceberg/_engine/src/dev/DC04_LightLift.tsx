// DC04 LightLift: the night dashcam keeps running (slightly slowed) while a soft horizontal band across the road just past the striped
// pole is lifted out of the dark (the same picture, exposure raised inside a feathered band) so the branch and the row of bottles become
// readable; the rest of the frame sinks a little; the camera eases toward the band, then everything returns to the plain picture so the
// raw runs on from the same frame. No text, no shapes.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cam, type CK, cl, io } from "./DC01_kit";

export const LightLift: React.FC<{
  src: string; from: number; rate: number; keys: CK[];
  band: { y0: number; y1: number; x0: number; x1: number }; // screen fractions
  inAt: number; inLen: number; outAt: number; outLen: number; lift?: number;
}> = ({ src, from, rate, keys, band, inAt, inLen, outAt, outLen, lift = 2.6 }) => {
  const f = useCurrentFrame();
  const a = io(interpolate(f, [inAt, inAt + inLen], [0, 1], cl)) * (1 - io(interpolate(f, [outAt, outAt + outLen], [0, 1], cl)));
  const feather = 6; // % of the picture
  const mask = `linear-gradient(180deg, transparent ${band.y0 * 100 - feather}%, #000 ${band.y0 * 100}%, #000 ${band.y1 * 100}%, transparent ${band.y1 * 100 + feather}%),` +
    `linear-gradient(90deg, transparent ${band.x0 * 100 - feather * 2}%, #000 ${band.x0 * 100}%, #000 ${band.x1 * 100}%, transparent ${band.x1 * 100 + feather * 2}%)`;
  return (
    <AbsoluteFill>
      <Cam src={src} from={from} rate={rate} keys={keys} filter={`brightness(${1 - 0.3 * a})`} />
      <AbsoluteFill style={{ opacity: a, WebkitMaskImage: mask, maskImage: mask, WebkitMaskComposite: "source-in", maskComposite: "intersect" }}>
        <Cam src={src} from={from} rate={rate} keys={keys} filter={`brightness(${lift}) contrast(1.15) saturate(.85)`} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
