import type { Site } from "$lib/types/site";
import type { RegionFeature } from "./features.svelte";

export class DataSelectionState {
	yVar?: string = $state();
	zVar?: string = $state();
	ySite?: Site = $state();
	zSite?: Site = $state();
	yRegion?: RegionFeature = $state();
	zRegion?: RegionFeature = $state();

	clearAxis(axis: "y" | "z") {
		if (axis === "y") {
			this.yVar = undefined;
			this.ySite = undefined;
			this.yRegion = undefined;
		} else {
			this.zVar = undefined;
			this.zSite = undefined;
			this.zRegion = undefined;
		}
	}

	selectAxis(
		varname: string,
		axis: "y" | "z",
		site?: Site,
		region?: RegionFeature,
		clearSelection = false
	) {
		// console.log("graph var button clicked", varname, axis);

		if (clearSelection) {
			this.clearAxis(axis);
			return;
		}

		if (axis === "y") {
			this.yVar = varname;
			this.ySite = site;
			this.yRegion = region;

			// console.log("select y", varname, site, region);
		} else {
			this.zVar = varname;
			this.zSite = site;
			this.zRegion = region;

			// console.log("select z", varname, site, region);
		}
	}
}