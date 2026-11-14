// quote / PageLift: a quote lifted out of a real article page, with the speaker attribution. REF: DD D1 E9 red page bar (Dashcam Vol.1 @ 4:15.8
// Guardian, red bar under the read line) on a DD D3 E4 tilted print (Dashcam Vol.3 @ 0:07.6, roll ~2 deg, slow push) + Farrell evidence B4/R9
// UI lift-out (OnlyFans @ 4:29.5: the page blurs 0 -> 12 px and drops -1 EV in 16 f ease-out while the card rises ~3.5 % H, scales x1.08 and
// settles 3.4 deg clockwise, then drifts 0.3 %/s) + Farrell A8 name words in sync. The lifted strip is the page's own crop (the page's own
// typography, FONTS.md rule), red bars included. Our version: the strip travels to a readable size (Farrell box x .175-.831), the camera
// never stops, attribution word by word under the strip.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, FONT, H, PagePlane, RC, W, asset, clamp01, fs, lerp, type PageBar, type Rect } from "../../core";
import type { Word } from "../photo/shared";

export type PageLiftProps = {
  page: { src: string; cssW: number; cssH: number }; // captured page (PNG at 2x DPR), CSS px
  quote: Rect[]; // the quote's line rects (CSS px), in reading order
  strip?: [number, number, number, number]; // crop to lift [x, y, w, h] css (default: quote rects' union, padded)
  barAt?: number; // first red bar starts (DD: 0.3-0.5 s before the words)
  lineDur?: number; // frames per line of red bar
  /** words inside the red bars: "white" (default: re-inked white over the red, M-024 contrast) or "page" (DD original: black text multiplied on red) */
  ink?: "page" | "white";
  liftAt?: number;
  speaker?: Word[]; // e.g. [{text:"—", at}, {text:"Name", at}, {text:"Surname", at}]
  role?: string; // small grey line under the name
  cam?: { cx?: number; cy?: number; s?: number; rot?: number }; // page camera before the lift
  targetW?: number; // strip width on screen after the lift
  cap?: number; // speaker name cap
  subCap?: number; // role line cap
  barColour?: string; // quote bar colour (default DD page red; per-video identity accent, e.g. MIDWAY magenta)
};

export const PageLift: React.FC<PageLiftProps> = ({ page, quote, strip, barAt = 8, lineDur = 18, liftAt = 50, speaker = [], role, cam = {}, targetW = 1700, cap = 34, subCap = 28, ink = "white", barColour }) => {
  const k = useCurrentFrame();
  const ux0 = Math.min(...quote.map((r) => r[0])), uy0 = Math.min(...quote.map((r) => r[1]));
  const ux1 = Math.max(...quote.map((r) => r[0] + r[2])), uy1 = Math.max(...quote.map((r) => r[1] + r[3]));
  const [sx, sy, sw, sh] = strip ?? [ux0 - 18, uy0 - 14, ux1 - ux0 + 36, uy1 - uy0 + 28];
  const rot0 = (cam.rot ?? -1.6) - 0.1 * (k / 30);
  const s0 = cam.s ?? 2.0, s = s0 * (1 + 0.011 * (k / 30));
  const cx = cam.cx ?? Math.max(sx + sw / 2, W / (2 * s0) + 12), cy = (cam.cy ?? sy + sh / 2) + 6 * (k / 30);
  const bars: PageBar[] = quote.map((r, i) => ({ r, p: clamp01((k - barAt - i * lineDur) / lineDur), c: barColour ?? RC.pageRed, px: 4, py: 3, mode: ink === "white" ? "white" : "bar" }));
  const lk = k - liftAt;
  const lu = lk < 0 ? 0 : EZ.quick(lk / 20);
  const bk = lk < 0 ? 0 : EZ.out2(lk / 16);
  // strip: page position -> target
  const a = (rot0 * Math.PI) / 180;
  const px = sx + sw / 2 - cx, py = sy + sh / 2 - cy;
  const p0 = { x: W / 2 + s * (px * Math.cos(a) - py * Math.sin(a)), y: H / 2 + s * (px * Math.sin(a) + py * Math.cos(a)) };
  const sT = (targetW / sw) * (1 + 0.003 * (Math.max(0, lk - 20) / 30));
  const p1 = { x: W / 2, y: 0.43 * H };
  const sc = lerp(s, sT, lu);
  const rr = rot0 + 3.4 * EZ.out3((lk - 10) / 14);
  const fN = fs("inter", cap);
  const nameY = p1.y + (sh * sT) / 2 + 44;
  return (
    <AbsoluteFill style={{ background: "#141212" }}>
      <AbsoluteFill style={{ filter: bk > 0 ? `blur(${(12 * bk).toFixed(2)}px) brightness(${(1 - 0.5 * bk).toFixed(3)})` : undefined }}>
        <PagePlane src={page.src} cssW={page.cssW} cssH={page.cssH} cx={cx} cy={cy} s={s} rot={rot0} bars={bars} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,.6) 100%)" }} />
      </AbsoluteFill>
      {bk > 0 ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 65% at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,${(0.55 * bk).toFixed(3)}) 100%)` }} /> : null}
      {lk >= 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: sw, height: sh, transformOrigin: "50% 50%", background: "#fff", overflow: "hidden", isolation: "isolate",
          transform: `translate(${(lerp(p0.x, p1.x, lu) - sw / 2).toFixed(2)}px, ${(lerp(p0.y, p1.y, lu) - sh / 2).toFixed(2)}px) rotate(${rr.toFixed(3)}deg) scale(${sc.toFixed(5)})`,
          boxShadow: `0 ${(14 * lu).toFixed(1)}px ${(30 * lu).toFixed(1)}px rgba(0,0,0,${(0.7 * lu).toFixed(3)})` }}>
          {quote.map((r, i) => <div key={i} style={{ position: "absolute", left: r[0] - sx - 4, top: r[1] - sy - 3, width: (r[2] + 8) * bars[i].p, height: r[3] + 6, background: barColour ?? RC.pageRed, borderRadius: 3 }} />)}
          <Img src={asset(page.src)} style={{ position: "absolute", left: -sx, top: -sy, width: page.cssW, height: page.cssH, mixBlendMode: "multiply" }} />
          {ink === "white" ? quote.map((r, i) => {
            const L = r[0] - sx - 4, T = r[1] - sy - 3;
            return bars[i].p > 0 ? (
              <div key={`w${i}`} style={{ position: "absolute", left: L, top: T, width: (r[2] + 8) * bars[i].p, height: r[3] + 6, overflow: "hidden", mixBlendMode: "screen" }}>
                <Img src={asset(page.src)} style={{ position: "absolute", left: -sx - L, top: -sy - T, width: page.cssW, height: page.cssH, filter: "grayscale(1) invert(1) contrast(1.6)" }} />
              </div>
            ) : null;
          }) : null}
        </div>
      ) : null}
      {speaker.length ? (
        <div style={{ position: "absolute", left: 0, width: W, top: nameY, textAlign: "center", whiteSpace: "pre", fontFamily: FONT.inter, fontWeight: 700, fontSize: fN, color: "#F4F4F2", textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>
          {speaker.map((w, i) => <span key={i} style={{ opacity: k >= w.at ? 1 : 0 }}>{w.text}{i < speaker.length - 1 ? " " : ""}</span>)}
          {role ? <div style={{ fontWeight: 400, fontSize: fs("inter", subCap), color: "#B9B9B6", marginTop: 8, opacity: clamp01((k - speaker[speaker.length - 1].at - 4) / 8) }}>{role}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
