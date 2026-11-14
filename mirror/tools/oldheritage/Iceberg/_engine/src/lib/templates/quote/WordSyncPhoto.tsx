// quote / WordSyncPhoto: VV §8 word-synced title over a scene (VV @ 1:26.3 "why was a priest…": Inter SemiBold lowercase white, each word
// ghosts 0.3 -> 1 in 3-6 f on its spoken word, no per-word motion, the scene keeps moving) + Farrell text T6 I08 (quote lines over a dimmed
// face, IG 5:39.04); wp3 sec_C PtsInner part (c) @ 6460. The photo starts bright, then dims to ~42 % and defocuses 3 px around the first word,
// a linear push the whole time. Our version: centred lines RE-CENTRE smoothly (4 f) as each word arrives, instead of VV's 1-frame jumps;
// optional VV anamorphic streak sweeping across the photo; attribution line fades in under the quote.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, Media, Vignette, W, clamp01, fs, lerp, measure } from "../../core";
import { ghostO, type Word } from "../photo/shared";

export type QuoteLine = { words: Word[]; cap?: number };
export type WordSyncPhotoProps = {
  src: string; // photo or clip behind
  pos?: string;
  lines: QuoteLine[];
  attribution?: string;
  attrAt?: number;
  dimAt?: number; // default: 4 f before the first word
  dim?: number; // final brightness
  push?: number; // linear push per second
  streak?: boolean; // VV anamorphic streak
  y?: number; // block centre (screen px)
  cap?: number; // first-line cap (later lines x0.84) unless a line sets its own
  subCap?: number; // attribution cap
};

export const WordSyncPhoto: React.FC<WordSyncPhotoProps> = ({ src, pos, lines, attribution, attrAt, dimAt, dim = 0.42, push = 0.025, streak = true, y = 0.45 * H, cap = 50, subCap = 28 }) => {
  const k = useCurrentFrame();
  const first = lines[0]?.words[0]?.at ?? 0;
  const da = dimAt ?? first - 4;
  const dm = EZ.out2((k - da + 6) / 12);
  const br = lerp(1, dim, dm), bl = 3 * dm;
  const caps = lines.map((l, i) => l.cap ?? (i === 0 ? cap : Math.max(28, cap * 0.84)));
  const pitch = caps.map((c) => c * 2.05);
  const blockH = pitch.reduce((a, b) => a + b, 0);
  let yy = y - blockH / 2;
  const st = clamp01((k - da) / 40);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${(1.02 + push * (k / 30)).toFixed(5)})`, filter: `brightness(${br.toFixed(3)})${bl > 0.05 ? ` blur(${bl.toFixed(2)}px)` : ""}` }}>
        <Media src={src} pos={pos} />
      </AbsoluteFill>
      {streak ? (
        <div style={{ position: "absolute", left: lerp(-1300, 700, EZ.quick(st)), top: y - 150, width: 1500, height: 16, borderRadius: 16, opacity: 0.55 * Math.sin(Math.PI * st),
          background: "linear-gradient(90deg, rgba(80,120,255,0), rgba(110,150,255,.9) 45%, rgba(200,150,255,.5) 70%, rgba(200,150,255,0))", filter: "blur(6px)", mixBlendMode: "screen" }} />
      ) : null}
      <Vignette />
      {lines.map((l, li) => {
        const cap = caps[li], f = fs("inter", cap);
        const font = `600 ${f}px ${FONT.inter}`;
        const sp = measure(" ", font);
        const ws = l.words.map((w) => measure(w.text, font));
        const xs: number[] = []; let acc = 0;
        ws.forEach((w) => { xs.push(acc); acc += w + sp; });
        const lw = (n: number) => (n <= 0 ? 0 : xs[n - 1] + ws[n - 1]);
        // smooth re-centre: width grows over 4 f from each word's onset
        let cw = 0;
        l.words.forEach((w, i) => { if (k >= w.at) cw = lerp(lw(i), lw(i + 1), EZ.out2((k - w.at) / 4)); });
        const left = W / 2 - cw / 2;
        const top = yy; yy += pitch[li];
        return (
          <div key={li} style={{ position: "absolute", left: 0, top, width: W, height: pitch[li] }}>
            {l.words.map((w, i) => (
              <span key={i} style={{ position: "absolute", left: left + xs[i], top: 0, whiteSpace: "pre", fontFamily: FONT.inter, fontWeight: 600, fontSize: f, color: "#F4F4F2", opacity: ghostO(k, w.at),
                textShadow: "0 0 10px rgba(255,255,235,.25), 0 3px 12px rgba(0,0,0,.7)" }}>{w.text}</span>
            ))}
          </div>
        );
      })}
      {attribution ? (
        <div style={{ position: "absolute", left: 0, width: W, top: yy + 18, textAlign: "center", fontFamily: FONT.inter, fontWeight: 400, fontSize: fs("inter", subCap), color: "#BDBDBA",
          opacity: 0.9 * clamp01((k - (attrAt ?? first + 8)) / 8), textShadow: "0 2px 8px rgba(0,0,0,.7)" }}>{attribution}</div>
      ) : null}
    </AbsoluteFill>
  );
};
