// GX-ADmixDD pilot intro "20 Most Disturbing Dashcam Moments" (VO i00, 39.92 s). Video only; audio is mixed in ffmpeg.
// Cut frames = VO word times x 30 (see productions/gx-dashcam20/build/intro_beatmap.md).
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { C, PUSH } from './tokens';
import { Footage } from './devices/Footage';
import { SolarizeSpot } from './devices/SolarizeSpot';
import { PlacePlate } from './devices/PlacePlate';
import { VideoTitle } from './devices/VideoTitle';
import './fonts';

const CUTS = [0, 63, 131, 197, 282, 344, 446, 511, 584, 682, 747, 815, 906, 1024, 1089, 1165, 1212, 1344];
export const INTRO_FRAMES = CUTS[CUTS.length - 1];

type Shot = { kind: 'clip'; src: string; rate: number; origin?: string } | { kind: 'sol' } | { kind: 'place'; text: string; y0: number; y1: number; typeAt: number; cps?: number; seed: string } | { kind: 'title' };

const SHOTS: Shot[] = [
  { kind: 'clip', src: 'intro/s01.mp4', rate: PUSH.footage }, // SPX calm street D15a — "Most dashcam footage… boring"
  { kind: 'clip', src: 'intro/s02.mp4', rate: PUSH.footage }, // GC road — "video on earth. Hours of"
  { kind: 'clip', src: 'intro/s03.mp4', rate: PUSH.footage }, // GC road street — "white lines, red lights and traffic"
  { kind: 'clip', src: 'intro/s04.mp4', rate: PUSH.pullOut }, // SPX workers D15a pull-out — "nobody ever watches"
  { kind: 'clip', src: 'intro/s05.mp4', rate: PUSH.footage }, // GC road — "But every once in a while"
  { kind: 'clip', src: 'intro/s06.mp4', rate: PUSH.footage, origin: '45% 40%' }, // GC cabin — "camera on the windscreen catches something"
  { kind: 'clip', src: 'intro/s07.mp4', rate: PUSH.footage, origin: '45% 40%' }, // GC cabin agitated — "within seconds an ordinary drive"
  { kind: 'sol' }, // GC road D9b solarize spot — "worst day of someone's life"
  { kind: 'clip', src: 'intro/s09.mp4', rate: PUSH.footage }, // GC road — "twenty of them, strongest first"
  { kind: 'clip', src: 'intro/s10.mp4', rate: PUSH.footage }, // GC road overtaking — "a man who calls himself Jesus"
  { kind: 'clip', src: 'intro/s11.mp4', rate: PUSH.footage, origin: '40% 45%' }, // GC cabin lean-in — "own rampage in a stolen car"
  { kind: 'place', text: 'SINGAPORE', y0: 72, y1: 80, typeAt: 4, seed: 'sg' }, // "a Singapore road… swallows a car"
  { kind: 'clip', src: 'intro/s13.mp4', rate: PUSH.footage, origin: '50% 35%' }, // SPX blast on "blowing apart" — Wisconsin
  { kind: 'clip', src: 'intro/s13b.mp4', rate: PUSH.footage, origin: '50% 35%' }, // SPX aftermath plume (jump forward) — "two American bird photographers…"
  { kind: 'place', text: 'TABASCO, MEXICO', y0: 80, y1: 92, typeAt: 22, cps: 2, seed: 'mx' }, // types from 37.03 s, 0.22 s before "Mexican" 37.25; cursor idles from f6 // "bird photographers… Mexican back road"
  { kind: 'clip', src: 'intro/s15_thr.mp4', rate: PUSH.replay }, // D8a threshold replay of the fireball — "Let's begin"
  { kind: 'title' }, // D2 video title + dive
];

export const Intro: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    {SHOTS.map((s, i) => {
      const from = CUTS[i];
      const dur = CUTS[i + 1] - from;
      let el: React.ReactNode = null;
      if (s.kind === 'clip') el = <Footage src={s.src} rate={s.rate} origin={s.origin} />;
      else if (s.kind === 'sol') el = <SolarizeSpot src="intro/s08.mp4" solSrc="intro/s08_sol.mp4" freezeAt={26} dur={dur} cx="52%" cy="50%" w={46} />;
      else if (s.kind === 'place') el = <PlacePlate dur={dur} text={s.text} y0={s.y0} y1={s.y1} typeAt={s.typeAt} cps={s.cps} burstIn={6} burstOut={5} seed={s.seed} />;
      else el = <VideoTitle />;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`shot${i + 1}`}>
          {el}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
