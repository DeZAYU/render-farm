// All families. Each family folder owns its index.ts (variants array); this file only lists the folders.
import type { VariantDef } from "../core";
import { variants as labels } from "./labels";
import { variants as caseopener } from "./caseopener";
import { variants as lookhere } from "./lookhere";
import { variants as footage } from "./footage";
import { variants as stat } from "./stat";
import { variants as page } from "./page";
import { variants as evidence } from "./evidence";
import { variants as social } from "./social";
import { variants as photo } from "./photo";
import { variants as quote } from "./quote";
import { variants as timeline } from "./timeline";
import { variants as toll } from "./toll";
import { variants as map } from "./map";
import { variants as diagram } from "./diagram";
import { variants as neon } from "./neon";
import { variants as title } from "./title";
import { variants as transition } from "./transition";
import { variants as censor } from "./censor";
import { variants as endscreen } from "./endscreen";
import { variants as iceberg } from "./iceberg";
import { variants as n2 } from "./n2";
import { variants as n2fx } from "./n2fx";
import { variants as n2page } from "./n2page";
import { variants as n2map } from "./n2map";
import { variants as n2dev } from "./n2dev";

export const FAMILIES: { family: string; variants: VariantDef[] }[] = [
  { family: "caseopener", variants: caseopener },
  { family: "labels", variants: labels },
  { family: "lookhere", variants: lookhere },
  { family: "footage", variants: footage },
  { family: "map", variants: map },
  { family: "page", variants: page },
  { family: "evidence", variants: evidence },
  { family: "social", variants: social },
  { family: "photo", variants: photo },
  { family: "stat", variants: stat },
  { family: "toll", variants: toll },
  { family: "timeline", variants: timeline },
  { family: "diagram", variants: diagram },
  { family: "neon", variants: neon },
  { family: "title", variants: title },
  { family: "quote", variants: quote },
  { family: "censor", variants: censor },
  { family: "transition", variants: transition },
  { family: "endscreen", variants: endscreen },
  { family: "iceberg", variants: iceberg },
  { family: "n2", variants: n2 },
  { family: "n2fx", variants: n2fx },
  { family: "n2page", variants: n2page },
  { family: "n2map", variants: n2map },
  { family: "n2dev", variants: n2dev },
];
