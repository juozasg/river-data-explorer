import type { MarkdownComponent } from "$src/types/page";

export async function load({params}) {
	const page: MarkdownComponent = await import(`../${params.slug}.md`);

	return {
		Content: page.default,
		metadata: page.metadata,
	};
}

/*
// no longer required for SSG pre-rendering
// since +layout.ts now loads the list of markdown pages
// and Navbar renders links to each markdown page
import { getMarkdownPages } from "$src/lib/utils";
import type { EntryGenerator } from "./$types";

export const entries: EntryGenerator = async () => {
	const mdPages = await getMarkdownPages(import.meta.glob('/src/routes/regions/*.md'));

	return mdPages.map(({ slug }) => ({ slug }));
};
*/