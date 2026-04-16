import type { MapLayersParams } from '$src/lib/types/mapControls';

export const layerParams = $state<MapLayersParams>({
	riverLayerVisible: true,
	basemapStyleId: 'TOPO',
	ghostSitesVisible: false,
	normalizeLegendToVisibleData: false,
	normalizeRasterLegendToVisibleData: false,
	rasterLayer: undefined,
	// waterflowLayer: undefined
	// rasterLayer: 'lulc',
	waterflowLayer: 'rtflow'
});

