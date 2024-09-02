import * as ml from 'maplibre-gl';
import type { Snippet } from 'svelte';
import type { MapLayersParams } from './mapControls';
import type { Site } from './site';

import type { Maybe } from '.';
import type { LngLatLike } from 'maplibre-gl';
import type { S } from 'vitest/dist/reporters-yx5ZTtEV.js';
import type { RegionFeature } from '$src/appstate/data/features.svelte';



export interface MapLibreMapProps {
	zoom?: number;
	center?: LngLatLike;

	layersParams: MapLayersParams;
	divElement?: HTMLDivElement;
	mlMap?: ml.Map;
	addLayers?: (map: ml.Map) => Promise<void>;
}



export class DataSelection {
	yVar?: string;
	zVar?: string;
	ySite?: Site;
	zSite?: Site;
	yRegion?: RegionFeature;
	zRegion?: RegionFeature;
}