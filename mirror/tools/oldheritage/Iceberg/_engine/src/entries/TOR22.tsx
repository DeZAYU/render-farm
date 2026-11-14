import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/TOR22";
registerRoot(() => <Composition id="TOR22" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
