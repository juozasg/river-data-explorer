import type { Point } from "$lib/types/map";
import type { Site } from "$src/lib/types/site";
import type { LngLat, MapMouseEvent } from "maplibre-gl";
import type { BasinObject } from "../data/basinObject.svelte";

export class MapMouseLocation {
  lngLat? = $state<LngLat>();
  point? = $state<Point>();
  site? = $state<Site>();
  // TODO: make sure this works
  basinObject? = $state<BasinObject>();
  map: any = $state();

  onMouseMove(map: any, e: MapMouseEvent & any) {
    this.lngLat = e.lngLat.wrap();
    this.point = e.point;
    this.map = map;
  }

  onHover(site?: Site, basinObject?: BasinObject) {
    this.site = site;
    this.basinObject = basinObject;
  }

  onMouseOut() {
    this.lngLat = undefined;
    this.point = undefined;
    this.map = undefined;
    this.basinObject = undefined;
    this.site = undefined;
  }
}

export const mapMouseLocation = new MapMouseLocation();


let _mapCursor = $state<string>('default');
export const setMapCursor = (cursor: string) => _mapCursor = cursor;
export const mapCursor = () => _mapCursor;
