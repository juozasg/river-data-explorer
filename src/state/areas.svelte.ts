import { addHoverTooltipPopup, clearHoverTooltipPopup } from '$src/lib/map/widgets/hoveredTooltipPopup';
import { createPopupWorkaround } from '$src/lib/utils/createPopupWorkaround';
import * as ml from 'maplibre-gl';

abstract class FeatureState {
	feature: ml.MapGeoJSONFeature | null = $state(null);

	get id() {
		return this.feature?.id
	};

	get description() {
		if(this.feature) {
			const name = this.feature.properties?.name;
			return `huc10 ${this.feature.id} (${name})`;
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
			map.setFeatureState(
				{ source: 'huc10', id: feature.id },
				{ hover: true }
			);

			addHoverTooltipPopup(map, feature, this.tooltipPopup);
		}

	}

	clear(map: ml.Map) {
		if(this.feature?.id) {
			map.setFeatureState(
				{ source: 'huc10', id: this.feature.id },
				{ hover: false }
			);
		}

		this.feature = null;
		clearHoverTooltipPopup(map, this.tooltipPopup)
	}
}

export class SelectedFeature extends FeatureState  {
	feature: ml.MapGeoJSONFeature | null = $state(null);

	update(map: ml.Map, feature: ml.MapGeoJSONFeature) {
		// if nothing changed, do nothing
		if(feature?.id === this.feature?.id) {
			return;
		}

		this.clear(map);
		this.feature = feature;

		if(feature.id) {
			map.setFeatureState(
				{ source: 'huc10', id: feature.id },
				{ selected: true }
			);
		}
	}

	clear(map: ml.Map) {
		if(this.feature?.id) {
			map.setFeatureState(
				{ source: 'huc10', id: this.feature.id },
				{ selected: false }
			);
		}
		this.feature = null;
	}
}

export const hoveredArea = new HoveredFeature();
export const selectedArea = new SelectedFeature();
