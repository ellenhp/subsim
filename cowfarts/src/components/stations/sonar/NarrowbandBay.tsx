import React, { useState } from "react";
import { NarrowbandScreen } from "../../../engines/sonarEngine/waterfalls/narrowbandWaterfalls";
import NarrowbandWaterfall from "./NarrowbandWaterfall";
import { Engines } from "../../../engines/engine";
import BroadbandWaveform from "./BroadbandWaveform";
import "./NarrowbandBay.css";
import { signatureTypes } from "../../../workarounds/narrowbandSignature";

interface NarrowbandBayProps {
  engines: Engines;
}

const signatureTypesArray = Object.values(signatureTypes);

const NarrowbandShipInfo = () => {
  // Should match those in sonar engine...
  // wtf was ithinking evin
  const LEFT_FREQ = 10;
  const RIGHT_FREQ = 40000;
  const FREQ_RATIO = RIGHT_FREQ / LEFT_FREQ;

  const len = signatureTypesArray.length;
  const [sigIdx, setSigIdx] = useState(0);
  const next = () => setSigIdx((sigIdx + len + 1) % len);
  const prev = () => setSigIdx((sigIdx + len - 1) % len);

  //const leftIdxToFreq = (perc) => LEFT_FREQ * FREQ_RATIO ** (perc);


  const freqToLeft = (freq: number) => {
    return 100 * (Math.log(freq/ LEFT_FREQ)/ Math.log(FREQ_RATIO))
  }

  const sig = signatureTypesArray[sigIdx];
  if (!sig) {
    return <></>;
  }
  return (
    <div>
      <div>Compare above against below signature</div>
      <div className="narrowband-signature-display">
        {sig.signature.map((freq) => 
          <div className="mark" style={{ left: `${freqToLeft(freq)}%` }}></div>;
        )}
      </div>
      <div>{sig.description}</div>
      <button onClick={next}>Next Signature</button>
      <button onClick={prev}>Previous Signature</button>
    </div>
  );
};

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
      <NarrowbandShipInfo />
    </div>
  );
};

export default NarrowbandBay;
