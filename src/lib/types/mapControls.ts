import type { RegionType } from "$src/appstate/data/features.svelte";

export type MapLayersParams = {
	// enabledDatasets: string[]; // global state is used instead
	riverLayerVisible: boolean;
	baseStyleId: 'SATELLITE' | 'TOPO';
	regionType: RegionType;
};

export const defaultLayersParams: MapLayersParams = {
	riverLayerVisible: true,
	baseStyleId: 'TOPO',
	regionType: 'county'
};