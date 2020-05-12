import { puget } from "./data";

export default class MapEngine {
  constructor(mapUrl: "puget") {
    this.mapImageEl = new Image();
    this.mapImageEl.src = puget.url;
  }

  mapImageEl: HTMLImageElement;
}
