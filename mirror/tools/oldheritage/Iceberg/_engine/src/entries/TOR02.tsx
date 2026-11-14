import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/TOR02";
registerRoot(() => <Composition id="TOR02" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
