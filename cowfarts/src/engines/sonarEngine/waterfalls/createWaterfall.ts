import { Pipe } from "../../../util/pipe";
import SonarSource from "../sonarSource";

interface DisplaySettings {
  gain: number;
  contrast: number;
  multiplier: number;
}

export interface BroadbandScreen {
  timeScopeInSeconds: number;
  leftBearing: number;
  data: Pipe<ImageData>;
}

export const H_RES = 1000;
export const V_RES = 300;
const LEFT_BEARING = 180;

// What is the scope of a screen, under multiplier of 1?
const BASE_SCOPE_SECONDS = 10;
const INPUT_MULTIPLIER = 1000;
const UPDATE_INTERVAL_MS = (BASE_SCOPE_SECONDS * 1000) / V_RES;

const gameEpoch = Date.now(); // TODO<< FIX THIS SHIT.

const timeToSampleIdx = (atTime: number) => {
  return Math.floor((atTime - gameEpoch) / UPDATE_INTERVAL_MS);
};

const sampleIdxToTime = (sample: number) => {
  return Math.floor(sample * UPDATE_INTERVAL_MS + gameEpoch);
};

const createWaterfall = (
  source: SonarSource,
  { multiplier, gain, contrast }: DisplaySettings
): BroadbandScreen => {
  const pipe = new Pipe<ImageData>();

  let prevSampleCount = 0;

  const imageData = new ImageData(H_RES, V_RES);
  setInterval(drawWaterfall, UPDATE_INTERVAL_MS);
  let samples: number[] = Array(H_RES).fill(0);

  function drawWaterfall() {
    prevSampleCount = Math.max(
      prevSampleCount,
      timeToSampleIdx(Date.now() - BASE_SCOPE_SECONDS * multiplier * 1000),
      0
    );
    while (prevSampleCount < timeToSampleIdx(Date.now())) {
      for (var i = 0; i < H_RES; i++) {
        const bearing = ((i * 360) / H_RES + LEFT_BEARING) % 360;

        const sample = source.sample(bearing, sampleIdxToTime(prevSampleCount));
        const activation = Math.min(
          Math.pow(sample * INPUT_MULTIPLIER, contrast) * gain,
          1
        );
        samples[i] += activation / multiplier;
      }
      prevSampleCount++;
      if (prevSampleCount % multiplier === 0) {
        drawLine(samples);
        samples = Array(H_RES).fill(0);
      }
    }
  }

  function drawLine(samples: number[]) {
    // Move the old backbuffer data down by one pixel.
    const rowWidth = H_RES * 4;
    imageData.data.copyWithin(rowWidth, 0, imageData.data.length - rowWidth);

    // copy in
    for (let i = 0; i < samples.length; i++) {
      imageData.data[i * 4 + 1] = Math.floor(samples[i] * 256);
      imageData.data[i * 4 + 3] = 255;
    }
    pipe.fire(imageData);
  }
  return {
    timeScopeInSeconds: BASE_SCOPE_SECONDS * multiplier,
    leftBearing: LEFT_BEARING,
    data: pipe,
  };
};

export default createWaterfall;
