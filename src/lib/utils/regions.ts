import type { BasinObject } from "$src/appstate/data/basinObject.svelte";

export const regionIdLabel = (basinObject: BasinObject) => {
	const rt = basinObject.objectType;
	if (rt == "county") return "County FIPS";
	if (rt == "state") return "State FIPS";
	else return (rt || '').toUpperCase();
};
