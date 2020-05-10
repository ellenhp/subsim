import Helm from "./Helm";
import Map from "./Map";
import Radar from "./Radar";
import Sonar from "./Sonar";
import Weapons from "./Weapons";

import { Game } from "../../game";

export type StationProps = {
  game: Game;
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
