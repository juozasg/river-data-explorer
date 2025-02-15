import type { RegionType } from "$src/appstate/data/features.svelte";

export type MapLayersParams = {
	// enabledDatasets: string[]; // global state is used instead
	riverLayerVisible: boolean;
	ghostSitesVisible: boolean;
	baseStyleId: 'SATELLITE' | 'TOPO' | 'HILLSHADE';
	regionType: RegionType;
};

