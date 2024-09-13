import type ColumnTable from "arquero/dist/types/table/column-table";
import { isNumber } from ".";
import { varunits } from './varHelpers';
import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";
import { simpleStats, type SimpleStats } from "../data/stats";
import { roundTickValue } from "./chart";

export function varChartDomain(axis: "y" | "z", varname?: string, yzTable?: ColumnTable): [number, number] {
	if (!varname || !yzTable) return [0, 100];
	const stats = simpleStats(axis, yzTable);

	const metadataMin: number = variablesMetadata[varname]?.scale?.min ?? 0;
	const metadataMax: number = variablesMetadata[varname]?.scale?.max ?? 100;

	const domainMin = isNumber(stats.min) ? Math.min(metadataMin, stats.min!) : metadataMin;
	const domainMax = stats.count < 2 ? metadataMax : roundTickValue(stats.max! + (stats.range! * 0.25), stats.range! * 10);


	return [domainMin, domainMax];
}


export class YZChartParams {
	axis: string;
	varname?: string;
	yzTable?: ColumnTable;
	locationName: string;

	// calculated in constructor
	stats: SimpleStats;
	units?: string;
	varLabel: string;
	radius: number = 4;
	domain?: [number, number];


	constructor(
		axis: "y" | "z",
		varname?: string,
		yzTable?: ColumnTable,
		locationName?: string,
		domain?: [number, number]
	) {
		this.axis = axis;
		this.varname = varname;
		this.yzTable = yzTable;
		this.locationName = locationName || '';

		if (varname && yzTable) {
			this.units = varunits(varname);
			const unitParens = this.units != '' ? ` (${this.units})` : '';
			this.varLabel = (variablesMetadata[varname]?.label || varname) + unitParens;


			this.stats = simpleStats(axis, yzTable);
			this.radius = this.stats.count > 2 ? 4 : 7;

			// const metadataMin: number = variablesMetadata[varname]?.scale?.min ?? 0;
			// const metadataMax: number = variablesMetadata[varname]?.scale?.max ?? 100;

			// const domainMin = isNumber(this.stats.min) ? Math.min(metadataMin, this.stats.min!) : metadataMin;
			// const domainMax = this.stats.count < 2 ? metadataMax : roundTickValue(this.stats.max! + (this.stats.range! * 0.25), this.stats.range! * 10);

			// this.domain = [domainMin, domainMax];
		} else {
			// this.domain = [0, 100];
			this.stats = {count: 0}
			this.varLabel = '';

		}

		if(domain) this.domain = domain;

	}
}
