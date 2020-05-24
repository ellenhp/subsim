import { Pipe } from "../../util/pipe";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import buildWaterfalls from "./waterfalls/broadbandWaterfalls";
import BroadbandSource from "./broadbandSource";
import SnapshotManager from "./snapshotManager";
import { BroadbandScreen } from "./waterfalls/createWaterfall";

export interface SonarEngine {
  broadbandSource: BroadbandSource;

  waterfalls: {
    broadbandShort: BroadbandScreen;
    broadbandMedium: BroadbandScreen;
    broadbandLong: BroadbandScreen;
  };
}

export const buildSonarEngine = (worldStream: Pipe<VesselUpdate.AsObject>) => {
  const snapshotManager = new SnapshotManager(worldStream);
  const broadbandSource = new BroadbandSource(snapshotManager);

  return {
    broadbandSource,
    waterfalls: buildWaterfalls(broadbandSource),
  };
};
