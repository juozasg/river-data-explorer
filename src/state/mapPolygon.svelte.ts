import * as ml from 'maplibre-gl';

// import type { MapGeoJSONFeature } from "maplibre-gl";

// type FeatureId = string | number | null | undefined;


// PLAN
// create just huc 10 code
// generalize later

let hoveredFeature: ml.MapGeoJSONFeature | null = $state(null);
let selectedFeature: ml.MapGeoJSONFeature | null = $state(null);
let selectedFeatureMap: ml.Map | null = $state(null);


export const hoveredPolygonFeature = {
	get id() { return hoveredFeature?.id },
	set: (feature: ml.MapGeoJSONFeature) => {
		hoveredFeature = feature;
	},
	clear: () => {
		hoveredFeature = null;
	}
};

export const selectedPolygonFeature = {
	get id() { return selectedFeature?.id },
	get description() {
		if(selectedFeature) {
			const name = selectedFeature.properties?.name;
			return `huc10 ${selectedFeature.id} (${name})`;
		} else {
			return 'none';
		}
	},
	set: (map: ml.Map, feature: ml.MapGeoJSONFeature) => {
		selectedFeature = feature;
		selectedFeatureMap = map;

		if(selectedFeature) {
			map.setFeatureState(
				{ source: 'huc10', id: selectedFeature.id },
				{ selected: true });
			}
		},

		clear: () => {
			if(selectedFeatureMap && selectedFeature?.id) {
				selectedFeatureMap.setFeatureState(
					{ source: 'huc10', id: selectedFeature.id },
					{ selected: false }
				);
			}
			selectedFeature = null;
			selectedFeatureMap = null;
		}
	};


	// // export let selectedHuc10: FeatureId = $state(null);




	// export const setHoveredHuc10 = (id: FeatureId) => {
	// 	hoveredHuc10
	// }

	// // export const setSelectedHuc10 = (id: FeatureId) => {
	// // 	selectedHuc10 = id;
	// // }

	// // function