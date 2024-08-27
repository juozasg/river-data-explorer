import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";
import sprintfpkg from 'sprintf';
const { sprintf } = sprintfpkg;


export const fmtVarNum = (varname: string, n: number | undefined | string, units = false) => {
	if (n === undefined) return '';
	if (typeof n !== 'number') return n;
	const fmt = variablesMetadata[varname]?.format || variablesMetadata['default']?.format || '%.2f';
	const unit = (units && varunits(varname)) || '';
	return sprintf(fmt, n) + ' ' + unit;
};


export function varunits(varname: string, parens = false) {
	const unit = variablesMetadata[varname]?.units;
	if (!unit) return '';
	return parens ? `(${unit})` : unit;
}

export function varlabel(varname: string, units = true) {
	const unit = varunits(varname);
	const label = variablesMetadata[varname]?.label || varname;
	if (!units) return label;

	return unit ? `${label} (${unit})` : label;
}

export function varmin(varname: string) {
	return variablesMetadata[varname]?.scale?.min ?? variablesMetadata['default']?.scale?.min ?? 0;
}

export function varmax(varname: string) {
	// console.log(varname, variablesMetadata[varname], variablesMetadata[varname]?.max )
	return variablesMetadata[varname]?.scale?.max ?? variablesMetadata['default']?.scale?.max ?? 10;
}
