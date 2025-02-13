import { regionTypes, type RegionType } from '$src/appstate/data/features.svelte';
import * as ml from 'maplibre-gl';

export async function selectRegionTypeLayers(map: ml.Map, regionType: RegionType) {

	const disableRegionTypes = regionTypes.filter(rt => rt !== regionType);

	disableRegionTypes.forEach(rt => hideRegionTypeLayers(map, rt));
	showRegionTypeLayers(map, regionType);

	// if(map.getLayer('riverapp-river')) map.setLayoutProperty('riverapp-river', 'visibility', visible ? 'visible' : 'none');
}


export async function hideRegionTypeLayers(map: ml.Map, regionType: RegionType) {
	const layerNames = [
		`riverapp-${regionType}`,
		`riverapp-${regionType}-outline`
	];

	layerNames.forEach(layerName => {
		// console.log('hideRegionTypeLayers', layerName);
		if (map.getLayer(layerName)) map.setLayoutProperty(layerName, 'visibility', 'none');
	});
}

export async function showRegionTypeLayers(map: ml.Map, regionType: RegionType) {
	const layerNames = [
		`riverapp-${regionType}`,
		`riverapp-${regionType}-outline`
	];

	layerNames.forEach(layerName => {
		// console.log('showRegionTypeLayers', layerName);
		if (map.getLayer(layerName)) map.setLayoutProperty(layerName, 'visibility', 'visible');
	});
}