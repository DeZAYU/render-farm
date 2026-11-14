// quote / Typewriter: SIRIUS E3 word-locked typewriter caption (SIRIUS @ 0:24.18 T1 "security wasn't as tight / as you might expect.": regular
// sans #DEDEDD with a soft glow, ascender ~45 px, line pitch 72, left-aligned block whose longest line is centred, y 896-1026; characters POP
// 1-2 per 30 fps step, spread over each spoken word (~21.8 c/s), 0.1 s pause at a line break, no cursor, no fade; hold ~0.5 s, out on the cut;
// T3 @ 29:17.5 = the large 3-line variant centre-left over near-black). Typing clicks: sfx "typing_key" per step.
// Our version: the background is the DD-graded footage, defocused and dimmed (SIRIUS T2 over blurred footage), with a slow push; the text
// block rises 2 px/s so it is never dead.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, Media, Vignette, W, fs, measure } from "../../core";

export type TypeWord = { text: string; at: number; end?: number };
export type TypewriterProps = {
  bg?: string; // footage/still behind (defocused); omit = near-black
  lines: TypeWord[][];
  layout?: "caption" | "block"; // SIRIUS T1 caption (bottom) or T3 large block
  blur?: number;
  dim?: number;
  cap?: number; // glyph cap height (default 43 caption / 74 block)
};

export const Typewriter: React.FC<TypewriterProps> = ({ bg, lines, layout = "caption", blur = 14, dim = 0.42, cap }) => {
  const k = useCurrentFrame();
  const big = layout === "block";
  const f = fs("inter", cap ?? (big ? 74 : 43)); // caption: ascender ~45 px
  const pitch = big ? 118 : 72;
  const font = `400 ${f}px ${FONT.inter}`;
  // per-character onset frames: spread each word over [at, end]
  const all = lines.flat();
  const timed = lines.map((l) => l.map((w) => {
    const idx = all.indexOf(w);
    const nxt = all[idx + 1];
    const end = w.end ?? Math.min(w.at + w.text.length * 1.38, nxt ? nxt.at - 1 : w.at + w.text.length * 1.38);
    const n = w.text.length;
    return { ...w, t: Array.from({ length: n }, (_, i) => w.at + ((end - w.at) * i) / Math.max(1, n)) };
  }));
  const strs = lines.map((l) => l.map((w) => w.text).join(" "));
  const longest = Math.max(...strs.map((s) => measure(s, font)));
  const x0 = big ? 0.15 * W : W / 2 - longest / 2;
  const yTop = big ? H / 2 - (lines.length * pitch) / 2 - 20 : 1026 - lines.length * pitch + 6;
  const step = Math.floor(k / 2) * 2 + 1; // 30 fps steps of 2 f -> 1-2 glyphs per step (SIRIUS)
  const rise = -2 * (k / 30);
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {bg ? (
        <AbsoluteFill style={{ transform: `scale(${(1.08 + 0.01 * (k / 30)).toFixed(5)})`, filter: `blur(${blur}px) brightness(${dim})` }}><Media src={bg} /></AbsoluteFill>
      ) : null}
      {bg ? <Vignette /> : <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 45% 50%, #141414 0%, #050505 100%)" }} />}
      <div style={{ position: "absolute", left: x0, top: yTop + rise }}>
        {timed.map((l, li) => {
          const s = l.map((w) => w.text.slice(0, w.t.filter((t) => t <= step).length)).filter((x) => x.length).join(" ");
          return (
            <div key={li} style={{ position: "absolute", left: 0, top: li * pitch, whiteSpace: "pre", fontFamily: FONT.inter, fontWeight: 400, fontSize: f, lineHeight: `${pitch}px`, color: "#DEDEDD",
              textShadow: "0 0 6px rgba(255,255,255,.35), 0 2px 10px rgba(0,0,0,.6)" }}>{s}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
