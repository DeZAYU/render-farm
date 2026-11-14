// AM02 ClaimStrike: "Six Flags advertised this one, opened in 1974, as the world's first. It wasn't." The park's own ride page as it stood
// the day after the crash (sixflags.com, Wayback Machine capture of 14 June 2021, real page, nothing re-typed) lies as a printed sheet
// in 3-D over the soft-blurred ride photo. The sheet rises from below tilted back and turned a little, the camera eases down the
// paragraph to the line "You're about to ride the world's first ever log flume ride."; that line (a strip cut from the same capture) peels
// up off the paper toward the camera while the rest of the sheet sinks into shade; on "It wasn't." one red stroke is drawn through the
// claim (the case's only red). Credit small, bottom left.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Box = [number, number, number, number];

export const ClaimStrike: React.FC<{ page: string; pw: number; ph: number; bg: string; line: Box; phrase: Box; liftAt: number; strikeAt: number; credit: string }> = ({ page, pw, ph, bg, line, phrase, liftAt, strikeAt, credit }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const rise = out(interpolate(f, [0, 30], [0, 1], cl));
  const glide = io(interpolate(f, [8, liftAt + 10], [0, 1], cl));
  const lift = out(interpolate(f, [liftAt, liftAt + 22], [0, 1], cl));
  const strike = io(interpolate(f, [strikeAt, strikeAt + 12], [0, 1], cl));
  const k = 0.66 + 0.36 * glide + 0.03 * io(f / dur);          // page px -> screen px
  const cy = (line[1] + line[3]) / 2;
  const fy = interpolate(glide, [0, 1], [ph * 0.32, cy]);        // page y held at screen centre
  const fx = interpolate(glide, [0, 1], [pw * 0.5, (line[0] + line[2]) / 2 + 60]);
  const left = 960 - fx * k, top = 560 - fy * k + (1 - rise) * 300;
  const tiltX = 22 - 10 * glide + (1 - rise) * 12, tiltY = -9 + 4 * glide;
  const shade = 0.55 * lift;
  const lw = line[2] - line[0], lh = line[3] - line[1];
  return (
    <AbsoluteFill style={{ background: "#060708", overflow: "hidden" }}>
      <RedLabel text="" at={1e6} />
      <AbsoluteFill style={{ transform: `scale(${1.12 + 0.05 * (f / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(.34) saturate(.75)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 2000, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left, top, width: pw * k, height: ph * k, transformStyle: "preserve-3d", transformOrigin: `${(fx / pw) * 100}% ${(fy / ph) * 100}%`,
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(-1.6deg)`, opacity: rise }}>
          {/* the sheet */}
          <div style={{ position: "absolute", inset: 0, background: "#F2F2F2", boxShadow: "0 50px 100px rgba(0,0,0,.8), 0 10px 22px rgba(0,0,0,.5)", overflow: "hidden" }}>
            <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} />
            <div style={{ position: "absolute", inset: 0, background: `rgba(10,12,16,${shade})` }} />
            <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.2, background: "radial-gradient(ellipse 75% 60% at 45% 40%, rgba(255,255,255,0) 0%, rgba(90,90,100,.9) 100%)" }} />
          </div>
          {/* the claim line, peeled up toward the camera */}
          <div style={{ position: "absolute", left: (line[0] - 14) * k, top: (line[1] - 3) * k, width: (lw + 28) * k, height: (lh + 6) * k,
            transform: `translateZ(${70 * lift}px) scale(${1 + 0.05 * lift})`, transformOrigin: "40% 50%", opacity: lift > 0 ? 1 : 0,
            background: "#F4F4F4", boxShadow: `0 ${18 * lift}px ${40 * lift}px rgba(0,0,0,${0.6 * lift})`, overflow: "hidden" }}>
            <Img src={staticFile(page)} style={{ position: "absolute", left: -(line[0] - 14) * k, top: -(line[1] - 3) * k, width: pw * k, height: ph * k }} />
            {strike > 0 && <div style={{ position: "absolute", left: (phrase[0] - line[0] + 14 - 6) * k, top: ((phrase[1] + phrase[3]) / 2 - line[1] + 3 - 3) * k,
              width: (phrase[2] - phrase[0] + 12) * k * strike, height: 7 * k + 2, background: RED, borderRadius: 2 }} />}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)" }} />
      <div style={{ position: "absolute", left: 70, bottom: 54, fontFamily: "Elite", fontSize: 26, color: "rgba(240,240,236,.72)", opacity: rise, letterSpacing: "0.02em" }}>{credit}</div>
    </AbsoluteFill>
  );
};
