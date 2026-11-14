// DC01 helpers (not a device): the 1280x720 VSP dashcam shown full frame through a virtual camera (scale + focus point, eased between
// keys, clamped inside the picture), live, slowed or frozen; brand fonts loader for DC01 devices.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";

export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export const ease = (f: number, a: number, b: number, e = io) => e(interpolate(f, [a, b], [0, 1], cl));

let fontP: Promise<void> | null = null;
export const useDcFonts = () => {
  const [h] = React.useState(() => delayRender("dc01 fonts"));
  React.useEffect(() => {
    if (!fontP) fontP = Promise.all([
      new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load(),
      new FontFace("ArchivoBlk", `url(${staticFile("fonts/Archivo-wdth-wght.ttf")})`, { weight: "100 900", stretch: "62% 125%" }).load(),
    ]).then((fs) => { fs.forEach((f) => document.fonts.add(f)); });
    fontP.then(() => continueRender(h));
  }, [h]);
};

/** camera key: at frame f (shot-local), scale s, focus x/y (fractions of the picture) */
export type CK = { f: number; s: number; x: number; y: number };
export const camAt = (f: number, keys: CK[]) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (f <= b.f) { const u = io((f - a.f) / Math.max(1, b.f - a.f)); return { f, s: a.s + (b.s - a.s) * u, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
  }
  return keys[keys.length - 1];
};
/** where the picture sits on the 1920x1080 frame for a camera state (left, top, width, height) */
export const placeOf = (c: { s: number; x: number; y: number }, W = 1920, H = 1080) => {
  const w = W * c.s, h = H * c.s;
  const left = Math.min(0, Math.max(W - w, W / 2 - c.x * w)), top = Math.min(0, Math.max(H - h, H / 2 - c.y * h));
  return { left, top, w, h };
};

/** the clip through the camera: live from `from` (rate 1 or slowed), or frozen at `t`; `layers` draws over the picture in its own
 *  coordinates (0..1 box that moves with the camera) */
export const Cam: React.FC<{ src: string; keys: CK[]; from?: number; t?: number; rate?: number; filter?: string; layers?: React.ReactNode }> = ({ src, keys, from = 0, t, rate = 1, filter, layers }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, filter };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {t !== undefined
        ? <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
        : <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={st} />}
      {layers && <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>{layers}</div>}
    </AbsoluteFill>
  );
};
