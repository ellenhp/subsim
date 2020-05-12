import { SonarEngine } from "./sonarEngine/sonarEngine";
import MapEngine from "./mapEngine/mapEngine";

export interface Engines {
  sonarEngine: SonarEngine;
  mapEngine: MapEngine;
}
