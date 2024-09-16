import { mapMouseLocation } from "$src/appstate/map/mapMouse.svelte";
import { notify } from "$src/appstate/ui/notifications.svelte";
import type { LngLat } from "maplibre-gl";

export const formatLngLat = (lngLat: LngLat, fractionDigits?: number) => {
	const numberFormat = (n: number) => fractionDigits ? n.toFixed(fractionDigits) : n;

	const [lon, lat] = lngLat.toArray();
	return [lat, lon].map((n) => numberFormat(n)).join(", ");
};

export const copyMouseLocationData = (e: KeyboardEvent) => {
	// console.log("key", e);
	if(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
		return;
	}

	if(e.key === 'c') {
		if(mapMouseLocation.lngLat || mapMouseLocation.site || mapMouseLocation.regionFeature) {
			let text = "";
			if(mapMouseLocation.site) {
				text += `Site ID: ${mapMouseLocation.site.id}\n`;
				text += `Site Name: ${mapMouseLocation.site.name}\n`;
			}

			if(mapMouseLocation.regionFeature) {
				text += `Region Name: ${mapMouseLocation.regionFeature.name}\n`;
				text += `Region Type: ${mapMouseLocation.regionFeature.regionType}\n`;
				text += `Region ID: ${mapMouseLocation.regionFeature.id}\n`;
			}

			if(mapMouseLocation.lngLat) {
				text += `Latitude, Longitude: ${formatLngLat(mapMouseLocation.lngLat)}\n`;
			}


			navigator.clipboard.writeText(text);
			console.log("copied\n", text);
			notify(`Copied! <pre>${text}</pre>`);
		}
	}
};
