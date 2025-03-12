import * as ml from 'maplibre-gl';

import type { Site } from "$src/lib/types/site";
import type { RegionFeature } from "../data/regionFeatures.svelte";
import type { River, RiverSection } from "../data/rivers.svelte";

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


// class MapSelectionModeState {
// 	mode: MapSelectionMode = $state('auto');
// 	target: '1' | '2' = $state('1');
// }

// export const mapSelectionMode = new MapSelectionModeState();

export const mapSelectionMode = $state({
	mode: 'auto' as MapSelectionMode,
	target: '1' as '1' | '2',
});

export const mlmapHovered = $state({
	site: undefined as Site | undefined,
	region: undefined as RegionFeature | undefined,
	river: undefined as River | undefined,
	riverSection: undefined as RiverSection | undefined,
});



function listenMlmEvents(map: ml.Map) {

	map.on('mousemove', 'riverapp-regions-fill', (e) => {
		console.log('layer MMove', e.features?.map((f) => f.properties));
	});

	map.on('mouseleave', 'riverapp-regions-fill', (e) => {
		console.log('layer mLEAVE', e.features?.map((f) => f.properties));
	});
	// 	map.on('mouseenter', 'sites', (e) => {
	// 		mlmapHovered.site = selection1.site = e.features[0].properties as Site;
	// 	});

	// 	map.on('mouseleave', 'sites', () => {
	// 		mlmapHovered.site = selection1.site = undefined;
	// 	});

	// 	map.on('mouseenter', 'huc10', (e) => {
	// 		mlmapHovered.region = selection1.region = e.features[0].properties as RegionFeature;
	// 	});

	// 	map.on('mouseleave', 'huc10', () => {
	// 		mlmapHovered.region = selection1.region = undefined;
	// 	});
}




// export const mapSelectionMode = (() => {
// 	const _mode = $state<MapSelectionMode>('auto');
// 	const _target = $state<'1' | '2'>('1');

// 	return {
// 		get mode() {
// 			return _mode;
// 		}

// 		set mode(v: MapSelectionMode) {
// 			_mode = v;
// 		}
// 	}
// })();



// let _a = $state(false);

// export const a = () => _a;
// export const setA = (v: boolean) => _a = v;

// export const mapSelectionTarget: '1' | '2' = $state('1');


// first build using WASM, then add caching second
// need both max caching and real-time calculation
// https://github.com/tidwall/tg

// geoindex
// river-1-sites: [...]
// huc10-041023523-sites: [...]
// huc8=04102352-sites: [...]
// site-sjrbc-01-catchment-sites: [...]
// and so on
