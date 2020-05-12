import Helm from "./helm/Helm";
import Map from "./map/Map";
import Radar from "./radar/Radar";
import Sonar from "./sonar/Sonar";
import Weapons from "./weapons/Weapons";

import { GameConnection } from "../../game";
import { SonarEngine } from "../sonarEngine/sonarEngine";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";

export type StationProps = {
  game: GameConnection;
  sonarEngine: SonarEngine;
  latestUpdate: VesselUpdate.AsObject;
};

export type StationComponent = React.FunctionComponent<StationProps>;

export enum Station {
  HELM = "helm",
  MAP = "map",
  RADAR = "radar",
  SONAR = "sonar",
  WEAPONS = "weapons",
}

export const stationMapping: { [key in Station]: StationComponent } = {
  [Station.HELM]: Helm,
  [Station.MAP]: Map,
  [Station.RADAR]: Radar,
  [Station.SONAR]: Sonar,
  [Station.WEAPONS]: Weapons,
};
