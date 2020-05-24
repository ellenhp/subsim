import { Pipe } from "../../util/pipe";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import buildWaterfalls, {
  BroadbandScreen,
} from "./waterfalls/broadbandWaterfalls";
import BroadbandSource from "./broadbandSource";
import SnapshotManager from "./snapshotManager";

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
