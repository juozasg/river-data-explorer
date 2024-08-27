import { sitesTables } from "$src/appstate/data/datasets.svelte";
import { ghost, interpolateVarColor } from "$src/lib/utils/colors";
import { tableGetBeforeDate } from "../../tableHelpers";


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