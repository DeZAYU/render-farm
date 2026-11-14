// Family "neon": VV §7 neon pictograms (glyph library in glyphs.tsx: filled silhouettes on black with a tight halo + wide bloom). All frames LOCAL.
// VV pictograms are silent (VV STUDY §F); only the glitch swap gets a hint.
import type { VariantDef } from "../../core";
import { PULLBACK_DEMO, PullbackPop } from "./PullbackPop";
import { TANK_DEMO, TankBurst } from "./TankBurst";
import { SWAP_DEMO, GlyphSwapX } from "./GlyphSwapX";
import { RISE_DEMO, RiseSquash } from "./RiseSquash";
import { EQUATION_DEMO, EquationRow } from "./EquationRow";
import { SPLIT_DEMO, SplitContrast } from "./SplitContrast";
import { PAIR_DEMO, IconPair } from "./IconPair";
import { LINEOBJ_DEMO, LineObject } from "./LineObject";
import { CHAIN_DEMO, ChainReaction } from "./ChainReaction";

export const variants: VariantDef[] = [
  {
    family: "neon", name: "PullbackPop", component: PullbackPop, defaultProps: PULLBACK_DEMO, durationInFrames: 75, thumbFrame: 72, stripFrames: [0, 3, 12, 20, 23, 28, 44, 50, 56, 72],
    ref: "Visual Venture TV @ 0:32.3 (TV pops on the cut, group pulls back -24 % in 69 f bezier .522,.672,1,1) + @ 1:44.1 crowd; wp3 sec_A CornPicto @ abs 2003",
    when: "Explaining WHAT something is made of / consists of, one element per phrase (substance, ingredients, parts).",
    props: "items [{glyph,colour,x,y,size,rot,at,until,enter pop|draw|fall,stay,tint{at,colour}}], captions [{t,at,colour}], scale0, pull, pullFrames, centre, floor, captionY, captionSize",
    twist: "items can pop / draw on / fall in and re-tint on a word; Bebas words pop hard under the group; red floor light",
    sfx: [],
    axes: { geometry: "glyph cluster", entry: "1 f pop on the cut + continuous pull-back", layout: "group centre, caption below", accent: "colour = meaning (drops tint the heap)" },
  },
  {
    family: "neon", name: "TankBurst", component: TankBurst, defaultProps: TANK_DEMO, durationInFrames: 120, thumbFrame: 110, stripFrames: [0, 20, 38, 46, 52, 58, 66, 74, 80, 96, 119],
    ref: "Visual Venture TV @ 10:43.0 tank: hold 1.3 s (-0.5 %), push x2.98 in 57 f log bezier (.326,0,.143,.807) with a pan riding it; wp3 sec_A IgnDiagram @ abs 2879",
    when: "A scene of several actors where ONE thing is the point (the vehicle, the tank, the house); the burst says 'this one'.",
    props: "items [{glyph,colour,x,y,size,loop bob|sway,flip}], target {x,y}, burstAt, burstFrames, zoom, swap {index,at,glyph,colour}, bloom, captions, floor",
    twist: "the burst lands on a target that swaps glyph on its word with a warm bloom; looping figures; motion blur on the burst",
    sfx: [{ event: "zoom_boom", at: 39, note: "optional (anchor = burst start); VV itself is silent" }],
    axes: { geometry: "horizontal scene row", entry: "hold -> log push burst", layout: "wide row -> one glyph full frame", accent: "target swap + bloom" },
  },
  {
    family: "neon", name: "GlyphSwapX", component: GlyphSwapX, defaultProps: SWAP_DEMO, durationInFrames: 110, thumbFrame: 60, stripFrames: [0, 6, 20, 23, 48, 49, 50, 72, 74, 77, 80, 100],
    ref: "Visual Venture TV @ 19:26.4 gun -> X -> toy (rise 20 f, push +56 % accelerating bezier .39,0,.59,.64, '!' flicker, red X in 3 f, 3 f RGB glitch + 2 black, swap) + Farrell IG @ 2:47.6 icon crossed out",
    when: "Correcting an assumption / misidentification: 'it wasn't X, it was Y', or a negation ('no doctors').",
    props: "a {glyph,colour,size}, b {glyph,colour,size,extra}, accent {glyph,colour,at,dx,dy,size}, riseFrames, pushFrames, push, xAt, glitchAt, captionsA, captionsB, floor",
    twist: "accent, X and swap each on their own word; the replacement can carry an extra glyph and its own caption",
    sfx: [{ event: "glitch", at: 72, note: "anchor = glitchAt" }],
    axes: { geometry: "single big glyph", entry: "rise from below + accelerating push", layout: "centred", accent: "red X + RGB glitch swap" },
  },
  {
    family: "neon", name: "RiseSquash", component: RiseSquash, defaultProps: RISE_DEMO, durationInFrames: 90, thumbFrame: 80, stripFrames: [0, 24, 25, 26, 28, 31, 36, 44, 55, 80],
    ref: "Visual Venture TV @ 12:47.3 yellow '?' over a red-tinted portrait (top 959 -> 287 px in 31 f, exp ease-out tau 0.31 s, width x1.17 -> 1 in 8 f)",
    when: "An open question / mystery about a person or object on screen ('something didn't add up'), one glyph on the word.",
    props: "src (photo/clip), tint, pushPerS, glyph, colour, at, riseFrames, size, x, landY, captions",
    twist: "any glyph over any plate; the plate is turned red-mono with a linear push; tiny float after landing",
    sfx: [],
    axes: { geometry: "glyph over photo", entry: "rise from below frame with squash", layout: "glyph right third", accent: "yellow on red-mono" },
  },
  {
    family: "neon", name: "EquationRow", component: EquationRow, defaultProps: EQUATION_DEMO, durationInFrames: 110, thumbFrame: 105, stripFrames: [0, 4, 20, 30, 34, 40, 50, 64, 70, 74, 80, 105],
    ref: "Farrell story #12 ICO arithmetic glyph row (built term by term, the plane slides) + Visual Venture TV @ 1:44.1 crowd (group pulls back -0.45 %/f, pan 0.7 s R->L to make room) + VV §8 word ghost",
    when: "Cause and effect / a recipe for disaster: A + B -> C, conditions that combine into the event.",
    props: "terms [{glyph,colour,label,labelColour,at,size,extra}], ops [{glyph plus|arrow|equals,at,colour}], pitch, reframeFrames, maxScale, labelSize",
    twist: "the plane re-frames on every new term (quick-start / long-settle), operator strokes draw on in 5 f, result pops larger in yellow",
    sfx: [],
    axes: { geometry: "horizontal equation", entry: "term by term, plane re-frames", layout: "row with Bebas labels under", accent: "result colour + yellow label" },
  },
  {
    family: "neon", name: "SplitContrast", component: SplitContrast, defaultProps: SPLIT_DEMO, durationInFrames: 110, thumbFrame: 100, stripFrames: [0, 4, 10, 24, 30, 40, 48, 56, 76, 100],
    ref: "Visual Venture TV @ 0:32.3 neon pictograms (colour = meaning, pop on the phrase) + @ 1:44.1 crowd (new elements on their phrase) + VV §9 Bebas pop",
    when: "Two opposed states side by side: cold vs warm, outside vs inside, the risk vs the right action.",
    props: "left/right {glyph,colour,title,titleAt,at,items[{glyph,at,label}],effect{kind frost|alert,at}}, dividerAt, slide; M-024 caps: labelCap (32)",
    twist: "symmetric split stage with a drawn divider, halves slide apart from the centre, per-side colour wash, frost crystals / alert pulse",
    sfx: [],
    axes: { geometry: "two columns", entry: "divider draws, halves slide out", layout: "mirrored halves", accent: "cold vs warm colour + frost" },
  },
  {
    family: "neon", name: "IconPair", component: IconPair, defaultProps: PAIR_DEMO, durationInFrames: 100, thumbFrame: 95, stripFrames: [0, 6, 12, 18, 24, 34, 44, 50, 74, 78, 95],
    ref: "Visual Venture TV @ 0:32.3 neon TV (content changes hard on the phrase) + VV §8 word ghost (0.3 -> 1 in 4 f)",
    when: "One thing operates / triggers another: wristband -> locker, raft -> head camera REC, key -> door.",
    props: "a {glyph,colour,at,label,drawFrames}, b {glyph,colour,at,label,swapTo{glyph,at}}, link {at,frames,style dots|wire,colour}, react {kind glint|rec,at,colour,on a|b}, layout diagonal|row",
    twist: "A draws on stroke by stroke, a travelling dotted signal links to B, B swaps state; camera eases toward B",
    sfx: [],
    axes: { geometry: "two glyphs + link", entry: "line draw-on, then link", layout: "diagonal low-left -> high-right", accent: "pulsing signal dots + glint/REC" },
  },
  {
    family: "neon", name: "LineObject", component: LineObject, defaultProps: LINEOBJ_DEMO, durationInFrames: 100, thumbFrame: 90, stripFrames: [0, 5, 10, 20, 30, 45, 58, 63, 64, 66, 90],
    ref: "Visual Venture TV @ 0:32.3 / 19:26.4 white neon object (#FDFCFD, warm bloom, slow push) + VV §9 hard word pop",
    when: "A single object that carries the fact: a clock stopped at a time, a phone and the number called, a sign.",
    props: "kind clock|phone|glyph, glyph, drawAt, drawFrames, clock {from,to,sweepAt,stopAt}, text {t,at,colour,y}, colour, pushPerS",
    twist: "line-only neon drawn stroke by stroke, the hands accelerate into a dead stop with a 2 f bloom flash",
    sfx: [{ event: "typing_key", at: 64, note: "optional single tick on the stop" }],
    axes: { geometry: "one big line object", entry: "stroke draw-on", layout: "centred, word under", accent: "red Bebas time/number" },
  },
  {
    family: "neon", name: "ChainReaction", component: ChainReaction, defaultProps: CHAIN_DEMO, durationInFrames: 110, thumbFrame: 100, stripFrames: [0, 4, 10, 30, 40, 50, 58, 64, 70, 74, 100],
    ref: "Visual Venture TV @ 0:32.3 neon (colour = meaning) + FA evidence E1 (Instagram @ 2:47.5, one element per noun) + VV §8 word ghost",
    when: "Causes / claims that converge on one outcome: 'concrete type + wind vibration -> cause'; 'claims -> RESORT: DENIED' (grey).",
    props: "chips [{text,at,colour}], node {text,at,tone red|grey,sub}, wireAt, pushPerS; M-024 caps: cap (40), subCap (28)",
    twist: "text chips fan in on curved wires with travelling pulses into one verdict node (red or grey)",
    sfx: [],
    axes: { geometry: "chips + verdict node", entry: "chip outlines draw, wires run", layout: "fan-in left -> right node", accent: "red / grey verdict node" },
  },
];
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
