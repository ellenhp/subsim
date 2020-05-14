// Idea: We want to be constantly updating this w/ the game state,
// since these need to be canvases, and constantly updated.
// In a certain sense, historical sonar data is captured solely in this interface.
// SO SINGLETON THEN

import { ElemSingleton, show, hide } from "../../../util/elemSingleton";
import BroadbandSource from "../broadbandSource";
import { Pipe } from "../../../util/pipe";

export const H_RES = 1000;
export const V_RES = 300;
const SCOPE_IN_SECONDS = 10;
const INPUT_MULTIPLIER = 1000;

interface DisplaySettings {
  gain: number;
  contrast: number;
  multiplier: number;
}

const H_RES = 1000;
const V_RES = 300;
const SCOPE_IN_SECONDS = 10;
const INPUT_MULTIPLIER = 1000;
const UPDATE_INTERVAL_MS = (SCOPE_IN_SECONDS * 1000) / V_RES;

const gameEpoch = Date.now(); // TODO<< FIX THIS SHIT.

const timeToSampleIdx = (atTime: number) => {
  return Math.floor((atTime - gameEpoch) / UPDATE_INTERVAL_MS);
};

const sampleIdxToTime = (sample: number) => {
  return Math.floor(sample * UPDATE_INTERVAL_MS + gameEpoch);
};

const createBroadbandWaterfall = (
  source: BroadbandSource,
  { multiplier, gain, contrast }: DisplaySettings
): Pipe<ImageData> => {
  const pipe = new Pipe<ImageData>();

  let prevSampleCount = 0;

  const imageData = new ImageData(H_RES, V_RES);
  setInterval(drawWaterfall, UPDATE_INTERVAL_MS);
  let samples: number[] = Array(H_RES).fill(0);

  function drawWaterfall() {
    prevSampleCount = Math.max(
      prevSampleCount,
      timeToSampleIdx(Date.now() - SCOPE_IN_SECONDS * multiplier * 1000),
      0
    );
    while (prevSampleCount < timeToSampleIdx(Date.now())) {
      for (var i = 0; i < H_RES; i++) {
        const bearing = (i * 360) / H_RES;
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
  return pipe;
};

const buildWaterfalls = (broadbandSource: BroadbandSource) => ({
  broadbandShort: createBroadbandWaterfall(broadbandSource, {
    multiplier: 4,
    contrast: 1,
    gain: 0.2,
  }),
  broadbandMedium: createBroadbandWaterfall(broadbandSource, {
    multiplier: 16,
    contrast: 2,
    gain: 0.1,
  }),
  broadbandLong: createBroadbandWaterfall(broadbandSource, {
    multiplier: 64,
    contrast: 3,
    gain: 0.05,
  }),
});

export default buildWaterfalls;
