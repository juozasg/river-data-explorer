// tableIndexBeforeDate
// binaryClosestSearch

import * as aq from "arquero";
import { variableStats } from "$src/lib/data/stats";
import { binaryClosestSearch } from "$src/lib/utils/arrays";

describe("finds value closest to target value in a sorted array", () => {
	const arr = [0, 1, 2, 3, 4];

	it("finds closest value in array", () => {
		expect(binaryClosestSearch(arr, 2)).toBe(2);
	});

	it("finds closest value when target is less than all elements", () => {
		expect(binaryClosestSearch(arr, -1)).toBe(0);
	});

	it("finds closest value when target is greater than all elements", () => {
		expect(binaryClosestSearch(arr, 5)).toBe(4);
	});

	it("finds closest value when target is between two elements", () => {
		expect(binaryClosestSearch(arr, 2.4)).toBe(2);
	});

	it("finds closest value when target is between two elements closer to ceiling", () => {
		expect(binaryClosestSearch(arr, 2.6)).toBe(3);
	});

	it("find closest value when target is exactly between two elements", () => {
		expect(binaryClosestSearch(arr, 2.5)).toBe(3);
	});


	it("finds closest value when target is center element", () => {
		expect(binaryClosestSearch(arr, 2)).toBe(2);
	});

	it("handles empty array", () => {
		expect(binaryClosestSearch([], 2)).toBeUndefined();
	});
});