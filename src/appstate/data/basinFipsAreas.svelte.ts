import * as sr from 'svelte/reactivity';

import type { County, CountyFips, State, StateFips } from "$lib/types/fips";
import { loadDataCsv } from "$lib/data/cachedDataLoad";
import { startedLoading } from '../ui/loadingItem.svelte';


export function countyStateFips(county: CountyFips): StateFips {
	return Math.floor(county / 1000) as StateFips;
}

export const basinStates: Map<StateFips, State> = new sr.Map();
export const basinCounties: Map<CountyFips, County> = new sr.Map();


export async function loadBasinFipsData() {
	const finishedLoading = startedLoading("State & County Definitions");

	basinStates.set(18, { id: 18, name: "Indiana", abbr: "IN" });
	basinStates.set(26, { id: 26, name: "Michigan", abbr: "MI" });

	const path = 'features/counties.csv';
	const countiesRows = await loadDataCsv(path);

	for (const row of countiesRows) {
		// countyfp,statefp,countyns,name,nameLegal,lat,lon,areaLandSqkm,areaWaterSqkm
		const county: County = {
			id: parseInt(row.countyfp) as CountyFips,
			state: basinStates.get(parseInt(row.statefp) as StateFips)!,
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
