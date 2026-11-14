// DC14 SparkHold: the pickup's dashcam replayed slow (0.4x) on the white sedan beside the convertible. On the frame where the lit
// firework leaves the sedan's rear window the picture stops; everything drains to a dim grey except one soft oval of colour that
// runs from the open rear window across the gap to the convertible's open cabin, the camera eases along it, then colour returns and
// the replay runs on as the firework drops into the car ("rolled the window down and threw a lit firework into the open car").
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";

export const SparkHold: React.FC<{ src: string; from: number; rate: number; holdAt: number; holdLen: number; keys: CK[];
  spot: [number, number, number, number] }> = ({ src, from, rate, holdAt, holdLen, keys, spot }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const tHold = from + (holdAt / 30) * rate;                       // source time of the held frame
  const k = ease(f, holdAt + 2, holdAt + 18) * (1 - ease(f, holdAt + holdLen - 16, holdAt + holdLen));
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const [cx, cy, rx, ry] = spot;
  const m = `radial-gradient(ellipse ${rx * 100}% ${ry * 100}% at ${cx * 100}% ${cy * 100}%, rgba(0,0,0,0) 45%, #000 100%)`;
  const held = (filter?: string) => <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(tHold * 30)} muted style={{ ...st, filter }} /></Freeze>;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        <Sequence durationInFrames={holdAt} layout="none">
          <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={st} />
        </Sequence>
        <Sequence from={holdAt} durationInFrames={holdLen} layout="none">
          {held()}
          <div style={{ ...st, opacity: k, WebkitMaskImage: m, maskImage: m } as React.CSSProperties}>{held("grayscale(1) brightness(.34)")}</div>
        </Sequence>
        <Sequence from={holdAt + holdLen} layout="none">
          <OffthreadVideo src={staticFile(src)} startFrom={Math.round(tHold * 30) + 1} playbackRate={rate} muted style={st} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
