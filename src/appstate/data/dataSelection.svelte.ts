import type { Site } from "$lib/types/site";
import type { RegionFeature } from "./features.svelte";

export class DataSelectionState {
	yVar?: string = $state();
	zVar?: string = $state();
	ySite?: Site = $state();
	zSite?: Site = $state();
	yRegion?: RegionFeature = $state();
	zRegion?: RegionFeature = $state();
}