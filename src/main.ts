import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'

export const test = async () =>  {
	const r = await fetch('http://localhost:8080/a1');
	console.log('r', r);
	const j = await r.text();
	// const j = await r.json();
	console.log('j', j);

	return j;
}

const t = await test();

// TODO fix the App type error on kitless setup when svelte 5 is released
const app = mount(App as any, { target: document.getElementById('app')!, props: {d: t }})

export default {}