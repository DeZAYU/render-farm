// DC05 CentreLine: the Bukit Tunku dashcam held on the frame where the road opens up past the chevrons. The picture sinks to a dim
// night grey, then a soft spotlight (the picture at its own brightness) runs up the painted centre line, near to far, as if the headlights were reaching up
// the road ("look at the center line far up the road"); it runs out where the headlights fade, on the small pale shape,
// which gets a last soft pool of light while the camera eases in after it. The raw then runs live from this exact frame and camera.
// No text, no red: the viewer is told where to look by the road itself.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, cl, ease, placeOf } from "./DC01_kit";

export const CentreLine: React.FC<{ src: string; t: number; keys: CK[]; path: [number, number][]; litAt: number; litLen: number;
  dimAt: number; endAt: number; far: [number, number] }> = ({ src, t, keys, path, litAt, litLen, dimAt, endAt, far }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const dim = ease(f, dimAt, dimAt + 24) * (1 - ease(f, endAt - 14, endAt));
  // one soft pool of light travels up the centre line, near to far, and settles on the shape where the headlights fade
  const end = 1 - ease(f, endAt - 14, endAt);
  const u = ease(f, litAt, litAt + litLen), seg = u * (path.length - 1), k = Math.min(path.length - 2, Math.floor(seg)), r = seg - k;
  const x = path[k][0] + (path[k + 1][0] - path[k][0]) * r, y = path[k][1] + (path[k + 1][1] - path[k][1]) * r;
  const a = interpolate(f, [litAt - 6, litAt + 8], [0, 1], cl) * end;
  const rx = (0.16 - 0.1 * u) * p.w, ry = (0.1 - 0.06 * u) * p.w;
  const spots = [`radial-gradient(ellipse ${rx}px ${ry}px at ${x * 100}% ${y * 100}%, rgba(0,0,0,${a}) 0%, rgba(0,0,0,${0.7 * a}) 45%, rgba(0,0,0,0) 100%)`];
  const fa = interpolate(f, [litAt + litLen - 10, litAt + litLen + 14], [0, 1], cl) * end;
  spots.push(`radial-gradient(ellipse ${0.06 * p.w}px ${0.08 * p.h}px at ${far[0] * 100}% ${far[1] * 100}%, rgba(0,0,0,${fa}) 0%, rgba(0,0,0,${0.6 * fa}) 50%, rgba(0,0,0,0) 100%)`);
  const mask = spots.join(", ");
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted
        style={{ ...st, filter: `brightness(${1 - 0.66 * dim}) saturate(${1 - 0.7 * dim})` }} /></Freeze>
      <div style={{ ...st, WebkitMaskImage: mask, maskImage: mask }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "brightness(1.12) contrast(1.06)" }} /></Freeze>
      </div>
    </AbsoluteFill>
  );
};
