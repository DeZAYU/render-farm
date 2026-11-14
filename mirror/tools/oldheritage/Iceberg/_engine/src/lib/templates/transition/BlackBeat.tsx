// transition / BlackBeat: the deliberate black hold. REF Farrell camera MOTION §2.5 "act breaks and case blacks" (YT 4:58.0: 18 f dissolve to
// black, black hold, HARD CUT back in with 1-2 HOT frames +0.27..+0.47 white and a hit; YT 21:28.0) + wp3 sec_B 1.0 s black beat before the fire
// (sub boom into the black). Forms: hard cut to black (beat before a shocking moment) or a dissolve to black (act break). The return is always a
// hard cut with hot frames. Optional single centred word on the black (VV §9 static pop: no fade, no motion, no glow).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, clamp01, fs } from "../../core";
import { SideA, SideB, type TransitionProps } from "./shared";

export type BlackBeatProps = TransitionProps & {
  blackAt: number; // first black frame
  dissolveF?: number; // 0 = hard cut to black; 18 = Farrell act-break dissolve
  hot?: number[]; // white added on the first incoming frames (Farrell: [0.47] or [0.27, 0.27])
  word?: { text: string; at: number; colour?: string };
};
export const BlackBeat: React.FC<BlackBeatProps> = (p) => {
  const f = useCurrentFrame();
  const d = p.dissolveF ?? 0;
  const hot = p.hot ?? [0.47];
  if (f < p.blackAt) {
    const u = d > 0 ? clamp01((f - (p.blackAt - d)) / d) : 0;
    return <AbsoluteFill style={{ background: "#000" }}><SideA {...p} style={{ opacity: 1 - u }} /></AbsoluteFill>;
  }
  if (f < p.cut) {
    return (
      <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center" }}>
        {p.word && f >= p.word.at ? (
          <div style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", 70), letterSpacing: "-0.02em", color: p.word.colour ?? "#F2F2F2" }}>{p.word.text}</div>
        ) : null}
      </AbsoluteFill>
    );
  }
  const k = Math.floor(f - p.cut);
  const h = k < hot.length ? hot[k] : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SideB {...p} />
      {h > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: h }} /> : null}
    </AbsoluteFill>
  );
};
