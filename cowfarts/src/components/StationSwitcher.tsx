import React, { ReactElement } from "react";
import { stationMapping, Station } from "./stations";
import provideKeys from "./provideKeys";
import debounce from "lodash.debounce";
import "./StationSwitcher.css";

const WASD = {
  w: 87,
  a: 65,
  s: 83,
  d: 68,
};

const { w, a, d } = WASD;

const order: Station[] = [
  Station.HELM,
  Station.RADAR,
  Station.SONAR,
  Station.WEAPONS,
  Station.MAP,
];

const keyOrder: Array<Array<number>> = [[a], [a, w], [w], [w, d], [d]];

const keysToSelectedStation = (heldKeys: number[]): Station | undefined => {
  const held = (keyArray: number[]) => {
    if (keyArray.length !== heldKeys.length) {
      return false;
    }
    return !keyArray.find((key) => !heldKeys.includes(key));
  };

  return order[keyOrder.findIndex(held)];
};

const StationSwitcher = ({
  switchTo,
  currentStation,
  heldKeys,
}: {
  switchTo: (k: Station) => unknown;
  currentStation: Station;
  heldKeys: number[];
}) => {
  const entries = order.map((station: Station) => {
    const active = currentStation === station;
    return (
      <div>
        <button
          className={active ? "selected" : ""}
          disabled={active}
          onClick={() => switchTo(station)}
        >
          {station}
        </button>
      </div>
    );
  });
  const keySelectedStation = keysToSelectedStation(heldKeys);
  let overlay: ReactElement | undefined;
  if (keySelectedStation) {
    overlay = (
      <div className="stationswitcher-overlay">
        {order.map((station, idx) => {
          let className = `stationswitcher-overlay-station pos-${idx}`;
          if (keySelectedStation === station) {
            className += " selected";
          }
          return (
            <div className={className}>
              <div className="triangle">
                <svg height="320" width="160">
                  <path
                    d="M0 15 L80 315 L160 15 A300 300 0 0 0 0 15"
                    style={{
                      stroke: "line",
                      strokeWidth: "2",
                    }}
                  />
                </svg>
              </div>
              <div className="label">{station}</div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="station-switcher">
      <div className="switcher-nav-buttons">{entries}</div>
      {overlay}
    </div>
  );
};

export default provideKeys(
  StationSwitcher,
  [w, a, d],
  debounce((props, _, newKeys) => {
    const station = keysToSelectedStation(newKeys);
    station && props.switchTo(station);
  }, 50) as any // Ugh... it's hard to type throttle in TS apparently :((
);
