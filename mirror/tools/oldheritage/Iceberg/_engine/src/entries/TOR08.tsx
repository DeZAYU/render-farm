import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/TOR08";
registerRoot(() => <Composition id="TOR08" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
