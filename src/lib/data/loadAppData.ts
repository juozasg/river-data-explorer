import { loadBasinFipsData } from "$src/appstate/data/basinFipsAreas.svelte";

export async function loadAppData() {
	console.log('Loading app data...');
	// get
	loadBasinFipsData();
}