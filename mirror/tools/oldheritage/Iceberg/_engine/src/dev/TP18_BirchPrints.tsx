// TP18 BirchPrints: Eugenius Birch's two piers as two white-framed prints standing in 3-D over a dark blurred sea. The camera starts on
// Hastings, glides along to the West Pier at Brighton, then the West Pier print turns square and grows until its ruin fills the frame
// ("never came back"). Real photos (Commons): Hastings before the fire, the West Pier's burnt skeleton.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Print = { src: string; label: string; pos?: string };
export const BirchPrints: React.FC<{ a: Print; b: Print; name: string; moveAt: number; moveLen: number; growAt: number; growLen: number; tag?: string; tagAt?: number }> = ({ a, b, name, moveAt, moveLen, growAt, growLen, tag, tagAt = 0 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 16], [0, 1], cl));
  const m = io(interpolate(f, [moveAt, moveAt + moveLen], [0, 1], cl));     // camera glide Hastings -> Brighton
  const g = io(interpolate(f, [growAt, growAt + growLen], [0, 1], cl));     // West Pier print turns square and fills the frame
  const W = 760, H = 500, gap = 980;
  const camX = -gap / 2 + gap * m;                                          // world x the camera looks at
  const drift = 0.03 * io(f / durationInFrames);
  const card = (p: Print, wx: number, side: -1 | 1, grow: number) => {
    const ry = side * 22 * (1 - grow), sc = (1 + drift) * (1 + (width / W * 1.02 - 1) * grow), x = (wx - camX) * (1 - grow);
    const bw = 6 * (1 - grow);
    return (
      <div style={{ position: "absolute", left: width / 2 - W / 2, top: height / 2 - H / 2 - 30 * (1 - grow), width: W, height: H,
        transform: `translate3d(${x}px, 0, ${-120 * (1 - grow)}px) rotateY(${ry}deg) scale(${sc})`, transformStyle: "preserve-3d",
        border: `${bw}px solid #fff`, boxShadow: `0 30px 70px rgba(0,0,0,${0.65 * (1 - grow)})`, overflow: "hidden", opacity: k, background: "#111" }}>
        <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "50% 50%" }} />
      </div>
    );
  };
  const lab = 1 - interpolate(f, [growAt, growAt + 10], [0, 1], cl);
  const labX = (wx: number) => (width / 2 + (wx - camX)) / width;
  return (
    <AbsoluteFill style={{ background: "#05070a", overflow: "hidden" }}>
      <Img src={staticFile(b.src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.38) saturate(.7)", transform: `scale(${1.05 + 0.04 * m})` }} />
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 45%" }}>
        {card(a, -gap / 2, 1, 0)}
        {card(b, gap / 2, -1, g)}
      </AbsoluteFill>
      {lab > 0 && <div style={{ opacity: lab }}>
        <RedLabel text={a.label} at={14} x={labX(-gap / 2)} y={0.86} size={36} />
        <RedLabel text={b.label} at={moveAt + moveLen - 18} x={labX(gap / 2)} y={0.86} size={36} />
        <RedLabel text={name} at={8} y={0.1} size={40} />
      </div>}
      {tag && <RedLabel text={tag} at={tagAt} y={0.9} />}
    </AbsoluteFill>
  );
};
