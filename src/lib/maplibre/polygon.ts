import * as ml from 'maplibre-gl';

// TODO: move to component scope so differring maps can have their own hover and select state
export let hoveredHuc10: string | number | undefined | null;


function setHoverPolygonId(map: ml.Map, feature: ml.MapGeoJSONFeature) {
	if (hoveredHuc10 && hoveredHuc10 === feature.id) {
		return;
	}

	if (hoveredHuc10) {
		map.setFeatureState(
			{ source: 'huc10', id: hoveredHuc10 },
			{ hover: false }
		);
	}

	hoveredHuc10 = feature.id;
	map.setFeatureState(
		{ source: 'huc10', id: hoveredHuc10 },
		{ hover: true }
	);
}

function clearHoverPolygonId(map: ml.Map) {
	if (hoveredHuc10) {
		map.setFeatureState(
			{source: 'huc10', id: hoveredHuc10},
			{hover: false}
		);
	}
	hoveredHuc10 = null;
}

function addHoverPolygonPopup(map: ml.Map, feature: ml.MapGeoJSONFeature, popup: ml.Popup) {
	const hoveredName = feature.properties?.name;

	const geometry = feature.geometry as any;
	const point = geometry.coordinates[0][0];
	const description = `<h4>${hoveredName}</h4>`;

	console.log(`huc10 ${hoveredHuc10} (${hoveredName})`, feature, point);
	popup.setLngLat(point).setHTML(description).addTo(map);
}

function clearHoverPolygonPopup(map: ml.Map, popup: ml.Popup) {
	map.getCanvas().style.cursor = '';
	popup.remove();
}


export function createPolygonMouseListeners(map: ml.Map) {
	const popup = new ml.Popup({
		closeButton: false,
		closeOnClick: false
	});

	// When the user moves their mouse over the huclayer, we'll update the
	// feature state for the feature under the mouse.
	map.on('mousemove', 'huc10', (e) => {
		if (e!.features!.length > 0) {
			const feature = e.features![0];

			setHoverPolygonId(map, feature);
			addHoverPolygonPopup(map, feature, popup);
		}
	});

	// When the mouse leaves the huclayer, update the feature state of the
	// previously hovered feature.
	map.on('mouseleave', 'huc10', () => {
		clearHoverPolygonId(map);
		clearHoverPolygonPopup(map, popup)
	});

}
