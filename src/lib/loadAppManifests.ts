import jsyaml from 'js-yaml';

export const loadManifests = async () => {
	let dataManifest: any;
	let variablesMetadata: any;

	const [r1, r2] = await Promise.all([fetch("/data/data-manifest.json"), fetch("/data/variables.yaml")]);

	dataManifest = await r1.json();
	variablesMetadata = jsyaml.load(await r2.text());

	console.log('LOADED MANIFESTS', dataManifest, variablesMetadata);
	return { dataManifest, variablesMetadata };

};
