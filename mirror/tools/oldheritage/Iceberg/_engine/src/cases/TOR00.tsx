// Tornado video — INTRO v4 (3 Nov 2026). Owner: "no raw in intro, just VO with 3D motion or clip", then the map version was rejected ("too
// fast, unsmooth"; "can you have any other, better ... 3-D motion with different clips moving"). Now one continuous cinematic 3-D flight
// through a field of real case clips (TOR00_ClipField): silent clips on planes at different depths, the camera easing to one hero clip per
// VO beat with its red place + year label, the field fanning out on "twenty-five times", STORM CHASERS (Greenfield chase car, radar on the
// dash) on "A few were there on purpose", the Ocala semi beside an ordinary driver on "Most of them weren't", then Moore, the Joplin ER, the
// Chapman wedge, blur-dip into the title. VO straight through from 0.5 s; no clip sound. Old versions: _engine/_bak_intro_raw/.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { VideoTitle } from "../dev/TOR00_VideoTitle";
import { ClipField, type Plane, type Key } from "../dev/TOR00_ClipField";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(20.0);
const V = 0.5;  // VO (INTRO.mp3, whole) starts here
const T = 16.2; // title (VO "Let's begin." at V+15.70)
const D = 470;  // eye distance at a hero (the clip fills ~80 % of the frame)

// heroes: settle frame `at`, source second q playing at that moment (graded windows: lanc 99.6 / after / chase = TOR14 forry 128.4 /
// semi = TOR17 dash 4.0 / carport 48.0 / er 106.0, 6 fps CCTV, lights drop at +1.0 / wedge 215.5)
const H = [
  { id: "after", src: "after.mp4", len: 6.0, x: -220, y: -40, z: -1200, at: 78, q: 0.4, out: 104, label: "WASHINGTON, INDIANA · 2013" },
  { id: "lanc", src: "lanc.mp4", len: 5.6, x: 200, y: 50, z: -2400, at: 192, q: 1.2, out: 222, label: "WASHINGTON, ILLINOIS · 2013" },
  { id: "chase", src: "chase.mp4", len: 3.5, x: -200, y: -40, z: -2920, at: 246, q: 0.6, out: 272, label: "STORM CHASERS" },
  { id: "semi", src: "semi.mp4", len: 3.0, x: 200, y: 40, z: -3440, at: 296, q: 1.1, out: 318, label: "OCALA, FLORIDA · 2022" },
  { id: "carport", src: "carport.mp4", len: 3.0, x: -200, y: -50, z: -3960, at: 342, q: 0.6, out: 384, label: "MOORE, OKLAHOMA · 2013" },
  { id: "er", src: "er.mp4", len: 3.5, x: 200, y: 40, z: -4480, at: 408, q: 0.7, out: 436, label: "JOPLIN, MISSOURI · 2011" },
  { id: "wedge", src: "wedge.mp4", len: 2.53, x: 0, y: 0, z: -5000, at: 460, q: 0.5, out: 482, label: "CHAPMAN, KANSAS · 2016" },
];
const card = (n: string) => GR + "cards/TOR" + n + ".jpg";
const FILL: Plane[] = [
  { id: "f-junko", src: GR + "junko.mp4", len: 3.0, x: 1050, y: -420, z: 200, s: 1.1 },
  { id: "f-c05", src: card("05"), still: true, x: -1150, y: 380, z: -150 },
  { id: "f-clem", src: GR + "clem.mp4", len: 3.8, x: -1000, y: -480, z: -700, s: 0.9 },
  { id: "f-c09", src: card("09"), still: true, x: 1200, y: 420, z: -900 },
  { id: "f-roque", src: GR + "roque.mp4", len: 5.6, x: 1150, y: -380, z: -1590, s: 1.15 },
  { id: "f-c12", src: card("12"), still: true, x: -1200, y: 460, z: -1746 },
  { id: "f-hughes", src: GR + "hughes.mp4", len: 3.0, x: -1100, y: -420, z: -2370 },
  { id: "f-c13", src: card("13"), still: true, x: 1150, y: 450, z: -2526, s: 0.9 },
  { id: "f-drive", src: GR + "drive.mp4", len: 2.8, x: 1100, y: -460, z: -2994 },
  { id: "f-c15", src: card("15"), still: true, x: -1150, y: 420, z: -3150 },
  { id: "f-ring", src: GR + "ring.mp4", len: 3.0, x: -1050, y: -440, z: -3618, s: 0.95 },
  { id: "f-c19", src: card("19"), still: true, x: 1200, y: 430, z: -3774 },
  { id: "f-c20", src: card("20"), still: true, x: 1100, y: -420, z: -4242, s: 1.1 },
  { id: "f-c23", src: card("23"), still: true, x: -1150, y: 450, z: -4398 },
  { id: "f-c22", src: card("22"), still: true, x: -1100, y: -430, z: -4866 },
  { id: "f-c25", src: card("25"), still: true, x: 1150, y: 440, z: -5022 },
  { id: "f-c07", src: card("07"), still: true, x: 1050, y: -400, z: -5568 },
  { id: "f-c03", src: card("03"), still: true, x: -1000, y: 400, z: -5646 },
];
const PLANES: Plane[] = [
  ...H.map((h) => ({ id: h.id, src: GR + h.src, len: h.len, x: h.x, y: h.y, z: h.z, hero: { at: h.at, q: h.q }, drift: 0 })),
  ...FILL.map((p) => ({ ...p, ry: Math.sign(p.x) * -24, drift: 1 })),
];
const eye = (i: number, f: number, dz = 0, dx = 0): Key => ({ f, x: H[i].x + dx, y: H[i].y, z: H[i].z + D + dz });
const PATH: Key[] = [
  { f: 0, x: 0, y: -60, z: 1900 }, { f: 40, x: -120, y: -45, z: 300 },
  ...H.flatMap((h, i) => [eye(i, h.at), eye(i, h.out, -40, i % 2 ? -8 : 8)]).slice(0, 2),
  { f: 140, x: 20, y: 0, z: -560 }, { f: 168, x: 120, y: 30, z: -1500 },
  ...H.slice(1).flatMap((h, i) => [eye(i + 1, h.at), eye(i + 1, h.out, -40, i % 2 ? 8 : -8)]),
];

