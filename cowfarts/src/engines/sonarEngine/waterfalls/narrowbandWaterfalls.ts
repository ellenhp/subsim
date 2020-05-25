import { Pipe } from "../../../util/pipe";
import BroadbandSource from "../broadbandSource";
import SnapshotManager from "../snapshotManager";
import NarrowbandSource from "../narrowbandSource";

interface DisplaySettings {
  gain: number;
  contrast: number;
  multiplier: number;
}

export interface NarrowbandScreen {
  timeScopeInSeconds: number;
  leftFreq: number;
  rightFreq: number;
  hRes: number;
  vRes: number;
  updateBearing: (bearing: number) => void;
  data: Pipe<ImageData>;
}

export const H_RES = 200;
export const V_RES = 300;
const LEFT_FREQ = 10;
const RIGHT_FREQ = 40000;
const FREQ_RATIO = RIGHT_FREQ / LEFT_FREQ;

const GAIN = 10;

const leftIdxToFreq = (idx: number) => LEFT_FREQ * FREQ_RATIO ** (idx / H_RES);

// What is the scope of a screen, under multiplier of 1?
const BASE_SCOPE_SECONDS = 20;
const UPDATE_INTERVAL_MS = (BASE_SCOPE_SECONDS * 1000) / V_RES;

const gameEpoch = Date.now(); // TODO<< FIX THIS SHIT.

const timeToSampleIdx = (atTime: number) => {
  return Math.floor((atTime - gameEpoch) / UPDATE_INTERVAL_MS);
};

const sampleIdxToTime = (sample: number) => {
  return Math.floor(sample * UPDATE_INTERVAL_MS + gameEpoch);
};

const createNarrowbandWaterfall = (
  narrowbandSource: NarrowbandSource,
  //snapshotManager: SnapshotManager,
  multiplier: number
): NarrowbandScreen => {
  const pipe = new Pipe<ImageData>();
  let selectedBearing = 0;
  let prevSampleCount = 0;

  let imageData = new ImageData(H_RES, V_RES);
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
        const freq = leftIdxToFreq(i);
        const timeForSample = sampleIdxToTime(prevSampleCount);

        const power = narrowbandSource.sample(
          freq,
          selectedBearing,
          timeForSample
        );
        const activation = Math.min(power * GAIN, 1);
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

  const updateBearing = (newBearing: number) => {
    selectedBearing = newBearing;
    prevSampleCount = 0;
    imageData = new ImageData(H_RES, V_RES);
  };

  return {
    timeScopeInSeconds: BASE_SCOPE_SECONDS * multiplier,
    leftFreq: LEFT_FREQ,
    rightFreq: RIGHT_FREQ,
    hRes: H_RES,
    vRes: V_RES,
    data: pipe,
    updateBearing,
  };
};

export default createNarrowbandWaterfall;
