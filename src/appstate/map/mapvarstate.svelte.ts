import { nowRoundedToNearest15Minutes } from "$src/lib/utils/date";
import exp from "constants";

export type MapVarState = {
	varname: string;
	vardate: Date;
};

export const varstate = $state<MapVarState>({
	varname: 'invertNarrative',
	vardate: nowRoundedToNearest15Minutes()
})

let hackyGlobalVardateSyncFunc: (date: Date) => void;
export const setHackyGlobalVardateSyncFunc = (func: typeof hackyGlobalVardateSyncFunc) => {
	hackyGlobalVardateSyncFunc = func;
};

export const triggerHackyGlobalVardateSync = (date: Date) => {
	hackyGlobalVardateSyncFunc?.(date);
};