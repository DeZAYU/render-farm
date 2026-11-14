import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/TOR20";
registerRoot(() => <Composition id="TOR20" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
