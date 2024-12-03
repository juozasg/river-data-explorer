
export function partition(array: any[], filter: (e: any, i: number, arr: any[]) => any) {
	const pass: any[] = [];
	const fail: any[] = [];
	array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
	return [pass, fail];
}
// returns array with elements removed


export function aremove(arr: any[] | undefined, ...elements: any[]): any[] {
	if (!arr || arr.length == 0) return [];

	for (const e of elements) {
		const i = arr.indexOf(e);
		if (i !== -1) arr.splice(i, 1);
	}

	return arr;
}

export function binaryClosestTo(target: Date, dates: Date[]): Date | undefined {
	if (!dates.length) return undefined;
	if (dates.length === 1) return dates[0];

	const dateVals = dates.map(d => d.valueOf());
	return new Date(binaryClosestSearch(dateVals, target.valueOf()));
}

export function binaryClosestSearch(arr: number[], target: number, lo = 0, hi = arr.length - 1): number {
	if (target < arr[lo]) { return arr[lo]; }
	if (target > arr[hi]) { return arr[hi]; }

	const mid = Math.floor((hi + lo) / 2);

	return hi - lo < 2
		? (target - arr[lo]) < (arr[hi] - target) ? arr[lo] : arr[hi]
		: target < arr[mid]
			? binaryClosestSearch(arr, target, lo, mid)
			: target > arr[mid]
				? binaryClosestSearch(arr, target, mid, hi)
				: arr[mid];
}

if (typeof window !== 'undefined') {
	(window as any).binaryClosestSearch = binaryClosestSearch;
}
