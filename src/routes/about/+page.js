export async function load() {
	const page = await import('./about.md');

	return {
		Content: page.default,
		metadata: page.metadata,
	};
}