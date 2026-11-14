// DC01 PressClip: the real CBS News article as two torn newspaper clippings (cut from the page capture, not re-typed) in a 3-D
// space over the dimmed, softly blurred dashcam. The headline clipping (CBS NEWS logo, headline, byline, date) drops in and settles
// tilted; on the commander's words the quote paragraph clipping slides in nearer the camera, the headline behind dims, the camera eases
// onto the quote and one soft band of light passes across it (no red, no boxes).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, Cam, cl, ease, out } from "./DC01_kit";

export const PressClip: React.FC<{ bg: string; bgFrom: number; bgKeys: CK[]; head: string; headW: number; headH: number; quote: string; quoteW: number; quoteH: number; quoteAt: number; credit?: string }> = ({ bg, bgFrom, bgKeys, head, headW, headH, quote, quoteW, quoteH, quoteAt }) => {
  const f = useCurrentFrame();
  const h = out(interpolate(f, [0, 20], [0, 1], cl));
  const q = out(interpolate(f, [quoteAt, quoteAt + 22], [0, 1], cl));
  const push = ease(f, quoteAt + 6, quoteAt + 120);
  const sweep = interpolate(f, [quoteAt + 34, quoteAt + 84], [-0.3, 1.3], cl);
  const HW = 980, HH = HW * headH / headW, QW = 1240, QH = QW * quoteH / quoteW;
  const shadow = "drop-shadow(0 26px 30px rgba(0,0,0,.55)) drop-shadow(0 4px 6px rgba(0,0,0,.35))";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Cam src={bg} from={bgFrom} keys={bgKeys} filter={`blur(${5 + 3 * q}px) brightness(${0.5 - 0.12 * q}) saturate(.75)`} />
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 45%" }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translate3d(${-30 * push}px, ${-70 * push}px, ${150 * push}px)` }}>
          {/* headline clipping */}
          <div style={{ position: "absolute", left: 960 - HW / 2 - 120, top: 190 + (1 - h) * -60, width: HW, height: HH, opacity: h,
            transform: `rotateX(${10 - 4 * h}deg) rotateZ(${-4 + 1.6 * h}deg) translateZ(${-60 * (1 - h)}px)`, filter: `${shadow} brightness(${1 - 0.28 * q})` }}>
            <Img src={staticFile(head)} style={{ width: "100%", height: "100%" }} />
          </div>
          {/* quote clipping, nearer */}
          <div style={{ position: "absolute", left: 960 - QW / 2 + 60 + (1 - q) * 260, top: 640 + (1 - q) * 120, width: QW, height: QH, opacity: q,
            transform: `translateZ(${90 * q}px) rotateX(${8 * (1 - q) + 3}deg) rotateZ(${2.4 - 1.2 * q}deg)`, filter: shadow }}>
            <Img src={staticFile(quote)} style={{ width: "100%", height: "100%" }} />
            <div style={{ position: "absolute", inset: 0, mixBlendMode: "soft-light", opacity: 0.85,
              background: `linear-gradient(100deg, rgba(255,255,255,0) ${(sweep - 0.18) * 100}%, rgba(255,255,255,.9) ${sweep * 100}%, rgba(255,255,255,0) ${(sweep + 0.18) * 100}%)` }} />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
