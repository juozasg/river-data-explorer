import path from 'path';

import type { MarkdownComponent, ImportGlobRecord, MarkdownPage } from '$lib/types/page';

export const getMarkdownPages = async (allMdPages: ImportGlobRecord): Promise<MarkdownPage[]> => {
	const allPages = await Promise.all(
		Object.entries(allMdPages).map(async ([modulePath, resolver]) => {
			const { metadata }: MarkdownComponent = await resolver();

			return {
				metadata,
				slug: path.basename(modulePath, '.md') as string
			};
		})
	);

	return allPages;
};