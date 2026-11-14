// lookhere / PunchEllipse: REF Dashcam Vol.1 E7 punch-in on MOVING footage @22:16.5-22:18.6 (C18, the BMW: x4.1 in 1.5 s, 0.3 s ease-in, peak
// 12.5 %/f at 0.6 s, 90 % done at 1.1 s, then a slow creep +0.1 -> 0.36 %/f until the cut; plus a RED ELLIPSE) + recipe I6 (x3-4 over 1.5-2.2 s,
// bezier(0.45,0,0.15,1), then +0.2 %/f creep; hard-cut or flash out) + E5 ellipse ring for a wide subject. The clip keeps PLAYING (no freeze).
// The camera follows the tracked target so it stays framed; motion blur on the fast part.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { DrawRing, MBlur, Vignette, clamp01 } from "../../core";
import { ClipLayer, type TrackKey, trackAt } from "../labels/kit";
import { punchCam } from "./shared";

const PE = Easing.bezier(0.45, 0, 0.15, 1);
export type PunchEllipseProps = { media: string; mediaStart?: number; track: TrackKey[]; at: number; scale?: number; dur?: number; creep?: number; ringAt?: number; rx?: number; ry?: number; outAt?: number };
export const PunchEllipse: React.FC<PunchEllipseProps> = ({ media, mediaStart = 0, track, at, scale = 3, dur = 45, creep = 0.003, ringAt, rx = 120, ry = 80, outAt }) => {
  const f = useCurrentFrame();
  const u = f < at ? 0 : PE(clamp01((f - at) / dur));
  const S = scale * (1 + creep * Math.max(0, f - at - dur));
  const tgt = trackAt(track, f);
  const cam = punchCam(u, 1, S, tgt);
  const p = cam.map(tgt);
  const rA = ringAt ?? at + Math.round(dur * 0.75);
  const fast = f > at + 3 && f < at + dur * 0.7;
  const o = outAt === undefined ? 1 : 1 - clamp01((f - outAt) / 3);
  return (
    <AbsoluteFill>
      <MBlur on={fast} samples={8}>
        <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
          <AbsoluteFill style={{ transformOrigin: "0 0", transform: cam.transform }}><ClipLayer src={media} startFrom={mediaStart} /></AbsoluteFill>
          <Vignette />
        </AbsoluteFill>
      </MBlur>
      {f >= rA && o > 0 ? <div style={{ position: "absolute", inset: 0, opacity: o }}><DrawRing k={f - rA} x={p.x} y={p.y} r={rx * cam.s} ry={ry * cam.s} core={8} /></div> : null}
    </AbsoluteFill>
  );
};
