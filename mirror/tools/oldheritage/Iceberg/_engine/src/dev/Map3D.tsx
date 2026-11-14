// 3-D map shot in Three.js (@remotion/three). Replaces _tools/blender_map.py (Blender) and reads the SAME case.json schema:
//   {origin:[lat,lon], font, imagery:[{file, extent:[xmin,ymin,xmax,ymax] (EPSG:3857 m), z, sat, val, feather}], states, state_hi,
//    counties, county_hi:[fips], county_state:"17" (optional, else from county_hi), track:[[lat,lon]..], track_width_km, places:{name:[lat,lon]},
//    shots:{name:{frames, lens, clip, keys:[{f, cam:[lat,lon,alt_km], look:[lat,lon]}], track:[f0,f1,start,end], labels:[[name,f_in]],
//                 counties:[f_in], line:[from,to,f0,f1], state_bevel:[[f,km]..], imagery_opacity:{file:[[f,v]..]}, label_km, core_km, line_km}}}
// Frames are Blender-style (first frame = 1). 1 world unit = 1 km of web-mercator, z up. Everything is unlit (emissive look).
// Missing files (imagery, geojson) are skipped with a console warning, so a shot still renders.
// Render: _tools/render_map3d.sh <case.json> <out dir> <shot...>   (still: --still <frame>)
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

export type Map3DProps = { dir: string; shot: string; frames: number; font?: string };
const W = 1920, H = 1080, R = 6378137.0;
type V3 = [number, number, number];
type Key = [number, number];

// ---------- math ----------
const rad = (d: number) => (d * Math.PI) / 180;
const merc = (lat: number, lon: number) => [R * rad(lon), R * Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2))];
const mkP = (origin: [number, number]) => {
  const [ox, oy] = merc(origin[0], origin[1]);
  return (lat: number, lon: number, z = 0): V3 => { const [x, y] = merc(lat, lon); return [(x - ox) / 1000, (y - oy) / 1000, z]; };
};
// Blender "auto-clamped bezier" approximation: cubic Hermite, tangents from neighbours, flat at ends and at local extremes.
export function kf(keys: Key[] | undefined, f: number, def = 0): number {
  if (!keys || !keys.length) return def;
  const k = [...keys].sort((a, b) => a[0] - b[0]);
  if (f <= k[0][0]) return k[0][1];
  if (f >= k[k.length - 1][0]) return k[k.length - 1][1];
  const tan = (i: number) => {
    if (i === 0 || i === k.length - 1) return 0;
    const [fp, vp] = k[i - 1], [, v] = k[i], [fn, vn] = k[i + 1];
    if ((v >= vp && v >= vn) || (v <= vp && v <= vn)) return 0;
    return (vn - vp) / (fn - fp);
  };
  let i = 0; while (f > k[i + 1][0]) i++;
  const [f0, v0] = k[i], [f1, v1] = k[i + 1], h = f1 - f0, t = (f - f0) / h, t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * v0 + (t3 - 2 * t2 + t) * h * tan(i) + (-2 * t3 + 3 * t2) * v1 + (t3 - t2) * h * tan(i + 1);
}
const col = (r: number, g: number, b: number, s = 1) => new THREE.Color().setRGB(Math.min(1, r * s), Math.min(1, g * s), Math.min(1, b * s));

// ---------- loading ----------
type GeoJSON = { features: { id?: string; properties: Record<string, any>; geometry: { type: string; coordinates: any } }[] };
type Loaded = { cfg: any; shot: any; states: GeoJSON | null; counties: GeoJSON | null; tex: (THREE.Texture | null)[]; fontFamily: string };
const tryJson = async (url: string) => { const r = await fetch(url); if (!r.ok) { console.warn("map3d: missing", url); return null; } return r.json(); };
const loadTex = (url: string) => new Promise<THREE.Texture | null>((res) =>
  new THREE.TextureLoader().load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }, undefined, () => { console.warn("map3d: missing", url); res(null); }));

