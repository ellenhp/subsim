import React from "react";
import Map from "../../map/Map";
import { StationComponent, StationProps, Station } from "../index";
import "./TmaStation.css";
import { getContacts } from "../../../gettorz";

const TmaStation: StationComponent = (props: StationProps) => {
  const contacts = getContacts(props.latestUpdate).map((c) => c.designation);
  let contact = contacts[0];
  if (contacts.includes(props.stationFocusData)) {
    contact = props.stationFocusData;
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.setStationFocusData(Station.TMA, event.target.value);
  };

  return (
    <div className="tma-station">
      <div className="tma-station-header">
        Focused Contact:
        <select value={contact} onChange={onChange}>
          {contacts.map((contactOption) => (
            <option value={contactOption}>{contactOption}</option>
          ))}
        </select>
      </div>
      <Map
        className="tma-station-map"
        mapEngine={props.engines.mapEngine}
        latestUpdate={props.latestUpdate}
        game={props.game}
        forceTool="tma"
        tmaTarget={contact}
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
