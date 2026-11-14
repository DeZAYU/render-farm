// DC03 TwoDates: the real Wikipedia table row of the OTHER attack (capture_page.py) as a white sheet over the dark, soft-blurred truck
// footage; the view eases from the row's date cell to the account of the attack, those lines stay lit while the rest of the row sinks;
// then the sheet slides left and this camera's own burned-in stamp (frozen frame of the empty road, white frame) slides in on the right,
// so the two real dates sit side by side. No added text.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

type Box = [number, number, number, number];
export const TwoDates: React.FC<{
  bg: string; bgFrom: number; row: string; rw: number; rh: number; dateCell: Box; keyLines: Box;
  stampSrc: string; stampT: number; stampBox: Box; // stamp region in the 1280x720 source
  panAt: number; dimAt: number; splitAt: number;
}> = ({ bg, bgFrom, row, rw, rh, dateCell, keyLines, stampSrc, stampT, stampBox, panAt, dimAt, splitAt }) => {
  const f = useCurrentFrame();
  const enter = out(interpolate(f, [0, 18], [0, 1], cl));
  const pan = io(interpolate(f, [panAt, panAt + 60], [0, 1], cl));
  const dim = io(interpolate(f, [dimAt, dimAt + 20], [0, 1], cl));
  const sp = io(interpolate(f, [splitAt, splitAt + 26], [0, 1], cl));
  // sheet camera: scale + focus point (row px), from the date cell to the key lines, then back out to the whole row at the split
  const c = (b: Box) => [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
  const [dx, dy] = c(dateCell), [kx, ky] = c(keyLines);
  const s0 = 1.9, s1 = 1.75, s2 = 1.3;
  let s = s0 + (s1 - s0) * pan, fx = dx + (kx - dx) * pan, fy = dy + (ky - dy) * pan;
  s = s + (s2 - s) * sp; fx = fx + (215 - fx) * sp; fy = fy + (dy - fy) * sp;
  const cx = 960 - 520 * sp, cy = 540;
  const left = cx - fx * s, top = cy - fy * s;
  const kb = { x: keyLines[0] * s + left, y: keyLines[1] * s + top, w: (keyLines[2] - keyLines[0]) * s, h: (keyLines[3] - keyLines[1]) * s };
  const PW = 820, sc = PW / (stampBox[2] - stampBox[0]), PH = (stampBox[3] - stampBox[1]) * sc;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -60, width: 2040, height: 1200, objectFit: "cover", filter: "blur(16px) brightness(.4)" }} />
      <div style={{ position: "absolute", left, top, width: rw * s, height: rh * s, opacity: enter, boxShadow: "0 24px 70px rgba(0,0,0,.7)",
        transform: `perspective(2000px) rotateY(${6 * (1 - sp)}deg) translateY(${30 * (1 - enter)}px)`, transformOrigin: "50% 50%",
        clipPath: `inset(0 ${((rw - 430) / rw) * 100 * sp}% 0 0)` }}>
        <Img src={staticFile(row)} style={{ width: "100%", height: "100%" }} />
        {/* everything but the key lines sinks back */}
        <svg width={rw * s} height={rh * s} style={{ position: "absolute", inset: 0, opacity: 0.55 * dim * (1 - sp) }}>
          <defs><mask id="td_m"><rect width="100%" height="100%" fill="#fff" /><rect x={kb.x - left - 10} y={kb.y - top - 6} width={kb.w + 20} height={kb.h + 12} fill="#000" /></mask></defs>
          <rect width="100%" height="100%" fill="#0b0d12" mask="url(#td_m)" />
        </svg>
      </div>
      {/* the camera's own stamp */}
      <div style={{ position: "absolute", left: 1920 - 80 - PW + 900 * (1 - sp), top: 540 - PH / 2, width: PW, height: PH, border: "5px solid #fff", overflow: "hidden", opacity: sp,
        boxShadow: "0 18px 50px rgba(0,0,0,.7)", background: "#000" }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(stampSrc)} startFrom={Math.round(stampT * 30)} muted
          style={{ position: "absolute", left: -stampBox[0] * sc, top: -stampBox[1] * sc, width: 1280 * sc, height: 720 * sc }} /></Freeze>
      </div>
    </AbsoluteFill>
  );
};
