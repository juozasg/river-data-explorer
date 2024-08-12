import sprintfpkg from 'sprintf';
const {sprintf} = sprintfpkg;

import { variableMetadata } from '$src/appstate/variableMetadata';
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
	if(n === undefined) return '';
	if(typeof n !== 'number') return n;
	const fmt = variableMetadata[varname]?.format || variableMetadata['default']?.format || '%.2f';
	const unit = (units && variableMetadata[varname]?.unit) || '';
	return sprintf(fmt, n) + ' ' + unit;
};


export function varunits(varname: string, parens = true) {
	const unit = variableMetadata[varname]?.unit;
	if (!unit) return '';
	return parens ? `(${unit})` : unit;
}


const shortMon = (date: Date): string => date.toLocaleString('default', { month: 'short' });
export function fmtDate(date: Date | undefined): string {
	if (!date) return 'N/A';
	return `${shortMon(date)} ${date.getDate()}, ${date.getFullYear()}`;
}


export function oneMonthAgo() {
  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = oneDay * 30;
  return (Date.now() - oneMonth);
}

export function niceTickNumber(n: number, range: number, preserve = false) {
	const scale = preserve ? 100 : 10;
	const digits = Math.max(0, Math.ceil(-Math.log10(range / scale)));

	// const factor = Math.pow(10, digits);
	const rounded = parseFloat(n.toFixed(digits));
	// if(roundUp && rounded < n) {
	// 	return Math.ceil(n *factor / factor);
	// }
	// console.log('niceTickNumber', n, rounded, range, preserve, digits, n.toFixed(digits), 'log10', -Math.log10(range / scale))
	return rounded;
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