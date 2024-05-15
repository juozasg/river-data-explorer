import * as maptilersdk from '@maptiler/sdk';

export let hoveredHuc10: string | number | undefined | null;

export function onAreaHover(map: maptilersdk.Map) {
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
			console.log(`huc10 ${hoveredHuc10} (${hoveredName})`, feature);
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
