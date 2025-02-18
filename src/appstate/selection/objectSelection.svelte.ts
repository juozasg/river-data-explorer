// site or delineation selection

import type { Site } from "$src/lib/types/site";
import type { RegionFeature } from "../data/features.svelte";

export class ObjectSelectionState {
	site?: Site = $state();
	region?: RegionFeature = $state();

	clear() {
		this.site = undefined;
		this.region = undefined;
	}
}

export const selection1 = new ObjectSelectionState();
export const selection2 = new ObjectSelectionState();

export type MapSelectionMode = 'auto' | 'site' | 'huc10' | 'county' | 'river' | 'site-catchment' | 'custom-click' | 'custom-draw';
export const mapSelectionMode: MapSelectionMode = $state('auto');
export const mapSelectionTarget: '1' | '2' = $state('1');


// first build using WASM, then add caching second
// need both max caching and real-time calculation
// https://github.com/tidwall/tg

// geoindex
// river-1-sites: [...]
// huc10-041023523-sites: [...]
// huc8=04102352-sites: [...]
// site-sjrbc-01-catchment-sites: [...]
// and so on
