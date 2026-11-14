// DC16 PageSlide: the real WHDH 7News page (capture: the blue header with logo, headline and date, then the four story paragraphs;
// ads and the syndication line left out) as one card turned slightly away in 3-D. It slides in from the right on the headline, then
// the card rises and turns square to the camera as it travels down to the last paragraph, where a thin red rule draws under
// "20 seconds" (the one phrase that matters here) and the other lines fall back.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, Cam, cl, ease, out } from "./DC01_kit";
const RED_RULE = 5;

export const PageSlide: React.FC<{ bg: string; bgFrom: number; bgKeys: CK[]; sheet: string; sw: number; sh: number;
  para: [number, number, number, number]; phrase: [number, number, number, number]; moveAt: number; moveLen: number }> = ({ bg, bgFrom, bgKeys, sheet, sw, sh, para, phrase, moveAt, moveLen }) => {
  const f = useCurrentFrame();
  const W = 1500, k = W / sw, H = sh * k;
  const enter = out(interpolate(f, [0, 24], [0, 1], cl));
  const mv = ease(f, moveAt, moveAt + moveLen);
  const rule = ease(f, moveAt + moveLen - 4, moveAt + moveLen + 16);
  const dim = ease(f, moveAt + moveLen - 6, moveAt + moveLen + 14);
  const focusY = interpolate(mv, [0, 1], [300 * k, ((para[1] + para[3]) / 2) * k]);
  const yaw = interpolate(mv, [0, 1], [-16, -4]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Cam src={bg} from={bgFrom} keys={bgKeys} filter="blur(14px) brightness(.28) saturate(.6)" />
      <AbsoluteFill style={{ perspective: 1700 }}>
        <div style={{ position: "absolute", left: 960 - W / 2 + 420 * (1 - enter), top: 540 - focusY, width: W, height: H, opacity: enter, transformOrigin: `50% ${focusY}px`,
          transform: `rotateY(${yaw}deg) rotateX(${4 * (1 - mv)}deg) scale(${0.9 + 0.14 * mv})`, boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
          <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: para[1] * k - 6, background: "#000", opacity: 0.55 * dim }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: para[3] * k + 6, bottom: 0, background: "#000", opacity: 0.55 * dim }} />
          <div style={{ position: "absolute", left: phrase[0] * k, top: phrase[3] * k + 2, height: RED_RULE, width: (phrase[2] - phrase[0]) * k * rule, background: "#E3141B" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
