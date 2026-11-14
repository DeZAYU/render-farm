// title / VideoWall: Dashcam "INSTRUMENT" title device (REFERENCE_SYNTHESIS §H2 Direction A "Title device" + B6).
// REF: Nocturn NB5 video wall, VIRAL 0:22.0-0:35.3 (a wall of playing clips, cells 1/3 W, camera zoom 2.45x, whips of 6-8 f with motion blur,
// audio dips -20/-30 dB at the whips) + Dashcam Vol.3 wall camera rule @0:33.08-0:46.5 (the camera lands on each teased case as it is named; creep
// +4.5 %/s between moves is DD's, we keep a slower life creep) + Farrell text in 6-8 f.
// OUR VERSION: every cell plays the video's own case footage; the wall plane is tilted a few degrees with a radial depth of field; the title sits on
// the wide, dimmed wall (never on black) in D-DIN 700 + D-DIN Exp with the key word in the theme accent. NOT a tile grid with a dive (TitleWall/DD).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { type CamKey, WATERPARK, EZ, FreshLayer, H, MBlur, Media, type Theme, Vignette, W, camAt, camFast, clamp01, drift, type Cam } from "../../core";
import { fsOf } from "../labels/dash1kit";

export type WallLine = { text: string; at: number; face?: "title" | "num"; cap?: number; key?: boolean };
export type VideoWallProps = {
  cells: string[]; // one clip per cell (public-relative), cycled if fewer than cols*rows
  cellStarts?: number[]; // source start frame per cell (cycled)
  cols?: number; rows?: number;
  stops: { cell: number; at: number }[]; // the camera LANDS on `cell` at local frame `at` (the frame its case is named)
  title?: WallLine[]; // lines shown on the wide wall, top -> bottom
  titleOut?: number; // title exit start (8 f)
  zoom?: number; // camera scale on a landed cell (NB5: 2.45)
  whip?: number; // whip length in frames (NB5: 6-8)
  firstDur?: number; // the first move from the wide view (zoom in) in frames
  tilt?: number; // wall rotateX in deg (slight)
  roll?: number; // wall rotateZ in deg
  dof?: number; // edge defocus px (radial)
  theme?: Theme;
};

const PX = W / 3; // cell pitch: cells are 1/3 W wide on the wide view (NB5)
const GAP = 18;
const CW = PX - GAP, CH = (CW * 9) / 16, PY = CH + GAP;

type PlaneProps = { cells: string[]; cellStarts: number[]; cols: number; rows: number; stops: { cell: number; at: number }[]; keys: CamKey[]; c0: Cam; zoom: number; whip: number; firstDur: number; tilt: number; roll: number };
/** the wall under the camera. Reads its OWN frame so CameraMotionBlur's sub-frame samples really move (whip blur). */
const WallPlane: React.FC<PlaneProps> = ({ cells, cellStarts, cols, rows, stops, keys, c0, zoom, whip, firstDur, tilt, roll }) => {
  const t = useCurrentFrame();
  const wallW = cols * PX, wallH = rows * PY;
  const cam = camAt(t, c0, keys);
  const S = cam.s * drift(t, 0.006); // life creep (never dead-still)
  const zp = clamp01((cam.s - 1) / Math.max(0.01, zoom - 1));
  let active = -1;
  stops.forEach((st, i) => { if (t >= st.at - (i === 0 ? firstDur : whip) * 0.5) active = st.cell; });
  const margin = 0.3 * W;
  const nodes: React.ReactNode[] = [];
  // the named grid (cols x rows) plus one ring of extra cells around it, so a landing on an edge cell never shows the wall's edge
  for (let rr = -1; rr <= rows; rr++) for (let cc = -1; cc <= cols; cc++) {
    const inside = rr >= 0 && rr < rows && cc >= 0 && cc < cols;
    const i = rr * cols + cc;
    const mi = (((rr + 1) * (cols + 2) + cc + 1) * 7 + 3) % Math.max(1, cells.length * cellStarts.length); // ring cells reuse the clips
    const x = cc * PX + GAP / 2, y = rr * PY + GAP / 2;
    const sx0 = W / 2 + (x - cam.cx) * S, sy0 = H / 2 + (y - cam.cy) * S;
    if (sx0 > W + margin || sx0 + CW * S < -margin || sy0 > H + margin || sy0 + CH * S < -margin) continue; // off screen: not mounted
    const lit = inside && i === active ? 1 : 1 - 0.45 * zp;
    const src = inside ? cells[i % cells.length] : cells[mi % cells.length];
    const st = inside ? cellStarts[i % cellStarts.length] : cellStarts[Math.floor(mi / cells.length) % cellStarts.length];
    nodes.push(
      <div key={`${rr}_${cc}`} style={{ position: "absolute", left: x, top: y, width: CW, height: CH, overflow: "hidden", background: "#111", filter: lit < 0.999 ? `brightness(${lit.toFixed(3)})` : undefined }}>
        <Media src={src} startFrom={st} />
      </div>,
    );
  }
  return (
    <AbsoluteFill style={{ background: "#0b0d0f", perspective: 2200, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: wallW, height: wallH, transformOrigin: "0 0",
        transform: `translate(${W / 2}px, ${H / 2}px) rotateX(${tilt}deg) rotateZ(${roll}deg) scale(${S.toFixed(5)}) translate(${(-cam.cx).toFixed(2)}px, ${(-cam.cy).toFixed(2)}px)` }}>
        {nodes}
      </div>
    </AbsoluteFill>
  );
};

