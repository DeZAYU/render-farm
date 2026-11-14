// social / CommentStack: Visual Venture §12 comment stack. A framed video still on a light-grey page; comment rows (avatar, name, words)
// arrive every 14 f: the avatar fades in over 6 f, then the words ghost in one by one; the whole stack moves in ONE continuous scroll
// (bezier .267,.094,.003,.998, peak at +0.4 s), not one scroll per row. Optional Nocturn CP12 red glow bar behind ONE comment (wipes ~0.5 s).
// REF Visual Venture §12 @5:45.4-5:49.6 + Nocturn CP12 comments page red glow bar (door 6:10.0, live 7:08.6). Rows are typeset (Inter = the
// Helvetica/Roboto class of the platform UI); avatars can be real crops.
import React from "react";
import { AbsoluteFill, Easing, Img, useCurrentFrame } from "remotion";
import { FONT, Media, RC, asset, clamp01, fs, ghost, measure } from "../../core";
import { TypedCaption, type CaptionLine } from "../page/shared";

export type Comment = { name: string; text: string; meta?: string; avatar?: string; colour?: string };
export type CommentStackProps = {
  still?: string; // the video (still or clip) in the frame at the top
  title?: string; // video title under the player
  rows: Comment[];
  first?: number; // frame of row 1 (default 8)
  every?: number; // frames between rows (default 14)
  scrollAt?: number; scrollBy?: number; scrollDur?: number; // the one continuous scroll (default from row 2, 342 px, 66 f)
  mark?: { i: number; at: number }; // red glow bar behind comment i
  captions?: CaptionLine[];
  cap?: number; // comment text cap (default 30)
  labelCap?: number; // user name cap (default 28)
  subCap?: number; // meta ("2 years ago") cap (default 28)
  titleCap?: number; // video title cap (default 32)
  captionCap?: number; // typed translation caption cap (default 40)
};
const SCROLL = Easing.bezier(0.267, 0.094, 0.003, 0.998);
const COL = { x: 360, w: 1200 }; // the framed player
const ROWS = { x: 200, textW: 1380 }; // the comment column is wider than the player so 30 px-cap comments fit
/** greedy word wrap with the real font metrics */
const wrap = (text: string, font: string, maxW: number) => {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    const t = cur ? `${cur} ${w}` : w;
    if (cur && measure(t, font) > maxW) { out.push(cur); cur = w; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
};
export const CommentStack: React.FC<CommentStackProps> = (p) => {
  const f = useCurrentFrame();
  const first = p.first ?? 8, every = p.every ?? 14;
  const sa = p.scrollAt ?? first + every;
  const y = -(p.scrollBy ?? 420) * SCROLL(clamp01((f - sa) / (p.scrollDur ?? 66)));
  const life = 1 + 0.005 * (Math.max(0, f) / 30);
  const tFs = fs("inter", p.cap ?? 30), nFs = fs("inter", p.labelCap ?? 28), mFs = fs("inter", p.subCap ?? 28), hFs = fs("inter", p.titleCap ?? 32);
  const lh = Math.round(tFs * 1.22);
  const font = `400 ${tFs}px ${FONT.inter}`;
  const titleTop = 70 + COL.w * 0.5625 + 26;
  let top = titleTop + (p.title ? hFs * 1.3 + 50 : 30);
  const rows = p.rows.map((r) => {
    const lines = wrap(r.text, font, ROWS.textW);
    const h = nFs * 1.25 + 14 + lines.length * lh + 44;
    const row = { r, lines, top };
    top += h;
    return row;
  });
  return (
    <AbsoluteFill style={{ background: "#E4E5E8" }}>
      <AbsoluteFill style={{ transform: `scale(${life}) translateY(${y.toFixed(2)}px)` }}>
        {/* framed video still */}
        <div style={{ position: "absolute", left: COL.x, top: 70, width: COL.w, height: COL.w * 0.5625, background: "#000", borderRadius: 14, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,.28)" }}>
          {p.still ? <Media src={p.still} /> : null}
        </div>
        {p.title ? (
          <div style={{ position: "absolute", left: COL.x, top: titleTop, width: COL.w, fontFamily: FONT.inter, fontWeight: 700, fontSize: hFs, color: "#0f0f0f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
        ) : null}
        {rows.map(({ r, lines, top: rt }, i) => {
          const a = first + i * every;
          const k = f - a;
          if (k < 0) return null;
          const mk = p.mark?.i === i ? Easing.out(Easing.cubic)(clamp01((f - p.mark.at) / 15)) : 0;
          const av = 96;
          const ty = nFs * 1.25 + 14;
          let wi = 0;
          return (
            <div key={i} style={{ position: "absolute", left: ROWS.x, top: rt, width: ROWS.textW + 140 }}>
              <div style={{ position: "absolute", left: 0, top: 4, width: av, height: av, borderRadius: av / 2, overflow: "hidden", opacity: clamp01(k / 6), background: r.colour ?? ["#7b5ea7", "#3f7f6e", "#b5523b", "#3b6fb5"][i % 4],
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.inter, fontWeight: 600, fontSize: 46, color: "#fff" }}>
                {r.avatar ? <Img src={asset(r.avatar)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : r.name.replace(/^@/, "").charAt(0).toUpperCase()}
              </div>
              <div style={{ position: "absolute", left: av + 28, top: 0, fontFamily: FONT.inter, opacity: clamp01(k / 6), whiteSpace: "nowrap", lineHeight: 1.25 }}>
                <span style={{ fontWeight: 600, fontSize: nFs, color: "#0f0f0f" }}>{r.name}</span>
                {r.meta ? <span style={{ fontWeight: 400, fontSize: mFs, color: "#5a5a5a", marginLeft: 18 }}>{r.meta}</span> : null}
              </div>
              {lines.map((ln, li) => {
                const ws = ln.split(" ");
                const w0 = wi; wi += ws.length;
                const lw = measure(ln, font);
                return (
                  <React.Fragment key={li}>
                    {mk > 0 ? <div style={{ position: "absolute", left: av + 18, top: ty + li * lh - 2, width: (lw + 20) * mk, height: lh + 2, background: RC.cavingRed, boxShadow: "0 0 10px 3px rgba(252,14,17,.6)" }} /> : null}
                    <div style={{ position: "absolute", left: av + 28, top: ty + li * lh, fontFamily: FONT.inter, fontWeight: 400, fontSize: tFs, lineHeight: `${lh}px`, color: mk > 0.5 ? "#fff" : "#111", whiteSpace: "nowrap" }}>
                      {ws.map((w, j) => <span key={j} style={{ opacity: ghost(k - 6 - 2 * (w0 + j)) }}>{w}{j < ws.length - 1 ? " " : ""}</span>)}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 78% at 50% 48%, rgba(0,0,0,0) 55%, rgba(30,30,34,.38) 100%)" }} />
      <TypedCaption lines={p.captions} cap={p.captionCap ?? 40} />
    </AbsoluteFill>
  );
};
