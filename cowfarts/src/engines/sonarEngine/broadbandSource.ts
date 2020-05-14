import { Pipe } from "../../util/pipe";
import noise from "noisejs";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";

type PointSource = {
  bearing: number;
  freqs: Array<{
    freq: number;
    volume: number;
  }>;
};

type SoundSnapshot = {
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

const NOISE_SCALE_HORIZONTAL = 20;
const NOISE_SCALE_VERTICAL = 1;
// aaa
const NOISE_ANGLE_SPREAD = 15;
const NOISE_ANGLE_SCALE_HORIZONTAL = 3;
const NOISE_ANGLE_SCALE_VERTICAL = 0.2;
// ---
const POINT_DISTORTION_SCALE = 20;
const POINT_DISTORTION_MULTIPLIER = 5;
// How wide the signal is spread to
const POINT_SPREAD = 10;

/*
 * If a signal is offset from sample pos by bearingOffset, what should be the
 * observed offset gain here? Area under this curve should be 1.
 */
const offsetGain = (bearingOffset: number) => {
  return Math.max(1 - bearingOffset / POINT_SPREAD, 0) / POINT_SPREAD;
};

function getSonarUpdate(update: VesselUpdate.AsObject) {
  return update.systemUpdatesList.filter((system) => system.sonarUpdate)[0]
    .sonarUpdate.arrayUpdatesList[0];
}

export default class BroadbandSource {
  constructor(worldStream: Pipe<VesselUpdate.AsObject>) {
    this.noiseSource = new noise.Noise(Math.random());
    this.noiseAngleSource = new noise.Noise(Math.random());
    this.pointDistortion = new noise.Noise(Math.random());
    this.explosionSource = new noise.Noise(Math.random());

    worldStream.listen((update) => {
      const sonarUpdate = getSonarUpdate(update);
      const newSnapshot = {
        noiseLevel: 0.003,
        explosionLevel: 0,
        bearing: 0,
        timestamp: -1, // lolol
        pointSources: sonarUpdate.contactsList.map((contact) => {
          return {
            bearing: contact.bearing,
            freqs: [
              {
                freq: 100,
                volume: contact.broadbandPowerLevel,
              },
            ],
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

  interval: NodeJS.Timeout;

  noiseSource: any;
  noiseAngleSource: any;
  explosionSource: any;
  pointDistortion: any;

  /* Shouldn't have a default here. */
  snapshots: Array<SoundSnapshot> = [];

  getCurrentSnapshot(): SoundSnapshot {
    return this.snapshots[this.snapshots.length - 1];
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

  // Bearing is always 0 - 360, sample is in ms since epoch
  sample(bearing: number, sampleTime?: number | undefined) {
    if (!this.snapshots.length) {
      return 0;
    }
    const snapshot =
      sampleTime === undefined
        ? this.getCurrentSnapshot()
        : this.getSnapshotAtTime(sampleTime);
    const time = sampleTime === undefined ? Date.now() : sampleTime;

    const noiseBearingDeviation =
      this.pointDistortion.perlin2(
        (bearing * NOISE_ANGLE_SCALE_HORIZONTAL) / 360,
        (time * NOISE_ANGLE_SCALE_VERTICAL) / 1000
      ) * NOISE_ANGLE_SPREAD;
    const backgroundNoise =
      (this.noiseSource.perlin2(
        ((bearing + noiseBearingDeviation) * NOISE_SCALE_HORIZONTAL) / 360,
        (time * NOISE_SCALE_VERTICAL) / 1000
      ) /
        2 +
        0.5) *
      snapshot.noiseLevel;
    const pointNoises = snapshot.pointSources.map(
      ({ bearing: pointBearing, freqs }) => {
        const avgFreqVolume =
          freqs.reduce((acc, { volume }) => volume + acc, 0) / freqs.length;

        const bearingNoise =
          POINT_DISTORTION_MULTIPLIER *
          this.pointDistortion.perlin2(
            (bearing * POINT_DISTORTION_SCALE) / 360,
            (time * NOISE_SCALE_VERTICAL) / 1000
          );
        const bearingOffset = Math.abs(bearingNoise + bearing - pointBearing);
        return avgFreqVolume * offsetGain(bearingOffset);
      }
    );
    return backgroundNoise + pointNoises.reduce((a, b) => a + b, 0);
  }
}
