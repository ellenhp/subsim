import React from "react";
import Map from "../../map/Map";
import { StationComponent } from "../index";
import "./MapStation.css";

const MapStation: StationComponent = (props) => {
  return (
    <Map
      className="map-station-map"
      mapEngine={props.engines.mapEngine}
      latestUpdate={props.latestUpdate}
      game={props.game}
    />
  );
};

export default MapStation;
