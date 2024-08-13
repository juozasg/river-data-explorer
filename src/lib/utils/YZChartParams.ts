import type ColumnTable from "arquero/dist/types/table/column-table";
import { isNumber } from ".";
import { variableMetadata } from "$src/appstate/variableMetadata";
import { simpleStats, type SimpleStats } from "../data/stats";
import { roundTickValue } from "./chart";



export class YZChartParams {
	axis: string;
	varname?: string;
	table?: ColumnTable;

	// calculated in constructor
	stats: SimpleStats;
	unit?: string;
	varLabel: string;
	radius: number = 4;
	domain: [number, number];


	constructor(
		axis: "y" | "z", // "y" or "z"
		varname?: string,
		table?: ColumnTable
	) {

		this.axis = axis;
		this.varname = varname;
		this.table = table;

		if (varname && table) {
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
		} else {
			this.domain = [0, 100];
			this.stats = {count: 0}
			this.varLabel = '';

		}
	}
}
