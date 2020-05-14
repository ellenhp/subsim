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

const NOISE_SCALE_HORIZONTAL = 20;
const NOISE_SCALE_VERTICAL = 1;
// aaa
const NOISE_ANGLE_SPREAD = 15;
const NOISE_ANGLE_SCALE_HORIZONTAL = 3;
const NOISE_ANGLE_SCALE_VERTICAL = 0.2;
// ---
const POINT_DISTORTION_SCALE = 20;
const POINT_DISTORTION_MULTIPLIER = 5;
const POINT_DISTORTION_SPREAD = 10;

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
      if (
        JSON.stringify(sonarUpdate) ===
        JSON.stringify(this.getCurrentSnapshot())
      ) {
        return;
      }
      this.snapshots.push({
        noiseLevel: 0.008,
        explosionLevel: 0,
        bearing: 0,
        timestamp: Date.now(),
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
      });
    });
  }

  interval: NodeJS.Timeout;

  noiseSource: any;
  noiseAngleSource: any;
  explosionSource: any;
  pointDistortion: any;

  /* Shouldn't have a default here. */
  snapshots: Array<SoundSnapshot> = [
    {
      pointSources: [
        /*{
          bearing: 180,
          freqs: [{ freq: 100, volume: 0.5 }],
        },
        {
          bearing: 120,
          freqs: [{ freq: 100, volume: 0.2 }],
        },*/
      ],
      noiseLevel: 0.5,
      explosionLevel: 0,
      bearing: 0,
      timestamp: 0,
    },
  ];

  getCurrentSnapshot(): SoundSnapshot {
    return this.snapshots[this.snapshots.length - 1];
  }

  getSnapshotAtTime(time: number) {
    // lol O(n)
    for (let i = this.snapshots.length - 1; i > 0; i--) {
      const snapshot = this.snapshots[i];
      if (snapshot.timestamp < time) {
        return snapshot;
      }
    }
    // default to earliest snapshot
    return this.snapshots[0];
  }

  // Bearing is always 0 - 360, sample is in ms since epoch
  sample(bearing: number, sampleTime?: number | undefined) {
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
        const bearingOffset = Math.abs(
          POINT_DISTORTION_MULTIPLIER *
            this.pointDistortion.perlin2(
              (bearing * POINT_DISTORTION_SCALE) / 360,
              (time * NOISE_SCALE_VERTICAL) / 1000
            ) +
            bearing -
            pointBearing
        );
        return (
          avgFreqVolume *
          Math.max(1 - bearingOffset / POINT_DISTORTION_SPREAD, 0)
        );
      }
    );
    return backgroundNoise + pointNoises.reduce((a, b) => a + b, 0);
  }
}
