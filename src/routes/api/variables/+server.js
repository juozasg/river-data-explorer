import { getMarkdownPages } from '$lib/utils';
import { json } from '@sveltejs/kit';

export const prerender = true;

export const GET = async () => {
	// TODO: build this from variables.yaml
	const pages = await getMarkdownPages(import.meta.glob('/src/routes/variables/*.md'));
	return json(pages);
};
