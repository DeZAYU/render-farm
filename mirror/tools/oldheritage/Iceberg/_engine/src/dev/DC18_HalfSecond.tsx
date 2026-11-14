// DC18 HalfSecond: "He didn't wait to find out what the men wanted ... he didn't give them half a second." The ramp's bottom replayed
// at half speed, pushing in; it stops on the frame where the men are out beside their car, the frame darkens round them and four
// white corner brackets close on the men and the open door (the trap, held); on "he didn't give them half a second" the picture runs
// on at half speed through the swerve past the door and into the underpass.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";

export const HalfSecond: React.FC<{ src: string; from: number; keys: CK[]; freezeAt: number; resumeAt: number; box: [number, number, number, number] }> = ({ src, from, keys, freezeAt, resumeAt, box }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const tF = from + (freezeAt / 30) * 0.5;
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const k = ease(f, freezeAt + 2, freezeAt + 20) * (1 - ease(f, resumeAt - 4, resumeAt + 6));
  const [x0, y0, x1, y1] = box; const L = 0.035;
  const pull = 1 - ease(f, freezeAt + 4, freezeAt + 26);
  const bx0 = x0 - 0.06 * pull, by0 = y0 - 0.06 * pull, bx1 = x1 + 0.06 * pull, by1 = y1 + 0.06 * pull;
  const m = `radial-gradient(ellipse ${(x1 - x0) * 90}% ${(y1 - y0) * 110}% at ${((x0 + x1) / 2) * 100}% ${((y0 + y1) / 2) * 100}%, rgba(0,0,0,0) 50%, #000 100%)`;
  const corner = (x: number, y: number, dx: number, dy: number) => `M${(x + dx * L) * 1000} ${y * 1000} L${x * 1000} ${y * 1000} L${x * 1000} ${(y + dy * L * 1.78) * 1000}`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        <Sequence from={0} durationInFrames={freezeAt} layout="none"><OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={0.5} muted style={st} /></Sequence>
        <Sequence from={freezeAt} durationInFrames={resumeAt - freezeAt} layout="none"><Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(tF * 30)} muted style={st} /></Freeze></Sequence>
        <Sequence from={resumeAt} layout="none"><OffthreadVideo src={staticFile(src)} startFrom={Math.round(tF * 30)} playbackRate={0.5} muted style={st} /></Sequence>
        <div style={{ ...st, background: "rgba(0,0,0,.62)", opacity: k, WebkitMaskImage: m, maskImage: m } as React.CSSProperties} />
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ ...st, opacity: k }}>
          {[corner(bx0, by0, 1, 1), corner(bx1, by0, -1, 1), corner(bx0, by1, 1, -1), corner(bx1, by1, -1, -1)].map((d, i) =>
            <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={4} vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,.8))" }} />)}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
