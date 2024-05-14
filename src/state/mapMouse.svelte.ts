import type { Point } from "$src/types/basic";
import type { LngLat, MapMouseEvent } from "maplibre-gl";

let count = $state(0);

export const counter = {
  get count() { return count },
  increment: () => count += 1
}

export class MapMouseLocation {
  lngLat: LngLat | null = $state(null);
  point: Point | null = $state(null);
  map: any = $state(null);

  constructor() {

  }

  onMouseMove(map: any, e: MapMouseEvent & any) {
    this.lngLat = e.lngLat.wrap();
    this.point = e.point;
    this.map = map;
  }

  onMouseOut() {
    this.lngLat = null;
    this.point = null;
    this.map = null;
  }
}

export const mapMouseLocation = new MapMouseLocation();

