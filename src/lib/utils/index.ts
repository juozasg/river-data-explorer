import sprintfpkg from 'sprintf';
const { sprintf } = sprintfpkg;

import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
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


export const fmtVarNum = (varname: string, n: number | undefined | string, units = false) => {
	if (n === undefined) return '';
	if (typeof n !== 'number') return n;
	const fmt = variablesMetadata[varname]?.format || variablesMetadata['default']?.format || '%.2f';
	const unit = (units && variablesMetadata[varname]?.unit) || '';
	return sprintf(fmt, n) + ' ' + unit;
};


export function varunits(varname: string, parens = true) {
	const unit = variablesMetadata[varname]?.unit;
	if (!unit) return '';
	return parens ? `(${unit})` : unit;
}


const shortMon = (date: Date): string => date.toLocaleString('default', { month: 'short' });
export function fmtDate(date: Date | undefined): string {
	if (!date) return 'N/A';
	return `${shortMon(date)} ${date.getDate()}, ${date.getFullYear()}`;
}

// YYYY-MM-DD
export function fmtDateValue(date: Date) {
	if (!date || isNaN(date.valueOf())) return '';

	const offset = date.getTimezoneOffset();
	date = new Date(date.getTime() - (offset * 60 * 1000));
	return date.toISOString().split('T')[0];
};



export function oneMonthAgo() {
	const oneDay = 1000 * 60 * 60 * 24;
	const oneMonth = oneDay * 30;
	return (Date.now() - oneMonth);
}


export function dateEqualYMD(date1: Date, date2: Date): boolean {
	return date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate();
}


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