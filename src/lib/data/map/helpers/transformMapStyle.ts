import * as ml from 'maplibre-gl';
import { partition } from '$src/lib/utils/arrays';

// copy over riverapp- sources and layers from previous style
// make sure that label elements are on top of sjrbc elements
export const transformStyle = (previousStyle: ml.StyleSpecification | any, nextStyle: ml.StyleSpecification) => {
	// console.log( 'STYLE TRANSFORM', previousStyle, nextStyle);
	const keepSources: any = {};

	for(const source in previousStyle.sources) {
		if(source.match(/^riverapp-/)) {
			keepSources[source] = previousStyle.sources[source];
		}
	}

	// TODO: caching works but doesnt offer much speedup
	// replaceUrlsWithCached(nextStyle);

	const [labelLayers, nonLabelLayers] = partition(nextStyle.layers, (l: any) =>
			l.id.match(/label/) || l.id.match(/place/i) || l.id.match(/city/i));

	const keepLayers = previousStyle.layers?.filter((l: any) => l.id.match(/^riverapp-/)) || [];

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

function replaceUrlsWithCached(nextStyle: ml.StyleSpecification) {
	for (const source in nextStyle.sources) {
		if (nextStyle.sources[source].type !== 'vector') continue;
		const vectorSource = nextStyle.sources[source] as ml.VectorSourceSpecification;
		const url = vectorSource.url;
		if (!url) continue;
		(nextStyle.sources[source] as ml.VectorSourceSpecification).url = url.replace('https://', 'cached://');

		const tileUrls = vectorSource.tiles;
		if (tileUrls) {
			(nextStyle.sources[source] as ml.VectorSourceSpecification).tiles = tileUrls.map((url: string) => url.replace('https://', 'cached://'));
		}
	}

	if (nextStyle.sprite) nextStyle.sprite = (nextStyle.sprite as string).replace('https://', 'cached://');
}

