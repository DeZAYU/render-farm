// TOR07 | MinuteStrip: the eight minutes the family spent in the hall bathroom, shown with the camera they left running.
// One real frame from the window camera for every minute before the tornado arrived (-8:00 ... 0:00), white-framed prints standing
// in a row that recedes in 3-D; the camera travels down the row so the fog visibly closes in, minute by minute, and settles on the
// last print, the white-out. Captions are the time before arrival (information the VO doesn't say minute by minute).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const MinuteStrip: React.FC<{ frames: string[]; captions: string[]; bg?: string; travelFrom?: number; travelTo?: number }> = ({ frames, captions, bg, travelFrom = 6, travelTo }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const n = frames.length, W = 780, H = W * 9 / 16, gap = 120;
  const end = travelTo ?? durationInFrames - 14;
  const u = io(interpolate(f, [travelFrom, end], [0, 1], cl));
  const k = out(interpolate(f, [0, 14], [0, 1], cl));
  const camX = u * (n - 1) * (W + gap);
  return (
    <AbsoluteFill style={{ background: "#070707", overflow: "hidden" }}>
      {bg && <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.28)" }} />}
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: width / 2, top: height / 2 - 40, transformStyle: "preserve-3d",
          transform: `rotateY(-20deg) translate3d(${-camX}px, 0, ${-120 + 120 * k}px)`, opacity: k }}>
          {frames.map((src, i) => {
            const d = Math.abs(i * (W + gap) - camX) / (W + gap); // distance from the camera's print, in prints
            const lit = 1 - Math.min(1, d * 0.55);
            return (
              <div key={i} style={{ position: "absolute", left: i * (W + gap) - W / 2, top: -H / 2, width: W, height: H, transformStyle: "preserve-3d" }}>
                <div style={{ position: "absolute", inset: 0, border: "6px solid #fff", boxShadow: "0 24px 50px rgba(0,0,0,.7)", overflow: "hidden", background: "#000" }}>
                  <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)", filter: `brightness(${0.45 + 0.55 * lit})` }} />
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, top: H + 26, textAlign: "center", fontFamily: "ArchivoBlk", fontWeight: 900, fontSize: 46, color: "#fff",
                  opacity: 0.35 + 0.65 * lit, textShadow: "0 2px 10px rgba(0,0,0,.8)", letterSpacing: "0.02em" }}>{captions[i]}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <RedLabel text="" at={1e6} />{/* loads the brand fonts for the captions */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
