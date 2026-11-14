import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/IN16";
registerRoot(() => <Composition id="IN16" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
