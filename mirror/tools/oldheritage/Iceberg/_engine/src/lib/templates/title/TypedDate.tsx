// title / TypedDate: VV §4 typed date with cursor (MOTION.md §4, 2:52.0 "APRIL 2008 / THE DAY OF THE BALLOON FLIGHT"): defocused dark footage
// (~30 % brightness, heavy vignette); cursor alone 5 f, then ONE CHARACTER EVERY 5 FRAMES, metronomic, each popping in 1 f; the centred line
// re-centres on every character; the whole line shrinks continuously (-0.4 %/f); line 2 arrives word by word (ghost -> full in 4 f, on the
// voice) while line 1 moves up and scales down. Thin condensed caps (Oswald 200 ~ Bebas Light) in cold white #D2FFFC.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { EZ, FONT, Media, clamp01, fs, ghost, lerp } from "../../core";

export type TypedDateProps = { media: string; line1: string; line2?: { text: string; at: number }[]; startAt?: number; perChar?: number; colour?: string };
export const TypedDate: React.FC<TypedDateProps> = ({ media, line1, line2 = [], startAt = 4, perChar = 5, colour = "#D2FFFC" }) => {
  const f = useCurrentFrame();
  const n = Math.min(line1.length, Math.max(0, Math.floor((f - startAt - 5) / perChar) + 1));
  const typedEnd = startAt + 5 + line1.length * perChar;
  const l2 = line2.length ? line2[0].at : 1e9;
  const up = EZ.out3((f - l2 + 2) / 18);
  const shrink = Math.max(0.78, 1 - 0.004 * Math.max(0, Math.min(f, typedEnd) - startAt) * 0.6) * lerp(1, 0.72, up);
  const cursorOn = Math.floor(f / 6) % 2 === 0 && (n < line1.length || f < typedEnd + 20);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(.3) saturate(.8)", transform: "scale(1.12)" }}>
        <Sequence layout="none"><Media src={media} /></Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 60% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.75) 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ transform: `translateY(${lerp(0, -70, up)}px) scale(${shrink.toFixed(4)})`, display: "flex", alignItems: "center", fontFamily: FONT.oswald, fontWeight: 200, fontSize: fs("oswald", 112), color: colour,
          letterSpacing: "0.06em", textShadow: "0 0 10px rgba(180,200,200,.35)", whiteSpace: "pre" }}>
          {line1.slice(0, n)}
          <span style={{ display: "inline-block", width: 7, height: 120, marginLeft: 8, background: colour, opacity: cursorOn ? 0.9 : 0 }} />
        </div>
        {line2.length ? (
          <div style={{ display: "flex", gap: 26, marginTop: lerp(-40, 10, up), fontFamily: FONT.bebas, fontSize: fs("bebas", 96), color: "#F2F2F0", textShadow: "0 0 8px rgba(255,255,255,.25)" }}>
            {line2.map((w, i) => <span key={i} style={{ opacity: ghost(f - w.at, 4, 0.25) * clamp01(up * 3 + (f >= w.at ? 1 : 0)) }}>{w.text}</span>)}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
