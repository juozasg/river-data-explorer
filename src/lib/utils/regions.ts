import type { RegionFeature } from "$src/appstate/data/features.svelte";

export const regionIdLabel = (feature: RegionFeature) => {
	const rt = feature.regionType;
	if (rt == "county") return "County FIPS";
	if (rt == "state") return "State FIPS";
	else return rt.toUpperCase();
};
