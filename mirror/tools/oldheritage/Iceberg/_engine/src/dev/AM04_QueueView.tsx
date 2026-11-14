// AM04 QueueView: the bystander's vertical clip from the Objectif Mars queue, kept at full height as a portrait panel (the source file carries
// its own soft side fill, so only the sharp centre strip is used) in a thin white frame over a dim, heavily blurred copy of the same moment,
// with a slow eased push. Used for the hold before the raw ("This was filmed from the queue, behind the yellow railing. Watch the car as it
// comes in. Then the smoke hits.": the panel rises out of the dark on the clip's first frame and holds it, the yellow railing lit, the rest
// dim) and then, unchanged, for the raw itself and the silent half-speed extinguisher shot, so the clip never jumps framing. No text.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** src: 1332x1080 file whose sharp vertical picture spans x0..x1 (0..1); hold: frames frozen on `from` before it plays; rise: panel enters */
export const QueueView: React.FC<{ src: string; from: number; x0: number; x1: number; hold?: number; rise?: boolean; s0?: number; s1?: number; dimRest?: number }> = ({ src, from, x0, x1, hold = 0, rise = false, s0 = 1.0, s1 = 1.05, dimRest = 0 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const fr = Math.round(from * 30) + Math.max(0, f - hold);
  const vid = (st: React.CSSProperties) => <Freeze frame={fr}><OffthreadVideo src={staticFile(src)} muted style={st} /></Freeze>;
  const r = rise ? out(interpolate(f, [0, 26], [0, 1], cl)) : 1;
  const s = s0 + (s1 - s0) * io(f / dur);
  const H = 1040, srcW = 1332, srcH = 1080;
  const W = ((x1 - x0) * srcW) * (H / srcH);              // panel width at full height
  const vw = srcW * (H / srcH);                            // the whole file scaled to the panel height
  const dim = dimRest * io(interpolate(f, [0, 18], [0, 1], cl)) * (hold ? 1 - io(interpolate(f, [hold - 10, hold + 4], [0, 1], cl)) : 1);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: "scale(1.35)", filter: "blur(34px) brightness(.42) saturate(.85)" }}>
        {vid({ width: "100%", height: "100%", objectFit: "cover" })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2 + (1 - r) * 80, width: W, height: H, overflow: "hidden", opacity: r,
        transform: `scale(${s})`, border: "5px solid #fff", boxShadow: "0 24px 70px rgba(0,0,0,.7)" }}>
        <div style={{ position: "absolute", left: -x0 * vw, top: 0, width: vw, height: H }}>{vid({ width: "100%", height: "100%" })}</div>
        {dim > 0 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,${0.55 * dim}) 0%, rgba(0,0,0,${0.55 * dim}) 45%, rgba(0,0,0,0) 62%, rgba(0,0,0,0) 100%)` }} />}
      </div>
    </AbsoluteFill>
  );
};
