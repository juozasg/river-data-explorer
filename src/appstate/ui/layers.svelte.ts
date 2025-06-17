import type { MapLayersParams } from '$src/lib/types/mapControls';
// import { aremove } from '$src/lib/utils/arrays';

// type BasemapStyleId = 'TOPO' | 'SATELLITE';
// let _basemapStyleId: BasemapStyleId = $state('TOPO');
// export const basemapStyleId = () => _basemapStyleId;
// export function setBasemapStyleId(styleId: BasemapStyleId) {
// 	_basemapStyleId = styleId;
// }

export const layerParams = $state<MapLayersParams>({
	riverLayerVisible: true,
	basemapStyleId: 'TOPO',
	ghostSitesVisible: false,
	normalizeLegendToVisibleData: false,
	rasterLayer: undefined,
	waterFlowLayer: undefined
});


// let _enabledDatasetLayers: string[] = $state([]);

// export function setEnabledDatasets(datasets: string[]) {
// 	_enabledDatasetLayers = [...datasets];
// }

// export function enabledDatasets() {
// 	return _enabledDatasetLayers;
// }

// export function isDatasetEnabled(dataset: string) {
// 	return [..._enabledDatasetLayers].includes(dataset);
// }

// export function toggleDatasetEnable(dataset: string) {
// 	if ([..._enabledDatasetLayers].includes(dataset)) {
// 		_enabledDatasetLayers = aremove(_enabledDatasetLayers, dataset);
// 	} else {
// 		_enabledDatasetLayers.push(dataset);
// 	}
// }
