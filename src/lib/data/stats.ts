import * as aq from 'arquero';
import type ColumnTable from 'arquero/dist/types/table/column-table';

import type { SitesDataStats, VariableStats } from "$lib/types/analysis";
import type { Site } from "$lib/types/site";
import { fmtDateDMonY } from "$lib/utils";
import { sitesTables } from '$src/appstate/data/datasets.svelte';
import { concatTablesAllColumns } from './tableHelpers';
import { isCategoricalVar, variablesMetadata } from '$src/appstate/variablesMetadata.svelte';


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


export function allVariableStats(table: ColumnTable, { errorLabel } = { errorLabel: ''}): VariableStats[] {
	const variables = table.columnNames().filter(c => c !== 'date');
	return variables.map(v => variableStats(v, table, { errorLabel }));
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

function emptyVariableStats(variable: string): VariableStats {
	return {
		variable,
		label: variable,
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


export function simpleStats(varname: string, table?: ColumnTable): SimpleStats {
	if (!table || !table.numRows() || !table.columnNames().includes(varname)) {
		return { count: 0 };
	}

	const tsTable = table
		.select('date', varname).rename({ [varname]: 'var' })
		.filter(d => aq.op.is_nan(d!.var) == false)
		.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
		.reify();

	if (tsTable.numRows() === 0) {
		return { count: 0 };
	}

	const stats = tsTable.rollup({
		min: aq.op.min('var'),
		max: aq.op.max('var'),
		count: aq.op.count(),
	});

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

