// quote / WhiteBox: Abyssal E4 quote card with speech-synced decode (Abyssal @ 35:00 "she might not make it", 61:50; FONTS.md quote card: Inter
// 600 black on a pure-white box, ~0.045 H). The footage switches in ~0.3 s to a hard posterise/threshold (black/white with colour bands at the
// edges) and keeps playing; the box pops at full size on 1 frame 0.17-0.23 s before the first quoted word (no border, shadow or radius); the
// words resolve from black ink blobs in sync with the voice; line 2 only after line 1; hold 0.5-1 s. Our version (Rule 0): the threshold bands
// are DD red only (no rainbow), a small speaker line under the box, the box breathes +0.3 %/s.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, Media, W, clamp01, fs, measure } from "../../core";
import type { Word } from "../photo/shared";

export type WhiteBoxProps = {
  bg: string; // footage (keeps playing) or still
  lines: Word[][]; // 1-2 lines, words with their spoken frames
  at?: number; // box pop (default 6 f before the first word)
  speaker?: string;
  posterize?: boolean;
  cap?: number;
  subCap?: number; // speaker line cap
};

const PID = "lib-quote-poster";

export const WhiteBox: React.FC<WhiteBoxProps> = ({ bg, lines, at, speaker, posterize = true, cap = 0.045 * H, subCap = 28 }) => {
  const k = useCurrentFrame();
  const first = lines[0]?.[0]?.at ?? 10;
  const pop = at ?? first - 6;
  const sw = clamp01((k - (pop - 9)) / 9); // switch to the threshold look in 0.3 s
  const f = fs("inter", cap * 0.92);
  const font = `600 ${f}px ${FONT.inter}`;
  const lw = lines.map((l) => measure(l.map((w) => w.text).join(" "), font));
  const boxW = Math.max(0.418 * W, Math.max(...lw) + 2 * 64), lh = f * 1.32;
  const boxH = Math.max(0.116 * H, lines.length * lh + 2 * 36);
  const bx = W / 2 - boxW / 2, by = H / 2 - boxH / 2;
  const breathe = 1 + 0.003 * (Math.max(0, k - pop) / 30);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={PID} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0 0 0 0.8 0.74 0.78 0.8 0.84 0.86" />
            <feFuncG type="discrete" tableValues="0 0 0 0 0.03 0.72 0.76 0.79 0.83 0.85" />
            <feFuncB type="discrete" tableValues="0 0 0 0 0.05 0.7 0.74 0.77 0.81 0.84" />
          </feComponentTransfer>
        </filter>
      </svg>
      <AbsoluteFill style={{ transform: `scale(${(1.02 + 0.012 * (k / 30)).toFixed(5)})` }}>
        <AbsoluteFill style={{ opacity: posterize ? 1 - sw : 1, filter: posterize ? undefined : `brightness(${1 - 0.5 * sw})` }}><Media src={bg} /></AbsoluteFill>
        {posterize && sw > 0 ? <AbsoluteFill style={{ opacity: sw, filter: `url(#${PID}) brightness(.82)` }}><Media src={bg} /></AbsoluteFill> : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
      {k >= pop ? (
        <div style={{ position: "absolute", left: bx, top: by, width: boxW, height: boxH, background: "#FFFFFF", transform: `scale(${breathe.toFixed(5)})` }}>
          {lines.map((l, li) => {
            const prevDone = li === 0 ? -1 : Math.max(...lines[li - 1].map((w) => w.at));
            return (
              <div key={li} style={{ position: "absolute", left: 0, right: 0, top: (boxH - lines.length * lh) / 2 + li * lh, height: lh, display: "flex", justifyContent: "center", alignItems: "center",
                gap: measure(" ", font), fontFamily: FONT.inter, fontWeight: 600, fontSize: f, color: "#000", whiteSpace: "pre" }}>
                {l.map((w, i) => {
                  const a = Math.max(w.at, prevDone + 2);
                  const q = k - a;
                  // ink blob -> glyph: heavy blur + thick stroke resolving in 5 f
                  const r = clamp01(q / 5);
                  return (
                    <span key={i} style={{ opacity: q < 0 ? 0 : 0.55 + 0.45 * r, filter: r < 1 ? `blur(${(6 * (1 - r) * (1 - r)).toFixed(2)}px)` : undefined,
                      WebkitTextStroke: r < 1 ? `${(5 * (1 - r)).toFixed(2)}px #000` : undefined }}>{w.text}</span>
                  );
                })}
              </div>
            );
          })}
        </div>
      ) : null}
      {speaker && k >= pop ? (
        <div style={{ position: "absolute", left: 0, width: W, top: by + boxH + 26, textAlign: "center", fontFamily: FONT.inter, fontWeight: 500, fontSize: fs("inter", subCap), color: "#F2F2F2",
          opacity: clamp01((k - Math.max(...lines.flat().map((w) => w.at))) / 8), textShadow: "0 2px 8px rgba(0,0,0,.8)" }}>{speaker}</div>
      ) : null}
    </AbsoluteFill>
  );
};
