import Helm from "./helm/Helm";
import Map from "./map/Map";
import Radar from "./radar/Radar";
import Sonar from "./sonar/Sonar";
import Weapons from "./weapons/Weapons";

import { Game } from "../../game";
import { SonarEngine } from "../sonarEngine/sonarEngine";

export type StationProps = {
  game: Game;
  sonarEngine: SonarEngine;
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
