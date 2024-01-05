import type { MarkdownComponent } from "$src/lib/types/page";

export async function load({params}) {
	const page: MarkdownComponent = await import(`../${params.slug}.md`);

	return {
		Content: page.default,
		metadata: page.metadata,
	};
}