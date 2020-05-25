import noise from "noisejs";
import { normalDistribution } from "../../util/math";
import SnapshotManager from "./snapshotManager";

// aaa
// ---
const FREQ_DISTORTION_MULTIPLIER = 0.3;
const FREQ_DISTORTION_HORIZ = 20;
const FREQ_DISTORTION_VERT = 0.5;
const FREQ_SPREAD = 0.03;

const POINT_DISTORTION_VERT = 1;
const POINT_DISTORTION_HORIZ = 20;
const POINT_DISTORTION_MULTIPLIER = 5;

// How wide the signal is spread to
const POINT_SPREAD = 5;

/*
 * If a signal is offset from sample pos by bearingOffset, what should be the
 * observed offset gain here? Area under this curve should be 1.
 */

const offsetGain = (bearingOffset: number) => {
  return normalDistribution(bearingOffset / POINT_SPREAD) / POINT_SPREAD;
};

export default class NarrowbandSource {
  constructor(snapshotManager: SnapshotManager) {
    this.freqDistortion = new noise.Noise(Math.random());
    this.pointDistortion = new noise.Noise(Math.random());

    this.snapshotManager = snapshotManager;
  }

  freqDistortion: any;
  pointDistortion: any;

  snapshotManager: SnapshotManager;

  // Bearing is always 0 - 360, sample is in ms since epoch
  // Freq is > 0
  sample(freq: number, bearing: number, sampleTime?: number | undefined) {
    if (!this.snapshotManager.hasSnapshot()) {
      return 0;
    }
    const snapshot =
      sampleTime === undefined
        ? this.snapshotManager.getCurrentSnapshot()
        : this.snapshotManager.getSnapshotAtTime(sampleTime);
    const time = sampleTime === undefined ? Date.now() : sampleTime;

    const pointNoises = snapshot.pointSources.map(
      ({ bearing: pointBearing, broadbandPowerLevel, freqs }) => {
        const freqNoise =
          freq *
          FREQ_DISTORTION_MULTIPLIER *
          this.freqDistortion.perlin2(
            (freq * FREQ_DISTORTION_HORIZ) / 360,
            (time * FREQ_DISTORTION_VERT) / 1000
          );
        const freqGain = freqs
          .map((curFreq) =>
            normalDistribution(
              (curFreq - freq + freqNoise) / (FREQ_SPREAD * freq)
            )
          )
          .reduce((acc, cur) => acc + cur, 0);

        const bearingNoise =
          POINT_DISTORTION_MULTIPLIER *
          this.pointDistortion.perlin2(
            (bearing * POINT_DISTORTION_HORIZ) / 360,
            (time * POINT_DISTORTION_VERT) / 1000
          );

        // Find shortest between bearings 1 and 2.
        const bearingOne = pointBearing;
        const bearingTwo = bearingNoise + bearing;
        const bearingOffset = Math.min(
          (bearingOne - bearingTwo + 360) % 360,
          (bearingTwo - bearingOne + 360) % 360
        );
        return freqGain * offsetGain(bearingOffset) * broadbandPowerLevel;
      }
    );
    return pointNoises.reduce((a, b) => a + b, 0);
  }
}
