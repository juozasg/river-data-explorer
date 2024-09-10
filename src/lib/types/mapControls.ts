export type MapLayersParams = {
	// enabledDatasets: string[]; // global state is used instead
	riverLayerVisible: boolean;
	baseStyleId: 'SATELLITE' | 'TOPO';
};

export const defaultLayersParams: MapLayersParams = {
	riverLayerVisible: true,
	baseStyleId: 'TOPO',
};