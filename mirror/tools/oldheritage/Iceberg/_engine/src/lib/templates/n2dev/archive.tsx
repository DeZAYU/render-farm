// n2dev archive / picture devices: Fern 23/29 flashback frame + archive grade, Fern 24 object -> map icon pull-out, Fern 31/32 CRT window +
// name tag, Fern 34/35 highlighter sweep, Fern 47 boxed film inset, LEMMiNO minimal line map + archive push with a source caption,
// Visual Venture tilted photo settle with parallax.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { clamp01, lerp, lerpLog } from "../../core";
import { Credit, EI, K, Pic, Plate, type PlateP, Svg, type TK, Typed, assertDev, envIO, geoPaths, mono, rnd, sans, trackAt, typedN, typew, useJson, wide } from "./kit";

// ---------------------------------------------------------------- archive grade (Fern 29): warm-faded mono, gate weave, flicker, dust
export const ArchiveGrade: React.FC<{ children: React.ReactNode; amt?: number }> = ({ children, amt = 1 }) => {
  const f = useCurrentFrame();
  const wx = (rnd(Math.floor(f / 2) * 1.3) - 0.5) * 2.2 * amt, wy = (rnd(Math.floor(f / 2) * 2.7) - 0.5) * 1.6 * amt;
  const fl = 1 + (rnd(f * 0.77) - 0.5) * 0.06 * amt;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate3d(${wx.toFixed(2)}px, ${wy.toFixed(2)}px, 0)`, filter: `sepia(${0.55 * amt}) saturate(${1 - 0.45 * amt}) contrast(${1 + 0.12 * amt}) brightness(${(0.92 * fl).toFixed(3)})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 45%, rgba(20,12,4,.65) 100%)", opacity: amt }} />
      <Svg style={{ opacity: 0.5 * amt }}>
        {Array.from({ length: 5 }, (_, i) => { const s = Math.floor(f / 3) * 11 + i * 37; return rnd(s) > 0.55 ? <circle key={i} cx={rnd(s + 1) * 1920} cy={rnd(s + 2) * 1080} r={1 + rnd(s + 3) * 2.5} fill="#F0E6D2" /> : null; })}
        {rnd(Math.floor(f / 5) * 3.3) > 0.6 && <line x1={rnd(Math.floor(f / 5)) * 1920} y1={0} x2={rnd(Math.floor(f / 5)) * 1920 + 6} y2={1080} stroke="rgba(240,230,210,.35)" strokeWidth={1.2} />}
      </Svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Flashback_D (Fern 23 + 29)
/** the present shot dips to a printed photo frame (white border, soft rounded corners) carrying the archive picture, which settles and drifts;
 *  a typed year/caption sits below in typewriter. */
