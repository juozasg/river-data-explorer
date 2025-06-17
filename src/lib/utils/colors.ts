import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
import * as d3sc from 'd3-scale-chromatic';
import { varmax, varmin } from './varHelpers';
import { layerParams } from '$src/appstate/ui/layers.svelte';

export const ghost = 'rgba(0, 0, 0, 0.2)';
export const chartYColor = '#A228B1';
export const chartZColor = '#3d9cbe';
export const chartZDarker = '#368eae';

export const mapHoverHighlightColor = '#97E817';

export const data1Color = '#CC79A7';
export const data2Color = '#E69F00';




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

// export function rgbtohex(rgbexp: string): string {
// 	console.log('rgbtohex', rgbexp);

// 	const rgb = rgbexp.match(/[\d\.]+/g);
// 	if (!rgb || rgb.length < 3) {
// 		console.error('Invalid RGB expression:', rgbexp);
// 		return '#000000'; // Return black if invalid
// 	}
// 	const hex = rgb.map((c) => {
// 		const hexComponent = parseInt(c).toString(16);
// 		return hexComponent.length === 1 ? '0' + hexComponent : hexComponent;
// 	}).join('');
// 	return `#${hex}`;
// }

// function rgba2hex(orig: string) {
//     var a, isPercent,
//     rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
//     alpha = (rgb && rgb[4] || "").trim(),
//     hex = rgb ?
//     (rgb[1] | 1 << 8).toString(16).slice(1) +
//     (rgb[2] | 1 << 8).toString(16).slice(1) +
//     (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

//     if (alpha !== "") { a = alpha; }
//     else { a = 01; }
//     hex = hex + a;

//     return hex;
// }



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
export function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
