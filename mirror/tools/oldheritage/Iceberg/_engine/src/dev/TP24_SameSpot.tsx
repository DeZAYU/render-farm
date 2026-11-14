// TP24 SameSpot: two filmers' frames of the Demon's lift hill on 1 Sep 2018, aligned and onion-skinned into one picture.
//   1 = JiggidyNDG's clip just after the first walk-down (the empty train still parked at the top of the lift),
//   2 = L. Michelle's clip of the second stop (the train full, riders on the stairs).
// The first frame starts full screen, a white bracket finds its train (tag 1); the frame then scales/moves onto the second filmer's
// framing (matched on the train's front car and the crest) and the second frame fades in under it as an onion skin; the second
// bracket (tag 2) lands on the same spot. The ghost of 1 keeps breathing over 2 so both trains read at once.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Box = [number, number, number, number]; // x0, y0, x1, y1 in that image's own pixels
export const SameSpot: React.FC<{
  a: string; aw: number; ah: number; aBox: Box;      // first frame (its own size) + the train bracket in its pixels
  b: string; bBox: Box;                              // second frame (1920x1080) + its train bracket
  align: { k: number; ax: number; ay: number; bx: number; by: number }; // a scaled by k (a px -> b px), a's (ax,ay) lands on b's (bx,by)
  moveAt?: number; moveLen?: number;
}> = ({ a, aw, ah, aBox, b, bBox, align, moveAt = 50, moveLen = 40 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // a's placement: full frame (cover) -> aligned onto b
  const fit = Math.max(width / aw, height / ah);
  const m = io(interpolate(f, [moveAt, moveAt + moveLen], [0, 1], cl));
  const sc = fit + (align.k - fit) * m;
  const ox = ((width - aw * fit) / 2) * (1 - m) + (align.bx - align.ax * align.k) * m;
  const oy = ((height - ah * fit) / 2) * (1 - m) + (align.by - align.ay * align.k) * m;
  // the whole picture pushes slowly toward the train fronts
  const push = 1 + 0.07 * io(f / durationInFrames);
  const fx = align.bx / width, fy = align.by / height;
  // b fades in under a; a becomes a ghost that breathes
  const bIn = interpolate(f, [moveAt + moveLen * 0.4, moveAt + moveLen + 6], [0, 1], cl);
  const breathe = 0.42 + 0.14 * Math.sin((f - moveAt - moveLen) / 9);
  const aOp = interpolate(f, [moveAt + moveLen * 0.4, moveAt + moveLen + 6], [1, 0], cl) * (1 - breathe) + breathe;
  const aBx: Box = [ox + aBox[0] * sc, oy + aBox[1] * sc, ox + aBox[2] * sc, oy + aBox[3] * sc];
  const g1 = out(interpolate(f, [10, 26], [0, 1], cl));
  const g2 = out(interpolate(f, [moveAt + moveLen + 4, moveAt + moveLen + 20], [0, 1], cl));
  const bracket = (bx: Box, g: number, key: string, inset = 0) => {
    const [x0, y0, x1, y1] = [bx[0] - inset, bx[1] - inset, bx[2] + inset, bx[3] + inset]; const w = x1 - x0, h = y1 - y0, P = 2 * (w + h);
    return <rect key={key} x={x0} y={y0} width={w} height={h} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />;
  };
  const tag = (n: string, x: number, y: number, g: number) => (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${0.7 + 0.3 * g})`, opacity: g, transformOrigin: "50% 100%" }}>
      <div style={{ background: RED, padding: "4px 16px 2px", boxShadow: "0 6px 18px rgba(0,0,0,.45)", fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 52, lineHeight: 1, color: "#0B0B0B" }}>{n}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <RedLabel text="" at={1e6} />{/* loads the channel fonts for the tags */}
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
        <Img src={staticFile(b)} style={{ position: "absolute", inset: 0, width, height, opacity: bIn }} />
        <Img src={staticFile(a)} style={{ position: "absolute", left: ox, top: oy, width: aw * sc, height: ah * sc, opacity: aOp,
          filter: f > moveAt ? `grayscale(${0.6 * m}) contrast(${1 + 0.25 * m})` : undefined,
          // once aligned, the ghost is kept to a soft oval round the two trains so the rest of frame 2 stays clean
          WebkitMaskImage: m > 0 ? `radial-gradient(ellipse ${(560 + 2400 * (1 - m))}px ${(330 + 1400 * (1 - m))}px at ${align.bx - ox}px ${align.by + 40 - oy}px, #000 55%, rgba(0,0,0,0) 100%)` : undefined }} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {bracket(aBx, g1, "a")}
          {g2 > 0 && bracket(bBox, g2, "b", 14)}
        </svg>
        {tag("1", aBx[0] + 34, aBx[1] - 12, g1)}
        {g2 > 0 && tag("2", bBox[0] + 34 + 78, bBox[1] - 14 - 12, g2)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
