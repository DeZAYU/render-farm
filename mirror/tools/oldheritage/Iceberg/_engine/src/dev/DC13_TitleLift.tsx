// DC13 TitleLift: the filmer's real YouTube page (captured 13 Nov 2026: title, channel, views, his own description) as a lit card
// standing in 3-D over the dim, softly blurred clip. The card turns to face us; on "title" the title strip slides forward off the card
// toward camera; on "half a million" the title settles back and the "488k views" line lifts forward instead. Rest of the card dims
// while a line is up. No added text, no red.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

type R = [number, number, number, number]; // x0 y0 x1 y1 in card pixels
export const TitleLift: React.FC<{
  card: string; cw: number; ch: number; bg: string; bgFrom: number; title: R; views: R; titleAt: number; viewsAt: number; dur: number;
}> = ({ card, cw, ch, bg, bgFrom, title, views, titleAt, viewsAt, dur }) => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  const sc = 1500 / cw; // card width on screen
  const turn = out(interpolate(f, [0, 34], [0, 1], cl));
  const ry = -18 * (1 - turn) - 4 * io(f / dur), rx = 9 * (1 - turn) + 3;
  const z = interpolate(f, [0, dur], [0, 60], cl);
  const tUp = out(interpolate(f, [titleAt, titleAt + 20], [0, 1], cl)) * (1 - io(interpolate(f, [viewsAt - 4, viewsAt + 14], [0, 1], cl)));
  const vUp = out(interpolate(f, [viewsAt, viewsAt + 20], [0, 1], cl));
  const dim = Math.max(tUp, vUp);
  const strip = (r: R, k: number, key: string) => {
    const w = (r[2] - r[0]) * sc, h = (r[3] - r[1]) * sc;
    return (
      <div key={key} style={{ position: "absolute", left: r[0] * sc, top: r[1] * sc, width: w, height: h, overflow: "hidden", opacity: k > 0.002 ? 1 : 0,
        transform: `translateZ(${110 * k}px) scale(${1 + 0.06 * k})`, transformOrigin: "0% 50%", background: key === "v" ? "#f2f2f2" : "#fff",
        boxShadow: `0 ${16 * k}px ${40 * k}px rgba(0,0,0,${0.55 * k})`, borderRadius: key === "v" ? 0 : 2 }}>
        <Img src={staticFile(card)} style={{ position: "absolute", left: -r[0] * sc, top: -r[1] * sc, width: cw * sc, height: ch * sc }} />
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(0.45)", transform: "scale(1.08)" }} />
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: (W - cw * sc) / 2, top: (H - ch * sc) / 2 - 20, width: cw * sc, height: ch * sc,
          transformStyle: "preserve-3d", transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`, opacity: interpolate(f, [0, 10], [0, 1], cl) }}>
          <div style={{ position: "absolute", inset: -26 * sc, background: "#fff", borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,.6)" }} />
          <Img src={staticFile(card)} style={{ position: "absolute", left: 0, top: 0, width: cw * sc, height: ch * sc }} />
          <div style={{ position: "absolute", inset: -26 * sc, background: "#000", opacity: 0.55 * dim, borderRadius: 10 }} />
          {strip(title, tUp, "t")}
          {strip(views, vUp, "v")}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
