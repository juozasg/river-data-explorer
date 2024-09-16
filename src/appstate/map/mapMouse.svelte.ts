import type { Point } from "$lib/types/map";
import type { Site } from "$src/lib/types/site";
import type { LngLat, MapMouseEvent } from "maplibre-gl";
import type { RegionFeature } from "../data/features.svelte";

export class MapMouseLocation {
  lngLat? = $state<LngLat>();
  point? = $state<Point>();
  site? = $state<Site>();
  regionFeature? = $state<RegionFeature>();
  map: any = $state();

  onMouseMove(map: any, e: MapMouseEvent & any) {
    this.lngLat = e.lngLat.wrap();
    this.point = e.point;
    this.map = map;
  }

  onHover(site?: Site, regionFeature?: RegionFeature) {
    this.site = site;
    this.regionFeature = regionFeature;
  }

  onMouseOut() {
    this.lngLat = undefined;
    this.point = undefined;
    this.map = undefined;
    this.regionFeature = undefined;
    this.site = undefined;
  }
}

export const mapMouseLocation = new MapMouseLocation();

