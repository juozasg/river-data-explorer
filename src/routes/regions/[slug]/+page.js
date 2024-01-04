// export const load = async () => await loadMarkdownContent('/src/routes/about/about.md');
export async function load({params}) {
	const page = await import(`../${params.slug}.md`);

	return {
		Content: page.default,
		metadata: page.metadata,
	};
}