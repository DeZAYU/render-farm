// Tornado #1 — Fairdale (Clem Schultz), v5: rebuilt in the grammar of the owner's reference (Occult Inquisitor, _ref/, see brand.tsx).
// Footage carries the case; graphics are only TitleCard / RedLabel / Inset / Aerial (real NAIP) + WirePrint (warning off the wire) + SurveyRows (survey summary) + one Blender
// track. VO = one continuous take, split once for the climax raw (Clem's own sound, 19.9 s, faded out BEFORE the VO comes back: the
// v4 overlap at 1:41 is gone), then the moment is replayed in slow motion under "The house came down around them".
// Zero flash: chase source cuts 76.9 / 90.97 / 96.77 / 146.2, lightning 3.5-3.8 / 22.3 / 51.5 / 57.1-59.5 / 70.4-71.0 / 83.0 / 90.7-90.9
// / 98.8-99.2 / 111-112.7 / 135.8-136.5; clem glitch 11.67-11.83, black from 114.6. Every window below avoids them.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { WirePrint } from "../dev/TOR01_WirePrint";
import { SurveyRows } from "../dev/TOR01_SurveyRows";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, MarkMap, RedLabel, TitleCard } from "../brand";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MAP = C + "maps/", SH = C + "shots/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(139.7);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const P = (abs: number, a: number) => F(abs) - F(a);

// the NWS survey summary (weather.gov/lot/2015_04_09_tornadoes), re-typeset; rows land on "EF4" / "two hundred" / "forty-one minutes"
const statement = (dur: number) => (
  <SurveyRows at={[2, 22, 76]} rating="EF-4" wind={200} t0="6:39 PM" t1="7:20 PM" mins={41} credit="NWS CHICAGO · DAMAGE SURVEY"
    bg={<Shot_FX src={GR + "wedge.mp4"} n={dur} from={190.0} s0={1.0} s1={1.04} />} />
);
// the real warning text (IEM TORLOT 2335Z), printed off the wire; "tornado warning" ~2.4 s, "6:35" ~3.7 s into the shot
const warning = () => (
  <WirePrint credit="NWS CHICAGO · TORNADO WARNING, 6:35 PM" pushAt={64} pushTo={1.2} cpf={3}
    lines={["BULLETIN - EAS ACTIVATION REQUESTED", "TORNADO WARNING", "NATIONAL WEATHER SERVICE CHICAGO/ROMEOVILLE IL", "635 PM CDT THU APR 9 2015", "",
      "THE NATIONAL WEATHER SERVICE IN CHICAGO HAS ISSUED A", "", "* TORNADO WARNING FOR...", "  SOUTHEASTERN OGLE COUNTY..."]}
    marks={[{ line: 1, at: 70, red: true }, { line: 3, at: 108, c0: 0, c1: 10 }]} />
);

