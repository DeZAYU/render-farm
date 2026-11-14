// lookhere / FreezePunch: REF Dashcam Vol.1 E6 "look here" @3:03.0-3:07.0 (C3: the footage FREEZES (diff 0.0); punch-in x1.00 -> x2.29 toward
// the target, ease-out with a short 0.3 s acceleration (peak ~5 %/f at 0.45 s, 90 % at 1.1 s, settled 2.2 s), the pan keeps the target centred;
// the frame darkens ~-30 %; the RING draws on when the zoom is ~90 % done; hold 2.6 s; a 4 f WHITE FLASH cuts back to the live, un-zoomed clip).
// wp3 sec_A LookHere @ abs 2711 + Intro3 ride freeze/punch/ring/flash @ abs 408 (approved). Motion blur on the punch.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DrawRing, EZ, FLASH4, MBlur, Vignette, envAt, linPush } from "../../core";
import { ClipLayer } from "../labels/kit";
import { punchCam } from "./shared";

export type FreezePunchProps = {
  media: string; mediaStart?: number; push?: number; freezeAt: number; target: { x: number; y: number }; scale?: number; punchDur?: number;
  ringAt?: number; ringR?: number; releaseAt?: number; dim?: number;
};
export const FreezePunch: React.FC<FreezePunchProps> = ({ media, mediaStart = 0, push = 0.045, freezeAt, target, scale = 2.3, punchDur = 48, ringAt, ringR = 180, releaseAt, dim = 0.3 }) => {
  const f = useCurrentFrame();
  const rel = releaseAt ?? freezeAt + 120;
  const live = f >= rel;
  const s0 = linPush(freezeAt, push);
  const u = f < freezeAt ? 0 : EZ.punch((f - freezeAt) / punchDur);
  const cam = f < freezeAt ? null : punchCam(u, s0, scale, target);
  const rA = ringAt ?? freezeAt + Math.round(punchDur * 0.62);
  const end = punchCam(1, s0, scale, target).map(target);
  const fast = !live && f > freezeAt && f < freezeAt + punchDur * 0.6;
  const fl = envAt(FLASH4, f - rel);
  const plate = (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={live || !cam ? { transform: `scale(${(live ? linPush(f - rel, push) : linPush(f, push)).toFixed(5)})` } : { transformOrigin: "0 0", transform: cam.transform, filter: `contrast(${(1 + 0.3 * u).toFixed(3)})` }}>
        <ClipLayer src={media} startFrom={mediaStart} freezeAt={freezeAt} resumeAt={rel} />
      </AbsoluteFill>
      <Vignette />
      {!live && u > 0 ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,0,0,${(0.12 * dim * u / 0.3).toFixed(3)}) 30%, rgba(0,0,0,${(dim * u).toFixed(3)}) 100%)` }} /> : null}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <MBlur on={fast} samples={8}>{plate}</MBlur>
      {!live && f >= rA ? <DrawRing k={f - rA} x={end.x} y={end.y} r={ringR} core={11} colour="#D80A10" drawFrames={10} /> : null}
      {fl > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: fl }} /> : null}
    </AbsoluteFill>
  );
};
