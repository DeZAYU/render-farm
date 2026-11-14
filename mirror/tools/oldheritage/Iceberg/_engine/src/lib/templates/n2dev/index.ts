// Family "n2dev" = the algrow-2 DEVICE PACK (2026-10-26, PEAK_V5 "Non-Blender devices from the references").
// Look = the approved Case 1 v4 (ice-cyan accent, JetBrains Mono HUD / Courier Prime typewriter, cold grade, eased sub-pixel motion).
// Rules: kit.tsx DEV_MIN (asserted at render). Every device: local frames, optional plate (src/from/push/focus), tracked keys where it pins
// to something, SFX cue = sfx.json event (Disasters2/sfx_n2, real recordings) at a LOCAL frame.
import type { VariantDef } from "../../core";
import { DataBox_D, DimBracket_D, EngravedDate_D, HudBracket_D, LoupeGlide_D, RadarRings_D, RadioHud_D } from "./hud";
import { ArchivePush_D, CrtWindow_D, FilmInset_D, Flashback_D, Highlighter_D, LineMap_D, MapPull_D, TiltPhoto_D } from "./archive";
import { Datamosh_D, FreezeReplay_D, SpeakerBox_D, WireHit_D } from "./trans";
import { batch2 } from "./index2";

export * from "./kit";
export * from "./hud";
export * from "./archive";
export * from "./trans";
export * from "./info";
export * from "./diagram";
export * from "./social";

const F = "n2dev";
const ax = (geometry: string, entry: string, layout: string, accent: string) => ({ geometry, entry, layout, accent });
const PLATE = "src?, from?, push?, focus?, grade?, dim?";
const PARTY = "demo/clip_party.mp4", CROWD = "demo/clip_crowd.mp4", FIRE = "demo/clip_fire.mp4", PARK = "demo/clip_park.mp4";
const HELI = "demo/ph_rocaf.jpg", FFC = "demo/ffc_park_g.png", CNA = "demo/cna_abandoned_g.png", KTVU = "demo/pg_ktvu.png";

