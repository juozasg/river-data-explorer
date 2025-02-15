import type { MapLayersParams } from '$src/lib/types/mapControls';
import { aremove } from '$src/lib/utils/arrays';


export const defaultLayersParams: MapLayersParams = {
	riverLayerVisible: true,
	baseStyleId: 'TOPO',
	regionType: 'huc10',
	ghostSitesVisible: false
};


let _enabledDatasetLayers: string[] = $state([]);

export function setEnabledDatasets(datasets: string[]) {
	_enabledDatasetLayers = [...datasets];
}

export function enabledDatasets() {
	return _enabledDatasetLayers;
}

export function isDatasetEnabled(dataset: string) {
	return [..._enabledDatasetLayers].includes(dataset);
}

export function toggleDatasetEnable(dataset: string) {
	if ([..._enabledDatasetLayers].includes(dataset)) {
		_enabledDatasetLayers = aremove(_enabledDatasetLayers, dataset);
	} else {
		_enabledDatasetLayers.push(dataset);
	}
}
