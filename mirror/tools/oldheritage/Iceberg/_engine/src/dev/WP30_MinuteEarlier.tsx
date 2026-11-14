// WP30 device: MinuteEarlier — the mine's own fixed CCTV camera over the conveyor holds on the empty yard (a frame from before the
// mud came, frozen) while the frame pushes slowly in; then the same camera's later picture, the yard buried and the mud still moving,
// washes in from the left along a soft, lobed front (the way the mud came into this view), a faint brown wash running just ahead of
// it, until the whole frame is the after. Both layers share one transform, so the fixed camera lines up exactly. No text.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FrameAt, cl, io } from "./WP01_kit";

export const MinuteEarlier: React.FC<{
  src: string; before: number; after: number; n: number;   // before = source second of the empty yard (frozen); after = source second the mud plays from
  wipe: [number, number];                                    // frames in this shot: the front enters / covers the frame
}> = ({ src, before, after, n, wipe }) => {
  const f = useCurrentFrame();
  const s = 1.03 + 0.09 * io(Math.min(1, f / n));
  const u = io(interpolate(f, wipe, [0, 1], cl));
  // the front: x position (px of a 1920 frame) per row, lobed and slowly writhing
  const X = -820 + u * 3500;   // the lobes reach ±~560 px, so the front starts and ends fully outside the frame
  const pts: string[] = [];
  for (let k = 0; k <= 24; k++) {
    const y = (k / 24) * 1200 - 60;
    const x = X + 120 * Math.sin(k * 0.9 + f * 0.05) + 70 * Math.sin(k * 2.3 - f * 0.08) + 160 * Math.sin(k * 0.37 + 1.3) + (y / 1080) * 140;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const poly = `-1500,-60 ${pts.join(" ")} -1500,1140`;
  const svg = (fill: string, blur: number, dx = 0) =>
    `url("data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'><filter id='b' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='${blur}'/></filter><polygon points='${poly}' transform='translate(${dx},0)' fill='${fill}' filter='url(#b)'/></svg>`
    )}")`;
  const maskA = svg("white", 26);
  const maskW = svg("white", 60, 90);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: "50% 60%", willChange: "transform" }}>
        <FrameAt src={src} t={before} style={st} />
        {u > 0 && u < 1 && (
          <AbsoluteFill style={{ WebkitMaskImage: maskW, maskImage: maskW, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", background: "rgba(92,52,34,0.28)", mixBlendMode: "multiply" }} />
        )}
        {u > 0 && (
          <AbsoluteFill style={u >= 1 ? undefined : { WebkitMaskImage: maskA, maskImage: maskA, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}>
            <OffthreadVideo src={staticFile(src)} startFrom={Math.round(after * 30)} muted style={st} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
