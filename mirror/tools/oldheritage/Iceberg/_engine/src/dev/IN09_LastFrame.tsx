// IN09 LastFrame: the final second before the ground, replayed at half speed with the camera easing in, then held on the last clean frame
// before contact. On the hold the picture slowly loses its colour and light from the edges in (a closing iris of shadow) while the push
// continues toward the ground the jumper is about to hit, so the cut-away happens in the viewer's head, not on screen. No text, no marks.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, placeOf, cl, io, type CK } from "./DC01_kit";

export const LastFrame: React.FC<{ src: string; from: number; hold: number; rate?: number; keys: CK[]; n: number }> = ({ src, from, hold, rate = 0.5, keys, n }) => {
  const f = useCurrentFrame();
  const play = Math.round(((hold - from) / rate) * 30);       // frames of slow playback before the hold
  const p = placeOf(camAt(f, keys));
  const d = io(interpolate(f, [play, n], [0, 1], cl));          // drain after the hold starts
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h,
    filter: `saturate(${1 - 0.85 * d}) brightness(${1.25 - 0.2 * d}) contrast(${1 + 0.1 * d})` };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {f < play
        ? <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={st} />
        : <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(hold * 30)} muted style={st} /></Freeze>}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${100 - 38 * d}% ${95 - 35 * d}% at 50% 62%, rgba(0,0,0,0) 40%, rgba(0,0,0,${0.3 + 0.4 * d}) 100%)` }} />
    </AbsoluteFill>
  );
};
