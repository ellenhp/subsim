import React from "react";
import { StationComponent } from "..";
import PropulsionControl from "./PropulsionControl";
import SteeringControl from "./SteeringControl";
import Map from "../../map/Map";
import "./Helm.css";
import DivingControl from "./DiveControl";

const Helm: StationComponent = ({
  game,
  latestUpdate,
  engines: { mapEngine },
}) => {
  return (
    <div className="helm-station">
      <div className="helm-station-inner">
        <DivingControl game={game} latestUpdate={latestUpdate} />

        <div className="helm-map-wrapper helm-card">
          <Map
            className="helm-map"
            mapEngine={mapEngine}
            latestUpdate={latestUpdate}
          />
        </div>
        <PropulsionControl game={game} latestUpdate={latestUpdate} />
        <SteeringControl game={game} latestUpdate={latestUpdate} />
      </div>
    </div>
  );
};

export default Helm;
