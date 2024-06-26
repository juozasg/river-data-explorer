import * as ml from 'maplibre-gl';

import type { Site } from '$src/lib/types/site';
import { setFeatureState } from '$src/lib/utils/maplibre';
import type { BBoxLike } from '$src/lib/types/basic';

abstract class FeatureState {
	feature: ml.MapGeoJSONFeature | null = $state(null);

	get id() {
		return this.feature?.id;
	};

	get name() {
		return this.feature?.properties?.name || '';
	}

	get description() {
		if(this.feature) {
			const name = this.feature.properties?.name;
			return `${this.feature.id} (${name})`;
		} else {
			return 'none';
		}
	};
}

export class HoveredFeatureState extends FeatureState {
	extent: number = 0;

	constructor(extent: number = 0) {
		super();

		this.extent = extent;
	}

	mouseMove(e: ml.MapMouseEvent, layers: string[]) {
		const map = e.target;
		if(this.feature) {
			map.setFeatureState({ source: this.feature.source, id: this.feature.id }, { hover: false });
			this.feature = null;
		}

		let queryGeom: ml.PointLike | BBoxLike = e.point;
		if(this.extent) {
			queryGeom = [
				[e.point.x - this.extent, e.point.y - this.extent],
				[e.point.x + this.extent, e.point.y + this.extent]
			];
		}
		const hoveredFeatures = map.queryRenderedFeatures(queryGeom, { layers });
		if(hoveredFeatures.length) {
			this.feature = hoveredFeatures[0];
			map.setFeatureState({ source: hoveredFeatures[0].source, id: hoveredFeatures[0].id }, { hover: true });
		}
	}
}

export class SelectedFeature extends FeatureState  {
	// layer: string = 'sjriver-huc10';
	// returns true if the feature changed
	update(map: ml.Map, feature: ml.MapGeoJSONFeature): boolean {
		// if nothing changed, do nothing
		if(feature?.id === this.feature?.id) {
			return false;
		}

		this.clear(map);
		this.feature = feature;

		if(feature) {
			setFeatureState(map, feature.source, feature.id, { selected: true });
		}

		return true;
	}

	clear(map: ml.Map) {
		if(this.feature?.id) {
			setFeatureState(map, this.feature.source, this.feature.id, { selected: false });
		}
		this.feature = null;
	}
}

// global state for selected and hovered area feature and state
export const selectedArea = new SelectedFeature();
let _hoveredSite: Site | undefined = $state();

export const hoveredSite = {
	get site() {
		return _hoveredSite;
	},

	set(site: Site | undefined)  {
		_hoveredSite = site;
	}
}


let _selectedSite: Site | undefined = $state();

export const selectedSite = {
	get site() {
		return _selectedSite;
	},

	set(site: Site | undefined)  {
		_selectedSite = site;
	}
}

