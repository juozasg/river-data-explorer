import * as maptilersdk from '@maptiler/sdk';
import * as ml from 'maplibre-gl';


export let hoveredHuc10: string | number | undefined | null;



export function onAreaHover(map: maptilersdk.Map) {
	// Create a popup, but don't add it to the map yet.
	const popup = new ml.Popup({
		closeButton: false,
		closeOnClick: false
	});
	// When the user moves their mouse over the huclayer, we'll update the
	// feature state for the feature under the mouse.
	map.on('mousemove', 'huc10', (e) => {
		if (e!.features!.length > 0) {
			const feature = e.features![0];
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
			const hoveredName = feature.properties?.name;
			map.setFeatureState(
				{ source: 'huc10', id: hoveredHuc10 },
				{ hover: true }
			);
			const geometry = feature.geometry as any;
			const point = geometry.coordinates[0][0];
			const description = `<h4>${hoveredName}</h4>`;

			console.log(`huc10 ${hoveredHuc10} (${hoveredName})`, feature, point);
			popup.setLngLat(point).setHTML(description).addTo(map);
			// console.log(geometry.coordinates[0][0]);




			// showPopup(map, feature);
			// const coords = feature.properties.centroid;
		}
	});

	// When the mouse leaves the huclayer, update the feature state of the
	// previously hovered feature.
	map.on('mouseleave', 'huc10', () => {
		if (hoveredHuc10) {
			map.setFeatureState(
				{source: 'huc10', id: hoveredHuc10},
				{hover: false}
			);
		}
		hoveredHuc10 = null;
	});
}
