# ND10 · The tsunami from the deck of the Chikyu · Hachinohe (code: _engine/src/cases/ND10.tsx + ND10_plan.ts)

Duration ~5:55 (VO 172 s + 12 raws ~175 s). VO = one take (no count word in it), split only at the 12 raws, which follow the cut sheet's cues in order.

## Devices (dev/ND10_*)
- CoastPlate: NASA GIBS Blue Marble shaded relief + bathymetry (public domain), tilted plate, the 2011 hit coast traced, Hachinohe pinned at its north end.
- ShoalProfile: ocean -> port section over the Chikyu's own sea footage, pulse low/long in deep water, tall in the shallows (Green's law, exaggerated). Labels: open ocean under 1 m / port 8-9 m.
- ShipMeasure: 210 m dimension line on "Chikyu 2.jpg" (Wikimedia Commons, CC BY-SA 3.0).
- WallPair: Taro seawall 2007 ("High Seawalls in Tarō, Iwate -2.JPG", Kihkyef, CC BY-SA 3.0) -> 2014 remains ("世界一 田老防潮堤跡.jpg", Yoshio Kohara, CC BY 3.0).
- TrenchVoyage: NASA GIBS relief plate, Hachinohe -> JFAST site C0019 (37.94N 143.91E, IODP Exp. 343, 2012), USGS epicentre 38.297N 142.373E; site depths 6,890 m water / ~850 m into the rock (IODP Exp. 343 report).
- Grammar: Inset (Chikyu 1.jpg, CC BY-SA 3.0; Fukushima I by Digital Globe, CC BY-SA 3.0), Aerial (GSI seamlessphoto, Same harbour + Marient fisheries museum, OSM coords), RedLabels, glitch/blur-dip/zoom-hit.

## Footage (footage/19_...)
- CHK main_u5ohGBAr2mE (Chikyu crew, JAMSTEC), CHK2 extra3_SqNCE3npWSg (Chikyu crew, JAMSTEC; its English commentary "we're in big trouble ... we have just hit the quayside ... twenty degrees" is the climax raw, 54 s uncut).
  Both carry a "© ..., Provided by JAMSTEC" credit line: cropped out (crop 1190x670 top, scaled to 1080p) rather than delogo.
- CG extra1_DVIAHpaNhQs (Japan Coast Guard Hachinohe office via city channel): letterbox cropped. rawclean found music in 50 s of cga / 6 s of cgb -> cleaned wavs used.
- MAR extra2_b18Tg3FVyCo (Same boat harbour, 320x240, silent): shown in fill mode. NAT extra4_taqHehtNUWw (house above the port, silent).
- Silent raws (MAR, NAT) and the near-silent CG raws carry a bed of the Chikyu deck audio (wind + water of the same tsunami, no voices), cleaned wavs.
- All raw audio = rawclean _clean.wav (chk/chk2/cga/cgb). No downloads were needed.

## Decisions / issues
- Raws trimmed to 9-14 s (cut sheet asked ~30 s each; 12 x 30 s would make a 9-minute case); the climax CHK2 raw runs 54 s uncut.
- Music: Music 4 (looped, -21.5 dB), ducked to -9 dB under raws, off under the climax.
- Same harbour box placed on the small boat harbour next to the Marient museum (OSM 40.5397, 141.5628); the MAR clip is presumed to be that harbour (the cut sheet says so).
- Under-VO shots of "oil tanks swept away" use the CG view of the port/tanker area (no clear shot of the small tanks).