export const VideoWall: React.FC<VideoWallProps> = ({
  cells, cellStarts = [0], cols = 5, rows = 4, stops, title = [], titleOut, zoom = 2.45, whip = 7, firstDur = 10, tilt = 7, roll = -2, dof = 7, theme = WATERPARK,
}) => {
  const f = useCurrentFrame();
  const th = theme;
  const wallW = cols * PX, wallH = rows * PY;
  const centre = (i: number) => ({ cx: (i % cols) * PX + PX / 2, cy: Math.floor(i / cols) * PY + PY / 2 });
  const c0: Cam = { cx: wallW / 2, cy: wallH / 2, s: 1 };
  const keys: CamKey[] = stops.map((st, i) => {
    const d = i === 0 ? firstDur : whip;
    return { f: st.at - d, d, to: { ...centre(st.cell), s: zoom }, e: EZ.inout };
  });
  const fast = camFast(f, keys, 0.05, 0.9);
  // M-064: whip blur without stepped ghosts. Screen velocity of the wall at the centre (px/frame) -> shutter-180 span; samples scale with the
  // span (12-16, only on the whip frames) and a directional (axis-weighted) gaussian pass fills the gap between neighbouring samples.
  const cA = camAt(f - 0.5, c0, keys), cB = camAt(f + 0.5, c0, keys);
  const sMid = (cA.s + cB.s) / 2;
  const vx = (cB.cx - cA.cx) * sMid, vy = (cB.cy - cA.cy) * sMid;
  const span = 0.5 * Math.hypot(vx, vy) + 0.5 * Math.abs(cB.s - cA.s) * W * 0.5; // shutter 180
  const samples = Math.max(12, Math.min(16, Math.ceil(span / 22)));
  const step = span / samples, sp = Math.max(1e-6, Math.hypot(vx, vy));
  const sgOf = (v: number) => (fast ? Math.min(30, 0.7 * step * (Math.abs(v) / sp) + 0.1 * step) : 0); // along the motion only (axis-weighted)
  const sgx = sgOf(vx), sgy = sgOf(vy);
  const fid = `vw-dirblur-${f}`;
  // title (on the wide wall): each line rises 18 px + fades in 7 f on its word; the wall dims under it; exit 8 f
  const tEx = titleOut === undefined ? 0 : clamp01((f - titleOut) / 8);
  const tOn = title.length ? clamp01((f - title[0].at + 2) / 7) * (1 - tEx) : 0;
  const m = "radial-gradient(ellipse 58% 56% at 50% 50%, transparent 52%, #000 100%)";
  return (
    <AbsoluteFill style={{ background: "#0b0d0f", overflow: "hidden" }}>
      {fast ? (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={fid} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={`${sgx.toFixed(2)} ${sgy.toFixed(2)}`} edgeMode="duplicate" /></filter>
        </svg>
      ) : null}
      <AbsoluteFill style={{ filter: fast ? `url(#${fid})` : undefined }}>
        <MBlur on={fast} samples={samples}><WallPlane {...{ cells, cellStarts, cols, rows, stops, keys, c0, zoom, whip, firstDur, tilt, roll }} /></MBlur>
      </AbsoluteFill>
      {/* radial depth of field over the tilted wall (backdrop blur at the edges; no second copy of the clips) */}
      {dof > 0 ? <AbsoluteFill style={{ backdropFilter: `blur(${dof}px)`, WebkitBackdropFilter: `blur(${dof}px)`, WebkitMaskImage: m, maskImage: m }} /> : null}
      <Vignette />
      {tOn > 0.002 ? <AbsoluteFill style={{ background: `rgba(4,6,8,${(0.5 * tOn).toFixed(3)})` }} /> : null}
      {title.length && tEx < 1 ? (
        <FreshLayer>
          <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, opacity: 1 - tEx * tEx, transform: `scale(${drift(f, 0.006).toFixed(5)})` }}>
            {title.map((l, i) => {
              const k = f - l.at;
              const tf = l.face === "num" ? th.num : th.title;
              const cap = l.cap ?? (l.face === "num" ? 120 : 76);
              const u = EZ.out3(k / 7);
              return (
                <div key={i} style={{ fontFamily: tf.face, fontWeight: tf.weight, fontSize: fsOf(tf.face, cap), lineHeight: 1.02, whiteSpace: "pre", color: l.key ? th.accent : th.neutral,
                  opacity: k < 0 ? 0 : clamp01(k / 7), transform: `translateY(${(18 * (1 - u)).toFixed(2)}px)`,
                  textShadow: l.key ? `0 0 18px ${th.accentGlow}, 0 4px 14px rgba(0,0,0,.6)` : "0 4px 14px rgba(0,0,0,.6), 0 1px 3px rgba(0,0,0,.6)" }}>
                  {l.text.toUpperCase()}
                </div>
              );
            })}
          </AbsoluteFill>
        </FreshLayer>
      ) : null}
    </AbsoluteFill>
  );
};
