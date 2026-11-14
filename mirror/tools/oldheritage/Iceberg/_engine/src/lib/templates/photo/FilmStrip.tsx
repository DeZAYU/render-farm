// photo / FilmStrip: two to four photos on one sliding contact strip; the camera settles on one photo per noun. REF: Dashcam Vol.2 @ 0:33.4-37.6
// (E5 / I9 case-to-case carousel: red-bordered cards on black, the strip shifts one card pitch ~1,300 px over 55 f ez(.45,0,.25,1), the
// inactive card is desaturated to ~0.15, the next card settles to centre with a +2.6 % scale creep). Our version: the cards sit on a dark film
// base with sprocket holes (a contact strip), the card in focus keeps the DD 5 px red border and full colour while its neighbours stay grey and
// dim, a DD rounded label lands under the strip on its word (white words + red key word), motion blur on the shift, slow drift until the cut.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { EZ, H, MBlur, Media, RC, RoundText, W, clamp01, lerp } from "../../core";
import { CardVig, Specks } from "../../core/kits/photo";

export type StripItem = { src: string; at: number; label?: string; red?: string; labelAt?: number; pos?: string };
export type FilmStripProps = { items: StripItem[]; cardW?: number; pitch?: number; labelCap?: number };

const SHIFT = Easing.bezier(0.45, 0, 0.25, 1); // DD I9 strip shift

export const FilmStrip: React.FC<FilmStripProps> = ({ items, cardW = 1080, pitch = 1240, labelCap = 64 }) => {
  const k = useCurrentFrame();
  const cardH = cardW * 9 / 16;
  const baseH = cardH + 150;
  // strip position (in items) and which card is in focus (continuous)
  let pos = 0, fast = false;
  items.forEach((it, i) => {
    if (i === 0) return;
    const u = clamp01((k - it.at) / 55);
    pos += SHIFT(u);
    if (u > 0.12 && u < 0.8) fast = true;
  });
  const focus = (i: number) => clamp01(1 - Math.abs(pos - i) * 1.6);
  const creep = 1 + 0.026 * EZ.out2(clamp01((k - (items[Math.round(pos)]?.at ?? 0)) / 57)) + 0.004 * (k / 30);
  const x0 = W / 2 - pos * pitch;
  const cy = H / 2 - 40;
  return (
    <AbsoluteFill style={{ background: "#040404" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, #18110f 0%, #070505 60%, #020202 100%)" }} />
      <Specks k={k} n={30} seed={17} max={0.22} />
      <MBlur on={fast} samples={6}>
        <AbsoluteFill style={{ transformOrigin: `50% ${(cy / H) * 100}%`, transform: `scale(${creep.toFixed(5)}) rotate(${(-0.8 + 0.1 * (k / 30)).toFixed(3)}deg)` }}>
          {/* film base */}
          <div style={{ position: "absolute", left: -200, width: W + 400, top: cy - baseH / 2, height: baseH, background: "linear-gradient(to bottom, #161312, #0e0c0b 50%, #161312)",
            boxShadow: "0 30px 80px rgba(0,0,0,.8)" }} />
          {[0, 1].map((row) => (
            <div key={row} style={{ position: "absolute", left: 0, top: row ? cy + baseH / 2 - 52 : cy - baseH / 2 + 22, width: W, height: 30, overflow: "visible" }}>
              {Array.from({ length: Math.ceil((W + 120) / 46) + 1 }, (_, n) => {
                const j = Math.floor((-60 - x0) / 46) + n, x = x0 + j * 46;
                return <div key={j} style={{ position: "absolute", left: x, top: 0, width: 24, height: 30, borderRadius: 5, background: "#030303", boxShadow: "inset 0 2px 3px rgba(0,0,0,.9), 0 1px 0 rgba(255,255,255,.05)" }} />;
              })}
            </div>
          ))}
          {items.map((it, i) => {
            const fx = focus(i);
            const x = x0 + i * pitch;
            if (x < -cardW || x > W + cardW) return null;
            return (
              <div key={i} style={{ position: "absolute", left: x - cardW / 2, top: cy - cardH / 2, width: cardW, height: cardH, overflow: "hidden", background: "#111",
                boxShadow: `0 0 0 ${(5 * fx).toFixed(2)}px ${RC.d1Red}, 0 0 ${(26 * fx).toFixed(1)}px rgba(235,24,25,${(0.35 * fx).toFixed(3)})` }}>
                <Media src={it.src} pos={it.pos} style={{ filter: `saturate(${lerp(0.15, 1, fx).toFixed(3)}) brightness(${lerp(0.45, 0.95, fx).toFixed(3)}) contrast(1.06)` }} />
                <CardVig k={0.4} />
              </div>
            );
          })}
        </AbsoluteFill>
      </MBlur>
      {items.map((it, i) => {
        if (!it.label && !it.red) return null;
        const la = it.labelAt ?? it.at + (i === 0 ? 10 : 40);
        const q = k - la;
        const next = items[i + 1];
        const out = next ? clamp01((k - next.at) / 10) : 0;
        if (q < 0 || out >= 1) return null;
        const o = clamp01(q / 10) * (1 - out);
        return (
          <div key={`l${i}`} style={{ position: "absolute", left: 0, width: W, top: cy + baseH / 2 + 28, display: "flex", justifyContent: "center", gap: labelCap * 0.32, opacity: o,
            transform: `translateY(${(19 * (1 - EZ.out3(q / 26))).toFixed(2)}px)`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }}>
            {it.label ? <RoundText text={it.label} cap={labelCap} colour="#FDFDFD" /> : null}
            {it.red ? <div style={{ opacity: clamp01((q - 6) / 8), filter: "drop-shadow(0 0 6px rgba(242,37,34,.7))" }}><RoundText text={it.red} cap={labelCap} colour={RC.placeRed} /></div> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
