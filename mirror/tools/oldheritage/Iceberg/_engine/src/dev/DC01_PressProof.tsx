// DC01 PressProof: the real WCAX article (page capture: masthead, headline, the dashcam still, the plea paragraph) as one printed
// sheet lying tilted in 3-D over the dim dashcam. The camera starts on the masthead and headline and travels down the sheet; on
// "pleaded guilty" the plea paragraph peels up off the page toward the camera and flattens, the sheet under it darkens, and the text
// after the first sentence fades back so the sentence that matters reads alone. Real type throughout, nothing re-set, no red.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, Cam, cl, ease, out } from "./DC01_kit";

export const PressProof: React.FC<{ bg: string; bgFrom: number; bgKeys: CK[]; sheet: string; sw: number; sh: number;
  para: [number, number, number, number]; keep: [number, number]; liftAt: number }> = ({ bg, bgFrom, bgKeys, sheet, sw, sh, para, keep, liftAt }) => {
  const f = useCurrentFrame();
  const W = 1180, k = W / sw, H = sh * k;                         // sheet on screen
  const enter = out(interpolate(f, [0, 22], [0, 1], cl));
  const travel = ease(f, 8, liftAt);                              // masthead -> paragraph
  const lift = ease(f, liftAt, liftAt + 26), dim = ease(f, liftAt + 18, liftAt + 40), zoom = ease(f, liftAt + 8, liftAt + 70);
  const [px0, py0, px1, py1] = para;                              // paragraph box in sheet px
  const pw = (px1 - px0) * k, ph = (py1 - py0) * k;
  const camY = 10 + travel * (-(py0 * k) + 400);                 // slide the sheet up under the camera
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Cam src={bg} from={bgFrom} keys={bgKeys} filter="blur(8px) brightness(.38) saturate(.7)" />
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 30%", transform: `scale(${1 + 0.3 * zoom})`, transformOrigin: "26% 46%" }}>
        <div style={{ position: "absolute", left: 960 - W / 2, top: 120 + camY, width: W, height: H, transformStyle: "preserve-3d",
          transform: `rotateX(${22 + 6 * (1 - enter)}deg) rotateZ(${-3.5}deg) translateZ(${-120 * (1 - enter) + 60 * travel}px)`, transformOrigin: "50% 0%", opacity: enter }}>
          <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: `drop-shadow(0 30px 40px rgba(0,0,0,.6)) brightness(${1 - 0.55 * dim})` }} />
          {/* where the paragraph was: bare paper once it has peeled up */}
          <div style={{ position: "absolute", left: px0 * k, top: py0 * k, width: pw, height: ph, background: "#e9e6de", opacity: lift, filter: `brightness(${1 - 0.55 * dim})` }} />
          {/* the paragraph peeling up off the page */}
          <div style={{ position: "absolute", left: px0 * k, top: py0 * k, width: pw, height: ph, transformOrigin: "50% 100%",
            transform: `translateZ(${110 * lift}px) rotateX(${-20 * lift}deg) scale(${1 + 0.06 * lift})`,
            boxShadow: `0 ${30 * lift}px ${50 * lift}px rgba(0,0,0,${0.55 * lift})`, overflow: "hidden", background: "#f6f4ee" }}>
            <Img src={staticFile(sheet)} style={{ position: "absolute", left: -px0 * k, top: -py0 * k, width: W, height: H }} />
            {/* everything after the first sentence fades back */}
            <div style={{ position: "absolute", left: keep[0] * k - px0 * k, top: 0, right: 0, height: keep[1] * k - py0 * k, background: "#f6f4ee", opacity: 0.68 * dim }} />
            <div style={{ position: "absolute", left: 0, top: keep[1] * k - py0 * k, right: 0, bottom: 0, background: "#f6f4ee", opacity: 0.68 * dim }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
