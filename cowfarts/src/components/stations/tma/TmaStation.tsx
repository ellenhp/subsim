import React from "react";
import Map from "../../map/Map";
import { StationComponent, StationProps } from "../index";
import "./TmaStation.css";
import { getContacts } from "../../../gettorz";

const TmaStation: StationComponent = (props: StationProps) => {
  const contacts = getContacts(props.latestUpdate);
  return (
    <div className="tma-station">
      <div className="tma-station-header">Target: Bleep</div>
      <Map
        className="tma-station-map"
        mapEngine={props.engines.mapEngine}
        latestUpdate={props.latestUpdate}
        game={props.game}
        forceTool="tma"
      />
      {contacts.length === 0 && (
        <div className="no-target-indicator">
          [ No Target ]<br />
          Use sonar to find contacts.
        </div>
      )}
    </div>
  );
};

export default TmaStation;
