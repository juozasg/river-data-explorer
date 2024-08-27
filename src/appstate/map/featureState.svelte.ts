import * as ml from 'maplibre-gl';

import type { Site } from '$src/lib/types/site';
import { safeQueryRenderedFeatures, setFeatureState } from '$src/lib/utils/maplibre';
import type { BBoxLike } from '$src/lib/types/basic';

abstract class MLMFeatureState {
	feature: ml.MapGeoJSONFeature | null = $state(null);

	get id() {
		return this.feature?.id;
	};

	get name() {
		return this.feature?.properties?.name || '';
	}

	get description() {
		if (this.feature) {
			const name = this.feature.properties?.name;
			return `${this.feature.id} (${name})`;
		} else {
			return 'none';
		}
	};
}

export class MLMHoveredFeatureState extends MLMFeatureState {
	extent: number = 0;

	constructor(extent: number = 0) {
		super();

		this.extent = extent;
	}

	clearCurrentFeatureState(map: ml.Map) {
		if (this.feature) {
			map.setFeatureState({ source: this.feature.source, id: this.feature.id }, { hover: false });
			this.feature = null;
		}
	}


	mouseMove(e: ml.MapMouseEvent, layers: string[]) {
		const map = e.target;

		let queryGeom: ml.PointLike | BBoxLike = e.point;
		if (this.extent) {
			queryGeom = [
				[e.point.x - this.extent, e.point.y - this.extent],
				[e.point.x + this.extent, e.point.y + this.extent]
			];
		}
		const hoveredFeatures = safeQueryRenderedFeatures(map, queryGeom, layers);
		if (hoveredFeatures.length < 1) {
			this.clearCurrentFeatureState(map);
			return;
		}

		const hoveredFeature = hoveredFeatures[0];

		// both current and new hovered features are null. nothing to do
		if (!this.feature && !hoveredFeature) {
			return;
		}

		// hovered feature didnt change
		if (this.feature && this.feature.id === hoveredFeature.id && this.feature.source === hoveredFeature.source) {
			return;
		}

		// hovered feature changed, triggers reactivity and slow stats recalculations
		this.clearCurrentFeatureState(map);
		this.feature = hoveredFeature;
		map.setFeatureState({ source: hoveredFeature.source, id: hoveredFeature.id }, { hover: true });
	}
}


export class SelectedFeature extends MLMFeatureState {
	// layer: string = 'riverapp-huc10';
	// returns true if the feature changed
	update(map: ml.Map, feature: ml.MapGeoJSONFeature): boolean {
		// if nothing changed, do nothing
		if (feature?.id === this.feature?.id) {
			return false;
		}

		this.clear(map);
		this.feature = feature;

		if (feature) {
			setFeatureState(map, feature.source, feature.id, { selected: true });
		}

		return true;
	}

	clear(map: ml.Map) {
		if (this.feature?.id) {
			setFeatureState(map, this.feature.source, this.feature.id, { selected: false });
		}
		this.feature = null;
	}
}

// global state for selected and hovered area feature and state
export const selectedRegion = new SelectedFeature();
let _hoveredSite: Site | undefined = $state();

export const hoveredSite = {
	get site() {
		return _hoveredSite;
	},

	set(site: Site | undefined) {
		_hoveredSite = site;
	}
}


let _selectedSite: Site | undefined = $state();
let _selectedSite2: Site | undefined = $state();

export const selectedSite = {
	get site() {
		return _selectedSite;
	},

	set(site: Site | undefined) {
		_selectedSite = site;
	}
}


export const selectedSite2 = {
	get site() {
		return _selectedSite2;
	},

	set(site: Site | undefined) {
		_selectedSite2 = site;
	}
}



