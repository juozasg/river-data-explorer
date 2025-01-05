import snarkdown from 'snarkdown';

import { variablesBriefMarkdown } from '$src/appstate/variablesMetadata.svelte';
import * as aq from 'arquero';
import type ColumnTable from 'arquero/dist/types/table/column-table';
import { sitesTables } from '$src/appstate/data/datasets.svelte';
import type { Site } from '../types/site';
import { varcategories } from '../utils/varHelpers';
import { dateEqualYMD } from '../utils/date';
import { mean, median } from '../utils';

export function tablesUniqueColumns(tables: ColumnTable[]): string[] {
	const cols = tables.flatMap(t => t.columnNames());
	return Array.from(new Set(cols));
}


export function emptyTable(columnNames: string[]): ColumnTable {
	const data = columnNames.map(name => [name, []]);
	return aq.table(data);
}


export function concatTablesAllColumns(tables: (ColumnTable | undefined)[]): ColumnTable {
	let nonEmptyTables = tables.filter(t => t && t.numRows() > 0) as ColumnTable[];
	if (nonEmptyTables.length === 0) return aq.table([]);

	const columns = tablesUniqueColumns(nonEmptyTables);
	const t0 = emptyTable(columns); // initial table determines result columns

	const tablesObjects = nonEmptyTables.map(t => t.objects()).flat();
	return aq.from(tablesObjects, columns);
}


export function tooltipText(varname: string): string {
	if (variablesBriefMarkdown.get(varname)) {
		return snarkdown(variablesBriefMarkdown.get(varname) as string);
	} else {
		return `Variable: ${varname}`;
	}
}


export function tableGetBeforeDate(table: ColumnTable, varname: string, date?: Date): number | Date | undefined {
	if (!table.columnNames().includes(varname)) return undefined;

	const renamedTable = table.select(['date', varname]).rename({ [varname]: 'var' })

	let filteredTable = renamedTable
	.filter(d => aq.op.is_nan(d!.var) == false)
	.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
	.rename({ 'var': varname })
	.reify();

	if(filteredTable.numRows() === 0) return undefined;
	let timeIndex = table.numRows() - 1;
	if (date) {
		const earliestDate = filteredTable.get('date', 0);
		if(date < earliestDate) return undefined;

		timeIndex = tableIndexBeforeDate(filteredTable, date);
	}
	// timeIndex = date ? tableIndexBeforeDate(filteredTable, date) : table.numRows() - 1;
	// console.log('tableGetBeforeDate', varname, fmtDate(date), 'index', timeIndex);
	if (timeIndex === -1) return undefined;
	try {
		// console.log('at index', table.object(timeIndex));
		return filteredTable.get(varname, timeIndex);
	} catch (e) {
		console.error('varValueBeforeDate', e);
		return undefined;
	}
}

// tested and works, could be written better tho
// TODO: rewrite using binarySearch function
export function tableIndexBeforeDate(table: ColumnTable, date: Date, fromIndex = 0, toIndex?: number): number {
	if (table.numRows() === 0) return -1;
	if (toIndex === -1) return -1;
	if (fromIndex < 0 || fromIndex >= table.numRows()) return -1;
	if (toIndex === undefined) toIndex = table.numRows() - 1;
	if (fromIndex === toIndex) return table.get('date', fromIndex) <= date ? fromIndex : -1;

	const midIndex = Math.floor((fromIndex + toIndex) / 2);
	// if (midIndex === toIndex) {
	// 	console.log('midIndex === toIndex', date, midIndex, toIndex, table.objects());
	// 	return midIndex;
	// }

	const midDate = table.get('date', midIndex);
	// console.log('mid', midIndex, fmtDate(midDate))
	if (dateEqualYMD(midDate, date)) return midIndex;

	if (midDate < date) {
		const nextDate = table.get('date', midIndex + 1);
		if (nextDate > date) return midIndex;
		if (dateEqualYMD(nextDate, date)) return midIndex + 1;
		return tableIndexBeforeDate(table, date, midIndex + 1, toIndex);
	} else { // midDate > date
		if (table.get('date', midIndex - 1) <= date) return midIndex - 1;
		return tableIndexBeforeDate(table, date, fromIndex, midIndex - 1);
	}
}



export function siteGetBeforeDate(site: Site, varname: string, date?: Date): number | Date | undefined {
	const table = sitesTables.get(site.id);
	if (!table) return undefined;
	return tableGetBeforeDate(table, varname, date);
}

export function siteBeforeVardateValue(siteid: string, varname: string, beforeDate?: Date): number | string | undefined {
	try {
		const table = sitesTables.get(siteid);
		if (!table) return;

		const value = tableGetBeforeDate(table, varname, beforeDate);
		if (typeof value === 'number' || typeof value == 'string') return value;
	} catch (e) {
		console.error('siteBeforeVardateValue', e);
		return;
	}
}


/* returns table with date and varname columns. varname column can be renamed  */
export function selectTableVar(table: ColumnTable | undefined, varname: string | undefined, renameVar: string | undefined) {
	if (!varname || !table) {
		return;
	}

	if (!table || table.numRows() === 0 || !table.columnNames().includes(varname)) {
		return;
	}

	const renamedTable = table.select(['date', varname]).rename({ [varname]: 'var' })

	let filteredTable = renamedTable
	.filter(d => aq.op.is_nan(d!.var) == false)
	.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
	.reify();

	if (filteredTable.numRows() === 0) {
		return;
	}

	// const renamedTable = siteTable.select(['date', varname]).rename({ [varname]: renameVar ?? varname })
	if(varcategories(varname)) {
		filteredTable = filteredTable.derive({ 'var': aq.escape((d: any) => catsToNumber(varname, d.var)) })
		.filter(d => aq.op.is_nan(d!.var) == false)
		.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
		.reify();

	}
	return filteredTable.rename({ 'var': renameVar ?? varname });
}

function catsToNumber(varname: string, value: string| string[]) {
	// console.log('cats to number', varname, value)
	if (varcategories(varname)) {
		if(typeof value === 'string') return varcategories(varname)!.indexOf(value as string);
		const vals = (value as string[]).map(v => varcategories(varname)!.indexOf(v)).filter(v => v !== -1);
		const md = Math.round(mean(vals));
		// console.log('VALS', vals, md)
		return md;

	}
	return value;
}



// if (typeof window !== 'undefined') {
// 	// @ts-ignore
// 	window.snarkdown = snarkdown;
// }