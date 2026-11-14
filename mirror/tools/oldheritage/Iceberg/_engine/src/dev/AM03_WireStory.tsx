// AM03 WireStory: "These little rides aren't always harmless. In Guatemala in 2017, a different worm ride lost its last car and a rider was
// badly hurt." The real Prensa Libre story (21 Aug 2017, captured from its Wayback copy: headline, standfirst, byline and date, cropped above
// the photo; the injured woman is not named or shown) as a printed sheet that swings in from the right on a slow horizontal dolly, turned
// away from the camera at first and easing square to it while the camera reads along the headline; the paper sits over a dark, soft-blurred
// photo of the same type of worm ride. Place and year arrive as the channel's red label on "Guatemala in 2017". Credit small. No red on the page.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const WireStory: React.FC<{ page: string; pw: number; ph: number; bg: string; labelAt: number; label: string; credit: string; headY: number }> = ({ page, pw, ph, bg, labelAt, label, credit, headY }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const inn = out(interpolate(f, [0, 40], [0, 1], cl));
  const u = io(interpolate(f, [0, dur - 20], [0, 1], cl));
  const k = 0.84 + 0.12 * u;
  const yaw = -26 * (1 - inn) - 7 * (1 - u);
  const tx = 420 * (1 - inn) - 120 * u + 60;           // camera reads along the headline (left to right)
  const ty = interpolate(u, [0, 1], [0, -(headY - ph * 0.42) * 0.25]);
  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.12 + 0.05 * (f / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px) brightness(.3) saturate(.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 960 - (pw * k) / 2 + tx, top: 520 - (ph * k) / 2 + ty, width: pw * k, height: ph * k, opacity: inn,
          transform: `rotateY(${yaw}deg) rotateX(${4 * (1 - u)}deg)`, transformOrigin: "30% 50%", background: "#fff",
          boxShadow: "0 40px 90px rgba(0,0,0,.75), 0 8px 20px rgba(0,0,0,.5)", padding: 0 }}>
          <Img src={staticFile(page)} style={{ width: "100%", height: "100%", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,.12) 100%)" }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
      <RedLabel text={label} at={labelAt} hold={dur - labelAt - 14} y={0.88} />
      <div style={{ position: "absolute", left: 70, top: 54, fontFamily: "Elite", fontSize: 26, color: "rgba(240,240,236,.7)", opacity: inn }}>{credit}</div>
    </AbsoluteFill>
  );
};
