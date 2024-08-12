import type ColumnTable from "arquero/dist/types/table/column-table";
import { fmtDate, isNumber } from ".";
import { variableMetadata } from "$src/appstate/variableMetadata";
import { simpleStats, type SimpleStats } from "../data/stats";
import { getContext } from "svelte";


// based on how big the range is, round the tick value to a reasonable number
// preserve means to keep more decimal places
export function roundTickValue(n: number, range: number, extraDecimals = false) {
	const scale = extraDecimals ? 100 : 10;
	const digits = Math.max(0, Math.ceil(-Math.log10(range / scale)));

	const rounded = parseFloat(n.toFixed(digits));
	return rounded;
}

export function genYTicks(domainMin: number, domainMax: number, ts: number[]): number[] {
	const min = domainMin || ts[0];
	const max = domainMax || ts[ts.length - 1];
	const range = max - min;
	const q = range / 4;
	// console.log('yTicks', ts, 'min', min, 'max', max);
	const ticks = [min, min + q, min + 2 * q, min + 3 * q, max];
	const numTicks = ts.length;
	// return [0, 1, 2]
	return ticks.map((n) => roundTickValue(n, range, n == max || n == min));
}

export function genXDateTicks(table: ColumnTable, suggestedTicks: number[]): number[] {
	// console.log('dateTicks', ts);
	if (suggestedTicks.length < 3) return suggestedTicks;
	const numRows = table!.numRows();

	const first = table.get('date', 0)?.valueOf() || suggestedTicks[0];
	const last =
		table.get('date', numRows - 1)?.valueOf() || suggestedTicks[suggestedTicks.length - 1];
	const range = last - first;
	const q = range / 4;
	return [first, first + q, first + 2 * q, first + 3 * q, last];
}

export function closestPointIndex(arr: number[], x: number, min = true) {
	// if(!min) {
	// 	x += 0.05;
	// }
	const foundPoint = arr.reduce((prev, curr) =>
				Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
	let index = arr.indexOf(foundPoint);
	if (min && foundPoint > x) {
		index -= 1;
	} else if(!min && foundPoint < x) {
		// index += 1;
	}

	if(index < 0) {
		index = 0;
	} else if(index >= arr.length) {
		index = arr.length - 1;
	}

	return index;
}

export function formatChartDate(d: number): any {
	const date = new Date(d);
	return fmtDate(date);
}

export function formatChartTTKey(key: string, yVarname: string, zVarname: string): string {
	const keycolor = key == yVarname ? chartYColor : key == zVarname ? chartZDarker : '#444';
	const label = variableMetadata[key]?.label || key;
	const unit = variableMetadata[key]?.unit || '';
	// console.log(key, label, keycolor)
	// const keycolor = '#444';
	return `<span style="font-weight: 600; color: ${keycolor}">${label}</bold>`;
}

export function formatChatTTValue(key: string, value: any): string {

	const unit = variableMetadata[key]?.unit || '';
	return `${value} ${unit}`;
}

export const chartYColor = '#ab00d6';
export const chartZColor = '#00d6ab';
export const chartZDarker = '#00af8c';


export class YZChartParams {
	varname: string;
	table: ColumnTable;
	axis: string;

	// calculated in constructor
	unit: string
	varLabel: string;
	stats: SimpleStats
	radius: number;
	domain: [number, number];


	constructor(
		axis: "y" | "z", // "y" or "z"
		varname: string,
		table: ColumnTable
	) {

		this.axis = axis;
		this.varname = varname;
		this.table = table;

		this.unit = variableMetadata[varname]?.unit || '';
		const unitParens = this.unit != '' ? ` (${this.unit})` : '';
		this.varLabel = (variableMetadata[varname]?.label || varname) + unitParens;


		this.stats = simpleStats(varname, table);
		this.radius = this.stats.count > 2 ? 4 : 7;

		const metadataMin: number = variableMetadata[varname]?.scale?.min ?? 0;
		const metadataMax: number = variableMetadata[varname]?.scale?.max ?? 100;


		const domainMin = isNumber(this.stats.min) ? Math.min(metadataMin, this.stats.min!) : metadataMin;
		const domainMax = this.stats.count < 2 ? metadataMax : roundTickValue(this.stats.max! + (this.stats.range! * 0.1), this.stats.range! * 10);

		this.domain = [domainMin, domainMax];
	}
}




