import snarkdown from 'snarkdown';

if (typeof window !== 'undefined') {
	// @ts-ignore
	window.snarkdown = snarkdown;
}


import { variablesBriefMarkdown } from '$src/appstate/variablesMetadata.svelte';
import * as aq from 'arquero';
import type ColumnTable from 'arquero/dist/types/table/column-table';
import { sitesTables } from '$src/appstate/data/datasets.svelte';
import type { Site } from '../types/site';
import { varcategories } from '../utils/varHelpers';
import { dateEqualYMD } from '../utils/dates';
import { tab } from '@testing-library/user-event/dist/cjs/convenience/tab.js';

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

// tested and works, could be written better tho
// TODO: rewrite using binarySearch function
export function tableIndexBeforeDate(table: ColumnTable, date: Date, fromIndex = 0, toIndex?: number): number {
	if (table.numRows() === 0) return -1;
	if (toIndex === undefined) toIndex = table.numRows() - 1;
	if (fromIndex === toIndex) return table.get('date', fromIndex) < date ? fromIndex : -1;

	const midIndex = Math.floor((fromIndex + toIndex) / 2);
	if (midIndex === toIndex) return midIndex;

	const midDate = table.get('date', midIndex);
	// console.log('mid', midIndex, fmtDate(midDate))
	if (dateEqualYMD(midDate, date)) return midIndex;

	if (midDate < date) {
		const nextDate = table.get('date', midIndex + 1);
		if (nextDate > date) return midIndex;
		if (dateEqualYMD(nextDate, date)) return midIndex + 1;
		return tableIndexBeforeDate(table, date, midIndex + 1, toIndex);
	} else {
		if (table.get('date', midIndex - 1) < date) return midIndex - 1;
		return tableIndexBeforeDate(table, date, fromIndex, midIndex - 1);
	}
}


export function tableGetBeforeDate(table: ColumnTable, varname: string, date?: Date): number | Date | undefined {
	if (!table.columnNames().includes(varname)) return undefined;

	let timeIndex = date ? tableIndexBeforeDate(table, date) : table.numRows() - 1;
	// console.log('tableGetBeforeDate', varname, fmtDate(date), 'index', timeIndex);
	if (timeIndex === -1) return undefined;
	try {
		// console.log('at index', table.object(timeIndex));
		return table.get(varname, timeIndex);
	} catch (e) {
		console.error('varValueBeforeDate', e);
		return undefined;
	}
}


export function siteGetBeforeDate(site: Site, varname: string, date?: Date): number | Date | undefined {
	const table = sitesTables.get(site.id);
	if (!table) return undefined;
	return tableGetBeforeDate(table, varname, date);
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
		filteredTable = filteredTable.derive({ 'var': aq.escape((d: any) => varcategories(varname)!.indexOf(d.var)) });
	}
	return filteredTable.rename({ 'var': renameVar ?? varname });
}