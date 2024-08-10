import * as aq from 'arquero';
import type ColumnTable from 'arquero/dist/types/table/column-table';

import type { SitesDataStats, VariableStats } from "$lib/types/analysis";
import type { Site } from "$lib/types/site";
import { fmtDate } from "$lib/utils";
import { sitesTables } from '$src/appstate/data/datasets.svelte';
import { concatTablesAllColumns } from './tableHelpers';
import { isCategoricalVar, variableMetadata } from '$src/appstate/variableMetadata';


export function columnMeans(table: ColumnTable): any {
	const cols = table.columnNames() || [];
	const colMeanOps = cols.reduce((a: any, v: any) => { a[v] = aq.op.mean(v); return a }, {});
	console.log('colMeanOps', colMeanOps)
	const means = table.rollup(colMeanOps).object();
	console.log('means', means)

	return means;
}


export function sitesDataStats(sites: Site[]): SitesDataStats {
	try {
		if (sites.length === 0) {
			return noSitesStats;
		}

		const numSites = sites.length;
		const tables: ColumnTable[] = sites.map(site => sitesTables.get(site.id)).filter(t => t !== undefined) as ColumnTable[];
		const table = concatTablesAllColumns(tables).orderby('date').reify();
		// console.log('STATS DEBuG', sites[0], table.columnNames(), table)

		const numVariables = table.columnNames().length - 1; // remove 'date'
		const numRecords = table.numRows();

		const dateFromLabel = fmtDate(table.get('date'));
		const dateToLabel = fmtDate(table.get('date', numRecords - 1));


		return {
			numSites,
			numVariables,
			numRecords,
			dateFromLabel,
			dateToLabel,
		};
	} catch (e) {
		console.error('sitesDataStats error', e)
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


export function allVariableStats(table: ColumnTable): VariableStats[] {
	const variables = table.columnNames().filter(c => c !== 'date');
	return variables.map(v => variableStats(v, table));
}


export function variableStats(variable: string, table: ColumnTable): VariableStats {
	try {
		const label = variableMetadata[variable]?.label || variable;

		const tsTable = table
			.select('date', variable).rename({ [variable]: 'var' })
			.filter(d => aq.op.is_nan(d!.var) == false)
			.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
			.reify();
		console.log(tsTable);

		if(tsTable.numRows() === 0) {
			return emptyVariableStats(variable);
		}

		const numObservations = tsTable.numRows();
		const dateFromLabel = fmtDate(tsTable.get('date'));
		const dateToLabel = fmtDate(tsTable.get('date', numObservations - 1));
		const lastObservation = tsTable.get('var', numObservations - 1);

		const stats: any = isCategoricalVar(variable) ? emptyStringStats : calculateVarStats(tsTable)

		return {
			variable,
			label,
			lastObservation,
			numObservations,
			dateFromLabel,
			dateToLabel,
			...stats,
		};
	} catch (e) {
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


export function simpleStats(varname: string, table?: ColumnTable): any {
	if(!table || !table.numRows() || !table.columnNames().includes(varname)) {
		return {count: 0};
	}

	const tsTable = table
		.select('date', varname).rename({ [varname]: 'var' })
		.filter(d => aq.op.is_nan(d!.var) == false)
		.filter(aq.escape((d: any) => d!.var !== undefined && d!.var !== null && d!.var !== ''))
		.reify();

	if(tsTable.numRows() === 0) {
		return {count: 0};
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

const emptyStringStats = {
	min: '',
	max: '',
	mean: '',
	median: '',
	stdDev: '',
};


// export function timeseriesToStats(variable: string, ts: Timeseries): VariableStats {
// 	const label = variablesMetadata.labels[variable] || variable;
// 	const numObservations = ts.length;
// 	const lastObservation = ts[numObservations - 1][1];
// 	const values = ts.map(p => p[1]);
// 	const min = Math.min(...values);
// 	const max = Math.max(...values);
// 	const mean = values.reduce((acc, v) => acc + v, 0) / numObservations;
// 	const sortedValues = values.sort((a, b) => a - b);
// 	const median = sortedValues[Math.floor(numObservations / 2)];
// 	const sum = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
// 	const stdDev = Math.sqrt(sum / numObservations);
// 	const dateFromLabel = fmtDate(ts[0][0]);
// 	const dateToLabel = fmtDate(ts[numObservations - 1][0]);

// 	return {
// 		variable,
// 		label,
// 		lastObservation,
// 		numObservations,
// 		min,
// 		max,
// 		mean,
// 		median,
// 		stdDev,
// 		dateFromLabel,
// 		dateToLabel,
// 	};

// }
// let _varsNumber = 0;
// let _recordsNumber = 0;

// for (const s of sites) {
// 	const records = datasets.get(s.id);
// 	_recordsNumber += records?.length || 0;

// 	const firstRecord = records?.[0] || {};
// 	_varsNumber = Math.max(_varsNumber, Object.keys(firstRecord).length);

// 	const lastRecord = records?.[records.length - 1] || {};

// 	const firstDate = firstRecord.date;
// 	const lastDate = firstRecord.date;

// 	if(firstDate) {
// 		if(!firstObs) firstObs = firstDate;

// 		if(firstDate < firstObs!) {
// 			firstObs = firstDate;
// 		}
// 	}

// 	if(lastDate) {
// 		if(!lastObs) lastObs = lastDate;

// 		if(lastDate > lastObs!) {
// 			lastObs = lastDate;
// 		}
// 	}
// }

// varsNumber = _varsNumber > 0 ? _varsNumber - 1 : 0; // remove 'date' column
// recordsNumber = _recordsNumber;