// PROMOTED to core (was src/templates/map/shared.tsx); shared by several families. Import as "../../core/kits/geo".
// Shared plumbing for the map family: geo layers (outline paths + their projection), a world projection, imagery placement,
// the D1 E10/E4 map-box callout (pin -> red leader -> outlined box, words on their spoken words) and the D3 place label words.
// All frames LOCAL. Geo data is passed as props (GeoLayer / GeoImage); the demo data below is only the placeholder geography we ship.
import React from "react";
import { CHIP_TONE, H, RC, W, EZ, FONT, MapPin, RoundText, clamp01, fs as capFs, measure, type ChipTone } from "../index";

export type Pt = { x: number; y: number };
export type LonLat = { lon: number; lat: number };
/** one word of a label and the LOCAL frame of its spoken word (red = the key word, DD two-tone) */
export type Word = { t: string; at: number; red?: boolean };

/** outline paths in their own linear lon/lat layer: layer x = (lon - lon0) * sx, y = (latTop - lat) * sy */
export type GeoLayer = { paths: string[]; lon0: number; latTop: number; sx: number; sy: number };
/** a georeferenced still (equirectangular): Blue Marble crops, graded satellite tiles */
export type GeoImage = { src: string; lonW: number; lonE: number; latS: number; latN: number };
/** world plane used by a map: X = (lon - lon0) * k * u, Y = (lat0 - lat) * u (k = cos of the mid latitude) */
export type WorldProj = { lon0: number; lat0: number; k: number; u: number };

// ---------------------------------------------------------------- demo geography (placeholder data only)

export const wxy = (P: WorldProj, lon: number, lat: number): Pt => ({ x: (lon - P.lon0) * P.k * P.u, y: (P.lat0 - lat) * P.u });
/** SVG transform that places a GeoLayer into world units (affine: both are linear in lon/lat) */
export const layerTf = (P: WorldProj, L: GeoLayer) => {
  const a = (P.k * P.u) / L.sx, d = P.u / L.sy;
  return `translate(${((L.lon0 - P.lon0) * P.k * P.u).toFixed(3)} ${((P.lat0 - L.latTop) * P.u).toFixed(3)}) scale(${a.toFixed(6)} ${d.toFixed(6)})`;
};
export const imageRect = (P: WorldProj, I: GeoImage) => {
  const a = wxy(P, I.lonW, I.latN), b = wxy(P, I.lonE, I.latS);
  return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y };
};
/** great-circle distance in km */
export const haversine = (a: LonLat, b: LonLat) => {
  const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

/** piecewise-linear lookup of a measured progress table sampled every `step` frames (continuous in k) */
export const tableAt = (T: number[], k: number, step: number) => {
  const u = k / step;
  if (u <= 0) return T[0];
  if (u >= T.length - 1) return T[T.length - 1];
  const i = Math.floor(u);
  return T[i] + (T[i + 1] - T[i]) * (u - i);
};
/** Farrell evidence D1 map-flight path progress, every 4 f (GR 0:07 intro burst, 48 f, net zoom x3.45) */
export const FARRELL_FLIGHT = [0, 0, 0.02, 0.05, 0.11, 0.28, 0.58, 0.78, 0.89, 0.96, 0.99, 1];

// ---------------------------------------------------------------- D1 E10 / E4 map box: pin, red leader to an elbow, outlined box wiping L->R in 6 f,
// then the box words pop on their spoken words. `sub` = white words under the pin (fade 4 f each). p = pin tip on screen.
export const MapBoxCallout: React.FC<{
  f: number; p: Pt; start: number; words: Word[]; sub?: Word[]; elbow?: { dx: number; dy: number }; cap?: number; pin?: boolean; subCap?: number; tone?: ChipTone;
}> = ({ f, p, start, words, sub, elbow = { dx: 150, dy: -150 }, cap = 40, pin = true, subCap = 30, tone = "light" }) => {
  const pinK = f - start;
  if (pinK < 0) return null;
  const lk = EZ.out2((f - (start + 2)) / 6);
  const bk = EZ.out3((f - (start + 6)) / 6);
  const fsB = capFs("inter", cap);
  const text = words.map((w) => w.t).join(" ");
  const bw = Math.round(measure(text, `700 ${fsB}px ${FONT.inter}`) + cap * 1.4);
  const bh = Math.round(cap * 2.2);
  const dir = elbow.dx >= 0 ? 1 : -1;
  const head = { x: p.x + (pin ? 6 * dir : 0), y: p.y - (pin ? 12 : 0) };
  const e = { x: p.x + elbow.dx, y: p.y + elbow.dy };
  const box = { x: dir === 1 ? e.x : e.x - bw, y: e.y - bh / 2, w: bw, h: bh };
  const L = Math.hypot(e.x - head.x, e.y - head.y);
  const subStyle: React.CSSProperties = { fontFamily: FONT.inter, fontWeight: 500, fontSize: capFs("inter", subCap), color: "#F4F4F4", whiteSpace: "pre", textShadow: "0 2px 6px rgba(0,0,0,.8)" };
  return (
    <>
      {pin ? <MapPin k={pinK} x={p.x} y={p.y} /> : null}
      {lk > 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g style={{ filter: "drop-shadow(0 0 6px rgba(255,26,26,.8))" }}>
            <polyline points={`${head.x},${head.y} ${e.x},${e.y}`} fill="none" stroke={RC.lineRed} strokeWidth={3} strokeDasharray={`${(L * lk).toFixed(1)} ${L + 10}`} />
            {bk > 0 ? <rect x={dir === 1 ? box.x : box.x + box.w * (1 - bk)} y={box.y} width={box.w * bk} height={box.h} fill="rgba(8,0,0,.78)" stroke={RC.lineRed} strokeWidth={3} /> : null}
          </g>
        </svg>
      ) : null}
      <div style={{ position: "absolute", left: box.x + cap * 0.7, top: box.y, height: box.h, display: "flex", alignItems: "center", fontFamily: FONT.inter, fontWeight: 700, fontSize: fsB, color: CHIP_TONE[tone].text, whiteSpace: "pre",
        textShadow: tone === "red" ? "0 0 6px rgba(255,60,60,.9), 0 0 16px rgba(255,30,30,.55)" : CHIP_TONE.light.shadow }}>
        {words.map((w, i) => <span key={i} style={{ opacity: f >= w.at && bk >= 1 ? 1 : 0 }}>{(i ? " " : "") + w.t}</span>)}
      </div>
      {sub && sub.length ? (
        <div style={{ position: "absolute", left: p.x - 400, width: 800, top: p.y + 26, textAlign: "center", ...subStyle }}>
          {sub.map((w, i) => <span key={i} style={{ opacity: clamp01((f - w.at) / 4) }}>{(i ? " " : "") + w.t}</span>)}
        </div>
      ) : null}
    </>
  );
};

