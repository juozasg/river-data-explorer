import type { MarkdownComponent } from "$src/lib/types/page";
import { getMarkdownPages } from "$src/lib/utils";
import type { EntryGenerator } from './$types';


export async function load({params}) {
	const page: MarkdownComponent = await import(`../${params.slug}.md`);

	return {
		Content: page.default,
		metadata: page.metadata,
	};
}

// required for SSG pre-rendering
export const entries: EntryGenerator = async () => {
	const mdPages = await getMarkdownPages(import.meta.glob('/src/routes/variables/*.md'));

	return mdPages.map(({ slug }) => ({ slug }));
};
