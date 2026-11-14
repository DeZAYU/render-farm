// title / ChapterCard: VV §1 "rise and recede" chapter card (MOTION.md §1, measured ch1 1:00.73 / ch4 9:14.93 / ch9 22:58.84):
// black -> radial dark-red glow fades up 8 f; the kicker ("CHAPTER N") enters from the bottom edge at +2 f, opacity ramps 6 f, arrives soft;
// the whole group rises (tau 1.1 s) and recedes S = 0.39 + 0.61 e^(-t/1.1) from x2.12, never settling before the cut; the red box with the title
// rises from below +13 f later (offset 105 -> 40 px, bezier .404,.252,.291,.94). Wide red bloom on the kicker. Hard cut out, no exit.
// Our version: kicker in Inter 800 (FONTS.md chapter row), box in Bebas Neue +0.15 em; drifting dust is seeded, sparse.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, RC, W, clamp01, rng } from "../../core";

export type ChapterCardProps = { kicker: string; title: string; titleAt?: number; boxColour?: string };
const DUST = (() => { const r = rng(404); return Array.from({ length: 30 }, () => ({ x: r() * W, y: r() * H, s: 1 + r() * 2.5, v: 4 + r() * 10, o: 0.15 + r() * 0.35 })); })();

export const ChapterCard: React.FC<ChapterCardProps> = ({ kicker, title, titleAt = 15, boxColour = RC.vvChapterBox }) => {
  const f = useCurrentFrame();
  const bg = clamp01(f / 8) * (1 - 0.35 * clamp01((f - 8) / 90));
  const t = Math.max(0, f - 2) / 30;
  const S = 0.39 + 0.61 * Math.exp(-t / 1.1);
  const rise = -520 * (1 - Math.exp(-t / 1.1));
  const kO = clamp01((f - 2) / 6) * 0.55 + (f >= 2 ? 0.45 : 0);
  const kB = 3 * (1 - clamp01((f - 2) / 8));
  const bk = f - titleAt;
  const boxY = 105 - 65 * EZ.chapterBox(bk / 30);
  const boxClip = clamp01(bk / 6); // rises from below its own line
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: bg, background: "radial-gradient(ellipse 70% 60% at 50% 72%, #3a0006 0%, rgba(18,2,3,.6) 45%, #020202 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: bg }}>
        {DUST.map((d, i) => <circle key={i} cx={d.x + Math.sin((f + i * 9) / 40) * 6} cy={(d.y - (d.v * f) / 30 + H) % H} r={d.s} fill="#ffd9d0" opacity={d.o} />)}
      </svg>
      {f >= 2 ? (
        <div style={{ position: "absolute", left: W / 2, top: 1050, transform: `translate(-50%,-50%) translateY(${rise.toFixed(1)}px) scale(${(2.12 * S).toFixed(4)})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ opacity: kO, filter: kB > 0.05 ? `blur(${kB.toFixed(2)}px)` : undefined, fontFamily: FONT.inter, fontWeight: 800, fontSize: 148, letterSpacing: "0.01em", color: "#FFFEFB", whiteSpace: "nowrap",
            textShadow: "0 0 6px #ffb3bd, 0 0 18px #e0485a, 0 0 42px #a0182a, 0 0 80px #6a0d18" }}>{kicker}</div>
          {bk >= 0 ? (
            <div style={{ marginTop: boxY - 70, clipPath: `inset(${(100 * (1 - boxClip)).toFixed(1)}% 0 0 0)`, background: boxColour, padding: "4px 28px", fontFamily: FONT.bebas, fontSize: 88, letterSpacing: "0.15em",
              color: "#fff", whiteSpace: "nowrap", boxShadow: "0 0 24px rgba(234,0,25,.55), 0 0 60px rgba(86,39,44,.6)" }}>{title}</div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
