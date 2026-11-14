// IN08 MurkLift: a murky underwater GoPro frame held still; inside one soft oval around the faint animal the water's haze is cut
// (contrast and depth lifted, a touch of colour back) so its head and fin separate from the green murk, while the rest of the frame sinks
// a little darker. A slow eased push into the oval. Nothing drawn, no text: the picture itself is made readable.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, placeOf, cl, io, type CK } from "./DC01_kit";

export const MurkLift: React.FC<{ src: string; t: number; keys: CK[]; oval: [number, number, number, number]; at: number; len: number }> = ({ src, t, keys, oval, at, len }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const u = io(interpolate(f, [at, at + len], [0, 1], cl));
  const [cx, cy, rx, ry] = oval;
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  const mask = `radial-gradient(ellipse ${rx * 100}% ${ry * 100}% at ${cx * 100}% ${cy * 100}%, #000 45%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter: `brightness(${1.15 - 0.08 * u})` }} /></Freeze>
      <div style={{ ...st, opacity: u, WebkitMaskImage: mask, maskImage: mask }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "contrast(1.15) brightness(1.45) saturate(1.2)" }} /></Freeze>
      </div>
    </AbsoluteFill>
  );
};
