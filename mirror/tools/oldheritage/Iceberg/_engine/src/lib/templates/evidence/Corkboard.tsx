// evidence / Corkboard: Dashcam Vol.1 E12 corkboard. A lit cork plane (vignette), items pinned with red pushpins; each item fades in over 10 f
// with a 1.04 -> 1.0 settle ON its noun, a red string draws from the linked pin over 10 f, and the camera moves item to item (1.0-1.5 s moves,
// DD bezier .45,0,.2,1, zoom 0.7-1.55) with a slow zoom/roll drift between moves; typically ends on a pull-back to the whole board.
// REF Dashcam Vol.1 E12 @14:44.4 (884.4-902.7) + D1 E9 red page bar; wp3 sec_B Board @ abs 4937 and sec_C Cork @ abs 7377.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, MBlur, PushPin, asset, camAt, camFast, clamp01, type CamKey } from "../../core";
import { ItemFace, itemSize, pinOf, type EvItem } from "./shared";

export type CorkboardProps = {
  board?: { src: string; w: number; h: number }; // cork texture in world px
  items: EvItem[];
  strings?: { a: number; b: number; at: number }[]; // red string between item pins (indices), drawn over 10 f from `at`
  cam0: { x: number; y: number; z: number }; // opening camera (world point at screen centre, zoom)
  moves?: { at: number; d?: number; x: number; y: number; z: number }[]; // camera moves (DD 30-45 f)
};
const toKeys = (moves: CorkboardProps["moves"]): CamKey[] =>
  (moves ?? []).map((m) => ({ f: m.at, d: m.d ?? 36, to: { cx: m.x, cy: m.y, s: m.z }, e: EZ.ddCam }));
const Inner: React.FC<CorkboardProps> = (p) => {
  const f = useCurrentFrame();
  const board = p.board ?? { src: "demo/cork.jpg", w: 3000, h: 1900 };
  const c = camAt(f, { cx: p.cam0.x, cy: p.cam0.y, s: p.cam0.z }, toKeys(p.moves));
  const z = c.s * (1 + 0.012 * (Math.max(0, f) / 30));
  const rot = -0.4 + 0.15 * (Math.max(0, f) / 30);
  return (
    <AbsoluteFill style={{ background: "#120c08" }}>
      <AbsoluteFill style={{ transform: `translate(960px, 540px) rotate(${rot}deg) scale(${z}) translate(${-c.cx}px, ${-c.cy}px)`, transformOrigin: "0 0" }}>
        <Img src={asset(board.src)} style={{ position: "absolute", left: 0, top: 0, width: board.w, height: board.h, filter: "saturate(.72) brightness(.88)" }} />
        {p.items.map((it, i) => {
          const q = f - it.at;
          if (it.at >= 0 && q < 0) return null;
          const o = it.at < 0 ? 1 : clamp01(q / 10), sc = it.at < 0 ? 1 : 1.04 - 0.04 * EZ.out3(q / 14);
          const { w, h } = itemSize(it);
          return (
            <div key={i} style={{ position: "absolute", left: it.x - w / 2, top: it.y - h / 2, width: w, height: h, opacity: o, transform: `rotate(${it.rot ?? 0}deg) scale(${sc})`,
              boxShadow: "10px 18px 30px rgba(0,0,0,.5), 0 3px 6px rgba(0,0,0,.35)" }}>
              <ItemFace it={it} />
            </div>
          );
        })}
        <svg width={board.w} height={board.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {(p.strings ?? []).map((s, i) => {
            const u = EZ.out3((f - s.at) / 10);
            if (u <= 0) return null;
            const a = pinOf(p.items[s.a]), b = pinOf(p.items[s.b]);
            const d = `M${a.x},${a.y} Q${(a.x + b.x) / 2},${(a.y + b.y) / 2 + 50} ${b.x},${b.y}`;
            return <path key={i} d={d} fill="none" stroke="#C40D0D" strokeWidth={5} pathLength={1} strokeDasharray={`${u} 1`} style={{ filter: "drop-shadow(3px 6px 4px rgba(0,0,0,.45))" }} />;
          })}
        </svg>
        {p.items.map((it, i) => {
          const o = it.at < 0 ? 1 : clamp01((f - it.at) / 8);
          if (o <= 0) return null;
          const pp = pinOf(it);
          return <PushPin key={`p${i}`} x={pp.x} y={pp.y} r={19} opacity={o} />;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 68% at 50% 48%, rgba(0,0,0,0) 46%, rgba(10,4,0,.62) 100%)" }} />
    </AbsoluteFill>
  );
};
export const Corkboard: React.FC<CorkboardProps> = (p) => {
  const f = useCurrentFrame();
  return <MBlur on={camFast(f, toKeys(p.moves), 0.1, 0.8)}><Inner {...p} /></MBlur>;
};
