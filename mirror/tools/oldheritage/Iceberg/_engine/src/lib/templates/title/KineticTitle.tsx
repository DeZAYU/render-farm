// title / KineticTitle: VV §8 word-synced kinetic title over a moving scene (MOTION.md §8: 0:38.7 title room "THE MOST / DISTURBING MOMENTS /
// THAT AIRED ON TV", 1:20.3 sky with cloud occlusion). Each word appears as a ghost (~30 %) and brightens to full in 4 f on its spoken word
// (+0.0..+0.2 s), no per-word motion; left-aligned lines grow to the right; Bebas Neue bold words + Oswald 200 light connector words, one red key
// word (FONTS.md hook row: cap 98, pitch 135). The scene behind keeps a linear push (+4.8 %/s); the text block sits still or drifts <= 2 px/f.
// Optional occlusion: a soft luma-keyed copy of the scene's top area passes in front of the text (VV sky cloud wisps).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { FONT, Media, Vignette, fs, ghost, linPush } from "../../core";

export type KWord = { text: string; at: number; light?: boolean; red?: boolean; line: number };
export type KineticTitleProps = { media: string; words: KWord[]; cap?: number; x?: number; y?: number; occlude?: boolean; dim?: number };
export const KineticTitle: React.FC<KineticTitleProps> = ({ media, words, cap = 98, x = 190, y = 300, occlude = false, dim = 0.55 }) => {
  const f = useCurrentFrame();
  const sc = linPush(f, 0.048);
  const nLines = Math.max(...words.map((w) => w.line)) + 1;
  const scene = (
    <AbsoluteFill style={{ transform: `scale(${sc.toFixed(5)})` }}>
      <Sequence layout="none"><Media src={media} /></Sequence>
    </AbsoluteFill>
  );
  const m = "linear-gradient(to bottom, #000 0%, rgba(0,0,0,.85) 28%, transparent 46%)";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `brightness(${dim})` }}>{scene}</AbsoluteFill>
      <Vignette />
      <div style={{ position: "absolute", left: x - f * 0.6, top: y, display: "flex", flexDirection: "column", gap: cap * 0.38 }}>
        {Array.from({ length: nLines }, (_, li) => (
          <div key={li} style={{ display: "flex", gap: cap * 0.3, alignItems: "baseline", lineHeight: 1 }}>
            {words.filter((w) => w.line === li).map((w, i) => (
              <span key={i} style={{
                ...(w.light ? { fontFamily: FONT.oswald, fontWeight: 200, fontSize: fs("oswald", cap) } : { fontFamily: FONT.bebas, fontSize: fs("bebas", cap) }),
                color: w.red ? "#E30A10" : w.light ? "#E6EFAE" : "#F1F2F1", opacity: ghost(f - w.at), whiteSpace: "nowrap",
                textShadow: w.red ? "0 0 10px rgba(227,10,16,.45)" : "0 0 6px rgba(255,255,220,.3)",
              }}>{w.text}</span>
            ))}
          </div>
        ))}
      </div>
      {occlude ? (
        <AbsoluteFill style={{ filter: `brightness(${dim * 1.15}) contrast(1.3)`, WebkitMaskImage: m, maskImage: m, mixBlendMode: "screen", opacity: 0.55 }}>{scene}</AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