function useMapData(dir: string, shotName: string, font: string): Loaded | null {
  const [data, setData] = useState<Loaded | null>(null);
  const [handle] = useState(() => delayRender("map3d: load " + dir));
  useEffect(() => {
    (async () => {
      const cfg = await tryJson(staticFile(`${dir}/case.json`));
      if (!cfg) throw new Error(`map3d: ${dir}/case.json not found`);
      const shot = cfg.shots?.[shotName];
      if (!shot) throw new Error(`map3d: shot "${shotName}" not in case.json (have: ${Object.keys(cfg.shots || {}).join(", ")})`);
      const states = cfg.states ? await tryJson(staticFile(`${dir}/${cfg.states}`)) : null;
      const counties = cfg.counties && shot.counties ? await tryJson(staticFile(`${dir}/${cfg.counties}`)) : null;
      const imgs: any[] = Array.isArray(cfg.imagery) ? cfg.imagery : [];
      const tex = await Promise.all(imgs.map((im) => loadTex(staticFile(`${dir}/${im.file}`))));
      let fontFamily = "sans-serif";
      try { const ff = new FontFace("Map3DFont", `url(${staticFile(`fonts/${font}`)})`); await ff.load(); document.fonts.add(ff); fontFamily = "Map3DFont"; }
      catch { console.warn("map3d: font not loaded", font); }
      setData({ cfg, shot, states, counties, tex, fontFamily });
      continueRender(handle);
    })().catch((e) => cancelRender(e));
  }, [dir, shotName, font, handle]);
  return data;
}

// ---------- geometry helpers ----------
const rings = (g: { type: string; coordinates: any }): number[][][] =>
  g.type === "Polygon" ? g.coordinates : g.type === "MultiPolygon" ? g.coordinates.flat(1) : [];
