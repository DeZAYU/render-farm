// Case-opener system: ONE identity (Dashcam Vol.3 E1 Nunito 900 red-gradient number + Varela-Round two-tone date / place labels with the red
// key word, FONTS.md) and several ENTRY variants (FULL_PLAN: rotate among >= 3). All frames LOCAL (0 = first frame of the case picture).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp01 } from "../../core";
import type { Word } from "../labels/kit";

export type CaseOpenerProps = {
  number: string; // "4" (D3 uses "1", never "01")
  dateWords: Word[]; // e.g. [{text:"March",at:8},{text:"3rd,",at:16},{text:"2019",at:24,red:true}] (red = key word)
  placeWords?: Word[]; // e.g. [{text:"Riverside",at:70},{text:"Park,",at:76},{text:"Ohio",at:84,red:true}]
  media: string; // footage plate (public-relative); still or clip
  mediaStart?: number; // source frame of the clip at local 0
  push?: number; // linear footage push per second (Dashcam 0.04-0.045)
  numberAt?: number; // first visible frame of the number
  numberOut?: number; // number exit start
  dateOut?: number; // date label exit start (undefined = stays)
  placeOut?: number; // place label exit start
};

/** the soft dark radial band DD puts behind a centred label on bright footage (wp3 sec_A DateLabel, .38) */
export const LabelBand: React.FC<{ o: number; y?: number; h?: number; wPct?: number }> = ({ o, y = 540, h = 340, wPct = 34 }) =>
  o > 0.005 ? <div style={{ position: "absolute", left: 0, top: y - h / 2, width: 1920, height: h, opacity: o, background: `radial-gradient(ellipse ${wPct}% 50% at 50% 50%, rgba(0,0,0,.85), rgba(0,0,0,0) 100%)` }} /> : null;

/** presence 0..1 of a label (first word onset -> 15 f in; exit 20 f) */
export const presence = (f: number, words: Word[] | undefined, out?: number) => {
  if (!words?.length) return 0;
  const a = clamp01((f - words[0].at) / 15);
  const e = out === undefined ? 0 : clamp01((f - out) / 20);
  return a * (1 - e);
};

export const Fill: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>{children}</AbsoluteFill>;
export const useF = () => useCurrentFrame();
