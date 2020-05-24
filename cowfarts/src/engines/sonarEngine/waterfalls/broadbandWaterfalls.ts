import createWaterfall from "./createWaterfall";
import BroadbandSource from "../broadbandSource";

const buildBroadbandWaterfalls = (broadbandSource: BroadbandSource) => ({
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
});

export default buildBroadbandWaterfalls;
