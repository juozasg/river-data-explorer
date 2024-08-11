import type ColumnTable from "arquero/dist/types/table/column-table";
import { niceTickNumber } from "./utils";

export function genYTicks(domainMin: number, domainMax: number, ts: number[]): number[] {
	const min = domainMin || ts[0];
	const max = domainMax || ts[ts.length - 1];
	const range = max - min;
	const q = range / 4;
	// console.log('yTicks', ts, 'min', min, 'max', max);
	const ticks = [min, min + q, min + 2 * q, min + 3 * q, max];
	const numTicks = ts.length;
	// return [0, 1, 2]
	return ticks.map((n) => niceTickNumber(n, range, n == max || n == min));
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