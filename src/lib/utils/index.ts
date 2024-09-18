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

export function bm(label: string, fn: () => any) {
	const start = new Date().valueOf();
	const r = fn();
	const end = new Date().valueOf();
	console.log(label, end - start);

	return r;
}