import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/DC10";
registerRoot(() => <Composition id="DC10" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
