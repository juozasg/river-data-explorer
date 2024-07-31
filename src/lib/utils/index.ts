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



const shortMon = (date: Date): string => date.toLocaleString('default', { month: 'short' });
// const short = (date: Date): string => date.toLocaleString('default', { month: 'short' });
export function fmtDate(date: Date | undefined): string {
	if (!date) return 'N/A';
	return `${shortMon(date)} ${date.getDate()}, ${date.getFullYear()}`;
}

export function oneMonthAgo() {
  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = oneDay * 30;
  return (Date.now() - oneMonth);
}