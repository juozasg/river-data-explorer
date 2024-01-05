import { getMarkdownPages } from '$lib/utils';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const pages = await getMarkdownPages(import.meta.glob('/src/routes/variables/*.md'));
	return json(pages);
};
