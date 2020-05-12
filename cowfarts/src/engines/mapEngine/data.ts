type MapImage = {
  projection: "mercador";
  url: string;
  topLeft: {
    lat: number;
    long: number;
  };
  bottomRight: {
    lat: number;
    long: number;
  };
};

export const puget: MapImage = {
  projection: "mercador",
  url:
    "https://storage.googleapis.com/artifacts.mass-276203.appspot.com/puget_chart.png",
  topLeft: {
    lat: 48 + 2200 / 5872,
    long: -123.5 - 204 / 3952,
  },
  bottomRight: {
    lat: 47.25 - 1856 / 5782,
    long: -121.75 + 204 / 3952,
  },
};
