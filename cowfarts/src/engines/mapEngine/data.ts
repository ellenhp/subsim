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
    lat: 48.373980978,
    lng: -123.512917933,
  },
  bottomRight: {
    lat: 46.935801631,
    lng: -122.103596758,
  },
  width: 5570,
  height: 8426,
};
