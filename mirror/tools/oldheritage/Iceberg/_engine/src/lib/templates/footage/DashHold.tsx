// footage / DashHold: the Dashcam footage hold. REF Dashcam Vol.1 D/E15 (long holds 6-15 s with a constant LINEAR push +0.15 %/frame = +4.5 %/s,
// never eased; hard cuts on sentence ends; e.g. the fire-truck b-roll @0:42.21-0:45.21) + D1 C censor blurs (targeted, feathered elliptical
// Gaussian blur over faces / injured people, never full-frame) + wp3 sec_B/sec_C Shot + EBlur (approved). Face/injury blurs are tracked:
// `blurs` = regions with keys in SOURCE px (the push is applied, the radius scales with it).
import React from "react";
import { useCurrentFrame } from "remotion";
import { EBlur, linPush } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "../labels/kit";

export type BlurTrack = { keys: TrackKey[]; rx: number; ry: number; px?: number; from?: number; to?: number };
export type DashHoldProps = { media: string; mediaStart?: number; push?: number; base?: number; origin?: string; blurs?: BlurTrack[]; filter?: string };
export const DashHold: React.FC<DashHoldProps> = ({ media, mediaStart = 0, push = 0.045, base = 1.02, origin = "50% 50%", blurs = [], filter }) => {
  const f = useCurrentFrame();
  const s = base * linPush(f, push);
  const [ox, oy] = origin.split(" ").map((v, i) => (parseFloat(v) / 100) * (i ? 1080 : 1920));
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push} base={base} origin={origin} filter={filter}>
      {blurs.filter((b) => (b.from ?? -1e9) <= f && f < (b.to ?? 1e9)).map((b, i) => {
        const p = scr(trackAt(b.keys, f), s, ox, oy);
        return <EBlur key={i} cx={p.x} cy={p.y} rx={b.rx * s} ry={b.ry * s} px={b.px ?? 18} />;
      })}
    </FootPlate>
  );
};
