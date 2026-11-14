// censor / Mosaic: Abyssal pixel mosaic on victims (abyssal_chinese_iceberg STUDY §7 + I9: blocks ~40-60 px at 1080p, up to ~1/12 W on gore
// close-ups, e.g. 29:00-29:16, 59:00-59:28). Our version: true block averaging (SVG pixelate filter: sample + tile + dilate) on a tracked region,
// with a SOFT feathered region edge (the blocks stay crisp inside, the region dissolves into the picture), and the block grid locked to the
// screen so blocks never shimmer while the region moves.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Footage, Graded, ellipseMask, trackAt, type TrackKey } from "./shared";

export type MosaicProps = {
  media: string; startFrom?: number;
  regions: { keys: TrackKey[]; from?: number; to?: number }[];
  block?: number; // px (Abyssal 40-60; 120-160 on gore close-ups)
  feather?: number;
  id?: string; // unique filter id if several mosaics are on screen
};
export const Mosaic: React.FC<MosaicProps> = ({ media, startFrom = 0, regions, block = 48, feather = 0.3, id = "lib-mosaic" }) => {
  const f = useCurrentFrame();
  const live = regions.filter((r) => f >= (r.from ?? -1e9) && f < (r.to ?? 1e9)).map((r) => trackAt(r.keys, f));
  const b = Math.round(block), h = Math.max(1, Math.floor(b / 2));
  return (
    <Graded>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feFlood x={h} y={h} width={2} height={2} />
          <feComposite width={b} height={b} />
          <feTile result="grid" />
          <feComposite in="SourceGraphic" in2="grid" operator="in" />
          <feMorphology operator="dilate" radius={h} />
        </filter>
      </svg>
      <Footage src={media} startFrom={startFrom} />
      {live.map((r, i) => {
        const m = ellipseMask(r, feather);
        return (
          <AbsoluteFill key={i} style={{ WebkitMaskImage: m, maskImage: m }}>
            <AbsoluteFill style={{ filter: `url(#${id})` }}>
              <Footage src={media} startFrom={startFrom} style={{ filter: "blur(3px)" }} />
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
    </Graded>
  );
};
