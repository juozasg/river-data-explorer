import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
import * as yaml from 'js-yaml';

export const prerender = true;
export const trailingSlash = 'always';
// export const ssr = false;

export type VariableName = string;

export const load = async ({ fetch }) => {
	// TODO: works but doesnt offer much speedup, risk of references going out of date meanwhile
	// addMaplibreCachedProtocol();
	let response = await fetch(`/api/variables`);
	const variablePages = await response.json();

	response = await fetch(`/api/regions`);
	const regionPages = await response.json();

	const { dataManifest, variablesMetadata: vmd } = await loadManifests(fetch);

	Object.assign(variablesMetadata, vmd)

	console.log('Data manifest', dataManifest);
	console.log('variablesMetadata', variablesMetadata);

	return {
		variablePages,
		regionPages,
		dataManifest
	};
};

const loadManifests = async (fetch: (arg0: string) => Promise<any>) => {
	const [r1, r2] = await Promise.all([fetch('/data/data-manifest.json'), fetch('/data/variables.yaml')]);

	const dataManifest = await r1.json();
	const variablesMetadata = yaml.load(await r2.text());
	return { dataManifest, variablesMetadata };
}


