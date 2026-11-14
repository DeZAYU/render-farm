// evidence / TiltedWall: a wall of evidence tiles (photos / page crops / clips) on a plane turned away in 3-D, depth of field on the far
// edges. Tiles flicker on at random (DD tile flicker), the camera glides along the wall (slow linear pan, life), the key tile gets the red
// D3 tile frame on its noun, then the camera DIVES into it: the plane turns square to the lens and the tile grows to full frame, an
// accelerating push (hand-over into that picture).
// REF Dashcam Vol.1 E13 20-tile grid @0:54.4-1:04.4 (random tile flicker, grid pull-back bezier .30,.50,.25,1, dive into tile x2.73) +
// Nocturn CP7 tilted channel-videos grid with DOF (worst 3:11.0-3:25.3, 12:09). Our version: real evidence in the tiles; the dive lands
// exactly on the tile (it fills the frame), so the next shot can be that picture full-frame.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { DOFRadial, H, MBlur, Media, RC, W, clamp01, hash, lerp, lerpLog } from "../../core";

export type TiltedWallProps = {
  tiles: string[]; // media (stills or clips), row-major
  cols?: number; // default 4
  tileW?: number; tileH?: number; gap?: number; // world px (default 560 x 315, gap 26)
  yaw?: number; pitch?: number; // plane rotation deg (default -24 / 8)
  panFrom?: number; panTo?: number; // camera x across the wall (world px from the wall centre), linear over the shot
  appear?: number; // frames over which tiles flicker on (default 22)
  focus?: { i: number; at: number; dive?: number; d?: number }; // red frame on tile i at `at`; dive starts `dive` (frames), lasts d
};
const DIVE = Easing.bezier(0.5, 0, 0.75, 0.6); // accelerating push into the tile (VV §7 gunPush shape), still fast at the end = cut
const Inner: React.FC<TiltedWallProps> = (p) => {
  const f = useCurrentFrame();
  const cols = p.cols ?? 4, tw = p.tileW ?? 560, th = p.tileH ?? 315, g = p.gap ?? 26;
  const rows = Math.ceil(p.tiles.length / cols);
  const WW = cols * tw + (cols - 1) * g, WH = rows * th + (rows - 1) * g;
  const fo = p.focus;
  const dv = fo && fo.dive !== undefined ? DIVE(clamp01((f - fo.dive) / (fo.d ?? 30))) : 0;
  const ft = fo ? { x: (fo.i % cols) * (tw + g) + tw / 2 - WW / 2, y: Math.floor(fo.i / cols) * (th + g) + th / 2 - WH / 2 } : { x: 0, y: 0 };
  const t = Math.max(0, f) / 30;
  const span = fo?.dive ?? 150;
  const px = lerp(p.panFrom ?? -260, p.panTo ?? 260, clamp01(f / span));
  const cx = lerp(px, ft.x, dv), cy = lerp(0, ft.y, dv);
  const z0 = 0.86 * (1 + 0.01 * t);
  const z = lerpLog(z0, W / tw, dv);
  const yaw = (p.yaw ?? -24) * (1 - dv), pitch = (p.pitch ?? 8) * (1 - dv);
  const app = p.appear ?? 22;
  const wall = (
    <AbsoluteFill style={{ transform: `perspective(1700px) rotateX(${pitch}deg) rotateY(${yaw}deg)`, transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) scale(${z}) translate(${-cx}px, ${-cy}px)` }}>
        {p.tiles.map((src, i) => {
          const x = (i % cols) * (tw + g) - WW / 2, y = Math.floor(i / cols) * (th + g) - WH / 2;
          const on = hash(i * 7.3 + 1) * app; // flicker-on start
          const k = f - on;
          if (k < 0) return null;
          const fl = k < 7 ? (hash(i * 13 + Math.floor(k) * 3.1) > 0.45 ? 1 : 0.15) : 1;
          const isF = fo?.i === i;
          const dim = fo && !isF ? clamp01((f - fo.at) / 12) : 0;
          const red = isF ? clamp01((f - fo!.at) / 4) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: tw, height: th, opacity: fl, overflow: "hidden", background: "#111",
              boxShadow: red > 0 ? `0 0 0 ${(7 * red).toFixed(1)}px ${RC.tileRed}, 0 0 28px 6px rgba(192,0,16,${(0.45 * red).toFixed(2)})` : "0 12px 30px rgba(0,0,0,.6)",
              filter: dim > 0 ? `brightness(${1 - 0.55 * dim}) saturate(${1 - 0.5 * dim})` : undefined }}>
              <Media src={src} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: "#070606" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, #1e1a19 0%, #070606 100%)" }} />
      {dv > 0.6 ? wall : <DOFRadial blur={5 * (1 - dv / 0.6)} rx={46} ry={60}>{wall}</DOFRadial>}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${(0.7 * (1 - dv)).toFixed(2)}) 100%)` }} />
    </AbsoluteFill>
  );
};
export const TiltedWall: React.FC<TiltedWallProps> = (p) => {
  const f = useCurrentFrame();
  const fo = p.focus;
  const diving = !!fo && fo.dive !== undefined && f > fo.dive + 4 && f < fo.dive + (fo.d ?? 30);
  return <MBlur on={diving}><Inner {...p} /></MBlur>;
};
