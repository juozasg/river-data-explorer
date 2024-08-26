import { sitesTables } from "$src/appstate/data/datasets.svelte";
import type { Site } from "$src/lib/types/site";
import { interpolateVarColor } from "$src/lib/utils/colors";
import { tableGetBeforeDate } from "../../tableHelpers";

export const ghost = 'rgba(0, 0, 0, 0.2)';

export function siteVariableColor(siteid: string, varname: string, beforeDate?: Date) {
	try {
		// return ghost;
		const table = sitesTables.get(siteid);
		if (!table) return ghost;

		const value = tableGetBeforeDate(table, varname, beforeDate);
		if (value === undefined) return ghost;

		return interpolateVarColor(varname, value as number);
	} catch (e) {
		console.error('siteVariableColor', e);
		return ghost;
	}
}