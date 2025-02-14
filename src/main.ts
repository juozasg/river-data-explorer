import Navigo from 'navigo';
import { mount } from 'svelte'
import App from './App.svelte'

import { loadManifests } from './lib/loadAppManifests';


async function logVersion() {
	try {
		const r = await fetch('/data/versions.txt');
		const version = await r.text();
		console.log('RIVER DATA EXPLORER VERSION')
		console.log(version);
	} catch (e) {
		console.error('Failed to load version', e);
	}
}

const initApp = async () => {
	logVersion();
	const appElement = document.getElementById('app')!;

	try {
		const { dataManifest, variablesMetadata } = await loadManifests();

		appElement.innerHTML = '';
		// TODO fix the App type error on kitless setup when svelte 5 is released
		const app = mount(App, { target: appElement, props: { dataManifest, variablesMetadata } })
	} catch (e) {
		console.error('Failed to load app', e);
		appElement.innerHTML = '<h2 style="color: #FF0029">Failed to load data manifests</h2><p>Try reloading the page. Contact juozasgaigalas@gmail.com for support.</p> <a href="https://github.com/juozasg/river-data-explorer/">Report bugs at GitHub</a>';
	}
}

initApp();

export default {}