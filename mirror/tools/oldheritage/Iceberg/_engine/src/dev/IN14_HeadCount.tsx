// IN14 HeadCount: the pier footage of the surf held on one frame (after a short live run-in), slow eased push; the picture sinks into a soft
// shadow except small pools round each person in the white water, and a thin white corner bracket closes on each head one after another as
// the VO counts them ("four heads in the white water"). Then the frame lets go and runs on live. No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, cl, out, placeOf, type CK } from "./DC01_kit";

export const HeadCount: React.FC<{
  src: string; t: number; keys: CK[]; heads: [number, number][]; at: number; every: number; hold: number; r?: number;
}> = ({ src, t, keys, heads, at, every, hold, r = 0.035 }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const frozen = f < hold;
  const shade = interpolate(f, [at - 6, at + 10, hold - 6, hold + 8], [0, 1, 1, 0], cl);
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  const holes = heads.map(([x, y]) => `radial-gradient(circle at ${p.left + x * p.w}px ${p.top + y * p.h}px, transparent ${r * p.w * 0.9}px, black ${r * p.w * 2.2}px)`);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {frozen
        ? <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
        : <OffthreadVideo src={staticFile(src)} startFrom={Math.max(0, Math.round(t * 30) - hold)} muted style={st} />}
      <AbsoluteFill style={{ background: "rgba(0,0,0,.55)", opacity: shade, WebkitMaskImage: holes.join(","), WebkitMaskComposite: "source-in", maskComposite: "intersect" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: interpolate(f, [hold - 6, hold + 6], [1, 0], cl) }}>
        {heads.map(([x, y], i) => {
          const g = out(interpolate(f, [at + i * every, at + i * every + 12], [0, 1], cl)); if (g <= 0) return null;
          const X = p.left + x * p.w, Y = p.top + y * p.h, s = r * p.w * (2.2 - 1.0 * g), c = s * 0.38;
          const corner = (dx: number, dy: number) => `M${X + dx * s} ${Y + dy * s - dy * c} L${X + dx * s} ${Y + dy * s} L${X + dx * s - dx * c} ${Y + dy * s}`;
          return <path key={i} d={[corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)].join(" ")} fill="none" stroke="#fff" strokeWidth={3} opacity={g}
            style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,.9))" }} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
