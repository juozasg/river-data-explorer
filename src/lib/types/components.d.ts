export interface MapLibreMapProps {
	zoom?: number;
	center?: LngLatLike;
	loadData: (map: ml.Map) => void;

	divElement?: HTMLDivElement;
	mlMap?: ml.Map;
}