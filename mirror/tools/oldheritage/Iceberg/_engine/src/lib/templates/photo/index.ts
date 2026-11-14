// Family "photo": photo cards. All timing props are LOCAL frames. See each file's header for the measured reference.
import type { VariantDef } from "../../core";
import { ArchiveStill } from "./ArchiveStill";
import { FilmStrip } from "./FilmStrip";
import { PagePhotoCrop } from "./PagePhotoCrop";
import { PhotoStack } from "./PhotoStack";
import { TornPrint } from "./TornPrint";
import { KenBurnsParallax } from "./KenBurnsParallax";
import { PushThroughFrame } from "./PushThroughFrame";
import { Polaroid } from "./Polaroid";
import { PortraitFile } from "./PortraitFile";
import { SiriusDrop } from "./SiriusDrop";
import { TornHorizon } from "./TornHorizon";
import { VVSettle } from "./VVSettle";

export const variants: VariantDef[] = [
  {
    family: "photo", name: "VVSettle", component: VVSettle,
    defaultProps: { src: "demo/chu_g.png", aspect: 1020 / 1358, name: "NAME SURNAME", nameAt: 34, mono: 0.6 },
    durationInFrames: 120, thumbFrame: 100, stripFrames: [0, 8, 20, 34, 44, 52, 61, 100],
    ref: "Visual Venture @ 1:29.3 (de Carli photo/name card, MOTION §5); wp3 sec_B HurtCard @ 5268, sec_C ChuCard @ 5903",
    when: "Introducing a person (name on the word) or a single still that must feel weighty: an official, a victim alive, a key witness. One per case at most.",
    props: "src, aspect, pos, name?, nameAt, mono (0 colour..1 B/W), pull 0.16-0.23, over, rot [from,to], settle, seed",
    twist: "off-white torn paper fringe; keeps receding after the settle (never dead); optional trace of colour; 1-frame letter dropouts in the wipe as measured",
    sfx: [{ event: "title_word_hit", at: 34, note: "soft, on the name wipe" }],
    axes: { geometry: "tilted torn print on teal", entry: "oversize pull-back + rotate", layout: "centred print, name low", accent: "teal neon wipe" },
  },
  {
    family: "photo", name: "SiriusDrop", component: SiriusDrop,
    defaultProps: { src: "demo/n2019_pts.png", aspect: 0.815, pos: "52% 40%", from: "below", note: ["a short context note", "in lowercase, two lines"], noteAt: 30, exitAt: 96 },
    durationInFrames: 140, thumbFrame: 70, stripFrames: [0, 6, 12, 20, 30, 54, 100, 112, 124],
    ref: "SIRIUS @ 13:18 (Paret portrait, card slides up 1.8 s) and @ 14:10 (drops from the top, falls out ease-in 1.25 s), STUDY E5/R5 + R4 context note",
    when: "A sober, documentary beat: a portrait or evidence photo shown plainly on black, entering and leaving by gravity. Good after a loud beat.",
    props: "src, aspect, pos, from 'below'|'above', exitAt?, note?: string[], noteAt, mono",
    twist: "DD inner vignette, +0.6 %/s push inside the card instead of a dead hold, motion blur on the fast part of entry/exit",
    axes: { geometry: "tall untilted card on black", entry: "vertical gravity slide", layout: "centred, note bottom-left", accent: "none (grey lowercase note)" },
  },
  {
    family: "photo", name: "TornHorizon", component: TornHorizon,
    defaultProps: { src: "demo/clip_park.mp4", year: "2019", title: "SEVERAL YEARS LATER", yearAt: 6, titleAt: 16, photoAt: 22, colourAt: 64, badge: "58:51", badgeAt: 72 },
    durationInFrames: 120, thumbFrame: 96, stripFrames: [4, 10, 16, 22, 28, 34, 44, 66, 96],
    ref: "Visual Venture @ 22:40 ('2009 / VIDEO LEAKED ON YOUTUBE') and @ 17:42 (MOTION §3 date card); wp3 sec_A DateCard @ 1204",
    when: "A time jump told with an image: 'years later', 'in 2019 the video surfaced'. The print can be a live clip.",
    props: "src (still/clip), aspect, year, title, yearAt, titleAt, photoAt, colourAt, badge?, badgeAt, accent, lineY",
    twist: "torn paper fringe, print keeps rising 0.12 px/f while cut by the line, amber plate glow grows with the colour bloom",
    sfx: [{ event: "transition_whoosh", at: 16, note: "subtitle slide" }],
    axes: { geometry: "print behind a horizon line", entry: "rise from behind the line (on twos)", layout: "line + year + amber title", accent: "amber Bebas glow + B/W->colour" },
  },
  {
    family: "photo", name: "Polaroid", component: Polaroid,
    defaultProps: {
      attach: "peg",
      items: [
        { src: "demo/cna_abandoned_g.png", at: 0, caption: "Place Name", red: "2019", redAt: 30 },
        { src: "demo/ffc_park_g.png", at: 40, caption: "before" },
        { src: "demo/mapstill.png", at: 70, caption: "after", red: "today", redAt: 92 },
      ],
    },
    durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 10, 30, 44, 52, 72, 84, 110, 140],
    ref: "Dashcam Vol.2 @ 18:44 (polaroid on a clothesline, I13) + Dashcam Vol.1 @ 14:44.4 (corkboard E12/I11); wp3 sec_C Cork @ 7377",
    when: "Two to four related photos (before/after, places, people) as found evidence; the caption names the place, the red word lands on its word. attach='pin' for a cork board.",
    props: "items {src, at, caption?, red?, redAt?, x?, y?, rot?, aspect?, pos?}[] (1-4), attach 'peg'|'pin', board, zFrom, pull",
    twist: "one continuous DD pull-back that ends framing the whole cluster; peg prints drop and swing then sway at 0.4 Hz; captions are counter-scaled so the settled on-screen cap = labelCap (30)",
    sfx: [{ event: "title_word_hit", at: 40, note: "soft paper/peg hit per print" }],
    axes: { geometry: "white-frame polaroids on a line", entry: "drop + swing / fade-settle", layout: "cluster, caption on margin", accent: "red ink word + pins/pegs" },
  },
  {
    family: "photo", name: "KenBurnsParallax", component: KenBurnsParallax,
    defaultProps: {
      src: "demo/ffc_park_g.png", push: 0.016, parallax: 1.1, origin: [0.5, 0.2], bgBlur: 1.2,
      mask: { shape: "poly", pts: [0, 0.387, 0.24, 0.13, 1, 0.169, 1, 0.427, 0.345, 0.387, 0.24, 0.369, 0, 0.627], feather: 3 },
      words: [{ text: "Place", at: 12 }, { text: "Name", at: 20 }], label: { x: 0.46, y: 0.53, cap: 52 },
    },
    durationInFrames: 120, thumbFrame: 90, stripFrames: [0, 1, 2, 3, 12, 20, 60, 119],
    ref: "Farrell GF @ 7:22 (text T1b label inside the pushing photo) + GF @ 8:33.08 (camera R5 flash-decay); OF @ 0:39.1 opener photo push; wp3 sec_A beat 3 @ 852",
    when: "Establishing a place or a scene with a single real photo; the label is the place name. Use for openers / scene-setting, not for evidence photos (those stay flat).",
    props: "src, fg? (cut-out PNG) | mask {shape rect|ellipse|poly, pts (frame fractions), feather}, push, parallax, origin, pan, bgBlur, words, label {x,y,cap,align}, flash",
    twist: "2.5-D: masked foreground pushes faster than the background and occludes the label (Farrell keeps photos flat; ours is for openers only)",
    sfx: [{ event: "white_flash_hit", at: 0, note: "soft, flash-decay entry" }],
    axes: { geometry: "full-frame photo, 2 layers", entry: "flash-decay, linear push", layout: "label inside the photo", accent: "occlusion depth" },
  },
  {
    family: "photo", name: "PortraitFile", component: PortraitFile,
    defaultProps: { bg: "demo/clip_crowd.mp4", src: "demo/voa_lu_g.png", pos: "45% 40%", zoom: 1.0, sub: "role or age", name: "NAME SURNAME", at: 10, line: { x: 1500, y: 620 } },
    durationInFrames: 110, thumbFrame: 70, stripFrames: [8, 10, 12, 14, 16, 20, 24, 42, 70],
    ref: "Dashcam Vol.1 @ 0:01.9 (File Viewer portrait card, A1) + Dashcam Vol.2 @ 6:47; FONTS.md File Viewer row; wp3 sec_C LuCard @ 5992",
    when: "Naming a person while their footage plays (the card arrives ~0.8 s before the name). The DD house portrait.",
    props: "bg (footage), src, pos, zoom, chrome, sub?, name, at, card {x,y,w,h}, line? {x,y}, punch",
    twist: "motion blur on the 6 f pop, card life drift, eased D1 punch on top of the linear footage push; cap exemption: the 15 px 'File Viewer' window-title chrome (decorative UI); name 32 / sub 28 via cap / subCap",
    sfx: [{ event: "zoom_boom", at: 10, note: "light" }],
    axes: { geometry: "dark UI card over footage", entry: "0.1->1 scale pop + punch", layout: "name bottom-right in card", accent: "red leader line" },
  },
  {
    family: "photo", name: "FilmStrip", component: FilmStrip,
    defaultProps: {
      items: [
        { src: "demo/ffc_park_g.png", at: 0, label: "Place", red: "Name", labelAt: 10 },
        { src: "demo/cna_abandoned_g.png", at: 70, label: "Second", red: "Place" },
        { src: "demo/mapstill.png", at: 150, label: "Reopened", red: "2020" },
      ],
    },
    durationInFrames: 230, thumbFrame: 130, stripFrames: [0, 10, 30, 70, 84, 96, 110, 130, 200],
    ref: "Dashcam Vol.2 @ 0:33.4-37.6 (E5 / I9 case-to-case carousel: red-bordered card, strip shift 55 f ez(.45,0,.25,1), greyed neighbours, +2.6 % settle creep)",
    when: "Two to four photos of one place or thing, the narration naming each in turn (a ride, then another, then the rebuild); it can return later in the case on the next card.",
    props: "items {src, at, label?, red?, labelAt?, pos?}[], cardW, pitch, labelCap",
    twist: "the cards sit on a dark film base with sprocket holes; focus (red border, colour) is continuous with the slide; DD rounded label per card",
    sfx: [{ event: "transition_whoosh", at: 70, note: "soft, per strip shift" }],
    axes: { geometry: "horizontal contact strip", entry: "strip shift card to card", layout: "centred card, label under the strip", accent: "DD red border on the focus card" },
  },
  {
    family: "photo", name: "PushThroughFrame", component: PushThroughFrame,
    defaultProps: {
      src: "demo/cna_abandoned_g.png", pushAt: 30, dur: 42,
      words: [{ text: "9 AM", at: 70, red: true }, { text: "open", at: 80 }, { text: "again", at: 86 }],
    },
    durationInFrames: 130, thumbFrame: 120, stripFrames: [0, 30, 40, 48, 56, 64, 72, 90, 120],
    ref: "Visual Venture @ 10:43.0 (MOTION §7 hold -> burst -> hold, log-zoom bezier .326,0,.143,.807) + VV rule 4 oversize -> settle + Farrell opener parallax cut-out; Dashcam Vol.3 @ 0:03.4 label (E2)",
    when: "Entering a place seen from somewhere (a ride window, a doorway, a fence gap): the viewpoint is part of the story, then the photo takes the frame.",
    props: "src, pos, fg? (cut-out PNG with a transparent hole) | hole {x,y,w,h,r} + mullion, pushAt, dur, through, words {text, at, red?}[], labelY",
    twist: "generated frame with lip highlight and a moving glass reflection; the frame defocuses as it flies past; the photo keeps a slow push after the burst",
    sfx: [{ event: "zoom_boom", at: 30, note: "on the burst" }],
    axes: { geometry: "dark frame over full-frame photo", entry: "burst push through the opening", layout: "label low centre after the push", accent: "depth by occlusion + red word" },
  },
  {
    family: "photo", name: "ArchiveStill", component: ArchiveStill,
    defaultProps: {
      src: "demo/ph_ma_b.jpg", aspect: 2400 / 1714, pos: "50% 45%", name: "Name Surname", role: "Role or title", captionAt: 34,
      mask: [0.27, 0.2, 0.47, 0.2, 0.5, 1, 0.25, 1],
    },
    durationInFrames: 130, thumbFrame: 110, stripFrames: [0, 6, 12, 20, 30, 40, 52, 80, 110],
    ref: "SIRIUS @ 13:18 (E5 photo card on black) + Farrell evidence R10 archive treatment (mono, cool highlight lift, live grain) + Farrell GF @ 7:44 (B5 slow ease-in fade-up) + Farrell opener cut-out parallax",
    when: "An archive / press photo of a person or a historic moment (an official, the scene years ago), named inside the card. Reads 'from the record'.",
    props: "src, aspect, pos, fg? | mask (polygon in print fractions), name?, role?, captionAt, mono, develop",
    twist: "the print develops out of black; foreground cut-out pushes 2.4x faster than the print; caption lives inside the card",
    axes: { geometry: "landscape scanned print on black", entry: "develop fade-up + parallax push", layout: "caption inside the print, bottom-left", accent: "archive mono + grain" },
  },
  {
    family: "photo", name: "TornPrint", component: TornPrint,
    defaultProps: { src: "demo/ffc_park_g.png", aspect: 2560 / 1912, name: "Ride Name Here", nameAt: 30, focus: { x: 0.3, y: 0.62, zoom: 1.35, at: 64 } },
    durationInFrames: 140, thumbFrame: 50, stripFrames: [0, 3, 6, 10, 16, 30, 40, 70, 130],
    ref: "Visual Venture @ 1:29.3 (MOTION §5 torn print + name wipe) + VV @ 12:47.3 (§13 hard landing curve) + Dashcam Vol.1 @ 0:47.5 (name with glow, red rounded face)",
    when: "A named place or object shown as a found print (a ride, a building), the name wiping in on its word; optional move to a detail the VO points at.",
    props: "src, aspect, pos, name?, nameAt, side 'right'|'left' (torn edge), focus? {x, y, zoom, at}, mono, seed",
    twist: "one deep fibrous tear on clean-cut gloss print, drop-and-land with the shadow tightening, DD red glow name instead of VV teal neon",
    sfx: [{ event: "title_word_hit", at: 6, note: "soft landing" }],
    axes: { geometry: "cream-bordered print, one torn side", entry: "drop and land (hard ease-out)", layout: "print centre, name below", accent: "DD red glow name" },
  },
  {
    family: "photo", name: "PhotoStack", component: PhotoStack,
    defaultProps: { items: [{ src: "demo/ffc_park_g.png", at: 0 }, { src: "demo/mapstill.png", at: 40 }, { src: "demo/cna_abandoned_g.png", at: 80 }] },
    durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 40, 44, 48, 56, 80, 86, 100, 140],
    ref: "VV photo deal (MOTION §5 cards + rule 4 'arrives, then settles') + Dashcam Vol.1 @ 14:44.4 (E12 corkboard camera item to item) + VV §11 quick-start / long-settle",
    when: "Several photos of one place piling up as the VO builds it ('an amusement park… its rides… this one'); the last print is the subject.",
    props: "items {src, at, aspect?, pos?}[] (2-3), seed, maxW",
    twist: "covered prints darken so focus moves to the newest; the camera pushes 6 % per deal and keeps a slow rotation drift",
    sfx: [{ event: "transition_whoosh", at: 40, note: "short, per throw" }],
    axes: { geometry: "pile of white-bordered prints", entry: "thrown in from the sides", layout: "stacked, camera on the top print", accent: "darkening under-prints" },
  },
  {
    family: "photo", name: "PagePhotoCrop", component: PagePhotoCrop,
    defaultProps: {
      page: { src: "demo/pts_2019.png", cssW: 1200, cssH: 1850 }, crop: [152, 357, 896, 448], credit: [230, 905, 320, 28],
      name: "Name Surname", role: "Role or title", captionAt: 30, chip: { text: "A short HUD note", at: 60, p: { x: 0.58, y: 0.3 } },
    },
    durationInFrames: 130, thumbFrame: 110, stripFrames: [0, 8, 20, 30, 36, 44, 60, 70, 110],
    ref: "wp3 sec_C C#17 (CNA photo taken from the page) + VV §5 pull-back / rule 4 oversize -> settle + Farrell evidence rule 9 (credits kept) + Dashcam Vol.1 @ 1:09.3 (E4 HUD callout)",
    when: "A news photo of an official / scene that only exists inside an article: show it as that article's photo (credit kept), name the person on the word.",
    props: "page {src, cssW, cssH}, crop Rect (css), credit? Rect, name?, role?, captionAt, chip? {text, at, p}, width",
    twist: "the page stays behind it blurred as the source; caption strip wipes inside the crop; DD HUD chip on its word; cap exemption: the credit/byline line is a crop of the captured page (not typeset)",
    axes: { geometry: "white cut-out over its blurred page", entry: "oversize -> settle", layout: "caption strip inside the photo + credit under", accent: "DD red HUD chip" },
  },
];
// new set "midway" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_midway.md)
import { extra as extra_midway } from "./new_midway";
variants.push(...extra_midway);
