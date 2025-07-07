
export type MapLayersParams = {
	// enabledDatasets: string[]; // global state is used instead
	riverLayerVisible: boolean;
	ghostSitesVisible: boolean;
	basemapStyleId: 'SATELLITE' | 'TOPO' | 'HILLSHADE';
	normalizeLegendToVisibleData: boolean;
	normalizeRasterLegendToVisibleData: boolean;
	rasterLayer: undefined | 'lulc' | 'elevation';
	waterflowLayer: undefined | 'rtflow' | 'rtheight' | 'rtexceedance';
	// rasterOverlay: undefined | 'lclu' | 'impervious';
};

