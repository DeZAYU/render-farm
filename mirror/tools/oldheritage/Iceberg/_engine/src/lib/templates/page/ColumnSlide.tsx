// page / ColumnSlide: the article re-laid as a T-layout. The article's OWN photo sits as a locked plate on the left (linear life push only,
// Farrell photos never pan), the text column slides up beside it (quick start / long settle) and keeps a slow constant read-scroll
// (Farrell MV4 4.3-6.3 % H/s), and the date is typed on the photo in the Dashcam label recipe (white words + red key word) on its word.
// REF Farrell text T-layout (photo + column side by side; FA text / evidence A1 locked photos, B1 linear page drift, MV4 slow scroll GM 6:14)
// + D1 E4 typed time @2:27.5 (Varela Round recipe). Optional DD red bars in the column.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, MBlur, RC, RoundText, asset, clamp01, lerp, type Rect } from "../../core";
import { markBars, WhiteInk, type Mark, type PageSrc } from "./shared";

export type ColumnSlideProps = PageSrc & {
  /** words inside the red bars: "page" (default, DD original: black on red) | "white" (re-inked white, M-024 contrast) */
  ink?: "page" | "white";
  photo: Rect; // CSS rect of the article's photo inside the capture
  column: [number, number, number, number]; // CSS [x0, y0, x1, y1] of the text column
  slideAt?: number; // frame the column starts rising (default 6)
  scroll?: number; // constant read-scroll after it settles, screen px/s (default 52 = 4.8 % H/s)
  date?: { white: string; red?: string; at: number; cpf?: number }; // typed on the photo (chars per frame, default 0.5)
  marks?: Mark[]; // optional red bars in the column
  labelCap?: number; // typed date cap (default 52)
};
const PH = { x: 96, y: 150, w: 720, h: 780 }; // photo plate
const COL = { x: 880, w: 960, top: 120, bot: 960 }; // column window
const Inner: React.FC<ColumnSlideProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const [cx0, cy0, cx1, cy1] = p.column;
  const cs = COL.w / (cx1 - cx0);
  const sa = p.slideAt ?? 6;
  const rise = EZ.quick((f - sa) / 30);
  const y = lerp(1180, COL.top + 20, rise) - (p.scroll ?? 52) * Math.max(0, (f - sa - 30) / 30);
  // photo: cover the plate with the photo rect, locked + linear push
  const [rx, ry, rw, rh] = p.photo;
  const ps = Math.max(PH.w / rw, PH.h / rh) * (1 + 0.007 * t);
  const pox = PH.w / 2 - (rx + rw / 2) * ps, poy = PH.h / 2 - (ry + rh / 2) * ps;
  const bars = markBars(f, p.marks, { ink: p.ink, c: RC.pageRed, perLine: 18, px: 3, py: 3, radius: 0 });
  const mask = `linear-gradient(to bottom, transparent ${COL.top - 40}px, #000 ${COL.top + 50}px, #000 ${COL.bot - 60}px, transparent ${COL.bot + 40}px)`;
  const d = p.date;
  const typed = (s: string, from: number) => s.slice(0, Math.max(0, Math.floor((f - from) * (d?.cpf ?? 0.5)) + 1));
  const wTxt = d && f >= d.at ? typed(d.white, d.at) : "";
  const rAt = d ? d.at + d.white.length / (d.cpf ?? 0.5) : 0;
  const rTxt = d?.red && f >= rAt ? typed(d.red, rAt) : "";
  return (
    <AbsoluteFill style={{ background: "#E4E3DF" }}>
      {/* the article's photo, locked plate */}
      <div style={{ position: "absolute", left: PH.x, top: PH.y, width: PH.w, height: PH.h, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.35)", opacity: clamp01(f / 4 + 0.4) }}>
        <Img src={asset(p.src)} style={{ position: "absolute", left: pox, top: poy, width: p.cssW * ps, height: p.cssH * ps }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.72))" }} />
        {wTxt ? (
          <div style={{ position: "absolute", left: 40, bottom: 44, display: "flex", alignItems: "flex-end", gap: 16, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }}>
            <RoundText text={wTxt} cap={p.labelCap ?? 52} colour="#FDFDFD" />
            {rTxt ? <div style={{ filter: "drop-shadow(0 0 6px rgba(242,37,34,.7))" }}><RoundText text={rTxt} cap={p.labelCap ?? 52} colour={RC.labelRed} /></div> : null}
          </div>
        ) : null}
      </div>
      {/* the text column (the page itself, multiplied on the paper) */}
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
        <div style={{ position: "absolute", left: COL.x, top: y, width: COL.w, height: (cy1 - cy0) * cs, overflow: "hidden", isolation: "isolate", background: "#FFFFFF", boxShadow: "0 0 0 28px #FFFFFF" }}>
          <div style={{ position: "absolute", left: -cx0 * cs, top: -cy0 * cs, width: p.cssW, height: p.cssH, transformOrigin: "0 0", transform: `scale(${cs})` }}>
            {bars.filter((b) => b.p > 0).map((b, i) => (
              <div key={i} style={{ position: "absolute", left: b.r[0] - 3, top: b.r[1] - 3, width: (b.r[2] + 6) * b.p, height: b.r[3] + 6, background: b.c }} />
            ))}
            <Img src={asset(p.src)} style={{ position: "absolute", left: 0, top: 0, width: p.cssW, height: p.cssH, mixBlendMode: "multiply" }} />
            {p.ink === "white" ? <WhiteInk bars={bars} src={p.src} cssW={p.cssW} cssH={p.cssH} ix={0} iy={0} /> : null}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 78% at 50% 50%, rgba(0,0,0,0) 52%, rgba(20,16,14,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
export const ColumnSlide: React.FC<ColumnSlideProps> = (p) => {
  const f = useCurrentFrame();
  const sa = p.slideAt ?? 6;
  return <MBlur on={f > sa + 1 && f < sa + 12}><Inner {...p} /></MBlur>;
};
