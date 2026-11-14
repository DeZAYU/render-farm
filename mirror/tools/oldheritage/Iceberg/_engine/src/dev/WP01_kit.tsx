// WP01 helpers (not a device): brand fonts loader for WP01 devices (each render chunk mounts its own), the tall framing used for
// footage shots of the 202x360 vertical source (full-height clip over its own blurred copy, no white frame), and a frozen-frame video.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export const AR = 608 / 1080; // the source clip (portrait)

let fontP: Promise<void> | null = null;
export const useWpFonts = () => {
  const [h] = React.useState(() => delayRender("wp01 fonts"));
  React.useEffect(() => {
    if (!fontP) fontP = Promise.all([
      new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load(),
      new FontFace("ArchivoBlk", `url(${staticFile("fonts/Archivo-wdth-wght.ttf")})`, { weight: "100 900", stretch: "62% 125%" }).load(),
    ]).then((fs) => { fs.forEach((f) => document.fonts.add(f)); });
    fontP.then(() => continueRender(h));
  }, [h]);
};
export const ARCH: React.CSSProperties = { fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", textTransform: "uppercase", lineHeight: 1 };

/** a video frame at an exact source second (for remapped speed / freezes) */
export const FrameAt: React.FC<{ src: string; t: number; style: React.CSSProperties }> = ({ src, t, style }) => (
  <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={style} /></Freeze>
);

/** blurred, darkened copy of the clip filling the frame (background for the portrait panel) */
export const BlurBed: React.FC<{ src: string; from?: number; t?: number; dim?: number; rate?: number }> = ({ src, from = 0, t, dim = 0.5, rate = 1 }) => {
  const { width, height } = useVideoConfig();
  const st: React.CSSProperties = { position: "absolute", inset: -80, width: width + 160, height: height + 160, objectFit: "cover", filter: `blur(34px) brightness(${dim}) saturate(.85)` };
  return t !== undefined ? <FrameAt src={src} t={t} style={st} /> : <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={st} />;
};

/** footage shot: the portrait clip at full height, slow push, over its blurred copy */
export const Tall: React.FC<{ src: string; from: number; n: number; s0?: number; s1?: number; fx?: number; fy?: number; x?: number }> = ({ src, from, n, s0 = 1.0, s1 = 1.06, fx = 0.5, fy = 0.5, x = 0.5 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const s = s0 + (s1 - s0) * io(f / n);
  const W = height * AR;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <BlurBed src={src} from={from} />
      <div style={{ position: "absolute", left: x * width - W / 2, top: 0, width: W, height, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }} />
      </div>
    </AbsoluteFill>
  );
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (f: number, a: number, b: number, e = io) => e(interpolate(f, [a, b], [0, 1], cl));

/** the portrait clip big (full height) over its blurred copy, live or frozen at t, with a push (s, fx, fy) and an overlay drawn in the
 * clip's own coordinates (viewBox 0 0 608 1080) that moves with the push; dim = darken outside a spotlight ellipse [cx, cy, rx, ry] */
export const OnTall: React.FC<{ src: string; from?: number; t?: number; s: number; fx: number; fy: number; spot?: [number, number, number, number]; dim?: number; children?: React.ReactNode }> = ({ src, from = 0, t, s, fx, fy, spot, dim = 0, children }) => {
  const { width, height } = useVideoConfig();
  const W = height * AR;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {t !== undefined ? <BlurBed src={src} t={t} /> : <BlurBed src={src} from={from} />}
      <div style={{ position: "absolute", left: (width - W) / 2, top: 0, width: W, height, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }}>
          {t !== undefined ? <FrameAt src={src} t={t} style={st} /> : <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} />}
          {spot && dim > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse ${spot[2] * 100}% ${spot[3] * 100}% at ${spot[0] * 100}% ${spot[1] * 100}%, rgba(0,0,0,0) 55%, rgba(0,0,0,${0.7 * dim}) 100%)` }} />}
          <svg viewBox="0 0 608 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>{children}</svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
