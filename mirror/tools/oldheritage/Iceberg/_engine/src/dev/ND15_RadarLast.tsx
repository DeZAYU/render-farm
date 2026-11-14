// ND15 RadarLast: the real NWS Lake Charles (KLCH) WSR-88D loop of Laura's landfall (Commons, NWS, public domain), shown as a lit
// print in a white frame over its own blurred copy. Mode "landfall": the first frames dissolve one into the next while the camera
// pushes toward the eye at the coast. Mode "last": the final two scans, then the radar's own "data unavailable" frame (the radar died).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const RadarLast: React.FC<{ dir: string; frames: number[]; keys: number[]; focus: [number, number]; z0: number; z1: number; labels?: { text: string; at: number; hold?: number }[]; deadAt?: number }> =
  ({ dir, frames, keys, focus, z0, z1, labels = [], deadAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const IW = 600, IH = 550; // gif size
  const H = height * 0.86, W = (H * IW) / IH;
  const dead = deadAt !== undefined && f >= deadAt;
  const z = dead ? z1 : z0 + (z1 - z0) * io(f / Math.max(1, (deadAt ?? durationInFrames)));
  const k = out(interpolate(f, [0, 12], [0, 1], cl));
  // which frames are visible (cross-dissolve 8 f at each key)
  const layers = frames.map((fr, i) => ({ fr, o: i === 0 ? 1 : interpolate(f, [keys[i] - 8, keys[i]], [0, 1], cl) }));
  const shake = dead ? Math.max(0, 1 - (f - deadAt!) / 10) : 0;
  const pic = (fr: number, style: React.CSSProperties) => <Img src={staticFile(`${dir}/r${fr}.png`)} style={style} />;
  const cur = dead ? 7 : layers.reduce((c, l) => (l.o > 0.5 ? l.fr : c), frames[0]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {pic(cur, { position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.35) saturate(.8)" })}
      <div style={{ position: "absolute", left: (width - W) / 2 + Math.sin(f * 2.3) * 8 * shake, top: (height - H) / 2 - 10, width: W, height: H, border: "6px solid #fff", overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,.7)",
        transform: `scale(${0.95 + 0.05 * k})`, opacity: k, background: "#000" }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${focus[0] / IW * 100}% ${focus[1] / IH * 100}%`, transform: `scale(${z})` }}>
          {!dead && layers.map((l, i) => l.o > 0 ? <div key={i} style={{ position: "absolute", inset: 0, opacity: l.o }}>{pic(l.fr, { width: "100%", height: "100%", imageRendering: "auto" })}</div> : null)}
        </div>
        {dead && pic(7, { position: "absolute", inset: 0, width: "100%", height: "100%" })}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 40% 35%, rgba(255,255,255,.06), rgba(0,0,0,.25) 90%)" }} />
      </div>
      {labels.map((l, i) => <RedLabel key={i} text={l.text} at={l.at} hold={l.hold} x={0.5} y={0.93} />)}
    </AbsoluteFill>
  );
};
