import path from 'path';

import type { MarkdownComponent, ImportGlobRecord } from '$lib/types/page';

export const getMarkdownPages = async (allMdPages: ImportGlobRecord) => {
	const allPages = await Promise.all(
		Object.entries(allMdPages).map(async ([modulePath, resolver]) => {
			const { metadata }: MarkdownComponent = await resolver();

			return {
				metadata,
				path: path.basename(modulePath, '.md')
			};
		})
	);

	return allPages;
};