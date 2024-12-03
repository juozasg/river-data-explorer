import * as aq from 'arquero';
import type ColumnTable from 'arquero/dist/types/table/column-table';

import type { SitesDataStats, VariableStats } from "$lib/types/analysis";
import type { Site } from "$lib/types/site";
import { fmtDateDMonY } from '../utils/date';
import { sitesTables } from '$src/appstate/data/datasets.svelte';
import { concatTablesAllColumns } from './tableHelpers';
import { isCategoricalVar, variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
import { varcategories, varlabel } from '../utils/varHelpers';


export function columnMeans(table: ColumnTable): any {
	const cols = table.columnNames() || [];
	const colMeanOps = cols.reduce((a: any, v: any) => { a[v] = aq.op.mean(v); return a }, {});
	const means = table.rollup(colMeanOps).object();

	return means;
}


export function sitesDataStats(sites: Site[]): SitesDataStats {
	try {
		if (sites.length === 0) {
			return noSitesStats;
		}

		const numSites = sites.length;
		const tables: ColumnTable[] = sites.map(site => sitesTables.get(site.id)).filter(t => t !== undefined && t.numRows() > 0) as ColumnTable[];
		if (tables.length === 0) {
			return noSitesStats;
		}

		const table = concatTablesAllColumns(tables).orderby('date').reify();

		if (table.numRows() === 0) {
			return noSitesStats;
		}

		const numVariables = table.columnNames().length - 1; // remove 'date'
		const numRecords = table.numRows();

		const dateFromLabel = fmtDateDMonY(table.get('date'));
		const dateToLabel = fmtDateDMonY(table.get('date', numRecords - 1));

		// console.log('data stats')

		return {
			numSites,
			numVariables,
			numRecords,
			dateFromLabel,
			dateToLabel,
		};
	} catch (e) {
		console.error('sitesDataStats error', e, sites.map(s => s.id));
		return noSitesStats;
	}
}

const noSitesStats = {
	numSites: 0,
	numVariables: 0,
	numRecords: 0,
	dateFromLabel: 'N/A',
	dateToLabel: 'N/A',
}


export function allVariableStats(table: ColumnTable, { errorLabel } = { errorLabel: '' }): VariableStats[] {
	const variables = table.columnNames().filter(c => c !== 'date');
	return variables.map(v => variableStats(v, table, { errorLabel }));
}

export function allVarsDailyMedians(tables: ColumnTable[]): ColumnTable {
	let combinedTable = concatTablesAllColumns(tables);
	if (combinedTable.numRows() == 0) return aq.table([]);

	const groupedTable = combinedTable.orderby('date').groupby('date');

	// console.log('grouped', groupedTable.objects({ grouped: true }));

	const rollup: any = {};
	combinedTable.columnNames().forEach(c => {
		if (varcategories(c)) {
			rollup[c] = aq.op.array_agg(c);
		}
		else {
			rollup[c] = aq.op.median(c);
		}
	});

	return rollupDailies(groupedTable, rollup);
}

export function varDailyMedian(tables: ColumnTable[], varname: string): ColumnTable {
	let combinedTable = concatTablesAllColumns(tables);
	if (combinedTable.numRows() == 0) return aq.table([]);
	if (!combinedTable.columnNames().includes(varname)) return aq.table([]);

	const groupedTable = combinedTable.orderby('date').groupby('date');

	const rollup: any = {};
	rollup[varname] = varcategories(varname) ?  aq.op.array_agg(varname) : aq.op.median(varname);
	return rollupDailies(groupedTable, rollup);

}

function rollupDailies(table: ColumnTable, rollup: any) {
	// const ru = table.rollup(rollup).derive({ 'date': aq.escape((r: any) => new Date(r.date)) }).orderby('date').reify();
	const ru = table.rollup(rollup).orderby('date').reify();

	// console.log('rolledUp', ru.objects());
	return ru;
}


export function variableStats(variable: string, table: ColumnTable, { errorLabel = '' }): VariableStats {
	try {
		if (table.numRows() === 0) {
			return emptyVariableStats(variable);
		}
		const label = variablesMetadata[variable]?.label || variable;

		const tsTable = table
			.select('date', variable).rename({ [variable]: 'var' })
			.filter(d => aq.op.is_nan(d!.var) == false)
			.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
			.reify();

		if (tsTable.numRows() === 0) {
			return emptyVariableStats(variable);
		}

		const numObservations = tsTable.numRows();
		const dateFromLabel = fmtDateDMonY(tsTable.get('date'));
		const dateToLabel = fmtDateDMonY(tsTable.get('date', numObservations - 1));
		const lastObservation = tsTable.get('var', numObservations - 1);

		const stats: any = isCategoricalVar(variable) ? emptyStringStats : calculateVarStats(tsTable)

		// console.log('variable stats')


		return {
			varname: variable,
			label,
			lastObservation,
			numObservations,
			dateFromLabel,
			dateToLabel,
			...stats,
		};
	} catch (e) {
		console.error('variableStats error', e, errorLabel);
		return emptyVariableStats(variable);
	}
}

function emptyVariableStats(varname: string): VariableStats {
	return {
		variable: varname,
		label: varlabel(varname),
		lastObservation: '',
		numObservations: 0,
		dateFromLabel: 'N/A',
		dateToLabel: 'N/A',
		...emptyStringStats,
	} as any;
}

function calculateVarStats(table: ColumnTable) {
	return table.rollup({
		min: aq.op.min('var'),
		max: aq.op.max('var'),
		mean: aq.op.mean('var'),
		median: aq.op.median('var'),
		stdDev: aq.op.stdev('var'),
	}).object();
}


export function simpleStats(colname: string, table?: ColumnTable, varname?: string): SimpleStats {
	if (!table || !table.numRows() || !table.columnNames().includes(colname)) {
		return { count: 0 };
	}

	const tsTable = table
		.select('date', colname).rename({ [colname]: 'var' })
		.filter(d => aq.op.is_nan(d!.var) == false)
		.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
		.reify();

	if (tsTable.numRows() === 0) {
		return { count: 0 };
	}

	if (varname && varcategories(varname)) {
		// console.log('vcats', varname, varcategories(varname))
		const max = varcategories(varname)!.length - 1;
		return { count: tsTable.numRows(), min: 0, max: max, range: max };
	}

	const stats = tsTable.rollup({
		min: aq.op.min('var'),
		max: aq.op.max('var'),
		count: aq.op.count(),
	});

	// console.log('simple stats')


	return {
		min: stats.get('min'),
		max: stats.get('max'),
		count: stats.get('count'),
		range: stats.get('max') - stats.get('min'),
	};
}

export type SimpleStats = {
	count: number,
	min?: number,
	max?: number,
	range?: number,
};

const emptyStringStats = {
	min: '',
	max: '',
	mean: '',
	median: '',
	stdDev: '',
};

