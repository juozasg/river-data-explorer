import * as ml from 'maplibre-gl';

// import type { MapGeoJSONFeature } from "maplibre-gl";

// type FeatureId = string | number | null | undefined;


// PLAN
// create just huc 10 code
// generalize later

let hoveredFeature: ml.MapGeoJSONFeature | null = $state(null);


export const hoveredPolygonFeature = {
	get id() { return hoveredFeature?.id },
	set: (feature: ml.MapGeoJSONFeature) => {
		hoveredFeature = feature;
	},
	clear: () => {
		hoveredFeature = null;
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