// transition / WhiteFlash: the Dashcam hard white flash. REF D1 white flash (Dashcam Vol.1 @ case entries / look-here release; wp3 sec_A FLASH4
// at 1509 and 2879) + FA camera R5 flash-decay on the incoming frames (wp3 sec_A 852). The cut happens INSIDE the white: frame 0 of the flash is the
// first incoming frame, full white, then 0.85 / 0.5 / 0.2. Optional `decay` adds the FA 3-frame decay (.87/.71/.50) instead (softer, photo entries).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DECAY3, FLASH4, envAt } from "../../core";
import { Cut, type TransitionProps } from "./shared";

export type WhiteFlashProps = TransitionProps & { envelope?: "hard" | "decay"; tint?: string };
export const WhiteFlash: React.FC<WhiteFlashProps> = (p) => {
  const f = useCurrentFrame();
  const k = f - p.cut;
  const o = envAt(p.envelope === "decay" ? DECAY3 : FLASH4, k);
  return (
    <AbsoluteFill>
      <Cut {...p} />
      {o > 0 ? <AbsoluteFill style={{ background: p.tint ?? "#fff", opacity: o }} /> : null}
    </AbsoluteFill>
  );
};
