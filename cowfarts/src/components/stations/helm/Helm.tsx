import React from "react";
import { StationComponent } from "..";
import PropulsionControl from "./PropulsionControl";
import SteeringControl from "./SteeringControl";
import Map from "../../map/Map";
import "./Helm.css";

const Helm: StationComponent = ({
  game,
  latestUpdate,
  engines: { mapEngine },
}) => {
  return (
    <div>
      <h1>Helm</h1>

      {
        /* LOOOL */ latestUpdate && (
          <Map
            className="helm-map"
            mapEngine={mapEngine}
            latestUpdate={latestUpdate}
          />
        )
      }
      <PropulsionControl game={game} latestUpdate={latestUpdate} />
      <SteeringControl game={game} latestUpdate={latestUpdate} />
    </div>
  );
};

export default Helm;
