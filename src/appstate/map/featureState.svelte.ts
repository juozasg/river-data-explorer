import * as ml from 'maplibre-gl';

import { geomFeatureName } from '../data/geometries.svelte';


export class MapFeature  {
	source: string;
	id: string | number;
	name: string;
	sourceType: string;

	constructor(source: string, id: string | number) {
		this.source = source;
		this.id = id;
		this.name = geomFeatureName(source, id);
		this.sourceType = source.replace(/^riverapp-/, '');
	}

};


export type FeatureSelectionChangeFn = (current: MapFeature | undefined, updated: MapFeature | undefined) => void;

export class MapFeatureSelectionState {
	#feature = $state<MapFeature>();
	#onChange: FeatureSelectionChangeFn

	constructor(onChange: FeatureSelectionChangeFn) {
		this.#onChange = onChange;
	}

	get feature() { return this.#feature }
	set feature(feature: MapFeature | undefined) {
		// nothing changed
		if(this.#feature?.id == feature?.id && this.#feature?.source == feature?.source) return;
		this.#onChange(this.#feature, feature);
		this.#feature = feature
	}

	get name() {
		return this.#feature?.name || '';
	}
}


export const toggleHoveredFeatureState = (map: ml.Map | undefined, current: MapFeature | undefined, updated: MapFeature | undefined) => {
	if (!map) return;
	if (current) {
		map.setFeatureState({ source: current.source, id: current.id }, { hover: false });
	}

	if (updated) {
		map.setFeatureState({ source: updated.source, id: updated.id }, { hover: true });
	}
}


export const toggleSelectedFeatureState = (map: ml.Map | undefined, current: MapFeature | undefined, updated: MapFeature | undefined) => {
	if (!map) return;
	if (current) {
		map.setFeatureState({ source: current.source, id: current.id }, { selected: false });
	}

	if (updated) {
		map.setFeatureState({ source: updated.source, id: updated.id }, { selected: true });
	}
}

