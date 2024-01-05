import { getMarkdownPages } from '$lib/utils';
import { json } from '@sveltejs/kit';

export const prerender = true;

export const GET = async () => {
	const pages = await getMarkdownPages(import.meta.glob('/src/routes/regions/*.md'));
	return json(pages);
};
