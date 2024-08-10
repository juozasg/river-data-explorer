let _enabledDatasetLayers: string[] = $state([]);

export function setEnabledDatasets(datasets: string[]) {
	console.log('setEnabledDatasetLayers', datasets);
	_enabledDatasetLayers = [...datasets];
}

export function enabledDatasets() {
	return _enabledDatasetLayers;
}