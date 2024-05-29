import * as ml from 'maplibre-gl';

export interface MapLibreMapProps {
	zoom?: number;
	center?: LngLatLike;
	addSources: (map: ml.Map) => Promise<void>;
	addLayers: (map: ml.Map) => void;

	divElement?: HTMLDivElement;
	mlMap?: ml.Map;
}