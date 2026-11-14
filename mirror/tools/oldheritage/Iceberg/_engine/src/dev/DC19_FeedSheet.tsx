// DC19 FeedSheet: the real NWS Charleston Flood Warning (FLWRLX, 4:50 PM EDT Fri 12 May 2017, IEM archive capture) feeds up out of
// the dark like a printout over the soft, dim road footage, monospaced and sharp. Then, beat by beat on the VO, one passage at a time
// is lifted off the page toward camera at full brightness (issue time, Lincoln County, "up to one and one half inches of rain has
// already fallen") while the rest of the sheet sinks dim and the camera eases down to it. Source credited small. No red.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { ease, io, useDcFonts } from "./DC01_kit";

type Beat = { f: number; y0: number; y1: number };
export const FeedSheet: React.FC<{ bg: string; bgFrom: number; sheet: string; sw: number; sh: number; beats: Beat[]; credit: string }> = ({ bg, bgFrom, sheet, sw, sh, beats, credit }) => {
  useDcFonts();
  const f = useCurrentFrame();
  const W = 1000, sc = W / sw, H = sh * sc;
  const feed = io(Math.min(1, f / 34));
  // current beat (eased between beats over 16 f)
  let y0 = beats[0].y0, y1 = beats[0].y1, on = ease(f, beats[0].f, beats[0].f + 14);
  for (let i = 1; i < beats.length; i++) if (f >= beats[i].f) { const u = io(Math.min(1, (f - beats[i].f) / 16)); y0 = beats[i - 1].y0 + (beats[i].y0 - beats[i - 1].y0) * u; y1 = beats[i - 1].y1 + (beats[i].y1 - beats[i - 1].y1) * u; }
  const cy = ((y0 + y1) / 2) * sc;
  const camY = 540 - Math.min(Math.max(cy, 300), H - 300);
  const top = 1080 * (1 - feed) + camY * feed + (1 - feed) * 0;
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} playbackRate={0.5} muted style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", filter: "blur(16px) brightness(.3) saturate(.5)" }} />
      <div style={{ position: "absolute", left: 960 - W / 2, top, width: W, height: H, boxShadow: "0 30px 90px rgba(0,0,0,.8)" }}>
        <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: `brightness(${1 - 0.6 * on})` }} />
        <div style={{ position: "absolute", left: -W * 0.02, width: W * 1.04, top: y0 * sc - 4, height: (y1 - y0) * sc + 8, overflow: "hidden", opacity: on,
          transform: `scale(${1 + 0.05 * on})`, transformOrigin: "50% 50%", boxShadow: `0 ${14 * on}px ${40 * on}px rgba(0,0,0,.6)`, background: "#F6F6F2" }}>
          <Img src={staticFile(sheet)} style={{ position: "absolute", left: W * 0.02, top: -y0 * sc + 4, width: W, height: H }} />
        </div>
        <div style={{ position: "absolute", right: 0, top: H + 14, fontFamily: "Elite", fontSize: 22, color: "rgba(240,238,232,.65)" }}>{credit}</div>
      </div>
    </AbsoluteFill>
  );
};
