import * as yaml from 'js-yaml';

export const prerender = true;
export const trailingSlash = 'always';
// export const ssr = false;

export type VariableName = string;

export const load = async ({ fetch }) => {

	let response = await fetch(`/api/variables`);
	const variablePages = await response.json();

	response = await fetch(`/api/regions`);
	const regionPages = await response.json();

	const { dataManifest, variableMetadata } = await loadManifests(fetch);


	// console.log('DATA MANIFEST', dataManifest)
	// console.log('VARIABLES.YAML', variableMetadata)

	return {
		variablePages,
		regionPages,
		dataManifest,
		variableMetadata
	};
};

const loadManifests = async (fetch: (arg0: string) => Promise<any>) => {
	const [r1, r2] = await Promise.all([fetch('/data/data-manifest.json'), fetch('/data/variables.yaml')]);

	const dataManifest = await r1.json();
	const variableMetadata = yaml.load(await r2.text());
	return { dataManifest, variableMetadata };
}