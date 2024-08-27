import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";
import sprintfpkg from 'sprintf';
const { sprintf } = sprintfpkg;


export const fmtVarNum = (varname: string, n: number | undefined | string, units = false) => {
	if (n === undefined) return '';
	if (typeof n !== 'number') return n;
	const fmt = variablesMetadata[varname]?.format || variablesMetadata['default']?.format || '%.2f';
	const unit = (units && varunits(varname)) || '';
	return units ? sprintf(fmt, n) + ' ' + unit : sprintf(fmt, n);
};


export function varunits(varname: string, parens = false) {
	const unit = variablesMetadata[varname]?.units;
	if (!unit) return '';
	return parens ? `(${unit})` : unit;
}

export function varlabel(varname: string, units = false) {
	const unit = varunits(varname);
	const label = variablesMetadata[varname]?.label || varname;
	if (!units) return label;

	return unit ? `${label} (${unit})` : label;
}

export function varmin(varname: string) {
	return variablesMetadata[varname]?.scale?.min ?? variablesMetadata['default']?.scale?.min ?? 0;
}

export function varmax(varname: string) {
	if(varcategories(varname)) {
		return varcategories(varname)!.length - 1;
	}
	return variablesMetadata[varname]?.scale?.max ?? variablesMetadata['default']?.scale?.max ?? 10;
}

export function varrange(varname: string) {
	return varmax(varname) - varmin(varname);
}


export function varcategories(varname: string) {
	return !!variablesMetadata[varname]?.categories && Object.keys(variablesMetadata[varname]?.categories).length > 0 ? Object.keys(variablesMetadata[varname]?.categories) : undefined;
}

export function varcatilabel(varname: string, catIndex: number) {
	const catkey = varcategories(varname)?.[catIndex];
	if (!catkey) return '';
	return variablesMetadata[varname]?.categories?.[catkey]?.label || catkey
}

export function varcatilegend(varname: string, catIndex: number) {
	const catkey = varcategories(varname)?.[catIndex];
	if (!catkey) return '';
	console.log('catkey', catkey, variablesMetadata[varname]?.categories?.[catkey], variablesMetadata[varname]?.categories?.[catkey]?.legend)
	return variablesMetadata[varname]?.categories?.[catkey]?.legend || catkey
}