import type { MarkdownComponent, ImportGlobRecord, MarkdownPage } from '$src/types/page';

export const getMarkdownPages = async (allMdPages: ImportGlobRecord): Promise<MarkdownPage[]> => {
	const allPages = await Promise.all(
		Object.entries(allMdPages).map(async ([modulePath, resolver]) => {
			const { metadata }: MarkdownComponent = await resolver();

			return {
				metadata,
				slug: basename(modulePath, '.md')
			};
		})
	);

	return allPages;
};

export const basename = (path: string, ext?: string): string => {
	const f = path.split('/').pop() as string;
	return ext ? f.slice(0, -ext.length) : f;
}


export function partition(array: any[], filter: (e: any, i: number, arr: any[]) => any) {
  const pass: any[] = []
	const fail: any[] = [];
  array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
  return [pass, fail];
}
