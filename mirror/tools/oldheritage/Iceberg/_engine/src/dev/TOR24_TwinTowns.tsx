// TOR24 | TwinTowns: "Remember the second Washington?" — the two Washingtons hit on the same afternoon, as two white-framed footage panels
// angled toward each other in 3-D (Illinois from case 6 on the left, Indiana on the right), each with its red place label. On the word
// "Indiana" the Illinois panel falls back into the dark and the Indiana panel swings flat and grows until it IS the frame, so the
// next shot continues the same clip full-screen (a push-through hand-off, no transition needed).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const TwinTowns: React.FC<{
  left: { src: string; from: number; label: string }; right: { src: string; from: number; label: string };
  rightLabelAt: number; handAt: number; // frames: the right label lands / the hand-off push starts (must end on the last frame)
}> = ({ left, right, rightLabelAt, handAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const enter = out(interpolate(f, [0, 16], [0, 1], cl));
  const h = io(interpolate(f, [handAt, durationInFrames - 4], [0, 1], cl)); // hand-off progress
  const W0 = 800, H0 = W0 * 9 / 16;
  // right panel: from its angled slot to the full frame
  const rw = W0 + (width - W0) * h, rh = H0 + (height - H0) * h;
  const rx = 1010 + (0 - 1010) * h, ry = (height - H0) / 2 - 20 + (0 - ((height - H0) / 2 - 20)) * h;
  const rRot = -14 * (1 - h) * enter + (1 - enter) * -30, border = 6 * (1 - h);
  const lRot = 14 * enter + (1 - enter) * 30, lFall = h;
  const vid = (src: string, from: number): React.CSSProperties => ({ width: "100%", height: "100%", objectFit: "cover" });
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(right.src)} startFrom={Math.round(right.from * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.38) saturate(.7)" }} />
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 45%" }}>
        {/* Washington, Illinois (case 6): slides back and fades on the hand-off */}
        <div style={{ position: "absolute", left: 110 - 260 * lFall, top: (height - H0) / 2 - 20, width: W0, height: H0, border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.7)", overflow: "hidden",
          transform: `translateZ(${-140 * enter - 400 * lFall}px) rotateY(${lRot}deg)`, transformOrigin: "100% 50%", opacity: enter * (1 - lFall) }}>
          <OffthreadVideo src={staticFile(left.src)} startFrom={Math.round(left.from * 30)} muted style={vid(left.src, left.from)} />
        </div>
        {/* Washington, Indiana: swings flat and becomes the frame */}
        <div style={{ position: "absolute", left: rx, top: ry, width: rw, height: rh, border: `${border}px solid #fff`, boxShadow: `0 24px 60px rgba(0,0,0,${0.7 * (1 - h)})`, overflow: "hidden",
          transform: `translateZ(${-140 * enter * (1 - h)}px) rotateY(${rRot}deg)`, transformOrigin: "0% 50%", opacity: enter }}>
          <OffthreadVideo src={staticFile(right.src)} startFrom={Math.round(right.from * 30)} muted style={vid(right.src, right.from)} />
        </div>
      </AbsoluteFill>
      <RedLabel text={left.label} at={10} hold={handAt - 14} x={(110 + W0 / 2) / width} y={(height + H0) / 2 / height + 0.05} size={38} />
      <RedLabel text={right.label} at={rightLabelAt} hold={handAt - rightLabelAt} x={(1010 + W0 / 2) / width} y={(height + H0) / 2 / height + 0.05} size={38} />
    </AbsoluteFill>
  );
};
