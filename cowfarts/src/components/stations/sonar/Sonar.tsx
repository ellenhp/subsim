import React, { useState } from "react";
import { StationComponent, StationProps } from "..";
//import Waterfall from "./ElemSingletonMount";
import "./Sonar.css";
import BroadbandSwitcher from "./BroadbandSwitcher";
import ContactManager from "./ContactManager";

const Sonar: StationComponent = (props: StationProps) => {
  return (
    <div className="sonar-station">
      <div className="broadband-bay-1 card">
        <BroadbandSwitcher
          engine={props.engines.sonarEngine}
          defaultTerm={"short"}
        />
      </div>
      <div className="broadband-bay-2 card">
        <BroadbandSwitcher
          engine={props.engines.sonarEngine}
          defaultTerm={"medium"}
        />
      </div>
      <ContactManager game={props.game} latestUpdate={props.latestUpdate} />
    </div>
  );
};

export default Sonar;
