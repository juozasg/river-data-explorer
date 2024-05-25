import { loadAppData } from '$src/appstate/load.js';

export const prerender = true;
export const trailingSlash = 'always';
// export const ssr = false;


export const load = async ({ fetch }) => {
	let response = await fetch(`/api/variables`);
	const variablePages = await response.json();

	response = await fetch(`/api/regions`);
	const regionPages = await response.json();

	loadAppData();

	return {
		variablePages,
		regionPages
	};
};