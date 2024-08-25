import { sitesTables } from "$src/appstate/data/datasets.svelte";
import { sites } from "$src/appstate/sites.svelte";
import type { Site } from "../types/site";
import { UTCDayDate } from "../utils";

export function sitesEarliestDate(sites: Site[]): Date {
	const tables = sites.map((s) => sitesTables.get(s.id)).filter((t) => t);
	const firstDates = tables.map((t) => t?.get('date')).filter((d) => d) as Date[];
	if (firstDates.length === 0) return UTCDayDate('1900-01-01');
	return UTCDayDate(Math.min(...firstDates.map((d) => d.valueOf())));
}


export function sitesLatestDate(sites: Site[]): Date {
	 // if usgs assume realtime latest date, this prevents needless reactions to latestDate
	 // after slow loading USGS datasets become available
	if(sites.find(s => s.dataset == 'usgs')) return UTCDayDate();

	const tables = sites.map((s) => sitesTables.get(s.id)).filter((t) => t);
	const lastDates = tables.map((t) => t?.get('date', t.numRows() - 1)).filter((d) => d) as Date[];
	if (lastDates.length === 0) return UTCDayDate();
	return UTCDayDate(Math.max(...lastDates.map((d) => d.valueOf())));
}

