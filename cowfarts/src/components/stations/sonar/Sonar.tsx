import React, { useState } from "react";
import { StationComponent, StationProps } from "..";
//import Waterfall from "./ElemSingletonMount";
import "./Sonar.css";
import BroadbandSwitcher from "./BroadbandSwitcher";

const Sonar: StationComponent = (props: StationProps) => {
  return (
    <>
      <div className="card">
        <BroadbandSwitcher
          engine={props.engines.sonarEngine}
          defaultTerm={"short"}
        />
      </div>
      <div className="card">
        <BroadbandSwitcher
          engine={props.engines.sonarEngine}
          defaultTerm={"medium"}
        />
      </div>
    </>
  );
};

export default Sonar;
