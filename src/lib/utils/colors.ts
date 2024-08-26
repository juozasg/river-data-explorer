import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
import * as d3sc from 'd3-scale-chromatic';
import { ghost } from '../data/map/helpers/markerHelpers';


export function interpolateVarColor(varname: string, value: number | string, valueFraction?: number): string {
	if (typeof value === 'string') {
		return interpolateCategoricalVarColor(varname, value);
	}


	// console.log('interpolateVarColor', varname, value, valueFraction);
	// console.log('defaultInterpolatorId', defaultInterpolatorId());
	// let interpolatorId = defaultInterpolatorId();
	const md = variablesMetadata[varname];
	const reverse = !!md?.scale?.d3?.reverse;

	const min = md?.scale?.min || variablesMetadata['default']?.scale?.min || 0;
	const max = md?.scale?.max || variablesMetadata['default']?.scale?.max || 10;

	valueFraction = valueFraction == undefined ?  (value - min) / (max - min) : valueFraction;
	if (reverse) {
		valueFraction = 1 - valueFraction;
	}

	const metadataInterpolatorId = reverse ? md?.scale?.d3?.reverse : md?.scale?.d3;
	const interpolatorId = metadataInterpolatorId || variablesMetadata['default']?.scale?.d3 || 'interpolatePlasma';
	const d = d3sc as any;
	const interpolator = d[interpolatorId] || d.interpolatePlasma;
	return interpolator(valueFraction);
}


export function interpolateCategoricalVarColor(varname: string, value: string): string {
	const md = variablesMetadata[varname];
	if(!md?.categories || typeof md.categories !== 'object') {
		return ghost;
	}

	const cats = Object.keys(md.categories);
	const catIndex = cats.indexOf(value);
	if(catIndex  == -1) return ghost;

	// const n = md.categories.length;
	const frac = catIndex /  cats.length;

	return interpolateVarColor(varname, 0, frac);
}

export function gradientColor(varname: string, value: number | string): string {
	console.log('gradientColor', varname, value);
	if (typeof value === 'string') {
		return interpolateCategoricalVarColor(varname, value);
	}
	const min = 0;
	const max = 40;
	const percent = value / max;
	const hue = 180 * percent;
	return `hsl(${hue}deg, 100%, 50%)`;
}
