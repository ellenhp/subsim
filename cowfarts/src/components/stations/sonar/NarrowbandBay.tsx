import React, { useState } from "react";
import { NarrowbandScreen } from "../../../engines/sonarEngine/waterfalls/narrowbandWaterfalls";
import NarrowbandWaterfall from "./NarrowbandWaterfall";
import { Engines } from "../../../engines/engine";
import BroadbandWaveform from "./BroadbandWaveform";
import "./NarrowbandBay.css";

interface NarrowbandBayProps {
  engines: Engines;
}

const NarrowbandBay = (props: NarrowbandBayProps) => {
  const [bearing, setBearing] = useState(0);

  return (
    <div className="narrowband-bay card">
      <BroadbandWaveform engines={props.engines} />
      <input
        className="narrowband-bearing-slider"
        type="range"
        value={bearing}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const newBearing = parseInt(event.target.value, 10);
          if (!newBearing) {
            return;
          }
          setBearing(newBearing);
          props.engines.sonarEngine.waterfalls.narrowbandFreq.updateBearing(
            (newBearing + 360) % 360
          );
        }}
        min={-180}
        max={180}
      />
      <NarrowbandWaterfall
        screen={props.engines.sonarEngine.waterfalls.narrowbandFreq}
        bearing={bearing}
      />
    </div>
  );
};

export default NarrowbandBay;