const CUTS: FxCut[] = [
  { at: F(T), kind: "blurDip", len: 14 }, // into the title
];

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [11.2, X + "wind_gust_1.wav", -30],    // the carport clip is silent
  [13.88, X + "sub_drop_1.wav", -22],     // the ER lights drop (silent CCTV)
  [14.3, X + "impact_2.wav", -24],
  [T - 0.1, "sfx_n2/whoosh_02.wav", -28], // into the title
  [T + 0.5, "sfx_n2/title_hit_01.wav", -26],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(T)} layout="none"><AbsoluteFill>
            <FilmLook_FX grain={0.07}>
              <CameraMotionBlur samples={4} shutterAngle={150}><ClipField planes={PLANES} path={PATH} fan={[104, 144, 170, 195]} focus={D} /></CameraMotionBlur>
            </FilmLook_FX>
            {H.map((h) => <RedLabel key={h.id} text={h.label} at={h.at + 2} hold={h.out - h.at + 2} />)}
          </AbsoluteFill></Sequence>
          <Sequence from={F(T)} durationInFrames={DUR - F(T)} layout="none"><AbsoluteFill>
            <VideoTitle bg={GR + "titlebg.mp4"} bgFrom={2.8} ruleAt={F(1.5)} ruleAfter={1}
              lines={[{ text: "25 MOST DISTURBING", size: 112, at: F(0.25) }, { text: "TORNADO ENCOUNTERS", size: 112, at: F(0.55) }, { text: "EVER CAUGHT ON CAMERA", size: 58, at: F(1.6) }]} />
          </AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the intro take, whole and continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 5 from the first frame under the VO, swells into the title, out with it */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(20)} volume={(f) => dB(-13) * interpolate(f, [0, 15, F(T - 1.0), F(T), DUR - F(1.4), DUR], [0, 1, 1, 1.5, 1.5, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
