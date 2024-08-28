import * as ml from 'maplibre-gl';
import type { Snippet } from 'svelte';
import type { MapLayersParams } from './mapControls';


export interface MapLibreMapProps {
	zoom?: number;
	center?: LngLatLike;

	layersParams: MapLayersParams;
	divElement?: HTMLDivElement;
	mlMap?: ml.Map;
	addLayers?: (map: ml.Map) => Promise<void>;
}