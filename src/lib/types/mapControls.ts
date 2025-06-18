
export type MapLayersParams = {
	// enabledDatasets: string[]; // global state is used instead
	riverLayerVisible: boolean;
	ghostSitesVisible: boolean;
	basemapStyleId: 'SATELLITE' | 'TOPO' | 'HILLSHADE';
	normalizeLegendToVisibleData: boolean;
	normalizeRasterLegendToVisibleData: boolean;
	rasterLayer: undefined | 'lulc' | 'elevation';
	waterflowLayer: undefined | 'flow' | 'height' | 'exceedance';
	// rasterOverlay: undefined | 'lclu' | 'impervious';
};

