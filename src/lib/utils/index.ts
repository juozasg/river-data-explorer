export const basename = (path: string, ext?: string): string => {
	const f = path.split('/').pop() as string;
	return ext ? f.slice(0, -ext.length) : f;
}

export function clamp(num: number, min: number, max: number) {
	return num < min ? min : num > max ? max : num;
}

export function isNumber(n: any) {
	if (n === undefined || n === null) return false;
	return typeof n === 'number' && !isNaN(n);
}

let n = new Date().valueOf();
export function seqid() {
	return (++n).toString(36);
}

// benchmark
export function bm(label: string, fn: () => any) {
	const start = new Date().valueOf();
	const r = fn();
	const end = new Date().valueOf();
	console.log(label, end - start);

	return r;
}

export function median(numbers: number[]) {
	const sorted = Array.from(numbers).sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);

	if (sorted.length % 2 === 0) {
			return (sorted[middle - 1] + sorted[middle]) / 2;
	}

	return sorted[middle];
}

export function mean(numbers: number[]) {
	return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}


export function defineGlobal(name: string, value: any) {
	console.log('[debug]', name, '=', value);
	if (typeof window === 'undefined') return;

	const w = window as any;
	w[name] = value;
}