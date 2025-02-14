import Navigo from 'navigo';
import { mount } from 'svelte'
import App from './App.svelte'
import TestApp from './components/test-pages/TestApp.svelte';

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

logVersion();

const appElement = document.getElementById('app')!;

new Navigo("/")
	.on("/test/:name", function (match: any) {
		mount(TestApp, { target: appElement, props: { testName: match.data.name } });
	})
	.on("/test", function () {
		mount(TestApp, { target: appElement, props: {} });
	})
	.on("*", function () {
		mount(App, { target: appElement, props: {} });
	})
	.resolve();


export default {}