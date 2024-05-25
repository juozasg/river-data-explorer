import type { County, CountyFips, State, StateFips } from "$lib/types/fips";
import { finishedLoading, startedLoading } from "$src/state/notifications.svelte";

export function countyStateFips(county: CountyFips): StateFips {
	return Math.floor(county / 1000) as StateFips;
}

export const States: Map<StateFips, State> = new Map();
export const Counties: Map<CountyFips, County> = new Map();



export async function loadFipsData() {
	startedLoading("fips", "State & County");
	States.set(18, { id: 18, name: "Indiana", abbr: "IN" });
	States.set(26, { id: 26, name: "Michigan", abbr: "MI" });

	const path = 'features/counties.json';



	finishedLoading("fips");
}
