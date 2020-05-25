import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import { Pipe } from "../../util/pipe";
import { getSonarUpdate } from "../../gettorz";

export type PointSource = {
  bearing: number;
  broadbandPowerLevel: number;
  freqs: number[];
};

export type SoundSnapshot = {
  pointSources: Array<PointSource>;
  noiseLevel: number;
  explosionLevel: number;
  bearing: number;
  timestamp: number;
};

function memo(
  func: (time: number) => SoundSnapshot
): (time: number) => SoundSnapshot {
  const map: { [key: number]: SoundSnapshot } = {};
  return function memo(time) {
    if (map[time]) {
      return map[time];
    }
    const snapshot = func(time);
    map[time] = snapshot;
    return snapshot;
  };
}

const noiseLevel = 0.005;

class SnapshotManager {
  constructor(worldStream: Pipe<VesselUpdate.AsObject>) {
    worldStream.listen((update) => {
      const sonarUpdate = getSonarUpdate(update);
      const newSnapshot = {
        noiseLevel: noiseLevel,
        explosionLevel: update.explosionNoise,
        bearing: 0,
        timestamp: -1, // lolol
        pointSources: sonarUpdate.contactsList.map((contact) => {
          return {
            bearing: contact.bearing,
            broadbandPowerLevel: contact.broadbandPowerLevel,
            freqs: [20, 30, 80, 300],
          };
        }),
      };
      if (
        JSON.stringify(newSnapshot) ===
        JSON.stringify(this.getCurrentSnapshot())
      ) {
        return;
      }
      // set the timestamp!
      newSnapshot.timestamp = Date.now();

      this.snapshots.push(newSnapshot);
    });
  }

  /* Shouldn't have a default here. */
  private snapshots: Array<SoundSnapshot> = [];

  getCurrentSnapshot(): SoundSnapshot {
    return this.snapshots[this.snapshots.length - 1];
  }

  hasSnapshot(): boolean {
    return this.snapshots.length > 0;
  }

  getSnapshotAtTime = memo((time: number) => {
    // lol O(n)
    for (let i = this.snapshots.length - 1; i > 0; i--) {
      const snapshot = this.snapshots[i];
      if (snapshot.timestamp < time) {
        return snapshot;
      }
    }
    // default to earliest snapshot
    return this.snapshots[0];
  });
}

export default SnapshotManager;
