let _enabledDatasetLayers: string[] = $state([]);

export function setEnabledDatasets(datasets: string[]) {
	_enabledDatasetLayers = [...datasets];
}

export function enabledDatasets() {
	return _enabledDatasetLayers;
}