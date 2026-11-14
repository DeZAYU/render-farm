// censor / CensorCard: for the worst moments (FULL_PLAN CENSORSHIP (c)). The clip freezes on the last safe frame, defocuses and darkens to a
// plate in 10 f (BlurDip-like), and a centred two-tone DD label states it ("This part of the footage / is too graphic to show"): white line rises
// 19 px ease-out over 16 f, the red line comes in defocused -> sharp 10 f later (Dashcam Vol.3 E2 label behaviour, wp3 refsys DDLabel).
// REF: Abyssal censor card @ 13:53.7-14:04.5 (the worst image replaced by a card) + Dashcam Vol.3 E2 label @ 0:03.4 + D1 I3 blur-dip.
// Our version: a thin red rule draws between the lines (D1 E4 line red), a faint film grain keeps the plate alive, the plate keeps drifting.
import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import { EZ, H, RC, RoundText, W, clamp01, drift, rng } from "../../core";
import { Footage, Graded } from "./shared";

export type CensorCardProps = { media: string; startFrom?: number; freezeAt: number; white: string; red: string; textAt?: number; cap?: number };
const GRAIN = (() => { const r = rng(77); return Array.from({ length: 260 }, () => ({ x: r() * W, y: r() * H, o: r() })); })();

export const CensorCard: React.FC<CensorCardProps> = ({ media, startFrom = 0, freezeAt, white, red, textAt, cap = 62 }) => {
  const f = useCurrentFrame();
  const k = f - freezeAt;
  const u = clamp01(k / 10);
  const ta = textAt ?? freezeAt + 8;
  const w = f - ta, rr = f - ta - 10, rl = f - ta - 4;
  const plate = <Footage src={media} startFrom={startFrom} />;
  const gs = Math.floor(f / 2);
  return (
    <Graded>
      <AbsoluteFill style={{ transform: k >= 0 ? `scale(${(drift(k, 0.02) * (1 + 0.05 * u)).toFixed(5)})` : undefined, filter: k >= 0 ? `blur(${(30 * u).toFixed(1)}px) brightness(${(1 - 0.68 * u).toFixed(3)}) saturate(${(1 - 0.7 * u).toFixed(3)})` : undefined }}>
        {k >= 0 ? <Freeze frame={freezeAt}>{plate}</Freeze> : plate}
      </AbsoluteFill>
      {k >= 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.5 * u }}>
          {GRAIN.map((g, i) => <rect key={i} x={(g.x + gs * 37 * (i % 7)) % W} y={(g.y + gs * 53 * (i % 5)) % H} width={2} height={2} fill="#fff" opacity={((g.o + gs * 0.37) % 1) * 0.35} />)}
        </svg>
      ) : null}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: cap * 0.5 }}>
        <div style={{ opacity: w < 0 ? 0 : 0.9 * EZ.out2(w / 16) + 0.1 * clamp01((w - 16) / 10), transform: `translateY(${(19 * (1 - EZ.out3(w / 26))).toFixed(1)}px)`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }}>
          <RoundText text={white} cap={cap} colour="#FDFDFD" />
        </div>
        <div style={{ width: 560 * EZ.out3(rl / 14), height: 3, background: RC.lineRed, boxShadow: `0 0 8px ${RC.lineRed}`, opacity: rl < 0 ? 0 : 0.9 }} />
        <div style={{ opacity: rr < 0 ? 0 : 0.2 + 0.75 * EZ.out2(rr / 10) + 0.05 * clamp01((rr - 10) / 10), transform: `translateY(${(22 * (1 - EZ.out3(rr / 26))).toFixed(1)}px)`,
          filter: `drop-shadow(0 0 6px rgba(242,37,34,.75)) drop-shadow(0 0 16px rgba(242,37,34,.4))${rr >= 0 && rr < 10 ? ` blur(${(8 * (1 - rr / 10)).toFixed(2)}px)` : ""}` }}>
          <RoundText text={red} cap={cap} colour={RC.placeRed} />
        </div>
      </AbsoluteFill>
    </Graded>
  );
};
