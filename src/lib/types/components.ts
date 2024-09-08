import * as ml from 'maplibre-gl';
import type { Snippet } from 'svelte';
import type { MapLayersParams } from './mapControls';
import type { Site } from './site';

import type { Maybe } from '.';
import type { LngLatLike } from 'maplibre-gl';

import type { RegionFeature } from '$src/appstate/data/features.svelte';



export interface MapLibreMapProps {
	zoom?: number;
	center?: LngLatLike;

	layersParams?: MapLayersParams;
	mlMap?: ml.Map;
	addLayers?: (map: ml.Map) => Promise<void>;
}
