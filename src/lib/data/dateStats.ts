
import { sitesTables } from "$src/appstate/data/datasets.svelte";
import type ColumnTable from "arquero/dist/types/table/column-table";
import type { Site } from "../types/site";
import { USEasternNoonDate } from '../utils/dates';

export function sitesEarliestDate(sites: Site[]): Date {
	const tables = sites.map((s) => sitesTables.get(s.id)).filter((t) => t);
	const firstDates = tables.map((t) => t?.get('date')).filter((d) => d) as Date[];
	if (firstDates.length === 0) return USEasternNoonDate(0);
	return USEasternNoonDate(Math.min(...firstDates.map((d) => d.valueOf())));
}


export function sitesLatestDate(sites: Site[]): Date {
	// if usgs assume realtime latest date, this prevents needless reactions to latestDate
	// after slow loading USGS datasets become available
	if (sites.find(s => s.dataset == 'usgs')) return USEasternNoonDate();

	const tables = sites.map((s) => sitesTables.get(s.id)).filter((t) => t);
	const lastDates = tables.map((t) => t?.get('date', t.numRows() - 1)).filter((d) => d) as Date[];
	if (lastDates.length === 0) return USEasternNoonDate();
	return USEasternNoonDate(Math.max(...lastDates.map((d) => d.valueOf())));
}


export function sitesValidDates(sites: Site[], varname: string): Date[] {
	const fullTables = sites.map((s) => sitesTables.get(s.id))
		.filter((t) => t)
		.filter((t) => t?.columnNames().includes(varname) && t?.columnNames().includes('date') && t?.numRows() > 0) as ColumnTable[];

	const allDatesSet = new Set<number>();

	let totalRows = 0;
	fullTables.forEach((t) => {
		totalRows += t.numRows();
		// console.log(first)
		const data = t.data() as any;
		for (let i = 0; i < t.numRows(); i++) {
			const val = t.get(varname, i);
			if (val !== undefined && val !== null && val !== '') {
				allDatesSet.add(t.get('date', i).valueOf());
			}
		}
	});

	const allDates = [...allDatesSet];

	allDates.sort((a, b) => a - b);

	return allDates.map((d) => new Date(d));
}

