import { ElemSingleton } from "../../util/elemSingleton";
import { Pipe } from "../../util/pipe";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import buildWaterfalls, { BroadbandScreen } from "./waterfalls/buildWaterfalls";
import BroadbandSource from "./broadbandSource";

export interface SonarEngine {
  broadbandSource: BroadbandSource;

  waterfalls: {
    broadbandShort: BroadbandScreen;
    broadbandMedium: BroadbandScreen;
    broadbandLong: BroadbandScreen;
  };
}

export const buildSonarEngine = (worldStream: Pipe<VesselUpdate.AsObject>) => {
  const broadbandSource = new BroadbandSource(worldStream);

  return {
    broadbandSource,
    waterfalls: buildWaterfalls(broadbandSource),
  };
};
