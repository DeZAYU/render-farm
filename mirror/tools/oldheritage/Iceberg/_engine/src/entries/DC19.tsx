import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/DC19";
registerRoot(() => <Composition id="DC19" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
