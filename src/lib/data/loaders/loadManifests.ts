import { load as yamlLoad } from "js-yaml";

export const loadManifests = async () => {
	const [r1, r2] = await Promise.all([fetch("/data/data-manifest.json"), fetch("/data/variables.yaml")]);

	const dataManifest = await r1.json();
	const variablesMetadata = yamlLoad(await r2.text());
	return { dataManifest, variablesMetadata };
};