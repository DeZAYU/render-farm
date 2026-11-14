// AM level entry (Amusement Parks Iceberg, one piece for all five levels): the photoreal ice3 berg (tip above the water, the skull of
// ice below) charted into five bands by four white level lines, every case name of the video typed small in its band. On the level
// call the camera eases down onto level N's band, the other bands sink into the dark, the level line under the band lights up (a white
// glow with one light sweep along it) and "LEVEL N" types ON that line in the channel's typewriter face, the gap in the line opening
// round it, with the level's name in a red box under it. The band's names type in on the VO's description line; names deeper than the
// level stay frosted (not reached yet), shallower ones dim (already passed). Last beat: the first case of the level is ruled white, the
// camera pushes into its name (a thin white rule, no red: owner 13 Nov, red only on the one phrase that matters) and the frame dips to black for the case's own title card.
// Props: n (1-5) + name; `at` = frames for the level call / the names / the mark (defaults fit a ~6 s level line); `mark` = index of the
// case in the level to push into (default 0). Length = the Sequence it is placed in (>= 150 f).
import React from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";
import { AM_BARS, AM_LEVELS } from "./AM_levels";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const ease = (f: number, a: number, b: number, e = io) => e(interpolate(f, [a, b], [0, 1], cl));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

let fontP: Promise<void> | null = null;
export const useAmFonts = () => {
  const [h] = React.useState(() => delayRender("AM level fonts"));
  React.useEffect(() => {
    if (!fontP) fontP = Promise.all([
      new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load(),
      new FontFace("ArchivoBlk", `url(${staticFile("fonts/Archivo-wdth-wght.ttf")})`, { weight: "100 900", stretch: "62% 125%" }).load(),
    ]).then((fs) => { fs.forEach((f) => document.fonts.add(f)); });
    fontP.then(() => continueRender(h));
  }, [h]);
};

const W = 1920, H = 1080, YS = [0, ...AM_BARS, 1].map((y) => y * H);
const band = (k: number) => ({ top: YS[k], bot: YS[k + 1], mid: (YS[k] + YS[k + 1]) / 2, h: YS[k + 1] - YS[k] });
const NAME_PX = 28, COL = 260; // names: Elite 28 px, two columns 260 px either side of the berg's centre line (clear of the tip)

