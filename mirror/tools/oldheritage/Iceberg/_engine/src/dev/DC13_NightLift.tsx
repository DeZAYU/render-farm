// DC13 NightLift: the phone clip slows to a stop on the moment both doors of the white car are open; on the held frame the night is
// lifted only in a soft oval round the man standing beside the car (the frame's own pixels, exposure raised) while the rest of the
// picture stays dark and the camera eases in on him. No text, no shapes: the viewer finally sees what was in the dark.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, placeOf, type CK, cl, io } from "./DC01_kit";

export const NightLift: React.FC<{
  src: string; from: number; rate: number; holdAt: number; spot: [number, number]; r: [number, number]; liftAt: number; keys: CK[];
}> = ({ src, from, rate, holdAt, spot, r, liftAt, keys }) => {
  const f = useCurrentFrame();
  const live = Math.round(((holdAt - from) / rate) * 30); // frames until the clip reaches the held moment
  const p = placeOf(camAt(f, keys));
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  const k = io(interpolate(f, [liftAt, liftAt + 30], [0, 1], cl));
  const mask = `radial-gradient(ellipse ${r[0] * 100}% ${r[1] * 100}% at ${spot[0] * 100}% ${spot[1] * 100}%, #000 0%, #000 35%, transparent 100%)`;
  const pic = (filter?: string) => f < live
    ? <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ ...st, filter }} />
    : <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(holdAt * 30)} muted style={{ ...st, filter }} /></Freeze>;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {pic(`brightness(${1 - 0.25 * k})`)}
      {f >= live && k > 0.002 && (
        <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, opacity: k, WebkitMaskImage: mask, maskImage: mask }}>
          <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(holdAt * 30)} muted
            style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", filter: "brightness(2.1) contrast(1.08) saturate(0.85)" }} /></Freeze>
        </div>
      )}
    </AbsoluteFill>
  );
};