// ---------------------------------------------------------------- D3 E2 place-label words (Varela Round + round stroke = Arial Rounded MT Bold):
// white words rise 19 px and fade in over 16 f; the red key word comes in defocused (8 px) and sharpens in 10 f with a red glow.
export const PlaceWords: React.FC<{ f: number; words: Word[]; cap: number; x: number; y: number; align?: "left" | "center" }> = ({ f, words, cap, x, y, align = "left" }) => (
  <div style={{ position: "absolute", left: align === "center" ? x - 1200 : x, width: align === "center" ? 2400 : undefined, top: y, transform: "translateY(-62%)", display: "flex",
    justifyContent: align === "center" ? "center" : "flex-start", gap: cap * 0.3 }}>
    {words.map((w, i) => {
      const k = f - w.at;
      if (k < 0) return <div key={i} style={{ opacity: 0 }}><RoundText text={w.t} cap={cap} colour="#fff" /></div>;
      const rise = (w.red ? 22 : 19) * (1 - EZ.out3(k / 26));
      const o = w.red ? 0.2 + 0.75 * EZ.out2(k / 10) + 0.05 * clamp01((k - 10) / 10) : 0.9 * EZ.out2(k / 16) + 0.1 * clamp01((k - 16) / 10);
      const b = w.red ? 8 * (1 - clamp01(k / 10)) : 0;
      const glow = w.red ? "drop-shadow(0 0 6px rgba(242,37,34,.75)) drop-shadow(0 0 16px rgba(242,37,34,.45)) drop-shadow(0 3px 6px rgba(0,0,0,.45))" : "drop-shadow(0 4px 8px rgba(0,0,0,.6))";
      return (
        <div key={i} style={{ opacity: o, transform: `translateY(${rise.toFixed(2)}px)`, filter: `${glow}${b > 0.05 ? ` blur(${b.toFixed(2)}px)` : ""}` }}>
          <RoundText text={w.t} cap={cap} colour={w.red ? RC.placeRed : "#FDFDFD"} />
        </div>
      );
    })}
  </div>
);

/** faint horizontal scan texture (the D1 satellite map grade has it) */
export const ScanLines: React.FC<{ o: number }> = ({ o }) =>
  o > 0 ? <div style={{ position: "absolute", inset: 0, opacity: o, background: "repeating-linear-gradient(to bottom, rgba(0,0,0,.9) 0px, rgba(0,0,0,.9) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)", pointerEvents: "none" }} /> : null;
