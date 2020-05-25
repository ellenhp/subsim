import React, { useState } from "react";
import { NarrowbandScreen } from "../../../engines/sonarEngine/waterfalls/narrowbandWaterfalls";
import NarrowbandWaterfall from "./NarrowbandWaterfall";

interface NarrowbandBayProps {
  screen: NarrowbandScreen;
}

const NarrowbandBay = (props: NarrowbandBayProps) => {
  const [bearing, setBearing] = useState(0);

  return (
    <div className="narrowband-bay card">
      <input
        type="range"
        value={bearing}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const newBearing = parseInt(event.target.value, 10);
          if (!newBearing) {
            return;
          }
          setBearing(newBearing);
          props.screen.updateBearing(newBearing);
        }}
        min={0}
        max={360}
      />
      <NarrowbandWaterfall screen={props.screen} bearing={bearing} />
    </div>
  );
};

export default NarrowbandBay;
