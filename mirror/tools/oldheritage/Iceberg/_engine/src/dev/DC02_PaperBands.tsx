// DC02 PaperBands: the slow replay keeps the frame; two narrow bands cut from the REAL news page (capture_page.py) slide in over its
// lower part like strips of newsprint laid on the picture: first the headline band (with the outlet's name small), then the band
// with the key sentence, which settles in front; a soft light passes once along that sentence and the headline band dims back.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out, useDcFonts } from "./DC01_kit";

type Band = { y0: number; y1: number; x0?: number; x1?: number };
export const PaperBands: React.FC<{
  children: React.ReactNode;                     // the footage underneath (kept full frame)
  page: string; pw: number; ph: number;           // page crop and its pixel size
  head: Band; kb: Band; credit: string;
  headAt: number; keyAt: number; sweepAt: number; outAt: number; width?: number;
}> = ({ children, page, pw, head, kb, credit, headAt, keyAt, sweepAt, outAt, width = 1240 }) => {
  useDcFonts();
  const f = useCurrentFrame();
  const sc = width / pw;
  const leave = io(interpolate(f, [outAt, outAt + 14], [0, 1], cl));
  const band = (b: Band, at: number, top: number, z: number, dimTo: number, dimAt: number, from: number, sweep?: number) => {
    const x0 = b.x0 ?? 0, x1 = b.x1 ?? pw;
    const k = out(interpolate(f, [at, at + 16], [0, 1], cl));
    const dim = interpolate(f, [dimAt, dimAt + 18], [1, dimTo], cl);
    const w = (x1 - x0) * sc, h = (b.y1 - b.y0) * sc;
    const sw = sweep === undefined ? -1 : interpolate(f, [sweep, sweep + 40], [-0.3, 1.3], cl);
    return (
      <div style={{ position: "absolute", left: 960 - w / 2 + from * (1 - k) - 260 * leave, top, width: w + 36, height: h + 26, padding: "13px 18px",
        background: "#f4f1ea", opacity: k * (1 - leave), transform: `perspective(1600px) rotateX(${6 * (1 - k)}deg) rotateZ(${z}deg) scale(${0.985 + 0.015 * k})`,
        boxShadow: "0 16px 40px rgba(0,0,0,.55)", filter: `brightness(${dim})`, overflow: "hidden" }}>
        <div style={{ width: w, height: h, overflow: "hidden", position: "relative" }}>
          <Img src={staticFile(page)} style={{ position: "absolute", left: -x0 * sc, top: -b.y0 * sc, width: pw * sc }} />
          {sw > -1 && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(100deg, rgba(255,255,255,0) ${(sw - 0.18) * 100}%, rgba(255,246,220,.55) ${sw * 100}%, rgba(255,255,255,0) ${(sw + 0.18) * 100}%)`, mixBlendMode: "multiply" }} />}
        </div>
      </div>
    );
  };
  const hh = (head.y1 - head.y0) * sc;
  const veil = interpolate(f, [headAt, headAt + 16], [0, 1], cl) * (1 - leave);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {children}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,.62) 100%)", opacity: veil }} />
      {band(head, headAt, 600, -1.2, 0.62, keyAt + 6, -120)}
      {band(kb, keyAt, 600 + hh + 44, 0.6, 1, 99999, 120, sweepAt)}
      <div style={{ position: "absolute", right: 120, top: 560, fontFamily: "ArchivoBlk", fontWeight: 800, fontSize: 22, letterSpacing: 2, color: "rgba(255,255,255,.8)",
        opacity: veil, textShadow: "0 2px 6px rgba(0,0,0,.8)" }}>{credit}</div>
    </AbsoluteFill>
  );
};
