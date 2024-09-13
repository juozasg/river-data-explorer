import type ColumnTable from "arquero/dist/types/table/column-table";
import { isNumber } from ".";
import { varunits } from './varHelpers';
import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";
import { simpleStats, type SimpleStats } from "../data/stats";
import { roundTickValue } from "./chart";



export class YZChartParams {
	axis: string;
	varname?: string;
	table?: ColumnTable;
	locationName: string;

	// calculated in constructor
	stats: SimpleStats;
	units?: string;
	varLabel: string;
	radius: number = 4;
	domain: [number, number];


	constructor(
		axis: "y" | "z", // "y" or "z"
		varname?: string,
		table?: ColumnTable,
		locationName?: string
	) {

		this.axis = axis;
		this.varname = varname;
		this.table = table;
		this.locationName = locationName || '';

		if (varname && table) {
			this.units = varunits(varname);
			const unitParens = this.units != '' ? ` (${this.units})` : '';
			this.varLabel = (variablesMetadata[varname]?.label || varname) + unitParens;


			this.stats = simpleStats(varname, table);
			this.radius = this.stats.count > 2 ? 4 : 7;

			const metadataMin: number = variablesMetadata[varname]?.scale?.min ?? 0;
			const metadataMax: number = variablesMetadata[varname]?.scale?.max ?? 100;

			const domainMin = isNumber(this.stats.min) ? Math.min(metadataMin, this.stats.min!) : metadataMin;
			const domainMax = this.stats.count < 2 ? metadataMax : roundTickValue(this.stats.max! + (this.stats.range! * 0.25), this.stats.range! * 10);

			this.domain = [domainMin, domainMax];
		} else {
			this.domain = [0, 100];
			this.stats = {count: 0}
			this.varLabel = '';

		}

		if (this.varname === 'do') {
			console.log(this)
		};
	}
}
