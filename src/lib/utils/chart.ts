import type ColumnTable from "arquero/dist/types/table/column-table";
import { fmtDateDMonY } from ".";
import { chartYColor, chartZDarker } from "./colors";
import { varlabel, varunits } from './varHelpers';


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
	return fmtDateDMonY(date);
}

export function formatChartTTKey(key: string, yVarname: string, zVarname: string): string {
	const keycolor = key == yVarname ? chartYColor : key == zVarname ? chartZDarker : '#444';
	const label = varlabel(key, false);

	return `<span style="font-weight: 600; color: ${keycolor}">${label}</bold>`;
}

export function formatChatTTValue(key: string, value: any): string {
	const unit = varunits(key);
	return `${value} ${unit}`;
}