const SHOTS: Sh[] = [
  // VO 4.00 line 1: "Number one. It's the evening of Thursday the 9th of April 2015, in Fairdale, Illinois. Clem Schultz is eighty-five and at home. His wife Geri is in the kitchen."
  { a: 4.0, b: 8.5, vo: "It's the evening of Thursday the 9th of April 2015 (the storm; red date label)", src: "chase.mp4", from: 14.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.55,
    over: <RedLabel text="APRIL 9, 2015" at={F(1.4)} hold={F(2.9)} /> },
  { a: 8.5, b: 12.6, vo: "in Fairdale, Illinois. Clem Schultz is eighty-five and at home. (real aerial of the village, white box, red label)",
    node: <Aerial src={GR + "fairdale_today.jpg"} iw={4000} ih={3500} spot={[1940, 1180, 2620, 1620]} z0={1.0} z1={1.35} label="FAIRDALE, ILLINOIS" boxAt={6} labelAt={12} /> },
  { a: 12.6, b: 14.6, vo: "His wife Geri is in the kitchen. (inside the Schultz house: his window)", src: "clem.mp4", from: 60.4, s0: 1.06, s1: 1.1, fx: 0.55, fy: 0.45 },
  { a: 14.6, b: 18.4, vo: "To the south, the tornado is already on the ground (punch onto the funnel)", src: "chase.mp4", from: 30.0, s0: 1.04, s1: 1.08, fx: 0.73, fy: 0.62,
    punches: [{ at: P(15.8, 14.6), to: 1.16, len: 22 }] },
  { a: 18.4, b: 20.6, vo: "under a wall cloud that nearly sits on the fields. (Orange_Peel_STI, Rochelle: the wedge over the fields)", src: "wedge.mp4", from: 173.0, s0: 1.04, s1: 1.09, fx: 0.4, fy: 0.45 },
  { a: 20.6, b: 23.46, vo: "It grew to seven hundred yards across. (the wedge at its widest)", src: "wedge.mp4", from: 200.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.45 },
  // VO line 2 (23.46)
  { a: 23.46, b: 28.4, vo: "EF4, close to 200 mph, 41 minutes on the ground. (NWS survey: SurveyRows)", node: statement(F(28.4) - F(23.46)) },
  { a: 28.4, b: 33.86, vo: "Near Rochelle it had already flattened well-built houses before it got anywhere near Clem's street. (NWS photo: EF4 homes NW of Rochelle)",
    src: GR + "nw_rochelle.jpg", still: true, s0: 1.03, s1: 1.13, fx: 0.5, fy: 0.5, over: <RedLabel text="ROCHELLE, ILLINOIS" at={10} /> },
  { a: 33.86, b: 36.56, vo: "This wasn't a weak tornado clipping the edge of a village,", src: "chase.mp4", from: 77.6, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.6 },
  { a: 36.56, b: 40.23, vo: "and nothing standing above ground in Fairdale was going to stop it.", src: "chase.mp4", from: 91.7, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55 },
  // VO line 3 (40.23)
  { a: 40.23, b: 45.73, vo: "The forecast office had upgraded its warning to a tornado warning at 6:35 that evening. (the warning off the wire: WirePrint)", node: warning() },
  { a: 45.73, b: 48.43, vo: "The tornado touched down about four minutes later.", src: "chase.mp4", from: 8.0, s0: 1.05, s1: 1.12, fx: 0.55, fy: 0.6 },
  // VO lines 4-5 (48.43 / 52.30): Clem's window
  { a: 48.43, b: 52.3, vo: "Inside the Schultz house it's dusk, and the power is going.", src: "clem.mp4", from: 4.2, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.45 },
  { a: 52.3, b: 55.9, vo: "Each of those flashes is a transformer or a line failing. (white-framed zoom onto the flashes)",
    node: <Inset src={GR + "clem.mp4"} from={14.0} box={0.6} pos="74% 40%" drift={0.1} /> },
  { a: 55.9, b: 59.3, vo: "Spotters use them at night to track a tornado they can't see,", src: "clem.mp4", from: 26.0, s0: 1.1, s1: 1.15, fx: 0.3, fy: 0.45 },
  { a: 59.3, b: 62.84, vo: "and a row of them heading your way means exactly what you'd guess.", src: "clem.mp4", from: 38.0, s0: 1.3, s1: 1.34, fx: 0.6, fy: 0.4,
    punches: [{ at: P(60.0, 59.3), to: 1.1, len: 24 }] },
  // VO line 6 (62.84)
  { a: 62.84, b: 67.6, vo: "Near Rochelle, the same tornado had already destroyed the Ogle County sheriff's own home. (the same tornado, filmed at Rochelle)", src: "wedge.mp4", from: 133.0, s0: 1.03, s1: 1.09, fx: 0.45, fy: 0.45 },
  // RAW 67.6-87.5: the climax, Clem's own camera and sound as the tornado takes the house (uncut)
  { a: 67.6, b: 87.5, vo: "RAW: the tornado reaches the house", src: "clem.mp4", from: 90.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.42 },
  // VO line 7 (88.26): "The house came down around them." — the moment again, slow
  { a: 87.5, b: 90.16, vo: "The house came down around them. (slow replay of the hit)", src: "clem_replay.mp4", from: 0.3, s0: 1.08, s1: 1.18, fx: 0.55, fy: 0.42 },
  { a: 90.16, b: 92.26, vo: "Geri, who was sixty-seven, didn't survive. (the last frame of Clem's own video, fading down)", src: GR + "clem_last.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 92.26, b: 95.96, vo: "A neighbour dug Clem out of the rubble with a broken vertebra, (NWS: the rubble in Fairdale)", src: GR + "fairdale2.jpg", still: true, s0: 1.04, s1: 1.14, fx: 0.62, fy: 0.55 },
  { a: 95.96, b: 98.26, vo: "and their dog, Missy, came out alive too. (drone over the village days later)", src: "drone2015.mp4", from: 5.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 98.26, b: 102.96, vo: "In another home in the village, Jacklyn Klosa, sixty-nine, was lost as well. (NWS: Fairdale)", src: GR + "fairdale3.jpg", still: true, s0: 1.12, s1: 1.04, fx: 0.7, fy: 0.4 },
  { a: 102.96, b: 107.36, vo: "Thirteen homes in Fairdale were destroyed and about seventy-one damaged. (CAP aerial: each wiped-out lot marked as it is counted)",
    node: <MarkMap src={GR + "cap_fairdale.jpg"} iw={1600} ih={1067} focus={[1180, 520]} z0={1.55} z1={1.75} at={4} every={6} size={30}
      marks={[[905, 468], [965, 458], [1015, 478], [1070, 462], [1120, 480], [1175, 450], [1235, 475], [1290, 455], [1335, 515], [1395, 505], [1460, 500], [1515, 545], [1555, 590]]} /> },
  { a: 107.36, b: 113.26, vo: "Twenty-two people were hurt along the whole track… nineteen million dollars. (the whole track)", node: <Shot_FX src={MAP + "M4_track.mp4"} n={F(113.26) - F(107.36)} s0={1.0} s1={1.0} /> },
  { a: 113.26, b: 116.46, vo: "Inside your own house at dusk, with the lights failing,", src: "clem.mp4", from: 68.5, s0: 1.05, s1: 1.1, fx: 0.45, fy: 0.45 },
  { a: 116.46, b: 119.56, vo: "there's no single moment that tells you it's too late to move.", src: "clem.mp4", from: 48.0, s0: 1.34, s1: 1.4, fx: 0.55, fy: 0.4 },
  { a: 119.56, b: 123.26, vo: "Seventeen houses in the village were knocked off their foundations. (from the plane: the wiped blocks)", src: "plane.mp4", from: 190.0, s0: 1.08, s1: 1.16, fx: 0.62, fy: 0.5 },
  { a: 123.26, b: 125.36, vo: "Clem didn't rebuild there. (drone: the village days later)", src: "drone2015.mp4", from: 13.0, s0: 1.08, s1: 1.14, fx: 0.45, fy: 0.55 },
  { a: 125.36, b: 129.56, vo: "That August he moved to a small farm in Genoa, and built a little house. (pulling away over the farmland)", src: GR + "region_today.jpg", still: true, s0: 2.6, s1: 1.6, fx: 0.62, fy: 0.42 },
  { a: 129.56, b: 132.16, vo: "He later said Geri is there with him every day. (Fairdale at sunset)", src: "drone2019.mp4", from: 39.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 132.16, b: 135.16, vo: "He gave the Fairdale land to his grandson. (Fairdale four years on, drone)", src: "drone2019.mp4", from: 66.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 135.16, b: 139.7, vo: "Ten years on, the survivors gathered in Fairdale to mark the anniversary. (the village at dusk, drone)", src: "drone2019.mp4", from: 184.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },     // title card -> the case (the reference's digital glitch hand-off)
  { at: F(107.36), kind: "glitch", len: 8 },   // into the track
  { at: F(55.9), kind: "blurDip", len: 10 },   // same window, new framing (designed, not a jump)
  { at: F(59.3), kind: "blurDip", len: 10 },
  { at: F(87.5), kind: "blurDip", len: 12 },   // raw -> its slow replay
  { at: F(116.46), kind: "blurDip", len: 10 },
  { at: F(135.16), kind: "blurDip", len: 12 },   // two drone passes over the village
  { at: F(90.16), kind: "blurDip", len: 10 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],     // title -> case
  [8.55, "sfx_n2/whoosh_02.wav", -30],     // the aerial
  [23.5, "sfx_n2/page_in_01.wav", -31],
  [28.45, X + "camera_shutter_2.wav", -26], // the photo
  [40.27, "sfx_n2/page_in_02.wav", -31],
  [52.35, "sfx_n2/whoosh_01.wav", -31],    // the zoom onto the flashes
  [107.36, "sfx_n2/glitch_03.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="DUSK IN THE SCHULTZ HOUSE" bg={GR + "clem_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>

      {/* VO: one continuous take; split once for the climax raw, and it only comes back after the raw has faded out */}
      {/* "Number one." removed (owner): the take starts at 35 f (1.167 s, in the silence before "It's the evening"), everything else stays in place */}
      <Sequence from={F(4.0) + 35} durationInFrames={F(63.6) - 35} layout="none"><Audio src={staticFile("vor/CASE01.mp3")} startFrom={35} /></Sequence>
      <Sequence from={F(88.0)} layout="none"><Audio src={staticFile("vor/CASE01.mp3")} startFrom={F(63.6)} /></Sequence>
      {/* the climax: Clem's own sound, full level, out over the last 0.7 s (silence before the VO returns) */}
      <Sequence from={F(67.6)} durationInFrames={F(87.5) - F(67.6)} layout="none">
        <Audio src={staticFile(C + "media/clem_clean.wav")} startFrom={F(90.0)} volume={(f) => dB(-1) * interpolate(f, [0, 5, F(19.2), F(19.9)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient (Eternal Moment, Farrell Wooten), out before the climax, back low for the aftermath */}
      <Sequence from={F(4.0)} durationInFrames={F(67.6) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} volume={(f) => dB(-13) * interpolate(f, [0, 30, F(60.0), F(63.4)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(91.0)} durationInFrames={F(139.7) - F(91.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(62)} volume={(f) => dB(-15) * interpolate(f, [0, F(3), F(46.5), F(48.7)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
