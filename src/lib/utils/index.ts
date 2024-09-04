import sprintfpkg from 'sprintf';
const { sprintf } = sprintfpkg;

import type { ImportGlobRecord, MarkdownPage, MarkdownComponent } from '../types/page';

export const getMarkdownPages = async (allMdPages: ImportGlobRecord): Promise<MarkdownPage[]> => {
	const allPages = await Promise.all(
		Object.entries(allMdPages).map(async ([modulePath, resolver]) => {
			const { metadata }: MarkdownComponent = await resolver();

			return {
				metadata,
				slug: basename(modulePath, '.md')
			};
		})
	);

	return allPages;
};


export function binarySearch(arr: number[], target: number, lo = 0, hi = arr.length - 1): number {
	if (target < arr[lo]) {return arr[0]}
	if (target > arr[hi]) {return arr[hi]}

	const mid = Math.floor((hi + lo) / 2);

	return hi - lo < 2
		? (target - arr[lo]) < (arr[hi] - target) ? arr[lo] : arr[hi]
		: target < arr[mid]
			? binarySearch(arr, target, lo, mid)
			: target > arr[mid]
				? binarySearch(arr, target, mid, hi)
				: arr[mid]
}

if (typeof window !== 'undefined') {
	(window as any).binarySearch = binarySearch;
}

export function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

export const basename = (path: string, ext?: string): string => {
	const f = path.split('/').pop() as string;
	return ext ? f.slice(0, -ext.length) : f;
}


export function partition(array: any[], filter: (e: any, i: number, arr: any[]) => any) {
	const pass: any[] = []
	const fail: any[] = [];
	array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
	return [pass, fail];
}


const shortMon = (date: Date): string => date.toLocaleString('default', { month: 'short' });
export function fmtMonDY(date: Date | undefined): string {
	if (!date) return 'N/A';
	return `${shortMon(date)} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
	// return `${date.getUTCFullYear()}-${shortMon(date)}-${date.getUTCDate()}`;
}

export function fmtDateDMonY(date: Date | undefined): string {
	if (!date) return 'N/A';
	return `${date.getUTCDate()} ${shortMon(date)} ${date.getUTCFullYear()}`;
}

// YYYY-MM-DD
export function fmtDateValue(date: Date) {
	if (!date || isNaN(date.valueOf())) return '';

	const offset = date.getTimezoneOffset();
	date = new Date(date.getTime() - (offset * 60 * 1000));
	return date.toISOString().split('T')[0];
};


export function fmtDateISO(date: Date) {
	return date.toISOString();
}

// always returns YYYY-MM-DDT00:00:00 (UTC)
export function UTCDayDate(date?: Date | string | number | undefined): Date {
	if (typeof date === 'string')  {
		date = date.includes('Z') ? new Date(date) : new Date(date + 'Z');
	};
	if (typeof date === 'number') date = new Date(date);
	if (!date || isNaN(date.valueOf())) date = new Date();
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

// month is 0-indexed
// days are 1-indexed, but day=0 means last day of previous month
export function daysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}


export function oneMonthAgo() {
	const oneDay = 1000 * 60 * 60 * 24;
	const oneMonth = oneDay * 30;
	return (Date.now() - oneMonth);
}


export function dateEqualYMD(date1: Date, date2: Date): boolean {
	return date1.getUTCFullYear() === date2.getUTCFullYear() &&
		date1.getUTCMonth() === date2.getUTCMonth() &&
		date1.getUTCDate() === date2.getUTCDate();
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

export function clamp(num: number, min: number, max: number) {
	return num < min ? min : num > max ? max : num;
}

export function findAncestor(el: HTMLElement | null, cls: any) {
	if (!el) return null;
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
}

export function isNumber(n: any) {
	return typeof n === 'number' && !isNaN(n);
}

let n = new Date().valueOf();
export function seqid() {
	return (++n).toString(36);

}