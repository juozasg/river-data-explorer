import Navigo from 'navigo';
import { mount } from 'svelte'
import App from './App.svelte'

import { loadAppManifests } from './lib/loadAppManifests';

async function logVersion() {
	try {
		const r = await fetch('/data/versions.txt');
		const version = await r.text();
		console.log('RIVER DATA EXPLORER VERSION');
		console.log(version);
	} catch (e) {
		console.error('Failed to load version', e);
	}
}

const initApp = async () => {
	logVersion();
	const appElement = document.getElementById('app')!;
	mount(App, { target: appElement, props: {  } });
}

initApp();

export default {}