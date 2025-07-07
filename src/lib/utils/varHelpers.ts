import { variablesMetadata, type VariablesMetadata } from "$src/appstate/variablesMetadata.svelte";
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

export function varLabel(varname: string, units = false) {
	const unit = varunits(varname);
	const label = variablesMetadata[varname]?.label || varname;
	if (!units) return label;

	return unit ? `${label} (${unit})` : label;
}

export function varLabelAbbrev(varname: string) {
	const label = varLabel(varname).replace(/-/g, '');
	const words = label.split(/\s+/)
	const wordLetters = Math.max(2, 6 - words.length);
	const result = words.map((w: string) => w.slice(0, wordLetters)).join('');

	if(result === 'Tempe') return 'Temp';
	return result;
}

export function varMin(varname: string) {
	return variablesMetadata[varname]?.scale?.min ?? variablesMetadata['default']?.scale?.min ?? 0;
}

export function varMax(varname: string) {
	if (varCategoryKeys(varname)) {
		return varCategoryKeys(varname)!.length - 1;
	}
	return variablesMetadata[varname]?.scale?.max ?? variablesMetadata['default']?.scale?.max ?? 10;
}

export function varRange(varname: string) {
	return varMax(varname) - varMin(varname);
}

/* return sorted list of category keys, ex: ['Poor', 'Low_Fair',..,'Exceptional']  */
export function varCategoryKeys(varname: string) {
	return !!variablesMetadata[varname]?.categories && Object.keys(variablesMetadata[varname]?.categories).length > 0 ? Object.keys(variablesMetadata[varname]?.categories) : undefined;
}

export function varCatIndexLabel(varname: string, catIndex: number) {
	const catkey = varCategoryKeys(varname)?.[catIndex];
	if (!catkey) return '';
	return variablesMetadata[varname]?.categories?.[catkey]?.label || catkey
}

export function varCatIndexLegend(varname: string, catIndex: number) {
	const catkey = varCategoryKeys(varname)?.[catIndex];
	if (!catkey) return '';
	// console.log('catkey', catkey, variablesMetadata[varname]?.categories?.[catkey], variablesMetadata[varname]?.categories?.[catkey]?.legend)
	return variablesMetadata[varname]?.categories?.[catkey]?.legend || catkey
}


export function varStdMin(varname: string): number | undefined {
	if(varname == 'invertNarrative') return 3;
	return variablesMetadata[varname]?.standards?.min;
}

export function varStdMax(varname: string): number | undefined {
	return variablesMetadata[varname]?.standards?.max;
}

export function catvarOutsideStandards(varname: string, value: string | number): boolean {
	const cats = varCategoryKeys(varname);
	if (!cats) return false;
	const catIndex = typeof value == 'number' ? value : cats.indexOf(value);
	if(catIndex  == -1) return false;

	const frac = catIndex / cats.length;
	return frac < 0.3;
}

export function varoutsidestandard(varname: string, value?: number | string) {
	if (value === undefined || value === null) return false;
	if(typeof value === 'string') return catvarOutsideStandards(varname, value);

	const min = varStdMin(varname);
	const max = varStdMax(varname);

	// console.log('varoutsidestandard', varname, value, min, max);

	if(min !== undefined && value < min) return true;
	if(max !== undefined && value > max) return true;

	return false;
}


// export function splitRealtimeVariablesMetadata(md: VariablesMetadata): { rt: VariablesMetadata, nonrt: VariablesMetadata } {
// 	const rt: VariablesMetadata = {};
// 	const nonrt: VariablesMetadata = {};

// 	for (const [varname, metadata] of Object.entries(md)) {
// 		// console.log('splitRealtimeVariablesMetadata', varname, metadata);

// 		if (metadata.realtime) {
// 			rt[varname] = metadata;
// 		} else {
// 			nonrt[varname] = metadata;
// 		}
// 	}

// 	return { rt, nonrt };
// }