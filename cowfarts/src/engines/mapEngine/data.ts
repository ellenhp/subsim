export type MapData = {
  projection: "mercador";
  url: string;
  topLeft: {
    lat: number;
    lng: number;
  };
  bottomRight: {
    lat: number;
    lng: number;
  };
  height: number;
  width: number;
};

export const puget: MapData = {
  projection: "mercador",
  url:
    "https://storage.googleapis.com/artifacts.mass-276203.appspot.com/puget_chart.png",
  topLeft: {
    lat: 48 + 2200 / 5872,
    lng: -123 - 2020 / 3952,
  },
  bottomRight: {
    lat: 48.5 - 6230 / 5782,
    lng: -122.25 + 3537 / 3952,
  },
  height: 5570,
  width: 8426,
};
