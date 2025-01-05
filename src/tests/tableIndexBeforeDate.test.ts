// tableIndexBeforeDate
// binaryClosestSearch

import * as aq from "arquero";
import { variableStats } from "$src/lib/data/stats";
import { tableIndexBeforeDate } from "$src/lib/data/siteTableHelpers";

describe("searches a table sorted by date", () => {
	const table = aq.table({
		date: [
			new Date("2021-01-01"),
			new Date("2021-02-01"),
			new Date("2021-03-01"),
			new Date("2021-04-01")],
		temp: [10, 20, 30, 40]
	});

	it("finds the most recent index before a date", () => {
		const dateToFind = new Date("2021-03-15");
		const index = tableIndexBeforeDate(table, dateToFind);
		expect(index).toBe(2);
	});

	it("finds the most recent index on date", () => {
		const dateToFind = new Date("2021-03-01");
		const index = tableIndexBeforeDate(table, dateToFind);
		expect(index).toBe(2);
	});

	it("finds the most recent index on earliest date", () => {
		const dateToFind = new Date("2021-01-01");
		const index = tableIndexBeforeDate(table, dateToFind);
		expect(index).toBe(0);
	});

	it("finds the most recent index on latest date", () => {
		const dateToFind = new Date("2021-04-01");
		const index = tableIndexBeforeDate(table, dateToFind);
		expect(index).toBe(3);
	});

	it("finds the most recent index after latest date", () => {
		const dateToFind = new Date("2021-04-02");
		const index = tableIndexBeforeDate(table, dateToFind);
		expect(index).toBe(3);
	});

	it("find nothing before earliest date", () => {
		const dateToFind = new Date("2020-01-01");
		const index = tableIndexBeforeDate(table, dateToFind);
		expect(index).toBe(-1);
	});

	it("find nothing in an empty table", () => {
		const emptyTable = aq.table({ date: [], temp: [] });
		const dateToFind = new Date("2021-03-15");
		const index = tableIndexBeforeDate(emptyTable, dateToFind);
		expect(index).toBe(-1);
	});

	it("works with a 1 row table", () => {
		const singleRowTable = aq.table({ date: [new Date("2021-01-01")], temp: [10] });
		const dateToFind = new Date("2021-01-01");
		const index = tableIndexBeforeDate(singleRowTable, dateToFind);
		expect(index).toBe(0);
	});

	it("works with a 2 row table", () => {
		const twoRowTable = aq.table({
			date: [new Date("2021-01-01"), new Date("2021-02-01")],
			temp: [10, 20]
		});
		const dateToFind = new Date("2021-01-15");
		const index = tableIndexBeforeDate(twoRowTable, dateToFind);
		expect(index).toBe(0);
	});

	it("works with the middle row of 3 row table", () => {
		const threeRowTable = aq.table({
			date: [new Date("2021-01-01"), new Date("2021-02-01"), new Date("2021-03-01")],
			temp: [10, 20, 30]
		});
		const dateToFind = new Date("2021-02-01");
		const index = tableIndexBeforeDate(threeRowTable, dateToFind);
		expect(index).toBe(1);
	});

	it("finds nothing with out of bounds fromIndex", () => {
		let dateToFind = new Date("2021-03-15");
		let index = tableIndexBeforeDate(table, dateToFind, 10);
		expect(index).toBe(-1);

		 index = tableIndexBeforeDate(table, dateToFind, -1);
		expect(index).toBe(-1);
	});

	it("finds nothing with out of bounds toIndex", () => {
		let dateToFind = new Date("2021-03-15");
		let index = tableIndexBeforeDate(table, dateToFind, 0, -1);
		expect(index).toBe(-1);
	});
});