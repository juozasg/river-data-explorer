import { sitesTables } from "$src/appstate/data/datasets.svelte";
import type { Site } from "$src/lib/types/site";
import { tableGetBeforeDate } from "../../tableHelpers";

const ghost = 'rgba(0, 0, 0, 0.2)';

export function gradientColor(varname: string, value: number) {
	const min = 0;
	const max = 40;
	const percent = value / max;
	const hue = 180 * percent;
	return `hsl(${hue}deg, 100%, 50%)`;
}

export function siteVariableColor(site: Site, varname: string, beforeDate?: Date) {
	try {
		// return ghost;
		const table = sitesTables.get(site.id);
		if (!table) return ghost;


		const value = tableGetBeforeDate(table, varname, beforeDate);
		if (value === undefined) return ghost;

		const c = gradientColor(varname, value);
		// console.log('NEW VALUE', value, c);
		return c;
	} catch (e) {
		console.error('siteVariableColor', e);
		return ghost;
	}
}