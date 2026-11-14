// WP02 device: the jib's fall replayed at under half speed, full frame, pushed toward the crane; every few frames the falling jib leaves
// a fading echo of where it just was, so the fold reads as a fan of positions coming down onto the site. The echoes thin out once the
// jib has landed and the push settles on the burning cab. The filmer's camera jolts with the fall: every frame (and echo) is shifted by
// the tracked position of the burning cab (track = [source s, x, y] in 1920x1080 px), so the tower stays put and only the jib moves.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FrameAt, cl, io } from "./WP01_kit";

type P = { src: string; t0: number; rate: number; n: number; landed: number; focus: [number, number]; s0?: number; s1?: number; lag?: number; echoes?: number; track?: [number, number, number][] };

export const WP02_FoldEcho: React.FC<P> = ({ src, t0, rate, n, landed, focus, s0 = 1.06, s1 = 1.3, lag = 0.16, echoes = 5, track }) => {
  const at = (t: number): [number, number] => {
    if (!track || !track.length) return [0, 0];
    const ts_ = track.map((k) => k[0]);
    const x = interpolate(t, ts_, track.map((k) => k[1]), cl), y = interpolate(t, ts_, track.map((k) => k[2]), cl);
    return [track[0][1] - x, track[0][2] - y];
  };
  const f = useCurrentFrame();
  const ts = t0 + (f / 30) * rate;
  const s = s0 + (s1 - s0) * io(f / n);
  const fade = interpolate(ts, [landed, landed + 0.35], [1, 0], cl) * interpolate(f, [0, 8], [0, 1], cl);
  const st = (t: number): React.CSSProperties => { const [dx, dy] = at(t); return { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", transform: `translate3d(${dx}px,${dy}px,0)` }; };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${focus[0]}px ${focus[1]}px`, willChange: "transform" }}>
        <FrameAt src={src} t={ts} style={st(ts)} />
        {fade > 0.01 && Array.from({ length: echoes }, (_, i) => {
          const te = ts - lag * (i + 1);
          if (te < t0 - 0.6) return null;
          return <AbsoluteFill key={i} style={{ opacity: fade * (0.42 - i * 0.07), filter: "brightness(1.18) contrast(1.15)" }}><FrameAt src={src} t={te} style={st(te)} /></AbsoluteFill>;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
