import createWaterfall from "./createWaterfall";
import BroadbandSource from "../broadbandSource";
import createNarrowbandWaterfall from "./narrowbandWaterfalls";
import NarrowbandSource from "../narrowbandSource";

const buildBroadbandWaterfalls = (
  broadbandSource: BroadbandSource,
  narrowbandSource: NarrowbandSource
) => ({
  broadbandShort: createWaterfall(broadbandSource, {
    multiplier: 4,
    contrast: 1,
    gain: 0.1,
  }),
  broadbandMedium: createWaterfall(broadbandSource, {
    multiplier: 16,
    contrast: 2,
    gain: 0.035,
  }),
  broadbandLong: createWaterfall(broadbandSource, {
    multiplier: 64,
    contrast: 4,
    gain: 0.004,
  }),
  narrowbandFreq: createNarrowbandWaterfall(narrowbandSource, {
    multiplier: 1,
    contrast: 4,
    gain: 1,
  }),
});

export default buildBroadbandWaterfalls;
