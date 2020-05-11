import React from "react";
import { StationComponent } from "..";
import Waterfall from "./ElemSingletonMount";
import "./Sonar.css";

const Sonar: StationComponent = ({ sonarEngine }) => (
  <h1>
    Sonar
    <div className="waterfalls">
      <Waterfall
        className="waterfall"
        elem={sonarEngine.waterfalls.broadbandShort}
      />
      <Waterfall
        className="waterfall"
        elem={sonarEngine.waterfalls.broadbandMedium}
      />
      <Waterfall
        className="waterfall"
        elem={sonarEngine.waterfalls.broadbandLong}
      />
    </div>
  </h1>
);

export default Sonar;
