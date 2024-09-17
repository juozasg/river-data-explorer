import * as ml from 'maplibre-gl';
import type { RegionFeature } from '../data/features.svelte';
import type { Site } from '$src/lib/types/site';




export type FeatureSelectionChangeFn = (current: RegionFeature | undefined, updated: RegionFeature | undefined) => void;

export class MapFeatureSelectionState {
	#feature = $state<RegionFeature>();
	#onChange: FeatureSelectionChangeFn

	constructor(onChange: FeatureSelectionChangeFn) {
		this.#onChange = onChange;
	}

	get feature() { return this.#feature }
	set feature(feature: RegionFeature | undefined) {
		// nothing changed
		if (this.#feature?.id == feature?.id && this.#feature?.mlSource == feature?.mlSource) return;
		this.#onChange(this.#feature, feature);
		this.#feature = feature
	}

	get name() {
		return this.#feature?.name || '';
	}
}


export function toggleHoveredFeatureState(map: ml.Map | undefined,
	current: RegionFeature | undefined,
	updated: RegionFeature | undefined,
	selected: RegionFeature | undefined,
	hoveredSite: Site | undefined) {

	if (!map) return;
	if (current) {
		map.setFeatureState({ source: current?.mlSource, id: current.id }, { hover: false });
		map.setFeatureState({ source: current?.mlSource, id: current.id }, { willbeselected: false });

	}

	if (updated) {
		map.setFeatureState({ source: updated?.mlSource, id: updated.id }, { hover: true });
		if (updated.regionType as any !== 'river') {
			if (!selected || !hoveredSite) {
				// console.log('show yellow outline', selected, hoveredSite);
				map.setFeatureState({ source: updated?.mlSource, id: updated.id }, { willbeselected: true });
			}
		}
	}
}



export const toggleSelectedFeatureState = (map: ml.Map | undefined, current: RegionFeature | undefined, updated: RegionFeature | undefined) => {
	if (!map) return;
	if (current) {
		map.setFeatureState({ source: current?.mlSource, id: current.id }, { selected: false });
	}

	if (updated) {
		map.setFeatureState({ source: updated?.mlSource, id: updated.id }, { selected: true });
	}
}

