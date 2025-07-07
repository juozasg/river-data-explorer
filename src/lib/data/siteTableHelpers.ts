import snarkdown from 'snarkdown';

import { variablesBriefMarkdown } from '$src/appstate/variablesMetadata.svelte';
import * as aq from 'arquero';
import type ColumnTable from 'arquero/dist/types/table/column-table';
import { siteDatasets } from '$src/appstate/data/datasets.svelte';
import type { Site } from '../types/site';
import { varCategoryKeys } from '../utils/varHelpers';
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
export function tableIndexBeforeDate(table?: ColumnTable, target?: Date, fromIndex = 0, toIndex?: number): number {
	if (!table || !target) return -1;
	if (table.numRows() === 0) return -1;
	if (toIndex === -1) return -1;
	if (fromIndex < 0 || fromIndex >= table.numRows()) return -1;
	if (toIndex === undefined) toIndex = table.numRows() - 1;
	if (fromIndex === toIndex) return table.get('date', fromIndex) <= target ? fromIndex : -1;

	const midIndex = Math.floor((fromIndex + toIndex) / 2);

	const midDate = table.get('date', midIndex);
	// console.log('mid', midIndex, fmtDate(midDate))
	if (midDate.valueOf() === target.valueOf()) return midIndex;

	if (midDate < target) {
		const nextDate = table.get('date', midIndex + 1);
		if (nextDate > target) return midIndex;
		if (nextDate.valueOf() === target.valueOf()) return midIndex + 1;
		return tableIndexBeforeDate(table, target, midIndex + 1, toIndex);
	} else { // midDate > date
		if (table.get('date', midIndex - 1) <= target) return midIndex - 1;
		return tableIndexBeforeDate(table, target, fromIndex, midIndex - 1);
	}
}

export function siteGetBeforeDate(site: Site, varname: string, date?: Date): number | Date | undefined {
	const table = siteDatasets.get(site.id);
	if (!table) return undefined;
	return tableGetBeforeDate(table, varname, date);
}

export function siteVarDateValue(id: number, varname: string, beforeDate?: Date): number | string | undefined {
	try {
		const table = siteDatasets.get(id);
		if (!table) return;

		const value = tableGetBeforeDate(table, varname, beforeDate);
		if (typeof value === 'number' || typeof value == 'string') return value;
	} catch (e) {
		console.error('siteBeforeVardateValue', e);
		return;
	}
}

export function siteHasData(site: Site, varname: string): boolean {
	if (!site || !site.id) return false;
	return siteIdHasData(site.id, varname);
}

export function siteIdHasData(id: number, varname: string): boolean {
	const table = siteDatasets.get(id);
	if (!table) return false;
	if (!table.columnNames().includes(varname)) return false;
	const renamedTable = table.select(['date', varname]).rename({ [varname]: 'var' })
	let filteredTable = renamedTable
	.filter(d => aq.op.is_nan(d!.var) == false)
	.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
	.reify();
	if (filteredTable.numRows() === 0) return false;

	return true;
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
	if(varCategoryKeys(varname)) {
		filteredTable = filteredTable.derive({ 'var': aq.escape((d: any) => catsToNumber(varname, d.var)) })
		.filter(d => aq.op.is_nan(d!.var) == false)
		.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
		.reify();

	}
	return filteredTable.rename({ 'var': renameVar ?? varname });
}

function catsToNumber(varname: string, value: string| string[]) {
	// console.log('cats to number', varname, value)
	if (varCategoryKeys(varname)) {
		if(typeof value === 'string') return varCategoryKeys(varname)!.indexOf(value as string);
		const vals = (value as string[]).map(v => varCategoryKeys(varname)!.indexOf(v)).filter(v => v !== -1);
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