// TOR04 | TrackFold: a footage frame folds down out of the picture like a lid (hinged on its bottom edge, in 3-D) and the NWS
// track map is underneath it, camera already sitting on where the track begins.
//   phase "fold": the fold, then a slow push on the track's first stretch (startLabel).
//   phase "span": the camera travels the whole track (eased, constant speed between soft ends), the NWS's own surveyed damage points carry
//                 the eye (no drawn line) and the far end is named; then it pulls back to the whole track.
// px = map image pixels (iw x ih).
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1), inn = Easing.bezier(0.55, 0, 0.9, 0.5);
type P = [number, number];
const along = (pts: P[], u: number): P => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])); const tot = seg.reduce((a, b) => a + b, 0); let d = u * tot;
  for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = Math.min(1, d / seg[i]); return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; } d -= seg[i]; }
  return pts[pts.length - 1];
};

export const TrackFold: React.FC<{ map: string; iw: number; ih: number; path: P[]; phase: "fold" | "span"; lid?: { src: string; from: number };
  startLabel?: string; endLabel?: string; zoom?: number }> = ({ map, iw, ih, path, phase, lid, startLabel, endLabel, zoom = 2.4 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const N = durationInFrames;
  let c: P, s: number;
  if (phase === "fold") {
    c = path[0]; s = zoom * (1.0 + 0.08 * io(f / N));
  } else {
    const tr = io(interpolate(f, [N * 0.28, N * 0.72], [0, 1], cl)); // travel (holds on the start while it is named)
    const pb = io(interpolate(f, [N * 0.64, N], [0, 1], cl));  // pull back to the whole track
    const mid: P = [(path[0][0] + path[path.length - 1][0]) / 2, (path[0][1] + path[path.length - 1][1]) / 2];
    const a = along(path, tr);
    c = [a[0] + (mid[0] - a[0]) * pb, a[1] + (mid[1] - a[1]) * pb];
    const sFit = Math.max(Math.max(width / iw, height / ih) * 1.02, Math.min(width / (Math.abs(path[path.length - 1][0] - path[0][0]) + 260), height / (Math.abs(path[path.length - 1][1] - path[0][1]) + 300)));
    s = zoom + (sFit - zoom) * pb;
  }
  const ox = Math.min(0, Math.max(width - iw * s, width / 2 - c[0] * s)), oy = Math.min(0, Math.max(height - ih * s, height / 2 - c[1] * s));
  const fold = phase === "fold" && lid ? inn(interpolate(f, [4, 26], [0, 1], cl)) : 1; // 0 = lid flat on screen, 1 = folded away
  const tilt = phase === "fold" ? 18 * (1 - io(interpolate(f, [10, 40], [0, 1], cl))) : 0;
  return (
    <AbsoluteFill style={{ background: "#0b0d10", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 100%" }}>
        <AbsoluteFill style={{ transform: `rotateX(${tilt}deg)`, transformOrigin: "50% 100%" }}>
          <Img src={staticFile(map)} style={{ position: "absolute", left: ox, top: oy, width: iw * s, height: ih * s, filter: "saturate(.85) contrast(1.04)" }} />
        </AbsoluteFill>
        {/* the lid: the previous footage frame, hinged on its bottom edge, falling toward the viewer */}
        {phase === "fold" && lid && fold < 1 && (
          <AbsoluteFill style={{ transformOrigin: "50% 100%", transform: `rotateX(${-92 * fold}deg)`, backfaceVisibility: "hidden", boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>
            <OffthreadVideo src={staticFile(lid.src)} startFrom={Math.round(lid.from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${1 - 0.5 * fold})` }} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      {startLabel && <RedLabel text={startLabel} at={phase === "fold" ? 30 : Math.round(N * 0.22)} hold={phase === "fold" ? 9999 : Math.round(N * 0.16)} x={0.5} y={0.86} size={42} />}
      {endLabel && <RedLabel text={endLabel} at={Math.round(N * 0.6)} x={0.5} y={0.86} size={42} />}
    </AbsoluteFill>
  );
};
