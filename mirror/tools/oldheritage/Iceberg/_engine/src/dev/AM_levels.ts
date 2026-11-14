// Amusement Parks Iceberg (AM): the five levels and their cases, in the script's order (09_Amusement_Iceberg/script/script.md).
// Used by dev/AM_LevelEntry (the level pieces) and any AM intro chart. Names = the script's case headings.
export type AmLevel = { n: number; name: string; cases: string[] };
export const AM_LEVELS: AmLevel[] = [
  { n: 1, name: "THE TIP", cases: ["The Vertical Accelerator Cord", "Saw Mill Log Flume", "El Gusanito", "Futuroscope Objectif Mars Fire", "The Ultimate and the Deer", "Dueling Dragons", "Son of Beast"] },
  { n: 2, name: "BELOW THE SURFACE", cases: ["Queens Land Free Fall Tower", "Albanifest Top Spin", "Green Plaza", "Sailing Ship Columbia", "Terra Mítica Inferno"] },
  { n: 3, name: "DARK WATERS", cases: ["Ride of Steel", "New Texas Giant", "Hotel Embrujado"] },
  { n: 4, name: "THE ABYSS", cases: ["Perilous Plunge", "Mindbender"] },
  { n: 5, name: "THE DEEPEST", cases: ["Black Sunday", "Buried Alive", "Formule 1"] },
];
/** y (0..1 of ice3/wide.jpg) of the four level lines; the first is the waterline (plates.json wide.waterline) */
export const AM_BARS = [0.3043, 0.47, 0.635, 0.8];