const batch1: VariantDef[] = [
  { family: F, name: "HudBracket", component: HudBracket_D, durationInFrames: 120, thumbFrame: 70,
    defaultProps: { dur: 120, src: PARTY, text: "MAIN STAGE", sub: "POWDER CANNONS  x6", kind: "object", keys: [{ f: 0, x: 880, y: 560 }, { f: 120, x: 920, y: 575 }], off: [190, -170] },
    ref: "Fern Narco Submarines / Cold War devices 01-03 (fern/devices/01_hud_bracket_label_object.png, 02 person, 03 location)", when: "The VO names a thing / person / place IN the shot (\"the comb plate\", \"the emergency stop\", \"the stage\").",
    props: `dur, text, sub?, kind object|person|place (person: no cross-hair on the body), keys TK[] (tracked point), off [dx,dy], at, ${PLATE}`,
    sfx: [{ event: "dissolve_whoosh", at: 2, note: "-6 dB more, or silent (DD labels are silent)" }], axes: ax("L-brackets + leader", "type-on", "beside object", "ice-cyan leader") },
  { family: F, name: "DimBracket", component: DimBracket_D, durationInFrames: 120, thumbFrame: 60,
    defaultProps: { dur: 120, src: FFC, a: [{ f: 0, x: 520, y: 236 }], b: [{ f: 0, x: 1720, y: 262 }], value: "38 m", sub: "(125 ft)", off: -46 },
    ref: "Fern 12_dimension_bracket.png (submarine length 14 m / 46 feet)", when: "A size / height / gap / distance (\"a 5 cm gap\", \"38 metres long\").",
    props: `dur, a TK[], b TK[] (the two ends, tracked), value, sub?, off (px on the normal), at, ${PLATE}`,
    sfx: [{ event: "dissolve_whoosh", at: 4 }], axes: ax("measure line + ticks", "grows from the middle", "on the object", "ice glow") },
  { family: F, name: "DataBox", component: DataBox_D, durationInFrames: 135, thumbFrame: 100,
    defaultProps: { dur: 135, src: HELI, push: 0.03, focus: [0.44, 0.48], keys: [{ f: 0, x: 840, y: 520 }], big: "S-70C", sub: "rescue helicopter", rows: [{ k: "CREW", v: "4" }, { k: "RANGE", v: "590 km" }], off: [210, -190] },
    ref: "Fern 13_data_box_on_3d.png (7.7 tons / 17,000 pounds box on the 3D sub)", when: "A fact ABOUT the object on screen (model, age, load, weight).",
    props: `dur, keys TK[], big?, sub?, rows?[{k,v}], off [dx,dy], at, ${PLATE}`,
    sfx: [{ event: "page_entry", at: 6, note: "-4 dB" }], axes: ax("4-bracket box", "typed rows", "pinned + leader", "cyan keys") },
  { family: F, name: "RadioHud", component: RadioHud_D, durationInFrames: 150, thumbFrame: 110,
    defaultProps: { dur: 150, src: FIRE, dim: 0.45, lines: [{ who: "DISPATCH", t: "All units, fire reported at the main stage.", at: 10, end: 70 }, { who: "ENGINE 4", t: "Copy. Heavy smoke, sending two crews.", at: 74, end: 146 }] },
    ref: "Fern 14_radio_transcript_hud.png + 42_cyber_waveform_box.png", when: "Radio, 911 call, dispatcher or cockpit audio plays (real audio under it).",
    props: `dur, lines [{who, t, at, end}], channel, amps? (per-frame 0..1 from the real audio), pos left|centre, ${PLATE}`,
    sfx: [{ event: "silent", at: 0, note: "the real radio audio IS the sound" }], axes: ax("waveform box + lines", "typed", "left column", "cyan trace") },
  { family: F, name: "EngravedDate", component: EngravedDate_D, durationInFrames: 120, thumbFrame: 80,
    defaultProps: { dur: 120, src: CNA, push: 0.025, lines: ["JUNE 27", "2015"], plane: { x: 200, y: 720, rx: 48, ry: 0, rz: -6, px: 130 } },
    ref: "Fern 18_date_engraved_in_scene.png (OCTOBER 1971 set into the ice wall)", when: "The case date, as an alternative to the black date card (on a wide establishing shot).",
    props: `dur, lines[], yearLine, plane {x, y, rx, ry, rz, px}, at, ${PLATE}`,
    sfx: [{ event: "case_name_lift", at: 4, note: "only if it opens the case; else dissolve_whoosh" }], axes: ax("perspective plane", "rack-focus per glyph", "in the scene", "amber year") },
  { family: F, name: "LoupeGlide", component: LoupeGlide_D, durationInFrames: 165, thumbFrame: 70,
    defaultProps: { dur: 165, src: KTVU, imgW: 2560, imgH: 4800, crop: [120, 2870, 1540, 1090], spans: [{ r: [769, 3225, 716, 37], at: 18, sweep: 50 }, { r: [290, 3281, 345, 37], at: 96, sweep: 40 }], credit: "KTVU, 7 April 2022" },
    ref: "Fern 20_document_magnifier_lens.png (lens over a document, red word); owner: no circles -> rounded-rect loupe", when: "Quoting one line of a report / ruling / statement.",
    props: "dur, src, imgW, imgH, crop [x,y,w,h], spans [{r [x,y,w,h] image px, at, sweep}], mag, credit",
    sfx: [{ event: "page_entry", at: 0 }], axes: ax("dark page + loupe", "fade", "glides along the line", "amber hairline") },
  { family: F, name: "RadarRings", component: RadarRings_D, durationInFrames: 150, thumbFrame: 90,
    defaultProps: { dur: 150, src: "demo/mapstill.png", keys: [{ f: 0, x: 1180, y: 520 }], label: "SEARCH AREA", sub: "RADIUS  2.4 KM" },
    ref: "Fern 25_radar_rings_over_sea.png", when: "Search / rescue, a ship, a missing person, a signal (\"the coast guard searched...\").",
    props: `dur, keys TK[] (centre), label?, sub?, rings, period (>=30 f), maxR, ${PLATE}`,
    sfx: [{ event: "sub_pulse", at: 0, note: "-6 dB, once" }], axes: ax("expanding rings + sweep", "fade", "tracked centre", "cyan") },
  { family: F, name: "Flashback", component: Flashback_D, durationInFrames: 150, thumbFrame: 90,
    defaultProps: { dur: 150, src: PARK, photo: FFC, caption: "JULY 2014" },
    ref: "Fern 23_flashback_old_photo_frame.png + 29_archive_film_grade.png", when: "Backstory: \"years earlier\", \"when it opened in 2005\".",
    props: `dur, photo, photoFrom?, caption?, at, tilt, ${PLATE} (the present shot it leaves)`,
    sfx: [{ event: "dissolve_whoosh", at: 10 }], axes: ax("print frame", "dip + settle", "centre", "sepia archive") },
  { family: F, name: "MapPull", component: MapPull_D, durationInFrames: 150, thumbFrame: 120,
    defaultProps: { dur: 150, src: HELI, obj: [840, 520], geo: "demo/taiwan.json", pin: [150, 40], place: "NEW TAIPEI" },
    ref: "Fern 24_3d_to_map_icon_morph.png", when: "Going from the incident to WHERE it is (\"...off the coast of New Taipei\").",
    props: `dur, obj [x,y] (object in the shot), geo (json of SVG paths), pin [gx,gy] (geo units), place?, at, ${PLATE}`,
    sfx: [{ event: "transition_whoosh", at: 24, note: "-4 dB" }], axes: ax("tile -> line map", "shrink + pull-out", "pin", "cyan tile edge") },
  { family: F, name: "CrtWindow", component: CrtWindow_D, durationInFrames: 150, thumbFrame: 100,
    defaultProps: { dur: 150, media: CROWD, title: "IMG_2047.MOV", tag: "W. Chen", tagAt: 40 },
    ref: "Fern 31_xp_desktop_crt_treatment.png + 32_xp_window_name_tag_on_3d.png", when: "Online posts, forums, old internet, \"he uploaded it that night\" + who uploaded it.",
    props: `dur, media, mediaFrom?, title, tag?, tagAt, ${PLATE} (blurred backdrop; defaults to the media)`,
    sfx: [{ event: "glitch", at: 0, note: "-8 dB" }], axes: ax("desktop window", "scale-in", "centre + tag", "CRT scanlines") },
];
const batch1b: VariantDef[] = [
  { family: F, name: "Highlighter", component: Highlighter_D, durationInFrames: 120, thumbFrame: 90,
    defaultProps: { dur: 120, src: KTVU, crop: [180, 2930, 1400, 788], spans: [{ r: [769, 3225, 716, 37], at: 18, sweep: 22 }, { r: [290, 3281, 345, 37], at: 46, sweep: 14 }], credit: "KTVU, 7 April 2022" },
    ref: "Fern 34_yellow_highlight_article.png + 35_greentext_highlight.png", when: "THE key sentence of a news story.",
    props: "dur, src, crop [x,y,w,h], spans [{r, at, sweep>=12}], credit, dir",
    sfx: [{ event: "page_entry", at: 0 }], axes: ax("light page close-up", "drift", "full width", "amber marker") },
  { family: F, name: "FilmInset", component: FilmInset_D, durationInFrames: 150, thumbFrame: 80,
    defaultProps: { dur: 150, src: PARTY, inset: CROWD, caption: "ANGLE 2  ·  CROWD, 20:32" },
    ref: "Fern 47_cyber_boxed_film_inset.png", when: "A 2nd angle of the same moment while keeping the context.",
    props: `dur, inset, insetFrom?, caption?, box [cx, cy, w], at, ${PLATE} (the main shot behind)`,
    sfx: [{ event: "dissolve_whoosh", at: 0 }], axes: ax("framed inset", "scale-in", "centre", "ice frame") },
  { family: F, name: "LineMap", component: LineMap_D, durationInFrames: 150, thumbFrame: 100,
    defaultProps: { dur: 150, geo: "demo/taiwan.json", pin: [150, 40], place: "NEW TAIPEI", coords: "25.01° N   121.47° E" },
    ref: "LEMMiNO minimal line map (thin white coastlines on black, spaced caps)", when: "A calm place reveal between intense beats.",
    props: "dur, geo (json of SVG path strings), pin [gx, gy], place, coords?, z0, z1",
    sfx: [{ event: "dissolve_whoosh", at: 0 }], axes: ax("outline map", "draw-on + drift", "pin + caps", "cyan diamond") },
  { family: F, name: "ArchivePush", component: ArchivePush_D, durationInFrames: 150, thumbFrame: 100,
    defaultProps: { dur: 150, src: HELI, source: "Photo: ROC Air Force", date: "28 June 2015", focus: [0.44, 0.5] },
    ref: "LEMMiNO slow archival push + thin sans source caption bottom-left", when: "A real photo / document: quiet premium beat.",
    props: "dur, src, from?, s0, s1, focus, source, date?, archive (0..1 archive grade)",
    sfx: [{ event: "silent", at: 0, note: "music carries it" }], axes: ax("full-frame photo", "eased push", "caption bottom-left", "none") },
  { family: F, name: "TiltPhoto", component: TiltPhoto_D, durationInFrames: 120, thumbFrame: 70,
    defaultProps: { dur: 120, src: FFC, caption: "THE LAZY RIVER, 2014" },
    ref: "Visual Venture tilted print + KenBurnsParallax", when: "A single real photo of a person / place.",
    props: "dur, src, fg? (cut-out layer for parallax), rot0, rot1, caption?",
    sfx: [{ event: "page_entry", at: 10 }], axes: ax("tilted print", "drop + settle", "centre", "soft shadow") },
  { family: F, name: "WireHit", component: WireHit_D, durationInFrames: 90, thumbFrame: 42,
    defaultProps: { dur: 90, a: PARK, aFrom: 3, b: CROWD, bFrom: 1, cut: 45, len: 16 },
    ref: "Fern 27_glitch_wireframe_hit.png", when: "A hard turn in the story (\"then everything changed\"). <= 1 per case.",
    props: "dur, a, b, aFrom?, bFrom?, cut (frame of B), len 12-24 (each wire state >= 6 f)",
    sfx: [{ event: "glitch", at: 37 }], axes: ax("edge wireframe", "2 held states", "full frame", "ice-cyan lines") },
  { family: F, name: "Datamosh", component: Datamosh_D, durationInFrames: 90, thumbFrame: 46,
    defaultProps: { dur: 90, a: PARK, b: CROWD, bFrom: 1, cut: 45, len: 18 },
    ref: "Fern 38_datamosh_transition.png", when: "Time jump / memory break between two clips.",
    props: "dur, a, b, aFrom?, bFrom (>= len/60 s), cut, len 12-30 (states of 6 f)",
    sfx: [{ event: "glitch", at: 36, note: "-4 dB" }], axes: ax("block smear", "stepped states", "full frame", "none") },
  { family: F, name: "FreezeReplay", component: FreezeReplay_D, durationInFrames: 135, thumbFrame: 70,
    defaultProps: { dur: 135, src: PARK, freezeAt: 30, hold: 40, keys: [{ f: 30, x: 1180, y: 760 }, { f: 60, x: 1150, y: 765 }], zoom: 1.9, rate: 0.5, tag: "REPLAY  0.5x" },
    ref: "Disturbing Dose freeze-punch + tracked replay (refs/dd), no circles", when: "\"Look at...\", \"watch his left hand\": the VO points at a moment.",
    props: "dur, src, from, freezeAt, hold>=24, keys TK[] (source frames), zoom, rate, tag?",
    sfx: [{ event: "heartbeat_bed", at: 30, note: "slow, under the slow-mo" }], axes: ax("freeze + zoom", "eased punch", "tracked", "soft vignette") },
  { family: F, name: "SpeakerBox", component: SpeakerBox_D, durationInFrames: 120, thumbFrame: 60,
    defaultProps: { dur: 120, src: CROWD, who: "WITNESS", keys: [{ f: 0, x: 1360, y: 740 }, { f: 120, x: 1330, y: 735 }], side: -1, lines: [{ t: "Something's burning up there.", at: 8, end: 56 }, { t: "Get back, get back!", at: 62, end: 112 }] },
    ref: "DD / VV speaker captions boxed beside the speaker", when: "Raw clips with talking (the real sound plays).",
    props: `dur, who, lines [{t, at, end, tr?}], keys TK[] (speaker), side 1|-1, ${PLATE}`,
    sfx: [{ event: "silent", at: 0, note: "raw audio" }], axes: ax("HUD box", "phrase fades", "beside speaker", "cyan name") },
];
export const variants: VariantDef[] = [...batch1, ...batch1b, ...batch2];
