import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
import * as d3sc from 'd3-scale-chromatic';
import { varmax, varmin } from './varHelpers';

export const ghost = 'rgba(0, 0, 0, 0.2)';
export const chartYColor = '#ab00d6';
export const chartZColor = '#00d6ab';
export const chartZDarker = '#00af8c';



export function interpolateVarColor(varname: string, value?: number | string, valueFraction?: number): string {
	if (typeof value === 'string') {
		return interpolateCategoricalVarColor(varname, value);
	}

	const md = variablesMetadata[varname];
	const reverse = !!md?.scale?.d3?.reverse;

	const min = varmin(varname);
	const max = varmax(varname);

	if(value == undefined && valueFraction == undefined) {
		return ghost;
	}

	valueFraction = valueFraction == undefined ?  (value! - min) / (max - min) : valueFraction;
	if (reverse) {
		valueFraction = 1 - valueFraction;
	}

	return varInterpolator(varname)(valueFraction);
}


export function interpolateCategoricalVarColor(varname: string, value: string): string {
	const md = variablesMetadata[varname];
	if(!md?.categories || typeof md.categories !== 'object') {
		return ghost;
	}

	const cats = Object.keys(md.categories);
	const catIndex = cats.indexOf(value);
	if(catIndex  == -1) return ghost;

	const frac = catIndex /  cats.length;

	return interpolateVarColor(varname, undefined, frac);
}


export function interpolateVarDataURL(document: Document, varname: string): string {
	const md = variablesMetadata[varname];
	const reverse = !!md?.scale?.d3?.reverse;
	const interpolator = varInterpolator(varname);
	const n = 256;


	const canvas = document.createElement("canvas");
  canvas.width = n;
  canvas.height = 1;
  const context = canvas.getContext("2d");
	if (!context) {
		console.error('Could not get canvas context', document, varname);
		return '';
	}
  for (let i = 0; i < n; ++i) {
		const t = reverse ? 1 - i / (n - 1) : i / (n - 1);
    context.fillStyle = interpolator(t);
    context.fillRect(i, 0, 1, 1);
  }

  return canvas.toDataURL();
}



export function varInterpolator(varname: string): (t: number) => string {
	const md = variablesMetadata[varname];
	const reverse = !!md?.scale?.d3?.reverse;


	const metadataInterpolatorId = reverse ? md?.scale?.d3?.reverse : md?.scale?.d3;
	const interpolatorId = metadataInterpolatorId || variablesMetadata['default']?.scale?.d3 || 'interpolatePlasma';
	const d = d3sc as any;
	const interpolator = d[interpolatorId] || d.interpolatePlasma;

	return interpolator;
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