const ringSegs = (rs: number[][][], P: ReturnType<typeof mkP>, z: number) => {
  const out: number[] = [];
  for (const r of rs) for (let i = 0; i < r.length; i++) {
    const a = P(r[i][1], r[i][0], z), b = P(r[(i + 1) % r.length][1], r[(i + 1) % r.length][0], z);
    out.push(...a, ...b);
  }
  return out;
};
const lineMat = (c: THREE.Color, widthKm: number, opacity = 1) => {
  const m = new LineMaterial({ color: c.getHex(), linewidth: widthKm, worldUnits: true, transparent: opacity < 1, opacity });
  m.color.copy(c); m.resolution.set(W, H); return m;
};
const segObj = (pos: number[], mat: LineMaterial) => {
  const g = new LineSegmentsGeometry(); g.setPositions(pos);
  const o = new LineSegments2(g, mat); o.computeLineDistances(); return o;
};
// polyline cut to a fraction [0..frac] of its length
function cutPolyline(pts: V3[], frac: number): V3[] {
  const L: number[] = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const end = L[L.length - 1] * Math.max(0, Math.min(1, frac));
  const out: V3[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (L[i] <= end) { out.push(pts[i]); continue; }
    const t = (end - L[i - 1]) / (L[i] - L[i - 1] || 1), a = pts[i - 1], b = pts[i];
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); break;
  }
  return out;
}
// flat ribbon (in the ground plane) of width w along a polyline
function ribbon(pts: V3[], w: number): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  pts = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-3);  // drop near-duplicate points (noisy ends)
  if (pts.length < 2) return g;
  const pos: number[] = [], idx: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const nx = -dy * (w / 2), ny = dx * (w / 2), p = pts[i];
    pos.push(p[0] + nx, p[1] + ny, p[2], p[0] - nx, p[1] - ny, p[2]);
    if (i) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  }
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
}
function textTexture(text: string, family: string) {
  const px = 160, c = document.createElement("canvas"), ctx = c.getContext("2d")!;
  const font = `${px}px ${family}`; ctx.font = font; (ctx as any).letterSpacing = `${px * 0.08}px`;
  const w = Math.ceil(ctx.measureText(text).width + px * 0.2), h = Math.ceil(px * 1.3);
  c.width = w; c.height = h; ctx.font = font; (ctx as any).letterSpacing = `${px * 0.08}px`;
  ctx.fillStyle = "#fff"; ctx.textBaseline = "middle"; ctx.fillText(text, 0, h / 2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return { tex: t, aspect: w / h, hEm: h / px };
}

// imagery: hue/sat/value grade + soft feathered edges, like the Blender node tree
const imageryMat = (tex: THREE.Texture, sat: number, val: number, feather: number) => new THREE.ShaderMaterial({
  transparent: true, depthWrite: false,
  uniforms: { map: { value: tex }, sat: { value: sat }, val: { value: val }, feather: { value: feather }, opacity: { value: 1 } },
  vertexShader: `varying vec2 vUv;
#include <common>
#include <logdepthbuf_pars_vertex>
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
#include <logdepthbuf_vertex>
}`,
  fragmentShader: `uniform sampler2D map; uniform float sat, val, feather, opacity; varying vec2 vUv;
#include <common>
#include <logdepthbuf_pars_fragment>
vec3 rgb2hsv(vec3 c){ vec4 K=vec4(0.,-1./3.,2./3.,-1.); vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));
 vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r)); float d=q.x-min(q.w,q.y); float e=1.0e-10;
 return vec3(abs(q.z+(q.w-q.y)/(6.*d+e)), d/(q.x+e), q.x); }
vec3 hsv2rgb(vec3 c){ vec4 K=vec4(1.,2./3.,1./3.,3.); vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www); return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y); }
void main(){
#include <logdepthbuf_fragment>
 vec3 h = rgb2hsv(texture2D(map, vUv).rgb); h.y = clamp(h.y*sat,0.,1.); h.z *= val;
 float ex = min(vUv.x,1.-vUv.x), ey = min(vUv.y,1.-vUv.y);
 float m = min(clamp(ex/feather,0.,1.), clamp(ey/feather,0.,1.));
 gl_FragColor = vec4(hsv2rgb(h), m*opacity);
#include <colorspace_fragment>
}`,
});

// ---------- scene ----------
const Scene: React.FC<{ d: Loaded; f: number }> = ({ d, f }) => {
  const { cfg, shot } = d;
  const P = useMemo(() => mkP(cfg.origin), [cfg]);
  const { camera } = useThree();

  // static objects, built once
  const built = useMemo(() => {
    const objs: { states?: LineSegments2; statehi?: LineSegments2; counties?: LineSegments2; cfill: THREE.Mesh[]; imagery: { mesh: THREE.Mesh; file: string }[] } = { cfill: [], imagery: [] };
    (Array.isArray(cfg.imagery) ? cfg.imagery : []).forEach((im: any, i: number) => {
      const t = d.tex[i]; if (!t) return;
      const [xmin, ymin, xmax, ymax] = im.extent, [ox, oy] = merc(cfg.origin[0], cfg.origin[1]);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry((xmax - xmin) / 1000, (ymax - ymin) / 1000), imageryMat(t, im.sat ?? 0.75, im.val ?? 0.62, im.feather ?? 0.03));
      mesh.position.set(((xmin + xmax) / 2 - ox) / 1000, ((ymin + ymax) / 2 - oy) / 1000, im.z ?? 0); mesh.renderOrder = 1;
      objs.imagery.push({ mesh, file: im.file });
    });
    if (d.states) {
      const all: number[][][] = []; let hi: number[][][] = [];
      for (const ft of d.states.features) {
        const pr = ft.properties || {};
        if (pr.admin !== "United States of America" || pr.name === "Alaska" || pr.name === "Hawaii") continue;
        const rs = rings(ft.geometry); all.push(...rs); if (pr.name === cfg.state_hi) hi = rs;
      }
      objs.states = segObj(ringSegs(all, P, 0.02), lineMat(col(0.55, 0.62, 0.72, 1.4), 2));
      if (hi.length) objs.statehi = segObj(ringSegs(hi, P, 0.03), lineMat(col(1, 0.85, 0.55, 2.2), 3.2));
    }
    if (d.counties) {
      const pre = cfg.county_state ?? (cfg.county_hi?.[0] ?? "17").slice(0, 2);
      const segs: number[] = [];
      for (const ft of d.counties.features) {
        const fips = String(ft.id ?? ft.properties?.GEOID ?? ""); if (fips.slice(0, 2) !== pre) continue;
        const rs = rings(ft.geometry); segs.push(...ringSegs(rs, P, 0.03));
        if ((cfg.county_hi || []).includes(fips)) for (const r of rs) {
          const shape = new THREE.Shape(r.map(([lon, lat]) => { const p = P(lat, lon); return new THREE.Vector2(p[0], p[1]); }));
          const m = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: col(1, 0.25, 0.18), transparent: true, opacity: 0, depthWrite: false }));
          m.position.z = 0.025; objs.cfill.push(m);
        }
      }
      objs.counties = segObj(segs, lineMat(col(0.8, 0.82, 0.86, 0.9), 0.14));
    }
    return objs;
  }, [cfg, d, P]);

  const labels = useMemo(() => (shot.labels || []).map(([name, fin]: [string, number]) => {
    const pl = cfg.places?.[name]; if (!pl) { console.warn("map3d: no place", name); return null; }
    return { name, fin, p: P(pl[0], pl[1], 0.1), txt: textTexture(String(name).toUpperCase(), d.fontFamily) };
  }).filter(Boolean) as { name: string; fin: number; p: V3; txt: ReturnType<typeof textTexture> }[], [shot, cfg, P, d.fontFamily]);

  // ---- camera (Blender lens on a 36 mm sensor, horizontal fit)
  const keys: any[] = shot.keys || [];
  const ch = (fn: (k: any) => number): Key[] => keys.map((k) => [k.f, fn(k)]);
  const cp = keys.map((k) => P(k.cam[0], k.cam[1], k.cam[2])), lp = keys.map((k) => P(k.look[0], k.look[1], 0));
  const cx = kf(ch((k) => cp[keys.indexOf(k)][0]), f), cy = kf(ch((k) => cp[keys.indexOf(k)][1]), f), cz = kf(ch((k) => cp[keys.indexOf(k)][2]), f);
  const tx = kf(ch((k) => lp[keys.indexOf(k)][0]), f), ty = kf(ch((k) => lp[keys.indexOf(k)][1]), f);
  const cam = camera as THREE.PerspectiveCamera, lens = shot.lens ?? 35;
  cam.fov = (2 * Math.atan(Math.tan(Math.atan(18 / lens)) / (W / H)) * 180) / Math.PI;
  cam.near = shot.clip ?? 0.4; cam.far = 20000; cam.up.set(0, 0, 1);
  cam.position.set(cx, cy, cz); cam.lookAt(tx, ty, 0); cam.updateProjectionMatrix();

  // ---- animated values
  const bevel = kf(shot.state_bevel, f, 1.0);
  if (built.states) (built.states.material as LineMaterial).linewidth = bevel * 2;
  if (built.statehi) (built.statehi.material as LineMaterial).linewidth = bevel * 1.6 * 2;
  for (const im of built.imagery) (im.mesh.material as THREE.ShaderMaterial).uniforms.opacity.value = kf(shot.imagery_opacity?.[im.file], f, 1);
  if (shot.counties) for (const m of built.cfill) (m.material as THREE.MeshBasicMaterial).opacity = kf([[shot.counties[0], 0], [shot.counties[0] + 12, 0.07]], f);

  // track: glowing ribbon + bright core, revealed along its length
  let track: React.ReactNode = null;
  if (cfg.track && shot.track) {
    const [f0, f1, s, e] = shot.track, frac = kf([[f0, s], [f1, e]], f);
    const pts = cutPolyline(cfg.track.map(([la, lo]: number[]) => P(la, lo, 0.06)), frac), w = cfg.track_width_km ?? 0.64, core = shot.core_km ?? 0.08;
    const corePts = pts.map((p) => [p[0], p[1], 0.08] as V3), cs: number[] = [];
    for (let i = 1; i < corePts.length; i++) cs.push(...corePts[i - 1], ...corePts[i]);
    track = <group key={"tr" + f}>
      <mesh geometry={ribbon(pts, w * 3)} renderOrder={2}><meshBasicMaterial color={col(1, 0.1, 0.06)} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <mesh geometry={ribbon(pts, w)} renderOrder={3}><meshBasicMaterial color={col(1, 0.16, 0.1)} transparent opacity={0.82} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      {cs.length ? <primitive object={segObj(cs, lineMat(col(1, 0.75, 0.6, 6), core * 2))} renderOrder={4} /> : null}
      {cs.length ? <primitive object={segObj(cs, lineMat(col(1, 0.3, 0.2), core * 7, 0.3))} renderOrder={4} /> : null}
    </group>;
  }
  // dashed travel line between two places, growing from the first
  let line: React.ReactNode = null;
  if (shot.line && cfg.places) {
    const [a, b, f0, f1] = shot.line, pa = P(cfg.places[a][0], cfg.places[a][1], 0.09), pb = P(cfg.places[b][0], cfg.places[b][1], 0.09);
    const sc = Math.max(0.001, kf([[f0, 0.001], [f1, 1]], f)), n = 40, seg: number[] = [];
    const at = (t: number) => [pa[0] + (pb[0] - pa[0]) * t * sc, pa[1] + (pb[1] - pa[1]) * t * sc, 0.09];
    for (let k = 0; k < n; k += 2) seg.push(...at(k / n), ...at((k + 1) / n));
    line = <primitive key={"ln" + f} object={segObj(seg, lineMat(col(1, 1, 1, 2.5), (shot.line_km ?? 0.07) * 2))} renderOrder={5} />;
  }

  const size = shot.label_km ?? 0.9;
  return <>
    <color attach="background" args={[0.008, 0.01, 0.014]} />
    <mesh position={[0, 0, -0.6]}><planeGeometry args={[20000, 20000]} /><meshBasicMaterial color={col(0.018, 0.022, 0.03)} /></mesh>
    {built.imagery.map((im) => <primitive key={im.file} object={im.mesh} />)}
    {built.states ? <primitive object={built.states} /> : null}
    {built.statehi ? <primitive object={built.statehi} /> : null}
    {shot.counties && built.counties ? <primitive object={built.counties} /> : null}
    {shot.counties ? built.cfill.map((m, i) => <primitive key={"cf" + i} object={m} />) : null}
    {track}{line}
    {labels.map((l) => {
      const s = Math.max(0.0001, kf([[l.fin, 0], [l.fin + 8, 1]], f)), th = size * l.txt.hEm, tw = th * l.txt.aspect;
      return <group key={l.name} position={l.p}>
        <mesh scale={s} renderOrder={6}><circleGeometry args={[size * 0.28, 48]} /><meshBasicMaterial color="#ffffff" transparent depthWrite={false} /></mesh>
        <mesh scale={s} renderOrder={6}><ringGeometry args={[size * 0.5, size * 0.6, 64]} /><meshBasicMaterial color="#ffffff" transparent depthWrite={false} side={THREE.DoubleSide} /></mesh>
        <group position={[size * 1.25, 0, 0.02]} scale={s}>
          <mesh position={[tw / 2, 0, 0]} renderOrder={6}><planeGeometry args={[tw, th]} /><meshBasicMaterial map={l.txt.tex} transparent depthWrite={false} /></mesh>
        </group>
      </group>;
    })}
  </>;
};

export const Map3D: React.FC<Map3DProps> = ({ dir, shot, font = "D-DIN-Bold.otf" }) => {
  const frame = useCurrentFrame();
  const d = useMapData(dir, shot, font);
  return <AbsoluteFill style={{ backgroundColor: "#020304" }}>
    {d ? <ThreeCanvas width={W} height={H} flat gl={{ logarithmicDepthBuffer: true, antialias: true, preserveDrawingBuffer: true }}
      camera={{ fov: 40, near: 0.4, far: 20000, position: [0, 0, 100] }}>
      <Scene d={d} f={frame + 1} />
    </ThreeCanvas> : null}
  </AbsoluteFill>;
};
