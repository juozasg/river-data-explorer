import type { Point } from "$lib/types/map";
import type { LngLat, MapMouseEvent } from "maplibre-gl";

export class MapMouseLocation {
  lngLat: LngLat | null = $state(null);
  point: Point | null = $state(null);
  map: any = $state(null);

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

