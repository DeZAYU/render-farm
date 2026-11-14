// TOR06 | OutlookFlip: two real Storm Prediction Center outlooks as prints lying on a dark table, seen in 3-D.
// The top print is the outlook for the day itself (the High risk over the Midwest); on the cue it hinges up and away from the
// camera like a page being lifted, uncovering the print underneath, the Day 4-8 outlook issued on the Thursday before with the
// same region already drawn. The camera drifts in throughout; a red label names each print's issue day.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const OutlookFlip: React.FC<{
  top: string; under: string; iw: number; ih: number; flipAt: number; flipLen?: number;
  topLabel: string; underLabel: string; focus?: [number, number]; bg?: string;
}> = ({ top, under, iw, ih, flipAt, flipLen = 22, topLabel, underLabel, focus = [0.62, 0.5], bg }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 16], [0, 1], cl));
  const d = io(f / durationInFrames);
  const W = width * 0.6, H = W * ih / iw;
  const flip = io(interpolate(f, [flipAt, flipAt + flipLen], [0, 1], cl));
  // camera: table tilted back, slow push toward the focus (the region over Illinois)
  const tilt = 24 - 6 * d, zoom = 1.0 + 0.22 * d;
  const fx = (focus[0] - 0.5) * W * 0.55 * d, fy = (focus[1] - 0.5) * H * 0.55 * d;
  const card = (src: string, z: number, extra: string, shade: number) => (
    <div style={{ position: "absolute", left: -W / 2, top: -H / 2, width: W, height: H, transform: `translateZ(${z}px) ${extra}`, transformOrigin: "50% 0%",
      border: "6px solid #fff", boxShadow: "0 30px 60px rgba(0,0,0,.65)", background: "#fff", backfaceVisibility: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade})` }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#060606", overflow: "hidden" }}>
      {bg && <Img src={staticFile(bg)} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(18px) brightness(.32)" }} />}
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left: width / 2, top: height / 2 + 20, transformStyle: "preserve-3d",
          transform: `translate3d(${-fx}px, ${-fy}px, 0) scale(${zoom * (0.92 + 0.08 * k)}) rotateX(${tilt}deg) rotateZ(${-3 + 2 * d}deg)`, opacity: k }}>
          {card(under, -2, "rotateZ(4deg) translate(30px, 16px)", 0.18 * (1 - flip))}
          {card(top, 2, `rotateX(${-flip * 118}deg) translateY(${-flip * 40}px)`, 0.25 * flip)}
        </div>
      </AbsoluteFill>
      <RedLabel text={topLabel} at={10} hold={flipAt - 10} x={0.5} y={0.9} />
      <RedLabel text={underLabel} at={flipAt + flipLen - 2} x={0.5} y={0.9} />
    </AbsoluteFill>
  );
};
