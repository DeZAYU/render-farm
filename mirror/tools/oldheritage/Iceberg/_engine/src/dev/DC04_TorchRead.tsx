// DC04 TorchRead: the filmer's real YouTube page (title, channel, his one-line description; capture_page.py) as a flat card standing in
// the dark over the soft, blacked-down night footage. The card is unlit except a soft torch-beam that finds the title first, then moves
// down to the description line and widens along it, which stays lit. No added text.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

type P = { x: number; y: number; rx: number; ry: number }; // card fractions
export const TorchRead: React.FC<{
  bg: string; bgFrom: number; card: string; cw: number; ch: number; width?: number;
  beam0: P; beam1: P; moveAt: number; moveLen: number; credit?: string;
}> = ({ bg, bgFrom, card, cw, ch, width = 1560, beam0, beam1, moveAt, moveLen }) => {
  const f = useCurrentFrame();
  const enter = out(interpolate(f, [0, 22], [0, 1], cl));
  const on = io(interpolate(f, [10, 34], [0, 1], cl));
  const m = io(interpolate(f, [moveAt, moveAt + moveLen], [0, 1], cl));
  const b = { x: beam0.x + (beam1.x - beam0.x) * m, y: beam0.y + (beam1.y - beam0.y) * m, rx: beam0.rx + (beam1.rx - beam0.rx) * m, ry: beam0.ry + (beam1.ry - beam0.ry) * m };
  // a little hand-held wander of the beam
  const wx = Math.sin(f / 23) * 0.006, wy = Math.cos(f / 31) * 0.01;
  const H = width * ch / cw;
  const s = 1 + 0.035 * io(Math.min(1, f / 300));
  const mask = `radial-gradient(ellipse ${b.rx * 100}% ${b.ry * 100}% at ${(b.x + wx) * 100}% ${(b.y + wy) * 100}%, #000 0%, rgba(0,0,0,.85) 45%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -60, width: 2040, height: 1200, objectFit: "cover", filter: "blur(14px) brightness(.35)" }} />
      <div style={{ position: "absolute", left: 960 - width / 2, top: 540 - H / 2 + 30 * (1 - enter), width, height: H, opacity: enter, transform: `scale(${s})`,
        boxShadow: "0 30px 80px rgba(0,0,0,.85)" }}>
        <Img src={staticFile(card)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "brightness(.22) contrast(1.05)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: on, WebkitMaskImage: mask, maskImage: mask }}>
          <Img src={staticFile(card)} style={{ width: "100%", height: "100%", filter: "sepia(.18) brightness(1.02)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
