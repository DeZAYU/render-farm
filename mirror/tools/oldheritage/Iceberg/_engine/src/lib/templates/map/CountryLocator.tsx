// map / CountryLocator: region -> country -> place. REF Farrell evidence D1 map flight (Grindr @ 0:07-0:17 "Spain's northern port city of Bilbao":
// night map fades up from black, held, then ONE zoom burst (path progress every 4 f 0 .. .28 .58 .78 .89 .96 .99 1), the country outline glows in
// during the deceleration with two blooms and the outside drops dark) + D1 E10 map pin + D3 E2 place label (white + red key word);
// V4_BRIEF "Taiwan zoom-in from Asia". wp3: Blue Marble + outline data as in sec_B HospMap @ abs 5126.
// Ours: DD red outline instead of Farrell's cyan, the Blue Marble imagery wakes up only as the camera lands (the wide view stays a night
// outline map), log-zoom with motion blur, the target slides to centre linearly in screen space while the zoom is log (no swing).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, RC, W, EZ, MBlur, PlateVig, MapPin, asset, clamp01, lerp, lerpLog } from "../../core";
import { DEMO_BM, DEMO_COUNTRY, DEMO_REGION, FARRELL_FLIGHT, PlaceWords, imageRect, layerTf, tableAt, wxy, type GeoImage, type GeoLayer, type LonLat, type Word, type WorldProj } from "./shared";

export type CountryLocatorProps = {
  labelCap?: number; // place label cap if place.cap is not set (M-024 >= 28)
  proj: WorldProj;
  region: GeoLayer; // wide outline layer(s) (continent / neighbours)
  country: GeoLayer; // detailed outline of the target country (glows in on arrival)
  imagery?: GeoImage; // georeferenced satellite still, revealed as the camera lands
  wide: LonLat & { span: number }; // start view: centre + visible longitude span (deg)
  close: LonLat & { span: number }; // end view
  fadeIn?: number; // fade up from black (frames)
  burstAt: number; // local frame the flight starts
  burstFrames?: number; // flight length (Farrell 44-48 f)
  outline?: string; // country outline colour
  dimOutside?: number; // how dark the outside gets after arrival (0..1)
  place?: LonLat & { at: number; words: Word[]; dx?: number; dy?: number; cap?: number }; // pin + D3 place label
  drift?: number; // slow life push per second after landing
};

