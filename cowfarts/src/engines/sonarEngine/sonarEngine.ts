import { Pipe } from "../../util/pipe";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import buildWaterfalls from "./waterfalls/broadbandWaterfalls";
import BroadbandSource from "./broadbandSource";
import SnapshotManager from "./snapshotManager";
import { BroadbandScreen } from "./waterfalls/createWaterfall";
import { NarrowbandScreen } from "./waterfalls/narrowbandWaterfalls";
import NarrowbandSource from "./narrowbandSource";

export interface SonarEngine {
  broadbandSource: BroadbandSource;

  waterfalls: {
    broadbandShort: BroadbandScreen;
    broadbandMedium: BroadbandScreen;
    broadbandLong: BroadbandScreen;
    narrowbandFreq: NarrowbandScreen;
  };
}

export const buildSonarEngine = (worldStream: Pipe<VesselUpdate.AsObject>) => {
  const snapshotManager = new SnapshotManager(worldStream);
  const broadbandSource = new BroadbandSource(snapshotManager);
  const narrowbandSource = new NarrowbandSource(snapshotManager);

  return {
    broadbandSource,
    waterfalls: buildWaterfalls(broadbandSource, narrowbandSource),
  };
};