/** names of band k: two columns (left right-aligned, right left-aligned), rows spread over the band, an odd last name centred */
const placed = (k: number) => {
  const b = band(k), cs = AM_LEVELS[k].cases, rows = Math.ceil(cs.length / 2);
  return cs.map((c, i) => {
    const row = Math.floor(i / 2), lonely = cs.length === 1;
    const y = b.top + b.h * (rows === 1 ? 0.5 : 0.2 + (0.66 * row) / (rows - 1));
    const side = lonely ? 0 : i % 2 === 0 ? -1 : 1;
    return { text: c.toUpperCase(), y, side, i };
  });
};

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.22, pointerEvents: "none" }}>
    <svg width={W} height={H}><filter id={`gam${f % 8}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 8} /><feColorMatrix type="saturate" values="0" /></filter><rect width={W} height={H} filter={`url(#gam${f % 8})`} opacity={0.5} /></svg>
  </AbsoluteFill>
);

export const LevelEntry: React.FC<{ n: number; name: string; mark?: number; at?: { level?: number; names?: number; mark?: number } }> = ({ n, name, mark = 0, at = {} }) => {
  useAmFonts();
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const k = n - 1, b = band(k);
  const A = at.level ?? 18, N = at.names ?? A + 42, M = at.mark ?? dur - 45;
  // camera: wide berg (slow drift) -> eased dive onto the band (no overshoot, 1.4 s) -> slow drift -> push into the marked name
  const sBand = 1.15, hh = H / 2 / sBand;
  const cyBand = Math.min(H - hh, Math.max(hh, b.mid));
  const dive = ease(f, A + 2, A + 44);
  const pl = placed(k), tgt = pl[Math.min(mark, pl.length - 1)];
  const tw = tgt.text.length * NAME_PX * 0.56; // Elite caps ~0.56 em
  const tx = tgt.side === 0 ? W / 2 : W / 2 + tgt.side * (COL + tw / 2);
  const push = ease(f, M + 10, dur - 2, Easing.bezier(0.5, 0, 0.75, 0.6));
  let s = lerp(1.0 + 0.012 * ease(f, 0, A + 2), sBand, dive) * (1 + 0.02 * ease(f, A + 44, M + 10, (x) => x));
  let cx = W / 2, cy = lerp(H / 2, cyBand, dive);
  s = s * lerp(1, 1.9, push); cx = lerp(cx, tx, push); cy = lerp(cy, tgt.y, push);
  const fadeIn = ease(f, 0, 14), toBlack = ease(f, dur - 9, dur - 1);
  const dim = ease(f, A + 4, A + 30);                 // other bands sink
  const lit = ease(f, A, A + 12, out);                // the level line lights
  const sweep = interpolate(f, [A + 6, A + 40], [-0.15, 1.15], cl);
  const label = `LEVEL ${n}`, typed = label.slice(0, Math.max(0, Math.min(label.length, Math.floor((f - A) / 2) + 1)));
  const gap = ease(f, A - 2, A + 12, out) * 230;      // the line opens round the typed level
  const lineY = k === 4 ? b.top : b.bot;             // the level's line: the bar under its band (level 5: the bar above it)
  const boxW = ease(f, A + 16, A + 26, out);
  const blur = push * push * 5;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: fadeIn * (1 - toBlack), filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", willChange: "transform",
          transform: `translate(960px,540px) scale(${s.toFixed(5)}) translate(${(-cx).toFixed(2)}px,${(-cy).toFixed(2)}px)` }}>
          <Img src={staticFile("ice3/wide.jpg")} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, filter: "brightness(.78) contrast(1.06)" }} />
          {/* other bands sink into the dark; the active band keeps its light */}
          {k > 0 && <div style={{ position: "absolute", left: -400, width: W + 800, top: -400, height: b.top + 400, background: "rgba(0,3,8,.66)", opacity: dim }} />}
          <div style={{ position: "absolute", left: -400, width: W + 800, top: b.bot, height: H - b.bot + 400, background: "rgba(0,3,8,.66)", opacity: dim }} />
          {/* level lines */}
          {AM_BARS.map((y0, i) => {
            const y = y0 * H, on = Math.abs(y - lineY) < 1;
            const g = on ? gap : 0;
            const seg = (x0: number, x1: number, key: string) => x1 > x0 ? (
              <div key={key} style={{ position: "absolute", left: x0, width: x1 - x0, top: y - (on ? 3.5 : 2.5), height: on ? 7 : 5,
                background: on ? `rgba(255,255,255,${0.8 + 0.2 * lit})` : `rgba(236,242,244,${lerp(0.85, 0.5, dim)})`,
                boxShadow: on ? `0 0 ${10 + 18 * lit}px rgba(255,255,255,${0.55 * lit}), 0 2px 6px rgba(0,0,0,.5)` : "0 2px 5px rgba(0,0,0,.55)" }} />
            ) : null;
            return (
              <React.Fragment key={i}>
                {seg(-400, W / 2 - g, `a${i}`)}{seg(W / 2 + g, W + 400, `b${i}`)}
                {on && sweep > -0.15 && sweep < 1.15 && (
                  <div style={{ position: "absolute", top: y - 14, height: 28, width: 360, left: sweep * W - 180, mixBlendMode: "screen",
                    background: "radial-gradient(ellipse at center, rgba(255,255,255,.95) 0%, rgba(255,255,255,.25) 35%, rgba(255,255,255,0) 70%)" }} />
                )}
              </React.Fragment>
            );
          })}
          {/* case names */}
          {AM_LEVELS.map((lv, kk) => placed(kk).map((p) => {
            const mine = kk === k, deeper = kk > k;
            const t0 = N + p.i * 9, typedN = mine ? Math.max(0, Math.floor((f - t0) * 1.4)) : 99;
            const txt = p.text.slice(0, typedN);
            let op = fadeIn * (mine ? 1 : deeper ? lerp(0.75, 0.5, dim) : lerp(0.9, 0.42, dim));
            if (mine) op *= interpolate(f, [t0, t0 + 2], [0, 1], cl);
            const isMark = mine && p.i === Math.min(mark, pl.length - 1);
            if (mine && !isMark) op *= lerp(1, 0.45, ease(f, M, M + 14));
            const rule = isMark ? ease(f, M, M + 14, out) : 0;
            const style: React.CSSProperties = { position: "absolute", top: p.y - NAME_PX * 0.62, whiteSpace: "pre", fontFamily: "Elite", fontSize: NAME_PX,
              color: "#EEF2F2", opacity: op, textShadow: "0 2px 10px rgba(0,0,0,.85), 0 0 3px rgba(0,0,0,.7)", filter: deeper ? "blur(5px)" : undefined,
              ...(p.side === 0 ? { left: 0, width: W, textAlign: "center" } : p.side < 0 ? { right: W / 2 + COL, textAlign: "right" } : { left: W / 2 + COL }) };
            return (
              <div key={`${kk}-${p.i}`} style={style}>
                <span style={{ position: "relative" }}>
                  {mine ? txt.padEnd(p.text.length, " ") : p.text}
                  {rule > 0 && <span style={{ position: "absolute", left: 0, bottom: -5, height: 2, width: `${rule * 100}%`, background: "rgba(255,255,255,.9)" }} />}
                </span>
              </div>
            );
          }))}
          {/* LEVEL N on its line + the level's name in the red box under it */}
          {f >= A && (
            <div style={{ position: "absolute", left: 0, width: W, top: lineY - 46, textAlign: "center", whiteSpace: "pre", fontFamily: "Elite", fontSize: 84, lineHeight: "92px",
              color: "#FFFFFF", textShadow: "0 0 16px rgba(255,255,255,.35), 0 3px 14px rgba(0,0,0,.8)" }}>{typed.padEnd(label.length, " ")}</div>
          )}
          {boxW > 0 && (
            <div style={{ position: "absolute", left: 0, width: W, top: lineY + 52, display: "flex", justifyContent: "center" }}>
              <div style={{ background: RED, padding: "5px 14px", clipPath: `inset(0 ${(1 - boxW) * 100}% 0 0)`, boxShadow: "0 6px 18px rgba(0,0,0,.45)" }}>
                <div style={{ fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 34, lineHeight: 1, color: "#0B0B0B", whiteSpace: "pre" }}>{name}</div>
              </div>
            </div>
          )}
        </div>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      </AbsoluteFill>
      <Grain f={f} />
    </AbsoluteFill>
  );
};
