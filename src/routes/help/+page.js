export async function load() {
	const page = await import('./help.md');

	return {
		Content: page.default,
		metadata: page.metadata,
	};
}