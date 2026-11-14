// social / PostCard: a captured post (Facebook / forum / Reddit / comment) as a white 3-D card that SWINGS IN from the lower right with
// perspective over the last frame of the story (shrunk into a bordered screen, blurred and darkened in 6 f), settles in ~12 f at a -4 deg
// roll, holds with a slow drift, a yellow marker wipes the clause being read; the next card swings in after the previous swings away (8 f).
// REF Caving comment cards @21:31-21:42 (3-D tilted white cards over the blurred last frame, 12 f in, 5.5 s hold, 8 f out) + Nocturn CP13
// Facebook/Reddit post with a yellow marker (shop 1:13.3, 4:49.7; worst 10:36.4) / CP14 tilted post (shop 13:30.8).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, MBlur, Media, asset, clamp01, lerp } from "../../core";
import { TypedCaption, markBars, type CaptionLine, type Mark, type PageSrc } from "../page/shared";

export type PostCardItem = PageSrc & {
  crop?: [number, number, number, number]; // CSS [x0, y0, x1, y1] of the post inside the capture
  at: number; // swing-in start
  out?: number; // swing-away start (8 f)
  marks?: Mark[]; // yellow marker on the read clause (CSS px of the capture)
  width?: number; // card width on screen (default 0.72 W)
  roll?: number; // settled roll (default -4)
};
export type PostCardProps = { bg?: string; cards: PostCardItem[]; captions?: CaptionLine[]; captionCap?: number /* typed caption cap, default 40 */; markColour?: string };
const Card: React.FC<{ c: PostCardItem; mc: string }> = ({ c, mc }) => {
  const f = useCurrentFrame();
  const k = f - c.at;
  if (k < 0) return null;
  const ko = c.out !== undefined ? f - c.out : -1;
  if (ko >= 8) return null;
  const [x0, y0, x1, y1] = c.crop ?? [0, 0, c.cssW, c.cssH];
  const w = c.width ?? 1380, sc = w / (x1 - x0), h = (y1 - y0) * sc;
  const u = EZ.quick(k / 12), o = EZ.in2(ko / 8);
  const roll = c.roll ?? -4;
  const life = 1 + 0.006 * (k / 30);
  const tf = `translate(${lerp(560, 0, u) + 0 * o}px, ${(lerp(460, 0, u) + 900 * o).toFixed(1)}px) perspective(1600px) rotateY(${lerp(-38, 0, u).toFixed(2)}deg) rotateX(${(lerp(18, 0, u) - 20 * o).toFixed(2)}deg) rotate(${(lerp(roll + 14, roll, u) - 0.1 * (k / 30) + 9 * o).toFixed(2)}deg) scale(${life.toFixed(4)})`;
  const bars = markBars(f, c.marks, { c: mc, ease: EZ.hlWipe, perLine: 18, px: 4, py: 3, radius: 3 });
  return (
    <div style={{ position: "absolute", left: 960 - w / 2, top: 540 - h / 2, width: w, height: h, transform: tf, opacity: clamp01(k / 3) * (1 - o * 0.3),
      borderRadius: 16, overflow: "hidden", background: "#fff", isolation: "isolate", boxShadow: "0 40px 90px rgba(0,0,0,.65), 0 6px 14px rgba(0,0,0,.35)" }}>
      <div style={{ position: "absolute", left: -x0 * sc, top: -y0 * sc, width: c.cssW, height: c.cssH, transformOrigin: "0 0", transform: `scale(${sc})` }}>
        {bars.filter((b) => b.p > 0).map((b, i) => (
          <div key={i} style={{ position: "absolute", left: b.r[0] - 4, top: b.r[1] - 3, width: (b.r[2] + 8) * b.p, height: b.r[3] + 6, background: b.c, borderRadius: 3 }} />
        ))}
        <Img src={asset(c.src)} style={{ position: "absolute", left: 0, top: 0, width: c.cssW, height: c.cssH, mixBlendMode: "multiply" }} />
      </div>
    </div>
  );
};
const Inner: React.FC<PostCardProps> = (p) => {
  const f = useCurrentFrame();
  const b = EZ.out2(f / 6);
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {p.bg ? (
        <AbsoluteFill style={{ transform: `scale(${lerp(1, 0.84, b) * (1 + 0.004 * (Math.max(0, f) / 30))})` }}>
          <AbsoluteFill style={{ border: `${(6 * b).toFixed(1)}px solid rgba(220,220,220,${(0.5 * b).toFixed(2)})`, overflow: "hidden", filter: `blur(${(10 * b).toFixed(2)}px) brightness(${lerp(1, 0.45, b).toFixed(3)})` }}>
            <Media src={p.bg} />
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}
      {p.cards.map((c, i) => <Card key={i} c={c} mc={p.markColour ?? "#FFE03A"} />)}
    </AbsoluteFill>
  );
};
export const PostCard: React.FC<PostCardProps> = (p) => {
  const f = useCurrentFrame();
  const swinging = p.cards.some((c) => (f >= c.at && f < c.at + 8) || (c.out !== undefined && f >= c.out && f < c.out + 8));
  return (
    <AbsoluteFill>
      <MBlur on={swinging}><Inner {...p} /></MBlur>
      <TypedCaption cap={p.captionCap ?? 40} lines={p.captions} />
    </AbsoluteFill>
  );
};
