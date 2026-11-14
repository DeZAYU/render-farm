import React from "react";
import { Composition, registerRoot } from "remotion";
import { TitleStyles, N, COUNT } from "../dev/TitleStyles";
registerRoot(() => <Composition id="TITLES" component={TitleStyles} durationInFrames={N * COUNT} fps={30} width={1920} height={1080} />);
