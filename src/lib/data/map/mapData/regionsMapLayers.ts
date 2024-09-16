
import * as ml from 'maplibre-gl';
import { addRiverLayers } from './riverLayers';
import { regionTypes } from '$src/appstate/data/features.svelte';


export async function addMapLayers(map: ml.Map): Promise<void> {
	regionTypes.forEach(regionType => addLayersRegionType(map, regionType));
	addRiverLayers(map);
}

function addLayersRegionType(map: ml.Map, regionType: string): void {
	map.addLayer({
		id: `riverapp-${regionType}`,
		type: 'fill',
		source: `riverapp-${regionType}`,
		layout: {},
		paint: {
			'fill-color': [
				'case',
				['boolean', ['feature-state', 'selected'], false],
				'#098',
				'#698'
			],
			'fill-opacity': [
				'case',
				['boolean', ['feature-state', 'hover'], false],
				0.6,
				['boolean', ['feature-state', 'selected'], false],
				0.8,
				0.3
			]
		}
	});

	map.addLayer({
		'id': `riverapp-${regionType}-outline`,
		'type': 'line',
		source: `riverapp-${regionType}`,
		'layout': {},
		'paint': {
			'line-color': '#584070',
			'line-width': 1
		}
	});

}