const Plane: React.FC<CountryLocatorProps & { uid: string }> = (p) => {
  const f = useCurrentFrame();
  const P = p.proj;
  const bf = p.burstFrames ?? 44;
  const u = tableAt(FARRELL_FLIGHT, f - p.burstAt, bf / (FARRELL_FLIGHT.length - 1));
  const s0 = W / (p.wide.span * P.k * P.u), s1 = W / (p.close.span * P.k * P.u);
  const c0 = wxy(P, p.wide.lon, p.wide.lat), T = wxy(P, p.close.lon, p.close.lat);
  const sRaw = lerpLog(s0, s1, u);
  // target screen offset moves linearly while the zoom is log: c = T + (c0 - T) * (1 - u) * s0 / s
  const g = ((1 - u) * s0) / sRaw;
  const pre = Math.max(0, Math.min(f, p.burstAt)) / 30, post = Math.max(0, f - (p.burstAt + bf)) / 30;
  const s = sRaw * Math.exp(0.006 * pre + (p.drift ?? 0.009) * post);
  const cx = T.x + (c0.x - T.x) * g, cy = T.y + (c0.y - T.y) * g;
  const arrive = clamp01((u - 0.55) / 0.45); // outline glow + imagery on the deceleration
  const glow = EZ.out2(arrive);
  const ir = p.imagery ? imageRect(P, p.imagery) : null;
  const dim = (p.dimOutside ?? 0.5) * EZ.out2(clamp01((f - (p.burstAt + bf * 0.7)) / 18));
  const oc = p.outline ?? RC.lineRed;
  const tf = `translate(${W / 2} ${H / 2}) scale(${s.toFixed(6)}) translate(${(-cx).toFixed(3)} ${(-cy).toFixed(3)})`;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 55% 50%, #0C1620 0%, #03060A 80%)" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {ir ? (
            <radialGradient id={`${p.uid}rg`}><stop offset="0.3" stopColor="#fff" /><stop offset="0.92" stopColor="#000" /></radialGradient>
          ) : null}
          {ir ? (
            <mask id={`${p.uid}im`} maskUnits="userSpaceOnUse" x={ir.x} y={ir.y} width={ir.w} height={ir.h}>
              <rect x={ir.x} y={ir.y} width={ir.w} height={ir.h} fill={`url(#${p.uid}rg)`} />
            </mask>
          ) : null}
          <mask id={`${p.uid}out`} maskUnits="userSpaceOnUse" x={-1e5} y={-1e5} width={2e5} height={2e5}>
            <rect x={-1e5} y={-1e5} width={2e5} height={2e5} fill="#fff" />
            <g transform={layerTf(P, p.country)}>{p.country.paths.map((d, i) => <path key={i} d={d} fill="#000" />)}</g>
          </mask>
        </defs>
        <g transform={tf}>
          {ir && p.imagery ? (
            <g mask={`url(#${p.uid}im)`}>
              <image href={asset(p.imagery.src)} x={ir.x} y={ir.y} width={ir.w} height={ir.h} preserveAspectRatio="none"
                opacity={EZ.out2(clamp01((u - 0.3) / 0.7)).toFixed(3)} style={{ filter: `brightness(${lerp(0.5, 1, arrive).toFixed(3)}) saturate(${lerp(0.4, 1, arrive).toFixed(3)})` }} />
            </g>
          ) : null}
          {/* wide night map: land lifted, thin outlines (fade as the imagery takes over) */}
          <g transform={layerTf(P, p.region)} opacity={(1 - 0.75 * arrive).toFixed(3)}>
            {p.region.paths.map((d, i) => <path key={i} d={d} fill="rgba(200,215,225,.13)" stroke="rgba(232,238,242,.85)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />)}
          </g>
          {dim > 0 ? <rect x={-1e5} y={-1e5} width={2e5} height={2e5} fill="#000" opacity={dim} mask={`url(#${p.uid}out)`} /> : null}
          {glow > 0 ? (
            <g transform={layerTf(P, p.country)} opacity={glow}>
              {p.country.paths.map((d, i) => <path key={`b${i}`} d={d} fill="none" stroke={oc} strokeWidth={14} vectorEffect="non-scaling-stroke" opacity={0.35} style={{ filter: `blur(${(9 / s).toFixed(3)}px)` }} />)}
              {p.country.paths.map((d, i) => <path key={`c${i}`} d={d} fill="none" stroke={oc} strokeWidth={3.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 ${(5 / s).toFixed(3)}px ${oc})` }} />)}
            </g>
          ) : null}
        </g>
      </svg>
      <PlaceLayer {...p} s={s} cx={cx} cy={cy} />
    </AbsoluteFill>
  );
};
const PlaceLayer: React.FC<CountryLocatorProps & { s: number; cx: number; cy: number }> = ({ proj, place, s, cx, cy, labelCap }) => {
  const f = useCurrentFrame();
  if (!place || f < place.at) return null;
  const q = wxy(proj, place.lon, place.lat);
  const x = (q.x - cx) * s + W / 2, y = (q.y - cy) * s + H / 2;
  const first = place.words.length ? Math.min(place.at, place.words[0].at) : place.at;
  return (
    <>
      <MapPin k={f - place.at} x={x} y={y} size={1.15} />
      <PlaceWords f={f} words={place.words.map((w) => ({ ...w, at: Math.max(w.at, first) }))} cap={place.cap ?? labelCap ?? 58} x={x + (place.dx ?? 34)} y={y + (place.dy ?? -30)} />
    </>
  );
};

export const CountryLocator: React.FC<CountryLocatorProps> = (p) => {
  const f = useCurrentFrame();
  const bf = p.burstFrames ?? 44;
  const fast = f > p.burstAt + bf * 0.12 && f < p.burstAt + bf * 0.8;
  const fade = clamp01(f / (p.fadeIn ?? 18));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: EZ.out2(fade) }}>
        <MBlur on={fast} samples={8}><Plane {...p} uid="cl" /></MBlur>
        <PlateVig k={0.72} tint="0,0,0" inner={40} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const COUNTRY_LOCATOR_DEMO: CountryLocatorProps = {
  proj: { lon0: 73, lat0: 54, k: 0.88, u: 100 },
  region: DEMO_REGION,
  country: DEMO_COUNTRY,
  imagery: DEMO_BM,
  wide: { lon: 110, lat: 31, span: 46 },
  close: { lon: 121.35, lat: 23.65, span: 8.6 },
  fadeIn: 18,
  burstAt: 30,
  burstFrames: 44,
  dimOutside: 0.55,
  place: { lon: 121.39, lat: 25.13, at: 86, words: [{ t: "Harbour District,", at: 88 }, { t: "City Name", at: 100, red: true }], cap: 46, dx: 46, dy: 34 },
};
