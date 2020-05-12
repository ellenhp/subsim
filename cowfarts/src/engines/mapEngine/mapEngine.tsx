/* This should maybe kinda exist?? IDK */

import { puget, MapData } from "./data";

export default class MapEngine {
  constructor(mapUrl: "puget") {
    this.mapImageEl = new Image();
    this.mapImageEl.src = puget.url;
    this.data = puget;
  }

  data: MapData;
  mapImageEl: HTMLImageElement;
}
