import { ElemSingleton } from "../../util/elemSingleton";
import { Pipe } from "../../util/pipe";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import buildWaterfalls from "./waterfalls/buildWaterfalls";
import BroadbandSource from "./broadbandSource";

export interface SonarEngine {
  broadbandSource: BroadbandSource;

  waterfalls: {
    broadbandShort: Pipe<ImageData>;
    broadbandMedium: Pipe<ImageData>;
    broadbandLong: Pipe<ImageData>;
  };
}

export const buildSonarEngine = (worldStream: Pipe<VesselUpdate.AsObject>) => {
  const broadbandSource = new BroadbandSource(worldStream);

  return {
    broadbandSource,
    waterfalls: buildWaterfalls(broadbandSource),
  };
};
