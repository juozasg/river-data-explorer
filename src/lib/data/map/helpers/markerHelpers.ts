import { sitesTables } from "$src/appstate/data/datasets.svelte";
import type { Site } from "$src/lib/types/site";

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
		const table = sitesTables.get(site.id);
		if (!table) return ghost;


		const value = table.get(varname, 0);
		if (value === undefined) return ghost;

		return gradientColor(varname, value);
	} catch (e) {
		console.error('siteVariableColor', e);
		return ghost;
	}
}