// lookhere / CutMarkers: over CCTV / surveillance footage with JUMP CUTS, every source jump is marked: a red tick is added to a tally and a HUD line
// "[CUT · TIME SKIPPED]" types beside it. REF Dashcam Vol.1 E4 HUD bracket callout @1:07.9 (Inter 700 #EF020C, thin red glow, words typed ~3 f
// each) + DD lookhere red language (D1 E5 ring core #C8060A, 3 f exits) + DD hard white/red flash punctuation (1-2 f). Map: c05 #19 ("every one of
// those cuts skips real time the boy was spending under the water": a red tick + "CUT · TIME SKIPPED" each time the surveillance jumps).
// OUR VERSION: the ticks ACCUMULATE (the count is the argument), each cut also pulses a 2 f red frame edge; the HUD line re-types on every cut.
// `cuts` = local frames of the source jumps; for demo / pre-cut sources `skip` jumps the source forward by that many frames at each cut.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { EZ, FONT, Media, RC, Vignette, clamp01, fs, linPush } from "../../core";

export type CutMarkersProps = { media: string; mediaStart?: number; cuts: number[]; skip?: number; push?: number; label?: string; hold?: number; cap?: number };
export const CutMarkers: React.FC<CutMarkersProps> = ({ media, mediaStart = 0, cuts, skip = 0, push = 0.03, label = "[CUT · TIME SKIPPED]", hold = 40, cap = 36 }) => {
  const f = useCurrentFrame();
  const passed = cuts.filter((c) => f >= c);
  const n = passed.length;
  const last = n ? passed[n - 1] : -1e9;
  const k = f - last;
  const segStart = n ? last : 0;
  const words = label.split(" ");
  const nW = k < 0 ? 0 : Math.min(words.length, Math.floor(k / 3) + 1);
  const lo = n === 0 ? 0 : 1 - clamp01((k - hold) / 6);
  const edge = n && k < 3 ? [0.85, 0.45, 0.15][Math.floor(k)] : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${linPush(f, push).toFixed(5)})` }}>
        <Sequence from={segStart} layout="none"><Media src={media} startFrom={mediaStart + segStart + skip * n} /></Sequence>
      </AbsoluteFill>
      <Vignette />
      {edge > 0 ? <AbsoluteFill style={{ boxShadow: `inset 0 0 0 10px rgba(239,2,12,${edge.toFixed(2)}), inset 0 0 60px rgba(239,2,12,${(0.6 * edge).toFixed(2)})` }} /> : null}
      <div style={{ position: "absolute", left: 96, top: 84, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 64, filter: "drop-shadow(0 0 6px rgba(239,2,12,.8)) drop-shadow(0 2px 4px rgba(0,0,0,.7))" }}>
          {passed.map((c, i) => {
            const u = EZ.out2(clamp01((f - c + 1) / 3));
            return <div key={i} style={{ width: 11, height: 64, background: RC.hudRed, transformOrigin: "50% 100%", transform: `scaleY(${u.toFixed(3)}) skewX(-8deg)` }} />;
          })}
        </div>
        {n ? (
          <div style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", cap), color: RC.hudRed, opacity: lo, whiteSpace: "pre", textShadow: "0 0 4px rgba(239,2,12,.7), 0 2px 6px rgba(0,0,0,.8)" }}>
            {words.map((w, i) => <span key={i} style={{ opacity: i < nW ? 1 : 0 }}>{i ? " " : ""}{w}</span>)}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