export const Flashback_D: React.FC<PlateP & { dur: number; photo: string; photoFrom?: number; caption?: string; at?: number; tilt?: number }> = (p) => {
  const { dur, photo, photoFrom = 0, caption, at = 10, tilt = -2.2 } = p;
  assertDev("Flashback", dur);
  const f = useCurrentFrame();
  const k = EI.cam((f - at) / 22), o = 1 - EI.cam((f - dur + 14) / 14);
  const s = lerpLog(1.6, 1, k) * lerp(1, 1.035, clamp01(f / dur));
  const n = caption ? typedN(f, caption.length, at + 26, 22, dur - 2) : 0;
  return (
    <AbsoluteFill style={{ background: "#050302" }}>
      <AbsoluteFill style={{ opacity: 1 - k }}><Plate {...p} /></AbsoluteFill>
      <AbsoluteFill style={{ opacity: k * o, background: "radial-gradient(ellipse 80% 70% at 50% 45%, #1A140E 0%, #070503 100%)" }} />
      <div style={{ position: "absolute", left: 960, top: 500, width: 1180, height: 760, transform: `translate(-50%, -50%) scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1) rotate(${lerp(0, tilt, k).toFixed(3)}deg)`, opacity: clamp01(k * 1.6) * o,
        background: "#E9E2D2", padding: 26, borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,.7)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 6 }}>
          <ArchiveGrade><Pic src={photo} from={photoFrom} /></ArchiveGrade>
        </div>
      </div>
      {caption && <div style={{ position: "absolute", left: 0, right: 0, top: 920, textAlign: "center", ...typew(36, 0.12), color: "#EDE5D4", opacity: o }}><Typed text={caption} n={n} caret /></div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- LineMap layer (LEMMiNO): thin white outlines from a geo json
export const LineMapLayer: React.FC<{ geo: string; draw?: number; stroke?: string; w?: number }> = ({ geo, draw = 1, stroke = "rgba(240,246,248,.85)", w = 1.4 }) => {
  const j = useJson<unknown>(geo);
  if (!j) return null;
  const { paths, box } = geoPaths(j);
  const s = Math.min(1500 / box[2], 900 / box[3]);
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${960 - (box[0] + box[2] / 2) * s} ${540 - (box[1] + box[3] / 2) * s}) scale(${s})`}>
        {paths.map((d, i) => <path key={i} d={d} fill="none" stroke={stroke} strokeWidth={w / s} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={draw < 1 ? `${draw} 1` : undefined} />)}
      </g>
    </svg>
  );
};
/** geo-space point -> screen (same fit as LineMapLayer) */
const useGeoFit = (geo: string) => {
  const j = useJson<unknown>(geo);
  if (!j) return null;
  const { box } = geoPaths(j);
  const s = Math.min(1500 / box[2], 900 / box[3]);
  return (x: number, y: number) => ({ x: 960 + (x - (box[0] + box[2] / 2)) * s, y: 540 + (y - (box[1] + box[3] / 2)) * s });
};

// ---------------------------------------------------------------- LineMap_D (LEMMiNO)
/** thin white outlines on black, slow drift-in, a small ice-cyan marker and the place name in spaced caps (+ mono coordinates). pin = geo units of the json. */
export const LineMap_D: React.FC<{ dur: number; geo: string; pin: [number, number]; place: string; coords?: string; z0?: number; z1?: number }> = ({ dur, geo, pin, place, coords, z0 = 1.0, z1 = 1.18 }) => {
  assertDev("LineMap", dur);
  const f = useCurrentFrame();
  const fit = useGeoFit(geo);
  const o = envIO(f, dur, 16, 16);
  const P = fit ? fit(pin[0], pin[1]) : { x: 960, y: 540 };
  const z = lerpLog(z0, z1, EI.smooth(f / dur));
  const scr = { x: P.x + (960 - P.x) * 0 , y: P.y };
  const n = typedN(f, place.length, 26, 18, dur - 2), nc = coords ? typedN(f, coords.length, 40, 30, dur - 2) : 0;
  const pk = EI.quick((f - 18) / 12);
  const sx = 960 + (scr.x - 960) * z, sy = 540 + (scr.y - 540) * z;
  return (
    <AbsoluteFill style={{ background: "#000", opacity: o }}>
      <AbsoluteFill style={{ transform: `scale3d(${z.toFixed(5)}, ${z.toFixed(5)}, 1)`, willChange: "transform" }}><LineMapLayer geo={geo} draw={EI.cam(f / 40)} /></AbsoluteFill>
      <Svg>
        <rect x={sx - 6 * pk} y={sy - 6 * pk} width={12 * pk} height={12 * pk} fill={K.cyan} transform={`rotate(45 ${sx} ${sy})`} style={{ filter: K.cyanGlow }} />
      </Svg>
      <div style={{ position: "absolute", left: sx + 30, top: sy - 22 }}>
        <div style={{ ...wide(30, 500, 100, 0.42), color: K.ice }}><Typed text={place} n={n} /></div>
        {coords && <div style={{ ...mono(16, 400, 0.16), color: K.frost, marginTop: 8 }}><Typed text={coords} n={nc} /></div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- MapPull_D (Fern 24)
/** the object in the shot shrinks into a map icon (a cyan-edged tile carrying the picture) while the camera pulls out to a line map. */
export const MapPull_D: React.FC<PlateP & { dur: number; obj: [number, number]; geo: string; pin: [number, number]; place?: string; at?: number }> = (p) => {
  const { dur, obj, geo, pin, place, at = 24 } = p;
  assertDev("MapPull", dur, () => (dur - at < 70 ? "needs >= 70 f after `at`" : null));
  const f = useCurrentFrame();
  const fit = useGeoFit(geo);
  const P = fit ? fit(pin[0], pin[1]) : { x: 960, y: 540 };
  const k = EI.cam((f - at) / 40);
  const mz = lerpLog(3.2, 1, k); // map pull-out
  const mp = P;
  const tw = lerpLog(1920, 120, k), th = lerpLog(1080, 120, k);
  const cx = lerp(960, mp.x, k), cy = lerp(540, mp.y, k);
  const src = { x: lerp(960, obj[0], k), y: lerp(540, obj[1], k) };
  const ps = lerpLog(1, 0.3, k), r = lerp(0, 14, k);
  const n = place ? typedN(f, place.length, at + 44, 20, dur - 2) : 0;
  const o = 1 - EI.cam((f - dur + 14) / 14);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: k * o, transform: `scale3d(${mz.toFixed(5)}, ${mz.toFixed(5)}, 1)`, transformOrigin: `${P.x}px ${P.y}px` }}><LineMapLayer geo={geo} /></AbsoluteFill>
      <div style={{ position: "absolute", left: cx - tw / 2, top: cy - th / 2, width: tw, height: th, borderRadius: r, overflow: "hidden", opacity: o,
        boxShadow: k > 0.05 ? `0 0 0 ${lerp(0, 2.5, k)}px ${K.cyan}, 0 10px 30px rgba(0,0,0,.6)` : undefined }}>
        <div style={{ position: "absolute", left: tw / 2 - src.x * ps, top: th / 2 - src.y * ps, width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale3d(${ps.toFixed(5)}, ${ps.toFixed(5)}, 1)` }}>
          <Plate {...p} />
        </div>
      </div>
      {place && <div style={{ position: "absolute", left: mp.x + 70, top: mp.y - 18, ...wide(28, 500, 100, 0.4), color: K.ice, opacity: o }}><Typed text={place} n={n} /></div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CrtWindow_D (Fern 31 / 32)
/** an old-desktop window (title bar + buttons, mono title) with the picture on a CRT (scanlines, curvature glow, RGB fringe), floating on a
 *  dark plate; a name tag window can pop beside it (Fern 32). */
export const CrtWindow_D: React.FC<PlateP & { dur: number; media: string; mediaFrom?: number; title?: string; tag?: string; tagAt?: number }> = (p) => {
  const { dur, media, mediaFrom = 0, title = "clip_0417.mp4", tag, tagAt = 40 } = p;
  assertDev("CrtWindow", dur);
  const f = useCurrentFrame();
  const o = envIO(f, dur, 12, 14), k = EI.quick(f / 18);
  const s = lerp(0.9, 1, k) * lerp(1, 1.03, f / dur);
  const to = tag ? envIO(f, dur, 8, 10, tagAt) : 0;
  const nt = tag ? typedN(f, tag.length, tagAt + 4, 24, dur - 2) : 0;
  return (
    <AbsoluteFill style={{ background: K.abyss }}>
      <Plate {...p} src={p.src ?? media} from={p.src ? p.from : mediaFrom} blur={26} dim={0.55} grade />
      <div style={{ position: "absolute", left: 960, top: 540, width: 1240, transform: `translate(-50%, -50%) scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1)`, opacity: o, boxShadow: "0 30px 90px rgba(0,0,0,.75)" }}>
        <div style={{ height: 40, background: "linear-gradient(180deg, #1C3D5A, #0E2236)", display: "flex", alignItems: "center", padding: "0 14px", borderBottom: "1px solid rgba(166,246,255,.4)" }}>
          <div style={{ ...mono(18, 500, 0.08), color: K.ice, flex: 1 }}>{title}</div>
          {["_", "□", "×"].map((c, i) => <div key={i} style={{ width: 26, height: 24, marginLeft: 6, border: "1px solid rgba(244,247,247,.6)", ...mono(14, 600, 0), color: K.ice, display: "flex", alignItems: "center", justifyContent: "center" }}>{c}</div>)}
        </div>
        <div style={{ position: "relative", height: 698, background: "#000", overflow: "hidden" }}>
          <AbsoluteFill style={{ filter: "contrast(1.12) saturate(1.1) brightness(1.05)" }}><Pic src={media} from={mediaFrom} /></AbsoluteFill>
          <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.16) 0px, rgba(0,0,0,.16) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)" }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(255,255,255,.05) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
          <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(166,246,255,0) ${((f * 1.6) % 120) - 20}%, rgba(166,246,255,.06) ${((f * 1.6) % 120) - 10}%, rgba(166,246,255,0) ${(f * 1.6) % 120}%)` }} />
        </div>
      </div>
      {tag && (
        <div style={{ position: "absolute", left: 1310, top: 330, opacity: clamp01(to * 1.4), transform: `translate3d(0, ${lerp(10, 0, EI.quick(to)).toFixed(2)}px, 0)`, boxShadow: "0 10px 30px rgba(0,0,0,.6)" }}>
          <div style={{ height: 12, background: "linear-gradient(90deg, #1C3D5A, #2C5A80)" }} />
          <div style={{ background: K.ice, padding: "10px 22px", ...typew(30, 0.02), color: "#0B1D2A" }}><Typed text={tag} n={nt} /></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Highlighter_D (Fern 34 / 35)
export type HSpan = { r: [number, number, number, number]; at: number; sweep?: number };
/** article text close-up: the page drifts one way, a highlighter sweeps under the key sentence (amber, multiply), the rest of the page dims. */
export const Highlighter_D: React.FC<{ dur: number; src: string; crop: [number, number, number, number]; spans: HSpan[]; credit?: string; dir?: 1 | -1 }> = ({ dur, src, crop, spans, credit, dir = 1 }) => {
  assertDev("Highlighter", dur, () => (spans.some((s) => (s.sweep ?? 22) < 12) ? "sweep < 12 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const sc = (1920 / crop[2]) * lerp(1.0, 1.06, EI.smooth(f / dur));
  const dx = lerp(0, -60 * dir, f / dur);
  const tx = (x: number) => (x - crop[0]) * sc + dx - (1920 * (sc / (1920 / crop[2])) - 1920) / 2, ty = (y: number) => (y - crop[1]) * sc - (1080 * (sc / (1920 / crop[2])) - 1080) / 2;
  const dim = Math.min(...spans.map((s) => EI.cam((f - s.at) / 16))) * 0.45;
  return (
    <AbsoluteFill style={{ background: "#ECEAE4", opacity: o, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: tx(0), top: ty(0), transformOrigin: "0 0", transform: `scale(${sc.toFixed(5)})`, maxWidth: "none" }} />
      {spans.map((s, i) => {
        const w = EI.cam((f - s.at) / (s.sweep ?? 22));
        return <div key={i} style={{ position: "absolute", left: tx(s.r[0]) - 6, top: ty(s.r[1]) - 4, width: (s.r[2] * sc + 12) * w, height: s.r[3] * sc + 8, background: "#FFC94A", mixBlendMode: "multiply", borderRadius: 3 }} />;
      })}
      <AbsoluteFill style={{ background: "#0A0F14", opacity: dim, maskImage: "linear-gradient(180deg, #000 0%, transparent 38%, transparent 62%, #000 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,4,8,.4) 100%)" }} />
      <Credit text={credit} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- FilmInset_D (Fern 47)
/** a boxed film inset floating over a dark plate of the main shot: the 2nd angle keeps the context. Thin ice frame + mono caption. */
export const FilmInset_D: React.FC<PlateP & { dur: number; inset: string; insetFrom?: number; caption?: string; box?: [number, number, number]; at?: number }> = (p) => {
  const { dur, inset, insetFrom = 0, caption, box = [960, 520, 1180], at = 0 } = p;
  assertDev("FilmInset", dur);
  const f = useCurrentFrame();
  const o = envIO(f, dur, 12, 14, at);
  const s = lerp(0.94, 1, EI.quick((f - at) / 18)) * lerp(1, 1.025, f / dur);
  const n = caption ? typedN(f, caption.length, at + 14, 28, dur - 2) : 0;
  return (
    <AbsoluteFill>
      <Plate {...p} dim={lerp(0, 0.62, o)} blur={lerp(0, 8, o)} />
      <div style={{ position: "absolute", left: box[0], top: box[1], width: box[2], height: box[2] * 0.5625, transform: `translate(-50%, -50%) scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1)`, opacity: clamp01(o * 1.3),
        border: "2px solid rgba(244,247,247,.85)", boxShadow: "0 24px 70px rgba(0,0,0,.7)", overflow: "hidden", background: "#000" }}>
        <Pic src={inset} from={insetFrom} />
      </div>
      {caption && <div style={{ position: "absolute", left: box[0] - box[2] / 2, top: box[1] + box[2] * 0.5625 / 2 + 22, ...mono(20, 500, 0.2), color: K.ice, opacity: o }}><Typed text={caption} n={n} caret /></div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ArchivePush_D (LEMMiNO)
/** a real photo/document, slow eased archival push, clean thin sans caption bottom-left (source, date) fading in late. */
export const ArchivePush_D: React.FC<{ dur: number; src: string; from?: number; s0?: number; s1?: number; focus?: [number, number]; source: string; date?: string; archive?: number }> = ({ dur, src, from = 0, s0 = 1.0, s1 = 1.12, focus = [0.5, 0.5], source, date, archive = 0 }) => {
  assertDev("ArchivePush", dur);
  const f = useCurrentFrame();
  const o = envIO(f, dur, 14, 14);
  const s = lerpLog(s0, s1, EI.smooth(f / dur));
  const co = EI.cam((f - 24) / 18) * EI.cam((dur - f) / 12);
  const pic = <AbsoluteFill style={{ willChange: "transform", transform: `scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1)`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%` }}><Pic src={src} from={from} /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{ background: "#000", opacity: o }}>
      {archive > 0 ? <ArchiveGrade amt={archive}>{pic}</ArchiveGrade> : <AbsoluteFill style={{ filter: "saturate(.85) contrast(1.04)" }}>{pic}</AbsoluteFill>}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 22%)" }} />
      <div style={{ position: "absolute", left: 60, bottom: 46, opacity: co }}>
        <div style={{ ...sans(22, 400, 0.02), color: "rgba(240,244,246,.9)" }}>{source}</div>
        {date && <div style={{ ...sans(18, 300, 0.04), color: "rgba(220,226,230,.65)", marginTop: 4 }}>{date}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- TiltPhoto_D (Visual Venture KenBurnsParallax)
/** a print photo drops in tilted, settles with a soft shadow on a blurred copy of itself; an optional cut-out foreground layer moves faster
 *  than the photo (2-layer parallax). */
export const TiltPhoto_D: React.FC<{ dur: number; src: string; fg?: string; rot0?: number; rot1?: number; caption?: string }> = ({ dur, src, fg, rot0 = -7, rot1 = -2, caption }) => {
  assertDev("TiltPhoto", dur);
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 14);
  const k = EI.quick(f / 26), r = lerp(rot0, rot1, EI.cam(f / 34));
  const y = lerp(120, 0, k), s = lerp(1.12, 1, k) * lerp(1, 1.05, f / dur);
  const px = lerp(-18, 18, f / dur);
  const n = caption ? typedN(f, caption.length, 30, 24, dur - 2) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", opacity: o }}>
      <AbsoluteFill style={{ filter: "blur(34px) brightness(.45) saturate(.8)", transform: "scale(1.15)" }}><Pic src={src} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 960, top: 520, width: 1240, height: 760, transform: `translate(-50%, -50%) translate3d(${px.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(3)}deg) scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1)`,
        background: "#F2EFE8", padding: 18, boxShadow: `0 ${lerp(60, 26, k)}px ${lerp(120, 60, k)}px rgba(0,0,0,.7)` }}>
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          <AbsoluteFill style={{ transform: `scale(${lerp(1.06, 1.0, f / dur).toFixed(5)})`, filter: "saturate(.85) contrast(1.04)" }}><Pic src={src} /></AbsoluteFill>
          {fg && <AbsoluteFill style={{ transform: `translate3d(${(px * 1.8).toFixed(2)}px, 0, 0) scale(${lerp(1.1, 1.0, f / dur).toFixed(5)})` }}><Img src={staticFile(fg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>}
        </div>
      </div>
      {caption && <div style={{ position: "absolute", left: 0, right: 0, top: 940, textAlign: "center", ...typew(30, 0.08), color: K.ice }}><Typed text={caption} n={n} /></div>}
    </AbsoluteFill>
  );
};
export const _trk = trackAt; export type _TK = TK;
