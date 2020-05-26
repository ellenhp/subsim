import noise from "noisejs";
import { normalDistribution } from "../../util/math";
import SnapshotManager from "./snapshotManager";

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
const POINT_SPREAD = 5;

const WHERE_PERLIN_SEAM_IS = 180;

const EXPLOSION_NOISE_MULTIPLIER = 0.02;
const EXPLOSION_NOISE_HORIZONTAL = 20;
const EXPLOSION_NOISE_VERTICAL = 0.3;

/*
 * If a signal is offset from sample pos by bearingOffset, what should be the
 * observed offset gain here? Area under this curve should be 1.
 */

const offsetGain = (bearingOffset: number) => {
  return normalDistribution(bearingOffset / POINT_SPREAD) / POINT_SPREAD;
};

export default class BroadbandSource {
  constructor(snapshotManager: SnapshotManager) {
    this.noiseSource = new noise.Noise(Math.random());
    this.noiseAngleSource = new noise.Noise(Math.random());
    this.pointDistortion = new noise.Noise(Math.random());
    this.explosionSource = new noise.Noise(Math.random());

    this.snapshotManager = snapshotManager;
  }

  noiseSource: any;
  noiseAngleSource: any;
  explosionSource: any;
  pointDistortion: any;

  snapshotManager: SnapshotManager;

  // Bearing is always 0 - 360, sample is in ms since epoch
  sample(bearing: number, sampleTime?: number | undefined) {
    if (!this.snapshotManager.hasSnapshot()) {
      return 0;
    }
    const snapshot =
      sampleTime === undefined
        ? this.snapshotManager.getCurrentSnapshot()
        : this.snapshotManager.getSnapshotAtTime(sampleTime);
    const time = sampleTime === undefined ? Date.now() : sampleTime;

    // Workaround for perlin noise not being generated on a cylinder
    const bearingForBackgroundNoise = (bearing + WHERE_PERLIN_SEAM_IS) % 360;
    const noiseBearingDeviation =
      this.pointDistortion.perlin2(
        (bearingForBackgroundNoise * NOISE_ANGLE_SCALE_HORIZONTAL) / 360,
        (time * NOISE_ANGLE_SCALE_VERTICAL) / 1000
      ) * NOISE_ANGLE_SPREAD;
    const backgroundNoise =
      (this.noiseSource.perlin2(
        ((bearingForBackgroundNoise + noiseBearingDeviation) *
          NOISE_SCALE_HORIZONTAL) /
          360,
        (time * NOISE_SCALE_VERTICAL) / 1000
      ) /
        2 +
        0.5) *
      snapshot.noiseLevel;
    const pointNoises = snapshot.pointSources.map(
      ({ bearing: pointBearing, broadbandPowerLevel }) => {
        const bearingNoise =
          POINT_DISTORTION_MULTIPLIER *
          this.pointDistortion.perlin2(
            (bearing * POINT_DISTORTION_SCALE) / 360,
            (time * NOISE_SCALE_VERTICAL) / 1000
          );

        // Find shortest between bearings 1 and 2.
        const bearingOne = pointBearing;
        const bearingTwo = bearingNoise + bearing;
        const bearingOffset = Math.min(
          (bearingOne - bearingTwo + 360) % 360,
          (bearingTwo - bearingOne + 360) % 360
        );
        return broadbandPowerLevel * offsetGain(bearingOffset);
      }
    );
    let explosionNoise = 0;
    if (snapshot.explosionLevel > 0) {
      explosionNoise =
        ((snapshot.explosionLevel ** 0.05 *
          (1 +
            this.explosionSource.perlin2(
              (((bearing + WHERE_PERLIN_SEAM_IS) % 360) *
                EXPLOSION_NOISE_HORIZONTAL) /
                360,
              (time * EXPLOSION_NOISE_VERTICAL) / 1000
            ))) /
          2) *
        EXPLOSION_NOISE_MULTIPLIER;
    }
    return (
      backgroundNoise + pointNoises.reduce((a, b) => a + b, 0) + explosionNoise
    );
  }
}
