export async function load() {
	const page = await import('./about.md');

	return {
		content: page.default,
		metadata: page.metadata,
	};
}