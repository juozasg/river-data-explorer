import { sitesTables } from "$src/appstate/data/datasets.svelte";
import { ghost, interpolateVarColor } from "$src/lib/utils/colors";
import { tableGetBeforeDate } from "../../tableHelpers";


export function siteBeforeVardateValue(siteid: string, varname: string, beforeDate?: Date): number | string| undefined {
	try {
		// return ghost;
		const table = sitesTables.get(siteid);
		if (!table) return ;

		const value = tableGetBeforeDate(table, varname, beforeDate);
		if (typeof value === 'number' || typeof value == 'string') return value;
	} catch (e) {
		console.error('siteBeforeVardateValue', e);
		return ;
	}
}