// variableStats error TypeError: date.getUTCDate is not a function
//     at fmtDateDMonY (date.ts:47:17)
//     at variableStats (stats.ts:136:25)
//     at stats.ts:72:28
//     at Array.map (<anonymous>)
//     at allVariableStats (stats.ts:72:19)
//     at RegionStatsPanel.svelte:39:10
//     at update_reaction (chunk-4SPJZ4HE.js?v=0bc54715:1886:23)
//     at execute_derived (chunk-4SPJZ4HE.js?v=0bc54715:1205:15)
//     at update_derived (chunk-4SPJZ4HE.js?v=0bc54715:1213:15)
//     at Module.get (chunk-4SPJZ4HE.js?v=0bc54715:2259:7) sjrbc-23, sjrbc-24, sjrbc-25, sjrbc-26, sjrbc-27, sjrbc-28, sjrbc-29, sjrbc-30, sjrbc-31, sjrbc-32, sjrbc-33, sjrbc-34

import * as aq from "arquero";
import { variableStats } from "$src/lib/data/stats";
import { describe, it, expect } from "vitest";

const emptyStats = {
	dateFromLabel: "N/A",
	dateToLabel: "N/A",
	label: "ph",
	lastObservation: "",
	max: "",
	mean: "",
	median: "",
	min: "",
	numObservations: 0,
	stdDev: "",
	variable: "ph"
};

describe("variable stats", () => {
	it("return zeros for empty tables", () => {
		// let table = aq.from([]).orderby('date').reify();

		// empty
		let table = aq.from([]).reify();
		let stats = variableStats("ph", table, { errorLabel: "test" });
		expect(stats).toEqual(emptyStats);

		// no date
		table = aq.from([{ ph: 2.3 }]).reify();
		stats = variableStats("ph", table, { errorLabel: "test" });
		expect(stats).toEqual(emptyStats);

		// no key
		table = aq.from([{ ecoli: 2.3, date: 1464714000000 }]).reify();
		stats = variableStats("ph", table, { errorLabel: "test" });
		expect(stats).toEqual(emptyStats);
	});

	it("calculates correct stats and date labels", () => {
		let table = aq
			.from([
				{ ph: 2, date: new Date("2001-01-01T17:00:00Z") },
				{ ph: 3, date: new Date("2010-06-01T17:00:00Z") },
				{ ph: 5.5, date: new Date("2020-12-31T17:00:00Z") }
			])
			.reify();

		let stats = variableStats("ph", table, { errorLabel: "test" });
		expect(stats).toEqual({
			dateFromLabel: "1 Jan 2001",
			dateToLabel: "31 Dec 2020",
			label: "ph",
			lastObservation: 5.5,
			max: 5.5,
			mean: 3.5,
			median: 3,
			min: 2,
			numObservations: 3,
			stdDev: 1.8027756377319946,
			varname: "ph"
		});
	});

});
