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
