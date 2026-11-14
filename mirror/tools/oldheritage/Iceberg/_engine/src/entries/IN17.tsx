import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/IN17";
registerRoot(() => <Composition id="IN17" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
