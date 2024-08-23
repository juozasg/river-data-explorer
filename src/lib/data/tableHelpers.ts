import snarkdown from 'snarkdown';

if(typeof window !== 'undefined') {
	// @ts-ignore
	window.snarkdown = snarkdown;
}


import { variablesBriefMarkdown } from '$src/appstate/variablesMetadata.svelte';
import  * as aq from 'arquero';
import type ColumnTable from 'arquero/dist/types/table/column-table';

export function tablesUniqueColumns(tables: ColumnTable[]): string[] {
	const cols = tables.flatMap(t => t.columnNames());
	return Array.from(new Set(cols));
}


export function emptyTable(columnNames: string[]): ColumnTable {
	const data = columnNames.map(name => [name, []]);
	return aq.table(data);
}


export function concatTablesAllColumns(tables: ColumnTable[]): ColumnTable {
	if(tables.length === 0) return aq.table([]);

	const columns = tablesUniqueColumns(tables);
	const t0 = emptyTable(columns); // initial table determines result columns
	return tables.reduce((acc, t) => acc.concat(t), t0);
}


export function tooltipText(varname: string): string  {
	if(variablesBriefMarkdown.get(varname)) {
		return snarkdown(variablesBriefMarkdown.get(varname) as string);
	} else {
		return `Variable: ${varname}`;
	}
}


export function tableIndexBeforeDate(table: ColumnTable, date: Date): number {
	return 0;
}


export function tableBeforeDate(table: ColumnTable, varname: string, date?: Date): number | undefined {
	if (!table.columnNames().includes(varname)) return undefined;

	const timeIndex = date ? tableIndexBeforeDate(table, date) : table.numRows() - 1;
	try {
		return table.get(varname, timeIndex);
	} catch (e) {
		console.error('varValueBeforeDate', e);
		return undefined;
	}

}