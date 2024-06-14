import * as ml from 'maplibre-gl';
import { partition } from '$lib/utils';

// copy over sjrbc- sources and layers from previous style
// make sure that label elements are on top of sjrbc elements
export const transformStyle = (previousStyle: ml.StyleSpecification | any, nextStyle: ml.StyleSpecification) => {
	// console.log(previousStyle, nextStyle, 'STYLE TRANSFORM');
	const keepSources: any = {};

	for(const source in previousStyle.sources) {
		if (source.match(/^sjrbc-/)) {
			keepSources[source] = previousStyle.sources[source];
		}
	}

	const [labelLayers, nonLabelLayers] = partition(nextStyle.layers, (l: any) =>
			l.id.match(/label/) || l.id.match(/place/i) || l.id.match(/city/i));

	const keepLayers = previousStyle.layers?.filter((l: any) => l.id.match(/^sjrbc-/)) || [];

	// console.log('layer splitting', keepLayers, nonLabelLayers, labelLayers)

	const updatedSpec = {
		...nextStyle,
		sources: {
			...nextStyle.sources,
			...keepSources,
		},
		layers: [
			...nonLabelLayers,
			...keepLayers,
			...labelLayers
		]
	};
	return updatedSpec;
}
