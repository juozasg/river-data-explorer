import { mapMouseLocation } from "$src/appstate/map/mapMouse.svelte.svelte";
import { notify } from "$src/appstate/ui/notifications.svelte";
import type { LngLat } from "maplibre-gl";

export const formatLngLat = (lngLat: LngLat, fractionDigits?: number) => {
	const numberFormat = (n: number) => fractionDigits ? n.toFixed(fractionDigits) : n;

	const [lon, lat] = lngLat.toArray();
	return [lat, lon].map((n) => numberFormat(n)).join(", ");
};

export const copyLngLat = (e: KeyboardEvent) => {
	// console.log("key", e);
	if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
		return;
	}

	if (e.key === 'c') {
		if(mapMouseLocation.lngLat) {
			navigator.clipboard.writeText(formatLngLat(mapMouseLocation.lngLat));
			console.log("copied", mapMouseLocation.lngLat);
			notify("Copied " + formatLngLat(mapMouseLocation.lngLat));
		}
	}
};
