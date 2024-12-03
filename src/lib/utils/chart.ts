import type ColumnTable from "arquero/dist/types/table/column-table";
import { fmtDateDMonY } from './date';
import { chartYColor, chartZDarker } from "./colors";
import { catvarOutsideStandards, varcategories, varlabel, varstdmax, varstdmin, varunits } from './varHelpers';
import type { YZChartParams } from "./YZChartParams";
import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";


// based on how big the range is, round the tick value to a reasonable number
// preserve means to keep more decimal places
export function roundTickValue(n: number, range: number, extraDecimals = false) {
	const scale = extraDecimals ? 100 : 10;
	const digits = Math.max(0, Math.ceil(-Math.log10(range / scale)));

	const rounded = parseFloat(n.toFixed(digits));
	return rounded;
}

export function genYTicks(domain: [number, number], ts: number[]): number[] {
	const min = domain[0] || ts[0];
	const max = domain[1] || ts[ts.length - 1];

	if (Number.isInteger(min) && Number.isInteger(max)) {
		const range = max - min;
		if (range < 9) {
			// return integers from min to max inclusive
			return Array.from({ length: range + 1 }, (_, i) => min + i);
		}
	}
	const range = max - min;
	const q = range / 4;
	// console.log('yTicks', ts, 'min', min, 'max', max);
	const ticks = [min, min + q, min + 2 * q, min + 3 * q, max];
	const numTicks = ts.length;
	// return [0, 1, 2]
	// console.log('generated ticks from ts', ts, 'to', ticks);
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
	} else if (!min && foundPoint < x) {
		// index += 1;
	}

	if (index < 0) {
		index = 0;
	} else if (index >= arr.length) {
		index = arr.length - 1;
	}

	return index;
}

export function formatChartDate(d: number): any {
	const date = new Date(d);
	// console.log('formatChartDate', date);
	return fmtDateDMonY(date);
}

export function formatChartTTKey(key: string, yParams: YZChartParams, zParams: YZChartParams): string {
	const keycolor = key == "y" ? chartYColor : key == "z" ? chartZDarker : '#444';
	// const label = varlabel(key, false);
	let label = key;
	if (key == 'y' && yParams.varname) {
		label = yParams.locationName + " " + varlabel(yParams.varname, false);
	} else if (key == 'z' && zParams.varname) {
		label = zParams.locationName + " " + varlabel(zParams.varname, false);
	}

	return `<span style="font-weight: 600; color: ${keycolor}">${label}</bold>`;
}

export function formatChatTTValueLabel(key: string, value: any, yParams: YZChartParams, zParams: YZChartParams): string {
	let unit = '';
	const params = key == 'y' ? yParams : zParams;
	if (varcategories(params.varname)) {
		const catId = varcategories(params.varname)![value];
		if (catId) {
			return variablesMetadata[params.varname]?.categories[catId]?.label || catId;
		}
	}
	if (key == 'y' || key == 'z') {
		unit = varunits(params.varname);
	}
	return `${value} ${unit}`;
}

export function formatChatTTValue(key: string, value: any, yParams: YZChartParams, zParams: YZChartParams): string {
	let label = formatChatTTValueLabel(key, value, yParams, zParams);

	const params = key == 'y' ? yParams : zParams;
	const standards = formatStandards(params.varname, value);

	// const standards = ` <span class='stdbad'> &nbsp; &gt; 100 CFU</span>`;
	return label + standards;
}

function formatStandards(varname: string, value: number): string {

	if (varcategories(varname)) {
		// console.log('formatStandards cat ', varname, value, catvarOutsideStandards(varname, value));
		if (catvarOutsideStandards(varname, value)) {
			return ` <span class='stdbad'> &nbsp; is below 'Acceptable' </span>`;
		}
		return '';
	}

	const stdmin = varstdmin(varname);
	const stdmax = varstdmax(varname);
	if (typeof stdmin == 'number' && value < stdmin) {
		return ` <span class='stdbad'> &nbsp; &lt; ${stdmin} ${varunits(varname)}</span>`;
	} else if (typeof stdmax == 'number' && stdmax && value > stdmax) {
		return ` <span class='stdbad'> &nbsp; &gt; ${stdmax} ${varunits(varname)}</span>`;
	}



	return '';
}


