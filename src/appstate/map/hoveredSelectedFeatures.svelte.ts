import { addHoverTooltipPopup, clearHoverTooltipPopup } from '$src/lib/map/widgets/hoveredTooltipPopup';
import type { Site } from '$src/lib/types/site';
import { createPopupWorkaround } from '$src/lib/utils/createPopupWorkaround';
import { setFeatureState } from '$src/lib/utils/maplibre';
import * as ml from 'maplibre-gl';

abstract class FeatureState {
	feature: ml.MapGeoJSONFeature | null = $state(null);

	get id() {
		return this.feature?.id
	};

	get description() {
		if(this.feature) {
			const name = this.feature.properties?.name;
			return `${this.feature.id} (${name})`;
		} else {
			return 'none';
		}
	};
}

export class HoveredFeature extends FeatureState {
	feature: ml.MapGeoJSONFeature | null = $state(null);
	tooltipPopup: ml.Popup = createPopupWorkaround();

	constructor() {
		super();
	}

	update(map: ml.Map, feature: ml.MapGeoJSONFeature | null) {
		// if nothing changed, do nothing
		if(feature?.id === this.feature?.id) {
			return;
		}

		this.clear(map);
		this.feature = feature;

		if(feature) {
			setFeatureState(map, 'huc10', feature.id, { hover: true });
			addHoverTooltipPopup(map, feature, this.tooltipPopup);
		}

	}

	clear(map: ml.Map) {
		if(this.feature?.id)	 {
			setFeatureState(map, 'huc10', this.feature.id, { hover: false });
		}

		this.feature = null;
		clearHoverTooltipPopup(map, this.tooltipPopup)
	}

	containsSite(site: Site) {
		// return true;
		return this.feature?.id === site.huc10;
	}
}

export class SelectedFeature extends FeatureState  {
	update(map: ml.Map, feature: ml.MapGeoJSONFeature): boolean {
		// if nothing changed, do nothing
		if(feature?.id === this.feature?.id) {
			return false;
		}

		this.clear(map);
		this.feature = feature;

		if(feature) {
			setFeatureState(map, 'huc10', feature.id, { selected: true });
		}

		return true;
	}

	clear(map: ml.Map) {
		if(this.feature?.id) {
			setFeatureState(map, 'huc10', this.feature.id, { selected: false });
		}
		this.feature = null;
	}

	applyFeatureState(map: ml.Map) {
		if(this.feature?.id) {
			setFeatureState(map, 'huc10', this.feature.id, { selected: true });
		}
	}
}

export const hoveredArea = new HoveredFeature();
export const selectedArea = new SelectedFeature();
