import * as ml from 'maplibre-gl';
import type { RegionFeature } from '../data/features.svelte';




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
		if(this.#feature?.id == feature?.id && this.#feature?.mlSource == feature?.mlSource) return;
		this.#onChange(this.#feature, feature);
		this.#feature = feature
	}

	get name() {
		return this.#feature?.name || '';
	}
}


export const toggleHoveredFeatureState = (map: ml.Map | undefined, current: RegionFeature | undefined, updated: RegionFeature | undefined) => {
	if (!map) return;
	if (current) {
		map.setFeatureState({ source: current?.mlSource, id: current.id }, { hover: false });
	}

	if (updated) {
		map.setFeatureState({ source: updated?.mlSource, id: updated.id }, { hover: true });
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

