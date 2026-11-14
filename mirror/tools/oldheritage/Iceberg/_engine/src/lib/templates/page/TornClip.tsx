// page / TornClip: the headline TORN OUT of the article as a newspaper clipping on a black plate. The clipping arrives oversize and
// settles (VV §5 pull-back x1.2 -> 1 with the print's rotation drift), the page turns to newsprint (warm paper, slightly desaturated ink),
// then on the spoken figure the camera punches in on it (D1 E6 punch bezier) and keeps a slow life push; optional red ink on the figure.
// REF Visual Venture torn print / photo card @1:29.3 (VV §5: oversize -> settle, rotation drift, torn edge; V4_BRIEF photo-card list),
// applied to a page; D1 E6 punch-in @3:03.0 for the push. wp3 sec_C ChuCard @ abs 5903 (torn-print motion).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, MBlur, RC, asset, clamp01, lerp, lerpLog } from "../../core";
import { Specks, TornPrint } from "../../core/kits/photo";
import { markBars, type Mark, type PageSrc } from "./shared";

export type TornClipProps = PageSrc & {
  crop: [number, number, number, number]; // CSS [x0, y0, x1, y1] of the torn-out part (headline +/- the figure)
  width?: number; // clipping width on screen at rest (px, default 1500)
  focus?: { cx: number; cy: number; s: number; at: number; d?: number }; // CSS point to punch in on (the figure), zoom, start, duration
  ink?: Mark[]; // optional red ink on the figure's glyphs (CSS px)
  paper?: string; // newsprint tone (default #E9E5DA)
  seed?: number; // tear shape
};
const Inner: React.FC<TornClipProps> = (p) => {
  const f = useCurrentFrame();
  const k = Math.max(0, f), t = k / 30;
  const [x0, y0, x1, y1] = p.crop;
  const w = p.width ?? 1500, sc = w / (x1 - x0), h = (y1 - y0) * sc;
  const u = clamp01(k / 66);
  const recess = lerp(1.2, 1, EZ.photoPull(u));
  const rot = lerp(-4.2, -1.6, EZ.photoRot(u)) + 0.12 * t;
  const dy = lerp(-36, 0, EZ.photoY(u));
  const fo = p.focus;
  const pu = fo ? EZ.punch((f - fo.at) / (fo.d ?? 24)) : 0;
  const after = fo ? Math.max(0, f - fo.at) / 30 : 0;
  const Z = recess * (1 + 0.006 * t) * (fo ? lerpLog(1, fo.s, pu) * (1 + 0.012 * after) : 1);
  const px = fo ? lerp(w / 2, (fo.cx - x0) * sc, pu) : w / 2, py = fo ? lerp(h / 2, (fo.cy - y0) * sc, pu) : h / 2;
  const bars = markBars(f, p.ink, { c: RC.inkRed, mode: "ink", perLine: 10, px: 0, py: 1 });
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 60% at 50% 48%, #1b1918 0%, #050505 100%)" }} />
      <Specks k={k} n={30} seed={9} max={0.22} />
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px, ${(540 + dy).toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${Z.toFixed(4)}) translate(${-px}px, ${-py}px)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, filter: "drop-shadow(0 26px 40px rgba(0,0,0,.7))" }}>
          <TornPrint w={w} h={h} seed={p.seed ?? 6} paper={p.paper ?? "#E9E5DA"} fringe={0}>
            <div style={{ position: "absolute", inset: 0, background: p.paper ?? "#E9E5DA", isolation: "isolate" }}>
              <div style={{ position: "absolute", left: -x0 * sc, top: -y0 * sc, width: p.cssW, height: p.cssH, transformOrigin: "0 0", transform: `scale(${sc})` }}>
                <Img src={asset(p.src)} style={{ position: "absolute", left: 0, top: 0, width: p.cssW, height: p.cssH, mixBlendMode: "multiply", filter: "grayscale(.7) contrast(1.12) sepia(.12)" }} />
                {bars.filter((b) => b.p > 0).map((b, i) => (
                  <div key={i} style={{ position: "absolute", left: b.r[0], top: b.r[1] - 1, width: b.r[2] * b.p, height: b.r[3] + 2, background: b.c, mixBlendMode: "lighten" }} />
                ))}
              </div>
              {/* paper tooth: a faint print grain over the clipping */}
              <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 90% at 40% 40%, rgba(255,255,255,.18), rgba(120,100,70,.10))", mixBlendMode: "multiply" }} />
            </div>
          </TornPrint>
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
export const TornClip: React.FC<TornClipProps> = (p) => {
  const f = useCurrentFrame();
  const fo = p.focus;
  const fast = (f >= 0 && f < 8) || (!!fo && f > fo.at + 2 && f < fo.at + (fo.d ?? 24) * 0.6);
  return <MBlur on={fast}><Inner {...p} /></MBlur>;
};
