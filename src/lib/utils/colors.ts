import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
import * as d3sc from 'd3-scale-chromatic';


export function interpolateVarColor(varname: string, value: number) {
	// console.log('defaultInterpolatorId', defaultInterpolatorId());
	// let interpolatorId = defaultInterpolatorId();
	const md = variablesMetadata[varname];
	const reverse = !!md?.scale?.d3?.reverse;
	const metadataInterpolatorId = reverse ? md?.scale?.d3?.reverse : md?.scale?.d3;
	const interpolatorId = metadataInterpolatorId ||  variablesMetadata['default']?.scale?.d3 || 'interpolatePlasma';

	const min = md?.scale?.min || variablesMetadata['default']?.scale?.min || 0;
	const max = md?.scale?.max || variablesMetadata['default']?.scale?.max || 10;

	let valueFraction = (value - min) / (max - min);
	if (reverse) {
		valueFraction = 1 - valueFraction;
	}

	const d = d3sc as any;
	const interpolator = d[interpolatorId] || d.interpolatePlasma;
	return interpolator(valueFraction);
}

export function gradientColor(varname: string, value: number) {
	const min = 0;
	const max = 40;
	const percent = value / max;
	const hue = 180 * percent;
	return `hsl(${hue}deg, 100%, 50%)`;
}
