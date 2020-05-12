import React, { useState } from "react";
import { StationComponent } from "..";
import Waterfall from "./ElemSingletonMount";
import "./Sonar.css";

type WaterfallTypes = "short" | "medium" | "long";

const Sonar: StationComponent = ({ engines: { sonarEngine } }) => {
  const [waterfallType, setWaterfallType] = useState<WaterfallTypes>("medium");

  const waterfall = {
    short: sonarEngine.waterfalls.broadbandShort,
    medium: sonarEngine.waterfalls.broadbandMedium,
    long: sonarEngine.waterfalls.broadbandLong,
  }[waterfallType];

  return (
    <h1>
      Sonar
      <div className="waterfall-wrapper">
        <Waterfall key={waterfallType} className="waterfall" elem={waterfall} />
        <div className="waterfall-switcher">
          <button onClick={() => setWaterfallType("short")}>Short</button>
          <button onClick={() => setWaterfallType("medium")}>Medium</button>
          <button onClick={() => setWaterfallType("long")}>Long</button>
        </div>
      </div>
    </h1>
  );
};

export default Sonar;
