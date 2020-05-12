import { puget, MapImage } from "./data";

export default class MapEngine {
  constructor(mapUrl: "puget") {
    this.mapImageEl = new Image();
    this.mapImageEl.src = puget.url;
    this.data = puget;
  }

  data: MapImage;
  mapImageEl: HTMLImageElement;
}
