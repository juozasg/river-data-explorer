import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'

import { load as yamlLoad } from "js-yaml";

export const loadManifests = async () => {
	let dataManifest: any;
	let variablesMetadata: any;
	try {
		const [r1, r2] = await Promise.all([fetch("/data/data-manifest.json"), fetch("/data/variables.yaml")]);

		dataManifest = await r1.json();
		variablesMetadata = yamlLoad(await r2.text());
	} catch (e) {
		console.error(e);
	} finally {
		return { dataManifest, variablesMetadata };
	}
};

const { dataManifest, variablesMetadata } = await loadManifests();

const appElement = document.getElementById('app')!;

console.log('MANIFESTS', dataManifest, variablesMetadata);
if (!dataManifest || !variablesMetadata) {
	console.error('Failed to load data manifests');
	appElement.innerHTML = '<h2 style="color: #FF0029">Failed to load data manifests</h2><p>Try reloading the page. \
	Contact juozasgaigalas@gmail.com for support.</p> <a href="https://github.com/juozasg/river-data-explorer/">Report bugs at GitHub</a>';
} else {
	appElement.innerHTML = '';
	// TODO fix the App type error on kitless setup when svelte 5 is released
	const app = mount(App as any, { target: appElement, props: { dataManifest, variablesMetadata } })
}

export default {}