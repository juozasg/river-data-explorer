import * as ml from 'maplibre-gl';

import { loadDataJson } from '$lib/data/cachedDataLoad';
import { geometries, type GeometryCollection } from '$src/appstate/data/geometries.svelte';

export async function addDataSourceGeoJSON(map: ml.Map, name: GeometryCollection, promoteId: string | undefined) {
	const data = await loadDataJson(`geojson/${name}.geojson`);
	geometries.set(name, data);

	if(!map.getSource(name)) {
		map.addSource(name, {
			type: 'geojson',
			data: data,
			promoteId: promoteId
		});
	}
}