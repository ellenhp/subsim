import React from "react";
import Helm from "./helm/Helm";
import Map from "./map/MapStation";
import Tma from "./tma/TmaStation";
import Sonar from "./sonar/Sonar";
import Weapons from "./weapons/Weapons";

import { GameConnection } from "../../game";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import { Engines } from "../../engines/engine";

export type StationProps = {
  game: GameConnection;
  engines: Engines;
  latestUpdate: VesselUpdate.AsObject;
  changeStation: (station: Station) => unknown;
  setStationFocusData: (station: Station, focusData: string) => unknown;
};

export type StationComponent = React.Component<StationProps>;

export enum Station {
  HELM = "helm",
  MAP = "map",
  TMA = "tma",
  SONAR = "sonar",
  WEAPONS = "weapons",
}

export const stationMapping: { [key in Station]: StationComponent } = {
  [Station.HELM]: Helm,
  [Station.MAP]: Map,
  [Station.TMA]: Tma,
  [Station.SONAR]: Sonar,
  [Station.WEAPONS]: Weapons,
};
