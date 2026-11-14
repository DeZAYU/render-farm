// title / WordPops: VV §9 hard word pops on black (MOTION.md §9: 0:43.6 "TO THE WORST OF THE WORST.", 1:07.1, 13:58.3 "then she disappeared.").
// COMPLETELY STATIC frames: each word pops in 1 frame on its spoken word (median +0.09 s = +3 f), no fade, no motion, no glow; colour does the
// emphasis (Bebas light = Oswald 200 white, Bebas bold yellow #EAF721 / red #E00006; or Inter 600 lowercase red sentence). Hard cut out.
// Its value is the stillness between the moving devices: use sparingly (punctuation).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, fs } from "../../core";

export type PopWord = { text: string; at: number; colour?: string; weight?: "light" | "bold" };
export type WordPopsProps = { words: PopWord[]; style?: "caps" | "sentence"; cap?: number; lines?: number[] /* word index where each new line starts */ };
export const WordPops: React.FC<WordPopsProps> = ({ words, style = "caps", cap = 104, lines = [] }) => {
  const f = useCurrentFrame();
  const rows: PopWord[][] = [];
  words.forEach((w, i) => { if (i === 0 || lines.includes(i)) rows.push([]); rows[rows.length - 1].push(w); });
  const font = (w: PopWord): React.CSSProperties =>
    style === "sentence"
      ? { fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", cap * 0.68), letterSpacing: "-0.02em" }
      : w.weight === "light"
        ? { fontFamily: FONT.oswald, fontWeight: 200, fontSize: fs("oswald", cap) }
        : { fontFamily: FONT.bebas, fontSize: fs("bebas", cap) };
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: cap * 0.3 }}>
      {rows.map((row, r) => (
        <div key={r} style={{ display: "flex", gap: cap * 0.32, alignItems: "baseline", lineHeight: 1 }}>
          {row.map((w, i) => (
            <span key={i} style={{ ...font(w), color: w.colour ?? "#F1F2F1", visibility: f >= w.at ? "visible" : "hidden", whiteSpace: "nowrap" }}>{w.text}</span>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};
