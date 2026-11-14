// TOR05 | OutbreakZoom: the NWS Birmingham / Alabama EMA map of every tornado track on 27 April 2011, used as a lit table.
// A soft light pool (everything else falls into shadow, no drawn marks) follows a camera that moves between real points on the
// map: from the whole state into one track (the day -> "this one"), or along it to the next place the line names.
// keys: [frame, x, y, zoom] in map pixels; between keys one smooth eased move. Labels: RedLabel per place on its word.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.42, 0, 0.25, 1);

export const OutbreakZoom: React.FC<{ src: string; iw: number; ih: number; keys: [number, number, number, number][]; pool?: number; labels?: { text: string; at: number; hold?: number }[] }> = ({ src, iw, ih, keys, pool = 0.42, labels = [] }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  let x = keys[0][1], y = keys[0][2], z = keys[0][3];
  for (let i = 1; i < keys.length; i++) {
    const [f0, x0, y0, z0] = keys[i - 1], [f1, x1, y1, z1] = keys[i];
    if (f >= f0) { const k = io(interpolate(f, [f0, f1], [0, 1], cl)); x = x0 + (x1 - x0) * k; y = y0 + (y1 - y0) * k; z = z0 * Math.pow(z1 / z0, k); }
  }
  const s = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * s, width / 2 - x * s)), oy = Math.min(0, Math.max(height - ih * s, height / 2 - y * s));
  const px = ((ox + x * s) / width) * 100, py = ((oy + y * s) / height) * 100; // pool follows the point (it can sit off-centre at the edges)
  const drift = Math.sin(f / 50) * 1.5;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * s, height: ih * s, filter: "saturate(.9) contrast(1.06)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${pool * 100}% ${pool * 130}% at ${px + drift}% ${py}%, rgba(0,0,0,0) 0%, rgba(0,0,0,.08) 35%, rgba(2,3,5,.72) 100%)` }} />
      {labels.map((l, i) => <RedLabel key={i} text={l.text} at={l.at} hold={l.hold ?? 9999} x={0.5} y={0.87} size={42} />)}
    </AbsoluteFill>
  );
};
