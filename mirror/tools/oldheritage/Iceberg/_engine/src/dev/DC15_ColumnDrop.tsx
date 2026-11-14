// DC15 ColumnDrop: the real KSBY article (page capture, cut to its logo, headline, posted line and the two Fabilla paragraphs) as a
// single narrow column of paper that drops in from above over the dark, blurred dashcam and settles square to the camera. The camera
// then sinks down the column to Fabilla's quote; as it arrives the lines above it fall back into shadow and the quote's last sentence
// ("I tried telling him slow down, slo down and all of a sudden it just hit us.") stays lit. Real type, no highlight colour.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, Cam, cl, ease, out } from "./DC01_kit";

export const ColumnDrop: React.FC<{ bg: string; bgFrom: number; bgKeys: CK[]; sheet: string; sw: number; sh: number;
  quote: [number, number, number, number]; sinkAt: number; sinkLen: number }> = ({ bg, bgFrom, bgKeys, sheet, sw, sh, quote, sinkAt, sinkLen }) => {
  const f = useCurrentFrame();
  const W = 1240, k = W / sw, H = sh * k;
  const drop = out(interpolate(f, [0, 28], [0, 1], cl));
  const sink = ease(f, sinkAt, sinkAt + sinkLen), dim = ease(f, sinkAt + sinkLen - 14, sinkAt + sinkLen + 10);
  const qy = quote[1] * k, qh = (quote[3] - quote[1]) * k;
  const top = interpolate(sink, [0, 1], [150, 540 - qy - qh / 2]) - 700 * (1 - drop);
  const z = 1 + 0.16 * sink;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Cam src={bg} from={bgFrom} keys={bgKeys} filter="blur(12px) brightness(.3) saturate(.6)" />
      <div style={{ position: "absolute", left: 960 - W / 2, top, width: W, height: H, transform: `scale(${z}) rotate(${-1.2 * (1 - drop)}deg)`, transformOrigin: `50% ${qy + qh / 2}px`,
        boxShadow: "0 40px 90px rgba(0,0,0,.75)", opacity: drop }}>
        <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: qy - 4, background: "#000", opacity: 0.62 * dim }} />
        <div style={{ position: "absolute", left: 0, top: qy - 4, width: quote[0] * k - 6, height: qh + 8, background: "#000", opacity: 0.62 * dim }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: qy + qh + 4, bottom: 0, background: "#000", opacity: 0.62 * dim }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
