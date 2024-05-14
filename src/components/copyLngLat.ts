import { mapMouseLocation } from "$src/state/mapMouse.svelte";
import type { LngLat } from "maplibre-gl";

export const formatLngLat = (lngLat: LngLat) => {
	const [lon, lat] = lngLat.toArray();
	return [lat, lon].map((n) => n.toFixed(4)).join(", ");
};

export const copyLngLat = (e: KeyboardEvent) => {
	// console.log("key", e);
	if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
		return;
	}

	if (e.key === 'c') {
		if(mapMouseLocation.lngLat) {
			navigator.clipboard.writeText(mapMouseLocation.lngLat.toArray().join(", "));
			console.log("copied", mapMouseLocation.lngLat);
		}
	}
};
