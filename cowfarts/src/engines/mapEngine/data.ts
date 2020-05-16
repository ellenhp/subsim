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
    lng: −123.512917933,
  },
  bottomRight: {
    lat: 45.993206522,
    lng: −121.665400203,
  },
  height: 5570,
  width: 8426,
};
