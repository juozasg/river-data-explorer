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