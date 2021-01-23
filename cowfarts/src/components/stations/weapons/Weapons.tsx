import React, { useState } from "react";
import { StationComponent, StationProps } from "..";
import { getWeaponCount } from "../../../gettorz";
import { fireTorpedo, fireNoisemaker, fireDecoy } from "../../../gameActions";
import "./Weapons.css";

type WeaponsConfigState = {
  adcapHeading: number;
  adcapSpeedKts: number;
  adcapEnableDistanceFeet: number;
};

const initialState: WeaponsConfigState = {
  adcapHeading: 0,
  adcapSpeedKts: 45,
  adcapEnableDistanceFeet: 6000,
};

const Weapons: StationComponent = ({ latestUpdate, game }: StationProps) => {
  const [state, setState] = useState<WeaponsConfigState>(initialState);

  const handleFireTorpedo = () => {
    fireTorpedo(
      game,
      state.adcapHeading,
      state.adcapSpeedKts,
      state.adcapEnableDistanceFeet
    );
  };

  const handleFireNoisemaker = () => {
    fireNoisemaker(game);
  };

  const handleFireDecoy = () => {
    fireDecoy(game);
  };

  const adcapCount = getWeaponCount(latestUpdate, "adcap");
  const noisemakerCount = getWeaponCount(latestUpdate, "noisemaker");
  const decoyCount = getWeaponCount(latestUpdate, "decoy");

  return (
    <div className="weapons-station">
      <div className="weapons-torpedo card">
        <h2>Torpedos</h2>
        <div className="inv-fire-thingy">
          <span>Inventory: {adcapCount}</span>
          <button disabled={adcapCount === 0} onClick={handleFireTorpedo}>
            Fire!
          </button>
        </div>
        <hr />
        <div className="weapons-configs">
          <label>
            <div>Torpedo Speed: {state.adcapSpeedKts}kts</div>
            <input
              type="range"
              value={state.adcapSpeedKts}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const number = parseInt(event.target.value, 10);
                if (!number) {
                  return;
                }
                setState({
                  ...state,
                  adcapSpeedKts: number,
                });
              }}
              min={20}
              max={50}
            />
          </label>
          <label>
            <div>Torpedo Heading: {state.adcapHeading}deg</div>
            <input
              type="range"
              value={state.adcapHeading}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const number = parseInt(event.target.value, 10);
                if (!number) {
                  return;
                }
                setState({
                  ...state,
                  adcapHeading: number,
                });
              }}
              min={0}
              max={360}
            />
          </label>
          <label>
            <div>
              Torpedo Enable Distance: {state.adcapEnableDistanceFeet}ft
            </div>
            <input
              type="range"
              value={state.adcapEnableDistanceFeet}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const number = parseInt(event.target.value, 10);
                if (!number) {
                  return;
                }
                setState({
                  ...state,
                  adcapEnableDistanceFeet: number,
                });
              }}
              min={2000}
              max={30000}
            />
          </label>
        </div>
      </div>
      <div className="weapons-noisemaker card">
        <h2>Noisemakers</h2>
        <div className="inv-fire-thingy">
          <span>Inventory: {noisemakerCount}</span>
          <button
            disabled={noisemakerCount === 0}
            onClick={handleFireNoisemaker}
          >
            Fire!
          </button>
        </div>
      </div>
      <div className="weapons-decoy card">
        <h2>Decoys</h2>
        <div className="inv-fire-thingy">
          <span>Inventory: {decoyCount}</span>
          <button disabled={decoyCount === 0} onClick={handleFireDecoy}>
            Fire!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Weapons;
