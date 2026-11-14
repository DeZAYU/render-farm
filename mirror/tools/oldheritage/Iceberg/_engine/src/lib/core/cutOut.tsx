// cutOut: drop timeline windows from a finished case composition (3 Nov 2026 raw audit: raws only at incident moments).
// Each window [a, b] (seconds, ORIGINAL timeline) is removed outright: picture, raw sound, SFX inside it. Use it only on a raw's
// VO-silent window, so the VO part before it runs straight into the VO part after it (one take, no gap).
// Keep the removed raw in the case's music-duck list: the bed is then already dipped at the join, which hides the music's jump.
import React from "react";
import { Sequence } from "remotion";

const F = (s: number) => Math.round(s * 30);

export const cutOut = (Comp: React.FC, dur: number, cuts: [number, number][]) => {
  const c = [...cuts].sort((x, y) => x[0] - y[0]).map(([a, b]) => [F(a), F(b)] as const);
  // kept segments in original frames
  const segs: [number, number][] = [];
  let t = 0;
  for (const [a, b] of c) { if (a > t) segs.push([t, a]); t = b; }
  if (dur > t) segs.push([t, dur]);
  const DUR = segs.reduce((s, [a, b]) => s + b - a, 0);
  const Cut: React.FC = () => {
    let at = 0;
    return (
      <>
        {segs.map(([a, b], i) => {
          const el = (
            <Sequence key={i} from={at} durationInFrames={b - a} layout="none">
              <Sequence from={-a} layout="none"><Comp /></Sequence>
            </Sequence>
          );
          at += b - a;
          return el;
        })}
      </>
    );
  };
  return { Comp: Cut, DUR };
};
