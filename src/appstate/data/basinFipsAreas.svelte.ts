import { SvelteMap } from 'svelte/reactivity';

import { StateFips, type County, type StateCountyFips, type State } from "$lib/types/fips";
import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { startedLoading } from '../ui/loadingItem.svelte';

export function countyStateFips(county: StateCountyFips): StateFips {
	return county.slice(0, 2) as StateFips;
}

export const basinStates: Map<StateFips, State> = new SvelteMap();
export const basinCounties: Map<StateCountyFips, County> = new SvelteMap();


export async function loadBasinFipsData() {
	const finishedLoading = startedLoading("State & County Definitions");

	basinStates.set(StateFips.Indiana, { id: StateFips.Indiana, name: "Indiana", abbr: "IN" });
	basinStates.set(StateFips.Michigan, { id: StateFips.Michigan, name: "Michigan", abbr: "MI" });

	const path = 'features/counties.csv';
	const countiesRows = await loadDataCsv(path);

	for (const row of countiesRows) {
		// countyfp,statefp,countyns,name,nameLegal,lat,lon,areaLandSqkm,areaWaterSqkm
		const stateCountyFips = `${row.statefp}${row.countyfp}` as StateCountyFips;
		const county: County = {
			id: stateCountyFips,
			state: basinStates.get(row.statefp as StateFips)!,
			name: row.name as string,
			lat: parseFloat(row.lat as string),
			lon: parseFloat(row.lat as string),
			areaLand: parseFloat(row.areaLandSqkm as string),
			areaWater: parseFloat(row.areaWaterSqkm as string),
		}

		basinCounties.set(county.id, county);
	}

	// console.log('states', [...basinStates]);
	// console.log('counties',[...basinCounties]);
	finishedLoading();
}
