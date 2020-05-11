import { Pipe } from "../../../../util";
import noise from "noisejs";

type PointSource = {
  volume: number;
  bearing: number;
};

type SoundSnapshot = {
  pointSources: Array<PointSource>;
  noiseLevel: number;
  explosionLevel: number;
};

const NOISE_SCALE_HORIZONTAL = 20;
const NOISE_SCALE_VERTICAL = 1;
const POINT_DISTORTION_SCALE = 20;
const POINT_DISTORTION_MULTIPLIER = 10;
const POINT_DISTORTION_SPREAD = 10;

export default class BroadbandSource {
  constructor(/*soundscape: Pipe<SoundSnapshot>*/) {
    this.currentSnapshot;
    this.noiseSource = new noise.Noise(Math.random());
    this.pointDistortion = new noise.Noise(Math.random());
    this.explosionSource = new noise.Noise(Math.random());
    setInterval(() => {
      this.currentSnapshot.pointSources[1].bearing += 1;
    }, 2000);
  }

  interval: NodeJS.Timeout;

  noiseSource: any;
  explosionSource: any;
  pointDistortion: any;

  /* Shouldn't have a default here. */
  currentSnapshot: SoundSnapshot = {
    pointSources: [
      {
        bearing: 180,
        volume: 0.5,
      },
      {
        bearing: 120,
        volume: 0.1,
      },
    ],
    noiseLevel: 0.5,
    explosionLevel: 0,
  };
  originTime: number = Date.now(); // in ms

  // Bearing is always 0 - 360
  sample(bearing) {
    const time = Date.now() - this.originTime;
    const backgroundNoise =
      (this.noiseSource.perlin2(
        (bearing * NOISE_SCALE_HORIZONTAL) / 360,
        (time * NOISE_SCALE_VERTICAL) / 1000
      ) /
        2 +
        0.5) *
      this.currentSnapshot.noiseLevel;
    const pointNoises = this.currentSnapshot.pointSources.map(
      ({ bearing: pointBearing, volume }) => {
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
          volume * Math.max(1 - bearingOffset / POINT_DISTORTION_SPREAD, 0)
        );
      }
    );

    return backgroundNoise + pointNoises.reduce((a, b) => a + b, 0);
  }
}
