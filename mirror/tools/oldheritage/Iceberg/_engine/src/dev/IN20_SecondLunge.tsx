// IN20 SecondLunge: the helmet camera's two attacks side by side. The first lunge (the bear coming down from above) replays at half
// speed full frame; on "came at him again from below" it eases into the left half and holds on its last frame, a thin white seam
// draws down the middle (the first lunge can hold early on its clearest frame: holdA) and the second attack (the bear back up from below, his fist in frame) slides in on the right at half speed.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const SecondLunge: React.FC<{ src: string; a: number; b: number; splitAt: number; n: number; focusA?: number; focusB?: number; holdA?: number }> =
  ({ src, a, b, splitAt, n, focusA = 0.5, focusB = 0.5, holdA }) => {
  const f = useCurrentFrame();
  const u = io(interpolate(f, [splitAt, splitAt + 22], [0, 1], cl));
  const wA = 1920 - 960 * u - 4 * u; // left panel width
  const seam = io(interpolate(f, [splitAt + 8, splitAt + 26], [0, 1], cl));
  const inB = io(interpolate(f, [splitAt + 6, splitAt + 30], [0, 1], cl));
  const vid = (start: number, rate: number, focus: number, freezeAt?: number) => {
    const v = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(start * 30)} playbackRate={rate} muted
      style={{ position: "absolute", height: 1080, width: 1920, left: "50%", top: 0, transform: `translateX(-${focus * 100}%)` }} />;
    return freezeAt !== undefined ? <Freeze frame={freezeAt}>{v}</Freeze> : v;
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: wA, height: 1080, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1.04 + 0.08 * u})`, filter: `brightness(${1 - 0.12 * u})` }}>
          {(() => { const h = holdA ?? splitAt + 4; return f < h ? vid(a, 0.5, 0.5 + (focusA - 0.5) * u) : vid(a, 0.5, 0.5 + (focusA - 0.5) * u, h); })()}
        </div>
      </div>
      <Sequence from={splitAt} durationInFrames={Math.max(1, n - splitAt)} layout="none">
        <div style={{ position: "absolute", left: 964 + (1 - inB) * 700, top: 0, width: 956, height: 1080, overflow: "hidden", opacity: inB }}>
          <div style={{ position: "absolute", inset: 0, transform: "scale(1.12)" }}>{vid(b, 0.5, focusB)}</div>
        </div>
      </Sequence>
      <div style={{ position: "absolute", left: 958, top: 540 - 540 * seam, width: 6 * Math.min(1, u * 3), height: 1080 * seam, background: "#F2F2F0", boxShadow: "0 0 18px rgba(0,0,0,.6)" }} />
    </AbsoluteFill>
  );
};
