import BroadbandSource from "./broadbandSource";
import { ElemSingleton } from "../../util/elemSingleton";
import { Pipe } from "../../util/pipe";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import buildWaterfalls from "./waterfalls/buildWaterfalls";

export interface SonarEngine {
  broadbandSource: BroadbandSource;
  waterfalls: {
    broadbandShort: ElemSingleton<HTMLCanvasElement>;
    broadbandMedium: ElemSingleton<HTMLCanvasElement>;
    broadbandLong: ElemSingleton<HTMLCanvasElement>;
  };
}

export const buildSonarEngine = (worldStream: Pipe<VesselUpdate.AsObject>) => {
  const broadbandSource = new BroadbandSource(worldStream);

  return {
    broadbandSource,
    waterfalls: buildWaterfalls(broadbandSource),
  };
};
