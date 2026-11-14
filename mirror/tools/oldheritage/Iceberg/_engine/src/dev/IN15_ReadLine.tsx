// IN15 ReadLine: the real Global News story (16 Jun 2014: masthead, headline, byline, then the wildlife specialist's paragraphs) as one
// sheet laid slightly back in 3-D over the dim trail footage. The page reads itself: the camera scrolls down it, everything sits dimmed, and
// each paragraph comes up to full brightness exactly as the VO says it (the reading line), then settles back a little as the next one lights.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, cl, out, type CK } from "./DC01_kit";

export const ReadLine: React.FC<{
  bg: string; bgFrom: number; sheet: string; sw: number; sh: number; keys: CK[]; lines: { box: [number, number, number, number]; at: number }[]; headAt?: number;
}> = ({ bg, bgFrom, sheet, sw, sh, keys, lines, headAt = 0 }) => {
  const f = useCurrentFrame();
  const c = camAt(f, keys); // s = scale of the sheet (1 = 1300 px wide), y = sheet row (0..1) at frame centre
  const W = 1300 * c.s, s = W / sw, H = sh * s;
  const left = 960 - c.x * W, top = 540 - c.y * H;
  const k = out(interpolate(f, [0, 20], [0, 1], cl));
  const dimHead = interpolate(f, [headAt, headAt + 14], [0, 0.45], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -50, width: 2020, height: 1180, objectFit: "cover", filter: "blur(16px) brightness(.34) saturate(.7)" }} />
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left, top, width: W, height: H, opacity: k, transform: `rotateX(${14 - 6 * k}deg) translateY(${(1 - k) * 80}px)`,
          transformOrigin: `50% ${c.y * H}px`, background: "#fff", boxShadow: "0 30px 90px rgba(0,0,0,.75)" }}>
          <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: W, height: lines[0].box[1] * s - 20, background: "#000", opacity: dimHead }} />
          {lines.map((l, i) => {
            const on = interpolate(f, [l.at, l.at + 12], [0, 1], cl);
            const next = lines[i + 1] ? interpolate(f, [lines[i + 1].at, lines[i + 1].at + 12], [0, 1], cl) : 0;
            const d = 0.5 - 0.5 * on + 0.22 * next;
            const end = lines[i + 1] ? lines[i + 1].box[1] : sh;
            return <div key={i} style={{ position: "absolute", left: 0, top: l.box[1] * s - 14, width: W, height: (end - l.box[1]) * s, background: "#000", opacity: d }} />;
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
