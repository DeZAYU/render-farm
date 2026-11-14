// quote / RedSentence: VV §9 hard word pops on black (VV @ 1:07.1 red sentence "a catholic priest floated", @ 13:58.3 "then she disappeared.";
// FONTS.md "VV sentence on black": Helvetica Bold class -> Inter 700, lowercase, cap ~70, tracking -0.02 em, red #D90008 / white). COMPLETELY
// STATIC frames: each word pops in 1 frame on the voice (median +0.09 s), no fade, no motion, no glow; out on a hard cut. This is the one
// deliberate exception to "nothing dead-still" (MOTION §15 rule 9: the stillness is the punctuation between moving devices).
// Our version: per-word colour (red / white / VV yellow #EAF721) and an automatic wrap into a left-aligned or centred block.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, W, fs, measure } from "../../core";

export type PopWord = { text: string; at: number; colour?: "red" | "white" | "yellow" };
export type RedSentenceProps = {
  words: PopWord[];
  align?: "left" | "centre";
  cap?: number;
  maxWidth?: number;
  x?: number; // left edge for align left
};
const COL = { red: "#D90008", white: "#F4F4F4", yellow: "#EAF721" };

export const RedSentence: React.FC<RedSentenceProps> = ({ words, align = "left", cap = 70, maxWidth = 1500, x = 210 }) => {
  const k = useCurrentFrame();
  const f = fs("inter", cap);
  const font = `700 ${f}px ${FONT.inter}`;
  const sp = measure(" ", font), track = -0.02 * f;
  const wd = words.map((w) => measure(w.text, font) + track * (w.text.length - 1));
  // wrap (layout fixed up front: words pop in place)
  const rows: { i: number; x: number }[][] = [[]];
  let cx = 0;
  wd.forEach((w, i) => {
    if (cx > 0 && cx + w > maxWidth) { rows.push([]); cx = 0; }
    rows[rows.length - 1].push({ i, x: cx }); cx += w + sp;
  });
  const lh = f * 1.18;
  const top0 = H / 2 - (rows.length * lh) / 2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {rows.map((r, ri) => {
        const rw = r.length ? r[r.length - 1].x + wd[r[r.length - 1].i] : 0;
        const left = align === "centre" ? W / 2 - rw / 2 : x;
        return r.map(({ i, x: wx }) => (k >= words[i].at ? (
          <div key={i} style={{ position: "absolute", left: left + wx, top: top0 + ri * lh, whiteSpace: "pre", fontFamily: FONT.inter, fontWeight: 700, fontSize: f, lineHeight: `${lh}px`,
            letterSpacing: "-0.02em", color: COL[words[i].colour ?? "red"] }}>{words[i].text}</div>
        ) : null));
      })}
    </AbsoluteFill>
  );
};
